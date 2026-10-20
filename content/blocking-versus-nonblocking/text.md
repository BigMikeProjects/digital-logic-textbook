Real digital design is done in a hardware description language such as Verilog, and using one well means understanding a few of its subtleties. One of the most important is a pair of operators that look almost alike. Inside an `always` block you can assign a value with an ordinary equal sign, `=`, or with the less-than-or-equal symbol, `<=`. The first is called a **blocking** assignment and the second a **non-blocking** assignment. The symbol `<=` is not a comparison here. It helps to read it as an arrow, and to think of that arrow as a clock edge.

This topic shows why sequential circuits need non-blocking assignments and combinational circuits need blocking assignments. Once the reason is clear, the rule is easy to remember.

## Two Assignment Operators

The lines of an `always` block run from top to bottom. The question that separates the two operators is whether a line sees the value that the line above it has just assigned.

With a blocking assignment, it does. Each line finishes before the next one starts, so a later line reads the value an earlier line just wrote. The name comes from this behavior: each line *blocks* the one below it until it is done.

```verilog
q2 = q1;    // blocking: reads q1 as just updated
```

With a non-blocking assignment, it does not. Every right-hand side in the block is read first, using the values from **before** the block began, and then all of the left-hand sides are updated together.

```verilog
q2 <= q1;   // non-blocking: reads q1 from before
```

## A Shift Register Needs Non-Blocking

A **shift register** is a chain of D flip-flops on one clock, with the output of each flip-flop feeding the input of the next. An input $d$ enters at the left, and on every clock edge each bit moves one stage to the right. Shift registers will be covered properly later; here the circuit is simply the clearest example of flip-flops working together.

Three flip-flops in series, described with non-blocking assignments:

```verilog
module shift_nb (input clk, input d, output reg q1, q2, q3);
  always @(posedge clk) begin
    q1 <= d;
    q2 <= q1;
    q3 <= q2;
  end
endmodule
```

Start with all three flip-flops at 0 and feed in $d = 1, 0, 1, 1$, one value per clock edge. Before the first edge, the 1 waits at the input. On the edge, it is clocked into $q_1$, and at the same moment the zeros that were already in $q_1$ and $q_2$ move into $q_2$ and $q_3$. The next value of $d$, a 0, is now waiting at the input. Each edge repeats the move:

| Edge | $d$ clocked in | $q_1$ | $q_2$ | $q_3$ |
|:-:|:-:|:-:|:-:|:-:|
| start | | 0 | 0 | 0 |
| 1 | 1 | 1 | 0 | 0 |
| 2 | 0 | 0 | 1 | 0 |
| 3 | 1 | 1 | 0 | 1 |
| 4 | 1 | 1 | 1 | 0 |

The data shifts one stage per edge, which is exactly what the hardware does. The line `q2 <= q1` reads the value $q_1$ held *before* the edge, not the value `q1 <= d` is about to give it. All three assignments take effect together, so the order of the three lines does not even matter. That simultaneity is the point: flip-flops that share a clock all capture their inputs at the same instant, and non-blocking assignments describe exactly that.

## The Same Lines with Blocking

Change only the operator:

```verilog
module shift_b (input clk, input d, output reg q1, q2, q3);
  always @(posedge clk) begin
    q1 = d;
    q2 = q1;
    q3 = q2;
  end
endmodule
```

Now the lines run in order, each waiting for the one above. On the first edge, `q1 = d` makes $q_1 = 1$. Then `q2 = q1` reads the $q_1$ that was *just written*, so $q_2 = 1$. Then `q3 = q2` reads the new $q_2$, so $q_3 = 1$. The input has reached all three stages in a single edge. With the same input sequence:

| Edge | $d$ clocked in | $q_1$ | $q_2$ | $q_3$ |
|:-:|:-:|:-:|:-:|:-:|
| start | | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 |
| 2 | 0 | 0 | 0 | 0 |
| 3 | 1 | 1 | 1 | 1 |
| 4 | 1 | 1 | 1 | 1 |

The register is always all ones or all zeros. This is not a shift register at all: it describes three flip-flops that each copy $d$. Both descriptions start from the same 0 0 0, but after the first edge each carries its own state into the next one, because the two operators have described two different circuits.

