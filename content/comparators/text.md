# Comparators

A **magnitude comparator** takes two numbers and tells you how they relate: whether $A > B$,
$A = B$, or $A < B$. Exactly one of those three outputs is asserted at a time. As a piece of
*functionality* this needs no explanation — you have been comparing numbers your whole life — so the
interesting part of this topic is **how you actually build one out of gates**, which is where we will
spend most of our time.

Our running example is a **4-bit unsigned** comparator with inputs $A$ and $B$ and the three outputs
$A>B$, $A=B$, and $A<B$.

## Beat 1: Functionality

Start with a **single bit**, which is the primitive the whole design is built from:

| $A$ | $B$ | result |
|:---:|:---:|--------|
| 0 | 0 | $A = B$ |
| 0 | 1 | $A < B$ |
| 1 | 0 | $A > B$ |
| 1 | 1 | $A = B$ |

Two of the four rows are equality — a single bit matches itself either way — and the two mixed rows
give the ordering.

For a multi-bit number, the circuit does exactly what **you** do when you compare two binary numbers
by hand: **scan from the most significant bit toward the least significant, and the first position
where the bits differ settles the entire comparison.** Every bit below that point is irrelevant. If
you get all the way to the bottom without finding a difference, the numbers are equal.

It is worth walking a few cases the way the interactive does:

- $A = 1011$, $B = 0110$. The very first bit decides it: $A$ has a 1 in the MSB and $B$ has a 0, so
  $A > B$ immediately. Nothing below the MSB matters — $B$'s larger lower bits cannot make up the
  deficit.
- $A = 0101$, $B = 0101$. Every position matches, all the way down, so $A = B$.
- $A = 1010$, $B = 1001$. Bit 3 matches, so we cannot decide yet. Bit 2 matches, so we still cannot
  decide. At **bit 1**, $A$ has a 1 and $B$ has a 0 — **A wins**, $A > B$, and bit 0 is irrelevant.

That last case is the important one, because it shows the circuit's real job: **passing an
undecided comparison down the line until some bit position resolves it.** The same process extends
to any word width.

## Beat 2: Building the Hardware

The build is **staged**, in two layers: first work out where the two numbers *match*, then use that
information to decide the outcome.

### Layer 1: the equality array

Each bit pair goes into an **equivalence gate**, which is just an **XOR with a complemented output —
an XNOR**. Call its output $x_i$:

$$x_i = A_i \odot B_i = A_i \cdot B_i + \overline{A_i} \cdot \overline{B_i}$$

So $x_i = 1$ exactly when $A_i$ and $B_i$ **match** (both 0 or both 1), and $x_i = 0$ when they
differ. In the $1010$ versus $1001$ case, the top two bits match and the bottom two do not, giving
$x_3 = 1$, $x_2 = 1$, $x_1 = 0$, $x_0 = 0$.

**Equality** is now trivial — the two numbers are equal precisely when *every* bit matched:

$$A{=}B = x_3 \cdot x_2 \cdot x_1 \cdot x_0$$

### Layer 2: resolving greater-than

Greater-than is a **cascade of AND gates**, one per bit position, each answering a single question:
*did every higher bit tie, and does $A$ have the 1 at this position?* "A has the 1 here" is the term
$A_i \cdot \overline{B_i}$, and "every higher bit tied" is the product of the $x$ terms above it:

$$A{>}B = A_3\overline{B_3} + x_3 A_2\overline{B_2} + x_3 x_2 A_1\overline{B_1} + x_3 x_2 x_1 A_0\overline{B_0}$$

Read left to right, that is the MSB-first scan written as gates. The $x$ terms act as **enables**: an
AND gate at a given bit position can only contribute if all the bits above it tied. Trace the
$1010$ versus $1001$ example through it:

- **Bit 3:** $A_3 \cdot \overline{B_3}$. Here $A_3$ and $B_3$ are both 1, so $\overline{B_3} = 0$
  and the term is 0 — no decision.
- **Bit 2:** $x_3 A_2 \overline{B_2}$. Since $x_3 = 1$ this gate is *enabled*, but $A_2 = B_2 = 0$,
  so the term is still 0 — still no decision.
