In the previous section, we established that feedback — routing an output back to serve as an input — is the mechanism that gives a digital circuit memory. Before constructing a working memory element, it is worth examining the simplest possible feedback circuit to understand why not all feedback produces useful behavior. The result is a cautionary example that motivates the more carefully designed circuits that follow.

## An Inverter with Feedback

Consider a single NOT gate whose output $Y$ is connected directly back to its input $A$. The gate implements $Y = \bar{A}$, and the feedback wire enforces $A = Y$. Combining these two constraints yields the equation $Y = \bar{Y}$, which has no solution in Boolean algebra. No value of $Y$ can satisfy this relationship. A logic 0 produces a 1, which feeds back and produces a 0, which feeds back and produces a 1, and so on without end.

In a physical circuit, this manifests as oscillation. The output toggles between 0 and 1 as fast as the gate's propagation delay allows. Each transition propagates through the inverter and arrives back at the input after one gate delay, immediately triggering the next transition. The circuit never reaches a resting state.

## Why This Circuit Is Unstable

The instability arises because an inverter has only one possible output for each input, and that output always differs from the input. When the output is fed back, every state is self-contradictory. There is no combination of values at $A$ and $Y$ that satisfies both the gate equation and the feedback constraint simultaneously.

Compare this to what a stable feedback circuit would require: at least one state where the output, when fed back to the input, produces the same output again. An inverter cannot provide this. The feedback loop has no fixed point, and the circuit oscillates indefinitely.

## Propagation Delay and Oscillation Frequency

In an ideal mathematical model with zero gate delay, the circuit would need to change state infinitely fast — a physical impossibility. Real gates have a finite propagation delay $t_{pd}$, typically measured in nanoseconds. This delay determines the oscillation period:

$$T = 2 \cdot t_{pd}$$

The factor of two accounts for the fact that a complete cycle requires two transitions: 0 to 1, then 1 back to 0. If a particular inverter has a propagation delay of 5 ns, the resulting oscillation frequency would be:

$$f = \frac{1}{T} = \frac{1}{2 \cdot 5\text{ ns}} = 100\text{ MHz}$$

This is fast, uncontrolled, and entirely dependent on the physical characteristics of the gate rather than any intentional design parameter.

## Deliberate Uses of Unstable Feedback

Not all oscillation is unwanted. In electrical engineering, unstable feedback is deliberately used to build **oscillator circuits** — devices that produce periodic clock signals. Ring oscillators, for example, chain an odd number of inverters in a feedback loop to generate a signal at a frequency determined by the total propagation delay around the loop. These oscillators provide the timing references that synchronize every operation in a digital system.

The distinction is one of intent and control. An oscillator is designed with specific frequency and stability requirements in mind. The single-inverter feedback circuit oscillates at whatever speed the gate happens to switch, with no mechanism for adjustment or control.

## What Stable Feedback Requires

The failure of single-inverter feedback points directly to what a working memory element needs. For feedback to produce a stable state, the circuit must have at least one configuration where the outputs are consistent with the inputs — a fixed point. Furthermore, a useful memory element needs at least two such stable states, so that it can store either a 0 or a 1.

Cross-coupled NOR gates, which form the S-R latch, satisfy both requirements. Each stable state reinforces itself through the feedback path, and external set and reset signals can force the circuit from one stable state to the other. The next section examines this circuit in detail.

## Key Takeaways

An inverter with its output fed back to its input has no stable state because $Y = \bar{Y}$ has no solution. The circuit oscillates at a frequency set by the gate's propagation delay. While unstable feedback has legitimate applications in oscillator design, building a memory element requires a feedback topology with at least two fixed points — stable configurations that sustain themselves. Understanding this failure case makes the cross-coupled gate structure of the S-R latch a natural and well-motivated next step.

---

## Review Questions

**1. What happens when a NOT gate's output is connected directly back to its input?**

- A) The output settles to logic 1 because the gate drives high by default
- B) The output remains at whatever value it was initialized to
- C) The output oscillates between 0 and 1 continuously
- D) The circuit enters a high-impedance state

