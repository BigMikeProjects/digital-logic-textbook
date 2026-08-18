## Two Ways to Take the Two's Complement

Two's complement is the base-2 version of ten's complement: it bakes subtraction into the number representation, so a computer can subtract by adding. Everything from the ten's complement topic carries over with the base changed — where decimal used $10^n - x$, binary uses $2^n - x$, and the "subtract each digit from 9" step becomes the far simpler "flip every bit." To represent a negative number in a fixed **$n$-bit** word, you find its two's complement — and there are **two equivalent methods** to do it. They always produce the same bit pattern, so pick whichever is easier for the problem in front of you. The companion video works through both.

Notice what's baked into that sentence: the word size $n$ is part of the problem statement. A two's complement representation only means something *at a stated width*, just as ten's complement only made sense once we fixed three digits and their $1000$.

### Method 1 — flip the bits and add one

1. Take the **absolute value** of the number.
2. Write it in **binary** (e.g., the divide-by-two method).
3. **Flip every bit** (0 → 1, 1 → 0).
4. **Add 1.**

**Example — $-25$ in 6 bits:**

$$25 = 011001_2 \;\xrightarrow{\text{flip}}\; 100110_2 \;\xrightarrow{+1}\; 100111_2 = \mathtt{0x27}$$

The flip step is the binary descendant of "subtract each digit from 9": in base 2 the largest digit is 1, and subtracting a bit from 1 simply inverts it. That's also why this method never borrows — each bit flips independently, exactly the property that made the nine's complement hardware-friendly.

### Method 2 — compute $2^n - x$

Subtract the magnitude from $2^n$ (where $n$ is the word size) and convert to binary:

$$2^6 - 25 = 64 - 25 = 39 = 100111_2 = \mathtt{0x27}$$

Same answer. This method *is* the definition — the two's complement of $x$ at width $n$ is, literally, $2^n - x$ — and it's often the faster mental route when the decimal arithmetic is easy: one subtraction, one conversion, done.

### Why the two methods must agree

This isn't a coincidence to memorize; it's one line of algebra. Flipping every bit of an $n$-bit number computes $(2^n - 1) - x$ — subtracting from the all-ones pattern, which is $2^n - 1$. Add 1 and you have exactly $2^n - x$, which is Method 2. The two routes are the same computation with the "$-1$" and "$+1$" bookkept differently:

$$\underbrace{\left[(2^n - 1) - x\right]}_{\text{flip}} + \underbrace{1}_{\text{add one}} \;=\; 2^n - x.$$

### A second example — $-34$ in 7 bits

| Method | Steps | Result |
|--------|-------|--------|
| Flip & add 1 | $34 = 0100010_2$ → flip → `0x5D` → $+1$ | `0x5E` |
| $2^n - x$ | $2^7 - 34 = 128 - 34 = 94 = 1011110_2$ | `0x5E` |

Both routes give $1011110_2$ (`0x5E`) as the 7-bit representation of $-34$.

### The width is part of the answer

The same value has different two's complement patterns at different bit widths. Take $-25$ again, but in **8 bits** instead of 6: $2^8 - 25 = 256 - 25 = 231 = 11100111_2 = \mathtt{0xE7}$ — a different pattern than the 6-bit `0x27`, representing the same $-25$. Neither is "the" two's complement of $-25$; each is the two's complement *at its width*. Always state (or check) the word size before converting — in hardware it's the register width, and in Verilog it's the declared vector width.

### The built-in check: a number plus its negative

Because the two's complement of $x$ is $2^n - x$, adding a value to its own two's complement always gives exactly $2^n$ — a one followed by $n$ zeros, which **wraps to zero** in an $n$-bit register. That's the arithmetic identity $x + (-x) = 0$, and it doubles as a work check. For the $-25$ example:

$$011001_2 + 100111_2 = 1000000_2 \;\xrightarrow{\text{keep 6 bits}}\; 000000_2 \checkmark$$

If your candidate pattern plus the original magnitude doesn't wrap to zero, one of the steps slipped. This is the two's complement version of the round-trip checks you've used for base conversions — cheap, fast, and it catches nearly everything.

