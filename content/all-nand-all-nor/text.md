# All-NAND and All-NOR Realizations

NAND and NOR are **universal gates**: either one, on its own, can build any Boolean function. That means a circuit you have drawn in the natural way — a mix of AND gates, OR gates, and inverters — can always be rebuilt using *only* NAND gates and inverters, or *only* NOR gates and inverters. This section shows the technique for doing that conversion directly on the schematic, without first reworking the algebra, and then asks the obvious question: if the function is the same either way, why bother? The answer is **transistor count**. Done well, an all-NAND or all-NOR realization uses fewer transistors than the literal AND/OR/inverter build, which is exactly why real hardware is dominated by these two gates.

The method is **bubble pushing** — a graphical form of DeMorgan's theorem. Rather than manipulate symbols on paper, you redraw each gate and slide inversion bubbles along the wires until everything is consistent. The goal throughout is to keep the **shape-distinctive symbols** (the curved-back OR shape, the flat-backed AND shape) so that the diagram still *reads* as the original logic even after every gate has secretly become a NAND or a NOR.

## The Two Faces of a Gate

DeMorgan's theorem says $\overline{A \cdot B} = \bar{A} + \bar{B}$ and $\overline{A + B} = \bar{A}\cdot\bar{B}$. Read graphically, each identity gives a single gate **two equivalent drawings**:

- A **NAND** is an AND-shape with a bubble on the output, *and equally* an OR-shape with bubbles on both inputs.
- A **NOR** is an OR-shape with a bubble on the output, *and equally* an AND-shape with bubbles on both inputs.

"Pushing a bubble" through a gate is just switching between these two drawings: the bubble moves from one side to the other, and the body of the symbol flips between AND-shape and OR-shape. The gate itself never changes — only the picture does.

That gives a compact set of conversion rules. To rebuild a circuit out of one gate type, replace each AND and OR with the matching universal-gate drawing:

| Original gate | As a NAND | As a NOR |
|---------------|-----------|----------|
| AND | AND-shape, bubble on the **output** | AND-shape, bubbles on the **inputs** |
| OR  | OR-shape, bubbles on the **inputs** | OR-shape, bubble on the **output** |

In every case the *shape* you draw still matches the function you intend (AND-shape for a product, OR-shape for a sum); only the bubbles tell you it is physically a NAND or a NOR.

## Matching the Bubbles

Replacing the gates sprinkles bubbles all over the schematic, and those bubbles have to be accounted for so the function comes out unchanged. The bookkeeping rule is simple: **a bubble is an inversion, and two inversions cancel.** Walking each wire from a gate's output to the next gate's input, three situations come up:

- **Bubble meets bubble.** An output bubble feeding into an input bubble is a double inversion — they cancel, and the signal passes through clean. This is where the efficiency comes from: the inversions you added pay for each other for free.
- **A complement is needed.** If the original wire carried $\bar{x}$, you can often get it for free by routing $x$ straight into a bubble — the signal emerges complemented on the other side.
- **An unwanted bubble is left over.** If a signal must arrive (or leave) *uncomplemented* but there is a lone bubble in the way, you cancel it by inserting an **inverter**. The final output is the most common case: we want $F$, not $\bar{F}$, so a leftover output bubble gets one last inverter.

With the rules and the matching in hand, the rest is mechanical. The four examples below all start from the same place — the function drawn the natural way with AND gates, OR gates, and inverters — and convert it twice: once to all-NAND, once to all-NOR.

## Example 1 — $F$ with NAND Gates

$$F = \bar{a}\,b\,(\bar{c} + \bar{x}\,y)$$

Implement it **exactly as written**, no algebraic simplification. Reading the expression by Boolean precedence tells you the natural circuit:

- An AND gate forms the product $\bar{a}\,b$ (an inverter on $a$ supplies $\bar{a}$).
- An AND gate forms the product $\bar{x}\,y$ (an inverter on $x$ supplies $\bar{x}$).
- An OR gate forms the sum $\bar{c} + \bar{x}\,y$ (an inverter on $c$ supplies $\bar{c}$).
- A final AND gate forms $F = \bar{a}\,b \cdot (\bar{c} + \bar{x}\,y)$.

Now convert. Every AND becomes an AND-shape NAND with an output bubble; the OR becomes an OR-shape NAND with input bubbles. Then match the bubbles along each wire: the output bubble of the $\bar{a}b$ NAND, for instance, lands on an input bubble of the final gate and cancels. To get $\bar{c}$ at the OR-turned-NAND, route $c$ straight into one of its input bubbles. The very last output carries a leftover bubble — add one inverter so the circuit delivers $F$ rather than $\bar{F}$. The result is the identical function built entirely from NAND gates and inverters, with the AND and OR shapes still visible.

