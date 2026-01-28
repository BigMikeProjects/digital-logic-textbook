# Unicode: Expanding Beyond ASCII

ASCII works well for basic English text, but it quickly runs into limits when we want to represent other languages, symbols, or emojis. To handle this, the computing world developed **Unicode**—a universal character encoding standard.

## Why Unicode?

ASCII is limited to just 128 characters (7-bit encoding), designed primarily for English text. It cannot represent:
- Characters from other languages (Chinese, Arabic, Hindi, etc.)
- Special symbols and mathematical notation
- Emojis

Unicode solves this by assigning unique **code points** to over 150,000 characters from all writing systems worldwide.

## Code Points

Each character in Unicode has a unique identifier called a code point, written as **U+** followed by a hexadecimal value:

| Character | Code Point | Description |
|-----------|------------|-------------|
| A | U+0041 | Latin capital letter A |
| é | U+00E9 | Latin small letter e with acute |
| 中 | U+4E2D | Chinese character for "middle" |
| 😀 | U+1F600 | Grinning face emoji |

## Variable-Width Encoding (UTF-8)

The key innovation in Unicode (specifically UTF-8 encoding) is **variable-width encoding**. Instead of using a fixed number of bytes for every character, UTF-8 uses 1-4 bytes depending on the character type:

| Byte Count | Character Types | Bits Available |
|------------|-----------------|----------------|
| 1 byte | ASCII characters (A-Z, 0-9, basic punctuation) | 7 bits |
| 2 bytes | Extended Latin, accented characters (é, ñ) | 11 bits |
| 3 bytes | Most other language characters (Chinese, Japanese, etc.) | 16 bits |
| 4 bytes | Emojis and rare symbols | 21 bits |

This approach efficiently represents common characters while still supporting rare ones.

## Backward Compatibility

A critical design feature of UTF-8:
- **ASCII is a subset of Unicode**
- ASCII text is valid UTF-8 text
- ASCII characters use exactly 1 byte in UTF-8

This means existing ASCII documents work perfectly in Unicode systems without any conversion.

## Leading Bit Indicators

How does a computer know how many bytes to read for each character? UTF-8 uses **leading bit patterns**:

| Leading Bits | Byte Count | Example |
|--------------|------------|---------|
| 0xxxxxxx | 1 byte | ASCII characters |
| 110xxxxx | 2 bytes | Accented letters |
| 1110xxxx | 3 bytes | Most other languages |
| 11110xxx | 4 bytes | Emojis |

By examining the first few bits of a byte, the decoder knows exactly how many bytes to read for that character.

## Practical Examples

### Example 1: "BOR" (ASCII Compatible)
- B = 1 byte (ASCII)
- O = 1 byte (ASCII)
- R = 1 byte (ASCII)
- **Total: 3 bytes**

### Example 2: "café" (Mixed Encoding)
- C = 1 byte (ASCII)
- A = 1 byte (ASCII)
- F = 1 byte (ASCII)
- é = 2 bytes (extended Latin)
- **Total: 5 bytes**

### Example 3: "Hello 世界" (English + Chinese)
- H, e, l, l, o, space = 6 bytes (ASCII)
- 世 = 3 bytes (Chinese)
- 界 = 3 bytes (Chinese)
- **Total: 12 bytes**

## Key Takeaways

1. **Unicode is universal** — supports over 150,000 characters from all writing systems
2. **Code points** are unique identifiers for each character (U+ notation)
3. **UTF-8 uses variable width** — 1 to 4 bytes per character
4. **Backward compatible** — ASCII text is valid UTF-8
5. **Leading bits indicate length** — enables sequential decoding

## Practice

Use the interactive Unicode encoding tool in the graphics panel to explore how different characters are encoded!

---

## Quiz: Unicode Encoding

### Question 1
What limitation of ASCII does Unicode address?

- A) ASCII is too slow for modern computers
- B) ASCII can only represent basic English text, not other languages or emojis
- C) ASCII uses too many bytes per character
- D) ASCII cannot represent numbers

### Question 2
Approximately how many characters does Unicode support?

- A) 128
- B) 256
- C) Over 150,000
- D) Exactly 65,536

### Question 3
What does the "U+" notation indicate in Unicode?

- A) The character is uppercase
- B) It's a Unicode code point
- C) The character requires extra bytes
- D) It's a special control character

### Question 4
How many bits are in one byte?

- A) 4 bits
- B) 7 bits
- C) 8 bits
- D) 16 bits

### Question 5
Why do ASCII characters only need 1 byte in Unicode (UTF-8)?

- A) To save memory
- B) For backward compatibility with existing ASCII text
- C) ASCII characters are more important
- D) It's a limitation of the encoding

### Question 6
How many bytes does an emoji typically require in UTF-8?

- A) 1 byte
- B) 2 bytes
- C) 3 bytes
- D) 4 bytes

### Question 7
In the word "café", how many bytes would the accented 'é' require in UTF-8?

- A) 1 byte
- B) 2 bytes
- C) 3 bytes
- D) 4 bytes

### Question 8
What is the main advantage of variable-width encoding?

- A) It makes decoding faster
- B) Common characters use fewer bytes, saving space
- C) It's easier to implement
- D) It allows for encryption

### Question 9
In UTF-8, if the leading bits of a byte are "110", how many bytes does that character use?

- A) 1 byte
- B) 2 bytes
- C) 3 bytes
- D) 4 bytes

### Question 10
Which statement about ASCII and Unicode is correct?

- A) ASCII and Unicode are completely separate standards
- B) Unicode replaces ASCII entirely
- C) ASCII is a subset of Unicode
- D) Unicode cannot represent ASCII characters

<details>
<summary><strong>Answer Key</strong></summary>

| Question | Answer | Explanation |
|----------|--------|-------------|
| 1 | B | ASCII is limited to 128 characters, primarily English letters, digits, and basic symbols. It cannot represent other languages, special symbols, or emojis. |
| 2 | C | Unicode assigns unique code points to over 150,000 characters from all writing systems, including emojis. |
| 3 | B | The U+ prefix is a designator indicating that the following hexadecimal value is a Unicode code point. |
| 4 | C | One byte equals 8 bits. This is the fundamental unit used in Unicode's variable-width encoding. |
| 5 | B | Unicode uses 1 byte for ASCII characters to maintain backward compatibility with the large amount of existing ASCII text. |
| 6 | D | Emojis require 4 bytes in UTF-8 encoding because they were added later and have higher code point values. |
| 7 | B | The accented 'é' is an extended Latin character that requires 2 bytes (16 bits) in UTF-8. |
| 8 | B | Variable-width encoding is efficient because common characters (like ASCII) use only 1 byte, while rare characters use more bytes only when needed. |
| 9 | B | Leading bits of "110" indicate a 2-byte character in UTF-8. The pattern is: 0=1 byte, 110=2 bytes, 1110=3 bytes, 11110=4 bytes. |
| 10 | C | ASCII is a subset of Unicode. All ASCII characters have the same values in Unicode, and ASCII text is valid UTF-8 text. |

</details>
