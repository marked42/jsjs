package com.kos.language;

import com.kos.language.Expr.Assign;
import com.kos.language.Expr.Binary;
import com.kos.language.Expr.Grouping;
import com.kos.language.Expr.Literal;
import com.kos.language.Expr.Unary;
import com.kos.language.Expr.Variable;

public class AstPrinter implements Expr.Visitor<String> {
    String print(Expr expr) {
        return expr.accept(this);
    }

    @Override
    public String visitBinaryExpr(Binary expr) {
        return parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    private String parenthesize(String name, Expr... exprs) {
        StringBuilder builder = new StringBuilder();

        builder.append("(").append(name);
        for (Expr expr : exprs) {
            builder.append(" ");
            builder.append(expr.accept(this));
        }
        builder.append(")");

        return builder.toString();
    }

    @Override
    public String visitGroupingExpr(Grouping expr) {
        return parenthesize("group", expr.expressions);
    }

    @Override
    public String visitLiteralExpr(Literal expr) {
        return expr.value == null ? "nil" : expr.value.toString();
    }

    @Override
    public String visitUnaryExpr(Unary expr) {
        return parenthesize(expr.operator.lexeme, expr.right);
    }

    public static void main(String[] args) {
        Expr expression = new Expr.Binary(
            new Expr.Unary(new Token(TokenType.MINUS, "-", null, 1), new Expr.Literal(123)),
            new Token(TokenType.STAR, "*", null, 1),
            new Expr.Grouping(new Expr.Literal(45.67))
        );

        System.out.println(new AstPrinter().print(expression));
    }

    @Override
    public String visitVariableExpr(Variable expr) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String visitAssignExpr(Assign expr) {
        // TODO Auto-generated method stub
        return null;
    }
}
