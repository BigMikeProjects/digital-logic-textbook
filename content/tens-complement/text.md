# Ten's Complement: Understanding Subtraction Through Addition

One of the most elegant insights in digital logic is that subtraction can be performed using only addition. The key is complement representation, which "builds subtraction into" the number system itself. Before diving into binary two's complement, let's understand the concept using the more familiar decimal system.

## Why Use Complement Representation?

The motivation is hardware. Adders we know how to build well; a *separate* subtractor, with borrow chains rippling from column to column, would be a second, different circuit. Complement representation makes it unnecessary: rewrite the number being subtracted as its complement, and the same adder that computes $A + B$ now computes $A - B$. Subtraction becomes addition and borrowing disappears.

Two's complement in binary is directly analogous to ten's complement in decimal, so understanding the decimal version first makes the binary version much more intuitive. One detail to notice: everything here happens at a **fixed width** — three-digit numbers throughout, and the "1000" appearing below is exactly that width made visible ($10^3$).

## Nine's Complement Calculation

The first step toward ten's complement is calculating the nine's complement: subtract each digit from 9, column by column.

```
Number:     3   1   8
            ↓   ↓   ↓
9 minus:   9-3 9-1 9-8
            ↓   ↓   ↓
Result:     6   8   1
```

**Nine's complement of 318 = 681**

### Why Nine's Complement Never Borrows

This is the key insight: since 9 is the maximum single digit, subtracting any digit (0–9) from 9 never requires borrowing. Each column is computed independently of its neighbors — the operation that *replaces* subtraction doesn't smuggle borrowing back in.

## Ten's Complement

Ten's complement is simply the nine's complement plus 1:

- Nine's complement of 318 = 681
- Ten's complement of 318 = 681 + 1 = **682**

## The Mathematical Basis

Why does adding a complement perform subtraction? Because the complement is just a disguised version of $1000 - B$:

$$A - B = A + (1000 - B) - 1000$$

Read the right side term by term. The nine's complement of a three-digit $B$ is $999 - B$ (that's what subtracting every digit from 9 computes all at once); adding 1 turns it into $1000 - B$, the ten's complement. So adding the ten's complement to $A$ really computes $A - B + 1000$: the correct answer plus an extra thousand, which shows up as a leading fourth digit that we simply **discard** — the "$-1000$" in the formula happening for free.

In fixed-width hardware, discarding the leading digit isn't even a step: a three-digit register has nowhere to put a fourth digit, so the overflow falls off the end on its own, like a three-digit odometer rolling past 999 back to 000.

## Worked Examples

### Example 1: 725 − 318

**Step 1:** Calculate nine's complement of 318
```
9 - 3 = 6
9 - 1 = 8
9 - 8 = 1
Nine's complement = 681
```

**Step 2:** Add 1 to get ten's complement
```
681 + 1 = 682
```

**Step 3:** Add to the first number
```
  725
+ 682
-----
 1407
```

**Step 4:** Discard the leading 1 (the extra 1000)
```
Answer = 407 ✓
```

Check it the ordinary way: $725 - 318 = 407$ — the same answer, using nothing but addition.

### Example 2: 725 − 421

**Step 1:** Nine's complement of 421
```
9 - 4 = 5
9 - 2 = 7
9 - 1 = 8
Nine's complement = 578
```

**Step 2:** Ten's complement
```
578 + 1 = 579
```

**Step 3:** Add
```
  725
+ 579
-----
 1304
```

**Step 4:** Discard leading 1
```
Answer = 304 ✓
```

Notice what never happened in either example: borrowing. The nine's complement is borrow-free by construction, and everything after it is plain addition.

## Connection to Binary

The same principle applies to binary arithmetic, where it becomes even easier:

| Decimal | Binary |
|---------|--------|
| Ten's complement | Two's complement |
| Nine's complement | One's complement |
| Subtract from 9 | Flip bits (0→1, 1→0) |
| Add 1 | Add 1 |
| Discard overflow | Discard overflow |

In binary, the first step gets even simpler — subtracting a bit from 1 just flips it, so the one's complement is "invert every bit." The upcoming topics on signed numbers and two's complement build directly on this decimal foundation: same recipe, base 2.

## Key Takeaways

Complement representation builds subtraction into the number system: to compute $A - B$, add the ten's complement of $B$ to $A$ and discard the leading overflow digit. The nine's complement (subtract each digit from 9) never borrows; adding 1 makes it $1000 - B$ in disguise, so the addition computes $A - B + 1000$ and dropping the extra thousand — which a fixed-width register does on its own — leaves the answer. The identical recipe in base 2 (flip the bits, add 1, discard the overflow) is two's complement, the representation real hardware uses.

## Practice

Try these calculations using ten's complement:
- 856 − 234
- 500 − 127
- 999 − 456

Use the interactive tool in the graphics panel to check your work!

## Review Questions

**1. What is the main advantage of using complement representation for negative numbers?**
A. It uses fewer bits\
B. It allows subtraction using only addition circuits\
C. It's easier to read\
D. It works only with even numbers

**2. To calculate the nine's complement of a number, what do you do to each digit?**
A. Add 9 to each digit\
B. Multiply each digit by 9\
C. Subtract each digit from 9\
D. Divide each digit by 9

**3. What is the nine's complement of 318?**
A. 318\
B. 681\
C. 682\
D. 691

**4. How do you convert from nine's complement to ten's complement?**
A. Subtract 1\
B. Add 1\
C. Multiply by 10\
D. Divide by 9

**5. Why does nine's complement calculation never require borrowing?**
A. Because 9 is always greater than or equal to any single digit\
B. Because we only use small numbers\
C. Because borrowing is optional\
D. Because we use calculators

**6. Using ten's complement, what is 725 − 318?**
A. 1407\
B. 407\
C. 317\
D. 682

**7. What is the ten's complement of 421?**
A. 578\
B. 579\
C. 580\
D. 421

## Answer Explanations

**1. B.** Complement representation builds subtraction into the number system itself: rewriting the subtracted number as its complement lets one adder circuit perform both addition and subtraction, with no borrow chains. Fewer bits (A) is not a property of complements, and they work for every number, odd or even.

**2. C.** The nine's complement subtracts each digit from 9, column by column — for the digit 3, write $9 - 3 = 6$. Each column is independent, which is what makes the step borrow-free.

**3. B.** Digit by digit: $9-3 = 6$, $9-1 = 8$, $9-8 = 1$, giving 681. Option C (682) is the *ten's* complement — the nine's complement plus 1 — a one-step-too-far error.

**4. B.** Ten's complement = nine's complement + 1. For the running example: $681 + 1 = 682$. That "+1" is what turns $999 - B$ into $1000 - B$, which is what makes the subtraction trick exact.

**5. A.** Since 9 is the maximum single digit, $9 - d$ is never negative for any digit $d$ from 0 to 9 — so no column ever needs to borrow from its neighbor. This independence is the whole point of going through the nine's complement.

**6. B.** Add the ten's complement of 318 (which is 682) to 725: $725 + 682 = 1407$. Discard the leading 1 — the extra 1000 the formula predicts — leaving 407. Option A forgets to discard; option D is the complement itself, not the answer.

**7. B.** Nine's complement of 421: $9-4=5$, $9-2=7$, $9-1=8$ → 578. Add 1: **579**. Option A stops at the nine's complement — remember the final +1.
