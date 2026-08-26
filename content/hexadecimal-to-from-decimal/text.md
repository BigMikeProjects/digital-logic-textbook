# Hexadecimal To/From Decimal

The previous section established what hexadecimal *is*: a compact, base-16 shorthand for binary, where each digit stands for one four-bit **nibble** and the sixteen symbols run `0`–`9` then `A`–`F` for the values ten through fifteen. This section puts hex to work as the everyday bridge between the two number worlds you actually move between — the **bit patterns** a computer stores (written compactly in hex) and the **decimal** numbers that live in your head. Converting fluently in both directions is one of those skills that feels trivial once it clicks but genuinely takes a few repetitions to make automatic, so it is worth practicing until it is instinct.

Before converting, it helps to hold three views of a single hex digit in mind at once: its **symbol** (say, `C`), its **4-bit pattern** (`1100`), and its **decimal value** (`12`). Every conversion below is really just fluent movement among those three views.

## Hexadecimal to Decimal: Positional Expansion

Reading a hex number as a decimal value works exactly like reading any positional number — the same idea as decimal's ones, tens, and hundreds, or binary's ones, twos, and fours — except the place values are powers of **16**. From the right, the weights are

$$16^0 = 1,\qquad 16^1 = 16,\qquad 16^2 = 256,\qquad 16^3 = 4096,\;\dots$$

The recipe has three steps: **resolve** each digit to its decimal value (turn any `A`–`F` into `10`–`15`), **multiply** each value by its place weight, and **add** the results.

Take the eight-bit value `A9`. Its two digits sit in the $16^1$ and $16^0$ places:

$$\text{A9}_{16} = (\underbrace{10}_{\text{A}} \times 16) + (9 \times 1) = 160 + 9 = 169_{10}$$

The `A` resolves to 10 and carries a weight of 16, contributing 160; the `9` sits in the ones place, contributing 9; together they make 169.

A three-digit example brings in the $16^2$ place. Take `1C8`, where `C` resolves to 12:

$$\text{1C8}_{16} = (1 \times 256) + (\underbrace{12}_{\text{C}} \times 16) + (8 \times 1) = 256 + 192 + 8 = 456_{10}$$

That is the entire method. The only real work is remembering to convert the letter digits to their decimal values before multiplying — everything after that is multiply-and-add. As a sanity check, `FF`, the largest single byte, comes out to $(15 \times 16) + (15 \times 1) = 240 + 15 = 255$, exactly the familiar 8-bit maximum.

## Decimal to Hexadecimal: Repeated Division by 16

Going the other way uses **repeated division**. You may have seen the same technique for decimal-to-binary, where you divide by 2 over and over; here the divisor is 16, which is a big advantage — dividing by 16 reaches the answer in far fewer steps than dividing by 2, and there are correspondingly fewer chances to slip.

The procedure: divide the number by 16 and write down the **quotient** and the **remainder**. The remainder is always between 0 and 15, so it *is* a hex digit (with 10–15 written as `A`–`F`). Then repeat the division on the quotient, and keep going until the quotient reaches 0. Finally, **read the remainders from bottom to top** — the first remainder you found is the *least*-significant digit, so the answer is built right-to-left.

Convert `47` to hex:

| Step | Division | Quotient | Remainder | Digit |
|------|----------|----------|-----------|-------|
| 1 | $47 \div 16$ | 2 | 15 | **F** |
| 2 | $2 \div 16$ | 0 | 2 | **2** |

The quotient hit 0, so we stop and read the remainders upward — the last one found (`2`) is the high digit and the first one found (`F`) is the low digit — giving $47_{10} = \text{2F}_{16}$.

A larger number just takes one more step. Convert `456`:

| Step | Division | Quotient | Remainder | Digit |
|------|----------|----------|-----------|-------|
| 1 | $456 \div 16$ | 28 | 8 | **8** |
| 2 | $28 \div 16$ | 1 | 12 | **C** |
| 3 | $1 \div 16$ | 0 | 1 | **1** |

Reading the remainders bottom-up gives $456_{10} = \text{1C8}_{16}$. Notice this closes the loop with the earlier example: `1C8` expands to 456, and 456 divides down to `1C8`. That is not a coincidence — the two conversions are exact inverses.

