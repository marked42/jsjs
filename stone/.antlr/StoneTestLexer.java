// Generated from /Users/penghui/coding/jsjs/stone/StoneTest.g4 by ANTLR 4.8
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class StoneTestLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.8", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		Number=1, Identifier=2, Whitespace=3, Punctuator=4, String=5;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"Number", "Identifier", "ID_Start", "ID_Continue", "Whitespace", "Punctuator", 
			"String", "EscapeSequence", "NonEscapeSequence"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "Number", "Identifier", "Whitespace", "Punctuator", "String"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}


	public StoneTestLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "StoneTest.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\7O\b\1\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\3\2\3\2"+
		"\3\2\6\2\31\n\2\r\2\16\2\32\5\2\35\n\2\3\3\3\3\7\3!\n\3\f\3\16\3$\13\3"+
		"\3\4\3\4\3\5\3\5\3\6\6\6+\n\6\r\6\16\6,\3\6\3\6\3\7\3\7\3\7\3\7\3\7\3"+
		"\7\3\7\3\7\3\7\3\7\3\7\5\7<\n\7\3\b\3\b\3\b\7\bA\n\b\f\b\16\bD\13\b\3"+
		"\b\3\b\3\t\3\t\3\n\7\nK\n\n\f\n\16\nN\13\n\2\2\13\3\3\5\4\7\2\t\2\13\5"+
		"\r\6\17\7\21\2\23\2\3\2\b\3\2\63;\3\2\62;\5\2C\\aac|\6\2\62;C\\aac|\5"+
		"\2\13\f\17\17\"\"\6\2\f\f\17\17$$^^\2V\2\3\3\2\2\2\2\5\3\2\2\2\2\13\3"+
		"\2\2\2\2\r\3\2\2\2\2\17\3\2\2\2\3\34\3\2\2\2\5\36\3\2\2\2\7%\3\2\2\2\t"+
		"\'\3\2\2\2\13*\3\2\2\2\r;\3\2\2\2\17=\3\2\2\2\21G\3\2\2\2\23L\3\2\2\2"+
		"\25\35\7\62\2\2\26\30\t\2\2\2\27\31\t\3\2\2\30\27\3\2\2\2\31\32\3\2\2"+
		"\2\32\30\3\2\2\2\32\33\3\2\2\2\33\35\3\2\2\2\34\25\3\2\2\2\34\26\3\2\2"+
		"\2\35\4\3\2\2\2\36\"\5\7\4\2\37!\5\t\5\2 \37\3\2\2\2!$\3\2\2\2\" \3\2"+
		"\2\2\"#\3\2\2\2#\6\3\2\2\2$\"\3\2\2\2%&\t\4\2\2&\b\3\2\2\2\'(\t\5\2\2"+
		"(\n\3\2\2\2)+\t\6\2\2*)\3\2\2\2+,\3\2\2\2,*\3\2\2\2,-\3\2\2\2-.\3\2\2"+
		"\2./\b\6\2\2/\f\3\2\2\2\60<\7,\2\2\61\62\7?\2\2\62<\7?\2\2\63\64\7>\2"+
		"\2\64<\7?\2\2\65\66\7@\2\2\66<\7?\2\2\678\7(\2\28<\7(\2\29:\7~\2\2:<\7"+
		"~\2\2;\60\3\2\2\2;\61\3\2\2\2;\63\3\2\2\2;\65\3\2\2\2;\67\3\2\2\2;9\3"+
		"\2\2\2<\16\3\2\2\2=B\7$\2\2>A\5\21\t\2?A\5\23\n\2@>\3\2\2\2@?\3\2\2\2"+
		"AD\3\2\2\2B@\3\2\2\2BC\3\2\2\2CE\3\2\2\2DB\3\2\2\2EF\7$\2\2F\20\3\2\2"+
		"\2GH\7^\2\2H\22\3\2\2\2IK\n\7\2\2JI\3\2\2\2KN\3\2\2\2LJ\3\2\2\2LM\3\2"+
		"\2\2M\24\3\2\2\2NL\3\2\2\2\13\2\32\34\",;@BL\3\b\2\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}