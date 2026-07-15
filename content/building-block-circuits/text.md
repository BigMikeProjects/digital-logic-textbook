# Building Block Circuits

At this point we have a solid stack of combinational-logic basics: gates, Boolean algebra, truth
tables, Karnaugh-map minimization, and — most recently — adders. Those are the raw materials. This
section is where we start **assembling** them into a family of larger, reusable components that show
up again and again in real digital designs. We call them **building block circuits**: each one is
still just combinational logic underneath, but it is useful enough, and common enough, that it earns
its own name, its own schematic symbol, and a place in your mental toolkit.

The key habit this section builds is **abstraction**. Once you know exactly what a component does —
its input/output behavior — you can stop thinking about the gates inside it and simply treat it as a
**black box** that you drop into a larger design. That is how real hardware gets built: not by
drawing millions of individual gates, but by wiring together well-understood blocks whose behavior
you can count on.

## The Family of Blocks

This section introduces a related set of combinational building blocks:

- **Multiplexer (mux)** — selects one of several inputs to pass through to a single output.
- **Demultiplexer (demux)** — the reverse: routes one input to one of several outputs.
- **Decoder** — activates one specific output line based on a binary code at its inputs.
- **Encoder** — the reverse: produces a binary code identifying which input line is active.
- **Comparator** — compares two numbers and reports greater-than, less-than, or equal.
- **Parity circuit** — computes (or checks) a parity bit for error detection.
- **BCD-to-seven-segment decoder** — drives the seven segments of a numeric display from a
  binary-coded-decimal input.
- **Tri-state device** — an unusual but important element that can drive a `0`, a `1`, or
  effectively *disconnect* itself from a wire (a high-impedance state).

Notice that several of these come in **dual pairs** — one operation undoes the other, so it makes
sense to study them together. A **demultiplexer undoes a multiplexer**, and an **encoder undoes a
decoder**. Recognizing those pairings makes each one easier to understand: once you have a feel for
the mux, the demux is largely "the same idea, run backwards."

This is deliberately **not an exhaustive list** of every useful component in digital logic. In fact,
one of the *most* important building blocks is missing here on purpose — the **adder**. An adder is
every bit a building block, but it is important enough (and large enough) to deserve its own section,
which is exactly where we covered it. Treat that as the pattern: the blocks in this section are the
common, general-purpose pieces; a few especially significant ones get promoted to their own topics.

## Think in Schematics

Because these are, after all, *circuits*, it helps to give each one a **schematic symbol** and sketch
your designs as a diagram of connected blocks. Laying a design out this way — rather than as a sea of
individual gates — helps you organize your thinking and leads to cleaner designs.

A few of the symbols are distinctive enough to recognize on sight. The **multiplexer** has a very
common **trapezoidal** symbol; once you have seen it a few times, you will spot a mux in a schematic
instantly. The **tri-state** device also has its own recognizable symbol. Most of the others are
simply drawn as labeled rectangular blocks — a box that says, in effect, "a comparator goes here" —
with the details tucked inside.

## How Each Block Is Covered

Every topic in this section follows the same **four-part cadence**. Carrying this checklist into each
one will make the whole section feel consistent, and it is a good way to make sure you really
understand a component rather than just memorizing its name:

1. **Functionality.** *What does it actually do?* We start with the input/output relationship — the
   behavior you can rely on. Once you know that, you can treat the block as a black box in any design.
2. **Gate- (or transistor-) level construction.** It is one thing to know *what* a multiplexer does;
   it is another to have a feel for *how you would build one* from gates, or even transistors. Seeing
   the internal construction makes the block feel real — something you could actually put on silicon,
   not just an abstract symbol.
3. **Applications.** We look briefly at simple, common uses for each block. Many of these reappear
   later in the course when we work through complete digital-logic designs.
4. **Verilog.** Because this is a modern digital-logic course, each block also comes with a Verilog
   description — usually a **behavioral** one that captures the input/output relationship directly.
   This connects the schematic-level building block to the way real designs are written today.

With that map in hand, we are ready to jump in and work through the blocks one at a time.

## Key Takeaways

**Building block circuits** are mid-level combinational components — multiplexers, demultiplexers,
decoders, encoders, comparators, parity circuits, BCD-to-seven-segment decoders, and tri-state
devices — assembled from the gate-level basics and then reused as parts in larger designs. The
central skill is **abstraction**: know a block's input/output behavior and you can treat it as a
**black box**. Several blocks are **duals** — the **demux undoes the mux**, the **encoder undoes the
decoder** — so they are best learned in pairs. The list is not exhaustive, and the **adder** is
deliberately handled in its own section rather than here. Because these are circuits, each gets a
**schematic symbol** (the mux's trapezoid and the tri-state symbol are the distinctive ones); think
in schematics to organize a design. Finally, every block in this section is covered with the same
**four-part cadence**: functionality, gate/transistor-level construction, applications, and Verilog.

## Review Questions

**1. What best describes a "building block circuit" as used in this section?**
A. A single logic gate
B. A reusable mid-level combinational component assembled from basic gates and used as a part in larger designs
C. A sequential circuit that stores state
D. A physical breadboard

**2. Treating a building block as a "black box" means you rely on which of the following?**
A. The exact transistor layout inside it
B. Its input/output behavior, without worrying about the internal gates
C. Its physical size on the chip
D. The color of its schematic symbol

**3. Which two blocks form a dual pair, where one operation undoes the other?**
A. Comparator and adder
B. Parity circuit and multiplexer
C. Encoder and decoder
D. Tri-state device and comparator

**4. Why is the adder not covered as one of the blocks in this section?**
A. It is not a building block circuit
B. It is sequential, not combinational
C. It is important and large enough to warrant its own section
D. It cannot be drawn as a schematic symbol

**5. Which building block is described as having a distinctive trapezoidal schematic symbol?**
A. The decoder
B. The comparator
C. The multiplexer
D. The parity circuit

**6. What is the four-part cadence used to cover each block in this section?**
A. Functionality, gate/transistor-level construction, applications, and Verilog
B. History, cost, packaging, and testing
C. Truth table, K-map, NAND realization, and layout
D. Inputs, clock, reset, and output

## Answer Explanations

**1. B.** A building block circuit is a reusable, mid-level combinational component — a mux, decoder,
comparator, and so on — built out of the basic gates and then dropped into larger designs as a
single part. A lone gate (A) is too low-level, and these blocks are combinational, not stateful (C).

**2. B.** The whole point of abstraction is that once you know a block's input/output relationship,
you can use it without thinking about the gates inside — it becomes a black box whose behavior you
trust. The internal layout, size, and symbol styling are irrelevant to *using* it.

**3. C.** Encoders and decoders are duals: a decoder turns a binary code into one active output line,
and an encoder does the reverse, turning an active line back into a binary code. (The mux/demux pair
is the other dual mentioned; comparator, parity, and tri-state do not pair up this way.)

**4. C.** The adder absolutely *is* a building block, but it is important and substantial enough to
get its own dedicated section, so it is handled there rather than lumped in with the general-purpose
blocks here.

**5. C.** The multiplexer's trapezoidal symbol is called out as distinctive and instantly
recognizable. The tri-state device also has a recognizable symbol; most of the other blocks are just
drawn as labeled rectangles.

**6. A.** Each block is presented the same way: (1) its functionality/behavior, (2) how it is built
from gate- or transistor-level circuits, (3) common applications, and (4) a (typically behavioral)
Verilog description — connecting the abstract symbol to a real, buildable, and codeable circuit.
