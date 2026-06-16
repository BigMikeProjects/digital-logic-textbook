# Minterms and Maxterms

A truth table completely specifies a Boolean function: it lists, for every combination of inputs, exactly what the output should be. A useful consequence is that the process runs both ways. Just as you can fill in a truth table from a Boolean expression, you can read a truth table and write down an expression that produces it. **Minterms** and **maxterms** are the vocabulary that makes this reverse step mechanical, and they give us a compact shorthand for recording a function without writing out a full table or a long expression. They are also the building blocks of the two *canonical* forms — sum of products and product of sums — and they reappear constantly once we get to Karnaugh maps.

## Minterms and the Canonical Sum of Products

A **minterm** is a single product (AND) term that is equal to `1` for exactly one row of the truth table. To form the minterm for a given row, look across that row's input values and apply one simple rule: a variable that is `0` appears **complemented**, and a variable that is `1` appears **uncomplemented**.

Consider a three-variable function of $A$, $B$, and $C$. We fix a **variable hierarchy** so the rows have a consistent numbering: $A$ is the most-significant bit and $C$ is the least-significant bit. Row 0 is then $ABC = 000$, row 7 is $111$, and every row's number is just the binary value of its inputs. With that convention:

- Row 0 ($000$) gives the minterm $\bar{A}\,\bar{B}\,\bar{C}$ — all three bits are `0`, so all three variables are complemented.
- Row 7 ($111$) gives the minterm $A\,B\,C$ — all three bits are `1`, so none are complemented.
- Row 4 ($100$) gives $A\,\bar{B}\,\bar{C}$.

Each minterm $m_i$ is `1` for its own row and `0` everywhere else. To describe a whole function, we simply **OR together the minterms of every row where the output is `1`**. The result is the **canonical sum of products (SOP)** — a sum (OR) of product (AND) terms.

Writing all of those terms out is tedious, so we use a shorthand. Because the variable hierarchy fixes which row is which, we can list only the row numbers where the output is `1`:

$$F = \sum m(i_1, i_2, \dots)$$

This is a **minterm list**. The $\Sigma m$ notation means "the sum of the minterms for these rows."

## Maxterms and the Canonical Product of Sums

Corresponding to every minterm is a **maxterm**, and the relationship between them is a *duality*. Where a minterm maps the rows where the output is `1`, a maxterm maps the rows where the output is `0`.

A **maxterm** $M_i$ is a single sum (OR) term that is equal to `0` for exactly one row. Forming a maxterm flips the literal rule used for minterms: a variable that is `1` appears **complemented**, and a variable that is `0` appears **uncomplemented**, and the literals are joined by OR rather than AND. For example, row 2 ($010$) gives the maxterm $(A + \bar{B} + C)$. You can check it: substituting $A=0, B=1, C=0$ makes every literal `0`, so the whole sum is `0` — exactly for row 2 and no other.

To describe a function, we **AND together the maxterms of every row where the output is `0`**, giving the **canonical product of sums (POS)** — a product (AND) of sum (OR) terms. The matching shorthand lists the row numbers where the output is `0`:

$$F = \prod M(i_1, i_2, \dots)$$

The extra complementing step is what makes the POS form feel less natural than SOP, which is why sum of products is usually where we focus. But the two forms carry exactly the same information.

## Two Views of the Same Function

The minterm list and the maxterm list of a function are **exact complements**: every row number is either in one list or the other, and together they account for all the rows. If a row makes the output `1`, its index appears in the minterm list; if it makes the output `0`, its index appears in the maxterm list. This makes converting between the two forms trivial — you just take the row numbers that the other list leaves out.

The interactive truth table for this topic makes the duality concrete. Toggle each row's output between `0` and `1` and watch the canonical SOP and POS expressions, and their $\Sigma m$ and $\Pi M$ shorthands, build up in real time. Switching between the Minterms and Maxterms tabs shows the literals flip and the index lists swap to their complements, while the underlying function stays the same.

## A Worked Example

Suppose a three-variable function $F$ is `1` only at rows 4 and 6:

| # | $A$ | $B$ | $C$ | $F$ |
|---|-----|-----|-----|-----|
| 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 1 | 0 |
| 2 | 0 | 1 | 0 | 0 |
| 3 | 0 | 1 | 1 | 0 |
| 4 | 1 | 0 | 0 | 1 |
| 5 | 1 | 0 | 1 | 0 |
| 6 | 1 | 1 | 0 | 1 |
| 7 | 1 | 1 | 1 | 0 |

