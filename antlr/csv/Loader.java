import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public static class Loader extends CSVBaseListener {
    public static final String empty = "";
    List<Map<String, String>> rows = new ArrayList<Map<String, String>>();
    List<String> header;
    List<String> currentRowFieldValues;

    public void exitString(CSVParser.StringContext ctx) {
        currentRowFieldValues.add(ctx.STRING().getText());
    }

    public void exitText(CSVParser.TextContext ctx) {
        currentRowFieldValues.add(ctx.TEXT().getText());
    }

    public void exitEmpty(CSVParser.EmptyContext ctx) {
        currentRowFieldValues.add(empty);
    }

    public void exitHeader(CSVParser.HeaderContext ctx) {
        header = new ArrayList<>();
        header.addAll(currentRowFieldValues);
    }

    public void enterRow(CSVParser.RowContext ctx) {
        currentRowFieldValues = new ArrayList<>();
    }

    public void exitRow(CSVParser.RowContext ctx) {
        if (ctx.getParent().getRuleIndex() == CSVParser.RULE_header) { return; }

        Map<String, String> m = new LinkedHashMap<>();
        int i = 0;
        for (String v: currentRowFieldValues) {
            m.put(header.get(i), v);
            i++;
        }
        rows.add(m);
    }

    public static void main() {
        ParseTreeWalker walker = new ParseTreeWalker();
        Loader loader = new Loader();
        walker.walk(loader, tree);
    }
}
