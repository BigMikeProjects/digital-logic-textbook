# ASCII Encoding

Digital systems don't process words directly—they operate on patterns of binary digits. **ASCII** (American Standard Code for Information Interchange) is the foundational encoding that maps text characters to numerical values, allowing computers to store, process, and transmit text as binary data.

## The 7-Bit Standard

ASCII uses 7 bits to represent characters, providing $2^7 = 128$ unique values (0–127). These 128 codes include:

- Uppercase letters (A–Z)
- Lowercase letters (a–z)
- Digits (0–9)
- Punctuation and symbols
- Control codes (newline, tab, etc.)

## Character Ranges

The ASCII designers organized codes in logical, sequential patterns:

| Category | Decimal Range | Pattern |
|----------|---------------|---------|
| Uppercase A–Z | 65–90 | 'A' = 65, 'B' = 66, ..., 'Z' = 90 |
| Lowercase a–z | 97–122 | 'a' = 97, 'b' = 98, ..., 'z' = 122 |
| Digits 0–9 | 48–57 | '0' = 48, '1' = 49, ..., '9' = 57 |
| Space | 32 | Most common whitespace |

### The Case Conversion Trick

Notice that uppercase and lowercase letters differ by exactly **32**:

$$\text{'a'} - \text{'A'} = 97 - 65 = 32$$

This makes case conversion simple—just add or subtract 32. In binary, this corresponds to flipping bit 5 (the $2^5$ position).

## Converting Characters to Binary

Every character maps to a unique decimal number, which converts directly to binary.

### Example: Letter 'A'

| Step | Value |
|------|-------|
| Character | A |
| Decimal | 65 |
| Binary | $1000001_2$ |
| Hexadecimal | 0x41 |

The conversion: $65 = 64 + 1 = 2^6 + 2^0$, giving us bits in positions 6 and 0.

### Example: Letter 'a'

| Step | Value |
|------|-------|
| Character | a |
| Decimal | 97 |
| Binary | $1100001_2$ |
| Hexadecimal | 0x61 |

Compare to 'A': the only difference is bit 5 (the 32's place), demonstrating the case conversion pattern.

### Example: Digit '0'

| Step | Value |
|------|-------|
| Character | '0' |
| Decimal | 48 |
| Binary | $0110000_2$ |
| Hexadecimal | 0x30 |

**Important:** The *character* '0' has ASCII code 48, not the *value* 0. This distinction matters when processing text versus numbers.

## Common ASCII Values

| Character | Decimal | Binary | Hex |
|-----------|---------|--------|-----|
| Space | 32 | 0100000 | 0x20 |
| 0 | 48 | 0110000 | 0x30 |
| 9 | 57 | 0111001 | 0x39 |
| A | 65 | 1000001 | 0x41 |
| Z | 90 | 1011010 | 0x5A |
| a | 97 | 1100001 | 0x61 |
| z | 122 | 1111010 | 0x7A |

## Parity Bits for Error Detection

While ASCII needs only 7 bits, computers work with 8-bit bytes. The 8th bit was historically used for **error detection** during serial transmission.

### How Parity Works

A **parity bit** is added so the total count of 1-bits follows a specific rule:

- **Even parity:** Total number of 1s must be even
- **Odd parity:** Total number of 1s must be odd

### Even Parity Example: Letter 'B'

1. 'B' in 7-bit binary: $1000010$ (decimal 66)
2. Count the 1s: **2** ones
3. 2 is already even, so parity bit = **0**
4. Full 8-bit: $\mathbf{0}1000010$

### Even Parity Example: Letter 'a'

1. 'a' in 7-bit binary: $1100001$ (decimal 97)
2. Count the 1s: **3** ones
3. 3 is odd, so we add a 1 to make it even
4. Parity bit = **1**
5. Full 8-bit: $\mathbf{1}1100001$

### Detecting Errors

If a single bit flips during transmission, the parity check fails:

- Expected even count → received odd count = **error detected**

**Limitation:** Parity only detects single-bit errors (or any odd number of errors). If two bits flip, the parity still checks out, hiding the error. More robust error detection uses checksums or CRCs.

## Encoding a Word: "BOR"

Let's encode the text "BOR" with even parity:

| Character | Decimal | 7-bit Binary | 1s Count | Parity Bit | 8-bit with Parity |
|-----------|---------|--------------|----------|------------|-------------------|
| B | 66 | 1000010 | 2 (even) | 0 | 01000010 |
| O | 79 | 1001111 | 5 (odd) | 1 | 11001111 |
| R | 82 | 1010010 | 3 (odd) | 1 | 11010010 |

The transmitted data: `01000010 11001111 11010010`

## Applications

1. **Text files:** Plain text files store characters as ASCII codes
2. **Network protocols:** HTTP, SMTP, and FTP use ASCII for commands
3. **Programming:** String manipulation relies on ASCII code values
4. **Serial communication:** RS-232 and UART transmit ASCII with parity

## Beyond ASCII: UTF-8

ASCII's 128 characters suffice for English but not for international text. **UTF-8** extends ASCII to support millions of characters while remaining backward compatible—the first 128 UTF-8 codes are identical to ASCII.

## Key Takeaways

1. **ASCII maps characters to numbers** using a 7-bit encoding (0–127)
2. **Sequential patterns** make the encoding logical: A–Z (65–90), a–z (97–122), 0–9 (48–57)
3. **Case differs by 32:** Toggle bit 5 to convert between upper and lowercase
4. **Parity bits** in the 8th position detect single-bit transmission errors
5. **Character vs. value:** The character '0' is code 48, not the number 0
