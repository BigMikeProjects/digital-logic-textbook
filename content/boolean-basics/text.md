## Boolean Basics

Becoming fluent with **Boolean algebra** starts with a handful of identities. This section
introduces them — the single-variable properties, the duality rule that ties them together, the
multi-variable laws, and De Morgan's theorem — alongside the companion video. With a little practice
these become second nature.

### Single-variable properties

| Property | OR form | AND form | Why |
|----------|---------|----------|-----|
| **Identity** | $A + 0 = A$ | $A \cdot 1 = A$ | Output is *identical* to the input. |
| **Null** | $A + 1 = 1$ | $A \cdot 0 = 0$ | The dominating value wins; the variable is "nulled out." |
| **Idempotent** | $A + A = A$ | $A \cdot A = A$ | A variable operated with itself returns itself. |
| **Complement** | $A + \bar{A} = 1$ | $A \cdot \bar{A} = 0$ | A variable and its complement cover both cases. |
| **Involution** | $\bar{\bar{A}} = A$ | — | Complementing twice returns the original. |

Complement and involution are worth dwelling on: there is **no complement operation in ordinary
algebra**, and it's the feature that makes Boolean algebra its own system.

### The duality rule

Every Boolean identity has a **dual**: swap each **OR with AND** and each **0 with 1**, and the result
is also a valid identity. For example, the identity law $A + 0 = A$ becomes $A \cdot 1 = A$. This is
why the properties above come in OR/AND pairs, and it foreshadows the complementary symmetry between
sum-of-products and product-of-sums forms later in the course.

### Multi-variable identities

Several laws mirror ordinary algebra:

- **Commutative** — order doesn't matter: $A + B = B + A$, $A \cdot B = B \cdot A$.
- **Associative** — grouping doesn't matter: $(A + B) + C = A + (B + C)$.
- **Absorption** — a redundant term disappears: $A + A\cdot B = A$.
- **Distributive** — the familiar $A\cdot(B + C) = A\cdot B + A\cdot C$, **and** its dual

$$A + B\cdot C = (A + B)\cdot(A + C).$$

That second form "looks wrong" because ordinary algebra has no equivalent of distributing OR over
AND — but a truth table confirms it. In fact, *any* of these identities can be verified by building
both sides' truth tables and checking that the output columns match.

### De Morgan's theorem

De Morgan's theorem relates the complement of a combined expression to the complements of its parts:

$$\overline{A \cdot B} = \bar{A} + \bar{B} \qquad\text{and}\qquad \overline{A + B} = \bar{A} \cdot \bar{B}.$$

The rule of thumb is **"break the line, change the sign"**: break the long overbar into separate bars
and switch the connecting operator (AND ↔ OR). Two mistakes are extremely common — and wrong:

$$\overline{A + B} \neq \bar{A} + \bar{B}, \qquad \overline{A \cdot B} \neq \bar{A} \cdot \bar{B}.$$

### Bubble pushing

De Morgan's theorem has a handy schematic picture. A **NAND** gate is an AND with an inversion
**bubble** on its output. Because $\overline{A\cdot B} = \bar{A} + \bar{B}$, pushing that bubble back
through the gate turns the AND shape into an **OR with bubbles on its inputs**. Moving bubbles from one
side of a gate to the other flips its functional shape between AND and OR (NAND ↔ OR-with-input-bubbles,
NOR ↔ AND-with-input-bubbles). This "bubble pushing" is a practical shortcut once we start drawing
schematics.
