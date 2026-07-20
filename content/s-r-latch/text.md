The previous section showed that a single inverter with feedback oscillates because it has no fixed point — no state where the output, fed back to the input, reproduces itself. Building a working memory element requires a feedback topology with at least two stable states. The S-R latch achieves this using two cross-coupled NOR gates, and it is the simplest circuit that can store one bit of information.

## Circuit Structure

An S-R latch consists of two NOR gates whose outputs feed back into each other's inputs. The top gate takes the Reset input $R$ and produces the output $Q$. The bottom gate takes the Set input $S$ and produces $\overline{Q}$ (labeled QN in many references, since the complementary relationship only holds under proper operation). Each gate's output connects back to one input of the other gate, forming a cross-coupled feedback loop. A simple way to remember the wiring: **$Q$ pairs with $R$, and $S$ pairs with $\overline{Q}$** — each output shares its gate with the *opposite* control.

Recall the NOR gate truth table:

| A | B | $\overline{A + B}$ |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

The critical property is that a NOR gate outputs 1 only when both inputs are 0. If either input is 1, the output is forced to 0 regardless of the other input. This asymmetry is what makes stable feedback possible.

## The Set Operation

Suppose the latch is currently storing 0: $Q = 0$ and $\overline{Q} = 1$. To store a 1, assert the Set input by driving $S = 1$ while keeping $R = 0$.

The propagation proceeds through the circuit in a sequence of steps. When $S$ goes to 1, the bottom NOR gate evaluates $\overline{S + Q} = \overline{1 + 0} = 0$, so $\overline{Q}$ drops to 0. This new value feeds back to the top NOR gate, which now sees both inputs at 0: $\overline{R + \overline{Q}} = \overline{0 + 0} = 1$, so $Q$ rises to 1. The new $Q = 1$ feeds back to the bottom gate, but it changes nothing — $\overline{1 + 1} = 0$, which is consistent with $\overline{Q}$ already being 0. The circuit has reached a stable state with $Q = 1$ and $\overline{Q} = 0$.

## Memory: The Feedback Holds

The defining test of a memory element is whether it retains its value after the control input is removed. When $S$ returns to 0, the bottom NOR gate re-evaluates with $S = 0$ and the $Q$ feedback still at 1: $\overline{0 + 1} = 0$. The output $\overline{Q}$ remains 0. The top gate sees $R = 0$ and $\overline{Q} = 0$: $\overline{0 + 0} = 1$. The output $Q$ remains 1.

The feedback loop sustains the stored value without any external input. This is the essential property that distinguishes a sequential circuit from a combinational one — the output depends on what happened in the past, not just on what the inputs are now.

## The Reset Operation

Resetting the latch is symmetric to setting it. Assert $R = 1$ while keeping $S = 0$. The top NOR gate forces $Q$ to 0. This 0 feeds back to the bottom gate, which now has both inputs at 0 and produces $\overline{Q} = 1$. The $\overline{Q} = 1$ feeds back to reinforce $Q = 0$ at the top gate. When $R$ returns to 0, the feedback holds $Q = 0$ — the latch remembers the reset.

## S-R Latch Operation Summary

The complete behavior is captured in this table:

| S | R | Q (next) | $\overline{Q}$ (next) | Action |
|---|---|---|---|---|
| 0 | 0 | Q (hold) | $\overline{Q}$ (hold) | No change — memory holds |
| 1 | 0 | 1 | 0 | Set — store a 1 |
| 0 | 1 | 0 | 1 | Reset — store a 0 |
| 1 | 1 | 0 | 0 | Forbidden — both outputs forced low |

The $S = R = 0$ case is the hold state: no input is asserted, and the feedback loop maintains the current value of $Q$. This is the normal resting condition of the latch.

## The Forbidden State

When both $S = 1$ and $R = 1$, both NOR gates are forced to output 0, giving $Q = 0$ and $\overline{Q} = 0$. This violates the complementary relationship between $Q$ and $\overline{Q}$. Worse, when both inputs return to 0 simultaneously, both gates see (0, 0) and try to output 1 — the circuit enters a race condition where the final state depends on which gate is physically faster. The result is unpredictable. For this reason, the $S = R = 1$ input combination is defined as forbidden and must be prevented by the surrounding logic.

