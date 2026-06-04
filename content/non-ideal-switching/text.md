## Non-ideal Switching: When Transistors Aren't Perfect Switches

### Learning Objectives

By the end of this section, you should be able to:

- Model a CMOS inverter as a switched resistor network rather than a pair of ideal switches.
- Use a voltage divider to find the output of the inverter when the transistors have finite resistance.
- Explain why a "logic 0" output is not exactly 0 V and why a small leakage current flows even when a gate is idle.
- Distinguish the ideal, typical, and degraded operating cases and describe what happens to the output voltage and power in each.
- Connect weak switching to noise margins and to the static power that motivates later power-saving techniques.

---

## Revisiting the Perfect-Switch Model

In an earlier section we modeled the CMOS inverter using two complementary transistors — a PMOS pull-up and an NMOS pull-down — and treated each one as a **perfect switch**. A closed switch was a wire with zero resistance, and an open switch was an infinite resistance that blocked all current. That abstraction is exactly the right place to start: it makes the inverter's logic behavior obvious and lets us reason about gates without any circuit theory.

But like every model, it is a simplification. Real transistors are not perfect switches. A conducting transistor still has *some* resistance, and a transistor that is "off" does not have *infinite* resistance — a little current always sneaks through. To understand why digital circuits consume power even when nothing is changing, and why a signal can degrade when inputs are sloppy, we need to layer a bit more reality into the model.

The trick, as engineers often do, is to **replace each ideal switch with a resistor whose value depends on the input**. This is still an idealization — real transistors are far more complicated — but it captures the effects we care about.

---

## Modeling the Inverter as a Resistor Network

Picture the inverter as a single series loop driven by the supply voltage $V_{DD}$. At the top sits $R_P$, the resistance of the PMOS (pull-up) transistor. At the bottom sits $R_N$, the resistance of the NMOS (pull-down) transistor. The output $Y$ is the node *between* them.

```
        V_DD
         │
       [ R_P ]   ← PMOS (pull-up)
         │
         ├──── Y (output)
         │
       [ R_N ]   ← NMOS (pull-down)
         │
        GND
```

The input $A$ acts as a control that sets the two resistances to opposite states. When one transistor is "on" (low resistance), the other is "off" (high resistance). Because the output sits between two resistors in series, we can find its voltage with a **voltage divider**:

$$V_Y = V_{DD} \cdot \frac{R_N}{R_P + R_N}$$

This single equation will carry us through every case below. All that changes from one situation to the next is the pair of resistance values.

---

## The Ideal Case

In the ideal model, a closed switch is $0\ \Omega$ (a perfect wire) and an open switch is infinite. Substituting those extremes into the divider reproduces exactly the inverter behavior we already know.

| Input $A$ | PMOS $R_P$ | NMOS $R_N$ | Output $Y$ |
|-----------|------------|------------|------------|
| 0 (low)   | $0\ \Omega$ (on) | $\infty$ (off) | $V_{DD}$ (high) |
| 1 (high)  | $\infty$ (off) | $0\ \Omega$ (on) | $0$ V (low) |

When $A$ is low, the pull-up is a wire and the pull-down is an open circuit, so the output is tied to $V_{DD}$. When $A$ is high, the roles flip: $R_P$ becomes infinite and $R_N$ becomes zero, forcing the output to $0$ V. The two transistors are simply the switches that implement this inversion, and in the ideal case **no current flows at all** — there is never a complete path from $V_{DD}$ to ground.

---

## Real Transistors Have Finite Resistance

Now remove the idealization. A real "on" transistor has a small but nonzero resistance, and a real "off" transistor has a large but finite one. Reasonable round numbers are:

- **On resistance:** about $1\ \text{k}\Omega$
- **Off resistance:** about $1\ \text{G}\Omega$ (a billion ohms)

A kilohm is a real resistance, but next to a gigohm it is negligible — that nine-orders-of-magnitude gap is what makes the inverter still behave like an inverter. Consider $A$ high, so the NMOS is on ($R_N \approx 1\ \text{k}\Omega$) and the PMOS is off ($R_P \approx 1\ \text{G}\Omega$). The divider gives:

$$V_Y = 5\ \text{V} \cdot \frac{1\ \text{k}\Omega}{1\ \text{G}\Omega + 1\ \text{k}\Omega} \approx 5\ \mu\text{V}$$

