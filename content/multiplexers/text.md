# Multiplexers

The **multiplexer** — almost always shortened to **mux** — is the first of our building block
circuits, and it is a good one to start with because its job is so easy to state: a multiplexer
**routes data**. Out of several data inputs, it picks exactly one and sends it to a single output.
Which one gets through is decided by a separate **control input** called the **select line**. If you
think of it as a digitally controlled switch, you already have the right picture.

We will work through the mux using the section's **four-beat cadence** — functionality, hardware,
applications, and Verilog — with a **2:1 multiplexer** as the running example.

## Beat 1: Functionality

A 2:1 multiplexer has two data inputs, $D0$ and $D1$, one output $Y$, and one select line $S$. The
behavior is a single sentence: **the select line names the input that reaches the output.**

| $S$ | $Y$ |
|:---:|:---:|
| 0   | $D0$ |
| 1   | $D1$ |

When $S = 0$, the value on $D0$ appears at $Y$; when $S = 1$, the value on $D1$ appears at $Y$. The
data itself is not modified in any way — the mux is a router, not a calculator.

Multiplexers are drawn with a **distinctive trapezoidal symbol** that looks like a truncated arrow,
and the shape is doing real work: it visually indicates the **direction of data movement**, wide on
the input side and narrowing to the single output. It is worth learning to recognize on sight, since
you will spot it in schematics constantly.

The 2:1 mux is just the smallest member of the family. In general, an **N:1 multiplexer** selects
one of $N$ data inputs, and because the select lines have to encode which of the $N$ inputs you
want, it needs $\log_2 N$ of them:

| Multiplexer | Data inputs | Select lines |
|-------------|:-----------:|:------------:|
| 2:1         | 2           | 1            |
| 4:1         | 4           | 2            |
| 8:1         | 8           | 3            |
| N:1         | N           | $\log_2 N$   |

Note that **two independent numbers** describe a multiplexer, and it is easy to confuse them. The
$N{:}1$ ratio says **how many inputs** there are to choose from. Separately, each of those inputs
may be a multi-bit **data line** — a bus — and that width is a different quantity entirely. A 4:1
mux carrying 8-bit data selects one of four inputs, each 8 bits wide.

## Beat 2: Building One from Gates

The gate-level construction of a multiplexer is an **AND-OR structure**, and it is worth
understanding rather than memorizing, because the same "enable one path, merge with OR" idea shows
up all over digital design.

Start with a single bit. Each data input gets its own **AND gate**, and the select line controls
which of those AND gates is **enabled**:

$$Y = \bar{S} \cdot D0 + S \cdot D1$$

Read that expression as two gated paths that are OR'd together. When $S = 0$, the complement
$\bar{S}$ is 1, so the $D0$ AND gate has a 1 on its control input and its output simply **follows**
$D0$ — because $1 \cdot D0 = D0$. Meanwhile $S = 0$ forces the $D1$ AND gate's output to 0. When
$S = 1$, the roles swap: the $D1$ gate follows $D1$ and the $D0$ gate is forced to 0.

The **OR gate** at the end then does something almost trivially simple: it passes the live path
straight through, because anything OR'd with 0 is that same anything. This works *only* because the
select line guarantees that **exactly one AND path is ever on at a time**. That is the general
lesson — you can merge several routed paths through a single OR gate as long as at most one of them
is active.

### Widening the mux to multi-bit data

Real data lines are rarely one bit. To handle a **vectorized** mux, you do not need a new idea: you
simply **stamp the same one-bit circuit once per bit**, and share the *same* $S$ and $\bar{S}$
across all the copies. For an $i$-th bit:

$$Y_i = \bar{S} \cdot D0_i + S \cdot D1_i$$