## The S'-R' Latch: The Same Idea, Built from NAND

Historically, latches are more often built from **NAND** gates than from NOR gates. NAND is the workhorse primitive of most logic families, and — as we will see in the next topics — the NAND latch is the direct stepping stone to the gated D latch. Cross-coupling two NAND gates gives the **S'-R' latch** (read "S-bar, R-bar"). It does exactly the same job as the S-R latch, with one important difference: its inputs are **active-low**.

Where a NOR gate forces its output to 0 whenever *any* input is 1, a NAND gate forces its output to **1** whenever *any* input is **0**:

| A | B | $\overline{A \cdot B}$ |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

Cross-coupling the two gates, the top gate produces $Q = \overline{S' \cdot \overline{Q}}$ and the bottom gate produces $\overline{Q} = \overline{R' \cdot Q}$. Note the labeling relative to the NOR latch: here the **set** input $S'$ sits on the gate that produces $Q$ directly, the mirror image of the NOR arrangement.

Because a low input forces a NAND output high, you **assert** an input by pulling it to **0**, not to 1:

- **Set** ($S' = 0$, $R' = 1$): the top gate sees a 0 and forces $Q = 1$; that 1 arrives at the bottom gate, which now has both inputs at 1, so $\overline{Q} = 0$. The latch stores a 1.
- **Reset** ($S' = 1$, $R' = 0$): the bottom gate is forced to $\overline{Q} = 1$, which drives $Q = 0$ at the top gate. The latch stores a 0.
- **Hold** ($S' = 1$, $R' = 1$): neither input is asserted, so each gate's output is determined solely by the other gate fed back — the cross-coupled loop sustains the stored bit, exactly as in the NOR latch.
- **Forbidden** ($S' = 0$, $R' = 0$): both gates are forced high, giving $Q = \overline{Q} = 1$. As with the NOR latch, this breaks the complement, and releasing both inputs together races to an unpredictable state.

| $S'$ | $R'$ | Q (next) | $\overline{Q}$ (next) | Action |
|---|---|---|---|---|
| 1 | 1 | Q (hold) | $\overline{Q}$ (hold) | Memory holds |
| 0 | 1 | 1 | 0 | Set — store a 1 |
| 1 | 0 | 0 | 1 | Reset — store a 0 |
| 0 | 0 | 1 | 1 | Forbidden — both outputs forced high |

The behavior mirrors the S-R latch with every level inverted: the resting/hold state is $S' = R' = 1$ (not $0,0$), you assert with a **low** pulse rather than a high one, and the forbidden combination drives both outputs **high** instead of low. Same bistable feedback, same memory — just the NAND-native, active-low form, and the one we build on next when we add an enable to turn it into a D latch.

## Verilog Model

An S-R latch can be described behaviorally in Verilog:

```verilog
module sr_latch (
    input  S,
    input  R,
    output reg Q,
    output     Qbar
);

    assign Qbar = ~Q;

    always @(S, R) begin
        case ({S, R})
            2'b10: Q <= 1'b1;  // Set
            2'b01: Q <= 1'b0;  // Reset
            // 2'b00: hold (no assignment, Q retains value)
            // 2'b11: forbidden (not modeled)
        endcase
    end
endmodule
```

The `always @(S, R)` block is level-sensitive, reflecting the fact that a basic S-R latch is asynchronous — it responds immediately to changes on its inputs without waiting for a clock edge.

The S'-R' (NAND) latch can be modeled the same way, structurally, as two cross-coupled NAND gates driven by active-low inputs:

```verilog
module sr_latch_nand (
    input  Sn,     // S' — active low (assert = 0)
    input  Rn,     // R' — active low (assert = 0)
    output Q,
    output Qbar
);
    assign Q    = ~(Sn & Qbar);   // cross-coupled NAND
    assign Qbar = ~(Rn & Q);
endmodule
```

Here the two `assign` statements express the cross-coupled feedback directly: each output is the NAND of its active-low input and the *other* output. Driving `Sn = 0` sets the latch; `Rn = 0` resets it; holding both at 1 stores the bit.

## Key Takeaways