**Why it is cheaper.** In CMOS, an inverter costs 2 transistors and a two-input NAND or NOR costs 4. An ordinary AND or OR gate does not exist on its own — it is built as a NAND/NOR *followed by an inverter*, so it costs $4 + 2 = 6$ transistors. Counting the natural build of $F$ (four two-input gates and three inverters) against the all-NAND build (four NANDs and four inverters):

| Realization | Gates | Inverters | Transistors |
|-------------|-------|-----------|-------------|
| AND/OR/inverter | $4 \times 6 = 24$ | $3 \times 2 = 6$ | **30** |
| All-NAND        | $4 \times 4 = 16$ | $4 \times 2 = 8$ | **24** |

The all-NAND version saves **6 transistors**. The savings come from the four gates dropping their hidden output inverters; one extra explicit inverter is the small price paid, and it still comes out ahead.

This is worth holding as a **level-of-abstraction** idea. You normally *think and design* at the AND/OR level because that is how the function reads, while keeping in the back of your mind that the same circuit maps onto a leaner all-NAND form. You do not have to draw the all-NAND version everywhere — but knowing the mapping exists is what lets a synthesis tool, and the silicon, implement it cheaply.

## Example 2 — $F$ with NOR Gates

Take the same $F$ and the same starting AND/OR/inverter circuit, but push the bubbles the other way. Now each AND becomes an AND-shape NOR with **input** bubbles, and the OR becomes an OR-shape NOR with an **output** bubble. Match the bubbles as before: an input bubble already sitting where a complement is wanted ($\bar{a}$ on the output, for example) does the job; where a NOR's input has no bubble but the wire needs one (as for $\bar{c}$), insert an inverter to form it.

The transistor count comes out the same as the all-NAND version:

| Realization | Gates | Inverters | Transistors |
|-------------|-------|-----------|-------------|
| All-NOR | $4 \times 4 = 16$ | $4 \times 2 = 8$ | **24** |

This **duality** between NAND and NOR is no surprise — you generally expect the same answer from an all-NOR realization as from an all-NAND one. As the next pair of examples shows, the tie only breaks when the *shape* of the expression favors one universal gate over the other.

## Example 3 — $G$ with NAND Gates

$$G = (a + \bar{b}\,c)(\bar{d} + e)$$

Lay it out by Boolean precedence again. The product $\bar{b}\,c$ has to be formed first (an inverter gives $\bar{b}$), then OR'd with $a$ to make the sum $a + \bar{b}\,c$. Separately, an OR makes $\bar{d} + e$ (an inverter gives $\bar{d}$). A final AND multiplies the two sums to produce $G$.

Convert to NAND exactly as in Example 1 — ANDs get output bubbles, ORs get input bubbles — then match signals: $\bar{b}$ feeds in, $c$ feeds in, $\bar{d}$ comes for free by routing $d$ into a bubble, $e$ needs its bubble canceled so it arrives uncomplemented, $a$ needs an inverter, and the final output needs an inverter to deliver $G$ instead of $\bar{G}$.

| Realization | Gates | Inverters | Transistors |
|-------------|-------|-----------|-------------|
| AND/OR/inverter | $4 \times 6 = 24$ | $2 \times 2 = 4$ | **28** |
| All-NAND        | $4 \times 4 = 16$ | $4 \times 2 = 8$ | **24** |

The all-NAND build saves **4 transistors** here.

## Example 4 — $G$ with NOR Gates

Now convert the same $G$ to all-NOR: ANDs get input bubbles, the ORs get output bubbles. This time the bubble matching falls out unusually cleanly. Input $b$ routed into a bubble gives $\bar{b}$; $c$ needs its bubble canceled; $d$ has no input bubble and passes straight through; and several output/input bubble pairs along the connecting wires already cancel on their own. Only **two** inverters are needed in the whole circuit.

| Realization | Gates | Inverters | Transistors |
|-------------|-------|-----------|-------------|
| All-NOR | $4 \times 4 = 16$ | $2 \times 2 = 4$ | **20** |

At **20 transistors**, this is the leanest of all four realizations. The reason is structural: $G = (a + \bar{b}\,c)(\bar{d} + e)$ is shaped like a **product of sums**, and NOR gates fit a product of sums the way NAND gates fit a sum of products. When the expression's form matches the gate, fewer bubbles need to be undone, so fewer inverters are added. The practical rule of thumb:

- **Sum of products → all-NAND** is natural.
- **Product of sums → all-NOR** is natural.

## In Verilog

You would normally describe the *behavior* and let the synthesizer choose gates — and it will reach for NAND/NOR for exactly the transistor reasons above:

```verilog
// Same functions, described behaviorally.
assign F = ~a & b & (~c | (~x & y));   // F = a'·b·(c' + x'·y)
assign G = (a | (~b & c)) & (~d | e);  // G = (a + b'·c)·(d' + e)
```

A structural all-NAND realization makes the universal gate explicit. Because $x \cdot y = \overline{\overline{x \cdot y}}$, an AND is a NAND whose output is inverted by a second NAND wired as an inverter, and so on:

```verilog
// All-NAND skeleton (nand(out, in1, in2); a 2-input NAND tied together inverts).
wire n1, n2, n3;
nand (n1, a_n, b);          // n1 = (a'·b)'
nand (n2, c, xn_y);         // n2 = (c·(x'y))'  -> feeds the OR-as-NAND stage
nand (n3, n1, n2_terms);    // combine, matching bubbles
// ...inverters inserted only where a leftover bubble must be canceled.
```

The point is not the exact netlist but the mapping: every AND/OR/inverter diagram has an all-NAND and an all-NOR twin, and the universal-gate twin is usually the cheaper one to fabricate.

## Key Takeaways

NAND and NOR are universal, so any AND/OR/inverter circuit can be rebuilt from one gate type plus inverters. The conversion is done graphically by **bubble pushing** — a redrawing of DeMorgan's theorem — in which each AND or OR is replaced by the matching universal-gate symbol (AND→NAND adds an output bubble, OR→NAND adds input bubbles; AND→NOR adds input bubbles, OR→NOR adds an output bubble) while the shape-distinctive symbols are kept so the diagram still reads correctly. Bubbles are then **matched** along each wire: paired bubbles cancel, a bubble can supply a needed complement for free, and a leftover bubble is removed with an inverter. The reason to do any of this is **transistor count**: an ordinary AND/OR is a NAND/NOR plus a wasted output inverter (6 transistors versus 4), so the universal-gate realization sheds those inverters and comes out smaller — Example 1's $F$ dropped from 30 to 24 transistors. All-NAND and all-NOR are dual and usually tie, but the **shape of the expression breaks the tie**: sum-of-products favors all-NAND, product-of-sums favors all-NOR, which is why $G$'s all-NOR build reached just 20 transistors.

## Review Questions

**1. What does it mean to call NAND and NOR "universal" gates?**
A. They are the fastest gates available in CMOS
B. Either gate alone can implement any Boolean function
C. They require no transistors to build
D. They can only implement sum-of-products expressions

**2. To convert an OR gate into a NAND while keeping its shape-distinctive symbol, where do the bubbles go?**
A. One bubble on the output
B. Bubbles on the inputs
C. No bubbles are needed
D. One bubble on each input and one on the output

**3. During bubble matching, what happens when an output bubble feeds directly into an input bubble on the next gate?**
A. The signal is inverted once
B. An extra inverter must be added
C. The two bubbles cancel and the signal passes through unchanged
D. The circuit becomes invalid

**4. Why does an all-NAND realization generally use fewer transistors than the literal AND/OR/inverter version of the same function?**
A. NAND gates use fewer transistors than inverters
B. The AND/OR build needs extra output inverters (each AND/OR is a NAND/NOR plus an inverter) that the all-NAND build sheds
C. NAND gates do not need a power supply
D. Bubble pushing deletes gates from the circuit

**5. In Example 1, the AND/OR/inverter build of $F$ used 30 transistors and the all-NAND build used 24. How many transistors does a single two-input NAND gate cost in CMOS?**
A. 2
B. 4
C. 6
D. 8

**6. Why did the all-NOR realization of $G = (a + \bar{b}\,c)(\bar{d} + e)$ come out the most efficient (20 transistors)?**
A. NOR gates are always cheaper than NAND gates
B. The expression is a product of sums, a form that NOR gates fit with the fewest added inverters
C. The function was algebraically simplified first
D. All-NOR circuits never need inverters

## Answer Explanations

**1. B.** A universal gate can, by itself, build any Boolean function. Both NAND and NOR qualify, which is what lets an entire circuit be rebuilt from a single gate type plus inverters.

**2. B.** By DeMorgan's theorem $A + B = \overline{\bar{A}\cdot\bar{B}}$, so an OR equals a NAND whose inputs are complemented — an OR-shape with bubbles on the inputs. Keeping the OR-shape preserves the visual meaning while the input bubbles make it physically a NAND.

**3. C.** A bubble is an inversion, and two inversions in series cancel. An output bubble meeting an input bubble is a double inversion, so the signal passes through unchanged — this free cancellation is the source of the transistor savings.

**4. B.** An ordinary AND or OR gate is physically a NAND or NOR followed by an inverter (6 transistors versus 4). Building directly from the universal gate removes those hidden output inverters; only a few explicit inverters are added back to fix leftover bubbles, so the total drops.

**5. B.** A two-input NAND (or NOR) costs 4 transistors, while an inverter costs 2 and an AND/OR costs 6. Those are the per-gate figures used in every transistor count in this section.

**6. B.** All-NAND and all-NOR realizations are dual and usually tie, but the shape of the expression breaks the tie. $G$ is a product of sums, the form NOR gates match naturally, so the bubbles line up with the fewest added inverters — only two — giving the leanest 20-transistor build.
