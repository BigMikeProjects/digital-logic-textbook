## Boolean Basics

Becoming fluent with **Boolean algebra** starts with a handful of identities. This section introduces them — the single-variable properties, the duality rule that ties them together, the multi-variable laws, and De Morgan's theorem — alongside the companion video. With a little practice these become second nature.

Why learn them? Because identities are how expressions get *simpler*, and in digital logic a simpler expression is a smaller circuit — every term an algebraic step removes is gates removed from the hardware. The identities below are the toolkit for that simplification, and they reappear constantly for the rest of the course.

### Single-variable properties

Each property comes in an OR form and an AND form, and each is easy to convince yourself of by trying both values of $A$:

| Property | OR form | AND form | Why |
|----------|---------|----------|-----|
| **Identity** | $A + 0 = A$ | $A \cdot 1 = A$ | Output is *identical* to the input. |
| **Null** | $A + 1 = 1$ | $A \cdot 0 = 0$ | The dominating value wins; the variable is "nulled out." |
| **Idempotent** | $A + A = A$ | $A \cdot A = A$ | A variable operated with itself returns itself. |
| **Complement** | $A + \bar{A} = 1$ | $A \cdot \bar{A} = 0$ | A variable and its complement cover both cases. |
| **Involution** | $\bar{\bar{A}} = A$ | — | Complementing twice returns the original. |

Complement and involution are worth dwelling on: there is **no complement operation in ordinary algebra**, and it's the feature that makes Boolean algebra its own system. $A + \bar{A} = 1$ because between a variable and its complement, one of them is certainly 1; $A \cdot \bar{A} = 0$ because one of them is certainly 0. These two facts do a surprising amount of work in simplifications, as the worked example below shows.

### The duality rule

Every Boolean identity has a **dual**: swap each **OR with AND** and each **0 with 1**, and the result is also a valid identity. For example, the identity law $A + 0 = A$ becomes $A \cdot 1 = A$. This is why the properties above come in OR/AND pairs — memorize half the table and duality gives you the rest — and it foreshadows the complementary symmetry between sum-of-products and product-of-sums forms later in the course.

### Multi-variable identities

Several laws mirror ordinary algebra:

- **Commutative** — order doesn't matter: $A + B = B + A$, $A \cdot B = B \cdot A$.
- **Associative** — grouping doesn't matter: $(A + B) + C = A + (B + C)$.
- **Absorption** — a redundant term disappears: $A + A\cdot B = A$.
- **Distributive** — the familiar $A\cdot(B + C) = A\cdot B + A\cdot C$, **and** its dual

$$A + B\cdot C = (A + B)\cdot(A + C).$$

That second form "looks wrong" because ordinary algebra has no equivalent of distributing OR over AND — but it is valid, and since it's the one people doubt, let's verify it in full by comparing both sides' truth tables over all eight input combinations:

| $A$ | $B$ | $C$ | $B \cdot C$ | $A + B\cdot C$ | $A+B$ | $A+C$ | $(A+B)(A+C)$ |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 | 0 | 0 | **0** | 0 | 0 | **0** |
| 0 | 0 | 1 | 0 | **0** | 0 | 1 | **0** |
| 0 | 1 | 0 | 0 | **0** | 1 | 0 | **0** |
| 0 | 1 | 1 | 1 | **1** | 1 | 1 | **1** |
| 1 | 0 | 0 | 0 | **1** | 1 | 1 | **1** |
| 1 | 0 | 1 | 0 | **1** | 1 | 1 | **1** |
| 1 | 1 | 0 | 0 | **1** | 1 | 1 | **1** |
| 1 | 1 | 1 | 1 | **1** | 1 | 1 | **1** |

The two bold columns match on every row, so the identity holds. This is the general-purpose verification tool: *any* proposed identity can be settled the same way.

### A worked simplification

Here is the toolkit in action. Simplify

$$F = A\cdot B + A\cdot\bar{B} + \bar{A}\cdot B.$$

Work step by step, naming the identity used at each move:

1. $F = A\cdot(B + \bar{B}) + \bar{A}\cdot B$ — **distributive** (factor $A$ out of the first two terms)
2. $F = A\cdot 1 + \bar{A}\cdot B$ — **complement** ($B + \bar{B} = 1$)
3. $F = A + \bar{A}\cdot B$ — **identity** ($A \cdot 1 = A$)
4. $F = (A + \bar{A})\cdot(A + B)$ — **distributive dual** (the "looks wrong" form, used left to right)
5. $F = 1 \cdot (A + B)$ — **complement** ($A + \bar{A} = 1$)
6. $F = A + B$ — **identity**

Three product terms collapsed to a single OR. As hardware: the original needs two inverters, three ANDs, and a three-input OR; the simplified version is one OR gate. Same truth table, a fraction of the circuit — that is what these identities are *for*.

