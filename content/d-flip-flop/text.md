The D latch settled the question of *what* to store: put the value on $D$, raise the enable, and the bit is captured. What it did not settle is *when*. A latch listens for the entire time its enable is high, so everything that happens on the data line inside that window reaches the output, and the value that finally sticks is whatever $D$ happened to be doing when the enable fell. That is difficult to reason about, and in a circuit with thousands of storage elements it is untenable.

The **D flip-flop** is the fix, and it is the last stop in this sequence: S-R latch → S'-R' latch → D latch → D flip-flop. It narrows the write window from a whole clock phase down to a single **clock edge**.

## The Clock and the Edge

A sequential circuit is timed by a **system clock** — a square wave distributed to every storage element so that the whole machine advances in step. The question is which feature of that waveform should mean "now."

Using the *level* is the problematic choice, because the high phase lasts a long time and anything happening during it can influence what gets stored. Using the **edge** is far better: the $0 \to 1$ transition is a single point in time, so every storage element in the design updates at the same instant and nothing that happens between edges matters.

We draw the rising edge as a vertical line — an instantaneous jump from 0 to 1. A real signal cannot do that; the transition takes a finite time, and real devices require the data to be stable for a short window around it. At this level of abstraction, though, the edge is treated as a single **synchronization instant**, and that abstraction is what makes synchronous design tractable.

A device that responds to the edge rather than the level is **edge-sensitive** (or edge-triggered), as opposed to the **level-sensitive** latch. That one distinction is the whole content of this topic.

## Building It From Two D Latches

The flip-flop is built from parts already on hand: **two D latches in series, driven by the same clock at opposite polarity.**

$$\text{capture latch: } EN = \overline{CLK} \qquad \text{output latch: } EN = CLK$$

The data input $D$ feeds the **capture latch**. Its output — call it $Q_c$ — feeds the **output latch**, whose output is $Q$. The clock drives the output latch's enable directly and the capture latch's enable through an inverter.

Follow one full clock cycle:

| $CLK$ | Capture latch | Output latch | What happens |
|---|---|---|---|
| **Low** | transparent | closed | The capture latch tracks $D$. $Q$ holds its old value — changes on $D$ cannot reach the output. |
| **Rising edge** | closes | opens | The capture latch freezes the value $D$ had at the edge; the output latch opens and passes it to $Q$. |
| **High** | closed | transparent | The output latch repeats the frozen $Q_c$. Further changes on $D$ are locked out at the capture latch. |
| **Falling edge** | opens | closes | $Q$ is held; the capture latch starts tracking $D$ again, ready for the next edge. |

The single idea that makes this work: **the two latches are never transparent at the same time.** There is no instant at which a signal path runs straight from $D$ through to $Q$. Because the clock and its complement drive the two enables, whenever one latch is open the other is closed. The value is handed across at the edge like a baton — the capture latch grabs it, then closes; only then does the output latch open and present it.

This is a **positive-edge-triggered** flip-flop, because $Q$ updates on the rising edge. Inverting both enables gives the negative-edge-triggered version, which updates on the falling edge and is otherwise identical.

> **A note on older terminology.** Many textbooks and datasheets call these two latches the *master* and the *slave*, and describe this circuit as a master-slave flip-flop. We use **capture latch** and **output latch** here, because those names say what each stage does. If you pick up a 74HC74 datasheet or an older reference and see the legacy term, it is describing exactly the circuit above.

## Characteristic Equation and Symbol

The behavior needs no table:

$$Q^+ = D \quad \text{(at each rising clock edge)}$$

$Q$ takes the value of $D$ — but only at the edge, and it holds that value for the entire clock period that follows. Compare this to the D latch's $Q^+ = D \cdot EN + Q \cdot \overline{EN}$, which had to describe two behaviors because the latch has two modes. The flip-flop has one mode; the timing qualifier does all the remaining work.

On a schematic, the flip-flop is drawn as a block with $D$ and $Q$ pins and a **small triangle** at the clock input. That triangle is the notation for edge-triggered, and it is the only visual difference between a flip-flop symbol and a latch symbol. If the triangle is preceded by a bubble, the device triggers on the falling edge.

## Latch vs. Flip-Flop: Reading the Timing Diagram

