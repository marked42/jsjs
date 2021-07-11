package com.kos.language;

import java.util.List;

public class LoxFunction implements LoxCallable {
    private final Stmt.Function declaration;
    private final Environment closure;

    LoxFunction(Stmt.Function declaration, Environment environment) {
        this.declaration = declaration;
        this.closure = environment;
    }

    @Override
    public int arity() {
        return declaration.params.size();
    }

    @Override
    public Object call(Interpreter interpreter, List<Object> arguments) {
        // 使用当前Environment
        Environment environment = new Environment(closure);
        for (int i = 0; i < declaration.params.size(); i++) {
            Token name = declaration.params.get(i);
            environment.define(name.lexeme, arguments.get(i));
        }

        try {
            interpreter.executeBlock(declaration.body, environment);
        } catch (ReturnException e) {
            return e.value;
        }

        return null;
    }

    @Override
    public String toString() {
        return "<fn" + declaration.name.lexeme + ">";
    }


    LoxFunction bind(LoxInstance instance) {
        Environment environment = new Environment(closure);
        environment.define("this", instance);
        return new LoxFunction(declaration, environment);
    }
}
