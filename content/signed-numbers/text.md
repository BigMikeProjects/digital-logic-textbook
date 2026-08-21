# Signed Numbers

The ten's complement and two's complement topics built the machinery; this topic arrives at the destination: **representing signed numbers**. A signed representation has three kinds of values to handle — positive numbers, negative numbers, and zero — and two's complement handles all three cleanly. That's why it is *the* signed representation real hardware uses.

## Zero: a Non-Issue

Start with the case that requires no work at all. Two's complement has a **single representation of zero** — the all-zeros pattern, and nothing else. That sounds unremarkable until you learn that older schemes (like sign-magnitude) ended up with *two* zeros, a positive and a negative one, which complicated comparisons and wasted a pattern. In two's complement, zero is just zero, so we really don't have to worry about it.

## Positive Numbers Are Easy

For positive numbers the encoding is exactly what you already know: convert the magnitude to binary, and you're done — **the complement steps are skipped entirely**. Encoding $+5$ in four bits is simply $0101_2$; encoding $+7$ in five bits is $00111_2$. The only new detail is bookkeeping: with $n$ bits, the top bit is reserved as the **sign bit**, so the magnitudes that fit are $0$ through $2^{n-1}-1$ (0 through 7 in four bits). A positive number's sign bit — its MSB — is 0.

## The Sign Bit Is a Weight

Here is the mental model that makes two's complement patterns *readable* rather than mysterious. The most significant bit isn't a flag stapled onto the number — it's a digit whose place weight is **negative**:

$$\text{MSB weight} = -2^{\,n-1}$$

With four bits, the weights are $-8,\ 4,\ 2,\ 1$. Decoding any pattern is ordinary place-value addition with that one twist:

$$1011_2 = -8 + 2 + 1 = -5$$

At five bits the MSB weight becomes $-16$, and a pattern like $10010_2$ reads as $-16 + 2 = -14$. Any pattern with the sign bit set is negative — the positive weights ($4+2+1 = 7$ in four bits) can never climb back above zero once $-8$ is in play. This weighted view is why the sign bit's value follows automatically: an MSB of 0 contributes nothing, an MSB of 1 contributes a large negative number that the rest of the bits partially fill back in.

## Encoding a Negative Number

The interesting case is encoding a negative. The process is the two's complement recipe applied to the magnitude:

1. Take the **magnitude** of the number and write it in binary.
2. **Flip every bit.**
3. **Add 1.**

**Worked example — $-5$ in four bits:**

$$5 = 0101_2 \;\xrightarrow{\text{flip}}\; 1010_2 \;\xrightarrow{+1}\; 1011_2$$

And the answer agrees with the weighted decode above: $1011_2 = -8+2+1 = -5$. ✓

**A second example — $-7$ in five bits** (it fits, since five bits reach down to $-16$):

$$7 = 00111_2 \;\xrightarrow{\text{flip}}\; 11000_2 \;\xrightarrow{+1}\; 11001_2$$

## Close the Loop: the $x - 2^n$ Check

Any encoding answer should be checked, and there's a fast check that uses a *different* route to the value — read the pattern as an **unsigned** number and subtract $2^n$:

$$\text{signed value} = (\text{unsigned reading}) - 2^n \qquad\text{(when the sign bit is 1)}$$

For the four-bit $-5$: the pattern $1011_2$ reads as $8 + 3 = 11$ unsigned, and $11 - 16 = -5$. ✓ For the five-bit $-7$: $11001_2$ reads as $16+8+1 = 25$, and $25 - 32 = -7$. ✓ Two independent techniques landing on the same value is how you *close the loop* — the same habit as the convert-back checks in the base-conversion topics. (You can also use $x - 2^n$ in reverse as an alternate way to *compute* an encoding: the pattern for $-5$ is the unsigned representation of $16 - 5 = 11$.)

## Subtraction Is Built In

The payoff for all of this — the reason two's complement won — is that **subtraction comes free with an addition circuit**. Compute $6 - 5$ as $6 + (-5)$:

$$\begin{array}{r} 0110 \\ +\ 1011 \\ \hline 1\,0001 \end{array}$$

Working the columns right to left: $0+1=1$; $1+1=0$ carry 1; $1+0+1=0$ carry 1; $0+1+1=0$ carry 1 — and that final carry lands in the *extra* bit position, where we **ignore it** (a four-bit register has nowhere to put it). The answer is $0001_2 = 1$, and indeed $6-5=1$.

Now contrast a case where the answer is negative — $6 + (-7)$ in five bits:

$$00110_2 + 11001_2 = 11111_2$$

