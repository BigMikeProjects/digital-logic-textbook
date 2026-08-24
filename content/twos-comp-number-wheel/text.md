## The Two's Complement Number Wheel

Two's complement is easy to define and surprisingly easy to misjudge. The rules for building a negative number are mechanical, but the *behavior* of the system — why the pattern just below zero is all ones, why adding can produce a wrong sign, why hardware has to watch for it — is hard to see in a column of bit patterns. The **number wheel** is a mental model that makes all of that visible at once: arrange every representable value around a circle, and arithmetic becomes motion around that circle. The video and the interactive above both use it; this topic explains what the wheel shows and why it is drawn the way it is.

## Reading the Wheel

Take a 4-bit word. It has sixteen bit patterns, `0000` through `1111`, and the wheel places them evenly around a circle in counting order, clockwise. In two's complement, the top half of the patterns — those with a leading 0 — are the non-negative numbers $0$ to $+7$, and the patterns with a leading 1 are the negatives, $-8$ to $-1$. On the wheel, $0$ sits at the top, the positives run clockwise down one side, the negatives run clockwise up the other, and the two groups meet at the bottom where $+7$ (`0111`) is next to $-8$ (`1000`).

| Position (clockwise from 0) | Bit pattern | Two's complement value |
|---|---|---|
| 0 | `0000` | $0$ |
| 1 | `0001` | $+1$ |
| 2 | `0010` | $+2$ |
| 3 | `0011` | $+3$ |
| 4 | `0100` | $+4$ |
| 5 | `0101` | $+5$ |
| 6 | `0110` | $+6$ |
| 7 | `0111` | $+7$ |
| 8 | `1000` | $-8$ |
| 9 | `1001` | $-7$ |
| 10 | `1010` | $-6$ |
| 11 | `1011` | $-5$ |
| 12 | `1100` | $-4$ |
| 13 | `1101` | $-3$ |
| 14 | `1110` | $-2$ |
| 15 | `1111` | $-1$ |

Start at zero, and note the first advantage of two's complement: there is exactly **one representation of zero**. Sign-magnitude and one's complement both waste a pattern on a "negative zero"; two's complement spends that pattern on $-8$ instead, which is why the negative range reaches one further than the positive range.

From zero, the two rules of the wheel are:

- **Adding moves you clockwise.** Each $+1$ is one step clockwise.
- **Subtracting moves you counterclockwise.** Each $-1$ is one step counterclockwise.

Press *Add +1* and *Subtract 1* in the interactive and watch the marker move. Nothing else is happening: two's complement arithmetic *is* this motion.

## Why $-1$ Is All Ones

Newcomers usually find one thing strange: take one step below zero and you land on `1111`, the all-ones pattern. On the wheel this is not strange at all — `1111` is simply the position counterclockwise-adjacent to zero, so it *has* to be $-1$.

The bit patterns tell the same story. Counting down from `0000` in binary requires a borrow from a bit that does not exist, so the subtraction wraps: `0000` $- 1 =$ `1111`, just as a four-digit odometer rolling backward from 0000 shows 9999. In arithmetic terms, a 4-bit system works modulo $2^4 = 16$, and $-1 \equiv 15 \pmod{16}$; $15$ is `1111`. That is the sense in which two's complement has subtraction *built into* its representation: the pattern for $-k$ is whatever pattern is $k$ steps counterclockwise from zero, which is the pattern for $16 - k$.

Check it against the table: $-4$ is four steps counterclockwise from zero, position $12$, `1100` — and $16 - 4 = 12$. The wheel and the modular arithmetic are the same fact drawn two ways.

## Arithmetic as Motion

To compute $-4 + 5$, start at $-4$ (`1100`) and step **five positions clockwise**: $-3, -2, -1, 0, +1$. You land on $+1$ (`0001`). Notice that the path crosses zero without any special handling — the wheel has no seam at the top, so adding a positive number to a negative one just works.

A second example, this time a subtraction: $3 - 5$. Start at $+3$ (`0011`) and step **five positions counterclockwise**: $2, 1, 0, -1, -2$. You land on $-2$, and reading the table, $-2$ is `1110`. Now do the same problem the way an adder circuit does it, by adding the two's complement of $5$: `0011` $+$ `1011` $=$ `1110`. Same answer, same pattern. The circuit adds a pattern that is five steps *back* around the wheel, which is exactly what stepping counterclockwise means — this is why a single adder handles both addition and subtraction in two's complement hardware.

## Changing the Word Size

The same wheel can be drawn for any word size; only the number of positions changes. A 3-bit wheel has $2^3 = 8$ positions and runs from $-4$ to $+3$. A 5-bit wheel has $32$ positions and runs from $-16$ to $+15$ — the interactive's *5-bit* view is visibly more crowded, but the rules are identical. In general an $n$-bit two's complement wheel holds values from $-2^{\,n-1}$ to $+2^{\,n-1}-1$, with zero at the top, the most positive and most negative values side by side at the bottom, and $-1$ always the all-ones pattern next to zero.

