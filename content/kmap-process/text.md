# Karnaugh Maps: The Minimization Process

The earlier topics showed how to draw a Karnaugh map, read product terms off of it, and see why grouping is the same operation as algebraic factoring. This section turns that intuition into a **procedure** — and gives it the formal vocabulary you need to apply it reliably. The goal is **minimization**: rewriting a function $F$ into a **minimal sum-of-products** form, meaning the **fewest product terms** and, among ties, the **fewest total literals**. It turns out the whole procedure reduces to one idea: *identify the essential prime implicants*.

## The Vocabulary

A handful of definitions, each building on the last, are all you need.

**Literal.** A single variable in either true or complemented form. For variables $A, B, C, D$ the literals are $A, \bar{A}, B, \bar{B}, C, \bar{C}, D, \bar{D}$. Literals are the atoms; counting them is how we measure the "cost" of an expression.

**Product term.** An AND of literals, each variable appearing at most once (e.g. $B\,C$). On the map a product term is a rectangular group. Two edge cases are worth noting: a **lone literal** is still a product term (the single literal $D$ is the group of eight cells where $D=1$ — it's just $D$ ANDed with `1`), and a **minterm** is the special product term that names *every* variable exactly once, occupying a single cell.

**Don't-care.** Some input combinations either can't occur in the real problem, or can occur but their output genuinely doesn't matter. Such an output is left **unspecified**, marked with an **X** on the map (sometimes a $d$). A don't-care is a *free choice* — you may treat it as `0` or `1`, whichever helps. The practical rule: **include a don't-care when it enlarges a group, ignore it otherwise.**

**Implicant.** A product term that **implies $F$**: wherever the term is `1`, $F$ is `1`. On the map, an implicant is any legal group sitting entirely on `1`s (and X's) — never on a `0`. You can't, for example, group a `1` cell with an adjacent `0` cell; that term would be `1` somewhere $F$ is `0`, so it isn't an implicant. Every single `1` is trivially an implicant by itself — the smallest kind.

**Prime implicant (PI).** An implicant that **cannot be made any larger** — grow the group to the biggest legal power-of-two size, and it becomes prime. Removing any further literal would make it cover a `0`. Prime implicants are the maximal groups.

**Essential prime implicant (EPI).** A prime implicant that is the **only** PI covering some particular on-set `1` cell — a *distinguished* cell. Because nothing else can cover that `1`, an essential PI must appear in **every** minimal solution.

These nest neatly:

$$\text{essential PIs} \subseteq \text{prime implicants} \subseteq \text{implicants} \subseteq \text{product terms (built from literals)}$$

## The Procedure

To minimize a function from its map:

1. **Find the prime implicants** — circle the largest legal group around each `1`, using don't-cares wherever they let a group grow. Make every group as big as possible.
2. **Keep the essential ones** — for each `1`, ask whether only a single PI covers it; if so, that PI is essential and must be in the answer.
3. **Cover what's left** — if any `1` is still uncovered, add the fewest additional PIs needed, covering every `1` and circling no `0`.

The sum of the chosen prime implicants is the minimized expression. (At least one minimal SOP uses *only* prime implicants, which is why we never need to consider non-maximal groups.)

## A Worked Example

Take the four-variable function

$$F(A,B,C,D) = \sum m(1,3,5,7,9,11,13,14,15) + d(4,6)$$

where $m(\dots)$ are the `1`s and $d(4,6)$ are don't-cares. On a map with $A B$ on the rows and $C D$ on the columns (both Gray-coded):

| $AB \backslash CD$ | 00 | 01 | 11 | 10 |
|---|----|----|----|----|
| **00** | 0 | 1 | 1 | 0 |
| **01** | X | 1 | 1 | X |
| **11** | 0 | 1 | 1 | 1 |
| **10** | 0 | 1 | 1 | 0 |

Finding the prime implicants:

- **$D$** — the two middle columns ($CD = 01, 11$) are all `1`, an entire **group of eight**. Every variable but $D$ cancels, leaving the lone literal $D$.
- **$BC$** — the cells where $B = 1$ and $C = 1$ form a **group of four**, $\{m_6, m_7, m_{14}, m_{15}\}$. This group only closes up because the **don't-care $m_6$** is pulled in as a `1`; without it, the best you could do is the smaller $\{m_{14}, m_{15}\}$.
- **$\bar{A}B$** — the $AB = 01$ row, $\{m_4, m_5, m_6, m_7\}$, is also a legal group of four (its cells are `1`s and X's). It is a prime implicant too.

Now decide which are essential:

- **$m_1$ is covered only by $D$** — no other PI reaches it. So **$D$ is essential**.
- **$m_{14}$ is covered only by $BC$** — so **$BC$ is essential**.
- **$\bar{A}B$ is *not* essential**: its only `1` cells are $m_5$ and $m_7$, and both are already covered by $D$. Drop it.

The two essential prime implicants already cover every `1`, so the minimized result is:

$$F = D + BC$$

Two product terms, three literals — down from the nine minterms we started with. In hardware that is a two-input AND feeding a two-input OR, instead of a wall of four-input gates:

```verilog
// F = Σm(1,3,5,7,9,11,13,14,15) + d(4,6)  →  minimized
assign F = D | (B & C);
```

## Key Takeaways

Minimization means writing $F$ as a minimal sum of products — fewest product terms, then fewest literals — and the K-map turns it into a mechanical procedure. The vocabulary builds in a chain: a **literal** is a variable or its complement; a **product term** is an AND of literals (a lone literal counts, a minterm names them all); a **don't-care** is an unspecified output you may use as `0` or `1` to enlarge a group; an **implicant** is a group consistent with $F$ (all `1`s/X's, no `0`s); a **prime implicant** is an implicant that can't grow; and an **essential prime implicant** is the only PI covering some `1`, so it must appear in every answer. The procedure is: find all prime implicants (largest groups, using don't-cares when they help), keep the essential ones, and add the fewest extra PIs to cover any remaining `1`s. Worked on $F = \sum m(1,3,5,7,9,11,13,14,15) + d(4,6)$, the essential PIs $D$ and $BC$ cover everything, giving $F = D + BC$.

## Review Questions

**1. What does "minimal" mean in a minimal sum-of-products form?**
A. The fewest variables in the whole function
B. The fewest product terms, then the fewest total literals
C. The largest possible groups regardless of count
D. Exactly one product term

**2. Which of the following is a *literal*?**
A. $B \cdot C$
B. $\bar{A}$
C. $A + B$
D. A group of four cells

**3. Why might a don't-care cell be included in a group?**
A. It must always be treated as a 1
B. It makes the map symmetric
C. Treating it as a 1 can enlarge a group and simplify the term
D. Don't-cares are required in every prime implicant

**4. What makes a group of cells a valid *implicant* of $F$?**
A. It contains at least one don't-care
B. It is a single minterm only
C. It sits entirely on `1`s (and don't-cares) — it never covers a `0`
D. It is the largest group on the map

**5. A *prime implicant* is best described as:**
A. Any single `1` on the map
B. An implicant that cannot be made any larger
C. A product term that covers a `0`
D. The only group containing a don't-care

**6. In $F = \sum m(1,3,5,7,9,11,13,14,15) + d(4,6)$, why is the prime implicant $\bar{A}B$ not part of the minimal solution?**
A. It covers a `0`, so it isn't an implicant
B. Its `1` cells ($m_5, m_7$) are already covered by $D$, so it isn't essential
C. It isn't a power-of-two group
D. It uses a don't-care

## Answer Explanations

**1. B.** A minimal SOP minimizes cost in two tiers: first the number of product terms (gates), then the total number of literals (gate inputs). It is not about minimizing distinct variables or forcing a single term.

**2. B.** A literal is a single variable in true or complemented form, so $\bar{A}$ qualifies. $B\cdot C$ is a product term, $A+B$ is a sum, and a group of cells is a term/region — none of those is a literal.

**3. C.** A don't-care output is unspecified, so we may treat it as `1` when doing so lets a group grow larger (a larger group means a simpler term). If it doesn't help, we leave it as `0`. It is never *required*.

**4. C.** An implicant is a product term that implies $F$ — it is `1` only where $F$ is `1`. On the map that means the whole group lies on `1`s (don't-cares allowed); covering any `0` would make the term assert `1` where $F = 0$, so it would not be an implicant. Size is irrelevant to validity.

**5. B.** A prime implicant is a maximal implicant: it has been grown until it cannot be enlarged further without covering a `0`. Single `1`s (option A) are implicants but usually not prime.

**6. B.** $\bar{A}B$ is a legitimate prime implicant, but its only on-set cells, $m_5$ and $m_7$, already fall inside the essential group $D$. Since no `1` needs $\bar{A}B$, it is non-essential and is left out of the minimal cover. It is a valid implicant (it covers no `0`), so option A is wrong.
