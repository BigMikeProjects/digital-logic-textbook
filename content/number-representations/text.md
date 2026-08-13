## Number Representations

Digital systems store and move information as bits, but a bit pattern does not carry a single meaning by itself. The pattern `0100 0001` might represent the unsigned number 65, the ASCII character `A`, part of an instruction, a memory address, a color value, or a status field. The hardware sees voltage levels and logic states — it neither knows nor cares which of those readings you intend. Engineers give those states meaning by choosing a representation.

A number representation is a rule for interpreting a collection of bits. That rule determines the range of values, how arithmetic behaves, how the value is displayed to a human, and how other circuits or software blocks are expected to decode it. In digital logic, representation is not a cosmetic detail. It is part of the design contract.

## Representation Is A Contract

When two parts of a system exchange bits, both sides must agree on what those bits mean. If a counter output is treated as an unsigned binary number, then `1111` means fifteen. If the same four bits are treated as a signed two's-complement number, `1111` means negative one. The physical signals are identical; the interpretation is different.

It is worth pausing on how such a disagreement actually plays out, because nothing in the hardware announces it. Suppose one block outputs a temperature adjustment on a four-bit bus, intending two's complement, and a colleague wires that bus into a comparator that reads unsigned. When the adjustment is $-1$, the first block dutifully drives `1111`, the comparator dutifully reads fifteen, and every gate does exactly what it was built to do — yet the design is wrong. No probe shows a bad voltage; the bug lives entirely in the mismatch between two interpretations of the same correct signals. That is what "part of the design contract" means: the agreement is real even though no wire carries it.

That distinction is central to engineering work. A schematic may show a four-bit bus named `A[3:0]`, but the name alone does not tell whether `A` is unsigned, signed, binary-coded decimal, a state encoding, or a group of independent control flags. Correct design requires knowing — and interfaces stating — the intended representation.

The same idea appears throughout computing:

| Bit Pattern | Possible Interpretation | Meaning |
| --- | --- | --- |
| `1001` | Unsigned binary | 9 |
| `1001` | 4-bit two's complement | -7 |
| `1001` | Binary-coded decimal | Decimal digit 9 |
| `1001` | Control flags | Four independent true/false signals |
| `1001` | State encoding | State selected by the designer |

Notice that the first two rows do not even agree numerically — the same pattern is 9 under one rule and $-7$ under another. The important lesson is not that one interpretation is "correct" in isolation. The correct interpretation is the one specified by the circuit, interface, instruction set, file format, or design document.

## Positional Notation

Most familiar number systems are positional. A digit's value depends on both the digit and its position. In decimal, the number 472 means

$4 \times 10^2 + 7 \times 10^1 + 2 \times 10^0$

The base, or radix, tells how much each position is worth relative to the next one. Decimal uses base 10, so each position is ten times the value of the position to its right. Binary uses base 2, so each position is two times the value of the position to its right.

For an unsigned binary number, each bit contributes either zero or its place value:

| Bit Position | 3 | 2 | 1 | 0 |
| --- | ---: | ---: | ---: | ---: |
| Place Value | 8 | 4 | 2 | 1 |
| Bit Pattern | 1 | 0 | 1 | 1 |

The binary pattern `1011` represents

$1 \times 2^3 + 0 \times 2^2 + 1 \times 2^1 + 1 \times 2^0 = 8 + 0 + 2 + 1 = 11$

This is the foundation for binary arithmetic, counters, addresses, opcodes, and many data fields used in digital systems — and the same mechanical procedure reads any width; a 32-bit value takes more patience but no new ideas.

## Why Binary Fits Hardware

Binary representation is not used because humans find it compact. It is used because two-state logic maps well onto physical hardware. A wire can be interpreted as low or high voltage. A transistor can be off or on. A memory cell can be in one of two stable states. This two-state abstraction is robust, economical, and easy to compose into larger systems.

Real signals are analog, but digital systems divide voltage ranges into logical categories. For example, a low voltage range may represent logic 0 and a high voltage range may represent logic 1. Noise, device variation, and timing uncertainty still matter, but binary logic gives engineers useful margins. The representation is simple enough for hardware and systematic enough for computation.

The tradeoff is readability. Long binary strings are difficult for humans to inspect:

| Binary | Decimal |
| --- | ---: |
| `0000 0000` | 0 |
| `0000 1111` | 15 |
| `0010 1010` | 42 |
| `1111 1111` | 255 |

Engineers therefore use other notations when reading and writing values, even when the underlying hardware remains binary.

## Hexadecimal As Engineering Shorthand

Hexadecimal, or base 16, is widely used because one hexadecimal digit corresponds exactly to four binary bits. A four-bit group is called a nibble. This makes hexadecimal much easier to read than raw binary while preserving a direct connection to the underlying bit pattern.