Take a 2-bit example, where $D0$ and $D1$ are each two bits wide — a most significant bit (bit 1)
and a least significant bit (bit 0). That circuit is two copies of the one-bit mux: one producing
$Y_0$ from $D0_0$ and $D1_0$, the other producing $Y_1$ from $D0_1$ and $D1_1$, with one shared
select line driving both. Set $S = 1$ and the $D1$ AND gate in *each* copy is enabled, so
$Y_1 Y_0 = D1_1 D1_0$ — the whole 2-bit word is routed at once.

This 2-bit, 2:1 multiplexer is a **minimal representation** in the sense that it is the smallest
circuit that still shows every feature you need to understand: the select line, the enabling AND
gates, the merging OR gate, and the per-bit replication. Being able to **sketch this gate-level
implementation from memory** is a reasonable exam expectation.

## Beat 3: Applications

Because routing is such a basic need, multiplexers turn up everywhere:

- **Bus source selection.** When several devices could drive a shared bus line, a mux picks which
  one actually does.
- **ALU operand steering.** In computer architecture, the arithmetic unit's operands have to be
  drawn from different registers or immediate values depending on the instruction. That routing
  problem is solved with multiplexers.
- **Implementing Boolean functions.** A multiplexer can realize *any* Boolean function of its select
  inputs — you wire the data pins to the desired truth-table column. This turns out to be a genuinely
  useful design technique, and we return to it later.
- **Time-division multiplexing.** Cycle the select line over time and one shared line can carry many
  signals in turn. We do exactly this in one of the labs.

## Beat 4: Multiplexers in Verilog

The characteristic Verilog idioms for a mux are the **conditional (ternary) operator** `?:` and the
**`case` statement**. The simplest description is a continuous assignment:

```verilog
module mux2 (input s, d0, d1, output y);
  assign y = s ? d1 : d0;
endmodule
```

Every port here is a **scalar** — a single bit — which you can tell because there is no vector
notation on any of them. The `assign` drives the output directly, and the `?` conditions on `s`: if
`s` is 1 the expression takes the value before the colon (`d1`), and if `s` is 0 it takes the value
after the colon (`d0`). That one line is the entire 2:1 multiplexer.

The more instructive example is a **4:1 mux carrying 8-bit data**, which shows both a wider select
and vectorized data:

```verilog
module mux4 (input      [1:0] sel,
             input      [7:0] d0, d1, d2, d3,
             output reg [7:0] y);
  always @*
    case (sel)
      2'b00: y = d0;
      2'b01: y = d1;
      2'b10: y = d2;
      2'b11: y = d3;
    endcase
endmodule
```

Several things are worth reading carefully here. Because the mux is 4:1, the select input `sel` is
**two bits wide** — that is what it takes to distinguish four cases. The data inputs `d0` through
`d3` are declared `[7:0]`, meaning eight bit positions, so they are 8-bit vectors; the output has to
**match that width**, which is why `y` is `[7:0]` as well. Again, note the two separate numbers: the
`4:1` describes how many inputs there are, and the `[7:0]` describes how wide each one is.

The behavior lives in an `always` block containing a `case` statement that conditions on `sel`. The
selectors are written as Verilog literals in the form `2'b00`, where the `2` is the **bit width**,
the `b` means **binary**, and the digits are the value — so the four cases `2'b00`, `2'b01`, `2'b10`,
`2'b11` enumerate every combination of the two select bits, routing `d0`, `d1`, `d2`, and `d3` to `y`
respectively. (If `always` blocks are unfamiliar, they get their own treatment in the Verilog
chapter; for now, read this one as "whenever an input changes, re-evaluate the case.")

## Key Takeaways

