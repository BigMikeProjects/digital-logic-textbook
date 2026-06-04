# De Morgan's Theorem and Universal Gates

In the previous section, we introduced the basic logic gates—AND, OR, NOT, NAND, NOR, XOR, and XNOR—and noted that NAND and NOR are called *universal gates*. This section explores why that property matters and introduces De Morgan's theorem, one of the most important tools for translating between human-readable Boolean expressions and efficient hardware implementations.

## The Gap Between Logic and Hardware

When engineers design digital circuits, they typically think in terms of AND, OR, and NOT operations. These operations map naturally to how humans reason about conditions: "if A *and* B are true" or "if A *or* B is true." Boolean algebra, with its familiar AND (·) and OR (+) operations, provides an intuitive framework for expressing logical relationships.

However, actual digital hardware tells a different story. In CMOS technology—the dominant fabrication process for modern integrated circuits—NAND and NOR gates are fundamentally more efficient than AND and OR gates. A two-input NAND or NOR gate requires only four transistors, while a two-input AND or OR gate requires six transistors (the basic NAND or NOR plus an inverter to flip the output).

This creates a tension: engineers want to *think* in ANDs and ORs, but they want to *build* with NANDs and NORs. De Morgan's theorem bridges this gap, providing a systematic way to convert between these representations while preserving logical equivalence.

## Transistor Economics

To appreciate why this matters, consider the economics of transistor counts. In an integrated circuit containing millions or billions of gates, even small per-gate savings multiply into significant reductions in chip area, power consumption, and manufacturing cost.

| Gate Type | Transistors (2-input) |
|-----------|----------------------|
| NOT (Inverter) | 2 |
| NAND | 4 |
| NOR | 4 |
| AND | 6 |
| OR | 6 |

The AND gate's six transistors come from implementing a NAND (four transistors) followed by an inverter (two transistors). Similarly, an OR gate is a NOR followed by an inverter. By working directly with NAND and NOR gates, designers can often eliminate unnecessary inversions and reduce transistor counts.

Historically, this efficiency also simplified inventory management. When digital systems were built from discrete integrated circuit chips—each containing a handful of gates—stocking only NAND gates and inverters (or only NOR gates and inverters) was simpler than maintaining supplies of every gate type.

## De Morgan's Theorem

De Morgan's theorem provides two fundamental equivalences that relate AND and OR operations through inversion. These equivalences are the key to converting between AND/OR logic and NAND/NOR implementations.

### First Form: NAND Equivalence

The first form of De Morgan's theorem states:

$$\overline{A \cdot B} = \bar{A} + \bar{B}$$

In words: the complement of A AND B equals NOT-A OR NOT-B. This means a NAND gate (left side) produces the same output as an OR gate with inverted inputs (right side).

We can verify this equivalence with a truth table:

| A | B | $\bar{A}$ | $\bar{B}$ | $A \cdot B$ | $\overline{A \cdot B}$ | $\bar{A} + \bar{B}$ |
|---|---|-----------|-----------|-------------|------------------------|---------------------|
| 0 | 0 | 1 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 | 1 | 0 | 0 |

The final two columns are identical, confirming the equivalence.

### Second Form: NOR Equivalence

The second form of De Morgan's theorem states:

$$\overline{A + B} = \bar{A} \cdot \bar{B}$$

In words: the complement of A OR B equals NOT-A AND NOT-B. This means a NOR gate (left side) produces the same output as an AND gate with inverted inputs (right side).

| A | B | $\bar{A}$ | $\bar{B}$ | $A + B$ | $\overline{A + B}$ | $\bar{A} \cdot \bar{B}$ |
|---|---|-----------|-----------|---------|--------------------|-----------------------|
| 0 | 0 | 1 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 | 0 | 0 |
| 1 | 1 | 0 | 0 | 1 | 0 | 0 |

Again, the final two columns match, confirming the equivalence.

### The "Break the Bar, Change the Sign" Mnemonic

A useful way to remember De Morgan's theorem is the phrase "break the bar, change the sign." When you have an expression with a bar (inversion) over multiple terms connected by AND or OR:

1. **Break the bar**: Distribute the inversion to each individual term
2. **Change the sign**: Convert AND to OR, or OR to AND

For example, starting with $\overline{A \cdot B}$:
- Break the bar: $\bar{A}$ and $\bar{B}$
- Change the sign: AND becomes OR
- Result: $\bar{A} + \bar{B}$

This mnemonic works in both directions and extends to expressions with more than two variables.

## Bubble Notation and Gate Symbols

In circuit diagrams, inversion is indicated by a small circle called a *bubble*. De Morgan's theorem has an elegant visual interpretation using bubbles:

- A **NAND gate** can be drawn as an AND shape with a bubble on the output, *or equivalently* as an OR shape with bubbles on the inputs
- A **NOR gate** can be drawn as an OR shape with a bubble on the output, *or equivalently* as an AND shape with bubbles on the inputs

