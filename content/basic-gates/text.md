## Basic Logic Gates

In a course on digital logic, logic gates are the natural starting point. They provide a clean and simple way to describe digital behavior without getting buried in circuit implementation details. Rather than beginning with transistor-level circuit diagrams, we start with something more straightforward and conceptually more powerful: the logic gate.

## What Is a Logic Gate?

A logic gate is an abstraction — a basic building block for digital systems. It takes one or more binary inputs and produces a binary output according to a fixed rule. That fixed rule is the whole gate: same inputs, same output, every time. Gates are "logical" in the sense that their rules mirror the way we reason about things with two states: true or false, yes or no, on or off.

Each logic gate can be represented in three complementary ways:

1. **Truth table**: a complete listing of all possible input combinations and their outputs
2. **Logic symbol**: a distinctive shape used in circuit diagrams
3. **Boolean expression**: an algebraic formula using Boolean notation

All three describe exactly the same rule, and engineers translate between them constantly — you will read a schematic, write its expression, and check its truth table within a single problem. Fluency in all three is the goal of this section.

## The NOT Gate (Inverter)

The NOT gate is the simplest logic gate, having only one input. It inverts that input: a 1 comes out as a 0, and a 0 comes out as a 1. In everyday terms, it computes the *opposite* of a condition — if $A$ means "the door is open," then $\bar{A}$ means "the door is closed."

| A | Y |
|---|---|
| 0 | 1 |
| 1 | 0 |

The Boolean expression is $Y = \bar{A}$, read "Y equals A bar" or "Y equals NOT A." The bar indicates logical complement.

The logic symbol is a triangle with a small circle — called a **bubble** — on its output. In digital logic, a bubble always means inversion. Remember that; it is about to explain two more gates.

## The AND Gate

The AND gate outputs 1 only when *all* of its inputs are 1. It is the gate of required conditions: a missile launch that needs both officers' keys turned, a machine that runs only when the guard is closed *and* the start button is pressed. If any condition fails, the output fails.

| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

The Boolean expression is $Y = A \cdot B$, and just as in ordinary algebra, the dot is usually omitted: $Y = AB$. The multiplication notation is no accident — with inputs of 0 and 1, AND produces exactly the same results as multiplying: zero times anything is zero, and only $1 \times 1 = 1$.

The AND symbol has a flat back and a curved front, like a letter "D" on its side.

## The OR Gate

The OR gate outputs 1 when *any* of its inputs is 1. It is the gate of sufficient conditions: a doorbell that rings from either the front or back button, a warning light that turns on if any door is ajar. The output is 0 only when every input is 0.

| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

The Boolean expression uses a plus sign: $Y = A + B$. This is Boolean OR, not arithmetic addition — when both inputs are 1, the output is 1, not 2.

The OR symbol has a curved back and comes to a point at the front.

## The NAND Gate

The NAND gate is AND followed by NOT — "NAND" contracts "NOT-AND." Its output is the exact opposite of AND's on every row: 0 only when both inputs are 1. Equivalently, a NAND outputs 1 whenever *at least one input is 0* — think of an alarm that stays quiet only while every sensor reports OK.

| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

The expression puts a bar over the whole AND: $Y = \overline{A \cdot B}$. The symbol is the AND shape with a bubble on its output — the bubble doing exactly what bubbles do.

NAND gates have a special property: they are **universal**. Any other logic gate — NOT, AND, OR, all of them — can be constructed from NAND gates alone. This matters in manufacturing, where building everything from one gate type simplifies fabrication. We will prove this universality later in the course.

## The NOR Gate

The NOR gate is to OR what NAND is to AND: OR followed by NOT. Its output is 1 only when *every* input is 0 — an "all quiet" detector.

| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

The expression is $Y = \overline{A + B}$; the symbol is the OR shape with an output bubble. Like NAND, the NOR gate is universal — an entire circuit can be built from NOR gates exclusively.

## The XOR Gate (Exclusive OR)

The XOR gate — "exclusive or" — outputs 1 when its inputs are *different* and 0 when they are the same. The classic example is a staircase light controlled by switches at the top and bottom: flipping *either* switch changes the light, because the light is on exactly when the two switches are in different positions.

| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

The expression uses the circled plus: $Y = A \oplus B$.

For more than two inputs, the rule generalizes neatly: an XOR outputs 1 when an *odd* number of its inputs are 1. This odd-parity behavior makes XOR central to error detection and to binary addition, both coming later in the course.

The XOR symbol is the OR shape with an extra curved line across its inputs.

## The XNOR Gate (Equivalence Gate)

The XNOR gate is the complement of XOR: it outputs 1 when its inputs are the *same*. That is why it is also called the **equivalence gate** — it answers the question "do these two signals match?", which is the seed of every comparison circuit.

| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

The expression is $Y = \overline{A \oplus B}$, or equivalently $Y = A \odot B$. The symbol is the XOR shape with a bubble on the output.

## One Pattern Behind the Tables

Seven truth tables sounds like a lot of memorizing. It is less than it looks, because most of these gates share a single pattern: **each has one input value that dominates it.**

