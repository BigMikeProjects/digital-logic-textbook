# Adder Circuits: A Hierarchical Approach

We have spent several sections on how numbers are *represented* in a digital system — binary, hexadecimal, signed values, and the rest. Now it is time to *do something* with those numbers, and the most fundamental operation is **addition**. This section builds circuits that add, but it is about much more than adders. Addition is the vehicle for two ideas that sit at the heart of all digital design: **hierarchy** (building complex things by reusing simpler ones) and **design trade-offs** (you rarely improve one property for free). This overview sets up both before the following topics build the circuits in detail.

## Binary Addition Works Like Decimal Addition

Adding in binary follows exactly the same procedure you already use in decimal: work **column by column, from right to left**, and at each column produce a **sum** digit and possibly a **carry** into the next column. The only difference is that a column overflows at 2 instead of at 10.

Take $A = 0111_2$ (which is $7$) and $B = 0001_2$ (which is $1$). Working right to left, and tracking the carry into each column:

| | carry-in | $A$ | $B$ | total | sum bit | carry-out |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| column 0 (LSB) | 0 | 1 | 1 | 2 | **0** | 1 |
| column 1 | 1 | 1 | 0 | 2 | **0** | 1 |
| column 2 | 1 | 1 | 0 | 2 | **0** | 1 |
| column 3 (MSB) | 1 | 0 | 0 | 1 | **1** | 0 |

Reading the sum bits from the bottom up gives $1000_2 = 8$, and sure enough $7 + 1 = 8$. Notice the shape of the work: each column cannot be finished until the carry from the column to its right is known. Binary addition is inherently a **sequential, carry-dependent process** — a fact that turns out to drive every design decision in this section, because the carry is the thing that makes addition slow.

## Hierarchy: Building Up Through Abstraction

The reason this section matters beyond adders is that it shows how real digital design is actually done. You do not design a processor by placing millions of transistors by hand. Instead you build a small block, **hide its internal details**, and reuse it as a single part at the next level up. Each level lets you reason about *what goes in and what comes out* without tracking everything inside the box. This is **abstraction**, arranged as a **hierarchy**.

You have already been climbing this hierarchy:

- A **transistor** is modeled as a simple **switch**.
- A few switches wired in the right configuration make a **logic gate**.
- A handful of gates make a **full adder** — a circuit that adds one column: two bits plus a carry-in, producing a sum bit and a carry-out.
- Full adders chained together make a **multi-bit adder** — a 4-bit adder, a 16-bit adder, whatever width you need.
- Adders (and other blocks) become pieces of a **general-purpose processor**.

At each step the lower level is "pushed into the box," and you build on it to reach more useful functionality. The upcoming topics follow this ladder directly: the **half adder** and **full adder** establish the single-column building block, and the **ripple-carry adder** wires many full adders together into a circuit that adds full binary numbers.

Hardware description languages make the hierarchy explicit. Once a `full_adder` module exists, a wider adder is just that block instantiated repeatedly, with each stage's carry-out feeding the next stage's carry-in:

```verilog
// A 4-bit adder built by chaining four full-adder blocks (the ripple-carry structure)
module adder4 (
    input  [3:0] A, B,
    input        Cin,
    output [3:0] Sum,
    output       Cout
);
    wire c1, c2, c3;                       // internal carries between stages
    full_adder fa0 (A[0], B[0], Cin, Sum[0], c1);
    full_adder fa1 (A[1], B[1], c1,  Sum[1], c2);
    full_adder fa2 (A[2], B[2], c2,  Sum[2], c3);
    full_adder fa3 (A[3], B[3], c3,  Sum[3], Cout);
endmodule
```

The details of *how* a `full_adder` works are irrelevant at this level — the block is reused as a part, which is exactly what hierarchy buys you.

## Design Trade-offs: Speed, Size, and Power

The second big theme is that engineering choices come with **trade-offs**, and adders illustrate this unusually well. The dominant axis in this section is **speed versus size versus power**.

The chained design above is simple and easy to understand, but it is also **slow**: because each stage waits for the carry from the stage below it, the carry has to *ripple* all the way from the least-significant bit to the most-significant bit, propagating through the transistors of every stage in turn. A wider adder is a slower adder. You can design a faster adder that computes the carries more cleverly and in parallel, but speeding it up costs **more circuitry**, which means **more area** on the chip and **more power** consumed.