That is about **five microvolts** — essentially zero, comfortably read as a logic 0, but *not exactly* zero. The mirror situation ($A$ low, PMOS on) puts almost the entire supply across the output and yields very close to $5$ V. So the logic still works, but the rails are approached, not reached.

---

## Leakage Current and Static Power

Because the off resistance is finite, the loop is never truly broken — a tiny **leakage current** flows from $V_{DD}$ to ground even when the gate is just holding a value:

$$I = \frac{V_{DD}}{R_P + R_N} \approx \frac{5\ \text{V}}{1\ \text{G}\Omega} = 5\ \text{nA}$$

That current, drawn straight from the supply, dissipates **static power** $P = V_{DD} \cdot I$. For one inverter the number is minuscule. But a modern chip contains *billions* of transistors, and a few nanowatts each adds up to a budget you cannot ignore. This is precisely why static (leakage) power became a first-class design concern, and it is the motivation behind techniques like **power gating** — selectively cutting the supply to idle blocks of a circuit — that we will return to later in the course.

The takeaway: in the ideal model, an idle gate is free. In reality, an idle gate still costs you a trickle of power, multiplied across the whole chip.

---

## The Degraded Case: Weak Switching

So far the inputs have been clean — solidly high or solidly low. What happens if an input drifts toward the middle, dropping out of the safe **noise-margin** range a gate expects? Then a transistor that *should* be fully off doesn't turn off all the way. Its channel resistance, instead of climbing toward a gigohm, stays much lower — closer to its on-resistance.

Now the voltage divider has two comparable resistances instead of a billion-to-one ratio, and the consequences are bad on both ends:

| Operating case | Off-transistor $R$ | Output (nominal 0/5 V) | Current | Static power |
|----------------|--------------------|------------------------|---------|--------------|
| Ideal          | $\infty$           | exactly $0$ / $5$ V    | none    | none |
| Typical        | $\sim 1\ \text{G}\Omega$ | $\approx 5\ \mu\text{V}$ / $\approx 5$ V | $\sim$ nA | tiny |
| Degraded       | not much above $1\ \text{k}\Omega$ | $\sim 0.5$ V / $4.5$ V | large | large |

When the off device leaks badly, the output no longer reaches the rail — a "high" might sag to $4.5$ V and a "low" might float up to around $0.5$ V. Worse, because the total loop resistance has collapsed, the current **rises sharply**, and since $P = V_{DD} \cdot I$, the power consumption climbs right along with it. Weak switching therefore hurts you twice: the logic levels degrade *and* the circuit burns far more power.

---

## Why This Model Matters

The switched-resistor network is not a perfect picture of a transistor — real devices are governed by more complex physics than two resistors can capture. But it is a decisive improvement over the perfect-switch model, because it explains things the ideal model simply cannot: why a logic 0 is microvolts rather than exactly zero, why idle circuits still draw power, and why clean, in-spec inputs matter for both correctness and efficiency. Adding one well-chosen parameter — finite resistance — turns a purely logical abstraction into one that also predicts real-world behavior.

---

## Key Takeaways

Modeling a CMOS inverter as a series voltage divider of two input-controlled resistances ($R_P$ on top, $R_N$ on the bottom) reproduces ideal inverter logic when the values are $0$ and $\infty$, but becomes far more realistic when we use finite values of roughly $1\ \text{k}\Omega$ when on and $1\ \text{G}\Omega$ when off. With finite off-resistance the output never quite reaches the rail (a logic 0 is about $5\ \mu\text{V}$), and a small leakage current flows continuously, producing a static power that is negligible for one gate but significant across billions. If an input drifts past the noise margin so a transistor cannot fully turn off, the divider pulls the output away from the rail and the current — and therefore the power — spikes. The single equation $V_Y = V_{DD}\,R_N/(R_P + R_N)$ ties all of these cases together.

---

## Review Questions

**1. In the resistor-network model of a CMOS inverter, what does the input $A$ actually control?**

- A) The supply voltage $V_{DD}$
- B) The values of the two resistances $R_P$ and $R_N$
- C) The position of the output node in the circuit
- D) Whether the circuit is a voltage divider or not

**2. With the NMOS on at $1\ \text{k}\Omega$ and the PMOS off at $1\ \text{G}\Omega$ and $V_{DD} = 5\ \text{V}$, the output is closest to:**

