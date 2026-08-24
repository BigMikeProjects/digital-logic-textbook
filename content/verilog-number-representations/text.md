## Number Representations in Verilog

We have spent several topics on number representations — binary, decimal, hexadecimal, and the idea that one bit pattern can answer several different questions. If we are going to describe digital systems in a hardware description language, the language needs a way to *write down* a bit pattern and a way to *show us* one. In Verilog those two jobs are done by **literals** and by the **`$display`** statement. This topic covers both. The next two topics pick up where this one stops: signed literals, and what happens to a value when it moves into a wider register.

Keep the interactive above open. It has five beats; this topic is **Beat 1** (writing a literal) and **Beat 2** (printing it). Beat 5 is a try-it converter you can use at any point.

## Writing a Literal

In Verilog, a *literal* is a number written directly into the code — a constant. The interactive's testbench opens by declaring three 8-bit registers and giving each one a literal:

```verilog
reg [7:0] b = 8'b1010_0101;   // binary (underscore = separator)
reg [7:0] d = 8'd165;         // decimal
reg [7:0] h = 8'hA5;          // hex
```

`reg [7:0]` declares an 8-bit register: bit 7 down to bit 0 is eight bits. The three literals on the right all follow one pattern:

1. the **size** — how many bits the constant is (`8`)
2. a **single quote** (the tick)
3. the **base** — `b` for binary, `d` for decimal, `h` for hexadecimal
4. the **value** — the digits, written in that base

So `8'hA5` reads as "an 8-bit constant, in hex, with the value A5." The three parts are color-coded in Beat 1 of the interactive: size in amber, base in violet, value in cyan. Click the *size*, *base* and *value* chips to see each part highlighted in every literal on the page.

Now notice what the three declarations have in common. Convert the binary pattern `1010 0101` to decimal and you get $128 + 32 + 4 + 1 = 165$. Convert 165 to hex and you get A5. The three literals are **three spellings of the same eight bits**. The base changes how you write a number; it does not change what is stored. The interactive makes this visible: the three lamp rows under the anatomy diagram light up identically, `1 0 1 0 0 1 0 1`, and each is labeled `= 165`.

Two details of the syntax are worth knowing from the start:

- **Underscores are ignored.** `8'b1010_0101` and `8'b10100101` are the same literal. Verilog allows an underscore anywhere between digits, and the useful habit is to group binary digits in fours — one group per hex digit — which makes long constants much easier to read. Use it.
- **Case does not matter.** `8'hA5` and `8'ha5` are the same value, and the base letter may be upper or lower case as well. The simulator prints hex digits in lower case regardless of how you typed them.

## Printing It

Verilog has no print statement in the ordinary sense — a circuit has nowhere to print to. But inside a *testbench*, the simulator gives you `$display`, which writes a line of text to the console. Because the registers above are constants that hold their values for the whole simulation, displaying them works just like displaying any other signal. In practice, `$display` is the print statement of a testbench.

`$display` is a **formatted print**, in the same family as C's `printf` and MATLAB's `fprintf`. Everything inside the double quotes is printed, and each `%` code inside the quotes is a slot that one of the following arguments is "stuffed into," converted to the requested form:

| Specifier | Prints the value in | Field width for an 8-bit value |
|---|---|---|
| `%b` | binary, one character per bit | 8 |
| `%d` | decimal | 3 (the widest possible value is 255) |
| `%h` | hexadecimal, lower case | 2 |

The first line of the testbench's `initial` block prints all three registers, each in its own base:

```verilog
$display("b=%b  d=%d  h=%h", b, d, h);
```

The text `b=` is printed as is; `%b` is replaced by `b` converted to binary; then `d=` and `%d` with `d` in decimal; then `h=` and `%h` with `h` in hex. Here is the simulator's actual output:

```
b=10100101  d=165  h=a5
```

Exactly what we expected, and a good habit to check: three registers, three bases, one bit pattern. The next line makes the check explicit in code rather than by eye:

```verilog
$display("all three equal? %b", (b == d) && (d == h));
```

`==` compares two values bit for bit and gives 1 if they match; `&&` is logical AND, so the whole expression is 1 only if `b` equals `d` *and* `d` equals `h`. The console prints `all three equal? 1`.

### Escaping the percent sign

The next three lines each print the same register `h` in a single base, and they show one small trick. Suppose you want the text `%b` to appear in the output as a label. Written plainly, `%b` would be taken as a slot. Writing `%%` instead prints a single, literal percent sign:

```verilog
$display("%%b of h -> %b", h);
$display("%%d of h -> %d", h);
$display("%%h of h -> %h", h);
```

In each line the `%%b` (or `%%d`, `%%h`) at the start is just text, and the `%b` (or `%d`, `%h`) near the end is the slot where `h` goes. The output:

```
%b of h -> 10100101
%d of h -> 165
%h of h -> a5
```