One pitfall deserves its own warning. When a remainder comes out between 10 and 15, write it as its letter digit *immediately* — `A` through `F` — never as a two-digit decimal number. In the `456` example above, step 2 produced remainder 12: the digit recorded is `C`. Write "12" in the digit column instead and your final answer sprouts an extra digit and is silently wrong. The remainder column and the digit column are two views of the same value; the digit column must always hold exactly one hex symbol.

## A Larger Example, Both Ways

The method does not change as numbers grow — there are just more places. Expand the four-digit value `2EA6`, which brings in the $16^3 = 4096$ place:

$$\text{2EA6}_{16} = (2 \times 4096) + (\underbrace{14}_{\text{E}} \times 256) + (\underbrace{10}_{\text{A}} \times 16) + (6 \times 1)$$

$$= 8192 + 3584 + 160 + 6 = 11942_{10}$$

Now run the inverse to confirm. Convert `11942` back to hex by repeated division:

| Step | Division | Quotient | Remainder | Digit |
|------|----------|----------|-----------|-------|
| 1 | $11942 \div 16$ | 746 | 6 | **6** |
| 2 | $746 \div 16$ | 46 | 10 | **A** |
| 3 | $46 \div 16$ | 2 | 14 | **E** |
| 4 | $2 \div 16$ | 0 | 2 | **2** |

Reading bottom-up: `2EA6`, exactly where we started. Note steps 2 and 3 exercising the pitfall above — remainders 10 and 14 go into the digit column as `A` and `E`.

## Getting a Feel for Hex Magnitudes

Fluency also means having a rough sense of *size* without computing. The trick is that hex has its own round numbers: the powers of 16. Just as 10, 100, and 1000 anchor decimal, the anchors here are $\text{10}_{16} = 16$, $\text{100}_{16} = 256$, and $\text{1000}_{16} = 4096$. A few consequences worth memorizing because they recur constantly in digital work: two hex digits span one byte, topping out at `FF` = 255; four hex digits span 16 bits, topping out at `FFFF` = 65535. So when you see a value like `1C8`, you can place it instantly — three digits means somewhere between 256 and 4095 — before doing any arithmetic at all. That habit of estimating first also catches gross conversion errors: if your expansion of a three-digit hex number comes out below 256, something slipped.

## Use Each Direction to Check the Other

Because hex→decimal and decimal→hex undo one another, they give you a built-in way to **check your work**, which is especially handy on an exam. Convert a decimal number to hex by repeated division, then convert your hex answer back to decimal by positional expansion; if you land on the number you started with, both conversions were right. Working through hex rather than binary keeps the step count low, and whenever you actually need the bits, expanding each hex digit into its nibble is immediate.

The interactive for this topic reinforces exactly this loop. Its worked-example pages step through hex→decimal place-value expansion and decimal→hex division for a shared set of numbers (`2F`, `A9`, `FF`, `1C8`), and its calculator lets you type any decimal or hex value and watch *both* the division sequence and the place-value expansion update side by side — so you can dial up a number, read the answer, and immediately verify it the other way.

## Hexadecimal in Practice

This is why hex is the notation of choice for register values, memory addresses, and bit masks in real tools and hardware description languages: it is compact like binary but converts to a human-scale decimal quantity with a little multiply-and-add. In Verilog, for instance, you write hex literals directly and the value is identical however you express it:

```verilog
reg  [7:0]  level = 8'hA9;      // 8'hA9   == 169 == 8'b1010_1001
wire [15:0] addr  = 16'h01C8;   // 16'h01C8 == 456
localparam  MAXBYTE = 8'hFF;    // 8'hFF   == 255, the largest 8-bit value
```

Being able to glance at `8'hA9` and know it is 169 — or to see the decimal 456 and know it is `1C8` — is the fluency this section is building.

## Key Takeaways

