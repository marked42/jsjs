package com.kos.language;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.kos.language.TokenType.*;

public class Parser {
    private final List<Token> tokens;
    private int current = 0;

    Parser(List<Token> tokens) {
        this.tokens = tokens;
    }

    /**
     * expression     → assignment ;
     * assignment     → IDENTIFIER "=" assignment | logic_or ;
     * logic_or       → logic_and ( "or" logic_and )* ;
     * logic_and      → equality ( "and" equality )* ;
     * equality       → comparison ( ( "!=" | "==" ) comparison )* ;
     * comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
     * term           → factor ( ( "-" | "+" ) factor )* ;
     * factor         → unary ( ( "/" | "*" ) unary )* ;
     * unary          → ( "!" | "-" ) unary | primary ;
     * primary        → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" ;
     */
    private Expr expression() {
        return assignment();
    }

    private Expr or() {
        Expr left = and();

        while (match(TokenType.OR)) {
            Token operator = previous();
            Expr right = and();
            left = new Expr.Logical(left, operator, right);
        }

        return left;
    }

    private Expr and() {
        Expr left = equality();

        while (match(TokenType.AND)) {
            Token operator = previous();
            Expr right = equality();
            left = new Expr.Logical(left, operator, right);
        }

        return left;
    }

    private Expr assignment() {
        Expr expr = or();

        if (match(EQUAL)) {
            Token equals = previous();
            Expr value = assignment();

            if (expr instanceof Expr.Variable) {
                Token name = ((Expr.Variable)expr).name;
                return new Expr.Assign(name, value);
            } else if (expr instanceof Expr.Get) {
                Expr.Get get = (Expr.Get)expr;
                return new Expr.Set(get.object, get.name, value);
            }

            error(equals, "Invalid assignment target.");
        }

        return expr;
    }

    List<Stmt> parse() {
        try {
            List<Stmt> statements = new ArrayList<>();
            while (!isAtEnd()) {
                statements.add(declaration());
            }
            return statements;
        } catch (ParseError error) {
            return null;
        }
    }

    /**
     * statement    → exprStmt
     *              | ifStmt
     *              | printStmt
     *              | whileStmt
     *              | returnStmt
     *              | block ;
     * whileStmt    → "while" "(" expression ")" statement ;
     */
    private Stmt statement() {
        if (match(PRINT)) return printStatement();
        if (match(LEFT_BRACE)) return new Stmt.Block(block());
        if (match(IF)) return ifStatement();
        if (match(WHILE)) return whileStatement();
        if (match(FOR)) return forStatement();
        if (match(BREAK)) return breakStatement();
        if (match(CONTINUE)) return continueStatement();
        if (match(RETURN)) return returnStatement();
        if (match(CLASS)) return classDeclaration();

        return expressionStatement();
    }

    private Stmt.Class classDeclaration() {
        Token name = consume(IDENTIFIER, "Expect class name");

        List<Stmt.Function> methods = new ArrayList<>();
        consume(LEFT_BRACE, "Expect '{' after class name");
        while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
            methods.add(function("method"));
        }

        consume(RIGHT_BRACE, "Expect '}' after class body");

