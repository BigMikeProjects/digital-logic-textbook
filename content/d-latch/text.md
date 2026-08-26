The S-R latch and the S'-R' latch can both store a bit, but neither is comfortable to use. They have two control inputs, they ask you to think in terms of *set* and *reset* rather than *data*, and they have a combination you are forbidden to apply. The D latch fixes all three problems at once with a small amount of gating in front of a latch you have already built. The result is a memory element with one data input, one control input, and one job: **store the value on $D$.**

## The Symbol

A D latch is drawn as a block with two inputs and one or two outputs. The **data** input $D$ carries the value to be stored. The **enable** input $EN$ decides whether the latch is currently paying attention to $D$. The **memory output** $Q$ is the stored bit, and $\overline{Q}$ is usually brought out alongside it.

Everything interesting about the device is in that second input. $D$ says *what* to store; $EN$ says *when*.

## Building It: An S'-R' Latch With Gated Inputs

Recall the S'-R' latch from the previous topic: two cross-coupled NAND gates with **active-low** inputs. Driving $S'$ to 0 sets the latch ($Q = 1$); driving $R'$ to 0 resets it ($Q = 0$); holding both at 1 leaves the feedback loop to sustain whatever is stored.

$$Q = \overline{S' \cdot \overline{Q}} \qquad \overline{Q} = \overline{R' \cdot Q}$$

That core is left completely untouched. The D latch simply generates $S'$ and $R'$ from $D$ and $EN$ using two front NAND gates and one inverter:

$$S' = \overline{D \cdot EN} \qquad R' = \overline{\overline{D} \cdot EN}$$

The data line feeds the top front gate directly, and the **inverse** of the data line — $D$ through an inverter — feeds the bottom one. The enable line feeds both.

Reading the front gates one input combination at a time:

| $EN$ | $D$ | $S'$ | $R'$ | What the latch core sees |
|:---:|:---:|:---:|:---:|---|
| 0 | 0 | 1 | 1 | **Hold** — neither input asserted, the latch is closed |
| 0 | 1 | 1 | 1 | **Hold** |
| 1 | 0 | 1 | 0 | **Reset** → $Q = 0$ |
| 1 | 1 | 0 | 1 | **Set** → $Q = 1$ |

When $EN = 0$, both front gates have a 0 on one input, so both outputs are forced to 1 no matter what $D$ does. $S' = R' = 1$ is the S'-R' latch's resting state, so the stored bit sits in the feedback loop, untouched. The enable line is a gate in the plain-English sense: closed, nothing gets in.

## Storing a 1

Set $D = 1$ and then assert $EN = 1$. Both inputs of the top front gate are now 1. The AND function produces a 1, the output bubble inverts it, and $S'$ drops to **0**. That is exactly the active-low set condition for the S'-R' core, so $Q$ goes to 1. Meanwhile $\overline{D} = 0$ holds the bottom gate's output at $R' = 1$, the inactive level, so the reset side stays quiet.

Now remove the enable, and then remove the data as well. Both front gates go back to $S' = R' = 1$, and the cross-coupled loop holds $Q = 1$ on its own. **The 1 has been latched.** The data line can do whatever it likes; with the enable off, nothing reaches the core.

## Storing a 0

Set $D = 0$ and assert $EN = 1$. This time it is the *bottom* front gate that fires: $\overline{D} = 1$ and $EN = 1$, so the AND produces a 1, the bubble inverts it, and $R'$ drops to **0**. That asserts the reset side of the core, which forces $\overline{Q} = 1$; the feedback path then holds $Q$ at 0. The top gate sits at $S' = 1$ throughout.

Drop the enable and the 0 stays stored. As before, $D$ can change freely while $EN = 0$ without disturbing the latch.

## The Forbidden State Is Gone

Look again at the front-gate table and notice what is missing: there is no row with $S' = R' = 0$. That was the forbidden combination of the S'-R' latch, the one that broke the complement between $Q$ and $\overline{Q}$ and raced to an unpredictable state on release.

It is now unreachable *by construction*. Both front gates are driven by the same enable, and their data inputs are $D$ and $\overline{D}$ — always opposites. When $EN = 0$ both outputs are 1; when $EN = 1$ exactly one of $D$ and $\overline{D}$ is 1, so exactly one front gate can pull its output low. There is no input the outside world can apply that drives $S'$ and $R'$ low together. $Q$ and $\overline{Q}$ are genuine complements in every reachable state.

This is the payoff for spending an inverter and two gates: a memory element that cannot be misused.

## Transparent vs. Latched

The gate-level walkthrough explains *how* the D latch works. The more useful way to think about it in practice is as a device with two behaviors, selected by the enable line.