**2. Why does the equation $Y = \bar{Y}$ indicate instability?**

- A) The equation has two solutions, so the circuit cannot choose between them
- B) The equation has no solution — no Boolean value satisfies it
- C) The equation requires an external clock signal to resolve
- D) The equation produces a floating output that is neither 0 nor 1

**3. An inverter has a propagation delay of 10 ns. If its output is fed back to its input, what is the oscillation frequency?**

- A) 10 MHz
- B) 50 MHz
- C) 100 MHz
- D) 200 MHz

**4. Which of the following is a legitimate application of unstable feedback?**

- A) Storing a single bit of data in a register
- B) Generating a periodic clock signal in a ring oscillator
- C) Implementing a set-reset memory latch
- D) Building a combinational decoder circuit

**5. What property must a feedback circuit have to function as a stable memory element?**

- A) It must use an even number of inverting gates in the loop
- B) It must have at least one fixed point where outputs are consistent with inputs
- C) It must include a clock input to control when feedback is active
- D) It must use NAND gates rather than NOR gates

---

## Answer Explanations

**1. Answer: C) The output oscillates between 0 and 1 continuously**

The inverter always produces the complement of its input. When the output feeds back to the input, a 0 becomes 1, which feeds back and becomes 0, endlessly. No stable resting state exists.

- *Settles to logic 1* (A) is incorrect because the inverter would immediately flip a 1 to 0, which contradicts the assumed stable state.
- *Remains at initial value* (B) describes a memory element with a stable state, which this circuit does not have.
- *High-impedance state* (D) describes a tri-state buffer output, not an inverter feedback loop.

**2. Answer: B) The equation has no solution — no Boolean value satisfies it**

In Boolean algebra, $\bar{0} = 1 \neq 0$ and $\bar{1} = 0 \neq 1$. Neither value equals its own complement, so the equation $Y = \bar{Y}$ is a contradiction with no valid assignment.

- *Two solutions* (A) is the opposite of the actual problem — the equation has zero solutions, not two.
- *Requires a clock* (C) is irrelevant; no clock signal can resolve a logical contradiction.
- *Floating output* (D) confuses logical inconsistency with electrical conditions. The output is actively driven, not floating.

**3. Answer: B) 50 MHz**

One full oscillation cycle requires two gate delays (0→1 and 1→0): $T = 2 \times 10\text{ ns} = 20\text{ ns}$. The frequency is $f = 1/T = 1/(20 \times 10^{-9}) = 50\text{ MHz}$.

- *10 MHz* (A) incorrectly uses $T = 100\text{ ns}$, as if 10 gate delays were needed per cycle.
- *100 MHz* (C) uses only one gate delay as the period ($T = 10\text{ ns}$), forgetting that a full cycle is two transitions.
- *200 MHz* (D) would require a 5 ns period, which is half of one gate delay.

**4. Answer: B) Generating a periodic clock signal in a ring oscillator**

Ring oscillators use an odd number of inverters in a feedback loop to deliberately produce oscillation. The resulting periodic signal serves as a clock or timing reference.

- *Storing a bit* (A) requires stable feedback, not oscillating feedback.
- *Set-reset latch* (C) is a stable feedback circuit — the opposite of what unstable feedback provides.
- *Combinational decoder* (D) has no feedback at all; its outputs depend only on current inputs.

**5. Answer: B) It must have at least one fixed point where outputs are consistent with inputs**

A fixed point is a state where the feedback produces the same output that generated it. Without this, the circuit oscillates. A memory element needs at least two fixed points to store either a 0 or a 1.

- *Even number of inverting gates* (A) is a necessary condition for stability in an inverter chain, but the broader requirement is the existence of fixed points, which depends on the complete circuit topology.
- *Clock input* (C) is used in synchronous designs to control timing, but asynchronous latches like the S-R latch are stable without a clock.
- *NAND vs NOR* (D) is a gate choice, not a stability requirement. Both NAND-based and NOR-based latches can form stable memory elements.
