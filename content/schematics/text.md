## A Schematic Guide

Schematic diagrams are how we keep track of what a circuit is and how its pieces fit together — both within a circuit and when connecting one system to another. A schematic is a piece of *writing*: someone else (often you, three weeks later) has to read it and reconstruct your intent. This section sets out the **conventions** we'll use in the course. None of them are sacred — many standards exist, and the right amount of detail depends on the **abstraction level** you're working at. A board you're about to wire needs pin, part, and package numbers; a high-level block view needs almost none. If you were wiring real TTL chips in a lab, omitting the pin numbers would make the drawing useless; on an architecture overview, including them would bury the idea in clutter. Match the detail to the purpose, and let every choice serve the reader.

### Net lists and clean wiring

Underneath every schematic is a **net list** — the record of what connects to what. That's the actual information content: you could hand someone a plain list ("G1's output connects to G2's input and G3's input") and they could rebuild the circuit. The drawing exists to make that list *graspable*, and here layout matters enormously. The *same* correct connections can be drawn as a messy diagonal tangle or squared up with **orthogonal (horizontal and vertical) wires** — same net list, but the orthogonal version is far easier to follow, so we'll favor it. In this topic's interactive, pressing **M** tidies the messy version into the orthogonal one; watch how the connections become obvious even though not a single connection changed.

Two terms come up constantly when describing these connection patterns:

- **Fan-out** — one output driving several gate inputs. An output wired to two different gates has a fan-out of two.
- **Fan-in** — several inputs feeding into one gate. A 2-input gate has a fan-in of two.

For now these are just vocabulary for reading schematics, but they'll return with engineering weight later — how many gates one output can realistically drive is a genuine design constraint.

### Junctions: dot means connect

Wires cross on every non-trivial schematic, so there must be an unambiguous way to say which crossings are connections. The convention is simple:

- A **junction dot** means the wires **connect**.
- Wires that merely **cross with no dot do *not* connect**.

One case deserves special care: the **four-way junction**, a single dot where four wires meet. Even drawn correctly, it's fragile — a smudged or faded dot turns "all four connect" into "two wires happen to cross," silently changing the circuit. The fix is to **stagger** the connection into two clean **T-junctions**: offset one wire slightly so the two joins happen at separate, unmistakable Ts. (Press **J** in the interactive to see the stagger applied.) Same net list, zero ambiguity.

### Direction, bubbles, and reading order