**$EN = 1$ — transparent.** The front half of the circuit is active and the output *follows the input*. Set $D = 1$ and $Q$ becomes 1. Drop $D$ to 0 and $Q$ becomes 0. As long as the enable is asserted, data flows straight through to the output, as many times as $D$ changes. In this state the latch behaves like a piece of wire from $D$ to $Q$.

**$EN = 0$ — latched (or opaque).** The stored value is locked. $Q$ freezes at whatever $D$ was at the instant the enable fell, and it will not move for as long as the enable stays low, regardless of what happens on the data line.

The complete behavior fits in three rows:

| $EN$ | $D$ | $Q^+$ | Mode |
|:---:|:---:|:---:|---|
| 0 | X | $Q$ | **Latched** — $Q$ holds, $D$ is ignored |
| 1 | 0 | 0 | **Transparent** — $Q$ follows $D$ |
| 1 | 1 | 1 | **Transparent** — $Q$ follows $D$ |

Here $Q^+$ means the *next* value of $Q$ — the value the output settles to after the inputs have had time to propagate. The whole table collapses into one **characteristic equation**:

$$Q^+ = D \cdot EN + Q \cdot \overline{EN}$$

Read it directly: when $EN = 1$ the next state is $D$; when $EN = 0$ the next state is the current state. Storage and transparency in a single expression.

## Level-Sensitive Behavior and the Timing Diagram

The most important consequence of that equation is that the enable defines a **window**, not an instant. The D latch is **level-sensitive**: it listens for the entire time $EN$ is high, not at one particular moment. Everything that happens on $D$ inside the window reaches $Q$.

This is exactly what a timing diagram is for. Draw $EN$, $D$, and $Q$ as square waveforms on a shared time axis with time marching left to right, and the whole story fits on one page. Reading it comes down to three rules:

1. **While $EN$ is high, $Q$ is a copy of $D$.** Every change on the data line appears on the output, delayed only by gate propagation.
2. **At the falling edge of $EN$, look at what $D$ was doing just before the edge.** That value is captured and held.
3. **While $EN$ is low, $Q$ is flat.** The data line can move as much as it likes; the output does not respond.

Worked through a short sequence, with $Q$ starting at 0:

| Interval | $EN$ | What $D$ does | $Q$ |
|---|:---:|---|---|
| 1 | 0 | $D = 0$, steady | 0 — closed |
| 2 | 1 | $D$ goes $0 \to 1 \to 0 \to 1$ | follows every change: $0 \to 1 \to 0 \to 1$ |
| 3 | 0 | $D$ falls to 0 shortly after the edge | **1** — captured at the falling edge, held |
| 4 | 0 | $D$ wiggles $0 \to 1 \to 0$ | still 1 — no response |
| 5 | 1 | $D = 0$ | 0 — the window reopens and $Q$ re-acquires $D$ |

Interval 3 is the one worth staring at. The stored bit is whatever $D$ happened to be at the closing edge, and it is only well defined if $D$ is stable around that edge — the **setup and hold** window, which we return to when timing constraints are covered properly.

Being able to produce the $Q$ trace given the $EN$ and $D$ traces is a standard exam problem and a genuinely useful skill: it is how you check by hand that a circuit stores what you intended.

Intervals 2 and 4 together are also the reason the D latch is not the end of the story. Because the latch captures *everything* that happens during the enable window rather than one defined value, the bit that ends up stored depends on the last thing $D$ did before the enable fell. In a large synchronous system that is difficult to reason about. The fix is to narrow the window until it is effectively an instant — to trigger on a clock **edge** instead of a level — which is what the D flip-flop does by putting two of these latches in series, a capture latch feeding an output latch, enabled on opposite levels of the clock. That is the next topic.

## Verilog Model

A D latch is described behaviorally with a level-sensitive `always` block:

```verilog
module d_latch (
    input      D,
    input      EN,
    output reg Q
);
    always @(*) begin
        if (EN)
            Q = D;
    end
endmodule
```

The sensitivity list `@(*)` means the block re-evaluates whenever any input changes, which is what level-sensitive requires. The key detail is the **missing `else`**: when $EN$ is 0, the block assigns nothing, so `Q` must retain its previous value. That incomplete assignment is precisely what tells the synthesizer to infer a latch.

This is worth remembering in both directions. Here it is deliberate — a latch is exactly what we want. In *combinational* logic it is the classic bug: an `always` block with an `if` that does not cover every case, or a `case` statement missing a `default`, silently produces a latch where you intended a gate network. The defensive habit is to assign every output a default value at the top of a combinational block, so no path can fall through.

