
import tools.ExprParser;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;

class Calc {
  public static void main(String[] args) {
    // create a CharStream that reads from standard input
    ANTLRInputStream input = new ANTLRInputStream(System.in); // create a lexer that feeds off of input CharStream
    ArrayInitLexer lexer = new ArrayInitLexer(input); // create a buffer of tokens pulled from the lexer
    CommonTokenStream tokens = new CommonTokenStream(lexer); // create a parser that feeds off the tokens buffer
    ArrayInitParser parser = new ArrayInitParser(tokens);
    ParseTree tree = parser.init(); // begin parsing at init rule
    System.out.println(tree.toStringTree(parser)); // print LISP-style tree

    BufferedReader br = new BufferedReader(new InputStreamReader(is));
    String expr = br.readLine(); // get first expression
    int line = 1;

    ExprParser parser = new ExprParser(null);
    parser.setBuildParseTree(false);
  }
}