The code compiles and simulates without complaint, so nothing warns you that the circuit is wrong. For flip-flops, the bottom line is to use non-blocking assignments.

## A Gate Chain Needs Blocking

Combinational logic is the opposite case. Consider three gates in series, an AND, an OR and an inverter:

$$y = \overline{a \cdot b + c}$$

The wires between the gates get names, $t_1$ and $t_2$, so the code can describe one gate per line:

```verilog
module chain_b (input a, b, c, output reg y);
  reg t1, t2;
  always @(a or b or c) begin
    t1 = a & b;
    t2 = t1 | c;
    y  = ~t2;
  end
endmodule
```

The sensitivity list `@(a or b or c)` runs the block whenever one of the circuit's three inputs changes. There is no clock. When an input changes, the new value has to work its way through the chain: the AND gate settles first, then the OR gate uses the AND gate's new output, then the inverter uses the OR gate's new output. Blocking assignments do exactly this. Suppose the inputs change from 0 0 0 to $a = 1, b = 1, c = 0$. Then `t1 = a & b` gives $t_1 = 1$; `t2 = t1 | c` reads the new $t_1$ and gives $t_2 = 1$; `y = ~t2` reads the new $t_2$ and gives $y = 0$. One pass through the block, and the answer matches the gates.

## The Same Lines with Non-Blocking

With non-blocking assignments, every line reads the value from before the block ran:

```verilog
always @(a or b or c) begin
  t1 <= a & b;
  t2 <= t1 | c;
  y  <= ~t2;
end
```

From the same settled state ($t_1 = 0$, $t_2 = 0$, $y = 1$) and the same change to 1 1 0, the line for $t_2$ reads the *old* $t_1 = 0$ and the line for $y$ reads the *old* $t_2 = 0$, so $y$ stays 1. The gates say $y = 0$. Nothing in the sensitivity list changes again, so the block does not run again, and the wrong value stays until the next input change. Running four input changes in a row shows the pattern:

| $a\,b\,c$ becomes | Gates $y$ | Blocking $y$ | Non-blocking $y$ |
|:-:|:-:|:-:|:-:|
| 1 1 0 | 0 | 0 | 1 (wrong) |
| 1 0 0 | 1 | 1 | 1 (right by luck) |
| 1 0 1 | 0 | 0 | 0 (right by luck) |
| 0 0 0 | 1 | 1 | 0 (wrong) |

The non-blocking version is always one step behind: each line uses a value left over from the previous input change. Sometimes that happens to be right. The synthesizer, meanwhile, ignores the sensitivity list and builds the three gates, so the simulation and the hardware disagree.

There is one subtlety. If the block is written `always @(*)`, the list includes every signal the block reads, which means $t_1$ and $t_2$ as well. Then each change to $t_1$ or $t_2$ runs the block again, and the stale values work their way out until $y$ is correct, all within the same instant of simulated time. The simulator covers for the mistake, but the code still does not describe the gates. Do not rely on it; use blocking assignments for combinational logic.

## The Rules

The hardware decides which operator is right:

| | Sequential logic | Combinational logic |
|:--|:--|:--|
| Block | `always @(posedge clk)` | `always @(*)`, or a list of its inputs |
| Each line must read | the old value: all flip-flops capture together | the new value: the signal ripples through |
| Operator | non-blocking `<=` | blocking `=` |
| The wrong operator gives | every stage copies the input in one edge | stale values, one step behind |

- In a clocked block, describing flip-flops, use non-blocking `<=`. Nothing should be blocked; every flip-flop updates at the same time.
- In a combinational block, describing gates, use blocking `=`. Each line reads a value that must already be resolved.
- Do not mix the two operators within one block.

These rules matter most when writing state machines, which combine both kinds of logic. **FSM Coding Template** uses exactly this split: a clocked block with `<=` for the state flip-flops, and combinational blocks with `=` for the next-state and output logic. **Defining State Memory in Verilog** covers the clocked half on its own.

## Key Takeaways

