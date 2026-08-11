## Fundamentals Quick Start

Most subjects reward a slow, careful build-up. Digital logic rewards the opposite: its foundational ideas are simple enough that the fastest way to learn them is to start using them. This quick start introduces the working vocabulary of the entire course — **logic functions (gates)**, **truth tables**, and **Boolean algebra** — with just enough depth that you can evaluate expressions and prove identities by the end of the page. Each of these ideas returns in later sections for a more systematic treatment; here, the goal is to see the core tricks once. The companion video walks through the same material.

## Why Everything Is a 0 or a 1

Digital logic is built from transistors, and a transistor in a logic circuit operates as a switch: it is either on or off. Every signal in a digital system therefore carries one of exactly **two values**, written 0 and 1. When it is natural to think of a signal as a claim that is true or false — "the button is pressed," "the temperature is too high" — we associate 1 with *true* and 0 with *false*.

This restriction to two values is not a limitation; it is the source of the discipline's power. Because a variable can only be 0 or 1, a function of $n$ variables has exactly $2^n$ possible input combinations — a finite list. That means the behavior of any logic function, no matter how complicated its formula, can be written down *exhaustively*. The table that does so is called a **truth table**, and it is the single most important bookkeeping tool in this course.

## The Three Basic Gates

A **gate** is a small circuit that computes a logic function: it accepts one or more binary inputs and produces a single binary output. Three gates are enough to get started.

The **inverter**, or **NOT gate**, has one input and does the only interesting thing a one-input function can do: it flips the bit. We write the complement of $X$ as $\bar{X}$, read "X bar."

| $X$ | $F = \bar{X}$ |
|:---:|:---:|
| 0 | 1 |
| 1 | 0 |

The **AND gate** outputs 1 only when *every* input is 1. Boolean notation borrows from multiplication: the AND of $X$ and $Y$ is written $X \cdot Y$, or $X\&Y$, or most often simply $XY$ — an implied product, exactly as ordinary algebra writes $xy$ for $x \times y$.

The **OR gate** outputs 1 when *any* input is 1; its output is 0 only when every input is 0. OR is written with a plus sign: $X + Y$. The multiplication-and-addition notation is not a coincidence — it is a deliberate parallel that lets Boolean expressions look and behave much like the algebra you already know.

| $X$ | $Y$ | $X \cdot Y$ (AND) | $X + Y$ (OR) |
|:---:|:---:|:---:|:---:|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 |

Study the two output columns for a moment. AND is *strict*: a single 0 anywhere forces the output to 0. OR is *permissive*: a single 1 anywhere forces the output to 1. That asymmetry — each gate has one input value that dominates it — is a pattern you will use constantly when analyzing larger circuits.

## Boolean Algebra and Its Order of Operations

With notation in hand, we can write compound expressions such as

$$F = \bar{A}\,(C + B\bar{C}).$$

This is deliberately styled to look like ordinary algebra: implied ANDs, a plus sign for OR, parentheses grouping a term, and overbars marking complements. Boolean algebra is *not* the same as ordinary algebra — its variables take only the values 0 and 1, and it has a complement operation that ordinary algebra lacks — but many habits carry over directly, including operator precedence. Boolean expressions are evaluated in this order:

1. **Complements** (overbars) first,
2. then **parentheses**,
3. then **AND** (like multiplication),
4. then **OR** (like addition).

## Evaluating an Expression Row by Row

Because every variable is 0 or 1, evaluating even an intimidating expression reduces to substituting bits and applying the three gate definitions. Take $F = \bar{A}(C + B\bar{C})$ and the input row $A=0$, $B=0$, $C=1$:

$$F(0,0,1) = \bar{0}\,\big(1 + 0 \cdot \bar{1}\big) = 1 \cdot (1 + 0 \cdot 0) = 1 \cdot (1 + 0) = 1 \cdot 1 = 1.$$

Complements first ($\bar{0}=1$, $\bar{1}=0$), then the AND inside the parentheses, then the OR, then the outer AND. Every step is a table lookup on the gates above. Repeating this for all $2^3 = 8$ rows fills in the complete truth table:

| $A$ | $B$ | $C$ | $\bar{C}$ | $B\bar{C}$ | $C + B\bar{C}$ | $\bar{A}$ | $F$ |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 |
| 0 | 0 | 1 | 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 0 | 1 | 1 | 0 | 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 | 0 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 | 0 | 1 | 0 | 0 |

Notice the working columns: rather than evaluating the whole expression in one leap, the table builds it up one sub-expression at a time — first $\bar{C}$, then $B\bar{C}$, then the parenthesized OR, and finally the outer AND. This column-by-column habit keeps the arithmetic honest, and it is exactly how you should build truth tables for the rest of the course.

