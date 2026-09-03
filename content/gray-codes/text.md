# Gray Codes

Every encoding so far was chosen to make a *value* easy to read: unsigned binary makes place value obvious, two's complement makes subtraction free, hexadecimal makes long patterns readable. **Gray code** — also called *reflected binary code* — is chosen for something different: it makes the *transitions between* values safe. The defining property is one sentence — **consecutive values differ in exactly one bit** — and everything else follows from it.

## Why Simultaneous Bit Changes Are a Problem

In ordinary binary, stepping from one value to the next can flip many bits at once. The worst case in four bits is the step from 7 to 8:

$$0111_2 \rightarrow 1000_2$$

All four bits change. On paper that is fine. In hardware it is not, because **the four bits do not change at the same instant** — wires differ in length, gates differ in delay, and sensors do not sample perfectly together. For a moment some bits have flipped and some have not, and whatever is watching sees a value nobody intended. Those momentary wrong values are called **glitches**, and on this step the observer might briefly see `0000`, `1111`, or `0001`. The reading is not slightly wrong; it can be wildly wrong, at exactly the moment the value is changing.

Gray code removes the possibility. The same step from 7 to 8 becomes:

$$0100_G \rightarrow 1100_G$$

One bit moves. There is no in-between pattern to catch, because there is no interval during which two bits disagree about what they should be. The observer sees either the old value or the new one — both of them legitimate.

## The Four-Bit Gray Code

| Position | Binary | Gray Code | Bits Changed |
|----------|--------|-----------|--------------|
| 0        | 0000   | 0000      | -            |
| 1        | 0001   | 0001      | 1            |
| 2        | 0010   | 0011      | 1            |
| 3        | 0011   | 0010      | 1            |
| 4        | 0100   | 0110      | 1            |
| 5        | 0101   | 0111      | 1            |
| 6        | 0110   | 0101      | 1            |
| 7        | 0111   | 0100      | 1            |
| 8        | 1000   | 1100      | 1            |
| 9        | 1001   | 1101      | 1            |
| 10       | 1010   | 1111      | 1            |
| 11       | 1011   | 1110      | 1            |
| 12       | 1100   | 1010      | 1            |
| 13       | 1101   | 1011      | 1            |
| 14       | 1110   | 1001      | 1            |
| 15       | 1111   | 1000      | 1            |

Read the last column down and the guarantee is visible: every step costs exactly one bit.

Notice the bottom of the table too: the last entry `1000` and the first entry `0000` also differ in one bit. The code is **cyclic**, and for a device that rotates that is the whole point.

## Where the Name Comes From: Reflection

"Reflected binary code" describes how the list is built, and building it by hand shows the one-bit property is guaranteed rather than lucky.

Start with one bit: `0`, `1`. To get the two-bit code, **write the list, then write it again reversed underneath — reflected, as in a mirror** — and prefix the original half with 0 and the reflected half with 1: `00, 01, 11, 10`. Repeat for three bits: `000, 001, 011, 010`, then the reflection `110, 111, 101, 100`. Once more gives the sixteen entries above.

The construction *proves* the property. Inside each half the prefix is constant and the rest already had the guarantee. At the seam, the two neighbours are the same lower-order pattern written twice, differing only in the prefix — one bit. The first and last entries are likewise the same pattern with different prefixes, which is why the code closes into a cycle.

## The Rotary Encoder

A **rotary encoder** reports the angular position of a turning shaft. The disc carries concentric tracks of light and dark segments — one track per bit — and a sensor sits over each track, reading a whole pattern at once.

The segment boundaries on different tracks never line up perfectly — manufacturing tolerance, sensor alignment, and beam width all mean some tracks switch marginally before others.

With **binary** tracks, the 7-to-8 boundary is where all four tracks change at once, so a shaft resting near that edge can report `0000` — position 0 — while physically sitting at 7 or 8. That is not a small error; it is a half-turn error, and a CNC axis or robot joint that believes it is at the origin when it is halfway around is a genuine hazard.

