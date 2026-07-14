# Full and Half Adders

Once numbers are represented in binary, the first thing we want to *do* with them is add. Binary addition works column by column, from right to left: at each column we add two bits together with the carry coming in from the column to its right, and we produce a **sum** bit for that position plus a **carry-out** into the next column. The circuit that handles one such column is the **full adder**, and cascading full adders across every column builds an adder for full-width numbers. The very first column — the least-significant bit — is a special case with no carry to worry about, and its simpler circuit is the **half adder**. This topic builds both, compares two different ways to build a full adder, and shows how the pieces cascade into a ripple adder.

## The Half Adder

Start with the simplest case: the least-significant column, where there is no incoming carry. Here we only add two bits, $A$ and $B$, producing a sum $S$ and a carry $C$. The truth table is short enough to read off by inspection:

| $A$ | $B$ | $S$ | $C$ |
|:---:|:---:|:---:|:---:|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

The sum is `1` exactly when the two inputs differ, which is the **exclusive-OR**, and the carry is `1` only when both inputs are `1`, which is **AND**:

$$S = A \oplus B \qquad\qquad C = A \cdot B$$

That is the entire half adder: one XOR gate for the sum, one AND gate for the carry.

```verilog
module half_adder (
    input  wire a,
    input  wire b,
    output wire sum,
    output wire carry
);
    assign sum   = a ^ b;   // XOR
    assign carry = a & b;   // AND
endmodule
```

It is called a *half* adder because it is missing the carry-in stage: it can add the two bits of a single column, but it cannot accept a carry from a column to its right, so on its own it can only ever handle the least-significant bit of a larger addition.

## The Full Adder

Every column except the first must also accept a **carry-in**, $C_{in}$. That gives three inputs — $A$, $B$, $C_{in}$ — and the same two outputs, sum $S$ and carry-out $C_{out}$:

| $A$ | $B$ | $C_{in}$ | $S$ | $C_{out}$ |
|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

There is a satisfying way to read this table. Take the two output bits together as $C_{out}S$ and treat them as a 2-bit number: in every row that number is simply **the count of `1`s among the three inputs**. No 1s gives `00`, a single 1 gives `01`, two 1s give `10`, and all three give `11`. A full adder, read this way, is just counting how many of its inputs are high — which is exactly what "add these bits" means.

The logic expressions extend the half adder's. The sum is high when an *odd* number of inputs are high, which is the three-input exclusive-OR, and the carry-out is high when at least two inputs are high:

$$S = A \oplus B \oplus C_{in} \qquad\qquad C_{out} = A\cdot B + A\cdot C_{in} + B\cdot C_{in}$$

```verilog
module full_adder (
    input  wire a,
    input  wire b,
    input  wire cin,
    output wire sum,
    output wire cout
);
    assign sum  = a ^ b ^ cin;
    assign cout = (a & b) | (cin & (a ^ b));   // = ab + a·cin + b·cin
endmodule
```

## Two Ways to Build It

A useful lesson hides in the full adder: the *same* truth table can be realized by very different circuits, and the choice between them is a real engineering decision.

**Way 1 — two-level minimization.** Take the truth table straight to Karnaugh maps. The map for $C_{out}$ minimizes to three groups, giving $C_{out} = AB + AC_{in} + BC_{in}$. The map for $S$ produces a **checkerboard** pattern — and a checkerboard is the unmistakable signature of exclusive-OR — confirming $S = A \oplus B \oplus C_{in}$. Implemented as a flat, two-level sum-of-products (all-NAND) circuit, this design is **fast**: in the video's accounting it uses about **56 transistors** with a delay path of only **3**.

**Way 2 — from two half adders.** Alternatively, notice that a full adder can be assembled from two half adders plus an OR gate. The first half adder adds $A$ and $B$; the second adds that partial sum to $C_{in}$ to produce the final $S$; and the two half adders' carries are combined with an OR to form $C_{out}$. Tracing the wiring gives

$$C_{out} = (A\cdot B) + \big((A \oplus B)\cdot C_{in}\big),$$

which a little Boolean algebra shows is *equivalent* to the K-map expression above — although, as the video stresses, that equivalence is not at all obvious just by looking. This structural design uses fewer gates: about **36 transistors**, so less chip area and less power, but its **critical path is longer** — up to about **6** transition times.

## The Trade-off

Two circuits, one truth table, opposite strengths. The two-level version **wins on speed** (short critical path) but **costs more transistors** (more area, more power). The two-half-adder version **wins on transistor count** (smaller, lower power) but is **slower**. Neither is universally best — *it depends on what the design needs*. This mirrors the theme from the adder overview: push on one metric and you generally pay in another. Historically, when transistors were scarce and expensive, the smaller two-half-adder style was attractive; today, with different priorities, the balance often tips the other way. The important habit is to recognize that "which adder is best" is a question about **goals**, not a single right answer.

## From a Column to a Ripple Adder

With a full adder for a general column and a half adder for the first one, a multi-bit adder falls out naturally. Give the least-significant bit a **half adder** (it has no carry-in), then route its carry-out to the **carry-in of the next column's full adder**, whose carry-out feeds the column after it, and so on, cascading left across all the bits. This is the **ripple-carry adder**, and it is the subject of the next topic.