Hexadecimal and decimal convert through two mirror-image procedures. **Hex → decimal** is positional expansion in base 16: resolve each digit to its decimal value (`A`–`F` become 10–15), multiply by the place weights $16^0, 16^1, 16^2, \dots$, and add — so `A9` is $160 + 9 = 169$ and `1C8` is $256 + 192 + 8 = 456$. **Decimal → hex** is repeated division by 16: divide, record each remainder (0–15, written 0–F) as a digit, repeat on the quotient until it reaches 0, and read the remainders bottom-up — so `47` becomes `2F` and `456` becomes `1C8`. Dividing by 16 rather than 2 keeps decimal-to-hex short, and because the two directions are exact inverses you can always check a conversion by running it back the other way. Hold the three views of each digit — symbol, nibble, and decimal value — in mind, and practice until the conversions are automatic.

## Review Questions

**1. What is the decimal value of the hexadecimal number `A9`?**
A. 109\
B. 169\
C. 190\
D. 259

**2. When converting a hex number to decimal by positional expansion, what are the place weights, starting from the rightmost digit?**
A. $1, 2, 4, 8, \dots$ (powers of 2)\
B. $1, 10, 100, \dots$ (powers of 10)\
C. $1, 16, 256, \dots$ (powers of 16)\
D. $16, 256, 4096, \dots$ (starting at $16^1$)

**3. Converting decimal `47` to hex by repeated division by 16, what are the remainders and how are they read?**
A. Remainders 2 then 15, read top-down, giving `2F`\
B. Remainders 15 then 2, read bottom-up, giving `2F`\
C. Remainders 4 then 7, read bottom-up, giving `47`\
D. Remainders 15 then 2, read top-down, giving `F2`

**4. In the repeated-division method, what tells you to stop dividing?**
A. When the remainder becomes 0\
B. When the quotient becomes 0\
C. When you have exactly two digits\
D. When the remainder exceeds 15

**5. Why does the video recommend converting through hexadecimal rather than binary?**
A. Binary cannot represent numbers larger than 255\
B. Dividing by 16 takes far fewer steps than dividing by 2\
C. Hex is the only base a computer can store\
D. Decimal-to-binary conversion gives different answers

**6. A student converts a decimal number to `1C8` and wants to check the answer. What is the fastest verification, and what should it produce?**
A. Divide `1C8` by 16 again; it should give 0\
B. Expand `1C8` in base 16: $256 + 192 + 8 = 456$, matching the original decimal\
C. Convert `1C8` to binary; it should have exactly 8 bits\
D. Add the digits $1 + 12 + 8 = 21$; it should equal the original

**7. During repeated division by 16, a step produces quotient 46 and remainder 14. What goes in the digit column for that step?**
A. `14`\
B. `E`\
C. `F`\
D. `46`

## Answer Explanations

**1. B.** Expand `A9` in base 16: the `A` is 10 in the $16^1$ place and the `9` is in the $16^0$ place, so $(10 \times 16) + (9 \times 1) = 160 + 9 = 169$.

**2. C.** Hex is base 16, so the place weights are powers of 16 starting at $16^0 = 1$ for the rightmost digit: $1, 16, 256, 4096, \dots$. Option D uses the right base but wrongly skips the ones place; A and B are the weights for binary and decimal.

**3. B.** $47 \div 16 = 2$ remainder **15** (which is `F`), then $2 \div 16 = 0$ remainder **2**. The first remainder is the least-significant digit, so reading the remainders bottom-up gives `2F`. Reading them the other way would wrongly give `F2`.

**4. B.** You keep dividing the successive quotients by 16 and stop when the **quotient** reaches 0. The remainders collected along the way (not the quotient) are the hex digits; a remainder can legitimately be 0 in the middle of the process, so the remainder is not the stopping signal.

**5. B.** Repeated division by 16 reaches the answer in far fewer steps than repeated division by 2, with fewer opportunities for error — and a hex result expands back to binary trivially whenever the bits are needed. Binary can represent any value, and the conversions all agree, so the other options are false.

**6. B.** The two directions are inverses, so the quickest check is to expand the hex answer back to decimal by place value: $(1 \times 256) + (12 \times 16) + (8 \times 1) = 256 + 192 + 8 = 456$. If that matches the number you started with, the conversion is correct. Simply summing the digits (option D) is not a valid base-16 check.

**7. B.** A remainder between 10 and 15 must be recorded as its single hex letter — 14 is `E`. Writing the two-character "14" (option A) corrupts the answer with an extra digit, `F` (option C) is 15 rather than 14, and the quotient (option D) is never a digit — it is the number carried into the next division step.