The S-R latch is the simplest memory element in digital logic, built from two cross-coupled NOR gates. Setting $S = 1$ stores a 1 in $Q$; resetting $R = 1$ clears $Q$ to 0. The feedback loop between the two gates sustains the stored value after the control input is removed, giving the circuit memory. The combination $S = R = 1$ is forbidden because it produces an inconsistent state and an unpredictable outcome when released. The **S'-R' latch** is the same element built from cross-coupled **NAND** gates — the more common, NAND-native form. Its behavior is the S-R latch's with every level inverted: the inputs are **active-low** (assert with a 0), the resting/hold state is $S' = R' = 1$, and the forbidden combination $S' = R' = 0$ forces both outputs **high** rather than low. Whichever way it is built, the latch establishes the fundamental principle behind all sequential storage elements: cross-coupled feedback creates stable states that persist without continuous input — and adding an enable to the NAND latch is the next step, on the way to the D latch and flip-flop.

---

## Review Questions

**1. What is the basic building block of an S-R latch?**

- A) Two cross-coupled AND gates
- B) Two cross-coupled NOR gates
- C) A single NOR gate with feedback
- D) Two inverters connected in series

**2. After setting the latch ($S = 1$, $R = 0$) and then releasing set ($S = 0$), what holds the value of $Q$ at 1?**

- A) The set input continues to drive the circuit even after being released
- B) A capacitor inside the NOR gate stores the charge
- C) The cross-coupled feedback loop sustains the output without external input
- D) The reset input defaults to a value that maintains $Q = 1$

**3. What is the output when both $S = 1$ and $R = 1$ are asserted simultaneously on an S-R latch?**

- A) $Q = 1$, $\overline{Q} = 0$
- B) $Q = 0$, $\overline{Q} = 1$
- C) $Q = 0$, $\overline{Q} = 0$
- D) $Q = 1$, $\overline{Q} = 1$

**4. Why is the $S = R = 1$ condition called "forbidden"?**

- A) It physically damages the NOR gates due to excessive current
- B) It violates the $Q / \overline{Q}$ complementary relationship and produces an unpredictable state when both inputs return to 0
- C) It causes the latch to oscillate like an inverter with feedback
- D) It permanently locks the latch so that future set and reset operations have no effect

**5. What makes an S-R latch a sequential circuit rather than a combinational one?**

- A) It uses NOR gates, which are inherently sequential
- B) It requires a clock signal to operate
- C) Its output depends on stored state from prior inputs, not just current inputs
- D) It has more outputs than inputs

**6. In the S-R latch, which input is paired with the $Q$ output on the same NOR gate?**

- A) Set ($S$)
- B) Reset ($R$)
- C) Both $S$ and $R$ feed into the same gate
- D) Neither — $Q$ is produced by a separate buffer gate

**7. The S'-R' latch is built from cross-coupled NAND gates. How do you assert its Set input?**

- A) Drive $S' = 1$
- B) Drive $S' = 0$ (pull it low), since the inputs are active-low
- C) Apply a rising clock edge to $S'$
- D) Drive both $S'$ and $R'$ to 1 at once

**8. What is the forbidden input combination for the S'-R' (NAND) latch, and what does it produce?**

- A) $S' = R' = 1$, forcing both outputs low
- B) $S' = R' = 0$, forcing both outputs high
- C) $S' = R' = 1$, forcing both outputs high
- D) $S' = 0$, $R' = 1$, causing sustained oscillation

---

## Answer Explanations

**1. Answer: B) Two cross-coupled NOR gates**

The S-R latch is constructed from two NOR gates with each gate's output feeding back to the other gate's input. This cross-coupled topology provides the two stable states needed for 1-bit storage.

- *AND gates* (A) would not produce the correct logic for a latch. AND gates output 1 only when all inputs are 1, which does not create complementary stable states through cross-coupling.
- *Single NOR gate* (C) cannot form a latch — it has only one output and no cross-coupled feedback path to create bistable behavior.
- *Two inverters in series* (D) would simply double-invert the input back to its original value, providing no memory capability.

**2. Answer: C) The cross-coupled feedback loop sustains the output without external input**

When $S$ returns to 0, $Q = 1$ continues to feed back into the bottom NOR gate, keeping $\overline{Q} = 0$, which feeds back to the top gate and keeps $Q = 1$. The loop is self-reinforcing.

