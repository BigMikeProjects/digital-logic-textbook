# Gray Codes

**Gray code** (also called *reflected binary code*) is a special binary encoding where only **one bit changes** between consecutive values. This property makes Gray code essential for applications like rotary position encoders and Karnaugh maps.

## What Makes Gray Code Special?

In standard binary, transitioning between consecutive values often requires multiple bits to change simultaneously. For example, going from $7$ to $8$:

$$0111_2 \rightarrow 1000_2$$

All four bits must flip at once. Gray code eliminates this problem by ensuring that **exactly one bit changes** at each transition:

$$0100_G \rightarrow 1100_G$$

## Gray Code vs Binary

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

## The Rotary Encoder Problem

A **rotary encoder** is a sensor that reads the angular position of a rotating shaft. The encoder disc has concentric tracks with patterns representing position values, and sensors read each track to determine the current position.

### Why Binary Fails

Consider a sensor positioned exactly at the boundary between positions $7$ and $8$ in binary:

- Position 7: $0111$
- Position 8: $1000$

Because all four bits change, the sensor might read any intermediate combination before settling:
- $0000$ (position 0)
- $0001$ (position 1)
- $1111$ (position 15)
- Any other erroneous value

The physics of sensor timing makes it impossible to read all bits at exactly the same instant, creating these **glitch readings**.

### Why Gray Code Works

With Gray code, the same transition from position $7$ to $8$:

- Position 7: $0100$
- Position 8: $1100$

Only the most significant bit changes. At the boundary, the sensor reads either:
- $0100$ (position 7) - the old value
- $1100$ (position 8) - the new value

Both are valid positions. There are **no erroneous intermediate states**.

## Binary to Gray Code Conversion

Converting binary to Gray code uses the **XOR** operation:

$$G_i = B_{i+1} \oplus B_i$$

with the MSB unchanged: $G_{n-1} = B_{n-1}$

### Example: Convert $1101_2$ to Gray

| Output Bit | Formula | Calculation | Result |
|------------|---------|-------------|--------|
| $G_3$ | $B_3$ | $1$ | **1** |
| $G_2$ | $B_3 \oplus B_2$ | $1 \oplus 1 = 0$ | **0** |
| $G_1$ | $B_2 \oplus B_1$ | $1 \oplus 0 = 1$ | **1** |
| $G_0$ | $B_1 \oplus B_0$ | $0 \oplus 1 = 1$ | **1** |

Result: $1101_2 = 1011_G$

### Circuit Implementation

The binary-to-Gray conversion circuit is **parallel** - all XOR gates operate simultaneously, giving $O(1)$ propagation delay.

## Gray Code to Binary Conversion

The reverse conversion also uses XOR, but with a **cascaded** structure:

$$B_i = B_{i+1} \oplus G_i$$

with the MSB unchanged: $B_{n-1} = G_{n-1}$

### Example: Convert $1011_G$ to Binary

| Output Bit | Formula | Calculation | Result |
|------------|---------|-------------|--------|
| $B_3$ | $G_3$ | $1$ | **1** |
| $B_2$ | $B_3 \oplus G_2$ | $1 \oplus 0 = 1$ | **1** |
| $B_1$ | $B_2 \oplus G_1$ | $1 \oplus 1 = 0$ | **0** |
| $B_0$ | $B_1 \oplus G_0$ | $0 \oplus 1 = 1$ | **1** |

Result: $1011_G = 1101_2$ (matches our original value)

### Circuit Implementation

The Gray-to-binary conversion circuit is **cascaded** - each XOR gate must wait for the previous output, giving $O(n)$ propagation delay for $n$ bits.

## XOR Gate Review

The **exclusive-OR** gate outputs $1$ when inputs differ:

| A | B | A $\oplus$ B |
|---|---|--------------|
| 0 | 0 | 0            |
| 0 | 1 | 1            |
| 1 | 0 | 1            |
| 1 | 1 | 0            |

XOR is perfect for Gray code conversion because it detects whether adjacent bits are the same or different.

## Applications

### Rotary Encoders
Gray code is the standard for absolute position encoders in:
- Industrial automation
- Robotics
- CNC machines
- Audio equipment (volume knobs)

### Karnaugh Maps
Karnaugh maps use Gray code ordering on their axes so that adjacent cells differ by only one variable. This property enables visual grouping of logic terms for simplification.

### Error Detection
The single-bit-change property helps detect certain transmission errors in digital communication.

## Key Takeaways

1. **Gray code guarantees** exactly one bit changes between consecutive values
2. **Rotary encoders** use Gray code to prevent misreads at position boundaries
3. **Binary-to-Gray conversion** uses parallel XOR gates: $G_i = B_{i+1} \oplus B_i$
4. **Gray-to-binary conversion** uses cascaded XOR gates: $B_i = B_{i+1} \oplus G_i$
5. **Karnaugh maps** use Gray code ordering to enable visual logic minimization
