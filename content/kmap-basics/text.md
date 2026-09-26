# Karnaugh Map Basics

The introduction to Karnaugh maps made the case for *why* the tool exists: it turns Boolean simplification into something you can see, because the map is laid out so that visual adjacency matches logical adjacency. This section covers the mechanics — how to construct a Karnaugh map, how to fill it from a truth table, and how to read a simplified sum-of-products expression off of it by grouping. The vocabulary of minterms carries straight over: every cell of a map is one minterm.

## What a Karnaugh Map Is

A Karnaugh map (K-map) holds exactly the same information as a truth table, arranged spatially instead of as a list. A function of $n$ variables has $2^n$ input combinations, so its map has **$2^n$ cells** — one per minterm. A two-variable function gets a $2 \times 2$ map, three variables get a $2 \times 4$ map, and four variables get a $4 \times 4$ map.

The input variables split between the rows and the columns. With three variables $A$, $B$, $C$ (taking $A$ as the most-significant bit, as usual), $A$ labels the two rows and $B\,C$ label the four columns. Each cell sits at the intersection of a row code and a column code, and the minterm number of a cell is just the binary value formed by reading its row bits and column bits together.

![Three Karnaugh maps side by side: a two-variable 2-by-2 map with A on the row and B on the column, a three-variable 2-by-4 map with A on the rows and B C on the columns, and a four-variable 4-by-4 map with A B on the rows and C D on the columns. Every cell is labelled with its minterm index.](./images/kmap-sizes.svg)

## Why the Axes Are in Gray Code

The single most important detail of a K-map is the ordering of the row and column labels. They are **not** in plain binary counting order (00, 01, 10, 11). They follow **Gray code** — 00, 01, 11, 10 — in which *exactly one bit changes* between any two neighbors.

That ordering is what makes the map work. Because adjacent labels differ in a single bit, two cells that touch edge-to-edge differ in exactly one variable, and that is precisely the condition under which the Boolean identity $X\,\bar{Y} + X\,Y = X$ lets you merge two terms into one. So in a K-map, *physically adjacent cells are logically combinable* — adjacency on the page is a visual proxy for the algebra. The edges also **wrap around**: the leftmost and rightmost columns are neighbors, and on a four-variable map the top and bottom rows are neighbors too, so the map behaves like the surface of a torus.

![Two label strips compared. In binary counting order 00, 01, 10, 11 the step from 01 to 10 changes two bits and so does the wrap from 11 back to 00, both marked in red. In Gray-code order 00, 01, 11, 10 every step and the wrap change exactly one bit, all marked in green. Below, the identity X Y-bar plus X Y equals X.](./images/kmap-gray-order.svg)

## Filling the Map and Forming Groups

To use a map, transfer the function onto it: write a `1` in every cell whose minterm makes the output `1`, and a `0` (or nothing at all) everywhere else. You can work either from a truth table or from a $\Sigma m$ minterm list.

Simplification is then a matter of **grouping** the `1`s. A group must be rectangular and must hold a number of cells that is a **power of two** — 1, 2, 4, 8, or 16 — and it should be made as large as the `1`s allow, because a larger group eliminates more variables and yields a simpler term. Beyond that the rules are permissive: groups may overlap, and they may wrap across the map's edges. The one requirement on the set of groups as a whole is that every `1` ends up covered by at least one of them.

![Six small three-variable maps. Four legal groups are outlined in amber and ticked: a rectangle of four cells, a pair, two overlapping groups, and a pair that wraps across the left and right edges. Two illegal shapes are outlined in dashed red and crossed: an L-shaped group of three cells and a diagonal pair.](./images/kmap-group-rules.svg)

Each group corresponds to a single product term. To read the term, find which variables stay **constant** across all the cells in the group; the variables that change drop out. A variable that is constantly `1` appears uncomplemented, and one that is constantly `0` appears complemented. The simplified function is the **sum (OR) of the product terms** from all the groups. A group that cannot be made any larger is called a **prime implicant**, and the next topic builds a full minimization procedure on that idea.

## A Worked Example

Suppose a three-variable function is `1` for minterms 0, 1, 4, 5, and 7:

$$F = \sum m(0, 1, 4, 5, 7)$$

Each row of that function's truth table becomes one cell of the map. Row 5, for instance, is $A\,B\,C = 101$, so its `1` goes in the $A = 1$ row under the $B\,C = 01$ column.

![A three-variable truth table for F equal to sum m(0, 1, 4, 5, 7) on the left, with the five rows whose output is 1 tinted and row 5 outlined, and an arrow to the same function drawn on a three-variable Karnaugh map on the right with cell m5 outlined to match.](./images/kmap-table-to-map.svg)