- *Set continues to drive* (A) is incorrect — the whole point of memory is that the input can be removed and the state persists.
- *Capacitor* (B) confuses static logic with dynamic storage. The S-R latch holds its state through active logic feedback, not stored charge.
- *Reset defaults* (D) is incorrect — when $R = 0$, the reset input is inactive and has no role in maintaining the stored value.

**3. Answer: C) $Q = 0$, $\overline{Q} = 0$**

When both $S$ and $R$ are 1, both NOR gates have at least one input at 1, forcing both outputs to 0. This gives $Q = 0$ and $\overline{Q} = 0$.

- *$Q = 1$, $\overline{Q} = 0$* (A) would be the set state, which requires $S = 1$ and $R = 0$.
- *$Q = 0$, $\overline{Q} = 1$* (B) would be the reset state, which requires $R = 1$ and $S = 0$.
- *$Q = 1$, $\overline{Q} = 1$* (D) is impossible for NOR gates with any input at 1 — a NOR gate can only output 1 when all inputs are 0.

**4. Answer: B) It violates the $Q / \overline{Q}$ complementary relationship and produces an unpredictable state when both inputs return to 0**

With $S = R = 1$, both outputs are 0, violating the expected complement. When both inputs drop to 0 simultaneously, both gates race to output 1, and the outcome depends on physical gate delays — a race condition.

- *Physical damage* (A) is incorrect — standard logic levels do not damage gates. The problem is logical, not electrical.
- *Oscillation* (C) is incorrect — the outputs do not oscillate; they are both held at 0 while $S = R = 1$. The problem occurs upon release.
- *Permanent lock* (D) is incorrect — the latch can still be set or reset individually after the forbidden state; the issue is the unpredictable transition when both are released together.

**5. Answer: C) Its output depends on stored state from prior inputs, not just current inputs**

When $S = 0$ and $R = 0$, the latch output depends on whether set or reset was asserted most recently. This dependence on history is the defining characteristic of sequential logic.

- *NOR gates are inherently sequential* (A) is incorrect — NOR gates are combinational. It is the cross-coupled feedback topology that creates sequential behavior.
- *Requires a clock* (B) is incorrect — the basic S-R latch is asynchronous and operates without a clock.
- *More outputs than inputs* (D) is not a defining characteristic of sequential circuits. The number of inputs and outputs does not determine whether a circuit is combinational or sequential.

**6. Answer: B) Reset ($R$)**

In the standard S-R latch layout, the Reset input feeds into the same NOR gate that produces $Q$ (the top gate). The Set input feeds into the gate that produces $\overline{Q}$ (the bottom gate).

- *Set* (A) is incorrect — $S$ is paired with the $\overline{Q}$ output on the bottom gate.
- *Both feed the same gate* (C) is incorrect — each input goes to a separate gate, which is what allows independent set and reset control.
- *Separate buffer* (D) is incorrect — $Q$ is produced directly by one of the two NOR gates, not by an additional component.

**7. Answer: B) Drive $S' = 0$ (pull it low), since the inputs are active-low**

A NAND gate forces its output high whenever any input is low, so the S'-R' latch responds to a **0**, not a 1. Pulling $S' = 0$ forces $Q = 1$ (set); its resting/hold state is $S' = R' = 1$.

- *Drive $S' = 1$* (A) is the inactive level — it holds, it does not set.
- *Clock edge* (C) is incorrect — the S'-R' latch is asynchronous, with no clock.
- *Both inputs to 1* (D) is the hold state, not a set.

**8. Answer: B) $S' = R' = 0$, forcing both outputs high**

Asserting both active-low inputs drives both NAND gates high, so $Q = \overline{Q} = 1$ — the complement is broken, and releasing both together races to an unpredictable state. This is the mirror of the NOR latch's forbidden state, which instead forces both outputs **low** at $S = R = 1$.

- *$S' = R' = 1$ forcing low* (A) is the hold state, and it does not force the outputs low.
- *$S' = R' = 1$ forcing high* (C) misidentifies the hold state as forbidden.
- *Oscillation* (D) is incorrect — while both inputs are 0 the outputs are steady at 1; the trouble is the race on release, not oscillation.