| Binary Nibble | Hex Digit | Decimal Value |
| --- | --- | ---: |
| `0000` | `0` | 0 |
| `0001` | `1` | 1 |
| `1010` | `A` | 10 |
| `1111` | `F` | 15 |

For example:

`1101 0110 0011 1010 = 0xD63A`

Each hex digit simply names one group of four bits. It is a useful habit not to think of hexadecimal as a separate number system at all, but strictly as a compressed way of *writing binary*: reading `0xD63A` is reading the bit pattern itself, four bits at a time. That is why hexadecimal is common in memory addresses, machine instructions, register dumps, color values, bit masks, and embedded-system documentation. It reduces visual clutter without hiding the structure of the bits — something decimal cannot claim, since a decimal digit does not correspond to a whole number of bits.

## Range And Width

The number of bits determines how many distinct patterns are available. With `n` bits, there are $2^n$ possible patterns. An unsigned `n`-bit binary number therefore has the range

`0` through $2^n - 1$

For example:

| Width | Number Of Patterns | Unsigned Range |
| ---: | ---: | --- |
| 4 bits | 16 | 0 to 15 |
| 8 bits | 256 | 0 to 255 |
| 16 bits | 65,536 | 0 to 65,535 |

Width is an engineering choice. More bits provide a larger range, but they also require more storage, wider buses, more circuit area, and potentially more power — in a hardware design, every added bit is typically a physical wire. Too few bits cause overflow or loss of information. Good design begins by asking what range of values must be represented and what cost is acceptable.

Work one such choice in full. Suppose a counter must count events up to about 200. Seven bits reach $2^7 - 1 = 127$ — short. Eight bits reach 255, covering 200 with headroom, so eight bits is the minimum comfortable width. If the requirement later grows to 300, those eight bits fail silently: adding one to `1111 1111` wraps around to `0000 0000`, so a count of 256 reads as zero. Whether a design should wrap, stick at the maximum (saturate), or raise an error flag is itself a representation decision — one the interface contract has to record.

## Signed Numbers

Unsigned binary is appropriate when values cannot be negative, such as many counters, addresses, and sizes. Other signals require negative values: temperature offsets, error terms, audio samples, coordinate differences, and arithmetic results can all be signed.

Digital systems usually represent signed integers using two's complement. In an `n`-bit two's-complement number, the most significant bit has a negative weight:

| Bit Position | 3 | 2 | 1 | 0 |
| --- | ---: | ---: | ---: | ---: |
| Weight | -8 | 4 | 2 | 1 |
| Bit Pattern | 1 | 1 | 0 | 1 |

The four-bit pattern `1101` therefore represents

`-8 + 4 + 0 + 1 = -3`

The reading procedure is the ordinary place-value one with a single amendment — the top weight is negative. One more to make it routine: `1010` is $-8 + 2 = -6$, while `0110` reads exactly like unsigned ($4 + 2 = 6$) because its negative weight is switched off.

Two's complement is valuable because the same binary adder can perform much of the work for both signed and unsigned addition. The interpretation of the result still depends on the representation, but the hardware can be efficient.

For four bits:

| Bit Pattern | Unsigned Meaning | Two's-Complement Meaning |
| --- | ---: | ---: |
| `0111` | 7 | 7 |
| `1000` | 8 | -8 |
| `1111` | 15 | -1 |

The bit pattern did not change. Only the representation changed. The mechanics of two's complement — how to negate a value, why the trick works, and what the number circle looks like — get their own topics later in this chapter.

## Encodings Beyond Ordinary Numbers

Not every useful bit pattern represents an ordinary integer. Many digital systems use encodings: agreed-upon mappings between bit patterns and symbols, states, or actions.

ASCII maps bit patterns to characters. Unicode extends character representation to a much broader set of writing systems and symbols. Binary-coded decimal uses four-bit groups to represent decimal digits. Gray code arranges values so that adjacent codes differ in only one bit, which can reduce certain transition errors in sensors and encoders. State machines often use custom encodings where each bit pattern corresponds to a named state.

Character codes supply a classic confusion of encodings and numbers. In ASCII, the *character* `0` is stored as code 48, so the byte `0011 0000` is the number 48 under the unsigned reading and the digit-character `0` under the ASCII reading. A program that adds two digit *characters* expecting a numeric sum gets 97, not 1 — a bug every experienced programmer has met, and exactly the contract confusion this topic is about, happening at the software level.

These encodings are not less real than numeric representations. They are engineered mappings. Their quality depends on how well they support the system's requirements.

## Engineering Tradeoffs