This is the comparison worth internalizing, and the one most likely to appear on an exam. Feed the **same** $D$ waveform and the **same** clock to a D latch (with the clock wired to its enable) and to a positive-edge D flip-flop, and the two outputs are genuinely different signals.

**The latch rule.** Think of the clock as the latch's enable line. While the clock is **high**, the latch is transparent and $Q$ *mirrors* $D$ — the output trace has the same shape as the input trace through that window, including every change. When the clock **falls**, the latch closes on whatever value was present at that moment and holds it flat for the entire low phase. Then the next high phase begins and it follows again.

**The flip-flop rule.** The output can only change at a **rising edge**. To analyze it, look at what $D$ is **just before** each edge; that value appears on $Q$ immediately after the edge and is held for the whole clock period, until the next edge. Between edges the flip-flop is completely inert, no matter what $D$ does.

Worked through one sequence, with both devices starting at $Q = 0$:

| Interval | $CLK$ | What $D$ does | $Q$ (latch) | $Q$ (flip-flop) |
|---|:---:|---|:---:|:---:|
| 1 | low | settles at 1 well before the edge | 0 — closed | 0 — inert |
| **edge** | ↑ | $D = 1$ at the edge | opens | **captures 1** |
| 2 | high | $D$ goes $1 \to 0 \to 1$ | follows all three: 1, 0, 1 | **1** — does not move |
| **edge** | ↓ | $D = 1$ at the fall | closes, holding 1 | 1 |
| 3 | low | $D$ drops to 0 | 1 — held | 1 — inert |
| **edge** | ↑ | $D = 0$ at the edge | opens | **captures 0** |
| 4 | high | $D$ stays 0 | 0 | 0 |

Interval 2 is the payoff. The latch output toggles twice inside a single clock phase while the flip-flop output sits perfectly still — same input, same clock, different circuits.

This also gives the practical argument for edge triggering. A brief glitch on $D$ inside the high phase passes straight through a latch and can be captured; the flip-flop never sees it, because the capture latch was closed the whole time. Conversely, if the data only ever changes while the clock is low, the two devices produce identical outputs — a latch and a flip-flop are indistinguishable when the data is well behaved. It is the badly behaved cases that make the difference matter.

The one thing the flip-flop does still require is that $D$ be stable *around* the edge — settled for a short **setup** time before it and held for a short **hold** time after. That is the residue of the abstraction we made when we drew the edge as a vertical line, and it is where timing analysis begins.

## Verilog Model

A positive-edge D flip-flop is the most common construct in synchronous Verilog:

```verilog
module d_ff (
    input      CLK,
    input      D,
    output reg Q
);
    always @(posedge CLK) begin
        Q <= D;
    end
endmodule
```

Two details carry the meaning. The sensitivity list `@(posedge CLK)` is what makes this edge-triggered rather than level-sensitive — contrast it with the D latch's `@(*)`. And the **nonblocking assignment** `<=` schedules the update so that every flip-flop in the design samples its input before any of them updates its output, which is what lets a whole register bank change state at one edge without one flip-flop's new value racing into the next one's input. Use `<=` in clocked blocks as a habit; the reasoning behind it is covered with blocking versus nonblocking assignment.

Note also that no `else` is needed and no hold behavior is written. Unlike the latch, where holding had to be implied by an incomplete assignment, holding between edges is inherent in what `posedge` means.

The structural version builds the flip-flop from the D latch of the previous topic, exactly as the schematic does:

```verilog
module d_ff_two_latch (
    input  CLK,
    input  D,
    output Q
);
    wire Qc;

    d_latch capture (.D(D),  .EN(~CLK), .Q(Qc));   // open while CLK is low
    d_latch output_ (.D(Qc), .EN( CLK), .Q(Q));    // open while CLK is high
endmodule
```

Simulating the two side by side confirms they are the same device: over dozens of clock edges with $D$ changing at random between them, the two-latch build and the `posedge` model produce identical outputs, $Q$ never changes except at a rising edge, and multiple changes to $D$ inside one high phase leave $Q$ untouched — while a plain D latch on the same stimulus follows every one of them.

There is one instructive exception. If the simulation is set up so that $D$ changes at *exactly* the same instant as the clock edge, the two models can disagree. That is not a flaw in either description; it is a setup/hold violation expressed in simulation, and it is precisely the situation real timing constraints exist to prevent.

## Key Takeaways

