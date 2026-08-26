## Verilog Signed and Unsigned Representations

The previous topic established that a Verilog literal is a bit pattern with a size and a base, and that `$display` can show that pattern in binary, decimal, or hex. This topic adds one word to the vocabulary — `signed` — and shows what it does and does not change. The short version: it changes nothing about the bits and everything about how `%d` reads them. The two's complement topics earlier in the book did the arithmetic; here we see the same idea in Verilog syntax.

The interactive above is the same one as the previous topic. This topic is **Beat 3** (*Signed Literals*); Beat 5 (*Try It*) will show you any value's unsigned and signed readings side by side.

## Unsigned by Default

A `reg` in Verilog is **unsigned unless you say otherwise**. The testbench opens with two declarations that hold the same eight bits:

```verilog
reg        [7:0] u = 8'hA5;   // unsigned (the default)
reg signed [7:0] s = 8'shA5;  // signed literal, signed reg
```

`u` is an ordinary 8-bit register. Nothing in its declaration mentions a sign, so Verilog treats it as unsigned — every bit is a positive place value. The literal `8'hA5` is the pattern `1010 0101` from the previous topic: an `A` nibble and a `5` nibble.

Print it both ways:

```verilog
$display("u=%b  %%d -> %d", u, u);
```

```
u=10100101  %d -> 165
```

`%b` shows the bits, and `%d` converts them the way we have always converted an unsigned binary number: $128 + 32 + 4 + 1 = 165$. Nothing new yet.

## Declaring a Signed Register

The second register is declared `reg signed [7:0]`, and its literal carries an `s` before the base letter — `8'shA5`. Both spellings say the same thing to Verilog: *read these bits as a two's complement number.* The declaration is the one that matters at print time; the `s` in the literal keeps the literal itself signed so that the pairing is consistent.

Now look closely at what changed and what did not:

```verilog
$display("s=%b  %%d -> %d", s, s);
```

```
s=10100101  %d ->  -91
```

The bit pattern is **identical** — `%b` prints `10100101` for `s` exactly as it did for `u`. But `%d` prints **−91**. Because the register is signed, Verilog looks at the top bit as a sign bit. It is 1, so the number is negative, and the two's complement reading applies: the top place is worth $-128$ instead of $+128$, so the value is $-128 + 32 + 4 + 1 = -91$. The interactive draws both rows with their place values, and the two rows differ in exactly one label: the leftmost lamp is worth $128$ in the unsigned row and $-128$ in the signed row.

The rule to carry away: **`%b` and `%h` print bits, so they do not care whether a variable is signed; `%d` prints a number, so it does.** The same eight bits are 165 or −91 depending only on the declaration — you choose your question before you print.

(One small consequence of the sign: `%d` pads a signed 8-bit field to four columns, leaving room for the widest possible value, `-128`. That is why the console shows ` -91` with a leading space.)

## Arithmetic on Signed Values

Once a value is signed, arithmetic reads it as signed too. The testbench adds a signed one to `s`:

```verilog
$display("s + 1     -> %d", s + 8'sd1);
```

```
s + 1     ->  -90
```

$-91 + 1 = -90$, as expected. The literal `8'sd1` is written signed to match `s`; that matters, because Verilog decides the signedness of an expression from *all* of its operands. If every operand is signed, the result is signed. If even one operand is unsigned, the whole expression is evaluated as unsigned — a rule that produces surprising numbers when a signed register is mixed with a plain literal. Keeping the literals signed when the registers are signed avoids the surprise.

## The Negative-Literal Subtlety

Here is the one place this topic can trip you up. You will not run into it often, but when you do, it is worth recognizing. What does Verilog do with a minus sign in front of a literal?

```verilog
$display("-8'd5 unsigned -> %d  (%b)", -8'd5, -8'd5);
```

```
-8'd5 unsigned -> 251  (11111011)
```

The minus sign is an **operation on the bits**: it negates `8'd5` by two's complement, exactly the flip-and-add-one recipe from earlier in the book. Check it yourself — 5 in eight bits is `00000101`; flip every bit to get `11111010`; add one to get `11111011`. That is the pattern `%b` shows.

