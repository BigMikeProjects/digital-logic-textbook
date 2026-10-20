There are many ways to describe a finite state machine in Verilog, but over the years designers have settled on a few standard structures. Using one of them as a **coding template** makes a state machine quick to write, easy to read and easy to check, because each part of the code corresponds to one part of the hardware. This topic builds the template around a machine already designed by hand: the level-to-pulse FSM.

## The Machine Already Designed

The level-to-pulse machine from **Level-to-Pulse FSM** turns a level $L$ into a pulse $P$ that is high for exactly one clock after each rising edge of $L$. It is a Moore machine with three states and a binary state assignment:

| State | $Q_1\,Q_0$ | $P$ |
|:--|:-:|:-:|
| LOW | 0 0 | 0 |
| PULSE | 0 1 | 1 |
| HIGH | 1 0 | 0 |

From LOW, $L = 1$ moves to PULSE. From PULSE, $L = 1$ moves to HIGH and $L = 0$ returns to LOW. From HIGH, $L = 1$ stays in HIGH and $L = 0$ returns to LOW. Code 11 is unused. The hand design produced these equations:

$$D_1 = L \cdot (Q_1 + Q_0) \qquad D_0 = L \cdot \overline{Q_1} \cdot \overline{Q_0} \qquad P = \overline{Q_1} \cdot Q_0$$

The circuit adds one detail the earlier design left out: a **reset**. In front of each flip-flop's D input sits an AND gate with a bubble on its reset input. While reset is 0, the bubble passes a 1 and the AND gate passes the next-state value through. When reset is 1, the bubble turns it into a 0, both AND gates output 0, and on the next clock edge the machine goes to 00, the LOW state, which is a sensible place to start.

The circuit has three blocks of hardware. Two flip-flops with their reset gates hold the state. The gates for $D_1$ and $D_0$ compute the next state. One AND gate computes $P$. The Verilog will have three blocks too.

## The Template

Here is the whole machine in Verilog:

```verilog
module level_to_pulse (
  input      clk,
  input      reset,    // synchronous, active high
  input      L,        // the level
  output reg P         // one-clock pulse per rising edge of L
);
  localparam [1:0] LOW = 2'b00, PULSE = 2'b01, HIGH = 2'b10;

  reg [1:0] state, next;

  // Block 1: state register
  always @(posedge clk)
    if (reset) state <= LOW;
    else       state <= next;

  // Block 2: next-state logic
  always @(*) begin
    case (state)
      LOW:     next = L ? PULSE : LOW;
      PULSE:   next = L ? HIGH  : LOW;
      HIGH:    next = L ? HIGH  : LOW;
      default: next = LOW;
    endcase
  end

  // Block 3: output logic (Moore: state only)
  always @(*)
    P = (state == PULSE);
endmodule
```

It reads from top to bottom in the order of the design.

**Ports.** The module begins, like every module, with its ports: the clock `clk`, the `reset` signal, the level `L` coming in, and the pulse `P` going out.

**Naming the states.** The `localparam` line attaches a label to each bit pattern: LOW is `2'b00`, PULSE is `2'b01`, HIGH is `2'b10`. The patterns are two bits wide because the state is two bits. This line builds no hardware. It records the state assignment, so that the logic below can say `PULSE` instead of `2'b01` and be read straight off the state diagram.

**State and next state.** The line `reg [1:0] state, next;` declares two 2-bit signals. `state` is the pair of flip-flop outputs, $Q_1 Q_0$. `next` is the pair of values arriving at their D inputs. Both are declared `reg`, but a `reg` in Verilog is not necessarily a flip-flop. `next` is assigned in a combinational block, so it is just wires. What makes memory is the clock edge, not the word `reg`.

**Block 1, the state register.** This block is sensitive only to the rising edge of the clock, and nothing in it happens at any other time, which is exactly how flip-flops behave. If `reset` is 1 on a clock edge, the state goes to LOW. Otherwise the state takes the value of `next`. Because the reset is checked only on a clock edge, it is a **synchronous reset**, and it is the AND gates with the bubble in the circuit. Both assignments use non-blocking `<=`, as every clocked block should (see **Blocking versus NonBlocking**). **Defining State Memory in Verilog** covers this block on its own.

