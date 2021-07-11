package com.kos.language;

import java.util.List;

public class LoxFunction implements LoxCallable {
    private final Stmt.Function declaration;

    LoxFunction(Stmt.Function declaration) {
        this.declaration = declaration;
    }

    @Override
    public int arity() {
        return declaration.params.size();
    }

    @Override
    public Object call(Interpreter interpreter, List<Object> arguments) {
        // 使用当前Environment
        Environment environment = new Environment(interpreter.globals);
        for (int i = 0; i < declaration.params.size(); i++) {
            Token name = declaration.params.get(i);
            environment.define(name.lexeme, arguments.get(i));
        }

        interpreter.executeBlock(declaration.body, environment);

        return null;
    }

    @Override
    public String toString() {
        return "<fn" + declaration.name.lexeme + ">";
    }
}