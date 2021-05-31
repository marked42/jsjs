grammar CSV;

file: header NEWLINE (row NEWLINE)*;

header: row;

row: field (',' field)*;

field: TEXT #text | STRING #string | #empty; // allow empty

TEXT: ~[,\r\n]+; // 不允许','，换行符，限制在一个field之内

STRING: '"' ('""' | ~'"')* '"'; // 可以突破field和row

NEWLINE: '\r'? '\n';
