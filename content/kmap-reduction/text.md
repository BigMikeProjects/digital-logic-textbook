# Relating K-Map Grouping to Algebraic Reduction

We already know two things separately: that **Boolean algebra** can simplify a logic expression by applying properties and identities, and that a **Karnaugh map** lets us simplify by drawing rectangular groups of `1`s. This section connects them. The claim is that grouping cells on a K-map is not a different method at all — it is *exactly* the algebra of factoring and the complement law, done visually. Seeing the link is what makes the grouping rules feel inevitable rather than arbitrary.

## Why We Reduce

The motivation is the same as for algebraic simplification: reducing the number of terms, and the number of variables within each term, lets you implement an equivalent function with a **smaller, more efficient circuit**. A product term with three literals needs a three-input AND gate; eliminate a literal and it becomes a two-input gate; eliminate enough and the gate disappears entirely. Fewer, smaller gates is the payoff.

## Logical Adjacency Is Physical Adjacency

The heart of the connection is **adjacency**. In Boolean algebra, two product terms can be combined precisely when they differ in exactly one variable — one term has that variable true, the other has it complemented, and everything else matches. Call that *logical adjacency*.

A Karnaugh map is laid out so that logical adjacency shows up as **physical adjacency**: two terms that differ in a single variable sit in neighboring cells. That is the entire reason the axes are labeled in **Gray code** — moving from one cell to an adjacent one changes only one variable. So when you spot two `1`s sitting next to each other and circle them, you are identifying two terms that algebra can collapse.

## Watching the Algebra Behind a Group

Consider a three-variable function of $X$, $Y$, $Z$ given as a sum of four product terms — one `1` in each of four cells of the eight-cell map:

$$F = \bar{X}\,\bar{Y}\,Z + \bar{X}\,Y\,Z + X\,\bar{Y}\,Z + X\,Y\,Z$$

**Step 1 — combine adjacent pairs.** The first two terms are neighbors: they share $\bar{X}Z$ and differ only in $Y$. Factor the common part out, and the complement law finishes the job:

$$\bar{X}\,\bar{Y}\,Z + \bar{X}\,Y\,Z = \bar{X}Z\,(\bar{Y} + Y) = \bar{X}Z \cdot 1 = \bar{X}Z$$

The same thing happens with the other pair, which share $XZ$:

$$X\,\bar{Y}\,Z + X\,Y\,Z = XZ\,(\bar{Y} + Y) = XZ$$

Each circled **group of two** has eliminated one variable ($Y$), exactly because the two cells differ only in $Y$.

![A three-variable Karnaugh map of the function that is 1 wherever Z is 1, with two groups of two circled: a cyan pair covering m1 and m3 in the X equals 0 row, and an amber pair covering m5 and m7 in the X equals 1 row. Beside each pair the algebra is worked out, factoring the shared literals and cancelling Y-bar plus Y to 1, leaving X-bar Z and X Z. Below, the identity Y-bar plus Y equals 1.](./images/kmap-adjacent-pairs.svg)

After this step:

$$F = \bar{X}Z + XZ$$

**Step 2 — combine the pairs.** Those two groups of two are themselves adjacent, so the move repeats. Now $Z$ is the shared factor and $X$ is the variable that varies:

$$\bar{X}Z + XZ = Z\,(\bar{X} + X) = Z \cdot 1 = Z$$

The two groups of two have merged into one **group of four**, eliminating a second variable ($X$). The final result is simply:

$$F = Z$$

![Two three-variable Karnaugh maps side by side. On the left the same function carries a cyan pair and an amber pair, labelled X-bar Z plus X Z with three literals. An arrow leads right, annotated with the algebra X-bar Z plus X Z equals Z times X-bar plus X, which equals Z. On the right a single violet group of four covers all four 1s and is labelled Z with one literal. Below, F equals Z.](./images/kmap-pairs-merge.svg)

The general pattern: a group of two eliminates one variable, a group of four eliminates two, a group of eight eliminates three — each doubling of the group size is just one more round of "factor out the common literals; a variable ORed with its complement becomes `1` and drops away." Put arithmetically, a group of $2^k$ cells on an $n$-variable map holds $n - k$ variables constant, so its product term carries $n - k$ literals.

![Three four-variable Karnaugh maps side by side, each showing the same function whose 1s fill the cells where D equals 1. The first has a cyan group of two labelled three literals, the second an amber group of four labelled two literals, and the third a violet group of eight labelled one literal, the term D. Below, the rule that a group of 2-to-the-k cells yields a term of n minus k literals.](./images/kmap-size-ladder.svg)

## Reading It Back Off the Map