With **Gray-coded** tracks, only one track changes at any boundary, so however the ambiguity resolves the answer is one of the two positions the shaft is actually between. The error can never exceed one count. The cyclic property does the same job at the wrap from the last position back to the first — a full revolution has no special seam.

## Binary to Gray Code

Converting binary to Gray uses **XOR** of each bit with the one above it:

$$G_i = B_{i+1} \oplus B_i$$

with the most significant bit copied straight through: $G_{n-1} = B_{n-1}$.

### Example: Convert $1101_2$ to Gray

| Output Bit | Formula | Calculation | Result |
|------------|---------|-------------|--------|
| $G_3$ | $B_3$ | $1$ | **1** |
| $G_2$ | $B_3 \oplus B_2$ | $1 \oplus 1 = 0$ | **0** |
| $G_1$ | $B_2 \oplus B_1$ | $1 \oplus 0 = 1$ | **1** |
| $G_0$ | $B_1 \oplus B_0$ | $0 \oplus 1 = 1$ | **1** |

Result: $1101_2 = 1011_G$

Check it against the table: binary 1101 is position 13, whose Gray entry reads `1011`. ✓ XOR is the right operator here because it answers exactly one question — *are these two bits different?* — and Gray code is entirely about where the changes are.

### The Circuit

Every output bit depends on two input bits and nothing else, so the XOR gates work **in parallel** — one gate delay no matter how wide the number is. In Verilog it is a single line, since shifting right by one lines each bit up with its neighbour:

```verilog
assign gray = bin ^ (bin >> 1);
```

## Gray Code to Binary

The reverse conversion also uses XOR, but each output feeds the next:

$$B_i = B_{i+1} \oplus G_i$$

again with the top bit copied straight through: $B_{n-1} = G_{n-1}$.

### Example: Convert $1011_G$ to Binary

| Output Bit | Formula | Calculation | Result |
|------------|---------|-------------|--------|
| $B_3$ | $G_3$ | $1$ | **1** |
| $B_2$ | $B_3 \oplus G_2$ | $1 \oplus 0 = 1$ | **1** |
| $B_1$ | $B_2 \oplus G_1$ | $1 \oplus 1 = 0$ | **0** |
| $B_0$ | $B_1 \oplus G_0$ | $0 \oplus 1 = 1$ | **1** |

Result: $1011_G = 1101_2$ — back where we started, which is the round-trip check worth doing on every conversion.

### The Circuit

This direction is **cascaded**: $B_2$ waits on $B_3$, $B_1$ waits on $B_2$, and the delay grows with the width. Substituting the recurrence into itself shows what each bit really is — an XOR of *all* the Gray bits from the top down:

$$B_i = G_{n-1} \oplus G_{n-2} \oplus \cdots \oplus G_i$$

Checking the example, $B_1 = 1 \oplus 0 \oplus 1 = 0$ ✓. The two directions are not symmetric in cost: going *to* Gray is local, going *back* is cumulative.

## Applications

**Position encoders** are the classic case — Gray code is the standard for absolute encoders in industrial automation, robotics, CNC machines, and instrumentation.

**Karnaugh maps** label their axes in Gray code order rather than counting order, so physically adjacent cells differ in exactly one variable. That is what makes it possible to *see* a simplification as a rectangle of cells instead of deriving it algebraically. When we reach K-maps, the labels `00, 01, 11, 10` will be this topic showing up again.

**Crossing clock domains** is a use you will meet in sequential design: a Gray-coded counter read on a different clock is off by at most one at a bad moment, where a binary counter could hand over a completely wrong number.

## Key Takeaways

1. **Gray code guarantees** that consecutive values differ in exactly one bit, and the code is cyclic — the last value and the first differ by one bit too.
2. **The guarantee comes from the reflection construction**, which is where "reflected binary code" gets its name: mirror the list, prefix 0 above and 1 below.
3. **Rotary encoders** use Gray code so a reading taken at a boundary is always one of the two adjacent positions, never an unrelated value.
4. **Binary to Gray** is $G_i = B_{i+1} \oplus B_i$ — parallel XORs, one gate delay at any width, one line of Verilog.
5. **Gray to binary** is $B_i = B_{i+1} \oplus G_i$ — cascaded, equivalently an XOR of all Gray bits from the top down.