Choosing a representation affects the behavior and cost of a design. A representation should be evaluated against several practical questions:

| Design Question | Why It Matters |
| --- | --- |
| What range is required? | Determines the minimum bit width. |
| Are negative values possible? | Determines whether signed representation is needed. |
| How will overflow behave? | Determines whether wraparound, saturation, or error handling is required. |
| Who reads the value? | Affects whether binary, decimal, hex, or symbolic display is best. |
| What other system consumes it? | Interfaces must agree on width, endian convention, signedness, and encoding. |
| What hardware cost is acceptable? | Wider representations require more gates, registers, wires, and power. |

Many digital logic errors are representation errors. A value may be stored correctly but interpreted incorrectly. A bus may be wide enough for one interpretation but too narrow for another. A negative number may be accidentally compared as unsigned. A debug display may show hexadecimal while the engineer mentally reads decimal. These are not exotic mistakes; they are ordinary failure modes in real systems, and they are stubborn precisely because every individual component is working — the error exists only in the space between two interpretations.

## Reading Bit Patterns Carefully

When analyzing a digital circuit or a data field, use a disciplined sequence:

1. Identify the width of the field.
2. Identify the representation rule.
3. Determine the range of valid values.
4. Convert only after the rule is known.
5. Check whether arithmetic, comparison, display, and storage all use the same interpretation.

Apply it once. You are handed `1111 1010` from a status register. Width: eight bits. Rule: the datasheet says the upper nibble is four independent flags, the lower an unsigned count. Only now convert: flags 7–4 are set and the count is `1010`, ten. Without step 2, you might have read the byte as unsigned 250 or two's-complement $-6$ — both numerically flawless, both meaningless here.

This habit prevents a common beginner mistake: converting a bit pattern as if binary always means unsigned binary. Binary tells you the symbols being used. Representation tells you what the symbols mean.

## Key Takeaways

- Bits are physical or logical symbols; representation gives them meaning.
- A single bit pattern can represent different values or symbols under different rules, and the correct rule is the one the design contract specifies.
- Unsigned binary uses nonnegative place values.
- Hexadecimal is best treated not as a separate number system but as a shorthand for writing binary, one nibble per digit.
- The number of bits determines the number of available patterns; exceeding the range wraps, saturates, or errors, and the choice among those is part of the contract.
- Two's complement is the standard signed-integer representation in most digital systems; only the top bit's weight changes.
- Many encodings represent symbols, states, or control meanings rather than ordinary numbers — character codes for digits are not the digits' values.
- Representation choices affect range, cost, overflow behavior, interoperability, and debugging.

## Review Questions

### Question 1

The bit pattern `1111` is observed on a four-bit bus. What value does it represent?

A. Always 15
B. Always -1
C. It depends on the representation rule
D. It cannot represent a valid value

### Question 2

Why is hexadecimal commonly used in digital logic documentation?

A. Hexadecimal is what the hardware stores internally
B. One hexadecimal digit corresponds exactly to four binary bits
C. Hexadecimal eliminates overflow
D. Hexadecimal can represent only signed values

### Question 3

How many distinct patterns can be represented with eight bits?

A. 8
B. 16
C. 128
D. 256

### Question 4

In four-bit two's complement, what does `1000` represent?

A. 8
B. -8
C. -1
D. 0

### Question 5

An 8-bit unsigned counter holding 255 is incremented by one, and the design simply lets the addition proceed. What does the counter read next?

A. 256
B. 255
C. 0
D. The hardware halts with an error

### Question 6

One block drives a four-bit bus intending two's complement; the receiving block reads the bus as unsigned. The driver sends the value $-1$. What does the receiver see, and where is the fault?

A. 15; the receiving block's gates are defective
B. 15; the fault is the mismatched interface contract, not any circuit
C. -1; representations do not affect received values
D. 1; the sign bit is dropped in transmission

## Answer Explanations

**1. C.** The same four bits can mean 15 as an unsigned number, -1 as a two's-complement number, or something else under another encoding.

**2. B.** Hexadecimal is a compact human-readable shorthand for binary because each hex digit maps directly to one nibble.

**3. D.** Eight bits provide $2^8 = 256$ distinct bit patterns.

**4. B.** In four-bit two's complement, the most significant bit has weight -8, so `1000` represents -8.

**5. C.** With no saturation or error handling, the addition wraps: `1111 1111` + 1 rolls over to `0000 0000`, so the counter reads 0. Choosing wraparound was itself a representation decision.

**6. B.** The driver puts `1111` on the bus, and the receiver's unsigned reading of `1111` is 15. Every gate operates correctly; the bug lives in the disagreement between the two blocks' representation rules — a contract error, not a circuit error.
