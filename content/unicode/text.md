# Unicode: Expanding Beyond ASCII

ASCII's seven bits buy 128 characters, which is enough for English and nothing else. No accented letters, no Greek or Cyrillic or Arabic or Chinese, no mathematical symbols beyond a handful, no emoji. For decades the workaround was a patchwork of incompatible extensions to the spare eighth bit, each region claiming codes 128–255 for its own alphabet — so a file written in one country arrived as gibberish in another. **Unicode** replaced the patchwork with one universal standard.

## Two Ideas, Not One

The single most useful thing to understand about Unicode is that it is really **two separate decisions**, and confusing them is the source of most Unicode bugs.

1. **Unicode assigns a number to every character.** That number is called a **code point**, and there are now over 150,000 of them covering every living writing system, historical scripts, mathematical notation, and emoji.
2. **An encoding decides how that number is stored as bytes.** UTF-8, UTF-16, and UTF-32 are three different answers, all representing the same code points.

Unicode says *what* the character is; the encoding says *how the bytes go*. UTF-8 is the answer the web settled on, and it is the one worth knowing in detail.

## Code Points

A code point is written as **U+** followed by a hexadecimal value:

| Character | Code Point | Description |
|-----------|------------|-------------|
| A | U+0041 | Latin capital letter A |
| é | U+00E9 | Latin small letter e with acute |
| 中 | U+4E2D | Chinese character for "middle" |
| 😀 | U+1F600 | Grinning face emoji |

Note the first row. `U+0041` is hexadecimal 41, which is decimal 65 — exactly ASCII's code for 'A'. That is deliberate: **the first 128 Unicode code points are the ASCII codes, unchanged.** ASCII was not replaced, it was absorbed.

## Variable-Width Encoding

A fixed-width encoding would be simpler. UTF-32 does exactly that — four bytes for every character, no cleverness required. The trouble is cost: an English document would quadruple in size, with three of every four bytes being zero, and the overwhelming majority of the world's stored text is in that ASCII range.

UTF-8 takes the other path. It spends **1 to 4 bytes** depending on how large the code point is, so common characters stay cheap and rare ones are still reachable:

| Byte Count | Character Types | Bits Available |
|------------|-----------------|----------------|
| 1 byte | ASCII characters (A–Z, 0–9, basic punctuation) | 7 bits |
| 2 bytes | Extended Latin, accented characters (é, ñ) | 11 bits |
| 3 bytes | Most other language characters (Chinese, Japanese, etc.) | 16 bits |
| 4 bytes | Emoji and rare symbols | 21 bits |

## How the Bytes Are Marked

A variable-width scheme has an obvious problem: reading a stream of bytes, how do you know where one character ends and the next begins? UTF-8 answers it by reserving bit patterns at the *front* of each byte.

| Byte Role | Leading Bits | Meaning |
|--------------|------------|---------|
| single byte | `0xxxxxxx` | a 1-byte character (ASCII) |
| lead byte | `110xxxxx` | starts a 2-byte character |
| lead byte | `1110xxxx` | starts a 3-byte character |
| lead byte | `11110xxx` | starts a 4-byte character |
| **continuation** | `10xxxxxx` | a following byte of a multi-byte character |

The **continuation** row is the piece that makes the whole scheme work. Every byte after the first in a multi-byte character begins `10`, a pattern no lead byte ever uses. The `x` positions are the payload — the code point's bits, packed in order — which is why the capacities come out as they do: 5 + 6 = 11 bits for two bytes, 4 + 6 + 6 = 16 for three, 3 + 6 + 6 + 6 = 21 for four.

The payoff is that UTF-8 is **self-synchronizing.** Drop into the middle of a file at random and you can tell immediately whether you have landed mid-character: if the byte starts with `10`, back up until you find one that doesn't. No other encoding scheme in common use makes damaged or truncated text this recoverable, and it means a search for an ASCII string can never match by accident inside a multi-byte character.

## Worked Example: Encoding é (U+00E9)

The code point is $\text{0xE9} = 233$, which needs 8 bits — too many for a single byte's 7, so this is a 2-byte character with an 11-bit payload.

Write 233 in 11 bits: $000\;1110\;1001$. Split it 5 + 6 and drop the halves into the template:

| | template | payload | byte |
|---|---|---|---|
| lead | `110xxxxx` | `00011` | `11000011` = **0xC3** |
| continuation | `10xxxxxx` | `101001` | `10101001` = **0xA9** |

So é is stored as the two bytes `C3 A9`.

## Worked Example: Encoding 中 (U+4E2D)

$\text{0x4E2D}$ needs 15 bits, so this is a 3-byte character with a 16-bit payload: $0100\;1110\;0010\;1101$. Split it 4 + 6 + 6:

| | template | payload | byte |
|---|---|---|---|
| lead | `1110xxxx` | `0100` | `11100100` = **0xE4** |
| continuation | `10xxxxxx` | `111000` | `10111000` = **0xB8** |
| continuation | `10xxxxxx` | `101101` | `10101101` = **0xAD** |

So 中 is stored as `E4 B8 AD` — three bytes, each unmistakably tagged as a lead or a continuation.

## Backward Compatibility

