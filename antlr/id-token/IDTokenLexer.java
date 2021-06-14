// Generated from IDToken.g4 by ANTLR 4.9.2
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class IDTokenLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.9.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, NUMBER=4, LB=5, RB=6, ID=7, RAW_STR=8, WS=9;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"T__0", "T__1", "T__2", "NUMBER", "LB", "RB", "ID", "ID_Start", "ID_Continue", 
			"RAW_STR", "WS"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'.'", "'['", "']'", null, "'{'", "'}'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, null, null, "NUMBER", "LB", "RB", "ID", "RAW_STR", "WS"
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


	public IDTokenLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "IDToken.g4"; }

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

	@Override
	public void action(RuleContext _localctx, int ruleIndex, int actionIndex) {
		switch (ruleIndex) {
		case 4:
			LB_action((RuleContext)_localctx, actionIndex);
			break;
		case 5:
			RB_action((RuleContext)_localctx, actionIndex);
			break;
		case 6:
			ID_action((RuleContext)_localctx, actionIndex);
			break;
		case 9:
			RAW_STR_action((RuleContext)_localctx, actionIndex);
			break;
		}
	}
	private void LB_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 0:
			 IDTokenParser.id = true; System.out.println(IDTokenParser.id);
			break;
		}
	}
	private void RB_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 1:
			 IDTokenParser.id = false; System.out.println(IDTokenParser.id);
			break;
		}
	}
	private void ID_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 2:
			System.out.println("id"); System.out.println(IDTokenParser.id); 
			break;
		}
	}
	private void RAW_STR_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 3:
			System.out.println("raw id"); System.out.println(IDTokenParser.id); 
			break;
		}
	}
	@Override
	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 6:
			return ID_sempred((RuleContext)_localctx, predIndex);
		case 9:
			return RAW_STR_sempred((RuleContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean ID_sempred(RuleContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return IDTokenParser.id;
		}
		return true;
	}
	private boolean RAW_STR_sempred(RuleContext _localctx, int predIndex) {
		switch (predIndex) {
		case 1:
			return !IDTokenParser.id;
		}
		return true;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\13G\b\1\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\3\2\3\2\3\3\3\3\3\4\3\4\3\5\6\5!\n\5\r\5\16\5\"\3\6\3\6\3"+
		"\6\3\7\3\7\3\7\3\b\3\b\7\b-\n\b\f\b\16\b\60\13\b\3\b\3\b\3\b\3\t\3\t\3"+
		"\n\3\n\3\13\6\13:\n\13\r\13\16\13;\3\13\3\13\3\13\3\f\6\fB\n\f\r\f\16"+
		"\fC\3\f\3\f\2\2\r\3\3\5\4\7\5\t\6\13\7\r\b\17\t\21\2\23\2\25\n\27\13\3"+
		"\2\7\3\2\62;\5\2C\\aac|\6\2\62;C\\aac|\f\2\f\f\17\17$$&&))BB]]__}}\177"+
		"\177\5\2\13\f\17\17\"\"\2H\2\3\3\2\2\2\2\5\3\2\2\2\2\7\3\2\2\2\2\t\3\2"+
		"\2\2\2\13\3\2\2\2\2\r\3\2\2\2\2\17\3\2\2\2\2\25\3\2\2\2\2\27\3\2\2\2\3"+
		"\31\3\2\2\2\5\33\3\2\2\2\7\35\3\2\2\2\t \3\2\2\2\13$\3\2\2\2\r\'\3\2\2"+
		"\2\17*\3\2\2\2\21\64\3\2\2\2\23\66\3\2\2\2\259\3\2\2\2\27A\3\2\2\2\31"+
		"\32\7\60\2\2\32\4\3\2\2\2\33\34\7]\2\2\34\6\3\2\2\2\35\36\7_\2\2\36\b"+
		"\3\2\2\2\37!\t\2\2\2 \37\3\2\2\2!\"\3\2\2\2\" \3\2\2\2\"#\3\2\2\2#\n\3"+
		"\2\2\2$%\7}\2\2%&\b\6\2\2&\f\3\2\2\2\'(\7\177\2\2()\b\7\3\2)\16\3\2\2"+
		"\2*.\5\21\t\2+-\5\23\n\2,+\3\2\2\2-\60\3\2\2\2.,\3\2\2\2./\3\2\2\2/\61"+
		"\3\2\2\2\60.\3\2\2\2\61\62\b\b\4\2\62\63\6\b\2\2\63\20\3\2\2\2\64\65\t"+
		"\3\2\2\65\22\3\2\2\2\66\67\t\4\2\2\67\24\3\2\2\28:\n\5\2\298\3\2\2\2:"+
		";\3\2\2\2;9\3\2\2\2;<\3\2\2\2<=\3\2\2\2=>\b\13\5\2>?\6\13\3\2?\26\3\2"+
		"\2\2@B\t\6\2\2A@\3\2\2\2BC\3\2\2\2CA\3\2\2\2CD\3\2\2\2DE\3\2\2\2EF\b\f"+
		"\6\2F\30\3\2\2\2\7\2\".;C\7\3\6\2\3\7\3\3\b\4\3\13\5\b\2\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}