## Truth Tables Can Prove Identities

A truth table does more than describe a function — it *defines* it completely. That gives us a powerful principle: **two Boolean expressions are equal if and only if their truth tables have identical output columns.** An exhaustive check over finitely many rows is a genuine proof, not just evidence.

Let us use this to compare two expressions that do not obviously have anything to do with each other:

$$F = \overline{A \cdot B} \qquad \text{and} \qquad G = \bar{A} + \bar{B}.$$

For $F$, compute $A \cdot B$ and complement the result. For $G$, complement each variable separately and OR them:

| $A$ | $B$ | $A \cdot B$ | $F = \overline{A \cdot B}$ | $\bar{A}$ | $\bar{B}$ | $G = \bar{A} + \bar{B}$ |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 | 0 | 1 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 0 | 0 | 0 | 0 |

The $F$ and $G$ columns match on every row, so the two expressions are equal — proven, exhaustively.

## De Morgan's Theorem

The identity just established is one form of **De Morgan's theorem**, and its companion form follows the same pattern with the roles of AND and OR exchanged:

$$\overline{A \cdot B} = \bar{A} + \bar{B} \qquad\qquad \overline{A + B} = \bar{A} \cdot \bar{B}.$$

The mnemonic is **"break the line, change the sign."** An overbar spanning an entire term breaks into separate bars over each variable, and the operator underneath it switches — AND becomes OR, OR becomes AND. In words: *the complement of an AND is the OR of the complements, and the complement of an OR is the AND of the complements.* De Morgan's theorem appears early and often in this course; it is the tool that lets you push complements through an expression instead of being stuck with them.

## Where We Go Next

From this quick start you can already do real work: write a Boolean expression, evaluate it for any input, tabulate it completely, and prove whether two expressions are equivalent. What follows deepens each skill — systematic procedures for building truth tables, the full set of Boolean algebra properties, and logic functions beyond AND, OR, and NOT.

## Key Takeaways

Digital signals take exactly two values, 0 and 1, because logic circuits are built from transistors acting as on/off switches. A logic function's complete behavior fits in a truth table of $2^n$ rows. The three basic gates are NOT ($\bar{X}$), AND ($X \cdot Y$, strict — any 0 wins), and OR ($X + Y$, permissive — any 1 wins). Boolean expressions evaluate complements first, then parentheses, then AND, then OR, mirroring ordinary algebra. Two expressions are equal exactly when their truth-table columns match, and that check proves De Morgan's theorem: $\overline{A \cdot B} = \bar{A} + \bar{B}$ and $\overline{A + B} = \bar{A} \cdot \bar{B}$ — break the line, change the sign.

## Review Questions

### Question 1

Why can a truth table capture a logic function's behavior *completely*?

A. Because logic functions are always simple  
B. Because each variable takes only two values, so a function of $n$ inputs has exactly $2^n$ input combinations to list  
C. Because truth tables round off unlikely input combinations  
D. Because transistors can store entire tables

### Question 2

For the expression $F = \bar{A}(C + B\bar{C})$, what is $F(1, 1, 0)$?

A. 0  
B. 1  
C. It depends on the order of operations chosen  
D. It cannot be evaluated without a circuit diagram

### Question 3

In Boolean algebra's order of operations, which is applied *first*?

A. OR  
B. AND  
C. Parentheses  
D. Complements (overbars)

### Question 4

Which statement correctly applies De Morgan's theorem to $\overline{X + Y}$?

A. $\bar{X} + \bar{Y}$  
B. $\bar{X} \cdot \bar{Y}$  
C. $X \cdot Y$  
D. $\overline{X \cdot Y}$

### Question 5

What establishes that two Boolean expressions are equal?

A. They use the same variables  
B. They have the same number of operations  
C. Their truth tables produce identical output columns for every input combination  
D. They both contain a complement

## Answer Explanations

**1. B.** Binary variables make the input space finite: $n$ inputs give exactly $2^n$ combinations, so listing them all describes the function exhaustively.

**2. A.** With $A=1$, the outer factor is $\bar{A} = 0$, and 0 ANDed with anything is 0 — no matter what the parenthesized term evaluates to. (This is AND's "any 0 wins" behavior.)

**3. D.** Complements are applied first, then parentheses, then AND, then OR.

**4. B.** Break the line, change the sign: the bar over $X + Y$ splits into $\bar{X}$ and $\bar{Y}$, and the OR changes to an AND.

**5. C.** A truth table defines a function completely, so matching output columns across all rows is an exhaustive proof of equality — exactly how De Morgan's theorem was proven in this section.