### De Morgan's theorem

De Morgan's theorem relates the complement of a combined expression to the complements of its parts:

$$\overline{A \cdot B} = \bar{A} + \bar{B} \qquad\text{and}\qquad \overline{A + B} = \bar{A} \cdot \bar{B}.$$

The rule of thumb is **"break the line, change the sign"**: break the long overbar into separate bars and switch the connecting operator (AND ↔ OR). Two mistakes are extremely common — and wrong:

$$\overline{A + B} \neq \bar{A} + \bar{B}, \qquad \overline{A \cdot B} \neq \bar{A} \cdot \bar{B}.$$

Both errors break the line *without* changing the sign. One test case kills the first: with $A = 1, B = 0$, $\overline{A+B} = 0$ but $\bar{A} + \bar{B} = 1$. The sign change is not optional.

### Bubble pushing

De Morgan's theorem has a handy schematic picture. A **NAND** gate is an AND with an inversion **bubble** on its output. Because $\overline{A\cdot B} = \bar{A} + \bar{B}$, pushing that bubble back through the gate turns the AND shape into an **OR with bubbles on its inputs**. Moving bubbles from one side of a gate to the other flips its functional shape between AND and OR (NAND ↔ OR-with-input-bubbles, NOR ↔ AND-with-input-bubbles). This "bubble pushing" is a practical shortcut once we start drawing schematics — it redraws a circuit into a more readable form without touching its truth table.

### Key Takeaways

Boolean algebra runs on a small set of identities: the single-variable properties (identity, null, idempotent, complement, involution), the shared-with-ordinary-algebra laws (commutative, associative, distributive), absorption, and De Morgan's theorem. Duality halves the memorization — swap OR↔AND and 0↔1 in any identity and you get another one. The complement property is the workhorse of simplification, and any identity you doubt can be settled by comparing truth-table columns. Simplification is not algebra for its own sake: every term an identity removes is gates removed from the hardware.

## Review Questions

**1. Which property says that $A + 1 = 1$?**
A. Identity
B. Null
C. Idempotent
D. Complement

**2. Using the duality rule, what is the dual of the identity $A \cdot 0 = 0$?**
A. $A + 0 = A$
B. $A \cdot 1 = A$
C. $A + 1 = 1$
D. $\bar{A} \cdot 1 = \bar{A}$

**3. What does $A + \bar{A}$ simplify to, and by which property?**
A. $A$, by the idempotent property
B. $0$, by the null property
C. $1$, by the complement property
D. $\bar{A}$, by involution

**4. Apply De Morgan's theorem to $\overline{A + B}$.**
A. $\bar{A} + \bar{B}$
B. $\bar{A} \cdot \bar{B}$
C. $A \cdot B$
D. $\overline{A} + B$

**5. How can you check whether a proposed identity like $A + B\cdot C = (A+B)\cdot(A+C)$ is valid?**
A. Build both sides' truth tables and compare the output columns
B. Test it with $A=B=C=1$ only
C. Check whether it looks like an ordinary-algebra rule
D. Boolean identities cannot be checked, only memorized

**6. In the worked example, $A\cdot(B + \bar{B})$ was reduced to $A$. Which two properties were used, in order?**
A. Null, then identity
B. Complement, then identity
C. Idempotent, then null
D. Absorption, then involution

## Answer Explanations

**1. B.** The null (annihilator) property: the dominating value wins. For OR that value is 1 ($A + 1 = 1$); for AND it is 0 ($A \cdot 0 = 0$). The variable is "nulled out" — it no longer affects the result. Identity (A) is the opposite case, where the constant leaves $A$ unchanged.

**2. C.** Duality swaps OR↔AND and 0↔1. Applying both swaps to $A \cdot 0 = 0$ gives $A + 1 = 1$ — the null property's other half. Option B is a true identity but it is the dual of $A + 0 = A$, not of the given one.

**3. C.** A variable and its complement cover both possibilities — one of them is certainly 1 — so their OR is always 1. This is the complement property, and it is the key move that makes whole terms vanish during simplification.

**4. B.** Break the line, change the sign: the overbar splits onto $A$ and $B$ individually, and the OR *changes* to AND, giving $\bar{A} \cdot \bar{B}$. Option A breaks the line without changing the sign — the classic error (test $A=1, B=0$: the two sides disagree).

**5. A.** Truth tables are the universal referee: enumerate every input combination, evaluate both sides, and the identity is valid exactly when the output columns match on every row. Familiarity with ordinary algebra (option C) actively misleads here — the "looks wrong" distributive dual is valid despite having no ordinary-algebra counterpart.

**6. B.** First $B + \bar{B} = 1$ (complement), turning the expression into $A \cdot 1$; then $A \cdot 1 = A$ (identity). This two-step collapse — complement to make a 1, identity to absorb it — is the most common simplification pattern in practice.
