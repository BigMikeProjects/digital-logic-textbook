# POS Minimization with Karnaugh Maps

Every Karnaugh map up to this point has been read as a **sum of products**: circle the `1`s, turn each group into a product term, and OR the terms together. That works because grouping on a map is fundamentally a *union* operation — you cover the `1`s and add their terms back on. This section completes the picture by showing how to get the other canonical form, a minimal **product of sums (POS)**, from the same map.

The catch is that you cannot comfortably read a POS directly off a K-map. POS is built from *intersections* of sum terms, and humans are not good at seeing that pattern in a grid of cells. So instead of reading POS directly, we use a short detour: minimize the **complement** of the function as an ordinary sum of products, then convert that result into a POS with De Morgan's theorem. The map work stays exactly as familiar as before — only the cells you circle and one algebraic step at the end are new.

## The Core Idea: Minimize $\bar{F}$, Then Complement

The whole method rests on two facts. First, the **zeros of $F$ are the ones of $\bar{F}$**. If you circle the `0` cells of a map instead of the `1` cells, the groups you form describe $\bar{F}$, and you can read a minimal *sum of products for $\bar{F}$* off them using all the usual rules. Second, **complementing a sum of products produces a product of sums**. By De Morgan's theorem, barring an OR of AND-terms flips it into an AND of OR-terms. Put together:

1. On the map, **circle the zeros** and read a minimal SOP expression for $\bar{F}$.
2. **Complement** that expression — $F = \overline{\bar{F}}$ — and push the bar inward with De Morgan's. The SOP of $\bar{F}$ becomes the minimal POS of $F$.

You never read POS off the grid. You read a minimal SOP for $\bar{F}$, which is something a K-map does naturally, and let the algebra hand you the POS.

![Two four-variable Karnaugh maps side by side. The left map is F, with its zeros drawn dark at cells 0, 1, 2, 8 and 10 and don't-cares at 3 and 6. An arrow labelled complement leads to the right map, F-bar, where those same cells now hold 1s and the don't-cares are unchanged.](./images/kmap-pos-zeros-are-ones.svg)

## Circling the Zeros

Grouping the zeros follows the **same rules** as grouping the ones — nothing about the map changes except which cells you are covering:

- Cover **every zero** with rectangular groups whose size is a power of two (1, 2, 4, 8, …). The `1` cells are left strictly uncovered — a POS group may never include a `1`.
- Make each group **as large as possible**. A larger group holds more variables constant, so it contributes **fewer literals** to the final answer.
- Groups may **overlap**, and they **wrap around the edges**: the left and right columns are neighbors, the top and bottom rows are neighbors, and so the four corners of a four-variable map are all mutually adjacent and can form a single group of four.
- Start with the **essential prime implicants** — the groups that are the only way to cover a particular zero — then add groups as needed until all zeros are covered.

**Don't-care** cells behave just as they do in SOP work: include a don't-care in a group only when it lets you make the group *bigger*; otherwise ignore it. A don't-care never has to be covered, so it is purely a convenience for enlarging groups and shedding literals. It is worth being deliberate about this rather than habitual — a don't-care you reach for out of reflex can add a literal you did not need, and one you overlook can cost you a larger group.

## A Worked Example

Take a four-variable function $F(A, B, C, D) = \Pi M(0, 1, 2, 8, 10)$ with don't-cares at cells 3 and 6 — that is, zeros sit at minterm positions 0, 1, 2, 8, and 10. Circling those zeros gives two natural groups.

