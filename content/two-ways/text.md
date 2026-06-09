## Two Ways to Take the Two's Complement

Two's complement is the base-2 version of ten's complement: it bakes subtraction into the number
representation, so a computer can subtract by adding. To represent a negative number in a fixed
**$n$-bit** word, you find its two's complement — and there are **two equivalent methods** to do it.
They always produce the same bit pattern, so pick whichever is easier. The companion video works
through both.

### Method 1 — flip the bits and add one

1. Take the **absolute value** of the number.
2. Write it in **binary** (e.g., the divide-by-two method).
3. **Flip every bit** (0 → 1, 1 → 0).
4. **Add 1.**

**Example — $-25$ in 6 bits:**

$$25 = 011001_2 \;\xrightarrow{\text{flip}}\; 100110_2 \;\xrightarrow{+1}\; 100111_2 = \mathtt{0x27}$$

### Method 2 — compute $2^n - x$

Subtract the magnitude from $2^n$ (where $n$ is the word size) and convert to binary:

$$2^6 - 25 = 64 - 25 = 39 = 100111_2 = \mathtt{0x27}$$

Same answer — because flipping the bits of an $n$-bit number computes $(2^n - 1) - x$, and adding 1
gives exactly $2^n - x$.

### A second example — $-34$ in 7 bits

| Method | Steps | Result |
|--------|-------|--------|
| Flip & add 1 | $34 = 0100010_2$ → flip → `0x5D` → $+1$ | `0x5E` |
| $2^n - x$ | $2^7 - 34 = 128 - 34 = 94 = 1011110_2$ | `0x5E` |

Both routes give $1011110_2$ (`0x5E`) as the 7-bit representation of $-34$.

### Why it matters

The word size $n$ is part of the answer — the same value has different two's complement patterns at
different bit widths. Knowing both methods lets you check your work (compute it one way, verify the
other) and pick the quicker path for a given problem.