The structural version maps one-for-one onto the schematic:

```verilog
module d_latch_gates (
    input  D,
    input  EN,
    output Q,
    output Qn
);
    wire Dn, Sn, Rn;

    not  u0 (Dn, D);          // D'
    nand u1 (Sn, D,  EN);     // S' = (D  · EN)'
    nand u2 (Rn, Dn, EN);     // R' = (D' · EN)'
    nand u3 (Q,  Sn, Qn);     // cross-coupled S'-R' core
    nand u4 (Qn, Rn, Q);
endmodule
```

Simulating the two side by side confirms they agree: $Q$ follows $D$ while $EN = 1$, holds when $EN$ falls, ignores $D$ entirely while $EN = 0$, and re-acquires $D$ when the enable returns — with $Q$ and $\overline{Q}$ complementary throughout.

## Key Takeaways

- A **D latch** is an S'-R' latch whose two inputs are generated from a single data line: $S' = \overline{D \cdot EN}$ and $R' = \overline{\overline{D} \cdot EN}$.
- Because $R'$ is driven by $\overline{D}$, the two core inputs can never be asserted together — the **forbidden state is unreachable by construction**, and $Q$ and $\overline{Q}$ are always true complements.
- The enable line selects between two behaviors: **transparent** when $EN = 1$ ($Q$ follows $D$) and **latched** when $EN = 0$ ($Q$ holds).
- The characteristic equation is $Q^+ = D \cdot EN + Q \cdot \overline{EN}$.
- The D latch is **level-sensitive** — it listens for the whole time the enable is high, so everything that happens on $D$ inside that window reaches $Q$. The value that ends up stored is whatever $D$ was at the **falling edge** of the enable.
- In Verilog, a latch is inferred by an `always @(*)` block that does not assign the output on every path. Intentional here; a common bug in combinational logic.

## Review Questions

**1.** In the standard D latch build, what drives the $R'$ input of the S'-R' core?

A) $D$ ANDed with $EN$, inverted\
B) $\overline{D}$ NANDed with $EN$\
C) $EN$ alone, through an inverter\
D) The $Q$ output fed back through a NAND gate

**2.** With $EN = 0$, what are the values of $S'$ and $R'$?

A) $S' = 0$, $R' = 0$\
B) $S' = 0$, $R' = 1$\
C) $S' = 1$, $R' = 1$\
D) They depend on $D$

**3.** Why can a D latch never enter the forbidden state of the S'-R' latch?

A) The enable input is checked by additional error-detection logic\
B) The front gates are driven by $D$ and $\overline{D}$, so $S'$ and $R'$ can never both be asserted\
C) The NAND gates in the core are replaced by NOR gates\
D) The forbidden state is avoided only if the designer never asserts $EN$ and $D$ together

**4.** A D latch has $Q = 1$. The enable is then held at 0 while $D$ changes $1 \to 0 \to 1 \to 0$. What is $Q$ at the end of that sequence?

A) 0\
B) 1\
C) It toggles with each change on $D$\
D) Undefined

**5.** During a single enable window, $D$ changes several times before $EN$ falls. What value does the latch store?

A) The first value $D$ took inside the window\
B) The value $D$ held at the moment $EN$ rose\
C) The value $D$ held just before $EN$ fell\
D) The logical OR of every value $D$ took inside the window

**6.** What does the characteristic equation $Q^+ = D \cdot EN + Q \cdot \overline{EN}$ describe?

A) That $Q$ is the AND of the data and enable inputs\
B) That the next output is $D$ when the latch is transparent, and the current output when it is latched\
C) That the latch responds only to the rising edge of $EN$\
D) That $Q$ and $\overline{Q}$ are complementary

**7.** In the Verilog model below, why does the synthesizer infer a latch?

```verilog
always @(*) begin
    if (EN)
        Q = D;
end
```

A) Because the sensitivity list uses `@(*)`\
B) Because `Q` is declared as `reg`\
C) Because `Q` is not assigned when `EN` is 0, so it must hold its previous value\
D) Because blocking assignment is used instead of nonblocking

**8.** Why is a level-sensitive latch awkward as the storage element in a large synchronous system?

A) It cannot store a 0, only a 1\
B) It requires two enable inputs\
C) It consumes more gates than an S-R latch\
D) It accepts data for the entire time the enable is high, so the stored bit depends on the last change to $D$ before the enable falls

## Answers

**1. Answer: B) $\overline{D}$ NANDed with $EN$**

$R' = \overline{\overline{D} \cdot EN}$. The data line passes through an inverter before reaching the bottom front gate, which is what makes $S'$ and $R'$ complementary while the enable is asserted.