- A **D flip-flop** is **edge-triggered**: $Q$ takes the value of $D$ at a clock edge and holds it for the entire clock period. A **D latch** is **level-sensitive**: it tracks $D$ for as long as its enable is high.
- It is built from **two D latches in series on opposite clock polarity** — a **capture latch** ($EN = \overline{CLK}$, transparent while the clock is low) feeding an **output latch** ($EN = CLK$, transparent while the clock is high).
- The two latches are **never transparent simultaneously**, so no path ever runs straight from $D$ to $Q$. That is what eliminates transparency.
- Characteristic equation: $Q^+ = D$ at each rising edge. The **triangle** on the clock input is the schematic notation for edge-triggering.
- **Analysis rule:** for the flip-flop, read $D$ just before each rising edge and hold that value for the whole period. For the latch, mirror $D$ while the clock is high and freeze at the falling edge.
- Given identical inputs the two devices produce **different outputs** whenever $D$ changes during the clock-high phase — and identical outputs when it does not.
- In Verilog: `always @(posedge CLK) Q <= D;` — `posedge` for edge sensitivity, nonblocking `<=` so a bank of flip-flops updates together.
- Older references call the two latches the *master* and the *slave*; the circuit is the same one described here.

## Review Questions

**1.** What is the fundamental difference between a D latch and a D flip-flop?

A) The latch stores one bit and the flip-flop stores two\
B) The latch is level-sensitive and tracks $D$ while its enable is high; the flip-flop is edge-triggered and samples $D$ only at a clock edge\
C) The flip-flop can store a 0 but the latch cannot\
D) The latch requires a clock and the flip-flop does not

**2.** In the two-latch build of a positive-edge-triggered D flip-flop, when is the **capture** latch transparent?

A) While the clock is high\
B) While the clock is low\
C) Only at the instant of the rising edge\
D) Always — it is a straight-through path

**3.** Why can no signal pass directly from $D$ to $Q$ in a single clock phase?

A) Because the inverter between the two latches blocks it\
B) Because the output latch has a longer propagation delay\
C) Because the two latches are enabled by opposite polarities of the clock, so one is always closed\
D) Because the flip-flop contains no feedback

**4.** A positive-edge D flip-flop has $Q = 0$. While the clock is high, $D$ changes $0 \to 1 \to 0 \to 1$. What is $Q$ at the end of that high phase?

A) 1\
B) 0\
C) It toggles with each change on $D$\
D) Undefined

**5.** A D latch (enable driven by the clock) and a positive-edge D flip-flop receive the same $D$ and clock. Under what condition do their outputs agree everywhere?

A) They can never agree, since one is a latch and the other a flip-flop\
B) When $D$ changes only while the clock is high\
C) When $D$ changes only while the clock is low, so nothing changes inside a transparent window\
D) Only when $D$ is held constant for the entire time

**6.** To determine the output of a positive-edge D flip-flop from a timing diagram, what do you read?

A) The value of $D$ at the midpoint of each high phase\
B) The value of $D$ just before each rising edge\
C) The average value of $D$ over each clock period\
D) The value of $D$ just after each falling edge

**7.** In the Verilog model below, what does the `posedge` keyword establish?

```verilog
always @(posedge CLK) Q <= D;
```

A) That `Q` is a wire rather than a register\
B) That the block re-evaluates whenever `CLK` or `D` changes\
C) That the block executes only on the rising transition of `CLK`, making the storage edge-triggered\
D) That `Q` is reset to 0 at the start of simulation

**8.** A narrow glitch appears on $D$ entirely within one clock-high phase. What happens?

A) Both a latch and a flip-flop capture it\
B) Neither device responds to it\
C) A latch passes it through to its output; the edge-triggered flip-flop never sees it, because its capture latch is closed during the high phase\
D) It forces the flip-flop into an undefined state

## Answers

**1. Answer: B) The latch is level-sensitive and tracks $D$ while its enable is high; the flip-flop is edge-triggered and samples $D$ only at a clock edge**

This is the entire distinction. A latch listens over an interval; a flip-flop samples at an instant. Everything else about the two devices — one data input, one stored bit, complementary outputs — is the same.

- *Two bits* (A) is wrong: the flip-flop contains two latches, but they hold the same bit at different points in the cycle, one value in total.
- *Cannot store 0* (C) is false for both devices.
- *Latch requires a clock* (D) reverses the situation. The latch needs only an enable, which may be any level signal; it is the flip-flop that is inherently clocked.