Because the first 128 code points are ASCII and a 1-byte UTF-8 character is `0xxxxxxx` — the top bit clear, exactly the way ASCII always left it — **every valid ASCII file is already a valid UTF-8 file**, byte for byte, with no conversion step. Decades of existing documents and protocols kept working. That compatibility, more than any technical elegance, is why UTF-8 won.

## Practical Examples

**"BOR"** — B, O, and R are all ASCII, 1 byte each: **3 bytes**.

**"café"** — c, a, and f are ASCII at 1 byte each; é is extended Latin at 2 bytes (`C3 A9`, as worked above): **5 bytes**. Note that the character count is 4 but the byte count is 5 — a distinction that matters any time software measures a string's "length."

**"Hello 世界"** — the six ASCII characters H, e, l, l, o and the space take 1 byte each; 世 and 界 take 3 bytes each: **12 bytes** for 8 characters.

## Key Takeaways

1. **Unicode assigns code points; encodings store them.** The code point for 中 is U+4E2D no matter how it is stored; UTF-8, UTF-16, and UTF-32 are different ways to write that same number as bytes.
2. **Code points use U+ notation** and number over 150,000 characters across all writing systems.
3. **UTF-8 is variable width**, spending 1 to 4 bytes so that common characters stay cheap — a fixed-width scheme would quadruple ordinary English text.
4. **Lead bits mark the structure:** `0`, `110`, `1110`, `11110` begin a character and `10` marks a continuation byte, which makes UTF-8 self-synchronizing.
5. **ASCII is a subset**, so ASCII text is valid UTF-8 unchanged — the compatibility that made adoption possible.
6. **Characters and bytes are not the same count**, as "café" (4 characters, 5 bytes) shows.

## Review Questions

**1. What is the difference between a Unicode code point and an encoding such as UTF-8?**
A. They are two names for the same thing\
B. The code point is the number assigned to a character; the encoding decides how that number is stored as bytes\
C. The code point is for emoji only; the encoding handles letters\
D. The encoding assigns the number and the code point stores it

**2. Why are the first 128 Unicode code points identical to the ASCII codes?**
A. Coincidence — the numbers happened to line up\
B. So that existing ASCII text is already valid UTF-8 and keeps working unchanged\
C. Because Unicode can only represent 128 characters at a time\
D. Because ASCII was rewritten to match Unicode

**3. A UTF-8 byte begins with the bits `10`. What does that tell the decoder?**
A. It is a 2-byte character\
B. It is an ASCII character\
C. It is a continuation byte — part of a multi-byte character, not the start of one\
D. The file is corrupted

**4. How many bytes does the character é (U+00E9) occupy in UTF-8?**
A. 1\
B. 2\
C. 3\
D. 4

**5. Why does UTF-8 use a variable number of bytes rather than a fixed four?**
A. Fixed-width encoding cannot represent emoji\
B. Variable width makes decoding faster\
C. Because most text is in the ASCII range, and fixed four-byte characters would quadruple the size of ordinary documents\
D. Because bytes cannot be grouped in fours

**6. The string "café" contains four characters. How many bytes does it occupy in UTF-8, and why?**
A. 4 bytes — one per character\
B. 5 bytes — three ASCII characters at 1 byte each plus é at 2 bytes\
C. 8 bytes — two bytes per character\
D. 16 bytes — four bytes per character

**7. What practical advantage does the `10xxxxxx` continuation pattern give UTF-8?**
A. It compresses the text\
B. It allows more than 150,000 characters\
C. It makes the encoding self-synchronizing — a decoder landing mid-stream can find the next character boundary\
D. It encrypts multi-byte characters

## Answer Explanations

**1. B.** Unicode's job is to assign every character a number — the code point, written U+ and a hex value. Storing that number as bytes is a separate decision, and UTF-8, UTF-16, and UTF-32 are three different answers for the same code points. Keeping the two ideas apart is what prevents most Unicode confusion.

**2. B.** The overlap is deliberate. Since a 1-byte UTF-8 character is `0xxxxxxx` and carries the ASCII code unchanged, every ASCII file is already valid UTF-8 with no conversion. That backward compatibility is the main reason UTF-8 was adopted so widely.

**3. C.** `10` is reserved for continuation bytes and is never used by a lead byte, so the decoder knows it has landed inside a character rather than at the start of one. Note that `110` — a different pattern — is what marks a 2-byte lead, which is the trap in option A.

**4. B.** U+00E9 is 233, needing 8 bits, which exceeds the 7 bits a single UTF-8 byte can carry. The 2-byte form has 11 bits of payload, and the encoding comes out as `C3 A9`.

**5. C.** Fixed four-byte characters would work correctly but waste enormous space, since the great majority of stored text is ASCII and would carry three zero bytes per character. Variable width keeps the common case at one byte. (Decoding fixed-width is actually *simpler*, not harder, so B has it backwards.)

**6. B.** c, a, and f are ASCII at one byte each; é needs two. The example is worth remembering because it shows character count and byte count are different quantities — a frequent source of bugs in software that measures string length.

**7. C.** Because no continuation byte can be mistaken for the start of a character, a decoder can recover from any position by backing up until it finds a byte that does not begin with `10`. It also means a search for an ASCII substring can never accidentally match bytes inside a multi-byte character.