But nothing in `-8'd5` told Verilog the *value* is signed. `8'd5` is an unsigned literal, and negating it produces an unsigned result. So when `%d` prints it, it reads `11111011` as an unsigned number: $128 + 64 + 32 + 16 + 8 + 2 + 1 = 251$. There is no minus sign stored anywhere in the bits; the negation happened, and then the unsigned reading threw the sign away.

If you ever have a negative literal printing as a large positive number when you expected a negative one, this is almost certainly what is going on. The fix is to say what you mean: write the literal signed (`-8'sd5`), or assign it to a `reg signed` — either way, `%d` then reads the top bit as a sign and prints −5. The interactive's Try It beat models this: enter `-91` in decimal at size 8 and the two readings show 165 for the unsigned register and −91 for the signed one, from the same `10100101`.

## Try It

In Beat 5, type any number — binary, decimal, or hex, with or without a minus sign — and the page shows the bits once and the readings twice: the unsigned register's `%d` and the signed register's `%d`, each with its place values summed. Try `A5` in hex, then `-91` in decimal, then `80` in hex (128 unsigned, −128 signed — the most negative 8-bit value). Then try `7F`, where the top bit is 0 and both readings agree at 127: the sign only matters when the top bit is 1.

## Key Takeaways

A Verilog `reg` is unsigned unless declared `reg signed`, and a literal is unsigned unless it carries `s` before the base letter (`8'shA5`). Signedness changes the *reading*, not the bits: `%b` and `%h` print the same text for a signed and an unsigned register holding the same pattern, while `%d` reads the top bit as a sign when the variable is signed — `8'hA5` is 165 unsigned and −91 signed. Arithmetic follows the same reading, and an expression is signed only if every operand is signed. A minus sign in front of a literal negates the bits by two's complement but does not make the result signed, so `-8'd5` prints as 251 with `%d`; write `-8'sd5` or use a signed register to get −5.

## Review Questions

### Question 1

A register is declared `reg [7:0] u;` with no other keywords. How does Verilog treat it?

A. As signed, because 8-bit registers are always signed
B. As unsigned — that is the default
C. As signed only when it holds a value with the top bit set
D. It depends on the base of the literal assigned to it

### Question 2

`u` (unsigned) and `s` (signed) both hold `10100101`. Which specifier prints *different* text for the two registers?

A. `%b`
B. `%h`
C. `%d`
D. All three print different text

### Question 3

What does `%d` print for `reg signed [7:0] s = 8'shA5;`?

A. 165
B. −91
C. −165
D. 91

### Question 4

Why is the top place value $-128$ in the signed reading but $+128$ in the unsigned reading?

A. Signed registers have seven bits, not eight
B. In two's complement the top bit is the sign bit, carrying a negative weight
C. Verilog subtracts 256 from every signed value
D. The unsigned reading ignores the top bit

### Question 5

`$display("%d", -8'd5);` prints 251. What happened?

A. Verilog ignored the minus sign
B. The minus sign negated the bits to `11111011`, but the result is still unsigned, so `%d` read it as 251
C. `8'd5` overflowed
D. `%d` always prints positive numbers

### Question 6

Which of these makes `%d` print −5 for a negated literal?

A. `-8'd5`
B. `8'd5` with the minus sign moved into the format string
C. `-8'sd5`, or assigning the value to a `reg signed`
D. Printing with `%b` instead of `%d`

## Answer Explanations

**1. B.** Without the `signed` keyword a register is unsigned. Nothing about its width or its contents changes that; only the declaration does.

**2. C.** `%b` and `%h` print the bits, which are identical for both registers. `%d` prints a number, and a signed register's number is read with a negative top place — so `%d` gives 165 for `u` and −91 for `s`.

**3. B.** The register is signed and the top bit is 1, so the pattern is read as $-128 + 32 + 4 + 1 = -91$.

**4. B.** Two's complement gives the top bit a weight of $-2^{n-1}$; for eight bits that is $-128$. Every other bit keeps its ordinary positive weight, which is why the two readings differ by exactly 256.

**5. B.** The minus is an operation on the bits — two's complement negation of `00000101` gives `11111011`. But `8'd5` is unsigned, so the negated result is unsigned too, and `%d` reads `11111011` as 251. The sign was never stored.

**6. C.** To get a signed reading, the *value* must be signed: either write the literal with `s` (`-8'sd5`) or put it in a `reg signed`. `%b` (D) would show the bits `11111011` but no decimal value at all.
