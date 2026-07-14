# Add/Sub Circuit

Now that we can build an adder, we can collect on a promise made back when we studied number representations: the real advantage of **two's complement** is that it gives us subtraction almost for free. This topic shows one of the most elegant results in introductory digital logic — taking an ordinary 4-bit adder and, with nothing but a row of XOR gates and a single control line, turning it into a circuit that does **both addition and subtraction**. The adder itself is never modified; we simply bolt the subtraction on around it.

## Starting Point: a 4-Bit Adder

Begin with the 4-bit adder from the previous topics. (It happens to be a ripple-carry adder, but that detail does not matter here — any 4-bit adder will do.) It adds two 4-bit vectors $A$ and $B$. For example, with $A = 0101$ (5) and $B = 0010$ (2) the output is $0111$ (7); change $B$ to $0011$ (3) and the sum becomes $1000$ (8), the carry rippling up through the stages.

One small design choice is worth flagging now, because it becomes essential in a moment: the least-significant stage is a **full adder with a real carry-in**, not a half adder. That spare carry-in input looks unnecessary for plain addition — nothing carries *into* the first column — but we are going to feed it deliberately to make subtraction work.

## The Trick: XOR as a Programmable Inverter

The whole design rests on one small observation about the exclusive-OR gate. Feed an XOR gate a data bit $X$ and treat its other input as a **control** line. Look at what the control does:

$$X \oplus 0 = X \qquad\qquad X \oplus 1 = \bar{X}$$

When the control is `0`, the output simply follows the input — the gate behaves like a plain wire. When the control is `1`, the output is the *complement* of the input. So a single control signal decides whether a bit passes straight through or comes out inverted. An XOR gate, used this way, is a **programmable inverter**.

The power of this is that the control can drive many gates at once. Put an XOR on every bit of a vector, tie all their control inputs to one signal, and that one signal decides whether the entire vector passes through unchanged or comes out fully complemented.

## Wiring It Into the Adder

Place an XOR gate on each bit of the $B$ input, and connect the second input of every one of them to a single control line called **`sub`**. This produces a modified vector $B' = B \oplus \text{sub}$:

- When $\text{sub} = 0$: $B' = B$. The adder computes $A + B$ — ordinary addition, unchanged.
- When $\text{sub} = 1$: $B' = \bar{B}$, every bit of $B$ flipped. For instance $B = 0011$ becomes $B' = 1100$.

Flipping all the bits is *half* of what we need. Recall how you form a negative number in two's complement: **invert every bit, then add one**. The XOR gates handle the "invert every bit." The "add one" is where the stubbed-in carry-in finally earns its place — we wire **`sub` into the least-significant carry-in as well**. When $\text{sub} = 1$, that injects a `1` into the bottom of the addition.

Now trace what the circuit computes with $\text{sub} = 1$:

$$A + \bar{B} + 1 = A + (-B) = A - B$$

because $\bar{B} + 1$ is exactly the two's-complement negation of $B$. That single `sub` line, doing double duty — controlling the row of XOR gates *and* driving the carry-in — flips the whole circuit between two operations:

$$\text{output} = A + (B \oplus \text{sub}) + \text{sub} \;=\; \begin{cases} A + B & \text{sub} = 0 \\ A - B & \text{sub} = 1 \end{cases}$$

## A Worked Example

Take $A = 5 = 0101$ and $B = 3 = 0011$:

| `sub` | $B' = B \oplus \text{sub}$ | carry-in | Addition performed | Result |
|:-----:|:--------------------------:|:--------:|--------------------|:------:|
| 0 | `0011` | 0 | $0101 + 0011 + 0 = 1000$ | **8** = 5 + 3 |
| 1 | `1100` | 1 | $0101 + 1100 + 1 = 0010$ | **2** = 5 − 3 |

In the subtraction row, the XOR gates turn $B = 0011$ into $\bar{B} = 1100$, and the carry-in adds the final `1`, so $\bar{B} + 1 = 1101$, which is $-3$ in two's complement. Then $0101 + 1101 = 1\,0010$; discarding the carry out of the top bit leaves $0010 = 2$, exactly $5 - 3$.

## In Verilog

The behavior is compact to describe. A `sub` bit selects the operation; the XOR-with-`sub` and the carry-in `+ sub` fall directly out of the math:

```verilog
module add_sub #(parameter N = 4) (
    input  wire [N-1:0] A, B,
    input  wire         sub,        // 0 = add, 1 = subtract
    output wire [N-1:0] result,
    output wire         carry
);
    // sub replicated across all bits: B ^ {N{sub}} inverts B only when sub = 1,
    // and (+ sub) injects the two's-complement +1 through the carry-in.
    wire [N:0] sum = A + (B ^ {N{sub}}) + sub;
    assign result = sum[N-1:0];
    assign carry  = sum[N];
endmodule
```

Structurally, this is the same adder as before with $N$ XOR gates added to the $B$ path and the `sub` line tied to the carry-in — the arithmetic operator here just stands in for that hardware.

## Key Takeaways

A single control line converts an ordinary adder into an adder/subtractor, cashing in the built-in-subtraction advantage of two's complement. The mechanism is an XOR used as a **programmable inverter**: $X \oplus 0 = X$ (pass through) and $X \oplus 1 = \bar{X}$ (invert). Putting an XOR on every bit of $B$, all controlled by one **`sub`** line, conditionally complements $B$; feeding that same `sub` line into the least-significant carry-in supplies the extra `+1`. Since negating a number in two's complement means *flip all bits and add one*, the circuit computes $A + (B \oplus \text{sub}) + \text{sub}$, which is $A + B$ when $\text{sub} = 0$ and $A - B$ when $\text{sub} = 1$ — as in $5 + 3 = 8$ versus $5 - 3 = 2$. The adder core is untouched; subtraction is added with only a row of XOR gates and the carry-in, which is why this is such a favorite example of two's complement paying off.

## Review Questions

**1. What is the main advantage of two's complement that this circuit exploits?**
A. It stores numbers using fewer bits
B. Subtraction can be done by adding the two's-complement negative, reusing an adder
C. It removes the need for a carry-in
D. It makes multiplication a single gate

**2. Used as a programmable inverter, what does an XOR gate output for data bit $X$ when its control input is `1`?**
A. $X$ (unchanged)
B. `0`
C. $\bar{X}$ (inverted)
D. `1`

**3. In the add/subtract circuit, the `sub` control line is connected to two places. Which two?**
A. The A inputs and the B inputs
B. The XOR gates on the B vector and the least-significant carry-in
C. Every carry between stages
D. The output bits and the A inputs

**4. Negating a number in two's complement requires flipping all the bits and then doing what?**
A. Shifting left by one
B. Adding one
C. Inverting again
D. Nothing else

**5. With $A = 0101$ (5), $B = 0011$ (3), and $\text{sub} = 1$, what does the circuit compute, and what is the result?**
A. $5 + 3 = 8$
B. $5 - 3 = 2$
C. $3 - 5 = -2$
D. $5 \times 3 = 15$

**6. Why does the least-significant stage use a full adder (with a carry-in) rather than a half adder?**
A. Half adders cannot add two bits
B. So the `sub` line can inject the two's-complement `+1` through the carry-in
C. To make the circuit faster
D. Because the most-significant bit needs it

## Answer Explanations

**1. B.** Two's complement represents subtraction as addition of the negative, so $A - B = A + (-B)$. That lets a single adder do both operations once you can produce $-B$, which is exactly what this circuit builds.

**2. C.** With control `1`, $X \oplus 1 = \bar{X}$ — the bit is inverted. With control `0`, $X \oplus 0 = X$ passes through unchanged. That controllable behavior is what makes the XOR a "programmable inverter."

**3. B.** The one `sub` line does double duty: it drives the XOR gate on every bit of $B$ (to conditionally invert the vector) *and* feeds the least-significant carry-in (to add the `+1`). Both are needed to form the two's-complement negative.

**4. B.** Two's-complement negation is *invert all bits, then add one*. The XOR gates perform the inversion; the carry-in supplies the plus one. Flipping the bits alone gives the one's complement, which is off by one.

**5. B.** With $\text{sub} = 1$, $B = 0011$ is inverted to $1100$ and the carry-in adds `1`, giving $\bar{B} + 1 = 1101 = -3$. Then $0101 + 1101 = 1\,0010$; dropping the carry leaves $0010 = 2 = 5 - 3$.

**6. B.** The extra `+1` needed for two's-complement negation is injected through the least-significant carry-in, so that stage must actually have a carry-in — i.e., be a full adder. A half adder has no carry-in and could not accept the `sub` signal there.
