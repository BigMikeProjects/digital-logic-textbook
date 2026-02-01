# Basic Logic Gates

In a course on digital logic, logic gates represent a natural starting point. They provide a clean and simple way to describe digital behavior without getting buried in circuit implementation details. Rather than beginning with transistor-level circuit diagrams, we start with something more straightforward and conceptually more powerful: the logic gate.

## What is a Logic Gate?

A logic gate is an abstraction—a basic building block for digital systems. It takes one or more binary inputs (the zeros and ones that we provide) and produces a binary output according to some fixed rule. This deterministic behavior is precisely what makes gates so useful. They are "logical" in the sense that they represent the way humans process things that have binary interpretations: true or false, yes or no, on or off.

Each logic gate can be represented in three complementary ways:

1. **Truth table**: A complete listing of all possible input combinations and their corresponding outputs
2. **Logic symbol**: A distinctive graphical shape used in circuit diagrams
3. **Boolean expression**: An algebraic formula using Boolean algebra notation

Understanding all three representations is essential, as engineers frequently translate between them when designing and analyzing digital circuits.

## The NOT Gate (Inverter)

The NOT gate is the simplest logic gate, having only one input. Its function is straightforward: it inverts the input. What goes in as a one comes out as a zero, and what goes in as a zero comes out as a one.

| A | Y |
|---|---|
| 0 | 1 |
| 1 | 0 |

The Boolean expression for the NOT gate is written as $Y = \bar{A}$ (read as "Y equals A bar" or "Y equals NOT A"). The bar over the variable indicates logical negation or complement.

The logic symbol for a NOT gate is a triangle with a small circle (called a bubble) on the output. In digital logic, a bubble always indicates inversion—a concept we will see repeatedly with other gates.

## The AND Gate

The AND gate produces a high output only when all of its inputs are high. For a two-input AND gate, the output is one only when both A AND B equal one. If either input is zero, the output is zero.

| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

The Boolean expression for the AND gate is $Y = A \cdot B$, where the dot represents the AND operation. Just as in regular algebra where multiplication signs are often implied, the dot between variables is frequently omitted: $Y = AB$ means the same thing as $Y = A \cdot B$.

This parallel to multiplication is intentional—if you think of 0 as representing zero and 1 as representing one, the AND operation produces results identical to multiplication. Zero times anything is zero; only one times one gives one.

The AND gate symbol has a flat back and a curved front, resembling the letter "D" lying on its side.

## The OR Gate

The OR gate produces a high output when any of its inputs are high. For a two-input OR gate, the output is one when A OR B (or both) equal one. The output is zero only when all inputs are zero.

| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

The Boolean expression uses the plus symbol: $Y = A + B$. This is the Boolean OR operation, not arithmetic addition. Even when both inputs are one, the output is one (not two, as arithmetic addition would suggest).

The OR gate symbol has a curved back (concave) and comes to a point at the front, giving it a distinctive shield-like appearance.

## The NAND Gate

The NAND gate combines AND with NOT—it performs the AND operation and then inverts the result. "NAND" is a contraction of "NOT-AND."

| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

The Boolean expression places a bar over the entire AND expression: $Y = \overline{A \cdot B}$. The output is zero only when both inputs are one; otherwise, it is one.

The symbol for a NAND gate is the AND gate shape followed by a bubble on the output. That bubble indicates the inversion of the AND result.

NAND gates have a special property: they are *universal gates*. Any other logic gate can be constructed using only NAND gates. This makes them particularly valuable in integrated circuit manufacturing, where using a single gate type simplifies the fabrication process.

## The NOR Gate

The NOR gate is to OR what NAND is to AND—it performs the OR operation and then inverts the result. "NOR" stands for "NOT-OR."

| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

The Boolean expression is $Y = \overline{A + B}$. The output is one only when both inputs are zero; any high input produces a zero output.

Like NAND, the NOR gate is also a universal gate. Any logic circuit can be built using NOR gates exclusively.

## The XOR Gate (Exclusive OR)

The XOR gate—pronounced "exclusive or"—outputs one when its inputs are different and zero when they are the same. This behavior differs from the standard OR gate, which outputs one even when both inputs are one.

| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

The Boolean expression uses the circled plus symbol: $Y = A \oplus B$.

A useful way to think about XOR gates, especially with more than two inputs, is that the output is one when there is an odd number of ones among the inputs. If there is an even number of ones (including zero ones), the output is zero. This odd-parity behavior makes XOR gates valuable in error detection circuits and arithmetic operations like binary addition.

The XOR symbol is similar to the OR gate but with an extra curved line on the input side, creating a double-arc appearance.

## The XNOR Gate (Equivalence Gate)

The XNOR gate is the complement of XOR—it outputs one when inputs are the same and zero when they differ. For this reason, it is often called the *equivalence gate*.

| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

The Boolean expression is $Y = \overline{A \oplus B}$ or equivalently $Y = A \odot B$.

When A equals B (both zero or both one), the output is one. When A and B have different values, the output is zero. This makes XNOR gates useful in comparison circuits that need to determine whether two signals match.

The XNOR symbol is the XOR shape with a bubble on the output.

