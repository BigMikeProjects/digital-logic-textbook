# ASCII Encoding

A bit pattern means whatever the design says it means. `0100 0001` is the number 65 under an unsigned reading, part of an instruction or a memory address somewhere else, and the letter **A** under the encoding this topic is about. Nothing in the hardware distinguishes those readings — the interpretation is a contract between whoever writes the bits and whoever reads them.

**ASCII** (American Standard Code for Information Interchange) is the contract for text. It maps characters to numbers so that computers, which only ever move bit patterns, can store and transmit writing.

## The 7-Bit Standard

ASCII uses 7 bits, giving $2^7 = 128$ codes numbered 0 through 127. Those 128 slots cover the uppercase letters A–Z, the lowercase letters a–z, the digits 0–9, punctuation and symbols, and a block of **control codes** — values 0–31 that are not printable characters at all but instructions: 9 is tab, 10 is line feed, 13 is carriage return, 7 rings the terminal bell.

Those last two are worth knowing, because the disagreement over which of them ends a line is why a text file written on Windows (carriage return *and* line feed, `0x0D 0x0A`) can show up with strange characters or run together when read on a Unix system, which uses line feed alone. Two systems, two contracts, same bytes.

## Character Ranges

The codes were not handed out arbitrarily. The designers laid them out so that useful operations become cheap arithmetic:

| Category | Decimal Range | Pattern |
|----------|---------------|---------|
| Uppercase A–Z | 65–90 | 'A' = 65, 'B' = 66, ..., 'Z' = 90 |
| Lowercase a–z | 97–122 | 'a' = 97, 'b' = 98, ..., 'z' = 122 |
| Digits 0–9 | 48–57 | '0' = 48, '1' = 49, ..., '9' = 57 |
| Space | 32 | Most common whitespace |

Because each run is **contiguous and in order**, comparing two codes numerically also compares the characters alphabetically — which is why sorting text works at all. It also explains a bug every programmer meets: since every uppercase code is smaller than every lowercase code, a naive sort files `Zebra` before `apple`.

### The Case Conversion Trick

Uppercase and lowercase differ by exactly **32**:

$$\text{'a'} - \text{'A'} = 97 - 65 = 32$$

That is not a coincidence — 32 is $2^5$, so the difference is a **single bit**. In hex it is even clearer: 'A' is `0x41` and 'a' is `0x61`. Converting case is one XOR with `0x20`, and testing case is reading one bit. A designer chose the layout so a common text operation would cost almost no hardware.

### Digits: The Low Nibble Is the Value

The digits start at 48, which is `0x30`. So '0' is `0x30`, '7' is `0x37`, '9' is `0x39` — **the low four bits of a digit character are the digit's own value.** Converting a digit character to the number it names is a subtraction of 48, or equivalently masking off the high bits:

$$\text{'7'} = 0\text{x}37 \;\xrightarrow{\;\&\; 0\text{x}0\text{F}\;}\; 7$$

This is the other half of the confusion the number-representations topic warned about. A program that adds the *characters* `'1'` and `'2'` adds 49 and 50 and gets 99, not 3. The characters have to be converted to values first — subtract 48 from each, add, and if you need a character back again, add 48.

## Converting Characters to Binary

Every character maps to a decimal number, which converts to binary the usual way.

### Example: Letter 'A'

| Step | Value |
|------|-------|
| Character | A |
| Decimal | 65 |
| Binary | $1000001_2$ |
| Hexadecimal | 0x41 |

The conversion: $65 = 64 + 1 = 2^6 + 2^0$, giving bits in positions 6 and 0.

### Example: Letter 'a'

| Step | Value |
|------|-------|
| Character | a |
| Decimal | 97 |
| Binary | $1100001_2$ |
| Hexadecimal | 0x61 |

Compare with 'A': the only difference is bit 5, the 32's place — the case bit again.

### Example: Digit '0'

| Step | Value |
|------|-------|
| Character | '0' |
| Decimal | 48 |
| Binary | $0110000_2$ |
| Hexadecimal | 0x30 |

**Important:** the *character* '0' has code 48, not the *value* 0.

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

ASCII needs only 7 bits, but computers move data in 8-bit bytes, which leaves one bit spare. Historically that eighth bit carried a **parity bit** for error detection on serial links.

A parity bit is set so that the total count of 1s in the byte follows a fixed rule: **even parity** makes the total even, **odd parity** makes it odd. Sender and receiver agree on the rule in advance — another contract.

### Even Parity Example: Letter 'B'

'B' in 7 bits is $1000010$ (decimal 66). Count the 1s: **2**, already even, so the parity bit is **0** and the byte is $\mathbf{0}1000010$.

### Even Parity Example: Letter 'a'

'a' in 7 bits is $1100001$ (decimal 97). Count the 1s: **3**, which is odd, so the parity bit is **1** to bring the total to four, and the byte is $\mathbf{1}1100001$.

### Detecting Errors

The receiver counts the 1s in each arriving byte. If the count breaks the agreed rule — an odd total under even parity — a bit was corrupted in transit.

The scheme is cheap and correspondingly limited. One bit of redundancy buys you exactly one bit of information about seven, so parity **detects** an error but cannot **correct** it: it says a bit is wrong, never which one. And it only catches an odd number of flipped bits — if two bits flip, the count stays even and the error passes silently. Serious links use checksums, CRCs, or error-correcting codes instead.

