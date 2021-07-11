package com.kos.language;

import java.util.ArrayList;
import java.util.List;

import com.kos.language.Expr.Assign;
import com.kos.language.Expr.Binary;
import com.kos.language.Expr.Call;
import com.kos.language.Expr.Grouping;
import com.kos.language.Expr.Literal;
import com.kos.language.Expr.Logical;
import com.kos.language.Expr.Unary;
import com.kos.language.Expr.Variable;
import com.kos.language.Stmt.Block;
import com.kos.language.Stmt.Break;
import com.kos.language.Stmt.Condition;
import com.kos.language.Stmt.Continue;
import com.kos.language.Stmt.Expression;
import com.kos.language.Stmt.Function;
import com.kos.language.Stmt.Print;
import com.kos.language.Stmt.Return;
import com.kos.language.Stmt.Var;
import com.kos.language.Stmt.While;

public class Interpreter implements Expr.Visitor<Object>, Stmt.Visitor<Void> {
    final Environment globals = new Environment();
    private Environment environment = globals;

    Interpreter() {
        globals.define("clock", new LoxCallable(){
            @Override
            public int arity() {
                return 0;
            }

            @Override
            public Object call(Interpreter interpreter, List<Object> arguments) {
                return (double) System.currentTimeMillis() / 1000.0;
            }

            @Override
            public String toString() {
                return "<native fn>";
            }
        });
    }

    void interpret(List<Stmt> statements) {
        try {
            for (Stmt statement : statements) {
                execute(statement);
            }
        } catch (RuntimeError error) {
            Lox.runtimeError(error);
        }
    }

    void execute(Stmt statement) {
        statement.accept(this);
    }

