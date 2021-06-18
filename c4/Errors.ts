export const StringLiteralEndEarly = new Error(
  'unexpected end of file when recognizing string token'
)
export const StringLiteralUnescapedNewline = new Error(
  'unescaped newline encountered when recognizing string token'
)

export const NumericLiteralUnexpectedDigitInOctalInteger = new Error(
  'unexpected digit 8 or 9 in octal digit, only 0-7 allowed'
)

export const NumericLiteralUnexpectedNonBinaryDigitAfter0B = new Error(
  'unexpected non binary digit after prefix 0b, expect at least one binary digit followed'
)

export const NumericLiteralUnexpectedNonHexDigitAfter0X = new Error(
  'unexpected non hex digit after prefix 0x, expect at least one hex digit followed'
)