- **AND**: any 0 forces the output to 0. A single failed condition kills the output — nothing else matters.
- **OR**: any 1 forces the output to 1. A single satisfied condition wins.
- **NAND**: any 0 forces the output to 1 (it is AND's answer, flipped).
- **NOR**: any 1 forces the output to 0 (OR's answer, flipped).

Notice that the bubble never changes *which* value dominates — it only flips what the output does when domination occurs. If you know AND and OR, you know NAND and NOR for free.

XOR and XNOR are the exceptions, and that exception is worth remembering: they have **no dominating value**. Change any single input of an XOR and the output *always* changes. Every input matters on every row. That sensitivity is exactly what makes XOR useful for detecting differences — and, as you will see later, it is also why XOR is the most expensive of these gates to build.

One more generalization: AND, OR, NAND, and NOR extend naturally to three or more inputs, keeping the same rules ("all 1s," "any 1," and their complements). A gate with $n$ inputs has a truth table of $2^n$ rows — the doubling you met in the quick start.

## Reading a Small Circuit

The payoff of this vocabulary comes when gates connect to each other: the output of one gate becomes an input of the next. Here is a two-gate example you have ridden along with many times.

A car's seatbelt reminder should buzz when the engine is running *and* the driver's belt is *not* fastened. Let $R = 1$ mean the engine is running and $S = 1$ mean the belt is fastened. The belt condition we care about is $\bar{S}$ — belt *not* fastened — so a NOT gate computes $\bar{S}$, and an AND gate combines it with $R$:

$$Y = R \cdot \bar{S}$$

Trace all four input combinations, building the answer one column at a time, exactly as in the quick start:

| $R$ | $S$ | $\bar{S}$ | $Y = R \cdot \bar{S}$ |
|:---:|:---:|:---:|:---:|
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | **1** |
| 1 | 1 | 0 | 0 |

The buzzer sounds in exactly one situation — engine running, belt unfastened — which is precisely what we asked for in words. Read the table against the sentence and convince yourself they say the same thing.

This tiny circuit is the entire method of digital design in miniature: describe a behavior in words, translate the words into gates, and verify with a truth table. Every circuit in this book — adders, multiplexers, memory — is this same move repeated with more gates.

## Boolean Algebra Notation Summary

| Operation | Symbol | Expression | Meaning |
|-----------|--------|------------|---------|
| NOT | Triangle + bubble | $Y = \bar{A}$ | Complement of A |
| AND | Flat back, curved front | $Y = A \cdot B$ or $Y = AB$ | All inputs true |
| OR | Curved back, pointed front | $Y = A + B$ | Any input true |
| NAND | AND + bubble | $Y = \overline{A \cdot B}$ | NOT(all true) |
| NOR | OR + bubble | $Y = \overline{A + B}$ | NOT(any true) |
| XOR | Double-arc | $Y = A \oplus B$ | Inputs differ (odd number of 1s) |
| XNOR | XOR + bubble | $Y = A \odot B$ | Inputs match |

## Key Takeaways

Logic gates are the building blocks of every digital system, and each one is a fixed rule expressible three ways: truth table, symbol, and Boolean expression. The seven basic gates are NOT, AND, OR, NAND, NOR, XOR, and XNOR. Most of them follow one pattern — AND and OR each have a dominating input value (any 0 kills an AND; any 1 wins an OR), and a bubble flips a gate's output without changing which value dominates — while XOR and XNOR are the exceptions where every input always matters. Gates gain their power through composition: connect outputs to inputs, and a sentence like "buzz when the engine runs and the belt is off" becomes $Y = R \cdot \bar{S}$, verified row by row in a truth table.

## Review Questions

### Question 1

What is the primary purpose of using logic gates as abstractions in digital design?

A. They make circuits run faster than transistors alone\
B. They allow describing digital behavior without circuit implementation details\
C. They reduce the physical size of digital circuits\
D. They eliminate the need for Boolean algebra

### Question 2

For a two-input AND gate, how many input combinations produce an output of 1?

A. One\
B. Two\
C. Three\
D. Four

### Question 3

What does a "bubble" on a logic gate symbol indicate?

A. The gate has multiple outputs\
B. The signal is being amplified\
C. The signal is being inverted (complemented)\
D. The gate requires external power

### Question 4

Which statement correctly describes the XOR gate's behavior?

A. Output is 1 when any input is 1\
B. Output is 1 when all inputs are 1\
C. Output is 1 when inputs have the same value\
D. Output is 1 when inputs have different values

### Question 5

Why are NAND and NOR gates called "universal gates"?

A. They are used in every country's electronics standards\
B. Any other logic gate can be built using only that gate type\
C. They can operate at any voltage level\
D. They work with both analog and digital signals

### Question 6

A warning light should turn on when a machine is powered ($P = 1$) but its safety guard is *not* closed ($G = 0$). Which expression describes the light?

A. $Y = P \cdot G$\
B. $Y = P + \bar{G}$\
C. $Y = P \cdot \bar{G}$\
D. $Y = \overline{P \cdot G}$

## Answer Explanations

**1. B.** Gates let us work with logical behavior — inputs, outputs, and rules — without carrying transistor-level detail. That abstraction is what makes large designs manageable; the implementation below the gate is a separate (later) topic.

**2. A.** AND requires every input to be 1, so only the single combination $A=1, B=1$ produces a 1. The other three rows output 0 — any 0 dominates an AND.

**3. C.** A bubble always means inversion. It is the difference between AND and NAND, between OR and NOR, and between XOR and XNOR.

**4. D.** XOR outputs 1 exactly when its inputs differ. "Any input is 1" is OR, "all inputs are 1" is AND, and "same value" is XNOR.

**5. B.** Universal means self-sufficient: any logic function can be built from NANDs alone (or NORs alone), which is why manufacturing favors them.

**6. C.** The light needs both conditions at once: powered ($P$) AND guard not closed ($\bar{G}$). That is $Y = P \cdot \bar{G}$ — the same NOT-feeding-AND structure as the seatbelt buzzer. Option B would light whenever the guard is open, even with the machine off; option D is a NAND, which lights in three of the four rows.
