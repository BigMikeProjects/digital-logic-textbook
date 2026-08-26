## Binary Number Basics

This course likes to jump in and start doing things with circuits as quickly as possible. To make that happen, you need just enough understanding of binary numbers to read them, count with them, and talk about them — and that is all this topic asks of you. Conversion techniques, hexadecimal, and negative numbers all get their own topics later; this is the quick start that makes the first circuits possible.

## Why Binary

Digital circuits are built from transistors, and transistors act like switches. A switch that is on can stand for a $1$; a switch that is off can stand for a $0$. Nothing forces that assignment — you could just as well call off a $1$ and on a $0$, and a few real signaling standards do exactly that — but the traditional assignment is the one everyone uses, and it is the one this Infobook uses.

Two levels are all a wire carries, and two levels are enough. An earlier topic explained the payoff: with only two widely separated voltage levels, a signal can pick up a little noise and still be read correctly, because "somewhat low" still reads as low and "somewhat high" still reads as high. Binary is not a mathematical preference; it is what reliable hardware naturally provides.

So the entire alphabet of digital logic is two symbols: $0$ and $1$. A single binary digit is called a **bit**. Everything digital — numbers, text, pictures, this page — is bits arranged in patterns, and most of this course is about giving those patterns meaning.

## Place Values

Binary numbers work the same way decimal numbers do, so start with what you already know. Reading $365$, you automatically count $3$ hundreds, $6$ tens, and $5$ ones:

$365 = 3 \times 100 + 6 \times 10 + 5 \times 1$

Each position is worth ten times the one to its right because decimal has ten symbols. That is a *positional* system: a digit's contribution depends on both the digit and where it sits.

Binary is the same system with only two symbols, so each position is worth **twice** the one to its right. In a four-bit number, the bits run from the **least significant bit (LSB)** on the right to the **most significant bit (MSB)** on the left, with weights

$2^0 = 1, \quad 2^1 = 2, \quad 2^2 = 4, \quad 2^3 = 8$

To read a binary number, add the place values under the $1$s and skip the $0$s. Take $1101_2$:

| Bit position | 3 (MSB) | 2 | 1 | 0 (LSB) |
| --- | ---: | ---: | ---: | ---: |
| Place value | 8 | 4 | 2 | 1 |
| Bit | 1 | 1 | 0 | 1 |

The $8$, the $4$, and the $1$ are switched on; the $2$ is not. So

$1101_2 = 8 + 4 + 1 = 13$

One more, on your own terms this time: $0110_2$ has $1$s in the $4$s and $2$s places, so $0110_2 = 4 + 2 = 6$. The leading zero changes nothing — just as $065$ and $65$ agree in decimal — but circuits have a fixed number of wires, so values are usually written at the full width of the hardware that carries them.

That is the whole skill for now. Later, in *Binary To/From Decimal*, you will learn systematic methods for converting in both directions, including going from decimal back to binary. One preview worth a single line: hexadecimal, covered in its own topics, writes the value $13$ as the single digit $D$ — you will see hex readouts alongside decimal ones in this topic's interactive.

## Counting in Binary

Counting in binary is the odometer idea. Think about what a car odometer does at $099$: the ones digit has run out of symbols, so it rolls back to $0$ and carries; the tens digit is also at its last symbol, so it rolls and carries too; the result is $100$. Nothing new happens in binary — it is just that binary runs out of symbols almost immediately. Decimal runs out at $9$; binary runs out at $1$, so it carries constantly:

$0000, 0001, 0010, 0011, 0100, 0101, 0110, 0111, 1000, \ldots, 1111$

Read one transition closely and the pattern becomes mechanical: from $0011$ to $0100$, two full places roll to $0$ and the carry ripples into the third. The dramatic one is $0111$ to $1000$ — three carries in a single step, exactly like $099$ rolling to $100$.

Why practice this? Because truth tables — the everyday working document of digital logic — list every binary combination of their inputs in counting order. A two-input table's rows are exactly the count $00, 01, 10, 11$; a three-input table counts $000$ through $111$, rows $0$ through $7$. When you can glance at a row's input pattern and know immediately that it is row $5$, truth tables stop being puzzles and become plain reading. The interactive above counts through the four-bit sequence with decimal and hex readouts; play with it until reading a row feels fast.

## Bits Come in Groups

Bits are usually handled in standard-sized groups, and the groups have names worth memorizing:

- A **bit** is one binary digit.
- A **nibble** is 4 bits.
- A **byte** is 8 bits — two nibbles. The right half is the **lower nibble** and the left half is the **upper nibble**.
- A **word** is machine-dependent — 16, 32, or 64 bits depending on the processor — and is built from bytes.

The nibble may look like an odd thing to name, but it earns its keep: one hexadecimal digit describes exactly one nibble, which is the whole reason hex works as a shorthand for binary. The byte is the everyday unit — memory sizes, file sizes, and character codes are all quoted in bytes.

The same place-value reading works at any width; the weights just keep doubling as you move left. Set the lower nibble of a byte to $1111$ and the byte reads $8 + 4 + 2 + 1 = 15$. Turn off those middle $1$s and turn on bit 4 instead: its weight is $2^4 = 16$, so the byte reads $16 + 1 = 17$. Add bit 5, worth $32$, and you get $17 + 32 = 49$. No new rule appeared in that walk — an 8-bit number is read with the same skill and a longer row of weights: $128, 64, 32, 16, 8, 4, 2, 1$.

## Range and Width

The number of bits sets how many patterns are available. One bit has two patterns; add a bit and each existing pattern can take a $0$ or a $1$ in front, doubling the count. So $n$ bits give $2^n$ patterns, and the biggest unsigned value is $2^n - 1$, because one pattern is spent on zero itself:

| Bits | Patterns | Range |
| ---: | ---: | --- |
| 4 | 16 | 0 to 15 |
| 8 | 256 | 0 to 255 |
| 16 | 65,536 | 0 to 65,535 |
| 32 | ~4.3 billion | 0 to 4,294,967,295 |

The table also answers the practical question in reverse: to count something that goes up to $200$, four bits are hopeless and eight are comfortable. The powers of two — $4, 8, 16, 32, 64, 128, 256$, and so on — will show up everywhere in this course and are worth memorizing now. What these patterns can *mean*, and how to choose a width, is the subject of the next topic, *Number Representations*.

## Key Takeaways

Binary uses two symbols because hardware is built from switches, and a bit is one binary digit. Binary is a positional system exactly like decimal, except each place is worth twice — not ten times — the place to its right, so a binary number is read by adding the place values under its $1$s: $1101_2 = 8 + 4 + 1 = 13$. Counting in binary is odometer-style carrying, and fluency matters because truth tables list inputs in binary counting order. Bits group into nibbles (4), bytes (8, two nibbles), and machine-dependent words, and $n$ bits give $2^n$ patterns covering $0$ through $2^n - 1$ — so every added bit doubles the available range.

## Review Questions

### Question 1

What is the decimal value of $1011_2$?

A. 7\
B. 11\
C. 13\
D. 15

### Question 2

In the four-bit number $1101_2$, which bit is the MSB, and what is its place value?

A. The rightmost bit, worth 1\
B. The rightmost bit, worth 8\
C. The leftmost bit, worth 8\
D. The leftmost bit, worth 3

### Question 3

Counting up in binary, what value comes immediately after $0111$?

A. $0112$\
B. $1000$\
C. $1111$\
D. $0110$

### Question 4

A byte contains how many nibbles?

A. 1\
B. 2\
C. 4\
D. 8

### Question 5

How many distinct patterns can an 8-bit number represent, and what is its unsigned range?

A. 8 patterns, 0 to 7\
B. 128 patterns, 0 to 127\
C. 255 patterns, 0 to 254\
D. 256 patterns, 0 to 255

### Question 6

A three-input truth table lists its input combinations in binary counting order. How many rows does it have, and what pattern is in its last row?

A. 3 rows, ending at $011$\
B. 6 rows, ending at $110$\
C. 8 rows, ending at $111$\
D. 9 rows, ending at $1000$

## Answer Explanations

**1. B.** $1011_2 = 8 + 0 + 2 + 1 = 11$. Add the place values under the $1$s and skip the $0$s.

**2. C.** The most significant bit is the leftmost bit, and in a four-bit number its place value is $2^3 = 8$.

**3. B.** Binary runs out of symbols at $1$, so $0111 + 1$ carries through three positions and rolls to $1000$ — the odometer effect.

**4. B.** A byte is 8 bits and a nibble is 4 bits, so a byte splits into a lower nibble and an upper nibble.

**5. D.** With $n = 8$ bits there are $2^8 = 256$ patterns, representing $0$ through $2^8 - 1 = 255$.

**6. C.** Three inputs give $2^3 = 8$ combinations, counted $000$ through $111$ — rows $0$ through $7$.
