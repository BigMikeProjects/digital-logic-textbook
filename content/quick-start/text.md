## Fundamentals Quick Start

This quick start jumps straight into the working vocabulary of digital logic so you can begin
*doing* things right away: **logic functions (gates)**, **truth tables**, and **Boolean algebra**.
The companion video walks through everything below — the notes here are a short orientation you can
read alongside it. We will develop each idea more carefully in later sections; the goal for now is
just to see the core tricks once.

### Gates and binary values

Digital logic is built on transistors, which switch between on and off. That gives every signal just
two possible values, **0 and 1**. From those two values we build **gates** — small logic functions
with one or more inputs and a single output. This quick start uses three:

- **NOT (inverter)** — one input; it flips the bit: $\bar{0} = 1$ and $\bar{1} = 0$.
- **AND** — output is 1 only when *all* inputs are 1. Written $X \cdot Y$, $X\&Y$, or simply $XY$ (an
  implied product, just like multiplication in ordinary algebra).
- **OR** — output is 1 when *any* input is 1; the only 0 case is when every input is 0. Written
  $X + Y$.

### Truth tables

Because the inputs are binary, we can capture a function's behavior *completely* by listing every
combination of inputs and the resulting output — a **truth table**.

| $X$ | $Y$ | $X \cdot Y$ (AND) | $X + Y$ (OR) |
|:---:|:---:|:-----------------:|:------------:|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 |

To evaluate a larger expression such as $F = \bar{A}(C + B\bar{C})$, pick a row, substitute the 0/1
values, and simplify. Boolean algebra follows an order of operations much like ordinary algebra —
**complements (NOT) first, then parentheses, then AND, then OR** — with AND behaving like
multiplication and OR like addition. The one new operation is the complement (the overbar), which
ordinary algebra does not have.

### Proving identities with truth tables

If two expressions produce the same output column for every input combination, they are equal. For
example, the truth tables of $\overline{A \cdot B}$ and $\bar{A} + \bar{B}$ match exactly, which
proves the identity

$$\overline{A \cdot B} = \bar{A} + \bar{B}.$$

This is **De Morgan's theorem**. Its companion form is

$$\overline{A + B} = \bar{A} \cdot \bar{B}.$$

A handy way to remember both: **"break the line, change the sign"** — split an overbar that spans
several variables into separate bars, and switch the operator (AND ↔ OR). We will lean on De Morgan's
theorem early and often.

### Where we go next

From here we develop more systematic ways to build truth tables, look more closely at the properties
of Boolean algebra, and extend logic functions beyond just AND, OR, and NOT.
