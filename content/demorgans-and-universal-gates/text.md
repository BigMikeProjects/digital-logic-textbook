## De Morgan's Theorem and Universal Gates

In the previous section we introduced the basic logic gates — AND, OR, NOT, NAND, NOR, XOR, and XNOR — and noted in passing that NAND and NOR are called *universal gates*. This section explains why that property matters and introduces De Morgan's theorem, the tool that lets a designer think in ANDs and ORs while building with NANDs and NORs. The interactive above shows both halves of the theorem as clickable truth tables, and both universal gates wired up as inverters.

## The Gap Between Logic and Hardware

When engineers design digital circuits, they think in AND, OR, and NOT. Those operations map directly onto how people reason about conditions — "if A *and* B," "if A *or* B" — and Boolean algebra, with its AND (·) and OR (+), is the natural language for writing a function down.

The hardware tells a different story. In CMOS, the dominant process for modern integrated circuits, **NAND and NOR are the natural gates**. A two-input NAND or NOR is four transistors. An AND or an OR does not exist on its own: it is a NAND or NOR *followed by an inverter*, six transistors in all. The two inversion-free gates that feel most basic to a person are, to the silicon, the expensive ones.

So there is a tension. We want to *think* in ANDs and ORs and *build* in NANDs and NORs. De Morgan's theorem is the bridge — a systematic way to move between the two without changing the function.

## Transistor Economics

The per-gate difference looks small until it is multiplied by the size of a chip.

| Gate (2-input) | Transistors | Built as |
|---|---|---|
| NOT (inverter) | 2 | — |
| NAND | 4 | — |
| NOR | 4 | — |
| AND | 6 | NAND + inverter |
| OR | 6 | NOR + inverter |

Two transistors saved per gate, across the millions or billions of gates on a die, is real area, real power, and real cost. Working directly in NAND and NOR lets a designer — or, today, a synthesis tool — drop the inversions that AND and OR carry around, and often lets neighboring inversions cancel outright.

There is a historical reason too. When digital systems were built from discrete chips, each holding a handful of gates, stocking one kind of gate plus inverters was far simpler than keeping every gate type on the shelf. A stockpile of NAND chips could build anything. The economics have changed; the universality that made it possible has not.

## De Morgan's Theorem

De Morgan's theorem is a pair of identities that relate AND and OR through inversion. They are the key to every conversion in this section and the next two.

### First Form: NAND Equals OR with Inverted Inputs

$$\overline{A \cdot B} = \bar{A} + \bar{B}$$

In words: the complement of (A AND B) equals (NOT A) OR (NOT B). A NAND gate — the left side — produces exactly what an OR gate with both inputs inverted produces. Check every row:

| A | B | $\bar{A}$ | $\bar{B}$ | $A \cdot B$ | $\overline{A \cdot B}$ | $\bar{A} + \bar{B}$ |
|---|---|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 | 1 | 0 | 0 |

The last two columns agree on all four rows, so the two expressions are the same function. That is the whole proof — with a finite number of input combinations, a truth table settles equivalence completely. Click the rows of the interactive's first tab, *OR + Bubbles = NAND*, to watch both circuits agree case by case.

### Second Form: NOR Equals AND with Inverted Inputs

$$\overline{A + B} = \bar{A} \cdot \bar{B}$$

The complement of (A OR B) equals (NOT A) AND (NOT B): a NOR gate does what an AND gate with inverted inputs does.

| A | B | $\bar{A}$ | $\bar{B}$ | $A + B$ | $\overline{A + B}$ | $\bar{A} \cdot \bar{B}$ |
|---|---|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 | 0 | 0 |
| 1 | 1 | 0 | 0 | 1 | 0 | 0 |

Again the final two columns match. The second tab of the interactive, *AND + Bubbles = NOR*, is this table.

### Break the Bar, Change the Sign

The mnemonic for both forms is **"break the bar, change the sign."** Given an inversion bar over terms joined by AND or OR:

1. **Break the bar** — distribute the inversion onto each term individually.
2. **Change the sign** — every AND becomes OR, every OR becomes AND.

Starting from $\overline{A \cdot B}$: break the bar to get $\bar{A}$ and $\bar{B}$, change the sign from AND to OR, and the result is $\bar{A} + \bar{B}$. It runs in reverse just as well, and it extends to any number of variables: $\overline{A \cdot B \cdot C} = \bar{A} + \bar{B} + \bar{C}$, and $\overline{A + B + C} = \bar{A} \cdot \bar{B} \cdot \bar{C}$.