## Encoding a Word: "BOR"

Encoding the text "BOR" with even parity:

| Character | Decimal | 7-bit Binary | 1s Count | Parity Bit | 8-bit with Parity |
|-----------|---------|--------------|----------|------------|-------------------|
| B | 66 | 1000010 | 2 (even) | 0 | 01000010 |
| O | 79 | 1001111 | 5 (odd) | 1 | 11001111 |
| R | 82 | 1010010 | 3 (odd) | 1 | 11010010 |

The transmitted data: `01000010 11001111 11010010`

Notice that the parity bit is not part of the character — strip it off and the remaining seven bits still spell B, O, R. It is packaging for the journey, discarded on arrival.

## Applications

Plain text files are stored as ASCII codes, and the older Internet protocols — HTTP, SMTP, FTP — send their commands as ASCII text, which is why you can read them directly on the wire. String handling in software works on code values, and serial standards such as RS-232 and UART transmit ASCII bytes with optional parity.

## Beyond ASCII: UTF-8

128 characters is enough for English and nothing else — no accented letters, no non-Latin scripts, no symbols outside a narrow set. **UTF-8** extends the idea to over a million characters while staying **backward compatible**: any byte with its top bit clear is plain ASCII with the same code it always had, so every ASCII file is already a valid UTF-8 file. Characters beyond 127 use two to four bytes, all of which have the top bit set and therefore cannot be mistaken for ASCII. The next topic takes this up in full.

## Key Takeaways

1. **ASCII maps characters to numbers** with a 7-bit code (0–127), including 33 non-printing control codes such as tab, line feed, and carriage return.
2. **The layout is engineered, not arbitrary:** contiguous ranges make sorting a numeric comparison, the case bit makes case conversion one XOR with `0x20`, and digits at `0x30`–`0x39` put the digit's value in the low nibble.
3. **Character versus value** is the recurring trap: '0' is code 48, and adding the characters '1' and '2' gives 99, not 3.
4. **Parity uses the spare eighth bit** to detect a single flipped bit — it cannot say which bit, cannot correct it, and misses any even number of errors.
5. **UTF-8 supersedes ASCII** while containing it: the first 128 codes are identical, so ASCII text is valid UTF-8 unchanged.

## Review Questions

**1. What is the ASCII code for the character '5'?**
A. 5\
B. 48\
C. 53\
D. 0x05

**2. A program reads the character 'C' (code 67) and wants the lowercase 'c'. What is the cheapest operation?**
A. Add 32, or equivalently toggle bit 5\
B. Subtract 32\
C. Reverse the bit order\
D. Add 1

**3. Why does a naive sort of ASCII strings place `Zebra` before `apple`?**
A. Because Z comes after a in the alphabet\
B. Because every uppercase code (65–90) is numerically smaller than every lowercase code (97–122)\
C. Because sorting compares string lengths first\
D. Because ASCII does not define an order for letters

**4. What is the even-parity bit for the 7-bit code $1010010$ ('R'), and why?**
A. 0, because the code contains three 1s\
B. 1, because the code contains three 1s and the total must be even\
C. 0, because the code is odd-valued\
D. 1, because every letter uses parity 1

**5. Two bits are corrupted in a byte protected by even parity. What happens?**
A. The receiver detects and corrects both errors\
B. The receiver detects the error but cannot correct it\
C. The error passes undetected, because two flips leave the count even\
D. The receiver detects one error and misses the other

**6. Why is every ASCII text file already a valid UTF-8 file?**
A. Because UTF-8 ignores the eighth bit entirely\
B. Because UTF-8's first 128 codes are identical to ASCII, and multi-byte characters always set the top bit\
C. Because UTF-8 converts ASCII automatically when the file is opened\
D. Because both encodings use exactly 7 bits per character

## Answer Explanations

**1. C.** The digits begin at 48 for '0', so '5' is $48 + 5 = 53$ (`0x35`). Option A is the trap the topic keeps returning to — confusing the character with the value it names. Option B is '0', not '5'.

**2. A.** 'C' is 67 (`0x43`) and 'c' is 99 (`0x63`) — a difference of exactly 32. Since 32 is $2^5$, adding it is the same as toggling bit 5, or one XOR with `0x20`. Subtracting (B) goes the other direction, lowercase to uppercase, which is wrong here.

**3. B.** Sorting compares code values, and the entire uppercase run sits below the entire lowercase run — `Z` is 90 while `a` is 97. The letters *are* in alphabetical order within each case (so D is wrong), but the two cases do not interleave, which is why case-insensitive sorting has to fold the case bit first.

**4. B.** $1010010$ contains three 1s. Even parity requires an even total, so the parity bit must be 1, bringing the total to four. Option A counts correctly but draws the wrong conclusion.

**5. C.** Parity tracks only whether the number of 1s is even or odd. Two flips change the count by $+2$, $0$, or $-2$ — all of which preserve evenness — so the byte still passes the check. This is the scheme's central limitation, and why real links use CRCs or error-correcting codes.

**6. B.** UTF-8 was designed for exactly this compatibility: codes 0–127 are one byte with the top bit clear and identical to ASCII, while every byte of a multi-byte character has the top bit set. No conversion step is involved (ruling out C), and the eighth bit is precisely what UTF-8 pays attention to (ruling out A).