- Gates have a **direction**: signal flows from **input to output**. A gate is not a symmetric blob — the shape tells you which side listens and which side drives. (A few bidirectional devices exist; we'll meet them later.)
- A **bubble** on a gate means **inversion**. An AND shape with an output bubble is a **NAND**; remove the bubble and it's an AND. This is the same bubble you've already met twice: on the PMOS transistor symbol (turns on when low) and in bubble-pushing De Morgan manipulations. Across all of digital logic, the small circle consistently means "inverted here."
- Schematics generally read **left to right**, like text: inputs enter on the left, outputs leave on the right, and a reader can follow cause toward effect the way they follow a sentence. Drawing right-to-left is technically valid but makes readers work backward. The natural exception is **feedback**, which genuinely runs the other way — when we reach circuits that remember, the right-to-left wire will be the visual signature of memory.

### Keep the wire count down

A schematic should show *what connects to what*, not drown you in wire. A clock signal, for instance, may physically touch dozens of components — snaking one long wire all over the page to show that turns the drawing into spaghetti. Instead, give the net a **name** (say, `clock`) and distribute it by name: any pin labeled `clock` is understood to be connected to every other pin labeled `clock`. The physical connection still exists; you just stop drawing it. Likewise, a signal that leaves the page is shown as a labeled **arrowhead** rather than a wire running off the edge. Both practices trade drawn wire for names — and names are easier to read than tangles.

### A note on symbols and HDL

Symbol standards have evolved. There was a push toward **rectangular** symbols with labels (a box with "&" for AND) to ease typesetting, but it never really caught on — the **shape-distinctive** symbols (the familiar AND/OR/XOR outlines) let you recognize a circuit's structure at a glance, and they remain the standard. You should be able to read both, but we'll draw shapes.

Schematic *capture* — drawing schematics as the master description of a design — eventually evolved into **hardware description languages (HDL)**, so today much of a design's structure and documentation lives inside HDL files, exactly as the HDL topic described. That has somewhat deemphasized standalone schematics: the text is now the source of truth, the way text replaced hand-drawn design at scale. But schematics remain an excellent way to *reason* about a circuit — and to read a simulator's output, plan a module's structure, or explain a design at a whiteboard — so we'll keep drawing them throughout the course.

### Key Takeaways

A schematic is communication: it encodes a net list, and every convention exists to make that net list effortless to read. Use orthogonal wires; mark connections with junction dots and let dot-free crossings mean no connection; stagger four-way junctions into two T-junctions; draw signal flow left to right with inputs on the left (feedback excepted); read a bubble as inversion wherever it appears; and replace long snaking wires with named nets and off-page arrowheads. Detail should match the abstraction level — pin numbers for the lab bench, clean blocks for the big picture — because the goal is always the reader's understanding, not compliance with any one standard.

## Review Questions

**1. Two wires cross on a schematic with no junction dot. What does this mean?**
A. The wires are connected
B. The wires are not connected — they merely cross
C. The connection is optional
D. The schematic contains an error

**2. Why should a four-way junction be staggered into two T-junctions?**
A. Four-way junctions are electrically impossible
B. A single dot with four wires is ambiguous and fragile — the stagger makes each connection unmistakable
C. T-junctions use less wire
D. Staggering changes the net list to a simpler one

**3. One gate output drives the inputs of three other gates. What is this called?**
A. A fan-in of three
B. A fan-out of three
C. A three-way junction
D. A feedback path

**4. An AND-shaped symbol has a small circle on its output. What is the gate?**
A. An AND gate — the circle is decorative
B. A NAND gate — the bubble means the output is inverted
C. An OR gate
D. A buffer

**5. A clock signal connects to many components across a large schematic. What is the recommended way to draw it?**
A. One long wire snaking to every component
B. Give the net a name and label each connection point — the wire is understood, not drawn
C. Omit the clock from the schematic entirely
D. Draw the clock in a different color

**6. Schematics are normally drawn reading left to right. What is the natural exception?**
A. Power supply wires
B. Feedback paths, which genuinely run backward
C. Any gate with more than two inputs
D. Wires longer than the page width

## Answer Explanations

**1. B.** The dot carries all the meaning: dot = connect, no dot = no connection. Crossings without dots are routine and correct — on any dense schematic, unrelated wires must cross somewhere.

**2. B.** Even a correctly drawn four-way dot is one smudge away from reading as a plain crossing, which would silently change the circuit. Two offset T-junctions express the same net list with no ambiguity — each join is unmistakably a join. (The net list itself doesn't change (D); only the drawing does.)

**3. B.** Fan-OUT counts how many inputs one output drives — here three. Fan-IN is the mirror term, counting the inputs arriving at a single gate. Both matter later as real design constraints, not just vocabulary.

**4. B.** The bubble is digital logic's universal inversion marker — the same circle seen on PMOS transistors and in bubble-pushing. On an AND's output it inverts the result: AND with a bubble is NAND; remove the bubble and the AND returns.

**5. B.** Named nets replace drawn wire: every pin labeled `clock` is understood to connect to every other. The physical connection is real; only the ink is saved. (Off-page signals get the same treatment with a labeled arrowhead.)

**6. B.** Left-to-right mirrors reading order — cause flows to effect. Feedback is the honest exception: its wires really do return output to input, and that backward wire becomes the visual signature of circuits with memory later in the course.
