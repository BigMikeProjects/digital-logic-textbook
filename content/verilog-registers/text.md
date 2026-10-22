When we began sequential circuits, the first memory element we built was the D flip-flop. This topic writes that flip-flop in Verilog and then generalizes it into a **register**: a group of D flip-flops that load together on one clock. A register can hold the state of a finite state machine, but it can just as easily hold data, such as a number on its way through a calculation. Each line of Verilog added along the way corresponds to a piece of hardware in front of the flip-flops' D inputs.

## One Bit: The D Flip-Flop

A D flip-flop has a data input $d$, a clock input, and an output $q$. On each rising edge of the clock, $q$ takes the value of $d$ and holds it until the next rising edge. In Verilog:

```verilog
module dff (
  input      clk,
  input      d,
  output reg q
);
  always @(posedge clk)
    q <= d;
endmodule
```

The output is declared `output reg q` because it is assigned inside an `always` block. The sensitivity list `@(posedge clk)` says the block runs only at the positive edge of the clock. Between edges nothing runs, and nothing else can change $q$, so $q$ keeps its value. Nothing in the code says "hold"; the edge-only sensitivity is what makes this memory.

At the edge, `q <= d` moves $d$ into $q$ with a nonblocking assignment, the operator every clocked block uses (see **Blocking versus NonBlocking**).

## Eight Bits: A Register

To store a byte instead of a bit, widen $d$ and $q$ to eight-bit vectors. There is still one clock:

```verilog
module reg8 (
  input            clk,
  input      [7:0] d,
  output reg [7:0] q
);
  always @(posedge clk)
    q <= d;
endmodule
```

The description is unchanged except for the `[7:0]` ranges, but the hardware is now eight D flip-flops. The vector $d$ is eight wires, one to each flip-flop's D input; the vector $q$ is the eight Q outputs; and a single clock wire runs to all eight clock inputs, so every bit loads at the same edge. That is what a register is: flip-flops that share a clock and load together.

## Adding a Synchronous Reset

Practical hardware needs a way to put a register into a known value, such as zero when the system starts. Adding a reset takes one `if`:

```verilog
module reg8_rst (
  input            clk,
  input            reset,
  input      [7:0] d,
  output reg [7:0] q
);
  always @(posedge clk)
    if (reset) q <= 8'd0;
    else       q <= d;
endmodule
```

The block is still sensitive only to the clock edge. At each edge, if `reset` is 1 the register loads zero; otherwise it loads $d$.

A synthesizer builds this as an AND gate in front of each D input, eight AND gates in all, with a bubble on the reset input of each. While reset is 0, the bubble turns it into a 1 and the AND gate passes the data bit through. When reset is 1, the bubble turns it into a 0, which disables every gate, so zeros are fed to all eight D inputs. Per bit:

$$D = \overline{R} \cdot d$$

Because the reset sits inside the `posedge` block, it acts only at a rising edge. This is called a **synchronous reset**. Raising `reset` does not clear the register at that instant; the zeros wait at the D inputs until the next edge loads them. A simulation shows it: with `reset` already 1 from time zero, $q$ reads `xx` (unknown) until the first edge, and `00` after it.

## Adding an Enable

When a register stores data inside a larger system, it should load only when told to and otherwise keep what it has. That takes an **enable** input: when enable is 1 the register loads $d$ at the clock edge, and when enable is 0 it holds its previous value.

```verilog
module reg8_rst_en (
  input            clk,
  input            reset,
  input            enable,
  input      [7:0] d,
  output reg [7:0] q
);
  always @(posedge clk)
    if (reset)       q <= 8'd0;
    else if (enable) q <= d;
endmodule
```

The new line is `else if (enable) q <= d;`. There is no final `else`. When reset is 0 and enable is 0, no line assigns $q$, so at that edge $q$ keeps its value.

One way to picture what a synthesizer builds is a 2:1 mux in front of each AND gate, with enable as its select. Input 1 is the data bit $d$. Input 0 is the flip-flop's own output $q$, fed back. When enable is 1, the mux passes $d$, and if reset is 0 the AND gate passes it on to the D input. When enable is 0, the mux selects $q$, so at each edge the flip-flop clocks its own value straight back in: it holds. The missing `else` is that feedback wire. Per bit:

$$D = \overline{R} \cdot \left(E \cdot d + \overline{E} \cdot q\right)$$

The order of the `if` statements sets the priority: reset is checked first, so a reset wins even when enable is 1. In the hardware, the reset AND gate comes after the mux, so it overrides whatever the mux selects.

| reset | enable | D input | At the next rising edge |
|:-:|:-:|:-:|:--|
| 1 | 0 | 0 | $q$ becomes 0 |
| 1 | 1 | 0 | $q$ becomes 0 (reset wins) |
| 0 | 1 | $d$ | $q$ loads $d$ |
| 0 | 0 | $q$ | $q$ holds its value |

## Stepping the Clock

Here is `reg8_rst_en` driven through eight clock edges, the same sequence the interactive steps through. The values are from an iverilog simulation of the module above.