- *$D$ ANDed with $EN$, inverted* (A) is $S'$, the set side, not $R'$.
- *$EN$ alone through an inverter* (C) would make the reset side independent of the data, which defeats the entire purpose of the gating.
- *$Q$ fed back through a NAND* (D) describes the cross-coupled core's internal feedback, not the front-end gating.

**2. Answer: C) $S' = 1$, $R' = 1$**

A NAND gate with any input at 0 outputs 1. With $EN = 0$, both front gates have a 0 on the enable input, so both outputs are forced to 1 regardless of $D$. That is the S'-R' latch's resting/hold state, so the feedback loop keeps the stored bit.

- *$S' = R' = 0$* (A) is the forbidden combination, which this circuit cannot produce at all.
- *$S' = 0$, $R' = 1$* (B) is the set condition, which requires $EN = 1$ and $D = 1$.
- *Depends on $D$* (D) is wrong precisely because the enable gates both front gates — with $EN = 0$, $D$ has no influence.

**3. Answer: B) The front gates are driven by $D$ and $\overline{D}$, so $S'$ and $R'$ can never both be asserted**

Driving $S'$ and $R'$ low together requires both front gates to see 1 on both inputs at once, which requires $D = 1$ and $\overline{D} = 1$ simultaneously. That is impossible. The forbidden state is eliminated structurally, not by convention.

- *Error-detection logic* (A) is not present; nothing checks the inputs at runtime.
- *NOR gates in the core* (C) describes the S-R latch, and swapping the gate type would not remove the forbidden combination anyway.
- *Designer discipline* (D) describes how the raw S'-R' latch avoids the problem. The point of the D latch is that no discipline is needed.

**4. Answer: B) 1**

With $EN = 0$ the latch is closed: both front gates output 1, the core sees its hold condition, and the feedback loop sustains $Q = 1$. Changes on $D$ cannot reach the core at all.

- *0* (A) would assume the latch tracks the final value of $D$, which only happens while the enable is high.
- *Toggles* (C) describes a T flip-flop, not a D latch.
- *Undefined* (D) would be the case only if the latch had been driven into the forbidden state, which cannot happen here.

**5. Answer: C) The value $D$ held just before $EN$ fell**

The latch is transparent for the entire window, so $Q$ tracks each change as it happens. What persists afterward is simply whatever the output happened to be when the window closed — the value of $D$ at the falling edge of $EN$.

- *First value* (A) and *value at the rising edge* (B) would describe an edge-triggered device that samples when the window opens; a latch keeps updating after that.
- *Logical OR* (D) has no basis — the latch tracks the data, it does not accumulate it.

**6. Answer: B) That the next output is $D$ when the latch is transparent, and the current output when it is latched**

The two product terms are mutually exclusive. When $EN = 1$ the equation reduces to $Q^+ = D$ (transparent); when $EN = 0$ it reduces to $Q^+ = Q$ (latched). It is the entire behavior table in one expression.

- *AND of data and enable* (A) ignores the $Q \cdot \overline{EN}$ term, which is the memory.
- *Rising edge of $EN$* (C) describes an edge-triggered flip-flop; the equation has no notion of an edge, only of levels.
- *Complementary outputs* (D) is a true statement about the D latch, but it is not what this equation says.

**7. Answer: C) `Q` is not assigned when `EN` is 0, so it must hold its previous value**

Hardware must do *something* on every input combination. Since the code specifies no new value for `Q` when `EN` is 0, the only consistent implementation is one that remembers the old value — a latch. Here that is intentional; in a combinational block it is the classic accidental-latch bug, avoided by assigning defaults at the top of the block or covering every branch.

- *`@(*)`* (A) is a level-sensitive sensitivity list, used for both combinational logic and latches; on its own it implies nothing.
- *`reg` declaration* (B) is a Verilog syntax requirement for anything assigned in an `always` block. Plenty of `reg` signals synthesize to pure combinational logic.
- *Blocking assignment* (D) affects simulation ordering within a block, not whether storage is inferred.

**8. Answer: D) It accepts data for the entire time the enable is high, so the stored bit depends on the last change to $D$ before the enable falls**

Level-sensitivity means the storage element is open for a whole interval rather than capturing one well-defined value. That makes the stored result depend on the detailed timing of the data within the window. Narrowing that window to a clock edge is the motivation for the D flip-flop.

- *Cannot store a 0* (A) is false; $D = 0$ with $EN = 1$ asserts $R'$ and stores a 0.
- *Two enable inputs* (B) is false; the D latch has exactly one.
- *Gate count* (C) is true in the narrow sense that the D latch adds three gates, but that is not what makes it awkward — the timing behavior is.