These alternative representations are not just notational conveniences—they provide visual cues about the logical function being performed. When reading a circuit diagram, seeing an OR shape with input bubbles immediately suggests "this is functioning as a NAND in terms of the original (non-inverted) signals."

This flexibility in representation becomes particularly valuable when analyzing multi-level logic circuits, where signals pass through several gates in sequence. By choosing appropriate symbol representations, designers can make the logical intent of a circuit more apparent.

## Universal Gates

A logic gate is called *universal* if any Boolean function can be implemented using only that gate type. Both NAND and NOR gates have this property.

### Why NAND is Universal

To prove that NAND is universal, we need to show that it can implement the three fundamental operations: NOT, AND, and OR. Since any Boolean function can be expressed using combinations of NOT, AND, and OR, being able to build these three operations means we can build anything.

**NOT from NAND:**

If we connect both inputs of a NAND gate to the same signal, we get an inverter:

$$\overline{A \cdot A} = \bar{A}$$

This works because A AND A simply equals A, so NAND of A with itself gives NOT-A.

| A | $A \cdot A$ | $\overline{A \cdot A}$ |
|---|-------------|------------------------|
| 0 | 0 | 1 |
| 1 | 1 | 0 |

**AND from NAND:**

An AND gate is a NAND followed by a NOT. Since we can build NOT from NAND, we can build AND using two NAND gates:

$$A \cdot B = \overline{\overline{A \cdot B}}$$

**OR from NAND:**

By De Morgan's theorem, $A + B = \overline{\bar{A} \cdot \bar{B}}$. We can implement this with three NAND gates: two configured as inverters (to produce $\bar{A}$ and $\bar{B}$) and one to NAND those results together.

### Why NOR is Universal

The same logic applies to NOR gates. By tying both inputs together, a NOR gate becomes an inverter:

$$\overline{A + A} = \bar{A}$$

From there, OR can be built as NOR followed by NOT, and AND can be built using De Morgan's theorem: $A \cdot B = \overline{\bar{A} + \bar{B}}$.

### Practical Implications

The universality of NAND and NOR gates means that an entire digital system—no matter how complex—can be built using only one type of gate plus (optionally) inverters. Modern synthesis tools exploit this property, converting arbitrary Boolean expressions into optimized networks of NAND gates (or NOR gates, depending on the target technology).

However, "all-NAND" or "all-NOR" implementation is often a simplification. In practice, designs typically use NAND gates plus inverters (or NOR gates plus inverters), because dedicated inverters are so small and fast. The key insight is that the variety of gate types needed is minimal, even for arbitrarily complex functions.

## NAND-Only and NOR-Only Design

When we say a circuit uses "all-NAND" or "all-NOR" implementation, we typically mean:

- **All-NAND**: The circuit uses only NAND gates and inverters (where inverters may themselves be NAND gates with tied inputs)
- **All-NOR**: The circuit uses only NOR gates and inverters (where inverters may themselves be NOR gates with tied inputs)

The process of converting a standard AND/OR expression to all-NAND or all-NOR form involves systematic application of De Morgan's theorem and double-inversion ($\overline{\overline{X}} = X$). We will explore specific conversion techniques when we study multi-level logic circuits in later sections.

## Key Takeaways

De Morgan's theorem is one of the most frequently used tools in digital logic design. Its two forms—relating NAND to OR-with-inverted-inputs and NOR to AND-with-inverted-inputs—provide the foundation for converting between human-readable Boolean expressions and transistor-efficient implementations.

The universality of NAND and NOR gates means that any digital function can be realized using a single gate type. This property simplifies manufacturing, reduces the variety of components needed, and enables powerful optimization algorithms in modern design tools.

The bubble notation for inversion, combined with De Morgan's theorem, gives designers flexibility in how they represent circuits. By choosing gate symbols that highlight the logical intent, circuit diagrams become easier to read and analyze.

---

## Review Questions

**1. Why do NAND and NOR gates require fewer transistors than AND and OR gates in CMOS technology?**

- A) NAND and NOR operate at lower voltages
- B) AND and OR gates are built from NAND or NOR plus an inverter
- C) NAND and NOR gates have fewer inputs
- D) AND and OR gates require additional power supply connections

---

**2. According to De Morgan's theorem, which expression is equivalent to $\overline{A + B}$?**

- A) $\bar{A} + \bar{B}$
- B) $\bar{A} \cdot \bar{B}$
- C) $A \cdot B$
- D) $\overline{A} + B$

---

**3. How can a NAND gate be configured to function as an inverter?**

- A) Connect the output to one of the inputs
- B) Connect both inputs to the same signal
- C) Leave one input disconnected
- D) Connect the output to ground

---

**4. What does "universal gate" mean in the context of digital logic?**

- A) The gate works with any voltage level
- B) Any Boolean function can be implemented using only that gate type
- C) The gate is used in all countries' electronics standards
- D) The gate can perform both analog and digital operations

---

**5. The mnemonic "break the bar, change the sign" helps remember De Morgan's theorem. If you start with $\overline{A \cdot B \cdot C}$, what is the equivalent expression?**