| Edge | reset | enable | $d$ | $q$ after the edge | What happened |
|:-:|:-:|:-:|:-:|:-:|:--|
| 1 | 1 | 0 | a5 | 00 | reset |
| 2 | 0 | 0 | a5 | 00 | hold |
| 3 | 0 | 0 | 3c | 00 | hold: new data, but not enabled |
| 4 | 0 | 1 | 3c | 3c | load |
| 5 | 0 | 1 | ff | ff | load |
| 6 | 0 | 0 | 00 | ff | hold |
| 7 | 1 | 0 | 00 | 00 | reset |
| 8 | 0 | 1 | 5a | 5a | load |

Edge 3 is the one to notice: new data is sitting at $d$, but with enable at 0 the register ignores it and keeps 00. It takes 3c only at edge 4, when enable is 1. Edge 6 is the same idea from the other side: $d$ changes to 00, and the register keeps ff.

## Registers for State and for Data

The clocked block in **FSM Coding Template** is exactly this register: two flip-flops holding the state, with a synchronous reset, written as `if (reset) state <= LOW; else state <= next;`. The same description stores data. In the next section, state machines are paired with a **datapath**, the part of a design that holds and processes data, and registers with an enable are among its main building blocks, loading a value when the controller asserts the enable and holding it otherwise.

## Key Takeaways

- `always @(posedge clk)` with a nonblocking `q <= d` describes a D flip-flop. The block runs only at the rising edge; between edges $q$ holds its value.
- Widening $d$ and $q$ to vectors such as `[7:0]` makes a register: eight flip-flops sharing one clock.
- `if (reset) q <= 8'd0;` inside the `posedge` block is a synchronous reset, built as an AND gate with a bubble on reset in front of every D input: $D = \overline{R} \cdot d$.
- `else if (enable) q <= d;` with no final `else` adds an enable, built as a 2:1 mux whose 0 input is $q$ fed back: $D = \overline{R}\,(E\,d + \overline{E}\,q)$. With enable at 0, the register holds.
- The `if` order sets priority: reset beats enable.
- The same register holds FSM state or data; registers with an enable are a main part of a datapath.

## Review Questions

**1. In `always @(posedge clk) q <= d;`, what makes $q$ hold its value between clock edges?**

A) The nonblocking operator `<=`\
B) The `reg` declaration, which always creates memory\
C) The block runs only at the rising edge of the clock, so nothing changes $q$ between edges\
D) A hidden `else q <= q;` that Verilog adds automatically

**2. The one-bit `dff` module is changed to `input [7:0] d` and `output reg [7:0] q`, with the same `always` block. What hardware does it describe?**

A) One flip-flop that stores an 8-bit number\
B) Eight D flip-flops sharing one clock\
C) Eight D flip-flops, each with its own clock\
D) An 8-to-1 multiplexer

**3. In `reg8_rst`, `reset` goes to 1 halfway between two rising edges. When does $q$ become 00?**

A) Immediately, because reset overrides the clock\
B) At the next rising edge of the clock\
C) Only when $d$ is also 00\
D) Never, unless `reset` stays high for eight edges

**4. In `reg8_rst_en`, $q$ = ff. At the next rising edge, reset = 0, enable = 0 and $d$ = 3c. What is $q$ after the edge?**

A) 3c\
B) 00\
C) ff\
D) xx (unknown)

**5. In the hardware a synthesizer builds for `reg8_rst_en`, what is connected to input 0 of the mux in front of each D input?**

A) Constant 0\
B) The data bit $d$\
C) The reset line\
D) The flip-flop's own output $q$

**6. Both reset and enable are 1 at a rising edge of `reg8_rst_en`. What happens?**

A) $q$ loads $d$, because enable is checked last\
B) $q$ becomes 00, because `if (reset)` comes first\
C) $q$ holds its value\
D) The result is unpredictable

---

## Answer Explanations

**1. C.** `@(posedge clk)` means the block runs only at the rising edge, so between edges nothing assigns $q$ and it keeps its value; the edge-only sensitivity is the memory. The `<=` operator (A) sets how assignments within one edge interact, not whether $q$ holds. Declaring a signal `reg` (B) does not by itself create memory; it means the signal is assigned in an `always` block. Verilog adds nothing hidden (D).

**2. B.** Widening the vectors makes one flip-flop per bit, and the single clock input runs to all eight, so they load together: a register. A single flip-flop stores one bit (A), the clock is shared, not separate (C), and nothing selects one input from several (D).

**3. B.** The reset is inside the `posedge` block, so it is synchronous: raising it puts zeros at the D inputs, and the register loads them at the next rising edge. It does not act immediately (A), it does not depend on $d$ (C), and one edge with reset high is enough (D).

**4. C.** With reset 0, the `if (reset)` line does not run; with enable 0, neither does `else if (enable)`. No line assigns $q$, so it holds ff. It would load 3c (A) only with enable 1, and become 00 (B) only with reset 1. The register has a known value, so it is not unknown (D).

**5. D.** Input 0 is selected when enable is 0, and it carries the register's own output fed back, which is how the register holds. Input 1 is the data bit $d$ (B). Constant 0 (A) and the reset line (C) belong to the AND gate after the mux, not the mux.

**6. B.** The `if` statements are checked in order and `if (reset)` comes first, so reset has priority: $q$ becomes 00. In the hardware, the reset AND gate after the mux forces 0 into D whatever the mux selects. Enable is never reached (A), the register does not hold (C), and the priority is fully determined by the code (D).
