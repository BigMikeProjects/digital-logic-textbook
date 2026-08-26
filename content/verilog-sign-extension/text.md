## Verilog Sign Extension

The last two topics settled what a Verilog literal is and what the `signed` keyword changes. This one asks a question that comes up the moment you connect registers of different widths: when an 8-bit value is assigned to a 16-bit register, **what fills the eight new bits?** For an unsigned value the answer is zeros, and there is nothing to see. For a signed value the answer is copies of the sign bit — *sign extension* — and there is a reason it has to be that way. Then there is one subtlety, which the testbench sets up deliberately, about what happens when the two registers disagree on signedness.

The interactive above is the same one as the previous two topics. This topic is **Beat 4** (*Sign Extension*); Beat 5 (*Try It*) widens any value you enter both ways so you can watch the rule work.

## Three Wider Registers

The testbench already holds two 8-bit registers with the same bits: `u` (unsigned, `8'hA5`) and `s` (signed, `8'shA5`), which print as 165 and −91. Beat 4 adds three 16-bit registers to receive them:

```verilog
reg        [15:0] uw, sx;      // unsigned 16-bit regs
reg signed [15:0] sw;          // signed 16-bit reg
```

`uw` is *unsigned, wider*. `sw` is *signed, wider*. `sx` is unsigned like `uw`, but it is going to receive the *signed* value — that is the subtle case, and we will come to it last. The `initial` block makes the three assignments in one line and prints each result:

```verilog
uw = u;  sw = s;  sx = s;
$display("uw = u -> %b  %%d -> %d", uw, uw);
$display("sw = s -> %b  %%d -> %d", sw, sw);
$display("sx = s -> %b  %%d -> %d", sx, sx);
```

## Unsigned: Zero Extension

`u` holds eight bits and `uw` has room for sixteen. When an unsigned value is assigned to a wider register, the extra bits are filled with zeros:

```
uw = u -> 0000000010100101  %d ->   165
```

This is the same thing as writing leading zeros on a decimal number: 10 and 0010 are the same quantity. The eight new bits contribute nothing, the low eight bits are unchanged, and the value is still 165. Nothing to see, which is exactly the point — unsigned widening is free.

## Signed: Sign Extension

Now the signed register. `s` holds the same pattern, `10100101`, read as −91. Assign it to the 16-bit signed register `sw`:

```
sw = s -> 1111111110100101  %d ->    -91
```

The eight new bits are all **ones**. Verilog looked at the sign bit of the source — it is 1, so the number is negative — and copied that sign bit into every new position. This is sign extension: the new bits are duplicates of the top bit of the source.

Why must it be ones, and not zeros? Think in place values. In the 8-bit register the top bit is worth $-128$, and the reading is $-128 + 32 + 4 + 1 = -91$. In the 16-bit register the top bit is worth $-32768$ instead, and if the new bits were zeros the value would be read as $+165$ — the sign would be lost. With the eight new bits set to one, they sum to

$$-32768 + 16384 + 8192 + 4096 + 2048 + 1024 + 512 + 256 = -256,$$

and $-256 + 128 + 32 + 4 + 1 = -91$. The eight ones are worth exactly what the old sign bit was worth twice over: they replace the single $-128$ place with $-256 + 128$. The interactive's Beat 4 draws this sum under the `sw` row so you can check it term by term.

The rule, then: **when widening a signed value, copy the sign bit into every new position.** If the value is positive the sign bit is 0, the new bits are zeros, and sign extension looks identical to zero extension — which is why that case needs no example. If the value is negative, the new bits are ones. Either way the value is preserved.

## The Subtle Case: Extension Follows the Source

Here is the third assignment. `sx` is declared **unsigned**, and it receives the **signed** value `s`:

```
sx = s -> 1111111110100101  %d -> 65445
```

Look at the bits first: `1111111110100101` — identical to `sw`. The assignment sign-extended the value, even though the destination is unsigned. That is because **the extension follows the source**: Verilog decides how to widen a value from the signedness of the value being assigned, and `s` is signed, so ones were copied in.

Now look at the number: **65445**. When `%d` prints `sx`, it reads the bits according to the *destination's* declaration — and `sx` is unsigned, so every one of those sixteen bits is a positive place value. The eight new ones, which were worth $-256$ in `sw`, are worth $+65280$ here, and $65280 + 165 = 65445$. Same bits as `sw`; a different number.

So the two halves of the rule are:

- **Extension follows the source.** A signed source sign-extends; an unsigned source zero-extends — regardless of where the value is going. (The mirror case holds too: an unsigned `u` assigned to a *signed* 16-bit register zero-extends and reads 165.)
- **Reading follows the destination.** `%d`, and arithmetic, interpret the stored bits by the register they live in.

When the source and destination agree on signedness, the value survives the move. When they disagree, the bits may be extended one way and read the other, and the number changes. You will not meet this often, but when a value comes out of a register as something wildly large and positive after an assignment, this is the first thing to check: a signed value landed in an unsigned register.

## Try It

In Beat 5, enter any number at size 4, 8, or 16, and the widening panel shows the value moved into a register twice as wide, both ways: the unsigned register zero-extended and the signed register sign-extended, with the new bits highlighted and both readings printed. Try `A5` at size 8 and watch `00000000 10100101` (165) against `11111111 10100101` (−91). Then try `7F`: the sign bit is 0, both extensions are zeros, and both readings agree at 127. Then `-91` in decimal, which lands on the same `10100101` and extends the same way.

## Key Takeaways

Assigning a narrow value to a wider register has to fill the new bits. An unsigned value is zero-extended — the new bits are zeros and the value is unchanged, like leading zeros on a decimal number. A signed value is sign-extended — the new bits are copies of the sign bit, which keeps the value the same because the copied ones reproduce the old sign bit's weight in the wider register (−32768 through 256 sum to −256, standing in for −128 twice). Extension follows the **source**; reading follows the **destination**. A signed value assigned to an unsigned register is sign-extended and then read as a large positive number (`sx = s` prints 65445). Keep source and destination both signed, and the value survives.

## Review Questions

### Question 1

An unsigned 8-bit register holding `10100101` is assigned to an unsigned 16-bit register. What are the eight new bits?

A. All zeros\
B. All ones\
C. A copy of the low eight bits\
D. Undefined until the register is written again

### Question 2

A signed 8-bit register holding `10100101` (−91) is assigned to a signed 16-bit register. What are the eight new bits, and why?

A. Zeros, because new bits are always cleared\
B. Ones — copies of the sign bit — so the value stays −91\
C. Ones, because 16-bit registers store negative numbers as ones\
D. Alternating ones and zeros

### Question 3

What does the 16-bit signed register hold after `sw = s`, and what does `%d` print?

A. `0000000010100101`, 165\
B. `1111111110100101`, −91\
C. `1111111110100101`, 65445\
D. `0000000010100101`, −91

### Question 4

Why does sign extension use ones rather than zeros for a negative value?

A. Because ones are easier for hardware to copy\
B. Because the copied ones reproduce the old sign bit's negative weight in the wider register, preserving the value\
C. Because zeros would make the register overflow\
D. Because Verilog requires the top bit of every register to be 1

### Question 5

The signed value `s` (−91) is assigned to an *unsigned* 16-bit register `sx`. What does `%d` print for `sx`, and why?

A. −91, because the source was signed\
B. 165, because unsigned registers ignore the sign bit\
C. 65445, because the value was sign-extended (following the source) but read as unsigned (following the destination)\
D. An error, because signed values cannot be assigned to unsigned registers

### Question 6

Which statement summarizes the rule?

A. Extension follows the destination; reading follows the source\
B. Extension follows the source; reading follows the destination\
C. Both extension and reading follow the destination\
D. Both extension and reading follow the source

## Answer Explanations

**1. A.** Widening an unsigned value adds leading zeros, just as 10 and 0010 are the same decimal number. The value is unchanged.

**2. B.** The sign bit is 1, so every new bit is set to 1. In the 16-bit register those ones sum to −256, which together with the low bits gives −91 again.

**3. B.** The bits are the sign-extended pattern, and because the register is signed, `%d` reads the top bit as −32768 and the total is −91.

**4. B.** In the narrow register the top bit was worth −128; in the wide one that position is a positive 128 and the new top bit is worth −32768. Only by setting all the new bits does the arithmetic come back to the original value: the ones sum to −256, standing in for −128 twice.

**5. C.** The source `s` is signed, so the assignment sign-extends the bits to `1111111110100101`. The destination `sx` is unsigned, so `%d` reads all sixteen bits as positive: 65280 + 165 = 65445.

**6. B.** How the new bits are filled depends on the value being assigned; how the stored bits are interpreted depends on the register that holds them. When the two disagree on signedness, the number changes.