Verilog has two procedural assignment operators, and the difference between them is whether a line sees the value the line above it just assigned. Blocking `=` runs the lines in order, each seeing the results of the ones before it, which is how a signal resolves through a chain of gates. Non-blocking `<=` reads every right-hand side first and then updates everything together, which is how flip-flops on one clock capture their inputs at the same instant. Using `=` in a shift register sends the input through every stage in one clock edge, and using `<=` in a gate chain leaves the output one step behind its inputs. In both cases the code compiles and simulates, but it does not describe the intended hardware. The rule follows from the hardware: `<=` for sequential logic in clocked blocks, `=` for combinational logic, and never both in one block.

---

## Review Questions

**1. Inside an `always @(posedge clk)` block describing flip-flops, which assignment operator should be used?**

A) Blocking (`=`), because the flip-flops should update in the order the lines are written\
B) Non-blocking (`<=`), because all flip-flops on one clock capture at the same instant\
C) Either one; the choice is a matter of style\
D) Blocking for the first flip-flop and non-blocking for the rest

**2. A three-stage shift register starts at $q_1 q_2 q_3 = 0\,0\,0$ and is described with non-blocking assignments (`q1 <= d; q2 <= q1; q3 <= q2;`). After two clock edges with $d = 1$ and then $d = 0$, what does it hold?**

A) 0 0 0\
B) 1 1 1\
C) 0 1 0\
D) 1 0 0

**3. The same shift register is written with blocking assignments (`q1 = d; q2 = q1; q3 = q2;`). What does it do?**

A) It shifts the data one stage per clock edge, like the non-blocking version\
B) It fails to compile, because blocking assignments are not allowed in clocked blocks\
C) On every edge, all three flip-flops take the value of $d$\
D) Only the first flip-flop ever changes

**4. A gate chain is written `always @(a or b or c) begin t1 <= a & b; t2 <= t1 | c; y <= ~t2; end`, starting from $t_1 = 0$, $t_2 = 0$, $y = 1$. The inputs change from 0 0 0 to $a = 1, b = 1, c = 0$. What value of $y$ does the simulation show?**

A) 0, matching the gates\
B) 1, because each line read the value from before the block ran\
C) An unknown value, because $t_1$ and $t_2$ are not inputs\
D) It alternates between 0 and 1

**5. Why do combinational blocks use blocking assignments?**

A) Because a later line must use the value an earlier line just computed, the way a signal resolves through one gate before the next\
B) Because combinational logic has no inputs\
C) Because blocking assignments make the simulation run faster\
D) Because non-blocking assignments are only allowed in test benches

---

## Answer Explanations

**1. B.** Flip-flops that share a clock all capture their inputs at the same instant. Non-blocking assignments model this by reading every right-hand side before any left-hand side changes. With blocking assignments (A), each line would see the values the lines above it just wrote, which flip-flops never do. The choice is not style (C): the two operators describe different circuits. Mixing them in one block (D) breaks the rule against mixing.

**2. C.** On the first edge, $q_1$ takes $d = 1$ while $q_2$ and $q_3$ take the old zeros: 1 0 0. On the second edge, $q_1$ takes $d = 0$, $q_2$ takes the old $q_1 = 1$, and $q_3$ takes the old $q_2 = 0$: 0 1 0. Choice D is the state after only one edge, and B is what the blocking version would hold after the first edge.

**3. C.** `q1 = d` finishes first, then `q2 = q1` reads the $q_1$ just written, then `q3 = q2` reads the $q_2$ just written, so $d$ reaches all three in one edge. The code compiles (B), all three flip-flops change (D), and it does not shift (A).

**4. B.** $t_1$ becomes 1, but the line for $t_2$ read the old $t_1 = 0$, so $t_2$ stays 0, and the line for $y$ read the old $t_2 = 0$, so $y$ stays 1. Nothing in the list `a or b or c` changes again, so the block does not re-run, and the simulation shows 1 while the gates would give 0 (A). The values are known (C) and stable (D); they are simply stale.

**5. A.** In a chain of gates each gate's output depends on the gate before it, so each line has to read the value the line above just computed. Blocking assignments give exactly that. Combinational logic certainly has inputs (B), speed is not the reason (C), and non-blocking assignments are legal in synthesizable code; they belong in clocked blocks (D).