Reading off the two `1` rows gives the canonical SOP directly:

$$F = A\,\bar{B}\,\bar{C} \;+\; A\,B\,\bar{C}$$

Row 4 ($100$) contributes $A\,\bar{B}\,\bar{C}$ (minterm 4) and row 6 ($110$) contributes $A\,B\,\bar{C}$ (minterm 6). In shorthand:

$$F = \sum m(4, 6)$$

To convert to a maxterm list, simply take the row numbers that are *not* in the minterm list — every row where the output is `0`:

$$F = \prod M(0, 1, 2, 3, 5, 7)$$

Both expressions describe the identical truth table. In hardware terms, this canonical SOP maps straight onto a behavioral description — for instance, in Verilog the same function can be written from the minterm list as a sum of product terms:

```verilog
// F = Σm(4, 6)
assign F = (A & ~B & ~C)   // minterm 4
         | (A &  B & ~C);  // minterm 6
```

A later topic shows that with Karnaugh maps this same function can often be rewritten with fewer logical connectors — here, the two terms share $A\,\bar{C}$ and collapse to $F = A\,\bar{C}$ — which means a smaller circuit. Minterms and maxterms are the vocabulary that makes that minimization possible.

## Key Takeaways

A truth table and a Boolean expression carry the same information, and minterms and maxterms let you move freely between them. A minterm is a product term that is `1` for exactly one row (a `0` input variable is complemented, a `1` is not); ORing the minterms of every `1` row yields the canonical sum of products, written compactly as a $\Sigma m$ minterm list. A maxterm is the dual — a sum term that is `0` for exactly one row, with the literal rule flipped — and ANDing the maxterms of every `0` row yields the canonical product of sums, written as a $\Pi M$ maxterm list. With $A$ as the most-significant bit, each row gets a fixed number, and the minterm and maxterm lists of a function are exact complements, so converting between the two forms is just a matter of swapping in the missing row numbers. Sum of products is the more natural form and the usual focus, and these terms become essential vocabulary once minimization with Karnaugh maps begins.

## Review Questions

**1. What is a minterm?**
A. A sum term that is `0` for exactly one row of the truth table
B. A product term that is `1` for exactly one row of the truth table
C. The smallest number in a minterm list
D. Any product term in a Boolean expression

**2. In a minterm, how does an input variable appear if its value in that row is `0`?**
A. Uncomplemented
B. It is omitted from the term
C. Complemented
D. Replaced with a constant `0`

**3. With $A$ as the most-significant bit, what minterm corresponds to row 6 of a three-variable truth table?**
A. $\bar{A}\,B\,C$
B. $A\,B\,C$
C. $A\,B\,\bar{C}$
D. $A\,\bar{B}\,\bar{C}$

**4. Minterms are naturally associated with which canonical form?**
A. Product of sums (POS)
B. Sum of products (SOP)
C. Neither
D. Both equally

**5. A three-variable function is given by $F = \sum m(4, 6)$. What is its equivalent maxterm list?**
A. $\prod M(4, 6)$
B. $\prod M(0, 1, 2, 3, 5, 7)$
C. $\prod M(0, 1, 2, 3, 4, 5, 6, 7)$
D. $\prod M(1, 3, 5, 7)$

**6. For its own row, a maxterm evaluates to what value?**
A. `1`
B. `0`
C. It depends on the other variables
D. Undefined

## Answer Explanations

**1. B.** A minterm is a product (AND) term constructed so that it is `1` for exactly one row of the truth table and `0` for all others. Option A describes a maxterm, and the remaining options miss the "exactly one row" defining property.

**2. C.** The rule for minterms is that a `0` variable is complemented and a `1` variable is uncomplemented, so that the product is `1` only for that specific input combination. A value of `0` therefore appears as the complemented variable.

**3. C.** Row 6 in binary (with $A$ as MSB) is $110$, i.e. $A=1, B=1, C=0$. Applying the minterm rule — `1`s uncomplemented, `0`s complemented — gives $A\,B\,\bar{C}$.

**4. B.** Adding a minterm corresponds to marking a row where the output is `1`, and ORing those minterms produces the sum of products. Maxterms (option A) pair with product of sums.

**5. B.** The minterm and maxterm lists are exact complements over all eight rows (0–7). Removing the minterm rows {4, 6} leaves {0, 1, 2, 3, 5, 7}, which is the maxterm list.

**6. B.** A maxterm is defined as the sum (OR) term that equals `0` for exactly one row — its own — and `1` for every other row. That is the dual of a minterm, which is `1` for exactly its own row.