One thing the mnemonic does *not* say: the bar breaks over the operator it sits on, not over bars that are already there. Take $\overline{\bar{A} \cdot B}$. Break the bar over the AND: $\overline{\bar{A}} + \bar{B}$. The double bar on $A$ is two inversions, which cancel, leaving $A + \bar{B}$. Students who reach for "flip everything" get $\bar{A} + \bar{B}$ here, which is wrong — the check, as always, is a truth table.

## Bubble Notation and Gate Symbols

In a schematic, an inversion is a small circle — a *bubble* — on a gate's input or output. De Morgan's theorem has a direct visual reading in bubbles:

- A **NAND** is an AND shape with a bubble on its output, *or equivalently* an OR shape with bubbles on both inputs.
- A **NOR** is an OR shape with a bubble on its output, *or equivalently* an AND shape with bubbles on both inputs.

These are the same gate drawn two ways, and the choice of drawing is a message to whoever reads the diagram. An OR shape with input bubbles says "this gate is combining signals that were already inverted upstream — think of it as an OR." An AND shape with an output bubble says "think of it as an AND whose result is inverted." Both are physically the same four transistors.

The payoff comes in circuits of several gates in a row. Choosing each gate's drawing so that output bubbles land on input bubbles makes the inversions cancel *on the page*, and the diagram reads as the original AND/OR logic even though every gate in it is a NAND or a NOR. That technique — *bubble pushing* — is the subject of the next two sections; here it is enough to see where it comes from.

## Universal Gates

A gate is **universal** if any Boolean function can be built from copies of that gate alone. NAND and NOR both qualify.

### Why NAND Is Universal

Any Boolean function can be written with NOT, AND, and OR. So if a NAND gate can build those three, it can build anything.

**NOT from NAND.** Tie both inputs of a NAND to the same signal:

$$\overline{A \cdot A} = \bar{A}$$

$A \cdot A$ is just $A$, so NAND-ing a signal with itself inverts it.

| A | $A \cdot A$ | $\overline{A \cdot A}$ |
|---|---|---|
| 0 | 0 | 1 |
| 1 | 1 | 0 |

The interactive's third tab, *NAND as Inverter*, is this two-row table with the wiring drawn.

**AND from NAND.** An AND is a NAND followed by a NOT, and NOT is a NAND with tied inputs — two NAND gates:

$$A \cdot B = \overline{\overline{A \cdot B}}$$

**OR from NAND.** By De Morgan's first form run backwards, $A + B = \overline{\bar{A} \cdot \bar{B}}$. Three NAND gates do it: two wired as inverters to make $\bar{A}$ and $\bar{B}$, and one to NAND those together.

### Why NOR Is Universal

The same argument with the gates swapped. Tie a NOR's inputs together and it inverts:

$$\overline{A + A} = \bar{A}$$

(the fourth tab, *NOR as Inverter*). OR is a NOR followed by a NOT; AND comes from De Morgan's second form, $A \cdot B = \overline{\bar{A} + \bar{B}}$ — two NORs as inverters feeding a third.

### What Universality Buys

Because either gate is universal, an entire digital system, however large, can be built from one gate type — plus inverters, which are so small and fast that in practice they are kept as a second part rather than made from tied-input NANDs. Modern synthesis tools rely on this: they take a behavioral description, choose a target library, and map the logic onto networks of NAND or NOR gates, cancelling inversions wherever De Morgan allows. The variety of gate types a design *needs* is minimal, no matter how complex the function.

## A Worked Conversion

To see the theorem doing work, take a small function written the natural way and rebuild it from NANDs:

$$F = A \cdot B + C$$

Written as drawn: an AND gate for $A \cdot B$ and an OR gate to add $C$. In CMOS that is $6 + 6 = 12$ transistors.

Now apply De Morgan to the OR. Using the first form backwards, $X + C = \overline{\bar{X} \cdot \bar{C}}$ with $X = A \cdot B$:

$$F = \overline{\overline{A \cdot B} \cdot \bar{C}}$$

Read the right-hand side as gates: $\overline{A \cdot B}$ is one NAND; $\bar{C}$ is an inverter; and the outer bar over the product is a second NAND combining them. Two NANDs and one inverter — $4 + 4 + 2 = 10$ transistors, for the identical function. The inversion that the AND gate was carrying around cancelled against an inversion the OR gate needed; the inverter on $C$ is the only one that survived.

That is the pattern in miniature: write the function, apply De Morgan where an AND feeds an OR, and let the bars cancel. The next section, *Schematic Abstraction and Transistor Count*, does the same count on a slightly larger example, and *All-NAND and All-NOR Realizations* turns the bookkeeping into a graphical method.