**Block 2, the next-state logic.** A `case` statement on the current state is the state diagram written down one bubble at a time. Each arm uses the conditional operator, `L ? PULSE : LOW`, which is a 2-to-1 mux: if $L$ is 1, choose PULSE; otherwise choose LOW. The arms follow the arcs: from LOW, $L = 1$ leads to PULSE and $L = 0$ stays in LOW; from PULSE, $L = 1$ leads to HIGH and $L = 0$ leads back to LOW; from HIGH, $L = 1$ stays and $L = 0$ leads back to LOW. The block is combinational, so it uses blocking `=`. The `default` arm covers the unused code 11 and sends it to LOW. It also guarantees that every path through the `case` assigns `next`, which matters for the reason given under the second pitfall below.

**Block 3, the output logic.** In a Moore machine the output depends only on the state, so this block compares the state with PULSE. That comparison is the single AND gate $P = \overline{Q_1} \cdot Q_0$.

Each block of code is one block of the circuit:

| Code | Hardware | Assignment |
|:--|:--|:-:|
| `localparam`, `reg` declarations | nothing: names and wires | none |
| Block 1, `always @(posedge clk)` | two D flip-flops and the reset gates | `<=` |
| Block 2, `always @(*)` with `case` | the gates for $D_1$ and $D_0$ | `=` |
| Block 3, `always @(*)` | the AND gate for $P$ | `=` |

The `case` statement agrees with the hand equations on all six legal combinations of state and $L$. It differs only for the unused state 11 with $L = 1$: the K-map treated that row as a don't-care and the equations happen to send it to HIGH, while the `default` sends it to LOW. Both recover, and neither can happen after a reset.

## Running the Template

A test bench drives $L = 0\,0\,1\,1\,1\,1\,0\,0\,1\,1\,0\,0$, one value per clock, after one clock with reset held high. The simulator prints the state and the output in the middle of each clock period:

```
clk  L  state  P
t0   0    00   0
t1   0    00   0
t2   1    00   0
t3   1    01   1
t4   1    10   0
t5   1    10   0
t6   0    10   0
t7   0    00   0
t8   1    00   0
t9   1    01   1
t10  0    10   0
t11  0    00   0
```

$L$ rises before t2 and stays high for four clocks, yet $P$ is high for exactly one clock, at t3, while the machine passes through PULSE. $L$ rises again before t8, and $P$ is high again for one clock, at t9. One pulse per rising edge of $L$, as designed. At each clock the active arm of the `case` statement is the one for the current state, and its mux picks the next state from $L$.

## Combining the Logic Blocks

Some designers merge the next-state logic and the output logic into a single combinational block, especially when the machine is small:

```verilog
  always @(posedge clk)
    if (reset) state <= LOW;
    else       state <= next;

  always @(*) begin
    next = LOW; P = 1'b0;           // defaults: no latches
    case (state)
      LOW:   begin next = L ? PULSE : LOW; end
      PULSE: begin next = L ? HIGH  : LOW; P = 1'b1; end
      HIGH:  begin next = L ? HIGH  : LOW; end
      default: next = LOW;
    endcase
  end
```

This builds the same hardware. In simulation it produces the identical trace, $P = 0\,0\,0\,1\,0\,0\,0\,0\,0\,1\,0\,0$. The line of defaults at the top of the block gives `next` and `P` a value before the `case` runs, so every path assigns both. It is still a Moore machine: $P$ is set only in the PULSE arm and does not depend on $L$. The video misspeaks on this point: it describes the combined listing as the Mealy version. Combining the blocks does not change the kind of machine. It is a matter of coding style, and it works the same way for a Moore or a Mealy machine; the Mealy output is a separate change, described under the pitfalls below. The three-block form is the better one to learn first, because each block is one drawing.

## Pitfalls

**Blocking assignments in the state register.** Writing `state = next` instead of `state <= next` will probably still work in a machine this simple. In a larger design, where another clocked block also reads `state` on the same edge, the value that block sees depends on which block the simulator happens to run first. Use non-blocking `<=` for every assignment in the clocked block.

**A missing case arm.** If some path through a combinational block does not assign a signal, the synthesizer has to make that signal keep its old value on that path. Keeping a value without a clock is memory, so it builds a **latch**, which is not what a block of gates should contain. A `default` arm, or default assignments at the top of the block, makes every path assign every signal, so no latch is built.

**A Mealy output.** The output could depend on the input as well as the state. Writing block 3 as

```verilog
  always @(*)
    P = (state == LOW) & L;
```

