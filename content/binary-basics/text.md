## Binary Number Basics

This course likes to jump in and start doing things with circuits as quickly as possible. To make that happen, you need just enough understanding of binary numbers to read them, count with them, and talk about them — and that is all this topic asks of you. Conversion techniques, hexadecimal, and negative numbers all get their own topics later; this is the quick start.

## Why Binary

Digital circuits are built from transistors, and transistors act like switches. A switch that is on can stand for a $1$; a switch that is off can stand for a $0$. Nothing forces that assignment — you could just as well call off a $1$ and on a $0$ — but the traditional assignment is the one everyone uses, and it is the one this Infobook uses.

Two levels are all a wire carries, and two levels are enough. An earlier topic explained the payoff: with only two widely separated voltage levels, a signal can pick up a little noise and still be read correctly. Binary is not a mathematical preference; it is what reliable hardware naturally provides.

So the entire alphabet of digital logic is two symbols: $0$ and $1$. A single binary digit is called a **bit**. Everything digital — numbers, text, pictures, this page — is bits arranged in patterns, and most of this course is about giving those patterns meaning.

## Place Values

Binary numbers work the same way decimal numbers do: each position carries a weight, and each position is worth twice the one to its right. In a four-bit number, the bits run from the **least significant bit (LSB)** on the right to the **most significant bit (MSB)** on the left, with weights

$2^0 = 1, \quad 2^1 = 2, \quad 2^2 = 4, \quad 2^3 = 8$

To read a binary number, add the place values under the $1$s and skip the $0$s. Take $1101_2$:

| Bit position | 3 (MSB) | 2 | 1 | 0 (LSB) |
| --- | ---: | ---: | ---: | ---: |
| Place value | 8 | 4 | 2 | 1 |
| Bit | 1 | 1 | 0 | 1 |

The $8$, the $4$, and the $1$ are switched on; the $2$ is not. So

$1101_2 = 8 + 4 + 1 = 13$

That is the whole skill for now. Later, in *Binary To/From Decimal*, you will learn systematic methods for converting in both directions. One preview worth a single line: hexadecimal, covered in its own topics, writes the value $13$ as the single digit $D$ — you will see hex readouts alongside decimal ones in this topic's interactive.

## Counting in Binary

Counting in binary is the odometer idea. When a digit position runs out of symbols, it rolls back to $0$ and carries into the next position. Decimal runs out at $9$; binary runs out at $1$, so it carries constantly:

$0000, 0001, 0010, 0011, 0100, 0101, 0110, 0111, 1000, \ldots, 1111$

Watch the roll from $0111$ to $1000$ — three carries ripple in a single step, exactly like $099$ rolling to $100$ on an odometer.

Why practice this? Because truth tables — the everyday working document of digital logic — list every binary combination of their inputs in counting order, and you will constantly need the decimal equivalent of a row at a glance. By the end of the course, counting in binary should feel automatic. The interactive above counts through the four-bit sequence and shows the decimal and hex equivalents of each value; play with it until reading a row feels fast.

## Bits Come in Groups

Bits are usually handled in standard-sized groups, and the groups have names worth memorizing:

- A **bit** is one binary digit.
- A **nibble** is 4 bits.
- A **byte** is 8 bits — two nibbles. The right half is the **lower nibble** and the left half is the **upper nibble**.
- A **word** is machine-dependent — 16, 32, or 64 bits depending on the processor — and is built from bytes.

The same place-value reading works at any width. Set the lower nibble of a byte to $1111$ and the byte reads $15$. Turn off the $1$s place and turn on bit 4 instead: $16 + 1 = 17$. Add bit 5 and you add $32$: $17 + 32 = 49$. Nothing new happened — the weights just keep doubling as you move left.

## Range and Width

The number of bits sets how many patterns are available. With $n$ bits there are $2^n$ patterns, so an unsigned $n$-bit number runs from $0$ up to $2^n - 1$:

| Bits | Patterns | Range |
| ---: | ---: | --- |
| 4 | 16 | 0 to 15 |
| 8 | 256 | 0 to 255 |
| 16 | 65,536 | 0 to 65,535 |
| 32 | ~4.3 billion | 0 to 4,294,967,295 |

The powers of two — 4, 8, 16, 32, and so on — will show up everywhere in this course; they are worth starting to memorize now. What these patterns can *mean*, and how to choose a width, is the subject of the next topic, *Number Representations*.

## Key Takeaways

Binary uses two symbols because hardware is built from switches, and a bit is one binary digit. Positions carry place values that double from the LSB leftward to the MSB, so a binary number is read by adding the place values under its $1$s — $1101_2 = 8 + 4 + 1 = 13$. Counting in binary is odometer-style carrying, and fluency matters because truth tables list inputs in binary counting order. Bits group into nibbles (4), bytes (8), and machine-dependent words, and $n$ bits give $2^n$ patterns covering $0$ through $2^n - 1$.

## Review Questions

### Question 1

What is the decimal value of $1011_2$?

A. 7
B. 11
C. 13
D. 15

### Question 2

In the four-bit number $1101_2$, which bit is the MSB, and what is its place value?

A. The rightmost bit, worth 1
B. The rightmost bit, worth 8
C. The leftmost bit, worth 8
D. The leftmost bit, worth 3

### Question 3

Counting up in binary, what value comes immediately after $0111$?

A. $0112$
B. $1000$
C. $1111$
D. $0110$

### Question 4

A byte contains how many nibbles?

A. 1
B. 2
C. 4
D. 8

### Question 5

How many distinct patterns can an 8-bit number represent, and what is its unsigned range?

A. 8 patterns, 0 to 7
B. 128 patterns, 0 to 127
C. 255 patterns, 0 to 254
D. 256 patterns, 0 to 255

## Answer Explanations

**1. B.** $1011_2 = 8 + 0 + 2 + 1 = 11$. Add the place values under the $1$s and skip the $0$s.

**2. C.** The most significant bit is the leftmost bit, and in a four-bit number its place value is $2^3 = 8$.

**3. B.** Binary runs out of symbols at $1$, so $0111 + 1$ carries through three positions and rolls to $1000$ — the odometer effect.

**4. B.** A byte is 8 bits and a nibble is 4 bits, so a byte splits into a lower nibble and an upper nibble.

**5. D.** With $n = 8$ bits there are $2^8 = 256$ patterns, representing $0$ through $2^8 - 1 = 255$.