        return new Stmt.Class(name, methods);
    }

    private Stmt.Return returnStatement() {
        Expr value = null;
        Token keyword = previous();
        if (!check(SEMICOLON)) {
            value = expression();
        }

        consume(SEMICOLON, "Expect ';' after at the end of return statement;");
        return new Stmt.Return(keyword, value);
    }

    /**
     * breakStatement通过抛出异常实现
     */
    private Stmt breakStatement() {
        consume(SEMICOLON, "Expect ';' after break.");
        return new Stmt.Break();
    }

    /**
     * continueStatement 通过抛出异常实现的话需要 forStatement 有专门的类型定义，而不是转换成while的语法糖
     */
    private Stmt continueStatement() {
        consume(SEMICOLON, "Expect ';' after continue.");
        return new Stmt.Continue();
    }

    private Stmt forStatement() {
        consume(LEFT_PAREN, "Expect '(' after for.");

        Stmt initializer;
        if (match(SEMICOLON)) {
            initializer = null;
        } else if (match(VAR)) {
            initializer = varDeclaration();
        } else {
            initializer = expressionStatement();
        }

        Expr condition;
        if (match(SEMICOLON)) {
            condition = null;
        } else {
            condition = expression();
        }
        consume(SEMICOLON, "Expect ';' after for condition.");

        Expr increment;
        if (match(RIGHT_PAREN)) {
            increment = null;
        } else {
            increment = expression();
        }
        consume(RIGHT_PAREN, "Expect ')' after for increment.");

        Stmt body = statement();

        // execute increment after for body
        body = new Stmt.Block(Arrays.asList(body, new Stmt.Expression(increment)));

        condition = condition == null ? new Expr.Literal(true) : condition;

        // transform for to while loop with proper condition
        body = new Stmt.While(condition, body);

        if (initializer != null) {
            body = new Stmt.Block(Arrays.asList( initializer, body));
        }

        return body;
    }

    private Stmt whileStatement() {
        consume(LEFT_PAREN, "Expect '(' after while.");
        Expr condition = expression();
        consume(RIGHT_PAREN, "Expect ')' after while condition");
        Stmt body = statement();

        return new Stmt.While(condition, body);
    }

    private Stmt.Condition ifStatement() {
        consume(LEFT_PAREN, "Expect '(' after if.");
        Expr condition = expression();
        consume(RIGHT_PAREN, "Expect ')' after if condition.");
        Stmt thenBranch = statement();
        Stmt elseBranch = null;
        if (match(ELSE)) {
            elseBranch = statement();
        }

        return new Stmt.Condition(condition, thenBranch, elseBranch);
    }

    private List<Stmt> block() {
        List<Stmt> statements = new ArrayList<>();

        while (!check(RIGHT_BRACE) && !isAtEnd()) {
            statements.add(declaration());
        }

        consume(RIGHT_BRACE, "Expect '}' after block");
        return statements;
    }

    /**
     *
     * declaration    → funDecl | varDecl | statement ;
     * funDecl        → "fun" function ;
     * function       → IDENTIFIER "(" parameters? ")" block ;
     * parameters     → IDENTIFIER ( "," IDENTIFIER )* ;
     */
    private Stmt declaration() {
        try {
            if (match(VAR)) return varDeclaration();
            if (match(FUN)) return function("function");

            return statement();
        } catch (ParseError error) {
            synchronize();
            return null;
        }
    }

    private Stmt.Function function(String kind) {
        Token name = consume(TokenType.IDENTIFIER, "Expect " + kind + " name");
        consume(TokenType.LEFT_PAREN, "Expect '(' after " + kind + " name");

        List<Token> params = parameters();

        consume(LEFT_BRACE, "Expect '{' before " + kind + " body.");
        List<Stmt> body = block();

        return new Stmt.Function(name, params, body);
    }

    private void checkParametersLimit(int count) {
        if (count >= 255) {
            error(peek(), "Can't have more than 255 parameters.");
        }
    }

    private List<Token> parameters() {
        List<Token> params = new ArrayList<>();

        if (!match(RIGHT_PAREN)) {
            do {
                this.checkParametersLimit(params.size());

                params.add(consume(IDENTIFIER, "Expect parameter name."));
            } while (match(COMMA));
            consume(RIGHT_PAREN, "Expect ')' after parameters.");
        }

        return params;
    }

    private Stmt varDeclaration() {
        Token name = consume(IDENTIFIER, "Expect variable name");

        Expr initializer = null;
        if (match(EQUAL)) {
            initializer = expression();
        }

        consume(SEMICOLON, "Expect ';' after variable declaration.");
        return new Stmt.Var(name, initializer);
    }


    // TODO:
    private void synchronize() {

    }

    private Stmt.Print printStatement() {
        Expr expression = expression();
        consume(SEMICOLON, "Expect ';' after value.");
        return new Stmt.Print(expression);
    }

    private Stmt.Expression expressionStatement() {
        Expr expression = expression();
        consume(SEMICOLON, "Expect ';' after expression.");
        return new Stmt.Expression(expression);
    }

    private Expr equality() {
        Expr left = comparison();

        while (match(BANG_EQUAL, EQUAL_EQUAL)) {
            Token operator = previous();
            Expr right = comparison();
            left = new Expr.Binary(left, operator, right);
        }

        return left;
    }

    private boolean match(TokenType... types) {
        for (TokenType type: types) {
            if (check(type)) {
                advance();
                return true;
            }
        }

        return false;
    }

    private boolean check(TokenType type) {
        if (isAtEnd()) return false;
        return peek().type == type;
    }

    private boolean isAtEnd() {
        return peek().type == EOF;
    }

    private Token previous() {
        return tokens.get(current - 1);
    }

    private Token advance() {
        return this.tokens.get(current++);
    }

    private Token peek() {
        return tokens.get(current);
    }

    private Expr comparison() {
        Expr left = term();

        while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
            Token operator = previous();
            Expr right = term();
            left = new Expr.Binary(left, operator, right);
        }

        return left;
    }

    private Expr term() {
        Expr left = factor();

        while (match(MINUS, PLUS)) {
            Token operator = previous();
            Expr right = factor();
            left = new Expr.Binary(left, operator, right);
        }

        return left;
    }

    private Expr factor() {
        Expr left = unary();

        while (match(SLASH, STAR)) {
            Token operator = previous();
            Expr right = unary();
            left = new Expr.Binary(left, operator, right);
        }
        return left;
    }

    private Expr unary() {
        if (match(BANG, MINUS)) {
            Token operator = previous();
            Expr right = unary();
            return new Expr.Unary(operator, right);
        }

        return call();
    }

    /**
     * unary          → ( "!" | "-" ) unary | call ;
     * call           → primary ( "(" arguments? ")" | "." IDENTIFIER )* ;
     */
    private Expr call() {
        Expr expr = primary();

        while (true) {
            if (match(LEFT_PAREN)) {
                expr = finishCallExpr(expr);
            } else if (match(DOT)) {
                expr = finishGetExpr(expr);
            } else {
                break;
            }
        }

        return expr;
    }

    private Expr finishCallExpr(Expr expr) {
        List<Expr> arguments = new ArrayList<>();
        if (!check(RIGHT_PAREN)) {
            do {
                this.checkParametersLimit(arguments.size());

                arguments.add(expression());
            } while (match(COMMA));
        }
        Token paren = consume(RIGHT_PAREN, "Expect ')' after arguments.");

        return new Expr.Call(expr, paren, arguments);
    }

    private Expr finishGetExpr(Expr object) {
        Token name = consume(IDENTIFIER, "Expect an identifier.");

        return new Expr.Get(object, name);
    }

    private Expr primary() {
        if (match(FALSE)) return new Expr.Literal(false);
        if (match(TRUE)) return new Expr.Literal(true);
        if (match(NIL)) return new Expr.Literal(null);
        if (match(IDENTIFIER)) return new Expr.Variable(previous());

        if (match(NUMBER, STRING)) {
            return new Expr.Literal(previous().literal);
        }

        if (match(LEFT_PAREN)) {
            Expr expr = expression();
            consume(RIGHT_PAREN, "Expect ')' after expression.");
            return new Expr.Grouping(expr);
        }

        throw new Error("expect expression");
    }

    Token consume(TokenType type, String message) {
        if (check(type)) {
            return advance();
        }

        throw error(peek(), message);
    }

    static ParseError error(Token token, String message) {
        Lox.error(token, message);
        return new ParseError();
    }

    private static class ParseError extends RuntimeException {
    }
}