    private String stringify(Object object) {
        if (object == null) { return "nil"; }

        if (object instanceof Double) {
            String text = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length() - 2);
            }
            return text;
        }

        return object.toString();
    }

    @Override
    public Object visitBinaryExpr(Binary expr) {
        Object left = evaluate(expr.left);
        Object right = evaluate(expr.right);

        switch (expr.operator.type) {
            case MINUS:
                checkNumberOperands(expr.operator, left, right);
                return (double)left - (double)right;
            case SLASH:
                checkNumberOperands(expr.operator, left, right);
                return (double)left / (double)right;
            case STAR:
                checkNumberOperands(expr.operator, left, right);
                return (double)left * (double)right;
            case PLUS:
                if (left instanceof Double && right instanceof Double) {
                    return (double)left + (double)right;
                }

                if (left instanceof String && right instanceof String) {
                    return (String)left + (String)right;
                }

                throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
            case GREATER:
                checkNumberOperands(expr.operator, left, right);
                return (double)left > (double)right;
            case GREATER_EQUAL:
                checkNumberOperands(expr.operator, left, right);
                return (double)left >= (double)right;
            case LESS:
                checkNumberOperands(expr.operator, left, right);
                return (double)left < (double)right;
            case LESS_EQUAL:
                checkNumberOperands(expr.operator, left, right);
                return (double)left <= (double)right;
            case BANG_EQUAL:
                return !isEqual(left, right);
            case EQUAL:
                return isEqual(left, right);
            default:
                break;
        }

        return null;
    }

    private boolean isEqual(Object left, Object right) {
        if (left == null && right == null) return true;
        if (left == null) return false;

        return left.equals(right);
    }

    @Override
    public Object visitGroupingExpr(Grouping expr) {
        return evaluate(expr.expressions);
    }

    private Object evaluate(Expr expr) {
        return expr.accept(this);
    }

    @Override
    public Object visitLiteralExpr(Literal expr) {
        return expr.value;
    }

    @Override
    public Object visitUnaryExpr(Unary expr) {
        Object right = evaluate(expr.right);

        switch (expr.operator.type) {
            case MINUS:
                checkNumberOperand(expr.operator, right);
                return - (double) right;
            case BANG:
                return !isTruthy(right);
            default:
                break;
        }

        return null;
    }

    private void checkNumberOperand(Token operator, Object operand) {
        if (operand instanceof Double) return;
        throw new RuntimeError(operator, "Operand must be a number");
    }

    private void checkNumberOperands(Token operator, Object left, Object right) {
        if (left instanceof Double && right instanceof Double) return;
        throw new RuntimeError(operator, "Operands must be numbers");
    }

    private boolean isTruthy(Object value) {
        if (value == null) return false;
        if (value instanceof Boolean) return (boolean)value;
        return true;
    }

    @Override
    public Void visitExpressionStmt(Expression stmt) {
        evaluate(stmt.expression);
        return null;
    }

    @Override
    public Void visitPrintStmt(Print stmt) {
        Object value = evaluate(stmt.expression);
        System.out.println(stringify(value));
        return null;
    }

    @Override
    public Void visitVarStmt(Var stmt) {
        Object value = null;
        if (stmt.initializer != null) {
            value = evaluate(stmt.initializer);
        }
        environment.define(stmt.name.lexeme, value);
        return null;
    }

    @Override
    public Object visitVariableExpr(Variable expr) {
        return environment.get(expr.name);
    }

    @Override
    public Object visitAssignExpr(Assign expr) {
        Object value = evaluate(expr.value);
        environment.assign(expr.name, value);
        return value;
    }

    @Override
    public Void visitBlockStmt(Block stmt) {
        executeBlock(stmt.statements, new Environment(environment));
        return null;
    }

    void executeBlock(List<Stmt> statements, Environment environment) {
        Environment previous = this.environment;

        try {
            this.environment = environment;
            for (Stmt statement : statements) {
                execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    }

    @Override
    public Void visitConditionStmt(Condition stmt) {
        boolean condition = isTruthy(evaluate(stmt.condition));
        if (condition) {
            execute(stmt.thenBranch);
        } else {
            if (stmt.elseBranch != null) {
                execute(stmt.elseBranch);
            }
        }
        return null;
    }

    @Override
    public Object visitLogicalExpr(Logical expr) {
        Object left = evaluate(expr.left);

        if (expr.operator.type == TokenType.OR) {
            if (isTruthy(left)) { return left; }
        } else {
            if (!isTruthy(left)) return left;
        }

        return evaluate(expr.right);
    }

    @Override
    public Void visitWhileStmt(While stmt) {
        while (isTruthy(evaluate(stmt.condition))) {
            try {
                execute(stmt.body);
            } catch (RuntimeException e) {
                if (e == BREAK_EXCEPTION) {
                    break;
                }
                else if (e == CONTINUE_EXCEPTION) {
                    continue;
                }
            }
        }
        return null;
    }

    static final RuntimeException BREAK_EXCEPTION = new RuntimeException("break");
    static final RuntimeException CONTINUE_EXCEPTION = new RuntimeException("continue");

    @Override
    public Void visitBreakStmt(Break stmt) {
        throw BREAK_EXCEPTION;
    }

    @Override
    public Void visitContinueStmt(Continue stmt) {
        throw CONTINUE_EXCEPTION;
    }

    @Override
    public Object visitCallExpr(Call expr) {
        Object callee = evaluate(expr.callee);

        if (!(callee instanceof LoxCallable)) {
            throw new RuntimeError(expr.paren, "Can only call functions and classes");
        }

        LoxCallable callable = (LoxCallable) callee;

        if (callable.arity() != expr.arguments.size()) {
            throw new RuntimeError(expr.paren, "Expected " + callable.arity() + " arguments but got " + expr.arguments.size() + ".");
        }

        List<Object> arguments = new ArrayList<>();
        for (Expr argument: expr.arguments) {
            arguments.add(evaluate(argument));
        }

        return callable.call(this, arguments);
    }

    @Override
    public Void visitFunctionStmt(Function stmt) {
        LoxFunction function = new LoxFunction(stmt);
        environment.define(stmt.name.lexeme, function);
        return null;
    }

    @Override
    public Void visitReturnStmt(Return stmt) {
        Object value = null;

        if (stmt.value != null) {
            value = evaluate(stmt.value);
        }
        throw new ReturnException(value);
    }
}
