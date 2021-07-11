package com.kos.language;

public class LoxInstance {
    private final LoxClass klass;

    public LoxInstance(LoxClass klass) {
        this.klass = klass;
    }

    @Override
    public String toString() {
        return "Class " + klass.name + " instance";
    }
}