![A four-variable Karnaugh map of F equal to Pi M of 0, 1, 2, 8 and 10 with don't-cares at 3 and 6. An amber group of four covers the whole top row, m0, m1, m3 and m2, and is labelled A-bar B-bar. A violet group covers the four corner cells m0, m2, m8 and m10, with dashed ties running outside the map across the left-right and top-bottom edges to show they are adjacent by wrap-around; it is labelled B-bar D-bar.](./images/kmap-pos-groups.svg)

The **top row** (where $A = 0$, $B = 0$) holds the zeros at 0, 1, 2, and by pulling in the **don't-care at cell 3** it rounds out to a full group of four with $A$ and $B$ constant and $C$, $D$ varying — the product term $\bar{A}\bar{B}$. The remaining zeros at 8 and 10, together with 0 and 2, are the **four corners**, which by edge-wrapping form a single group of four with $B = 0$ and $D = 0$ constant (and $A$, $C$ varying) — the term $\bar{B}\bar{D}$.

Both groups are essential, and it is worth seeing why the corners are forced. The cells beside the zeros at 8 and 10 — that is, 9 and 11 — are `1`s, so no group can be drawn along the bottom row. Wrapping around to 0 and 2 is the *only* way to cover 8 and 10 at all. The two groups share cell 0, which is fine, and the don't-care at 6 is left out: pairing it with the zero at 2 would not have enlarged either group, so it earns nothing.

Reading those two groups as a sum of products gives the minimal expression for the complement:

$$\bar{F} = \bar{A}\bar{B} + \bar{B}\bar{D}$$

## Converting with De Morgan's Theorem

Now recover $F$ by complementing, and apply De Morgan's theorem in two passes. The mnemonic is the same one that applies anywhere a bar spans more than one variable: **"break the line, change the sign."** First the **outer** complement — break the bar that spans the whole sum, and the OR joining the terms becomes an AND:

$$F = \overline{\bar{A}\bar{B} + \bar{B}\bar{D}} = \overline{(\bar{A}\bar{B})} \cdot \overline{(\bar{B}\bar{D})}$$

Then the **inner** complement on each term: break each remaining bar, the AND inside becomes an OR, and a double bar cancels ($\overline{\bar{A}} = A$):

$$\overline{\bar{A}\bar{B}} = A + B, \qquad \overline{\bar{B}\bar{D}} = B + D$$

Putting the two sum terms together gives the final minimal product of sums:

$$F = (A + B)(B + D)$$

![Four stacked rows showing the conversion. First, F-bar equals A-bar B-bar plus B-bar D-bar, read from the map. Second, F is the complement of that whole sum. Third, the bar over the sum breaks so the OR becomes an AND, giving the complement of A-bar B-bar times the complement of B-bar D-bar. Fourth, each remaining bar breaks so the ANDs become ORs and the double bars cancel, giving F equals A plus B, times B plus D.](./images/kmap-pos-demorgan.svg)

Notice the structure of the conversion: each *product term* of $\bar{F}$ turned into a *sum term* of $F$, every literal flipped, and the OR joining them became the AND that multiplies the sums. That is De Morgan's theorem doing exactly what it always does — it is just being applied to a whole expression at once.

## In Verilog

As always, you would normally describe the behavior and let the synthesizer minimize. Both canonical forms describe the same function, so either can be written directly:

```verilog
// Minimal POS for the worked example: F = (A + B)(B + D)
assign F = (A | B) & (B | D);

// The complement read straight off the zeros was SOP: F' = A'·B' + B'·D'
// so F is also the inversion of that:
assign F_alt = ~((~A & ~B) | (~B & ~D));   // logically identical to F
```

## Key Takeaways

A Karnaugh map reads out sum-of-products naturally because grouping is a union of `1`s, but a minimal **product of sums** is obtained indirectly. The method is to **circle the zeros** — which are the ones of $\bar{F}$ — using all the ordinary grouping rules (rectangular power-of-two groups, made as large as possible, overlapping and edge-wrapping allowed, don't-cares used only when they enlarge a group). That yields a minimal SOP for $\bar{F}$. Complementing with **De Morgan's theorem** then converts that SOP into the minimal POS for $F$: "break the line, change the sign," so each product term becomes a sum term, every literal is complemented, and the joining OR becomes an AND. In the worked example, circling the zeros gave $\bar{F} = \bar{A}\bar{B} + \bar{B}\bar{D}$, and complementing produced $F = (A + B)(B + D)$. The map technique you already know does all the heavy lifting; only the choice of cells to circle and one De Morgan step at the end distinguish POS minimization from SOP minimization. The interactive for this topic walks through that exact map step by step — circling the zero groups, then applying De Morgan's theorem line by line until the minimal POS appears.

## Review Questions

**1. When using a Karnaugh map to find a minimal product of sums, which cells do you group?**
A. The `1` cells, as in SOP minimization\
B. The `0` cells\
C. Only the don't-care cells\
D. Every cell on the map

**2. Why does circling the zeros of $F$ give a minimal expression for $\bar{F}$?**
A. Because zeros are always grouped in pairs\
B. Because the zeros of $F$ are exactly the ones of $\bar{F}$\
C. Because $\bar{F}$ has no don't-cares\
D. Because a product of sums has no minterms

**3. After reading a minimal SOP for $\bar{F}$ off the map, what converts it into a minimal POS for $F$?**
A. Adding an extra inverter to each input\
B. Re-circling the ones\
C. Complementing the result and applying De Morgan's theorem\
D. Increasing the size of every group

**4. A group of zeros holds $B = 0$ and $D = 0$ constant while $A$ and $C$ vary. What product term does it contribute to $\bar{F}$?**
A. $B\,D$\
B. $\bar{B}\bar{D}$\
C. $B + D$\
D. $\bar{A}\bar{C}$

**5. Applying De Morgan's theorem to the term $\bar{A}\bar{B}$ from $\bar{F}$ produces which sum term in $F$?**
A. $\bar{A} + \bar{B}$\
B. $A\,B$\
C. $A + B$\
D. $\bar{A}\,\bar{B}$

**6. How are don't-care cells used when circling zeros for a POS minimization?**
A. They must all be covered, like the zeros\
B. They are included only when they make a group larger, and ignored otherwise\
C. They are always left out of every group\
D. They are grouped separately from the zeros

**7. In the worked example, why must the zeros at cells 8 and 10 be covered by the four-corners group?**
A. Because corner cells may only ever be grouped with other corners\
B. Because cells 9 and 11 hold `1`s, so no group can be formed along the bottom row\
C. Because a group of four is required in every POS minimization\
D. Because they are don't-cares

## Answer Explanations

**1. B.** A minimal POS is found by grouping the `0` cells. The `1` cells are left uncovered; grouping them would instead give the SOP form.

**2. B.** Wherever $F$ is `0`, $\bar{F}$ is `1`. Circling the zeros of $F$ is therefore identical to circling the ones of $\bar{F}$, so the groups describe a minimal sum of products for $\bar{F}$.

**3. C.** Once you have a minimal SOP for $\bar{F}$, taking $F = \overline{\bar{F}}$ and pushing the bar inward with De Morgan's theorem turns the sum-of-products into a product-of-sums — the minimal POS for $F$.

**4. B.** A group's term keeps the variables that stay constant. With $B = 0$ and $D = 0$ throughout, both appear complemented, giving $\bar{B}\bar{D}$; $A$ and $C$ vary and drop out.

**5. C.** By De Morgan's, the complement of a product is the sum of the complemented literals: $\overline{\bar{A}\bar{B}} = \overline{\bar{A}} + \overline{\bar{B}} = A + B$, since a double complement cancels.

**6. B.** Don't-cares are optional cells. You pull one into a group only if it enlarges the group (fewer literals in the answer); if it does not help, you leave it out, because a don't-care never needs to be covered. In the worked example the don't-care at cell 3 enlarges the top-row group to four, while the one at cell 6 does nothing and is ignored.

**7. B.** Cells 9 and 11 are `1`s and can never be included in a group of zeros, so the zeros at 8 and 10 have no neighbor along the bottom row. Their only adjacency is the wrap-around to cells 0 and 2, which makes the four-corners group the sole way to cover them — an essential prime implicant.
