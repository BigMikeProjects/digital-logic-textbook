When writing Verilog inside an `always` block, the assignment operator you choose determines how the simulator schedules updates — and choosing wrong can silently produce a circuit that behaves nothing like the hardware you intended. Verilog provides two assignment operators for use inside procedural blocks: blocking (`=`) and non-blocking (`<=`). The distinction maps directly to the difference between combinational and sequential logic, and understanding it is essential for writing correct HDL descriptions of flip-flops, registers, and any other clocked circuit.

## Two Assignment Operators

Inside an `always` block, a **blocking** assignment uses the ordinary equal sign:

```verilog
Q1 = D;
```

The simulator executes a blocking assignment immediately and in order. The next statement in the block does not execute until this one completes, and any subsequent reference to `Q1` within the same block sees the newly assigned value. This is similar to variable assignment in a conventional programming language — each line runs before the next.

A **non-blocking** assignment uses the less-than-or-equal symbol:

```verilog
Q1 <= D;
```

With non-blocking assignments, the simulator evaluates all right-hand sides first, then updates all left-hand sides simultaneously at the end of the time step. No assignment within the block sees the effect of any other assignment in the same block during that evaluation cycle. This models the physical reality of clocked hardware, where all flip-flops sample their inputs at the same clock edge and update their outputs in parallel.

## The Rule

The correct usage follows directly from the hardware each type of logic represents:

- **Sequential logic** (flip-flops, registers, state machines): use **non-blocking** (`<=`) inside `always @(posedge clk)` blocks.
- **Combinational logic** (gates, muxes, decoders): use **blocking** (`=`) inside `always @(*)` blocks.

This is not a style preference — it is a functional requirement. Using the wrong operator produces simulation results that do not match the synthesized hardware.

## Shift Register: The Classic Demonstration

A three-stage shift register makes the consequences concrete. The circuit consists of three D flip-flops connected in series: an input $D$ feeds the first flip-flop, and each flip-flop's output connects to the next flip-flop's data input. All three share the same clock. On each rising edge, the value at each flip-flop's input should be captured and shifted one position to the right.

### Non-Blocking: Correct Behavior

The correct Verilog description uses non-blocking assignments:

```verilog
module shift_reg_nb (
    input  clk,
    input  D,
    output reg Q1, Q2, Q3
);

    always @(posedge clk) begin
        Q1 <= D;
        Q2 <= Q1;
        Q3 <= Q2;
    end
endmodule
```

When the clock rises, the simulator evaluates all three right-hand sides using the values that exist *before* any update occurs. Then it assigns all three left-hand sides simultaneously. Walking through an input sequence of $D = 1, 0, 1, 0$:

| Clock Edge | D | Q1 | Q2 | Q3 | Action |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 0 | 0 | 1 enters the register |
| 2 | 0 | 0 | 1 | 0 | 0 enters; 1 shifts right |
| 3 | 1 | 1 | 0 | 1 | 1 enters; previous values shift right |
| 4 | 0 | 0 | 1 | 0 | 0 enters; values continue shifting |

Each clock cycle shifts the data one position — exactly how a physical shift register built from discrete flip-flops would behave. The key is that `Q2 <= Q1` captures the *old* value of `Q1`, not the value just assigned in the line above.

### Blocking: Incorrect Behavior

Now consider the same circuit described with blocking assignments:

```verilog
module shift_reg_b (
    input  clk,
    input  D,
    output reg Q1, Q2, Q3
);

    always @(posedge clk) begin
        Q1 = D;
        Q2 = Q1;
        Q3 = Q2;
    end
endmodule
```

With blocking assignments, each statement completes before the next executes. On a rising clock edge with $D = 1$:

1. `Q1 = D` executes first: $Q1$ becomes 1.
2. `Q2 = Q1` executes next, but `Q1` has *already* been updated to 1: $Q2$ becomes 1.
3. `Q3 = Q2` executes last, and `Q2` is already 1: $Q3$ becomes 1.

The input value propagates through all three flip-flops in a single clock cycle. Walking through an input sequence of $D = 1, 1, 0, 1$:

| Clock Edge | D | Q1 | Q2 | Q3 | Action |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 propagates all the way through |
| 2 | 1 | 1 | 1 | 1 | All remain 1 |
| 3 | 0 | 0 | 0 | 0 | 0 propagates all the way through |
| 4 | 1 | 1 | 1 | 1 | 1 propagates all the way through |

Instead of three independent flip-flops forming a shift register, the blocking description collapses the circuit into what is effectively a single flip-flop driving all three outputs identically. The simulation does not match the intended hardware.

## Why the Distinction Exists

The two operators model two fundamentally different execution semantics. Blocking assignments model **combinational propagation**, where a change at one point ripples through subsequent logic immediately and in sequence — exactly how signals flow through a chain of gates with no clock involved. Non-blocking assignments model **synchronous capture**, where all storage elements sample their inputs at the same instant and update simultaneously — exactly how flip-flops behave on a clock edge.

In real hardware, all flip-flops connected to the same clock truly do capture their inputs at the same moment. The output of one flip-flop at the rising edge has not yet changed when the next flip-flop samples its input. Non-blocking assignments replicate this physical simultaneity in simulation. Blocking assignments, by executing in order, introduce an artificial sequentiality that has no counterpart in clocked hardware.

## A Common Source of Bugs

Mixing up assignment types is one of the most frequent Verilog mistakes, especially for those coming from a software background where sequential execution is the norm. The symptoms are subtle: the code compiles, the synthesis tool may not warn you, and the simulation runs — but the waveforms show values propagating too fast or registers failing to hold distinct values. When debugging a sequential circuit that produces unexpected results, checking for accidental blocking assignments inside clocked always blocks should be one of the first things you verify.

## Key Takeaways

Verilog's two procedural assignment operators serve distinct purposes that correspond directly to the two categories of digital logic. Blocking assignments (`=`) execute in order and model combinational circuits where signals propagate sequentially through gates. Non-blocking assignments (`<=`) evaluate all right-hand sides before updating any left-hand side, modeling the simultaneous capture that occurs at a clock edge in sequential circuits. Using blocking assignments in a clocked always block causes values to propagate through multiple flip-flops in a single cycle, destroying the intended register behavior. The rule is straightforward: use `<=` for sequential logic, `=` for combinational logic. Getting this wrong produces simulations that do not match the hardware, making it one of the most important conventions to internalize when writing Verilog.

---

## Review Questions

**1. Which assignment operator should be used inside an `always @(posedge clk)` block to describe sequential logic?**

- A) Blocking (`=`), because it executes statements in the order a clock would process them
- B) Non-blocking (`<=`), because it models the simultaneous update that occurs at a clock edge
- C) Either operator works; the choice is a matter of coding style
- D) Continuous assignment (`assign`), because it is always active

**2. In a three-stage shift register described with non-blocking assignments, what happens to Q1, Q2, and Q3 when the clock rises and $D = 1$ while all registers are currently 0?**

- A) Q1 = 1, Q2 = 1, Q3 = 1
- B) Q1 = 1, Q2 = 0, Q3 = 0
- C) Q1 = 0, Q2 = 0, Q3 = 1
- D) Q1 = 1, Q2 = 0, Q3 = 1

**3. What goes wrong when blocking assignments are used to describe a shift register inside a clocked always block?**

- A) The code fails to compile because blocking is not allowed in clocked blocks
- B) The input value propagates through all stages in a single clock cycle instead of shifting one position per cycle
- C) The flip-flops oscillate because blocking creates a feedback loop
- D) Only the first flip-flop updates; the others remain at their initial values

**4. Why does `Q2 = Q1` behave differently from `Q2 <= Q1` when both appear after `Q1 = D` (or `Q1 <= D`) in the same always block?**

- A) The `<=` operator ignores the left-hand side entirely and always assigns zero
- B) With `=`, Q2 sees the updated value of Q1 from the line above; with `<=`, Q2 sees Q1's value from before the block began executing
- C) The `=` operator introduces a one-cycle delay that `<=` does not
- D) There is no difference — both operators produce the same result when used in sequence

