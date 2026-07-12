# Binary To/From Hexadecimal

Binary is how digital hardware actually stores and moves numbers, but it is a miserable notation for humans. Consider this 32-bit value:

$$1011\;0101\;1100\;0010\;1010\;1001\;0100\;1111$$

Try to copy it onto a piece of paper without looking back, and then check your work. It is slow, and it is *error-prone* — miss or swap a single bit anywhere in that row and the value is silently wrong, with nothing to tip you off. Now here is the exact same value written in **hexadecimal**:

$$\text{B5C2A94F}$$

Eight characters instead of thirty-two, and far easier to transcribe correctly. This is the whole reason hexadecimal exists in digital work: it is a compact, human-friendly shorthand for binary that a person can read, write, and copy with far less effort and far fewer mistakes.

There is a second, subtler payoff. Suppose two long bit strings differ by exactly one bit. In binary that difference is nearly impossible to spot by eye:

$$1001\;1101\;0011\;1111 \qquad\text{vs.}\qquad 1001\;1101\;0111\;1111$$

Written in hex, the same two values are `9D3F` and `9D7F` — and the difference jumps right out at the third digit, a `3` against a `7`. Because each hex digit summarizes four bits, a localized change shows up as a localized change in the notation instead of hiding in a wall of ones and zeros.

## Base Sixteen, Not Base Six

A quick note on the name. The abbreviation "hex" on its own would literally suggest *base 6*, which is wrong. The full word is **hexadecimal**: *hexa-* (six) plus *decimal* (ten), which is base **16**. We do need base 16 specifically, for a reason that is about to become clear — "hex" is just the everyday shorthand everyone uses.

## The Hex Digits

Counting in base 16 means each digit position must be able to represent sixteen distinct values, `0` through `15`. Decimal only gives us ten single-character symbols, `0`–`9`, so hexadecimal borrows the first six letters of the alphabet to name the values ten through fifteen:

| Hex | Decimal | 4-bit pattern | Hex | Decimal | 4-bit pattern |
|-----|---------|---------------|-----|---------|---------------|
| 0 | 0 | `0000` | 8 | 8 | `1000` |
| 1 | 1 | `0001` | 9 | 9 | `1001` |
| 2 | 2 | `0010` | A | 10 | `1010` |
| 3 | 3 | `0011` | B | 11 | `1011` |
| 4 | 4 | `0100` | C | 12 | `1100` |
| 5 | 5 | `0101` | D | 13 | `1101` |
| 6 | 6 | `0110` | E | 14 | `1110` |
| 7 | 7 | `0111` | F | 15 | `1111` |

The digits `0`–`9` mean exactly what they do in decimal. After that, `A = 10`, `B = 11`, `C = 12`, `D = 13`, `E = 14`, and `F = 15`. Crucially, each hex digit is just the plain decimal value of its four-bit pattern — nothing more exotic is going on. The right-hand column of the table is simply the binary representation of the number in the middle column, and that is the key that makes conversion easy.

## Why Groups of Four

Four bits can represent exactly the range `0` through `15`, which is precisely the range of one hex digit. That is not a coincidence — it is the reason base 16 is the convenient choice rather than, say, base 10. Because $16 = 2^4$, a block of four bits collapses cleanly into a single hex digit with no remainder and no arithmetic across block boundaries. Each group of four bits is called a **nibble**, and the whole conversion reduces to a single rule:

> **A nibble is one hex digit.** Split binary into groups of four bits, name each group, and you have the hex value.

Within a nibble, the four bits carry the familiar place values **8, 4, 2, 1** from left to right. To read a nibble, add up the weights of the bits that are `1`. Take the default the interactive opens on, the 8-bit value `B5`:

$$\underbrace{1011}_{8+2+1\,=\,11\,=\,\text{B}}\;\underbrace{0101}_{4+1\,=\,5}$$

The left nibble `1011` sums to $8 + 2 + 1 = 11$, which is `B`; the right nibble `0101` sums to $4 + 1 = 5$. So `10110101` in binary is `B5` in hex. A few more single-nibble conversions, straight from the weights:

- `1111` $= 8+4+2+1 = 15 =$ **F** (all bits set is always `F`).
- `1001` $= 8+1 = 9$.
- `1010` $= 8+2 = 10 =$ **A**.

## Both Directions Are Easy

The process runs in reverse just as mechanically. To go **binary → hex**, group the bits by four and name each nibble. To go **hex → binary**, expand each hex digit back into its four-bit pattern from the table. For example, `A` becomes `1010` because $8 + 2 = 10$, and stringing the expanded nibbles back together reconstructs the original binary exactly. There is no carrying, no long division, and no conversion through decimal in between — the grouping is a direct, digit-for-nibble substitution in either direction. That symmetry is the entire point of hexadecimal, so do not overcomplicate it.

The interactive for this topic lets you feel this directly. Click any bit to flip it and watch its nibble's hex digit update; select a hex digit and nudge it and watch the four bits underneath rearrange. Reading *down* from bits to a digit is binary → hex; reading *up* from a digit to bits is hex → binary. The same value is shown simultaneously in binary, hex, and decimal so the three representations stay tied together.

## When the Width Isn't a Multiple of Four

Grouping is perfectly clean whenever the number of bits is a multiple of four: 8 bits give 2 hex digits, 16 bits give 4, 32 bits give 8. Real hardware, though, often works with widths like 10 or 12 bits, and 10 is not a multiple of four. The fix is **zero-padding the most significant end**. For an unsigned value, the missing high bits are simply treated as `0`, which never changes the value, and the nibbles are then formed as usual.