## Key Takeaways

De Morgan's theorem has two forms: $\overline{A \cdot B} = \bar{A} + \bar{B}$ (a NAND is an OR with inverted inputs) and $\overline{A + B} = \bar{A} \cdot \bar{B}$ (a NOR is an AND with inverted inputs). The mnemonic is "break the bar, change the sign," and a truth table proves either form in four rows. In CMOS a NAND or NOR costs 4 transistors while an AND or OR costs 6, because AND and OR are a NAND/NOR plus an inverter — so building in NAND/NOR and letting inversions cancel saves hardware. NAND and NOR are universal: each can make NOT (tie the inputs), and from NOT plus De Morgan it can make AND and OR, hence any function. Bubble notation draws each universal gate two ways, which is what makes the cancellation visible on a schematic.

## Review Questions

### Question 1

Why do NAND and NOR gates require fewer transistors than AND and OR gates in CMOS?

A. NAND and NOR operate at lower voltages
B. AND and OR gates are built as a NAND or NOR followed by an inverter
C. NAND and NOR gates have fewer inputs
D. AND and OR gates need extra power-supply connections

### Question 2

According to De Morgan's theorem, which expression equals $\overline{A + B}$?

A. $\bar{A} + \bar{B}$
B. $\bar{A} \cdot \bar{B}$
C. $A \cdot B$
D. $\bar{A} + B$

### Question 3

How is a NAND gate wired to act as an inverter?

A. Connect the output back to one input
B. Connect both inputs to the same signal
C. Leave one input disconnected
D. Connect the output to ground

### Question 4

What does "universal gate" mean?

A. The gate works at any voltage
B. Any Boolean function can be built from that gate type alone
C. The gate is used in every country's standards
D. The gate handles both analog and digital signals

### Question 5

Apply "break the bar, change the sign" to $\overline{A \cdot B \cdot C}$.

A. $\bar{A} \cdot \bar{B} \cdot \bar{C}$
B. $\bar{A} + \bar{B} + \bar{C}$
C. $A + B + C$
D. $\overline{A + B + C}$

### Question 6

A NOR gate is equivalent to which of the following?

A. An AND gate with inverted inputs
B. An OR gate with inverted inputs
C. An AND gate with an inverted output
D. A NAND gate with inverted inputs

### Question 7

Apply De Morgan's theorem to $\overline{\bar{A} \cdot B}$.

A. $\bar{A} + \bar{B}$
B. $A + \bar{B}$
C. $\bar{A} \cdot \bar{B}$
D. $A \cdot B$

### Question 8

$F = A \cdot B + C$ is rebuilt as $\overline{\overline{A \cdot B} \cdot \bar{C}}$. What gates does the rebuilt form use, and how many transistors?

A. Two NANDs and one inverter — 10
B. One NAND and one NOR — 8
C. One AND and one OR — 12
D. Three NANDs — 12

## Answer Explanations

**1. B.** In CMOS the natural gates are NAND and NOR, four transistors each. An AND or OR output needs an inverter added after the NAND or NOR — two more transistors, six in total.

**2. B.** De Morgan's second form: the complement of an OR is the AND of the complements. Option A is the first form applied to $\overline{A \cdot B}$; C drops the inversions; D is not a De Morgan transformation.

**3. B.** With both inputs at $A$, the gate computes $\overline{A \cdot A} = \bar{A}$. Feeding the output back (A) makes a feedback circuit, a floating input (C) is undefined, and grounding the output (D) is a short.

**4. B.** A universal gate can build NOT, AND, and OR from copies of itself, and every Boolean function can be written in those three operations.

**5. B.** Break the bar over each term ($\bar{A}$, $\bar{B}$, $\bar{C}$) and change the ANDs to ORs. Option A breaks the bar without changing the sign; C changes the sign without breaking the bar; D moves the bar instead of breaking it.

**6. A.** $\overline{A + B} = \bar{A} \cdot \bar{B}$: a NOR (OR with inverted output) is an AND acting on inverted inputs. B and C both describe a NAND.

**7. B.** Break the bar over the AND: $\overline{\bar{A}} + \bar{B}$. The double inversion on $A$ cancels, giving $A + \bar{B}$. Option A is the "flip everything" mistake — the existing bar on $A$ is part of the term, not part of what breaks.

**8. A.** $\overline{A \cdot B}$ is a NAND, $\bar{C}$ is an inverter, and the outer bar over their product is a second NAND: $4 + 2 + 4 = 10$ transistors, versus 12 for the AND-plus-OR original.