### Why it matters

Knowing both methods lets you check your work (compute it one way, verify the other — or use the wrap-to-zero check) and pick the quicker path for a given problem: Method 2 shines when the decimal subtraction is easy; Method 1 shines when you already have the bits in front of you, and it's the one hardware actually implements — an inverter per bit plus an increment is far cheaper than a subtractor. The upcoming topics build directly on this: interpreting these patterns as signed values, and the number-wheel picture of how the wrap-around behaves.

### Key Takeaways

The two's complement of $x$ at width $n$ is $2^n - x$, and there are two equivalent ways to compute it: flip all $n$ bits and add 1, or subtract the magnitude from $2^n$ and convert. They agree because flipping computes $(2^n - 1) - x$, and the added 1 completes $2^n - x$. The word size is part of the answer — the same value yields different patterns at different widths — and a candidate answer can always be checked by adding it to the original magnitude: the sum must wrap to zero in $n$ bits. Both methods, one representation; pick per problem, verify with the other.

## Review Questions

**1. What are the steps of the flip-and-add-one method, in order?**
A. Add 1, then flip every bit
B. Write the magnitude in binary, flip every bit, add 1
C. Flip only the sign bit
D. Subtract the magnitude from $2^n - 1$ and stop

**2. What is the two's complement representation of $-19$ in 6 bits?**
A. `101101`
B. `101100`
C. `010011`
D. `110100`

**3. Method 2 computes the two's complement of $x$ at width $n$ directly as:**
A. $2^n - x$
B. $2^n + x$
C. $2^{n-1} - x$
D. $x - 2^n$

**4. Why do the two methods always produce the same bit pattern?**
A. Coincidence — they occasionally differ for large numbers
B. Flipping the bits computes $(2^n - 1) - x$, and adding 1 makes it exactly $2^n - x$
C. Both methods ignore the word size
D. Because binary numbers cannot represent negatives any other way

**5. The 6-bit two's complement of $-25$ is `100111`, but the 8-bit version is `11100111`. What does this illustrate?**
A. One of the two answers must be wrong
B. The representation depends on the stated word size — the width is part of the answer
C. Two's complement only works at 6 bits
D. The 8-bit version represents a different value

**6. A student claims `101101` is the 6-bit two's complement of 19. What is the fastest check, and what should it show?**
A. Add it to `010011` (19): the sum should wrap to zero in 6 bits
B. Count the 1 bits: there should be exactly three
C. Reverse the bits and compare
D. Convert both to hexadecimal and compare digits

## Answer Explanations

**1. B.** Magnitude to binary first, then invert every bit, then add 1 — in that order. Reversing the order (A) gives a different, wrong pattern: the +1 must come after the flip to turn $(2^n-1)-x$ into $2^n - x$.

**2. A.** $19 = 010011_2$; flip → `101100`; add 1 → `101101`. Or by Method 2: $64 - 19 = 45 = 101101_2$. Option B stops after the flip (the one's complement — the +1 is missing), and option C is just +19's pattern, unnegated.

**3. A.** By definition the two's complement at width $n$ is $2^n - x$ — the base-2 twin of ten's complement's $1000 - B$. Option C uses the wrong power, and option D is negative — not a bit pattern at all.

**4. B.** Flipping every bit of an $n$-bit number subtracts it from the all-ones pattern, $2^n - 1$. Adding 1 then yields exactly $2^n - x$, which is what Method 2 computes directly. Same computation, different bookkeeping — so they can never disagree.

**5. B.** Both are correct *at their own width*: $64 - 25 = 39$ gives the 6-bit pattern, $256 - 25 = 231$ gives the 8-bit one. A two's complement representation is only defined relative to a stated word size — in hardware, the register width.

**6. A.** Since the two's complement of $x$ is $2^n - x$, adding it to $x$ gives exactly $2^n$ — which wraps to all zeros in $n$ bits: $010011 + 101101 = 1000000 \to 000000$. That's $x + (-x) = 0$ working as a built-in answer check; the other options check nothing about the value.
