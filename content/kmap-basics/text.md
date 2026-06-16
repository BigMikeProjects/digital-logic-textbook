# Karnaugh Map Basics

The introduction to Karnaugh maps made the case for *why* the tool exists: it turns the algebra of Boolean simplification into something you can see, because the map is laid out so that visual adjacency matches logical adjacency. This section covers the mechanics — how to construct a Karnaugh map, how to fill it from a truth table, and how to read a simplified sum-of-products expression off of it by grouping. The vocabulary of minterms carries straight over: every cell of a map is one minterm.

## What a Karnaugh Map Is

A Karnaugh map (K-map) is a grid that holds exactly the same information as a truth table, but arranged spatially. A function of $n$ variables has $2^n$ input combinations, so its map has **$2^n$ cells** — one per minterm. A two-variable function gets a $2 \times 2$ map (4 cells), three variables get a $2 \times 4$ map (8 cells), and four variables get a $4 \times 4$ map (16 cells).

The input variables are split between the rows and the columns. With three variables $A$, $B$, $C$ (taking $A$ as the most-significant bit, as usual), $A$ labels the two rows and $B\,C$ label the four columns. Each cell sits at the intersection of a row code and a column code, and the minterm number of a cell is just the binary value formed by reading its row and column bits together.

## Gray Code: Why the Axes Are Ordered 00, 01, 11, 10

The single most important detail of a K-map is the ordering of the row and column labels. They are **not** in plain binary counting order (00, 01, 10, 11). Instead they follow **Gray code** — 00, 01, 11, 10 — in which *exactly one bit changes* between any two neighbors.

This ordering is what makes the map work. Because adjacent labels differ in a single bit, two cells that touch edge-to-edge differ in exactly one variable. That is precisely the condition under which the Boolean identity $X\,\bar{Y} + X\,Y = X$ lets you merge two terms into one. So in a K-map, *physically adjacent cells are logically combinable* — adjacency on the page is a visual proxy for the algebra. The edges also **wrap around**: the leftmost and rightmost columns are neighbors, and on a four-variable map the top and bottom rows are neighbors too, so the map behaves like the surface of a torus.

## Filling the Map and Forming Groups

To use a map, you transfer the function onto it: write a `1` in every cell whose minterm makes the output `1`, and a `0` (or leave it blank) everywhere else. You can do this directly from a truth table or from a $\Sigma m$ minterm list.

Simplification is then a matter of **grouping** the `1`s. The rules are:

- Groups must be rectangular and contain a number of cells that is a **power of two** — 1, 2, 4, 8, or 16.
- Groups should be made **as large as possible**, because a larger group eliminates more variables and yields a simpler term.
- Groups may **overlap**, and they may **wrap** across the map's edges.
- Every `1` must be covered by at least one group.

Each group corresponds to a single product term. To read the term, find which variables stay **constant** across all the cells in the group; the variables that change drop out. A variable that is constantly `1` appears uncomplemented, and one that is constantly `0` appears complemented. The simplified function is the **sum (OR) of the product terms** from all the groups. A group of the largest possible size that can't be enlarged further is called a **prime implicant** — the building block of a minimal expression.

## A Worked Example

Suppose a three-variable function is `1` for minterms 0, 1, 4, 5, and 7:

$$F = \sum m(0, 1, 4, 5, 7)$$

| # | $A$ | $B$ | $C$ | $F$ |
|---|-----|-----|-----|-----|
| 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 2 | 0 | 1 | 0 | 0 |
| 3 | 0 | 1 | 1 | 0 |
| 4 | 1 | 0 | 0 | 1 |
| 5 | 1 | 0 | 1 | 1 |
| 6 | 1 | 1 | 0 | 0 |
| 7 | 1 | 1 | 1 | 1 |

On the map ($A$ on the rows, $B\,C$ on the columns in Gray order), the `1`s form two natural groups:

- **A group of four** covering minterms 0, 1, 4, 5. Across these cells $B$ is always `0` while $A$ and $C$ both vary, so this group reduces to the single literal $\bar{B}$.
- **A group of two** covering minterms 5 and 7. Here $A = 1$ and $C = 1$ throughout while $B$ varies, giving the term $A\,C$. (Minterm 5 is shared with the first group — overlap is allowed and often helpful.)

ORing the two terms gives the minimized result:

$$F = \bar{B} + A\,C$$

Grouping has collapsed what would have been five separate product terms in the canonical form down to two. A smaller expression means fewer gates and a smaller circuit. In practice you would typically describe the behavior directly and let a synthesis tool minimize it, but the minimized form maps cleanly onto hardware:

```verilog
// F = Σm(0,1,4,5,7)  →  F = B' + A·C
assign F = ~B | (A & C);
```

## Key Takeaways

A Karnaugh map is a truth table re-drawn as a $2^n$-cell grid, with one cell per minterm and the row and column labels written in Gray code so that adjacent cells differ in exactly one variable. That adjacency is the whole point: neighbors can be combined algebraically, the edges wrap, and simplification becomes the visual task of covering the `1`s with as few and as large rectangular groups as possible (sizes that are powers of two). Each group yields one product term built from the variables that stay constant across it, and the OR of those terms is a minimized sum-of-products expression. The largest non-extendable groups are the prime implicants. The interactive map for this topic lets you build product-term expressions on two-, three-, and four-variable maps and watch the groups and the $\Sigma m$ list update as you go.

## Review Questions

**1. How many cells does the Karnaugh map of a four-variable function have?**
A. 4
B. 8
C. 16
D. 32

**2. Why are the row and column labels of a K-map written in Gray code (00, 01, 11, 10)?**
A. To save space on the page
B. So that adjacent cells differ in exactly one variable, making them combinable
C. Because binary counting order is mathematically invalid
D. To match the order of the minterm numbers

**3. Which of the following is a legal Karnaugh map group?**
A. A group of 3 adjacent cells
B. A diagonal pair of cells
C. A rectangular group of 4 cells
D. A group of 6 cells

**4. When you read a product term from a group, which variables appear in it?**
A. The variables that change across the group
B. All of the function's variables
C. Only complemented variables
D. The variables that stay constant across the group

**5. A group of four `1`s on a three-variable map covers minterms 0, 1, 4, 5, in which $B$ is always 0 while $A$ and $C$ vary. What product term does it represent?**
A. $\bar{B}$
B. $A\,C$
C. $\bar{A}\,\bar{B}$
D. $B$

**6. What does making K-map groups as large as possible accomplish?**
A. It increases the number of literals in each term
B. It guarantees every `1` is covered exactly once
C. It eliminates more variables, producing simpler terms and a smaller circuit
D. It is required only for four-variable maps

## Answer Explanations

**1. C.** A function of $n$ variables has $2^n$ input combinations, so a four-variable map has $2^4 = 16$ cells, one per minterm.

**2. B.** Gray code changes one bit at a time, so physically adjacent cells differ in a single variable. That is exactly the condition that lets $X\bar{Y} + XY = X$ merge the cells, which is what makes visual grouping equivalent to algebraic simplification.

**3. C.** Legal groups are rectangular and contain a power-of-two number of cells (1, 2, 4, 8, 16). A group of 3 or 6 is not a power of two, and diagonal cells are not adjacent, so only the rectangular group of 4 qualifies.

**4. D.** A group's product term keeps only the variables that hold the same value across every cell in the group; the variables that change cancel out. A constant `1` appears uncomplemented and a constant `0` complemented.

**5. A.** Across minterms 0, 1, 4, 5 the only variable that never changes is $B$, which is always `0`. A constantly-`0` variable appears complemented, so the term is $\bar{B}$; $A$ and $C$ vary and drop out.

**6. C.** A larger group holds more variables constant—relative to its size—so more variables cancel, leaving a term with fewer literals. Fewer literals means fewer gate inputs and a smaller circuit. Coverage (option B) is a separate requirement, and the size rule applies to maps of every size.