This is the general pattern in digital design: push on one metric and you usually pay for it in another. There is **no single "best" adder** — the right choice depends on what the job requires. A design that is ideal for a low-power sensor is wrong for a high-speed processor, and vice versa.

## Where This Section Is Going

With that framing, the section follows a deliberate path:

1. **Ripple-carry adder** — the straightforward design built by chaining full adders, exactly as above. It is simple, easy to structure, and easy to understand, but the rippling carry makes it slow for wide numbers.
2. **Carry look-ahead adder** — a faster design that computes carries ahead of time rather than waiting for them to ripple. It wins on speed but costs more gates, more silicon area, and more power.

Between these two sits a whole space of trade-offs, and understanding that space — not memorizing one circuit — is the real goal. Adders are the concrete example, but hierarchy and trade-offs are the lasting ideas.

## Key Takeaways

Binary addition works just like decimal addition: proceed column by column from right to left, producing a sum bit and a carry at each step, as in $0111 + 0001 = 1000$ ($7 + 1 = 8$). Because each column depends on the carry from the column to its right, addition is an inherently sequential, carry-dependent process, and the carry is what makes it slow. Adders are the setting for two ideas central to all digital design. **Hierarchy** lets you build a block, hide its details, and reuse it as a part one level up — transistors become switches, switches become gates, gates become a full adder, full adders become a multi-bit adder, and adders become part of a processor. **Trade-offs** mean improving one property usually costs another; for adders the key axis is speed versus size versus power, so there is no single best adder, only the best one for a given job. The section demonstrates this by moving from the simple-but-slow ripple-carry adder to the faster-but-larger carry look-ahead adder.

## Review Questions

**1. When adding two binary numbers, in what order are the columns processed, and what does each column produce?**
A. Left to right, producing only a sum bit
B. Right to left, producing a sum bit and a carry into the next column
C. Left to right, producing a carry into the previous column
D. In any order, since columns are independent

**2. What is $0111_2 + 0001_2$?**
A. $0110_2$
B. $1000_2$
C. $1110_2$
D. $0111_2$

**3. In the design hierarchy described, which ordering (simplest building block to most complex) is correct?**
A. Gate → transistor → full adder → processor
B. Full adder → gate → transistor → processor
C. Transistor/switch → gate → full adder → multi-bit adder → processor
D. Processor → multi-bit adder → gate → transistor

**4. What is the main benefit of abstraction (hiding a block's internal details) in digital design?**
A. It makes the circuit use less power automatically
B. It lets you reuse the block as a part, reasoning only about its inputs and outputs
C. It removes the need for transistors
D. It guarantees the fastest possible design

**5. The section highlights a trade-off when designing adders. Which trade-off is emphasized?**
A. Speed versus size and power
B. Cost versus color
C. Binary versus decimal representation
D. Number of inputs versus number of outputs

**6. According to the overview, how do the ripple-carry adder and the carry look-ahead adder compare?**
A. The ripple-carry adder is faster but larger; the look-ahead adder is slower but smaller
B. They are identical in speed, size, and power
C. The ripple-carry adder is simple but slower; the look-ahead adder is faster but larger and uses more power
D. The look-ahead adder is always the best choice for every job

## Answer Explanations

**1. B.** Binary addition mirrors decimal addition: you work from the least-significant column (right) to the most-significant (left), and each column yields a sum bit plus a carry that feeds the next column to the left. Columns are not independent — the carry links them.

**2. B.** Adding right to left with carries: $1+1=10$ (0, carry 1), then $1+0+1=10$ (0, carry 1), then $1+0+1=10$ (0, carry 1), then $0+0+1=1$. The result is $1000_2 = 8$, consistent with $7 + 1 = 8$.

**3. C.** The hierarchy climbs from the simplest element upward: a transistor acts as a switch, switches form gates, gates form a full adder, full adders chain into a multi-bit adder, and adders become part of a processor. Each level is built from the one below it.

**4. B.** Abstraction hides a block's internal details so it can be reused as a single part — you only need to know what goes in and what comes out. This is what lets designers bootstrap from simple blocks up to complex systems. It does not by itself reduce power or guarantee speed.

**5. A.** The overview emphasizes speed versus size versus power: a faster adder generally requires more circuitry, taking more area and more power, while a simpler adder is slower. Optimizing one axis costs another.

**6. C.** The ripple-carry adder is simple and easy to understand but slow, because the carry must ripple through every stage. The carry look-ahead adder is faster but achieves that speed with more circuitry, so it is larger and consumes more power. Which is "best" depends on the application.