Step through these in Beat 2 of the interactive: as each line runs, the specifier it uses lights up in the strip above the console, and the lamps show the bits being printed.

### Padding, and `%0d`

The last line of this section prints a small value, `n = 8'd5`, two ways:

```verilog
$display("%%d of n -> [%d]   %%0d of n -> [%0d]", n, n);
```

```
%d of n -> [  5]   %0d of n -> [5]
```

Look carefully at the first bracket. `%d` printed the 5 with two spaces in front of it. The rule is that a `%d` field is **right-justified and padded with spaces to the width of the largest value the variable could hold**. An 8-bit register can hold up to 255 — three digits — so every `%d` of an 8-bit value occupies three columns, and a one-digit value gets two leading spaces. That is why the columns lined up so neatly in the first `$display` line, and it is why a value can look oddly indented in a printout. If you do not want the padding, put a zero after the percent sign: `%0d` prints the value in as few characters as it needs. The same `0` works with `%b` and `%h`. The interactive draws the pad spaces as small dots so you can see them.

## Try It

Beat 5 of the interactive is a converter. Pick a size, pick a base, type a number (or tap the digits valid for that base), and the page shows the literal as Verilog text, the bits as lamps, and what `$display` would print for it. Use it now to check your reading of this topic: enter `A5` in hex and then `165` in decimal and confirm they light the same lamps. Then try a value that is too big for the size — `1A5` in hex with a size of 8 — and read the compiler warning it produces: the extra bit is silently dropped, and only a warning tells you.

You will also see that the widget prints two readings of every value, an *unsigned* one and a *signed* one, and that they differ when the top bit is 1. That difference is the subject of the next topic.

## Key Takeaways

A Verilog literal is a constant written as size, tick, base, value — `8'hA5` is eight bits, in hex, with value A5. Binary, decimal, and hex are three spellings of one bit pattern; the base changes the writing, not the bits. Underscores may be used to group digits, and case does not matter. Inside a testbench, `$display` is a formatted print: text inside the quotes is printed, and `%b`, `%d`, and `%h` are slots that show a value in binary, decimal, or hex. `%%` prints a literal percent sign. `%d` pads its field with spaces to the width of the largest value the variable can hold; `%0d` removes the padding.

## Review Questions

### Question 1

In the literal `8'hA5`, what do the three parts mean?

A. 8 is the value, h is a variable name, A5 is a memory address
B. 8 is the size in bits, h says the digits are hexadecimal, A5 is the value
C. 8 is the number of digits, h means "high," A5 is a label
D. 8 is the base, h is the size, A5 is the value

### Question 2

Which of the following literals is *not* the same bit pattern as `8'b1010_0101`?

A. `8'd165`
B. `8'hA5`
C. `8'ha5`
D. `8'd101`

### Question 3

What does the line `$display("b=%b", b);` print when `b` holds the 8-bit value `10100101`?

A. `b=%b`
B. `b=165`
C. `b=10100101`
D. `b=a5`

### Question 4

In `$display("%%d of h -> %d", h);`, what is the purpose of the `%%`?

A. It prints the value of `h` twice
B. It prints a literal percent sign, so the text `%d` appears in the output
C. It converts `h` to decimal and then to hex
D. It marks the start of a comment

### Question 5

`n` is an 8-bit register holding 5. `%d` prints it as `[  5]` — two spaces, then 5. Why?

A. The value is actually 005; the zeros are shown as spaces
B. `%d` pads the field to the width of the largest value an 8-bit register can hold, 255, which has three digits
C. The simulator always prints three characters for every specifier
D. The two spaces are the two leading zero bits of the value

### Question 6

Which statement about underscores in a Verilog literal is correct?

A. An underscore changes the value by inserting a zero bit
B. Underscores are only allowed in hexadecimal literals
C. Underscores are ignored by the simulator and exist only to make the literal easier to read
D. An underscore marks the boundary between the size and the value

## Answer Explanations

**1. B.** The pattern is size, tick, base, value. `8` is the width in bits, `h` names the base (hexadecimal), and `A5` is the value written in that base.

**2. D.** `8'd101` is decimal 101, a different number. `8'd165`, `8'hA5`, and `8'ha5` are all the pattern `10100101` — 165 in decimal is A5 in hex, and case does not matter in hex digits.

**3. C.** The text `b=` is printed as is, and `%b` is a slot that shows the value in binary, one character per bit: `b=10100101`.

**4. B.** Two percent signs in a row print one literal percent sign. That lets the label `%d` appear in the output text, while the later `%d` remains a real slot for `h`.

**5. B.** A `%d` field is right-justified and space-padded to the width of the largest value the variable could hold. Eight bits can hold up to 255, three digits, so a one-digit value gets two leading spaces. `%0d` removes the padding.

**6. C.** Underscores between digits are ignored; `8'b1010_0101` and `8'b10100101` are identical. They are a readability aid — grouping binary in fours, one group per hex digit, is the recommended habit.
