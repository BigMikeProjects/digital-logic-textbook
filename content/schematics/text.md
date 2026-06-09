## A Schematic Guide

Schematic diagrams are how we keep track of what a circuit is and how its pieces fit together — both
within a circuit and when connecting one system to another. This section sets out the **conventions**
we'll use in the course. None of them are sacred: a schematic is really about communicating **intent**,
and the right amount of detail depends on the **abstraction level** you're working at. A board you're
about to wire needs pin, part, and package numbers; a high-level block view needs almost none.

### Net lists and clean wiring

Underneath every schematic is a **net list** — the record of what connects to what. The *same*
correct connections can be drawn as a messy diagonal tangle or squared up with **orthogonal
(horizontal and vertical) wires**. Same circuit, but the orthogonal version is far easier to read, so
we'll favor it.

Two terms come up constantly:
- **Fan-out** — one output driving several gate inputs.
- **Fan-in** — several inputs feeding into one gate.

### Junctions: dot means connect

Where wires meet, the convention is simple:
- A **junction dot** means the wires **connect**.
- Wires that merely **cross with no dot do *not* connect**.

Avoid ambiguous **four-way junctions** (a dot with four wires meeting). Instead, **stagger** the
connection into two clean **T-junctions** so it's obvious which wires join.

### Direction, bubbles, and reading order

- Gates have a **direction**: signal flows from **input to output**. (A few bidirectional gates exist;
  we'll meet them later.)
- A **bubble** on a gate means **inversion**. An AND shape with an output bubble is a **NAND**; remove
  the bubble and it's an **AND**.
- Schematics generally read **left to right**, like text. The exception is **feedback**, which
  naturally runs the other way.

### Keep the wire count down

A schematic should show *what connects to what*, not drown you in wire. Rather than snaking one long
wire (say, a clock) all over the page, give the net a **name** and distribute it by name — the physical
connection still exists, you just don't draw it. A signal that leaves the page can be shown as a
labeled **arrowhead**.

### A note on symbols and HDL

Symbol standards have evolved. There was a push toward **rectangular** symbols with labels (a box with
"&" for AND) to ease typesetting, but it never really caught on — the **shape-distinctive** symbols
(the familiar AND/OR/XOR outlines) remain standard. Schematic *capture* eventually evolved into
**hardware description languages (HDL)**, so today much of a design's structure and documentation lives
inside HDL files. That has somewhat deemphasized standalone schematics — but they're still an excellent
way to reason about a circuit, and we'll keep using them throughout the course.
