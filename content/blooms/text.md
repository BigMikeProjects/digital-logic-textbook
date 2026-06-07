## Bloom's Taxonomy

Educators use **Bloom's taxonomy** — a pyramid of learning levels — to think about how a course
builds understanding, from a foundational knowledge base at the bottom up to the highest creative
skills at the top. This short orientation (and the companion video) explains how digital logic maps
onto that pyramid, and why this course is unusual in taking you all the way to the top.

### Climbing the pyramid in digital logic

- **Knowledge** — the base: gates, truth tables, Boolean identities, and numbering systems.
- **Understand** — seeing how the pieces link together (for instance, knowing both what gates do and
  what a multiplexer does).
- **Apply** — using techniques like truth tables, logic simplification, and implementation to build
  circuits for real applications.
- **Analyze** — decomposing an existing circuit to work out what it does.
- **Evaluate** — judging competing designs, weighing things like gate count and the trade-off between
  speed and cost.
- **Create** — synthesizing brand-new circuits that solve problems. This is the top of the pyramid.

Most engineering, math, and science courses stop at the *analyze* stage. Digital logic is a rare
course that lets you climb all the way to *create* — building working hardware — which is what makes
it so rewarding.

### Abstraction levels

A recurring theme is that the same design can be viewed at several **levels of abstraction**. You
start with an intended **behavior**, specify it in **software** (we will write hardware as Verilog,
while keeping the hardware in mind), and can then view it as a **schematic** and, drilling down
further, as a **gate-level circuit** and ultimately **transistors**.

A 2-to-1 multiplexer makes this concrete: "pick input $A$ when the select line $S = 0$, pick $B$ when
$S = 1$." The same behavior appears as a Verilog statement, a schematic, and a transistor circuit.
The lower levels reveal real cost: a 2-to-1 MUX takes roughly **14 transistors**, while a 4-to-1 MUX
(four inputs, two select lines) takes about **42** — a small-looking change at the top with a real
impact at the bottom.

As you learn new material, it's worth asking where you are on the pyramid, because the goal is to
reach the top and synthesize what you know into working designs.