## Overflow and Underflow

The wheel has one seam: the bottom, where $+7$ sits beside $-8$. Every wrong answer in fixed-width signed arithmetic comes from crossing it.

- **Overflow** is stepping clockwise past the most positive value. On the 4-bit wheel, $7 + 1$ moves one step clockwise from `0111` to `1000` — which reads as $-8$. The true answer, $+8$, does not exist in four bits, and the wheel delivers the wrong sign instead. The interactive's *Show Overflow* button walks this step and flags "positive wrapped to negative."
- **Underflow** is the mirror case: stepping counterclockwise past the most negative value. At $-8$ (`1000`), subtracting $1$ does **not** give $-9$; it moves counterclockwise to `0111`, which is $+7$. *Show Underflow* walks this one — "negative wrapped to positive."

Both are silent in the bit patterns: `1000` is a perfectly valid word, and nothing about it says "this used to be $+8$." The crossing is visible only if you know where the operands started. That gives a rule hardware can check without a wheel: **when two numbers of the same sign are added, the result must have that sign.** If two positives produce a negative, or two negatives produce a positive, the seam was crossed. Adding numbers of opposite sign can never overflow — the result lies between the operands, and the path never reaches the bottom of the wheel. Adders in real processors compute exactly this check and raise an **overflow flag** so that software can respond.

## Why Hardware Cares

A pencil-and-paper calculation can grow a new digit whenever it needs one. A register cannot; its width is fixed when the chip is built. The number wheel is the honest picture of that constraint: a finite set of positions joined into a loop, so that every path eventually comes back around. Most of the time the loop is invisible, because typical values stay far from the seam. The wheel's job is to keep the seam in view — to remind you that $+7 + 1$ is not $+8$ in four bits, that the fix is either more bits or a detected overflow, and that the same circuit that makes subtraction free (adding a pattern from the other side of the wheel) is the circuit that can quietly hand you the wrong sign.

## Key Takeaways

The two's complement number wheel arranges all $2^n$ bit patterns of an $n$-bit word around a circle in counting order: zero at the top, positives clockwise down one side, negatives up the other, meeting at the seam between $+2^{\,n-1}-1$ and $-2^{\,n-1}$. Adding moves clockwise; subtracting moves counterclockwise. There is one zero, and $-1$ is the all-ones pattern because it is one step counterclockwise from zero — two's complement is arithmetic modulo $2^n$. Overflow is stepping past the most positive value (the sign flips to negative); underflow is stepping past the most negative value (the sign flips to positive). Hardware detects both by checking that same-sign operands produce a same-sign result.

## Review Questions

### Question 1

On a 4-bit two's complement wheel, what does one step counterclockwise from $0$ (`0000`) land on?

A. `0001`, the value $+1$
B. `1000`, the value $-8$
C. `1111`, the value $-1$
D. `0111`, the value $+7$

### Question 2

Starting at $-4$ and stepping five positions clockwise on a 4-bit wheel gives:

A. $+1$
B. $-9$
C. $+9$
D. $-1$

### Question 3

Which pair of values sits side by side at the seam of the 4-bit wheel?

A. $0$ and $-1$
B. $+7$ and $-8$
C. $+7$ and $0$
D. $-8$ and $-1$

### Question 4

In four bits, $7 + 1$ produces the pattern `1000`. What has happened?

A. The result is $+8$, correctly represented
B. Overflow: the sum stepped past the most positive value and reads as $-8$
C. Underflow: the sum stepped past the most negative value
D. Nothing; `1000` is an invalid pattern and the adder rejects it

### Question 5

Which addition can *never* overflow in two's complement?

A. Two positive numbers
B. Two negative numbers
C. A positive number and a negative number
D. Any addition whose result is zero

### Question 6

How many positions does a 5-bit two's complement wheel have, and what is its most negative value?

A. 32 positions, $-16$
B. 32 positions, $-32$
C. 16 positions, $-8$
D. 5 positions, $-5$

## Answer Explanations

**1. C.** Subtracting moves counterclockwise, and the position just before zero is the all-ones pattern. It is $-1$ because $-1 \equiv 15 \pmod{16}$ and $15$ is `1111`.

**2. A.** Adding moves clockwise: $-3, -2, -1, 0, +1$. The path crosses zero with no special case.

**3. B.** The positives and negatives meet at the bottom of the wheel, where `0111` ($+7$) is adjacent to `1000` ($-8$). That boundary is where overflow and underflow happen.

**4. B.** Four bits cannot represent $+8$. Stepping clockwise from `0111` lands on `1000`, which two's complement reads as $-8$: a positive result has wrapped to a negative one.

**5. C.** Adding numbers of opposite sign gives a result between the two operands, so the path never reaches the seam. Only same-sign additions can cross it — which is exactly what the hardware overflow check looks for.

**6. A.** An $n$-bit wheel has $2^n$ positions and runs from $-2^{\,n-1}$ to $+2^{\,n-1}-1$; for $n = 5$ that is $32$ positions, from $-16$ to $+15$.
