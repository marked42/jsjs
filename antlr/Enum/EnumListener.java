// Generated from Enum.g4 by ANTLR 4.9.2
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link EnumParser}.
 */
public interface EnumListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link EnumParser#prog}.
	 * @param ctx the parse tree
	 */
	void enterProg(EnumParser.ProgContext ctx);
	/**
	 * Exit a parse tree produced by {@link EnumParser#prog}.
	 * @param ctx the parse tree
	 */
	void exitProg(EnumParser.ProgContext ctx);
	/**
	 * Enter a parse tree produced by {@link EnumParser#stat}.
	 * @param ctx the parse tree
	 */
	void enterStat(EnumParser.StatContext ctx);
	/**
	 * Exit a parse tree produced by {@link EnumParser#stat}.
	 * @param ctx the parse tree
	 */
	void exitStat(EnumParser.StatContext ctx);
	/**
	 * Enter a parse tree produced by {@link EnumParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterExpr(EnumParser.ExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link EnumParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitExpr(EnumParser.ExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link EnumParser#enumDecl}.
	 * @param ctx the parse tree
	 */
	void enterEnumDecl(EnumParser.EnumDeclContext ctx);
	/**
	 * Exit a parse tree produced by {@link EnumParser#enumDecl}.
	 * @param ctx the parse tree
	 */
	void exitEnumDecl(EnumParser.EnumDeclContext ctx);
	/**
	 * Enter a parse tree produced by {@link EnumParser#id}.
	 * @param ctx the parse tree
	 */
	void enterId(EnumParser.IdContext ctx);
	/**
	 * Exit a parse tree produced by {@link EnumParser#id}.
	 * @param ctx the parse tree
	 */
	void exitId(EnumParser.IdContext ctx);
}