With the map filled in, the `1`s fall into two natural groups.

![The three-variable map of F equal to sum m(0, 1, 4, 5, 7) with two groups drawn: an amber group of four covering m0, m1, m4 and m5, which reads as B-bar, and a violet group of two covering m5 and m7, which reads as A C. The result is F equals B-bar plus A C.](./images/kmap-worked-groups.svg)

The group of four covers minterms 0, 1, 4, and 5. Across those cells $B$ is always `0` while $A$ and $C$ both vary, so the group reduces to the single literal $\bar{B}$. The group of two covers minterms 5 and 7, where $A = 1$ and $C = 1$ throughout while $B$ varies, giving the term $A\,C$. Minterm 5 belongs to both groups — overlap is allowed, and here it is what makes the pair available at all.

ORing the two terms gives the minimized result:

$$F = \bar{B} + A\,C$$

Grouping has collapsed what would have been five separate product terms in the canonical form down to two. A smaller expression means fewer gates and a smaller circuit. In practice you would typically describe the behavior directly and let a synthesis tool minimize it, but the minimized form maps cleanly onto hardware:

```verilog
// F = Σm(0,1,4,5,7)  →  F = B' + A·C
assign F = ~B | (A & C);
```

## Key Takeaways

A Karnaugh map is a truth table re-drawn as a $2^n$-cell grid, with one cell per minterm and the row and column labels written in Gray code so that adjacent cells differ in exactly one variable. That adjacency is the whole point: neighbors can be combined algebraically, the edges wrap, and simplification becomes the visual task of covering the `1`s with as few and as large rectangular groups as possible, at sizes that are powers of two. Each group yields one product term built from the variables that stay constant across it, and the OR of those terms is a minimized sum-of-products expression. A group that cannot be made any larger is a prime implicant. The interactive map for this topic lets you build product-term expressions on two-, three-, and four-variable maps and watch the groups and the $\Sigma m$ list update as you go.

## Review Questions

**1. How many cells does the Karnaugh map of a four-variable function have?**

A. 4\
B. 8\
C. 16\
D. 32

**2. Why are the row and column labels of a K-map written in Gray code (00, 01, 11, 10)?**

A. To save space on the page\
B. So that adjacent cells differ in exactly one variable, making them combinable\
C. Because binary counting order is mathematically invalid\
D. To match the order of the minterm numbers

**3. Which of the following is a legal Karnaugh map group?**

A. A group of 3 adjacent cells\
B. A diagonal pair of cells\
C. A rectangular group of 4 cells\
D. A group of 6 cells

**4. When you read a product term from a group, which variables appear in it?**

A. The variables that change across the group\
B. All of the function's variables\
C. Only complemented variables\
D. The variables that stay constant across the group

**5. A group of four `1`s on a three-variable map covers minterms 0, 1, 4, 5, in which $B$ is always 0 while $A$ and $C$ vary. What product term does it represent?**

A. $\bar{B}$\
B. $A\,C$\
C. $\bar{A}\,\bar{B}$\
D. $B$

**6. What does making K-map groups as large as possible accomplish?**

A. It increases the number of literals in each term\
B. It guarantees every `1` is covered exactly once\
C. It eliminates more variables, producing simpler terms and a smaller circuit\
D. It is required only for four-variable maps

## Answer Explanations

**1. C.** A function of $n$ variables has $2^n$ input combinations, so a four-variable map has $2^4 = 16$ cells, one per minterm.

**2. B.** Gray code changes one bit at a time, so physically adjacent cells differ in a single variable. That is exactly the condition that lets $X\bar{Y} + XY = X$ merge the cells, which is what makes visual grouping equivalent to algebraic simplification.

**3. C.** Legal groups are rectangular and contain a power-of-two number of cells (1, 2, 4, 8, 16). A group of 3 or 6 is not a power of two, and diagonal cells are not adjacent, so only the rectangular group of 4 qualifies.

**4. D.** A group's product term keeps only the variables that hold the same value across every cell in the group; the variables that change cancel out. A constant `1` appears uncomplemented and a constant `0` complemented.

**5. A.** Across minterms 0, 1, 4, 5 the only variable that never changes is $B$, which is always `0`. A constantly-`0` variable appears complemented, so the term is $\bar{B}$; $A$ and $C$ vary and drop out.

**6. C.** A larger group holds more variables constant relative to its size, so more variables cancel, leaving a term with fewer literals. Fewer literals means fewer gate inputs and a smaller circuit. Coverage (option B) is a separate requirement, and the size rule applies to maps of every size.
