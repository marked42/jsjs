// Generated from IDToken.g4 by ANTLR 4.9.2
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link IDTokenParser}.
 */
public interface IDTokenListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link IDTokenParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterExpr(IDTokenParser.ExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link IDTokenParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitExpr(IDTokenParser.ExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link IDTokenParser#template}.
	 * @param ctx the parse tree
	 */
	void enterTemplate(IDTokenParser.TemplateContext ctx);
	/**
	 * Exit a parse tree produced by {@link IDTokenParser#template}.
	 * @param ctx the parse tree
	 */
	void exitTemplate(IDTokenParser.TemplateContext ctx);
	/**
	 * Enter a parse tree produced by {@link IDTokenParser#variable}.
	 * @param ctx the parse tree
	 */
	void enterVariable(IDTokenParser.VariableContext ctx);
	/**
	 * Exit a parse tree produced by {@link IDTokenParser#variable}.
	 * @param ctx the parse tree
	 */
	void exitVariable(IDTokenParser.VariableContext ctx);
	/**
	 * Enter a parse tree produced by {@link IDTokenParser#idExpr}.
	 * @param ctx the parse tree
	 */
	void enterIdExpr(IDTokenParser.IdExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link IDTokenParser#idExpr}.
	 * @param ctx the parse tree
	 */
	void exitIdExpr(IDTokenParser.IdExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link IDTokenParser#memberExpr}.
	 * @param ctx the parse tree
	 */
	void enterMemberExpr(IDTokenParser.MemberExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link IDTokenParser#memberExpr}.
	 * @param ctx the parse tree
	 */
	void exitMemberExpr(IDTokenParser.MemberExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link IDTokenParser#identifier}.
	 * @param ctx the parse tree
	 */
	void enterIdentifier(IDTokenParser.IdentifierContext ctx);
	/**
	 * Exit a parse tree produced by {@link IDTokenParser#identifier}.
	 * @param ctx the parse tree
	 */
	void exitIdentifier(IDTokenParser.IdentifierContext ctx);
	/**
	 * Enter a parse tree produced by {@link IDTokenParser#property}.
	 * @param ctx the parse tree
	 */
	void enterProperty(IDTokenParser.PropertyContext ctx);
	/**
	 * Exit a parse tree produced by {@link IDTokenParser#property}.
	 * @param ctx the parse tree
	 */
	void exitProperty(IDTokenParser.PropertyContext ctx);
}