Its simplicity has a price. Because each column's result depends on the carry arriving from the column to its right, **a column cannot settle until the previous column has settled** — the carry has to *ripple* all the way from the least-significant end to the most-significant end. For a narrow adder that is quick, but a 16-bit or 64-bit ripple adder is noticeably slower, because the carry must propagate through every stage in turn. That rippling delay is precisely the weakness that faster adder designs, coming later in this section, are built to overcome.

## The Full Adder as a Building Block

One caution: do not conclude that a full adder is *only* ever a two-level minimization or a pair of half adders. Full adders are used in enormous numbers — a single 32×32-bit multiplier contains roughly **a thousand** of them — so on real chips the full adder is often treated as a **primitive**, implemented as a directly optimized transistor circuit rather than assembled from ordinary gates. Squeezing the most speed and efficiency out of that one heavily-reused block is worth a great deal of effort, and it is a major topic in a VLSI design course. The details are beyond our scope here; the takeaway is that the blocks a system leans on most are the ones worth optimizing hardest.

## Key Takeaways

Binary addition is done one column at a time, and the circuit for a single column is the **full adder**: three inputs ($A$, $B$, $C_{in}$) producing a sum and a carry-out, with $S = A \oplus B \oplus C_{in}$ and $C_{out} = AB + AC_{in} + BC_{in}$ — a circuit whose two output bits simply count the `1`s among its inputs. The **half adder** is the carry-in-free special case used for the least-significant column, with $S = A \oplus B$ and $C = A \cdot B$. The same full-adder truth table can be built two ways — a fast two-level (all-NAND) circuit (~56 transistors, delay 3) or a smaller design from two half adders (~36 transistors, delay ~6) — illustrating the speed-versus-size-and-power trade-off, where neither choice is universally best. Cascading a half adder on the least-significant bit with full adders above it produces a **ripple-carry adder**, whose carry must propagate stage by stage, making wide versions slow. And because full adders are reused so heavily (a 32×32 multiplier holds ~1000), they are often optimized directly at the transistor level as chip primitives.

## Review Questions

**1. What distinguishes a full adder from a half adder?**
A. The full adder has a carry-in input; the half adder does not
B. The half adder produces a carry-out; the full adder does not
C. The full adder adds decimal numbers; the half adder adds binary
D. The half adder is faster because it uses more gates

**2. For a half adder, which expressions give the sum and carry?**
A. $S = A \cdot B$, $C = A \oplus B$
B. $S = A \oplus B$, $C = A \cdot B$
C. $S = A + B$, $C = A \cdot B$
D. $S = A \oplus B$, $C = A + B$

**3. Reading a full adder's output bits $C_{out}S$ as a 2-bit number, what do they represent?**
A. The larger of the two data inputs
B. The number of `1`s among the three inputs $A$, $B$, $C_{in}$
C. The bitwise AND of all three inputs
D. Always the value of the carry-in

**4. The Karnaugh map for a full adder's *sum* output shows a checkerboard pattern. What does that indicate?**
A. The sum is always 0
B. The map cannot be minimized
C. The sum is an exclusive-OR function
D. The sum requires a carry look-ahead

**5. Compared with the two-level (all-NAND) full adder, the full adder built from two half adders generally has which trade-off?**
A. Fewer transistors but a longer critical path
B. More transistors and a shorter critical path
C. Fewer transistors and a shorter critical path
D. Identical transistor count and delay

**6. Why does a ripple-carry adder get slower as it gets wider?**
A. Wider adders need a higher clock voltage
B. Each column must wait for the carry to propagate from the column before it
C. The half adder can only handle 4 bits
D. XOR gates stop working beyond 8 bits

## Answer Explanations

**1. A.** A full adder accepts a carry-in ($C_{in}$) in addition to the two data bits, so it can handle any column of a multi-bit addition. The half adder omits the carry-in, which is why it only suffices for the least-significant column. Both produce a sum and a carry-out.

**2. B.** In a half adder the sum is high exactly when the inputs differ ($S = A \oplus B$) and the carry is high only when both are `1` ($C = A \cdot B$). Option C's $S = A + B$ (OR) is wrong for $A=B=1$, where the sum bit must be 0 with a carry.

**3. B.** Taken together as $C_{out}S$, the outputs equal the count of `1`s among $A$, $B$, and $C_{in}$: `00`, `01`, `10`, `11` for zero through three high inputs. That "counting" is exactly what adding the bits of a column does.

**4. C.** A checkerboard pattern on a Karnaugh map is the tell-tale signature of an exclusive-OR function, confirming $S = A \oplus B \oplus C_{in}$. It does not mean the map is un-minimizable; it means the minimal form is XOR-based rather than a small group of AND terms.

**5. A.** The two-half-adder implementation uses fewer transistors (~36 vs ~56), so it is smaller and lower-power, but its critical path is longer (~6 vs 3), so it is slower. The two-level design is the opposite. Neither is best in every situation.

**6. B.** In a ripple-carry adder each column's result depends on the carry-out of the column to its right, so a column cannot settle until the previous one has. The carry ripples from the least-significant bit to the most-significant, and the more bits there are, the longer that propagation takes.
