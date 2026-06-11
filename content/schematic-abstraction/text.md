## Schematic Abstraction and Transistor Count

A schematic shows a logic function as an arrangement of gates — but that arrangement is only *one*
implementation. Working at the **gate abstraction level** lets you reason about a design without
worrying about the transistors underneath, and it also leaves room to implement the same function more
cheaply. This section makes that concrete by counting transistors for a small example two ways.

### The example

Take the simple sum-of-products function

$$F = \bar{A}B + CD.$$

Read directly, the schematic is: an **inverter** to produce $\bar{A}$, an **AND** gate for $\bar{A}B$,
a second **AND** gate for $CD$, and an **OR** gate that combines them into $F$.

### Counting transistors directly

Using the CMOS gate costs from earlier, where NAND is the natural 4-transistor primitive and AND/OR
each need an extra inversion stage:

| Gate | Transistors | Count |
|------|:-----------:|------:|
| Inverter (for $\bar{A}$) | 2 | 2 |
| AND ($\bar{A}B$ and $CD$) | 6 each | 12 |
| OR (combine) | 6 | 6 |
| **Total** | | **20** |

So the literal AND-OR-INVERT reading costs **20 transistors**.

### A cheaper, equivalent implementation

Because we're free to work at the gate level, the same function can be built with **all NAND gates**.
Feed $A$ into a NAND used as an inverter and $C, D$ into NANDs, then **push the inversion bubbles** to
the inputs (the bubble-pushing / De Morgan idea from the schematic standards). The NAND output bubbles
and the input bubbles **cancel**, leaving exactly the original logic function on the output — the
all-NAND circuit is equivalent to the AND-OR one.

Now recount:

| Element | Transistors | Count |
|---------|:-----------:|------:|
| Inverter (for $\bar{A}$) | 2 | 2 |
| NAND × 3 | 4 each | 12 |
| **Total** | | **14** |

The same function, **14 transistors instead of 20**.

### Why this matters

Two ideas come out of this. First, **abstraction**: most of the time you design and reason at the gate
level and don't need to know the transistor implementation. Second, **optimization**: a sum-of-products
function implemented with **all NANDs** is cheaper than the literal AND-OR-INVERT version, because NAND
is the natural CMOS primitive and you avoid the extra inversion stages that AND and OR gates require.
The schematic you draw and the transistors you ultimately pay for are at different levels of
abstraction — and choosing the right realization can save real hardware.
