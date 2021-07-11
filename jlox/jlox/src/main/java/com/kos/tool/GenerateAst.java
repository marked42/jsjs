package com.kos.tool;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

public class GenerateAst {
    public static void main(String[] args) throws IOException {
        if (args.length != 1) {
            System.err.println("Usage: generate_ast <output directory>");
            System.exit(64);
        }
        String outputDir = args[0];

        defineAst((outputDir), "Expr", Arrays.asList(
            "Binary     : Expr left, Token operator, Expr right",
            "Grouping   : Expr expressions",
            "Literal    : Object value",
            "Unary      : Token operator, Expr right",
            "Variable   : Token name",
            "Assign     : Token name, Expr value",
            "Logical    : Expr left, Token operator, Expr right",
            "Call       : Expr callee, Token paren, List<Expr> arguments"
        ));

        defineAst(outputDir, "Stmt", Arrays.asList(
            "Expression : Expr expression",
            "Print      : Expr expression",
            "Var        : Token name, Expr initializer",
            "Block      : List<Stmt> statements",
            "Condition  : Expr condition, Stmt thenBranch, Stmt elseBranch",
            "While      : Expr condition, Stmt body",
            "Break      : ",
            "Continue   : ",
            "Function   : Token name, List<Token> params, List<Stmt> body",
            "Return     : Token keyword, Expr value",
            "Class      : Token name, List<Stmt.Function> methods"
        ));
    }

    static void defineAst(String outputDir, String baseName, List<String> types) throws IOException {
        String path = outputDir + "/" + baseName + ".java";
        PrintWriter writer = new PrintWriter(path, "UTF-8");

        writer.println("package com.kos.language;");
        writer.println();
        writer.println("import java.util.List;");
        writer.println();
        writer.println("abstract class " + baseName + " {");

        for (String type : types) {
            String className = type.split(":")[0].trim();
            String fields = type.split(":")[1].trim();
            defineType(writer, baseName, className, fields);
        }

        defineVisitor(writer, baseName, types);

        writer.println("}");
        writer.println();
        writer.close();
    }

    static void defineType(PrintWriter writer, String baseName, String className, String fieldString) {
        writer.println("    static class " + className + " extends " + baseName + " {");

        writer.println("        " + className + "(" + fieldString + ") {");
        String[] fields = fieldString.split(", ");
        if (!fieldString.equals("")) {
            for (String field: fields) {
                String name = field.split(" ")[1];
                writer.println("            this." + name + " = " + name + ";");
            }
        }
        writer.println("        }");

        // Visitor pattern.
        writer.println();
        writer.println("        @Override");
        writer.println("        <R> R accept(Visitor<R> visitor) {");
        writer.println("            return visitor.visit" +
            className + baseName + "(this);");
        writer.println("        }");

        // Fields
        writer.println();

        if (!fieldString.equals("")) {
            for (String field: fields) {
                writer.println("        final " + field + ";");
            }
        }
        writer.println("    }");
        writer.println();
    }

    static void defineVisitor(PrintWriter writer, String baseName, List<String> types){
        writer.println("    interface Visitor<R> {");

        for (String type: types) {
            String typeName = type.split(":")[0].trim();
            writer.println("        R visit" + typeName + baseName + "(" + typeName + " " + baseName.toLowerCase() + ");");
        }
        writer.println("    }");

        writer.println();
        writer.println("    abstract <R> R accept(Visitor<R> visitor);");
    }
}