Consider a 10-bit unsigned field. Three nibbles cover twelve bit positions, so the top nibble borrows two padding zeros and only its lower two bits are "real":

$$\underbrace{00}_{\text{pad}}\,\underbrace{xx}_{\text{2 real bits}}\;\;\underbrace{xxxx}_{\text{nibble}}\;\;\underbrace{xxxx}_{\text{nibble}}$$

The consequence is worth noticing: because the top nibble has only two usable bits, its value can be at most `0011` = **3**. It can never reach `F` — there simply aren't enough real bits up there to make a larger digit. Widen the field to 12 bits and you are back to a whole number of nibbles, the top digit regains all four of its bits, and its full `0`–`F` range is restored. In the interactive, sweep the bit-width control down to 10 and try to push the leading digit past `3`: the padded positions light up as phantom bits and refuse, which is exactly this constraint made visible.

## Hexadecimal in Verilog

This is not just a notation for scratch paper. Hardware description languages let you write literals directly in hex, which is why you see hex constants throughout real designs. In Verilog the form is `<width>'h<digits>`:

```verilog
// An 8-bit register loaded with a hex constant
reg [7:0]  status;
initial status = 8'hB5;          // 8'hB5 == 8'b1011_0101 == 181

// The same 32-bit value from the opening example
wire [31:0] pattern = 32'hB5C2A94F;

// A 10-bit unsigned field: the top hex digit can only reach 3
reg [9:0]  addr = 10'h3FF;        // all ten bits set == 1023
```

Writing `8'hB5` instead of `8'b10110101` is shorter and less error-prone for exactly the reasons this whole topic is about — and the synthesizer treats the two forms as identical bits. Note the 10-bit case: `10'h3FF` is the largest 10-bit value, and its leading digit is `3`, not `F`, precisely because of the padding rule above.

## Key Takeaways

Hexadecimal is base 16, a compact human-readable shorthand for binary that makes long bit patterns easier to read, copy, and compare — a single mistyped bit is far more likely to be caught, and a one-bit difference between two values is far easier to spot. Its digits are `0`–`9` followed by `A`–`F` for the values ten through fifteen, and each digit is simply the decimal value of a four-bit **nibble**, with the bits carrying place values 8-4-2-1. Because $16 = 2^4$, conversion is a direct digit-for-nibble substitution that works identically in both directions: group binary into fours to get hex, expand each hex digit into four bits to get binary — no decimal detour required. When the bit width is not a multiple of four, pad the most significant end with zeros; this leaves the top hex digit with fewer real bits, capping its value (a 10-bit field's leading digit maxes out at `3`). Hardware description languages such as Verilog let you write these values directly as hex literals like `8'hB5`, which is why fluent binary↔hex conversion is an everyday skill in digital design.

## Review Questions

**1. Why is hexadecimal preferred over binary for humans reading and writing long values?**
A. It lets the hardware store numbers using fewer transistors
B. It is more compact and less error-prone to read, copy, and compare
C. It allows fractional values that binary cannot represent
D. It is the only base a computer can actually process

**2. What is the hexadecimal digit for the 4-bit pattern `1011`?**
A. 9
B. A
C. B
D. D

**3. Hexadecimal is base 16 because each hex digit maps to how many bits?**
A. 2 bits
B. 3 bits
C. 4 bits
D. 8 bits

**4. What is the binary expansion of the hex value `A`?**
A. `1000`
B. `1010`
C. `1100`
D. `1110`

**5. A 10-bit unsigned value is written in hexadecimal by padding the high bits with zeros. What is the largest value its most-significant hex digit can take?**
A. F
B. 7
C. 3
D. 1

**6. In Verilog, what does the literal `8'hB5` represent?**
A. The 8-bit binary pattern `10110101`
B. The decimal number 85
C. A hexadecimal value that is 8 hex digits wide
D. An error, because `B` is not a valid digit

## Answer Explanations

**1. B.** Hexadecimal does not change how the hardware stores anything — the underlying bits are identical. Its value is purely for humans: four times shorter than binary, so it is quicker to read and copy, easier to transcribe without error, and it makes a one-bit difference between two values (like `9D3F` vs `9D7F`) far easier to notice.

**2. C.** The nibble `1011` has bits set at place values 8, 2, and 1, which sum to $8 + 2 + 1 = 11$. The hex digit for eleven is `B`.

**3. C.** Four bits span the range `0`–`15`, which is exactly the range of one hex digit, and $16 = 2^4$. That clean match is why grouping bits by four converts to hexadecimal with no leftover bits — the defining reason base 16 is used.

**4. B.** `A` is the hex digit for decimal 10. Ten as a four-bit pattern is $8 + 2 = 10$, or `1010`. Hex → binary is just expanding each digit into its four-bit pattern.

**5. C.** Three nibbles cover twelve bit positions, but a 10-bit value fills only ten of them, so the top nibble is padded with two leading zeros and has just two real bits. Two bits reach at most `0011`, which is `3`; the digit cannot climb to `F` until the width grows to a full 12 bits.

**6. A.** The Verilog form `<width>'h<digits>` gives a value in hex. Here `8'h` means an 8-bit value and `B5` is the hex content, so the bits are `1011 0101`. (That equals decimal 181, not 85, and `B` is a perfectly valid hex digit.)