A **multiplexer routes one of several data inputs to a single output**, with the **select line**
choosing which. For a 2:1 mux, $S = 0$ gives $Y = D0$ and $S = 1$ gives $Y = D1$; in general an
**N:1 mux needs $\log_2 N$ select lines**. Keep the two describing numbers straight: $N{:}1$ is *how
many inputs*, and the data width is a separate quantity. The hardware is an **AND-OR structure**
captured by $Y = \bar{S} \cdot D0 + S \cdot D1$ — the select line **enables exactly one AND gate**,
whose output then follows its data input, and the **OR gate merely passes the live path through**
because anything OR'd with 0 is unchanged. Merging paths in an OR is safe precisely because only one
path is ever active. To handle **multi-bit data you stamp the same one-bit circuit per bit** and
share the select line across all copies. Multiplexers are used for **bus source selection, ALU
operand steering, implementing Boolean functions, and time-division multiplexing**. In Verilog, the
mux idioms are the **conditional operator** (`assign y = s ? d1 : d0;`) for the simple scalar case
and an **`always` block with `case`** for wider or larger multiplexers.

## Review Questions

**1. In a 2:1 multiplexer with select line $S$, data inputs $D0$ and $D1$, and output $Y$, what does
$S = 1$ produce?**
A. $Y = D0$\
B. $Y = D1$\
C. $Y = D0 + D1$\
D. $Y = 0$

**2. How many select lines does a 16:1 multiplexer require?**
A. 2\
B. 4\
C. 8\
D. 16

**3. Which Boolean expression describes a one-bit 2:1 multiplexer?**
A. $Y = S \cdot D0 + \bar{S} \cdot D1$\
B. $Y = \bar{S} \cdot D0 + S \cdot D1$\
C. $Y = D0 \cdot D1$\
D. $Y = \bar{S} + D0 \cdot D1$

**4. In the gate-level construction, why is it safe to merge both data paths with a single OR gate?**
A. Because OR gates ignore their second input\
B. Because the AND gates invert one of the paths\
C. Because the select line guarantees only one AND path is active at a time, and anything OR'd with
0 is unchanged
D. Because the data inputs are always complementary

**5. How is a multiplexer widened to handle multi-bit data lines?**
A. By adding more select lines\
B. By replicating the same one-bit mux circuit once per bit, sharing the select line\
C. By replacing the AND gates with XOR gates\
D. By cascading the output back into the input

**6. In the Verilog literal `2'b01`, what does the leading `2` indicate?**
A. The value two\
B. That the signal is the second input\
C. The number of bits in the literal\
D. That the literal is in base 2 notation only

**7. In the 4:1 Verilog module, the ports are declared `[7:0]`. What does that tell you?**
A. There are eight data inputs to choose from\
B. Each data line and the output are eight bits wide\
C. The select line is eight bits wide\
D. The module has eight outputs

## Answer Explanations

**1. B.** The select line names the input that reaches the output: $S = 0$ routes $D0$ to $Y$, and
$S = 1$ routes $D1$ to $Y$. A multiplexer never combines its data inputs — it only chooses one.

**2. B.** An N:1 multiplexer needs $\log_2 N$ select lines, and $\log_2 16 = 4$. Four select bits
produce sixteen distinct combinations, exactly enough to name one of sixteen inputs.

**3. B.** Each data input is gated by an AND with the appropriate polarity of the select line, and
the two gated paths are OR'd: $Y = \bar{S} \cdot D0 + S \cdot D1$. Option A has the polarities
backwards, which would route $D1$ when $S = 0$.

**4. C.** The select line enables exactly one AND gate; the other is forced to 0. Since anything
OR'd with 0 is that same value, the OR gate simply passes the one live path through. This is the
general pattern — several routed paths can share an OR gate as long as at most one is ever active.

**5. B.** Widening needs no new idea: you stamp a copy of the one-bit AND-OR mux for each bit
position and drive every copy from the same select line, so the entire word is routed together.
Adding select lines (A) would instead increase the *number of inputs* you can choose from.

**6. C.** Verilog sized literals are written `<width>'<base><value>`, so in `2'b01` the `2` is the
width in bits, the `b` says the value is binary, and `01` is the value. The four literals `2'b00`
through `2'b11` enumerate all combinations of a 2-bit select.

**7. B.** The `[7:0]` range declares eight bit positions — bits 7 down to 0 — so each data input and
the output are 8-bit vectors. How many inputs there are is a separate matter, set by the `4:1`
structure and its 2-bit select.