- **Bit 1:** $x_3 x_2 A_1 \overline{B_1}$. Both higher bits tied, so the gate is enabled; $A_1 = 1$
  and $B_1 = 0$ makes $\overline{B_1} = 1$, so this term goes to **1** and drives the $A > B$ output.

Only one term in the whole cascade can ever be 1, because the $x$ enables shut off every position
below the first difference. That is what makes it safe to merge them all with an OR gate.

### Layer 2, continued: less-than for free

You might expect a second, mirror-image cascade for $A < B$ — and you *could* build one. But there
is a cheaper way, and it is the one to remember. The three outputs are **mutually exclusive and
exhaustive**: any two numbers are either greater, equal, or less. So if the comparator has already
determined that $A$ is **not** greater than $B$, and also **not** equal to $B$, only one possibility
remains:

$$A{<}B = \overline{(A{>}B) + (A{=}B)}$$

That is a single NOR gate on the two outputs you already have, and it saves the entire second
cascade. This is the part of the design students most often find slippery, so it is worth saying
plainly: **less-than is not measured, it is deduced.**

## Beat 3: Applications

Magnitude comparison shows up throughout real hardware:

- **Threshold detection.** Compare a sensor or converter reading against a setpoint — a thermostat,
  an over-current trip, an alarm limit.
- **Address decoding.** Deciding whether an address falls in a device's assigned range has a
  magnitude-comparison aspect to it.
- **CPU branch conditions.** The comparison behind a conditional branch — is this register greater
  than that one? — is exactly this circuit.

## Beat 4: Comparators in Verilog

In Verilog you can lean on the **relational operators** directly. The three outputs are declared
**`reg`** because they are assigned inside an **`always` block**:

```verilog
module comp4 (input [3:0] a, b, output reg gt, eq, lt);
  always @(*) begin
    gt = 1'b0;  eq = 1'b0;  lt = 1'b0;   // defaults first — nothing left un-assigned
    if      (a >  b) gt = 1'b1;
    else if (a <  b) lt = 1'b1;
    else             eq = 1'b1;          // the three outputs stay one-hot by construction
  end
endmodule
```

Two details in that code are worth more than they first appear.

**Assign the defaults first.** The block opens by driving all three outputs to 0 before any decision
is made. This is not padding — it is what keeps the synthesizer from **inferring a latch**. In a
combinational `always` block, if some path through the logic leaves an output un-assigned, the tool
must assume the output *holds its previous value*, and holding a value requires memory. Defaulting
everything on entry guarantees every output is driven on every path. Treat it as standard practice
for combinational `always` blocks.

**The `if` / `else if` / `else` chain** then does the work, and because it is a chain, exactly one
branch executes — so the one-hot property of the outputs is structural rather than something you have
to check. A `case` statement would serve just as well here.

For equality specifically, there is a compact alternative worth *recognizing* even though you would
not normally write it:

```verilog
always @(*) eq = &(a ~^ b);   // bitwise XNOR, then AND-reduce
```

This is the gate diagram in one line: `a ~^ b` is the **bitwise XNOR** of the two vectors — the $x$
array from the hardware section — and the leading `&` is an **AND-reduction** that ANDs all those
bits together, exactly matching $A{=}B = x_3 x_2 x_1 x_0$. It is cryptic, and you are not expected
to write code like this, but it is satisfying to see the hardware and the operator line up.

**One important caveat about scope.** Everything in this topic compares **unsigned** numbers. We have
not yet covered two's complement and negative numbers, and signed comparison behaves differently —
the same bit patterns can compare in the opposite order once the most significant bit means "this
number is negative." Signed comparison is a later topic.

## Key Takeaways

A **magnitude comparator** reports $A > B$, $A = B$, or $A < B$, with exactly one output asserted.
The comparison is **decided at the most significant bit where the two numbers differ** — matching
higher bits pass the decision downward, and everything below the first difference is irrelevant. The
hardware is built in two stages. First an array of **equivalence gates (XNORs)** produces a match
term per bit, $x_i = 1$ when $A_i$ and $B_i$ agree; ANDing all of them together gives **$A=B$**.
Then an **AND-OR cascade** produces $A>B$, where each position contributes
$A_i \cdot \overline{B_i}$ **gated by the $x$ terms of all higher bits** — "everything above tied,
and $A$ has the 1 here" — so at most one term is ever active. **Less-than is derived rather than
built**: if the number is neither greater nor equal, it must be less, so
$A{<}B = \overline{(A{>}B) + (A{=}B)}$, a single NOR that saves an entire second cascade.
Comparators are used for **threshold detection, address decoding, and CPU branch conditions**. In
Verilog, declare the outputs **`reg`**, assign them in a combinational **`always` block**, and
**default them all to 0 first so no path leaves an output un-driven and infers a latch**; an
`if`/`else if`/`else` chain (or a `case`) then picks the winner. Finally, all of this is **unsigned**
comparison — signed comparison comes later.