- A) Exactly $0$ V
- B) About $5\ \mu\text{V}$
- C) About $2.5$ V
- D) About $5$ V

**3. Why does a CMOS gate draw a small static (leakage) current even when its input is not changing?**

- A) The clock keeps toggling the transistors
- B) The "off" transistor has a finite, not infinite, resistance, so a complete path from $V_{DD}$ to ground always exists
- C) Capacitors in the gate slowly discharge to the output
- D) The voltage divider stores charge that must be refreshed

**4. Why does per-gate leakage power, though tiny, become an important design concern?**

- A) It causes the logic output to invert unexpectedly
- B) A modern chip has billions of transistors, so a few nanowatts each adds up
- C) It only matters when the gate is switching at high frequency
- D) It violates the truth table of the gate

**5. An input drifts below its noise margin, so the NMOS that should be off only reaches a resistance near its on-value. Compared to normal operation, the output and power will:**

- A) Stay at the rail with no change in power
- B) Move away from the rail, while current and power rise sharply
- C) Move away from the rail, while power drops to zero
- D) Stay correct, but the gate will switch faster

**6. What is the main advantage of the switched-resistor model over the perfect-switch model?**

- A) It is simpler and requires no equations
- B) It predicts real effects like non-ideal output levels and leakage power that the ideal model cannot
- C) It exactly captures all transistor physics
- D) It eliminates static power entirely

---

## Answer Explanations

**1. Answer: B) The values of the two resistances $R_P$ and $R_N$**

In this model the transistors are resistors whose values depend on the input. Driving $A$ sets one resistance low (on) and the other high (off), which is what produces the inversion.

- *Supply voltage* (A) is fixed at $V_{DD}$; the input does not change it.
- *Output node position* (C) is structural and does not move.
- *Whether it is a divider* (D) — it is always a series voltage divider, regardless of the input.

**2. Answer: B) About $5\ \mu\text{V}$**

Using $V_Y = V_{DD}\,R_N/(R_P + R_N) = 5 \cdot \frac{1\text{k}}{1\text{G} + 1\text{k}} \approx 5\ \mu\text{V}$. The output is essentially — but not exactly — zero.

- *Exactly 0 V* (A) would require an infinite off-resistance (the ideal case).
- *2.5 V* (C) would require roughly equal resistances, which is the degraded case.
- *5 V* (D) is the opposite state, with the PMOS on instead.

**3. Answer: B) The "off" transistor has a finite, not infinite, resistance, so a complete path from $V_{DD}$ to ground always exists**

Because no real transistor reaches infinite resistance, the series loop is never fully broken, and a small leakage current flows continuously.

- *Clock toggling* (A) describes dynamic, not static, power.
- *Capacitor discharge* (C) and *refresh* (D) describe charge-storage effects, not the steady leakage path through finite resistance.

**4. Answer: B) A modern chip has billions of transistors, so a few nanowatts each adds up**

Static power per gate is negligible, but multiplied across an entire chip it becomes a real portion of the power budget — which is why power gating exists.

- *Inverting the output* (A) is false; leakage degrades power, not logic.
- *Only at high frequency* (C) describes dynamic power; leakage is present even when idle.
- *Violates the truth table* (D) is incorrect; the logic still functions.

**5. Answer: B) Move away from the rail, while current and power rise sharply**

If the off-device resistance collapses toward its on-value, the divider no longer pushes the output to the rail (e.g. $0.5$ V instead of $0$, or $4.5$ V instead of $5$), and the smaller total resistance lets much more current flow, so $P = V_{DD} \cdot I$ rises.

- *No change* (A) ignores the broken resistance ratio.
- *Power drops to zero* (C) is backwards — more current means more power.
- *Switches faster* (D) is unrelated; weak switching degrades, not speeds, the gate.

**6. Answer: B) It predicts real effects like non-ideal output levels and leakage power that the ideal model cannot**

Adding finite resistance lets the model explain microvolt-level logic 0s, continuous leakage current, and degraded switching — behaviors the perfect-switch model is blind to.

- *Simpler/no equations* (A) is the perfect-switch model's appeal, not this one's.
- *Exactly captures all physics* (C) overstates it — real transistors are more complex than two resistors.
- *Eliminates static power* (D) is the reverse of what the model shows.