makes $P$ a Mealy output. It rises in the same clock that $L$ rises, one clock earlier than the Moore output; in the same test the trace becomes $P = 0\,0\,1\,0\,0\,0\,0\,0\,1\,0\,0\,0$. The cost is the one described in **Mealy versus Moore**: nothing clocked sits between $L$ and $P$, so $P$ follows anything $L$ does during the clock period. Use it as a deliberate choice, not as the default. Moving an output's line into block 1 with `<=` goes the other way and makes it come straight off a flip-flop, the subject of **Registered Outputs**.

## The Template in Summary

Every state machine written this way has the same parts in the same order: the ports; the state names with `localparam`; the `state` and `next` declarations; block 1, the state register, clocked and written with `<=`; block 2, the next-state logic, a `case` statement written with `=` and a `default`; and block 3, the output logic, written with `=`. The structure is the same for every machine, so a new design only has to fill it in.

## Key Takeaways

A finite state machine is written in Verilog with a coding template whose blocks map one to one onto the hardware of the hand design. The `localparam` line records the state assignment and lets the logic name its states; the `state` and `next` declarations name the flip-flop outputs and inputs and build nothing themselves. The state register is an `always @(posedge clk)` block with non-blocking assignments and, here, a synchronous reset to LOW. The next-state logic is a `case` statement read straight off the state diagram, with blocking assignments and a `default` so no latch is inferred. The output logic depends on the state alone in a Moore machine. Running the level-to-pulse template on $L = 001111001100$ gives $P = 000100000100$: one pulse per rising edge of $L$. The next-state and output blocks may be combined as a matter of style, and making the output depend on $L$ turns it into a Mealy output one clock sooner.

---

## Review Questions

**1. In the template, which block becomes the flip-flops?**

A) The `localparam` line\
B) The `always @(posedge clk)` block that assigns `state`\
C) The `always @(*)` block with the `case` statement\
D) Every block that assigns a `reg`

**2. The line `reg [1:0] state, next;` declares `next` as a `reg`. What hardware does `next` become?**

A) Two flip-flops, because every `reg` is a flip-flop\
B) A latch\
C) Wires: the two D inputs, because `next` is assigned in a combinational block\
D) Nothing, because `next` is only a name for a bit pattern

**3. What does `next = L ? PULSE : LOW;` describe?**

A) A comparison of $L$ with PULSE\
B) A 2-to-1 mux: if $L$ is 1 the next state is PULSE, otherwise LOW\
C) A flip-flop that stores PULSE\
D) A reset to LOW

**4. Why does the `case` statement include `default: next = LOW;`?**

A) So that every path assigns `next` and no latch is inferred, and so the unused state 11 recovers to LOW\
B) Because Verilog requires a default arm in every `case` statement\
C) To make the machine reset to LOW\
D) To turn the output into a Mealy output

**5. Block 3 is changed from `P = (state == PULSE);` to `P = (state == LOW) & L;`. What happens to the output for $L = 001111001100$?**

A) Nothing; the trace is still $P = 000100000100$\
B) The output becomes a Mealy output, and each pulse comes one clock earlier: $P = 001000001000$\
C) $P$ stays high as long as $L$ is high\
D) The machine no longer leaves the LOW state

---

## Answer Explanations

**1. B.** Only a block sensitive to a clock edge makes flip-flops: `always @(posedge clk)` with `state <= next` becomes the two D flip-flops (and the reset gates in front of them). The `localparam` line (A) builds nothing, the `case` block (C) becomes gates, and declaring a signal `reg` (D) does not make it memory.

**2. C.** `next` is assigned in an `always @(*)` block, which is combinational, so it becomes the wires carrying the next-state values to the D inputs. A `reg` is not necessarily a flip-flop (A). A latch (B) would appear only if some path failed to assign it, which the `default` prevents. `next` is a real signal, not just a name (D); `localparam` is what names bit patterns.

**3. B.** The conditional operator selects one of two values based on $L$, which is a 2-to-1 mux, the arm for LOW in the state diagram. It does not compare $L$ with a state (A), store anything (C) or reset the machine (D).

**4. A.** A path that does not assign `next` would force the synthesizer to remember its old value without a clock, which is a latch; the default arm makes every path assign it and sends the unused code 11 to LOW. Verilog does not require a default (B), the reset is done in block 1 (C), and the output logic is in block 3 (D).

**5. B.** With $L$ in the output equation, $P$ rises during the clock when $L$ first reads 1 in state LOW, which is one clock before the machine reaches PULSE. The simulation gives $P = 001000001000$ instead of $000100000100$. The trace does change (A), $P$ still goes back to 0 while $L$ stays high (C), and the next-state logic is untouched (D).