This time there is **no carry out** — nothing spills into the extra position — and the sign bit of the result stays 1. The pattern $11111_2$ is all ones, which decodes to $-16+8+4+2+1 = -1$: exactly right, since $6-7=-1$. Both behaviors are the same machinery: when the true result is representable, the arithmetic simply works, carry-out or not.

## The Range at $n$ Bits

The number of bits sets the range, and the range is **asymmetric**:

| Bits | Lowest | Highest |
|:---:|:---:|:---:|
| 4 | $-8$ | $+7$ |
| 5 | $-16$ | $+15$ |
| 6 | $-32$ | $+31$ |
| $n$ | $-2^{\,n-1}$ | $+2^{\,n-1}-1$ |

There is one more negative value than positive — the all-zeros pattern spends one non-negative slot on zero itself. The interactive for this topic has a bit-width control (N = 4, 5, 6): change it and watch the sign weight, the pattern strip, and the range all move together. Knowing whether a value *fits* at a given width — $-7$ fits in five bits; $+35$ does not fit in six — is a question you'll answer constantly in hardware, where every register has a fixed width. We'll say more about range in class.

## Key Takeaways

Two's complement represents all three kinds of signed values with one clean scheme: zero has a single representation, positives are just their magnitudes with an MSB of 0 (no complement steps needed), and negatives are encoded magnitude → flip → add 1. The readable mental model is that the MSB is a digit with weight $-2^{n-1}$, so any pattern decodes by ordinary place-value addition. Check encodings by the independent $x - 2^n$ route — unsigned reading minus $2^n$ — to close the loop. The payoff is that subtraction is built in: add the negative's pattern, ignore any carry beyond the word, and the result is correct whether or not a carry-out occurs. At $n$ bits the range runs $-2^{n-1}$ to $+2^{n-1}-1$, one extra value on the negative side.

## Review Questions

**1. What is an advantage of two's complement regarding zero?**
A. Zero has two representations, one positive and one negative
B. Zero has exactly one representation — the all-zeros pattern
C. Zero cannot be represented, saving a pattern
D. Zero is represented by the all-ones pattern

**2. Using the weighted view of the sign bit, what is the value of the 4-bit pattern $1101_2$?**
A. $-3$
B. $13$
C. $-5$
D. $-13$

**3. What is the two's complement encoding of $-6$ in 4 bits?**
A. `0110`
B. `1001`
C. `1010`
D. `1110`

**4. The $x - 2^n$ check reads a pattern as unsigned and subtracts $2^n$. Checking the 5-bit pattern `11001`: unsigned it is 25, so its signed value is:**
A. $-7$, because $25 - 32 = -7$
B. $+25$, because the check changes nothing
C. $-25$, because the sign bit negates the reading
D. $7$, because $32 - 25 = 7$

**5. How is a POSITIVE number like $+5$ encoded in two's complement?**
A. Magnitude → flip every bit → add 1
B. Just convert the magnitude to binary — the complement steps are skipped, and the MSB is 0
C. Set the sign bit to 1 and append the magnitude
D. Subtract it from $2^n$

**6. What is the range of values a 6-bit two's complement number can represent?**
A. $-32$ to $+31$
B. $-31$ to $+32$
C. $-64$ to $+63$
D. $0$ to $63$

## Answer Explanations

**1. B.** Two's complement has a single zero: `0000…0`. Older schemes like sign-magnitude carried both a $+0$ and a $-0$, wasting a pattern and complicating equality tests — one of the practical reasons two's complement replaced them.

**2. A.** Weights at four bits are $-8, 4, 2, 1$. The pattern $1101$ sums $-8 + 4 + 1 = -3$. Reading it as all-positive weights gives 13 (option B) — that's the unsigned reading, which the sign-bit weight corrects. (Check: $13 - 16 = -3$ ✓.)

**3. C.** Magnitude $6 = 0110$; flip → $1001$; add 1 → $1010$. Option B stops after the flip (the one's complement — the +1 is missing). Close the loop: unsigned $1010$ is 10, and $10 - 16 = -6$ ✓.

**4. A.** With the sign bit set, signed value = unsigned reading − $2^n$: $25 - 32 = -7$. The check works because a two's complement pattern *is* the unsigned representation of $x + 2^n$ — the same fixed-width wrap that made ten's complement work.

**5. B.** Positives need no complement machinery at all: encode the magnitude, and the MSB is naturally 0 (provided the value fits in $2^{n-1}-1$). The flip-and-add-1 recipe (option A) is only for negatives; option D describes encoding $-5$, not $+5$.

**6. A.** At $n$ bits the range is $-2^{n-1}$ to $+2^{n-1}-1$: for six bits, $-32$ to $+31$. It's asymmetric — one extra negative — because zero occupies one of the patterns on the non-negative side.