- A) $\bar{A} \cdot \bar{B} \cdot \bar{C}$
- B) $\bar{A} + \bar{B} + \bar{C}$
- C) $A + B + C$
- D) $\overline{A + B + C}$

---

**6. Which statement correctly describes the relationship between a NOR gate and its De Morgan equivalent?**

- A) A NOR gate equals an AND gate with inverted inputs
- B) A NOR gate equals an OR gate with inverted inputs
- C) A NOR gate equals an AND gate with inverted output
- D) A NOR gate equals a NAND gate with inverted inputs

---

**7. In an "all-NAND" circuit implementation, how are simple inversions (NOT operations) typically realized?**

- A) Using separate NOT gate chips
- B) Using NAND gates with both inputs tied together
- C) By omitting the inversion entirely
- D) Using resistors to invert voltage levels

---

**8. Why might an engineer choose to represent a NAND gate as an OR symbol with input bubbles?**

- A) To reduce the number of gates in the circuit
- B) To make the logical intent clearer when analyzing signal flow
- C) To change the gate's electrical behavior
- D) To indicate that the gate is defective

---

## Answer Explanations

**1. Answer: B) AND and OR gates are built from NAND or NOR plus an inverter**

In CMOS technology, NAND and NOR are the "natural" gate types, requiring only 4 transistors each. To create AND or OR outputs, designers must add an inverter (2 transistors) after the NAND or NOR, resulting in 6 transistors total.

- *Lower voltages* (A) is incorrect—all gates in a design use the same supply voltage.
- *Fewer inputs* (C) is incorrect—the input count is the same for comparable gates.
- *Power supply connections* (D) is incorrect—this doesn't affect transistor count.

**2. Answer: B) $\bar{A} \cdot \bar{B}$**

De Morgan's second form states that $\overline{A + B} = \bar{A} \cdot \bar{B}$. The complement of an OR expression equals the AND of the complemented terms.

- *$\bar{A} + \bar{B}$* (A) is the result of applying De Morgan's to $\overline{A \cdot B}$.
- *$A \cdot B$* (C) removes the inversions entirely, which is incorrect.
- *$\overline{A} + B$* (D) is not a valid De Morgan transformation.

**3. Answer: B) Connect both inputs to the same signal**

When both inputs of a NAND gate receive the same signal A, the gate computes $\overline{A \cdot A} = \bar{A}$, which is simply the complement of A—an inverter function.

- *Output to input* (A) would create feedback, not inversion.
- *Disconnected input* (C) creates undefined behavior in most technologies.
- *Output to ground* (D) would short-circuit the gate.

**4. Answer: B) Any Boolean function can be implemented using only that gate type**

A universal gate can implement NOT, AND, and OR—the complete set of basic operations—using only copies of itself. Since any Boolean function can be expressed with NOT, AND, and OR, a universal gate can build anything.

- *Any voltage* (A), *international standards* (C), and *analog operations* (D) are not what "universal" means in this context.

**5. Answer: B) $\bar{A} + \bar{B} + \bar{C}$**

Applying "break the bar, change the sign": the bar breaks to cover each term individually ($\bar{A}$, $\bar{B}$, $\bar{C}$), and the AND operations change to OR, giving $\bar{A} + \bar{B} + \bar{C}$.

- *$\bar{A} \cdot \bar{B} \cdot \bar{C}$* (A) breaks the bar but doesn't change the sign.
- *$A + B + C$* (C) changes the sign but doesn't break the bar.
- *$\overline{A + B + C}$* (D) changes the sign but moves the bar instead of breaking it.

**6. Answer: A) A NOR gate equals an AND gate with inverted inputs**

De Morgan's theorem: $\overline{A + B} = \bar{A} \cdot \bar{B}$. A NOR gate (OR with inverted output) equals an AND operating on inverted inputs.

- *OR with inverted inputs* (B) describes a NAND gate.
- *AND with inverted output* (C) describes a NAND gate.
- *NAND with inverted inputs* (D) is not a direct De Morgan equivalence.

**7. Answer: B) Using NAND gates with both inputs tied together**

In all-NAND design, inverters are created by connecting both NAND inputs to the same signal: $\overline{A \cdot A} = \bar{A}$.

- *Separate NOT chips* (A) would violate the "all-NAND" constraint.
- *Omitting inversion* (C) would change the logic function.
- *Resistors* (D) are not used for logic inversion in CMOS.

**8. Answer: B) To make the logical intent clearer when analyzing signal flow**

The alternative symbol representation (OR shape with input bubbles for NAND) is logically equivalent and can make circuit diagrams easier to read. When signals are already inverted earlier in the circuit, showing input bubbles highlights where inversions cancel.

- *Reduce gate count* (A) is incorrect—the symbol choice doesn't change the circuit.
- *Change electrical behavior* (C) is incorrect—it's purely a representational choice.
- *Indicate defect* (D) is incorrect—this is standard notation, not an error indicator.
