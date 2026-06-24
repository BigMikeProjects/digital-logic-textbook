# Binary To/From Decimal

We think in decimal, but digital hardware runs on binary. Working with digital systems therefore means constantly translating between the two: reading a binary value as a familiar decimal number, and encoding a decimal quantity as the bits a circuit actually stores. This section first explains *why* machines use binary at all, then covers the conversions in both directions — binary to decimal by positional weights, and decimal to binary by two equivalent procedures.

## Why Binary?

Digital hardware is built from switches. A transistor behaves like a switch with two clean states: **OFF** (a voltage near 0 V) or **ON** (a voltage near the supply). Two states are cheap, fast, and extremely reliable to manufacture by the billion, which is the first reason computers count in binary.

The second reason is **noise immunity**. With only two valid levels, the LOW band and the HIGH band can sit far apart, separated by a "forbidden" gap. A little electrical noise nudges a signal but never pushes it across that gap, so the intended bit is read correctly every time. If instead we tried to pack ten distinct voltage levels into the same range to store a decimal digit directly, the levels would be cramped together and the smallest disturbance could flip one digit into another. Two well-separated states win.

Finally, **everything becomes bits**. Numbers, text, images, and audio are all encoded as sequences of 1s and 0s. Each **bit** — short for *binary digit* — answers a single yes/no question, and a group of $n$ bits can represent $2^n$ distinct values. The rest of this section is about moving a value between the decimal we read and the binary the hardware holds.

## Binary → Decimal: Add the Place Values

A binary number, like a decimal one, is **positional**: each digit carries a weight determined by its position. In binary the weights are powers of two. The rightmost bit has weight $2^0 = 1$ and is called the **least-significant bit (LSB)**; each step to the left doubles the weight — $1, 2, 4, 8, 16, \dots$ — up to the **most-significant bit (MSB)** on the far left.

To convert, multiply each bit by its weight and add the columns where the bit is $1$. Take $1101_2$:

| Bit | 1 | 1 | 0 | 1 |
|-----|---|---|---|---|
| Weight | $2^3=8$ | $2^2=4$ | $2^1=2$ | $2^0=1$ |
| Contribution | 8 | 4 | 0 | 1 |

$$1101_2 = 1\cdot 8 + 1\cdot 4 + 0\cdot 2 + 1\cdot 1 = 8 + 4 + 1 = 13_{10}$$

Only the positions holding a $1$ contribute, so in practice you just add up the weights of the $1$ bits. The same procedure handles any width: $10110_2 = 16 + 4 + 2 = 22_{10}$, $100101_2 = 32 + 4 + 1 = 37_{10}$, and $11111_2 = 16 + 8 + 4 + 2 + 1 = 31_{10}$.

## Decimal → Binary: Two Methods

Going the other way — decimal to binary — there are two standard procedures. They always produce the same answer; pick whichever you find easier to execute.

### The Division (Remainder) Method

Repeatedly divide the number by $2$, writing down the quotient and the **remainder** at each step, until the quotient reaches $0$. Each remainder is one bit. The catch is the order: the **first** remainder you produce is the **LSB**, so you read the remainders **from bottom to top**. Converting $13$:

| Step | Quotient | Remainder |
|------|----------|-----------|
| $13 \div 2$ | $6$ | $\mathbf{1}$ ← LSB (first) |
| $6 \div 2$ | $3$ | $0$ |
| $3 \div 2$ | $1$ | $1$ |
| $1 \div 2$ | $0$ | $\mathbf{1}$ ← MSB (last) |

Reading the remainders bottom-up gives $1101_2 = 13_{10}$, which matches the conversion above. Because the first remainder is the LSB, the division method builds the answer **right to left**. (Why does the remainder give the bit? Dividing by two strips off the lowest bit as the remainder and shifts everything else down — exactly the inverse of stacking up powers of two.)

### The Powers-of-Two Method

Alternatively, work from the largest power of two downward. Find the biggest power of two that is less than or equal to the number, subtract it, and place a $1$ in that column. Then move to each smaller power in turn, placing a $1$ (and subtracting) wherever it fits and a $0$ wherever it does not. Converting $13$:

| Power | Fits in remaining? | Bit | Left over |
|-------|--------------------|-----|-----------|
| $8$ | yes, $13 - 8 = 5$ | $1$ | $5$ |
| $4$ | yes, $5 - 4 = 1$ | $1$ | $1$ |
| $2$ | no | $0$ | $1$ |
| $1$ | yes, $1 - 1 = 0$ | $1$ | $0$ |

Reading top to bottom gives $1101_2$, the same result. Notice that this method is just **binary → decimal run in reverse**: instead of adding up place values, it fills them in directly, MSB first (left to right). The division method builds the bits LSB first; the powers method builds them MSB first; both land on the same binary string.

## A Note on Width and Leading Zeros

The number of bits you write is a separate choice from the value. $13_{10} = 1101_2$ in four bits, but the same value is $00001101_2$ in an eight-bit register — the leading zeros change nothing about the quantity. Hardware works with fixed-width values (8, 16, 32 bits), so it is common to pad a converted number with leading zeros to the register width.

## Key Takeaways

Computers use binary because hardware is made of two-state switches: two levels are cheap to build and have wide noise margins, and $n$ bits encode $2^n$ values. A binary number is positional with power-of-two weights, the rightmost bit being $2^0$ (the LSB). To convert **binary → decimal**, multiply each bit by its weight and add the columns that hold a $1$ — for example $1101_2 = 8+4+1 = 13_{10}$. To convert **decimal → binary**, either repeatedly **divide by 2** and read the remainders bottom-up (building LSB first), or repeatedly **subtract the largest power of 2 that fits** and place a $1$ (building MSB first). The two decimal-to-binary methods are mirror images of each other and always agree. The interactive for this topic walks all three procedures on the examples 13, 22, 37, and 31 so you can watch the bits and place values line up.

## Review Questions

**1. Why is binary, rather than decimal, used inside digital hardware?**
A. Binary numbers are always shorter than decimal numbers
B. Transistors are two-state switches, and two well-separated levels are cheap to build and resist noise
C. Decimal cannot represent fractions
D. Binary avoids the need for any voltage at all

**2. What is the decimal value of $10110_2$?**
A. 18
B. 20
C. 22
D. 26

**3. In the division method for decimal → binary, how do you read the remainders to get the answer?**
A. Top to bottom, because the first remainder is the MSB
B. Bottom to top, because the first remainder is the LSB
C. In any order, since position does not matter
D. Left to right across the quotients

**4. Using the powers-of-two method, what is $37_{10}$ in binary?**
A. `100101`
B. `101001`
C. `110010`
D. `100110`

**5. How many distinct values can be represented with $n$ bits?**
A. $2n$
B. $n^2$
C. $2^n$
D. $10^n$

**6. Converting $13_{10}$ by the division method gives remainders 1, 0, 1, 1 in the order they are produced. What is the binary result, and why?**
A. `1011`, reading the remainders in the order produced
B. `1101`, because the remainders are read bottom-up (first remainder is the LSB)
C. `0110`, after dropping the first remainder
D. `1110`, because the last remainder is the LSB

## Answer Explanations

**1. B.** Hardware is built from transistors that act as two-state switches. Two states are inexpensive and reliable to manufacture, and the wide gap between the LOW and HIGH bands gives strong noise immunity — small disturbances never flip the bit. Binary numbers are not generally shorter than their decimal equivalents (option A), and binary still relies on voltages (option D).

**2. C.** $10110_2 = 16 + 0 + 4 + 2 + 0 = 22_{10}$. Add the weights of the columns holding a $1$: the $2^4=16$, $2^2=4$, and $2^1=2$ positions.

**3. B.** Each division by two peels off the lowest bit as its remainder, so the first remainder is the least-significant bit. Reading the remainders from bottom to top therefore assembles the number from MSB down to LSB correctly.

**4. A.** $37 = 32 + 4 + 1$: the power $32$ fits ($37-32=5$) → 1, $16$ no → 0, $8$ no → 0, $4$ fits ($5-4=1$) → 1, $2$ no → 0, $1$ fits → 1, giving $100101_2$.

**5. C.** Each bit independently takes one of two values, so $n$ bits give $2 \times 2 \times \dots = 2^n$ distinct combinations.

**6. B.** The remainders are produced LSB first, so the order produced (1, 0, 1, 1) must be reversed when read as a binary number. Reading bottom-up gives $1101_2 = 13_{10}$, which checks out as $8+4+1$.