**2. Answer: B) While the clock is low**

The capture latch's enable is $\overline{CLK}$, so it is transparent during the low phase, tracking $D$ and arriving at the edge already holding the current value. At the rising edge it closes, freezing that value, and the output latch opens to pass it on.

- *While the clock is high* (A) describes the **output** latch.
- *Only at the rising edge* (C) confuses the device's behavior with its component's; the latch itself is level-sensitive, and it is the *pairing* that produces edge behavior.
- *Always transparent* (D) would defeat the entire design, restoring a straight path from $D$ to $Q$.

**3. Answer: C) Because the two latches are enabled by opposite polarities of the clock, so one is always closed**

The clock drives one enable directly and the other through an inverter, so at every moment exactly one latch is transparent and the other is closed. No clock phase exists in which both are open, so no path from $D$ to $Q$ ever exists.

- *The inverter blocks it* (A) misreads the inverter's role — it inverts the enable, not the data path.
- *Propagation delay* (B) would be a fragile, timing-dependent argument; the guarantee here is structural and holds regardless of gate speed.
- *No feedback* (D) is false: each latch contains a cross-coupled feedback loop, which is what stores the bit.

**4. Answer: B) 0**

The flip-flop samples only at the rising edge. All four of those changes happen after the edge, while the capture latch is closed, so none of them reaches $Q$. The output holds whatever was captured at the edge — which, since $Q$ was 0 going in, is 0.

- *1* (A) would be the answer for a latch, which would follow $D$ to its final value.
- *Toggles* (C) describes a T flip-flop responding to a clock, not a D flip-flop responding to data.
- *Undefined* (D) is wrong: this is entirely normal operation. The flip-flop ignoring mid-phase data is the feature, not a fault.

**5. Answer: C) When $D$ changes only while the clock is low, so nothing changes inside a transparent window**

If the data is stable throughout every clock-high phase, the latch has nothing new to follow while it is open, and it ends up holding the same value the flip-flop sampled at the edge. The two outputs then match everywhere. This is worth knowing: a latch and a flip-flop are indistinguishable when the data is well behaved, and it is the badly behaved cases that expose the difference.

- *Never agree* (A) is too strong — they agree whenever the data is disciplined.
- *Changes while the clock is high* (B) is exactly the condition that makes them **disagree**.
- *$D$ held constant forever* (D) would make them agree, but it is far stronger than necessary and would make the circuit useless.

**6. Answer: B) The value of $D$ just before each rising edge**

That value is what the capture latch has been tracking and is holding when the edge closes it, so it is the value handed to $Q$. It then stays on $Q$ for the whole clock period, until the next edge.

- *Midpoint of the high phase* (A) is after the sample; $D$ may well have changed by then, and the flip-flop is inert there.
- *Average value* (C) has no meaning for a digital signal.
- *Just after the falling edge* (D) is the rule for a **latch**, which closes on the falling edge.

**7. Answer: C) That the block executes only on the rising transition of `CLK`, making the storage edge-triggered**

`posedge` restricts the block to the $0 \to 1$ transition of the clock, which is precisely what distinguishes a flip-flop from a latch in Verilog. The D latch instead uses `@(*)` with an incomplete `if`.

- *`Q` is a wire* (A) is backwards — anything assigned in an `always` block must be declared `reg`.
- *Re-evaluates when `CLK` or `D` changes* (B) describes a level-sensitive list like `@(CLK or D)` or `@(*)`, which would produce a latch, not a flip-flop.
- *Reset at start of simulation* (D) is unrelated; reset behavior would require an explicit reset signal in the sensitivity list or the block body.

**8. Answer: C) A latch passes it through to its output; the edge-triggered flip-flop never sees it, because its capture latch is closed during the high phase**

This is the practical argument for edge triggering. A transparent latch propagates whatever arrives while it is open, glitches included, and can end up storing one. The flip-flop's capture latch is closed for the entire high phase, so a glitch confined to that phase cannot reach it.

- *Both capture it* (A) ignores the closed capture latch.
- *Neither responds* (B) ignores the latch's transparency.
- *Undefined state* (D) overstates the effect. A glitch is a data problem, not something that breaks the device — and a glitch near the clock edge is a setup/hold concern, which is a different issue from one sitting safely inside the high phase.