**5. For which type of logic should blocking assignments (`=`) be used?**

- A) Sequential logic inside `always @(posedge clk)` blocks
- B) Combinational logic inside `always @(*)` blocks
- C) Any logic that involves feedback
- D) Test bench stimulus code only — never in synthesizable modules

---

## Answer Explanations

**1. Answer: B) Non-blocking (`<=`), because it models the simultaneous update that occurs at a clock edge**

Sequential circuits contain flip-flops that all sample their inputs at the same clock edge. Non-blocking assignments replicate this by evaluating all right-hand sides before updating any left-hand side, ensuring that each flip-flop captures the value that existed *before* the clock edge.

- *Blocking* (A) is incorrect — blocking assignments execute in order, introducing an artificial sequentiality that causes values to propagate through multiple registers in one cycle.
- *Either works* (C) is incorrect — using blocking in a clocked block produces different simulation behavior that does not match the synthesized hardware.
- *Continuous assignment* (D) is incorrect — `assign` statements are used outside of always blocks for continuous combinational logic, not for clocked sequential elements.

**2. Answer: B) Q1 = 1, Q2 = 0, Q3 = 0**

With non-blocking assignments, all right-hand sides are evaluated using the pre-update values (Q1 = 0, Q2 = 0, Q3 = 0). Then: Q1 gets D = 1, Q2 gets old Q1 = 0, Q3 gets old Q2 = 0. Only one bit shifts in per clock cycle.

- *All become 1* (A) describes the blocking behavior, where the updated value of Q1 propagates immediately to Q2 and then Q3.
- *Q3 = 1* (C) and (D) are incorrect — with all registers starting at 0, neither Q2 nor Q3 can become 1 in a single cycle since they capture the old values of Q1 and Q2 respectively.

**3. Answer: B) The input value propagates through all stages in a single clock cycle instead of shifting one position per cycle**

Blocking assignments execute sequentially. After `Q1 = D` completes, `Q2 = Q1` sees the new value of Q1, and `Q3 = Q2` sees the new value of Q2. The input reaches all three outputs in one clock cycle, collapsing the shift register into a single effective stage.

- *Fails to compile* (A) is incorrect — blocking inside a clocked block is syntactically valid and will compile without errors.
- *Oscillation* (C) is incorrect — blocking does not create oscillation; it creates immediate sequential propagation within the time step.
- *Only first updates* (D) is incorrect — all three registers update, but they all get the same value because each one propagates to the next immediately.

**4. Answer: B) With `=`, Q2 sees the updated value of Q1 from the line above; with `<=`, Q2 sees Q1's value from before the block began executing**

This is the core distinction. Blocking completes each assignment before moving to the next, so subsequent statements see updated values. Non-blocking evaluates all right-hand sides first using pre-block values, then updates all left-hand sides simultaneously.

- *Ignores and assigns zero* (A) is incorrect — non-blocking assignments evaluate their right-hand sides normally; they simply defer the left-hand side update.
- *Blocking introduces a delay* (C) is backwards — blocking has no delay within the time step; non-blocking defers updates to the end of the time step.
- *No difference* (D) is incorrect — the different scheduling semantics produce different results, as the shift register example demonstrates.

**5. Answer: B) Combinational logic inside `always @(*)` blocks**

Combinational logic has no clock and no stored state. Signals propagate through gates in order, which is exactly what blocking assignments model — each statement completes before the next begins, reflecting how a signal ripples through a chain of combinational gates.

- *Sequential logic* (A) is incorrect — sequential logic requires non-blocking to model simultaneous flip-flop capture at the clock edge.
- *Feedback logic* (C) is incorrect — feedback with storage elements (like latches and flip-flops) is sequential and requires non-blocking. The assignment type is determined by whether the logic is combinational or sequential, not by whether feedback is present.
- *Test bench only* (D) is incorrect — blocking assignments are standard and necessary in synthesizable combinational always blocks.
