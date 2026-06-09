## The Two's Complement Number Wheel

The **two's complement number wheel** is a mental model that makes signed binary arithmetic intuitive:
arrange all the representable values around a circle, and arithmetic becomes motion around that circle.
The companion video walks through it interactively.

### Reading the wheel

Start at **zero** — and note one of two's complement's advantages: there is exactly **one
representation of zero** (no separate +0 and −0). From there:

- **Adding** moves you **clockwise** around the wheel.
- **Subtracting** moves you **counterclockwise**.

This view also dissolves a common source of confusion. It can seem strange that the value just *below*
zero is the all-ones bit pattern. On the wheel it's simply the position counterclockwise-adjacent to
zero — the value $-1$ — which reflects the fact that two's complement has subtraction *built into* its
representation.

### Arithmetic as motion

To compute $-4 + 5$, start at $-4$ and step **five positions clockwise** ($1, 2, 3, 4, 5$), landing on
$+1$. The same wheel can be drawn for any word size — a 3-bit wheel has 8 positions, a 5-bit wheel has
32 (more crowded, same idea).

### Overflow and underflow

The wheel makes the failure modes of fixed-width signed arithmetic visible — the points where a result
runs off the end of the range and wraps to the wrong sign:

- **Overflow** happens when you add past the most positive value. In a 4-bit signed range (which tops
  out at $+7$), adding $1$ to $7$ wraps into the **negative** numbers — an error a real circuit must
  detect.
- **Underflow** is the mirror case: subtracting below the most negative value. At $-8$, subtracting
  $1$ does **not** give $-9$; it wraps all the way around to $+7$.

Both are conditions that hardware using two's complement needs to detect. As a quick reasoning tool,
the number wheel captures signed representation, add/subtract behavior, and these edge cases all in one
picture.