## Boolean Algebra Notation Summary

| Operation | Symbol | Expression | Meaning |
|-----------|--------|------------|---------|
| NOT | Triangle + bubble | $Y = \bar{A}$ | Complement of A |
| AND | Flat back, curved front | $Y = A \cdot B$ or $Y = AB$ | Both true |
| OR | Curved back, pointed front | $Y = A + B$ | Either true |
| NAND | AND + bubble | $Y = \overline{A \cdot B}$ | NOT(both true) |
| NOR | OR + bubble | $Y = \overline{A + B}$ | NOT(either true) |
| XOR | Double-arc | $Y = A \oplus B$ | Different values |
| XNOR | XOR + bubble | $Y = A \odot B$ | Same values |

## Key Takeaways

Logic gates serve as the foundation for all digital systems. By understanding these seven basic gates—NOT, AND, OR, NAND, NOR, XOR, and XNOR—you have the building blocks needed to construct arbitrarily complex digital circuits. Each gate implements a specific Boolean function, and the consistent relationship between truth tables, symbols, and algebraic expressions provides multiple ways to reason about digital behavior.

The bubble notation for inversion is particularly important: whenever you see a bubble on a gate symbol, it indicates that the signal passing through that point is being complemented. This visual convention extends throughout digital logic and will appear repeatedly as we explore more complex circuits.

---

## Review Questions

**1. What is the primary purpose of using logic gates as abstractions in digital design?**

- A) They make circuits run faster than transistors alone
- B) They allow describing digital behavior without circuit implementation details
- C) They reduce the physical size of digital circuits
- D) They eliminate the need for Boolean algebra

---

**2. For an AND gate with two inputs, how many input combinations produce an output of 1?**

- A) One
- B) Two
- C) Three
- D) Four

---

**3. What does a "bubble" on a logic gate symbol indicate?**

- A) The gate has multiple outputs
- B) The signal is being amplified
- C) The signal is being inverted (complemented)
- D) The gate requires external power

---

**4. Which statement correctly describes the XOR gate's behavior?**

- A) Output is 1 when any input is 1
- B) Output is 1 when all inputs are 1
- C) Output is 1 when inputs have the same value
- D) Output is 1 when inputs have different values

---

**5. Why are NAND and NOR gates called "universal gates"?**

- A) They are used in every country's electronics standards
- B) Any other logic gate can be built using only that gate type
- C) They can operate at any voltage level
- D) They work with both analog and digital signals

---

**6. The Boolean expression $Y = A + B$ represents which logic operation?**

- A) Arithmetic addition
- B) AND operation
- C) OR operation
- D) XOR operation

---

## Answer Explanations

**1. Answer: B) They allow describing digital behavior without circuit implementation details**

Logic gates provide abstraction—they let us focus on logical behavior (inputs, outputs, and Boolean functions) without worrying about transistors, voltages, or other implementation details. This abstraction makes digital design more manageable and conceptually powerful.

- *They make circuits run faster* (A) is incorrect—gates are abstractions, not speed optimizations.
- *They reduce physical size* (C) is incorrect—abstraction doesn't directly affect physical dimensions.
- *They eliminate Boolean algebra* (D) is incorrect—Boolean algebra is essential for working with gates.

**2. Answer: A) One**

An AND gate outputs 1 only when ALL inputs are 1. For a two-input AND gate, only the combination A=1, B=1 produces output 1. The other three combinations (0,0), (0,1), and (1,0) all produce 0.

- *Two* (B), *Three* (C), and *Four* (D) are all incorrect because AND requires both inputs high.

**3. Answer: C) The signal is being inverted (complemented)**

In digital logic symbols, a bubble (small circle) always indicates inversion. This appears on NOT gates, NAND gates (AND + bubble), NOR gates (OR + bubble), and XNOR gates (XOR + bubble).

- *Multiple outputs* (A), *amplification* (B), and *external power* (D) are not indicated by bubbles.

**4. Answer: D) Output is 1 when inputs have different values**

XOR (exclusive OR) outputs 1 when inputs differ (one is 0, the other is 1). When inputs are the same (both 0 or both 1), output is 0.

- *Any input is 1* (A) describes OR, not XOR.
- *All inputs are 1* (B) describes AND.
- *Same value* (C) describes XNOR (the complement of XOR).

**5. Answer: B) Any other logic gate can be built using only that gate type**

NAND and NOR are "universal" because you can construct NOT, AND, OR, XOR, and any other logic function using only NAND gates (or only NOR gates). This is valuable in manufacturing where using a single gate type simplifies fabrication.

- *International standards* (A), *voltage levels* (C), and *analog compatibility* (D) are not what "universal" means in this context.

**6. Answer: C) OR operation**

In Boolean algebra, the plus symbol (+) represents the OR operation, not arithmetic addition. $Y = A + B$ means "Y equals A OR B"—the output is 1 if either A or B (or both) equals 1.

- *Arithmetic addition* (A) is incorrect—Boolean algebra uses + for OR.
- *AND* (B) uses the dot (·) or implied multiplication.
- *XOR* (D) uses the circled plus (⊕).
