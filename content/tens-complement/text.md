# Ten's Complement: Understanding Subtraction Through Addition

One of the most elegant insights in digital logic is that subtraction can be performed using only addition. The key is complement representation, which "builds subtraction into" the number system itself. Before diving into binary two's complement, let's understand the concept using the more familiar decimal system.

## Why Use Complement Representation?

Complement representation offers several advantages:
- Allows subtraction using **only addition circuits**
- Eliminates the need for borrowing
- Simplifies hardware design

Two's complement in binary is directly analogous to ten's complement in decimal. Understanding the decimal version first makes the binary version much more intuitive.

## Nine's Complement Calculation

The first step toward ten's complement is calculating the nine's complement. For each digit, subtract from 9:

```
Number:     3   1   8
            ↓   ↓   ↓
9 minus:   9-3 9-1 9-8
            ↓   ↓   ↓
Result:     6   8   1
```

**Nine's complement of 318 = 681**

### Why Nine's Complement Never Borrows

This is the key insight: since 9 is the maximum single digit, subtracting any digit (0-9) from 9 never requires borrowing. Each column is independent, making the calculation simple and efficient.

## Ten's Complement

Ten's complement is simply the nine's complement plus 1:

- Nine's complement of 318 = 681
- Ten's complement of 318 = 681 + 1 = **682**

## The Mathematical Basis

The formula that makes this work:

$$A - B = A + (1000 - B) - 1000$$

Let's break this down:
- The nine's complement is essentially: $999 - B$
- Adding 1 gives: $1000 - B$ (the ten's complement)
- The extra 1000 appears in the result as a leading digit
- We simply **discard** this leading digit

## Worked Examples

### Example 1: 725 - 318

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

### Example 2: 725 - 421

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

## Connection to Binary

The same principle applies to binary arithmetic:

| Decimal | Binary |
|---------|--------|
| Ten's complement | Two's complement |
| Nine's complement | One's complement |
| Subtract from 9 | Flip bits (0→1, 1→0) |
| Add 1 | Add 1 |
| Discard overflow | Discard overflow |

In binary, finding the one's complement is even simpler than finding the nine's complement—you just flip every bit!

## Key Takeaways

1. **Complement representation builds subtraction into the number system**
2. **Nine's complement** = subtract each digit from 9 (never borrows)
3. **Ten's complement** = nine's complement + 1
4. **Discard the leading digit** in the result (the extra 1000)
5. **Same principle** applies to two's complement in binary

## Practice

Try these calculations using ten's complement:
- 856 - 234
- 500 - 127
- 999 - 456

Use the interactive tool in the graphics panel to check your work!

---

## Quiz: Ten's Complement Arithmetic

### Question 1
What is the main advantage of using complement representation for negative numbers?

- A) It uses fewer bits
- B) It allows subtraction using only addition circuits
- C) It's easier to read
- D) It works only with even numbers

### Question 2
To calculate the nine's complement of a number, what do you do to each digit?

- A) Add 9 to each digit
- B) Multiply each digit by 9
- C) Subtract each digit from 9
- D) Divide each digit by 9

### Question 3
What is the nine's complement of 318?

- A) 318
- B) 681
- C) 682
- D) 691

### Question 4
How do you convert from nine's complement to ten's complement?

- A) Subtract 1
- B) Add 1
- C) Multiply by 10
- D) Divide by 9

### Question 5
Why does nine's complement calculation never require borrowing?

- A) Because 9 is always greater than or equal to any single digit
- B) Because we only use small numbers
- C) Because borrowing is optional
- D) Because we use calculators

### Question 6
Using ten's complement, what is 725 - 318?

- A) 1407
- B) 407
- C) 317
- D) 682

### Question 7
What is the ten's complement of 421?

- A) 578
- B) 579
- C) 580
- D) 421

<details>
<summary><strong>Answer Key</strong></summary>

| Question | Answer | Explanation |
|----------|--------|-------------|
| 1 | B | Complement representation builds subtraction into the process, allowing subtraction with only adder circuits and no borrowing. |
| 2 | C | For nine's complement, subtract each digit from 9 (e.g., for 3: 9-3=6). |
| 3 | B | 318 → 9-3=6, 9-1=8, 9-8=1 → Nine's complement = 681. |
| 4 | B | Ten's complement = Nine's complement + 1 (681 + 1 = 682 for the example). |
| 5 | A | Since 9 is the maximum single digit, subtracting any digit (0-9) from 9 never requires borrowing. |
| 6 | B | 725 + 682 (ten's complement of 318) = 1407; discard the 1 → 407. |
| 7 | B | Nine's complement of 421: 9-4=5, 9-2=7, 9-1=8 → 578; add 1 → 579. |

</details>