## Review Questions

**1. What property defines a Gray code?**
A. Every value uses the same number of 1 bits\
B. Consecutive values differ in exactly one bit\
C. Values can be added without carries\
D. The most significant bit always indicates the sign

**2. Why is the binary transition from 7 (`0111`) to 8 (`1000`) dangerous in a position sensor?**
A. Because 7 and 8 are not adjacent positions\
B. Because binary cannot represent the value 8 in four bits\
C. Because all four bits change, and they do not change simultaneously, so intermediate patterns can be read\
D. Because the sensor must convert to decimal first

**3. Convert $1010_2$ to Gray code.**
A. `1111`\
B. `1101`\
C. `0101`\
D. `1011`

**4. Convert $1110_G$ to binary.**
A. `1011`\
B. `1001`\
C. `1111`\
D. `1100`

**5. Why is binary-to-Gray conversion faster than Gray-to-binary?**
A. Binary-to-Gray uses fewer bits\
B. Each Gray bit depends only on two adjacent binary bits, so all the XORs run in parallel, while each binary bit depends on the one above it\
C. Gray-to-binary requires a subtraction\
D. Gray-to-binary can only be done in software

**6. Karnaugh maps label their axes `00, 01, 11, 10` rather than `00, 01, 10, 11`. Why?**
A. To place the largest values in the middle of the map\
B. To make the map square\
C. So that physically adjacent cells differ in exactly one variable, which is what makes visual grouping valid\
D. Because K-maps cannot represent the pattern `10`

**7. A Gray-coded encoder is misaligned so that one track switches slightly early. What is the worst error this can produce?**
A. The reading can be off by one position\
B. The reading can be any value at all\
C. The reading can be off by half a revolution\
D. No error is possible under any circumstances

## Answer Explanations

**1. B.** The single-bit-change guarantee between consecutive values is the entire definition, and every application in this topic follows from it. Option A describes a constant-weight code, a different idea entirely; C describes no code we have met; D describes two's complement.

**2. C.** All four bits change on that step, and physical bits never change at exactly the same instant, so a reading caught mid-transition can return a pattern like `0000` or `1111` — positions nowhere near 7 or 8. Note that 7 and 8 *are* adjacent (ruling out A), and `1000` is a perfectly good four-bit pattern (ruling out B); the problem is timing, not representation.

**3. A.** $G_3 = B_3 = 1$; $G_2 = 1 \oplus 0 = 1$; $G_1 = 0 \oplus 1 = 1$; $G_0 = 1 \oplus 0 = 1$ — giving `1111`. The table confirms it: binary 1010 is position 10, whose Gray entry is `1111`.

**4. A.** Work down with $B_i = B_{i+1} \oplus G_i$: $B_3 = G_3 = 1$; $B_2 = B_3 \oplus G_2 = 1 \oplus 1 = 0$; $B_1 = B_2 \oplus G_1 = 0 \oplus 1 = 1$; $B_0 = B_1 \oplus G_0 = 1 \oplus 0 = 1$ — giving `1011`, which is 11. The table confirms it: Gray `1110` sits at position 11. The common error behind the other options is copying Gray bits straight through instead of accumulating them down the chain.

**5. B.** Each Gray bit is a function of two neighbouring binary bits and nothing else, so every XOR gate can fire at once — one gate delay regardless of width. The reverse direction is cumulative: each binary bit needs the binary bit above it, equivalently an XOR of all the Gray bits from the top down.

**6. C.** `00, 01, 11, 10` is the two-bit Gray code, so stepping one cell sideways changes exactly one input variable. That is precisely the condition under which a rectangle of adjacent cells corresponds to a term with a variable eliminated — the visual shortcut collapses without it.

**7. A.** One track switching early means the boundary between two *adjacent* codes resolves slightly early, so the reading is one of the two positions the shaft is actually between. Because only one bit ever differs between neighbours, no combination of track misalignments can synthesize a distant value — which is exactly the failure mode B and C describe for binary encoding.