In hindsight the answer is obvious on the map: the four `1`s are exactly the cells where $Z = 1$ — the **$Z$ region**. A single rectangle covering all four of them *is* the term $Z$. The map let us see the largest combinable group directly, instead of hunting through the algebra for which terms share factors. That is the whole value of the tool: K-maps are **motivated by Boolean algebra**, and grouping is a visual shortcut for the factor-and-cancel reduction.

The circuit payoff is dramatic. The unsimplified expression needs four three-input AND gates feeding a four-input OR gate; the simplified one needs no gates at all:

```verilog
// Before: F = X'Y'Z + X'YZ + XY'Z + XYZ
assign F = (~X & ~Y & Z) | (~X & Y & Z) | (X & ~Y & Z) | (X & Y & Z);

// After K-map grouping (equivalent):
assign F = Z;
```

## Key Takeaways

Karnaugh-map grouping and Boolean-algebra simplification are the same operation in two forms. Two product terms can be combined when they differ in exactly one variable (logical adjacency), and the Gray-coded map draws that as neighboring cells (physical adjacency). Circling a group of `1`s factors out the literals the cells share and cancels the one that varies, because $V + \bar{V} = 1$ — so a group of two removes one variable, a group of four removes two, and in general a group of $2^k$ cells leaves a term of $n - k$ literals. Worked through, $\bar{X}\bar{Y}Z + \bar{X}YZ + X\bar{Y}Z + XYZ$ collapses pair-by-pair to $\bar{X}Z + XZ$ and then to $Z$, which on the map is just the $Z$ region. The map doesn't replace the algebra; it lets you *see* which terms are combinable, which is why K-maps are said to be motivated by Boolean algebra.

## Review Questions

**1. Two product terms can be combined by Boolean algebra when they differ in how many variables?**
A. Exactly one\
B. Exactly two\
C. None — they must be identical\
D. Any number

**2. Why are the axes of a Karnaugh map labeled in Gray code?**
A. To make the map look symmetric\
B. So that adjacent cells differ in exactly one variable, matching logical adjacency\
C. To match the order of the minterm numbers\
D. It is an arbitrary convention with no effect

**3. When you factor a common part out of two adjacent terms, which identity finishes the simplification?**
A. $V \cdot \bar{V} = 0$\
B. $V \cdot V = V$\
C. $V + \bar{V} = 1$\
D. $V + V = V$

**4. Combining two adjacent `1`s into a group of two eliminates how many variables from the term?**
A. Zero\
B. One\
C. Two\
D. Three

**5. The four `1`s of $F = \bar{X}\bar{Y}Z + \bar{X}YZ + X\bar{Y}Z + XYZ$ form a single group of four. What does the function simplify to?**
A. $Z$\
B. $X Z$\
C. $\bar{X} Z$\
D. $X + Y + Z$

**6. On a four-variable map, how many literals does the product term from a group of eight cells contain?**
A. Zero\
B. One\
C. Two\
D. Three

**7. What is the main point this topic makes about Karnaugh maps?**
A. They replace Boolean algebra with a faster but unrelated technique\
B. They only work for functions of three variables\
C. Grouping cells is a visual form of the same factoring-and-canceling that Boolean algebra performs\
D. They give different answers than algebraic simplification

## Answer Explanations

**1. A.** Combining two product terms relies on the form $V + \bar{V} = 1$, which only appears when the two terms are identical except for a single variable that is true in one and complemented in the other. Differing in more than one variable leaves no clean common factor.

**2. B.** Gray code changes one bit between successive codes, so adjacent cells differ in exactly one variable. That makes physical neighbors on the map the same as logically combinable terms in the algebra.

**3. C.** After factoring out the shared literals, the leftover is a variable ORed with its complement, $V + \bar{V}$, which equals `1` and disappears — collapsing two terms into one.

**4. B.** A group of two combines two cells that differ in a single variable; that one variable cancels, so the resulting term has one fewer literal. (A group of four eliminates two variables, a group of eight eliminates three.)

**5. A.** The four terms are exactly the combinations where $Z = 1$. Pairwise they reduce to $\bar{X}Z$ and $XZ$, and those combine to $Z(\bar{X}+X) = Z$. On the map this is the $Z$ region.

**6. B.** A group of $2^k$ cells on an $n$-variable map leaves $n - k$ literals. Here $n = 4$ and a group of eight is $2^3$, so $k = 3$ and the term has $4 - 3 = 1$ literal.

**7. C.** The topic's whole point is that K-map grouping and algebraic reduction are the same operation: each group corresponds to factoring out common literals and canceling a variable with its complement. The map just makes the combinable terms visible.