## Review Questions

**1. In a multi-bit magnitude comparison, which bit position determines the result?**
A. The least significant bit\
B. The most significant bit where $A$ and $B$ differ\
C. The most significant bit, always\
D. The bit position with the largest number of 1s

**2. What does the output $x_i$ of an equivalence (XNOR) gate indicate?**
A. That $A_i$ is greater than $B_i$\
B. That $A_i$ and $B_i$ differ\
C. That $A_i$ and $B_i$ match\
D. That all lower bits have been compared

**3. In the greater-than cascade, what is the role of the $x$ terms multiplying a bit's
$A_i \cdot \overline{B_i}$ product?**
A. They invert the comparison at that bit\
B. They enable that position only if every higher bit tied\
C. They convert the result to unsigned\
D. They select between $A$ and $B$

**4. Given $A = 1010$ and $B = 1001$, which term of the greater-than cascade asserts?**
A. $A_3 \overline{B_3}$\
B. $x_3 A_2 \overline{B_2}$\
C. $x_3 x_2 A_1 \overline{B_1}$\
D. None — the numbers are equal

**5. How is the $A < B$ output most efficiently produced?**
A. With a second AND-OR cascade mirroring the greater-than logic\
B. By complementing the $A > B$ output alone\
C. As $\overline{(A{>}B) + (A{=}B)}$ — neither greater nor equal\
D. By comparing the least significant bits

**6. Why does the Verilog `always` block assign $0$ to all three outputs before the `if` chain?**
A. To make the code shorter\
B. So that no path leaves an output un-assigned, which would infer a latch\
C. Because `reg` outputs must be initialized to zero\
D. To force the outputs to be one-hot

**7. What does the expression `&(a ~^ b)` compute?**
A. Whether $a$ is greater than $b$\
B. The bitwise AND of $a$ and $b$\
C. Equality — a bitwise XNOR of the vectors, AND-reduced to a single bit\
D. The number of bit positions where $a$ and $b$ differ

## Answer Explanations

**1. B.** Comparison is settled at the most significant position where the two numbers disagree.
Higher bits that match cannot decide anything, and once a difference is found, no combination of
lower bits can overturn it — a 1 in a higher position outweighs every bit beneath it.

**2. C.** An equivalence gate is an XNOR, so its output is 1 when its two inputs are the same. The
array of $x_i$ terms is the circuit's record of *where the two numbers agree*, which both the
equality output and the greater-than cascade depend on.

**3. B.** The $x$ terms act as enables. A position can only contribute to $A > B$ if all the bits
above it tied — otherwise the comparison was already decided higher up. This is what makes at most
one term in the cascade active, and therefore what makes the final OR safe.

**4. C.** Bits 3 and 2 match, so $x_3 = x_2 = 1$ and neither of the first two terms can assert. At
bit 1, $A_1 = 1$ and $B_1 = 0$, so $\overline{B_1} = 1$ and the term $x_3 x_2 A_1 \overline{B_1}$
evaluates to 1, driving $A > B$.

**5. C.** Because the three relations are mutually exclusive and cover every possibility, "not
greater and not equal" leaves only "less." A single NOR on the existing $A>B$ and $A=B$ outputs
gives $A<B$ and avoids building a whole second cascade. Option B is wrong because not-greater
includes the equal case.

**6. B.** In a combinational `always` block, an output that is not assigned on some path must retain
its old value, and retaining a value implies storage — the synthesizer infers a latch. Defaulting
all outputs on entry guarantees every path drives every output, which is why it is standard practice.

**7. C.** `a ~^ b` is a bitwise XNOR producing a 1 in each position where the vectors match — the
$x$ array — and the leading `&` is a reduction operator that ANDs those bits into a single result.
It asserts only when every bit matched, which is exactly $A = B$.
