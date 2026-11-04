Most of this course works above the electrical level: a gate is a 0 or a 1, and the question is which. But every one of those gates draws power from a supply, and a modern chip holds billions of them, so it is worth knowing where the power goes. It falls into two categories. **Dynamic power** is the cost of *changing* an output. **Static power** is the cost of *holding* one. Each has a simple formula, and each formula points at the design choices that make a chip run cooler or a battery last longer.

$$P = P_{\mathrm{dynamic}} + P_{\mathrm{static}}, \qquad P_{\mathrm{dynamic}} = \alpha\, C\, V_{\mathrm{DD}}^2\, f, \qquad P_{\mathrm{static}} = N\, I_{\mathrm{leak}}\, V_{\mathrm{DD}}$$

## The Quantities in the Formulas

Before using the formulas, here is what each letter means.

- **$C$, the load capacitance.** Everything a gate's output has to charge: the inputs of the gates it drives, plus the wire between them. Every connection adds a little capacitance. When an output fans out to several gates, their inputs sit in parallel, and parallel capacitance adds, so $C$ grows with fan-out. A few femtofarads per gate is typical.
- **$\alpha$, the activity factor.** The fraction of clock cycles in which an output goes from 0 to 1. A clock net rises every cycle, so it has $\alpha = 1$. A typical logic node changes much less often; $\alpha = 0.1$ means a 0→1 in one cycle out of ten.
- **$f$ and $V_{\mathrm{DD}}$.** The clock frequency and the supply voltage.
- **$I_{\mathrm{leak}}$, the leakage current.** A real transistor that is off still conducts a tiny current, as Non-ideal Switching showed: its off resistance is large but not infinite. $I_{\mathrm{leak}}$ is that current for one idle gate, a few nanoamps.
- **$N$.** The number of gates in the block.

The energies and capacitances of one gate are tiny, so they are written with the prefix **femto**: $1\ \text{fF} = 10^{-15}\ \text{F}$ (a femtofarad) and $1\ \text{fJ} = 10^{-15}\ \text{J}$ (a femtojoule).

## Charging the Load

Take the CMOS inverter from Transistors to Gates and hang its load on the output as a capacitor $C$ to ground. Use $C = 10$ fF and a supply of $V_{\mathrm{DD}} = 1.0$ V.

When the input falls and the output rises from 0 to 1, the PMOS turns on and current flows from the supply into the capacitor until it is charged to $V_{\mathrm{DD}}$. That takes energy from the supply:

$$E_{\mathrm{supply}} = C\, V_{\mathrm{DD}}^2 = (10\ \text{fF})(1.0\ \text{V})^2 = 10\ \text{fJ}$$

Half of it, 5 fJ, ends up **stored** on the capacitor. The other half, 5 fJ, becomes **heat** in the PMOS on the way in.

When the output falls from 1 to 0, the NMOS turns on and the capacitor discharges to ground. The stored 5 fJ becomes heat in the NMOS. The supply delivers **nothing** on this edge: the heat of the falling edge was paid for in advance, when the capacitor was charged. So a full 0→1→0 cycle takes 10 fJ from the supply and turns all of it into heat.

## Dynamic Power Is an Average

Plot the power the supply delivers, $p(t) = V_{\mathrm{DD}} \cdot i(t)$, over a few clock cycles. It is zero almost everywhere. Each 0→1 makes one brief spike, and the area under the spike is the energy of that edge, $C V_{\mathrm{DD}}^2 = 10$ fJ. A 1→0 makes no spike at all.

Zoom out over many cycles and the graph is a row of spikes, one for each 0→1. **Dynamic power is the average of that graph.** The average is the energy of one spike times the number of spikes per second:

$$P_{\mathrm{dynamic}} = \underbrace{C\, V_{\mathrm{DD}}^2}_{\text{energy of one spike}} \times \underbrace{\alpha\, f}_{\text{spikes per second}} = \alpha\, C\, V_{\mathrm{DD}}^2\, f$$

With $\alpha = 0.1$ and $f = 1$ GHz, the output rises $10^8$ times a second, so one gate averages

$$P_{\mathrm{dynamic}} = 10\ \text{fJ} \times 10^8\ \text{s}^{-1} = 1\ \mu\text{W}$$

The spikes themselves peak near a milliwatt, a thousand times higher. That is the point of the word *average*: the formula is not the instantaneous power, it is what the supply delivers on average over a long time.

The supply appears **squared**. The same gate on the old 5 V supply would take $25$ times the energy per spike, 250 fJ, and average 25 µW.

## Holding Still: Static Power

Now let the inputs sit still. Nothing switches, so there are no spikes. But in each gate one transistor is off, and an off transistor still leaks a little current from the supply to ground. With $I_{\mathrm{leak}} = 5$ nA per gate:

$$P_{\mathrm{static}} = I_{\mathrm{leak}}\, V_{\mathrm{DD}} = (5\ \text{nA})(1.0\ \text{V}) = 5\ \text{nW per gate}$$

For one gate, that rounds to zero. That is why CMOS is often said to have no static power. But static power is drawn by **every** gate, **whether or not it is doing anything**, so it multiplies with the gate count:

$$P_{\mathrm{static}} = N\, I_{\mathrm{leak}}\, V_{\mathrm{DD}}$$

A million idle gates leak 5 mW. A design with billions of transistors cannot ignore it. Static power is what drains a phone's battery while it sits in a pocket doing nothing.

The leakage current used here is a single number per gate, the way designers quote it. Real leakage depends strongly on temperature and on the transistor's design, but the resistor picture is enough for this course.

## The Balance Between the Two

Put the two terms together for a block of $N = 10^6$ gates, each with $C = 10$ fF and $I_{\mathrm{leak}} = 5$ nA, running a busy workload ($\alpha = 0.1$) at $f = 1$ GHz on a modern 1.0 V core supply:

$$P_{\mathrm{dynamic}} = (0.1)(10^6)(10\ \text{fF})(1.0\ \text{V})^2(1\ \text{GHz}) = 1\ \text{W}$$

$$P_{\mathrm{static}} = (10^6)(5\ \text{nA})(1.0\ \text{V}) = 5\ \text{mW}$$

At these settings static power is only **0.5 %** of the total. Dynamic power dominates, and it is the term designers worry about first.

A word on the supply. The examples in this course have used 5 V, the traditional value. Core logic in a modern chip runs at roughly 0.7 to 1.0 V; 1.8 to 3.3 V is used for the I/O pins; 5 V is legacy.

The balance shifts with the operating conditions. The table changes one or two quantities at a time from those defaults.

| Case | Change | $P_{\mathrm{dynamic}}$ | $P_{\mathrm{static}}$ | Static share |
|---|---|:-:|:-:|:-:|
| Defaults | 1.0 V, 1 GHz, $\alpha = 0.1$, 5 nA | 1000 mW | 5 mW | 0.5 % |
| Clock slowed | $f$ = 100 MHz | 100 mW | 5 mW | 4.8 % |
| Near idle | $f$ = 10 MHz | 10 mW | 5 mW | 33 % |
| Every node toggles | $\alpha$ = 1 | 10,000 mW | 5 mW | 0.05 % |
| Legacy supply | $V_{\mathrm{DD}}$ = 5 V | 25,000 mW | 25 mW | 0.1 % |
| Low-voltage core | $V_{\mathrm{DD}}$ = 0.7 V | 490 mW | 3.5 mW | 0.7 % |
| Leaky process, near idle | 50 nA, $f$ = 10 MHz | 10 mW | 50 mW | 83 % |

Slowing the clock slides dynamic power down in proportion to $f$ while static power does not move, so static's share grows. The two are equal at the **crossover frequency**

$$f_{\times} = \frac{I_{\mathrm{leak}}}{\alpha\, C\, V_{\mathrm{DD}}} = \frac{5\ \text{nA}}{(0.1)(10\ \text{fF})(1.0\ \text{V})} = 5\ \text{MHz}$$

Below 5 MHz, static power is the larger term. A chip that spends most of its life nearly idle, a watch or a sensor, lives on that side of the crossover, and leakage decides its battery life. Raising $\alpha$ does the opposite: more spikes, more dynamic power, and static's share falls.

## Which Way Does It Move?

The two formulas answer a question a designer asks constantly: if I change this, does the power go up or down, and which term? Read the direction straight off the formulas. $V_{\mathrm{DD}}$ appears in both terms, squared in one and to the first power in the other. $f$, $\alpha$ and $C$ appear only in the dynamic term. $I_{\mathrm{leak}}$ appears only in the static term.

| Change from the defaults | $P_{\mathrm{dynamic}}$ | $P_{\mathrm{static}}$ |
|---|:-:|:-:|
| $V_{\mathrm{DD}}$ 1.0 → 0.8 V | down, to 640 mW (×0.64) | down, to 4 mW (×0.8) |
| $f$ 1 GHz → 100 MHz | down, to 100 mW (×0.1) | no change |
| $\alpha$ 0.1 → 1 | up, to 10 W (×10) | no change |
| $C$ 10 → 20 fF (longer wires) | up, to 2 W (×2) | no change |
| $I_{\mathrm{leak}}$ 5 → 50 nA | no change | up, to 50 mW (×10) |
| $V_{\mathrm{DD}}$ 1.0 → 5 V | up, to 25 W (×25) | up, to 25 mW (×5) |

Halving one quantity at a time makes the same point. Halving $V_{\mathrm{DD}}$ quarters the dynamic power and halves the static, so the total falls to about a quarter. Halving $f$, $\alpha$ or $C$ halves the dynamic power and leaves static alone. Halving $I_{\mathrm{leak}}$ halves the static power, which at these settings barely changes the total. No other single quantity does as much as the supply.

## Design Levers

The formulas sort the techniques for saving power into two lists.

**To cut dynamic power** ($\alpha C V_{\mathrm{DD}}^2 f$):

- **Lower $V_{\mathrm{DD}}$.** The best lever, because the supply is squared. This is why supplies fell from 5 V in the 1960s and 1970s to about 1 V today.
- **Lower $f$.** Power falls in step with the clock, but so does the work done each second.
- **Gate the clock.** Stop the clock to a block that is not being used. Nothing inside it changes, so its $\alpha$ drops to 0 and its dynamic power with it.
- **Shrink $C$.** Shorter wires, smaller loads and less fan-out.

**To cut static power** ($N I_{\mathrm{leak}} V_{\mathrm{DD}}$):

- **Power-gate idle blocks.** Put a switch transistor, a *header* or sleep switch, between the supply and a block, and turn it off when the block is idle. The block is cut from $V_{\mathrm{DD}}$, so it leaks almost nothing. The price: the block forgets its outputs and stored values unless they are saved first, waking it up takes a little time and energy, and the switch takes area. Phones and laptops switch off whole idle blocks, such as a radio or a camera interface.
- **Lower $V_{\mathrm{DD}}$.** It helps here too, but only in proportion.
- **Choose a low-leakage process.** Transistors that leak less, usually at some cost in speed.

Slowing or gating the clock does nothing for static power, and power gating is the fix for exactly the term clock gating cannot touch.

The biggest lever is not free. Lowering $V_{\mathrm{DD}}$ shrinks the gap between a 0 and a 1, so there is less noise margin, and every gate switches more slowly. How low the supply can go before the logic stops being reliable, or fast enough, is the subject of Power, Noise Margin and Speed Trades.

## Key Takeaways

- Dynamic power is the cost of changing outputs: each 0→1 takes $C V_{\mathrm{DD}}^2$ from the supply, half stored on $C$ and half heat in the PMOS; the 1→0 turns the stored half into heat in the NMOS.
- $P_{\mathrm{dynamic}} = \alpha C V_{\mathrm{DD}}^2 f$ is the average of the supply-power graph: the energy of one spike times spikes per second.
- Static power is the cost of holding outputs: $P_{\mathrm{static}} = N I_{\mathrm{leak}} V_{\mathrm{DD}}$, paid whether or not anything switches. Tiny per gate, large across millions of gates.
- At busy, typical settings dynamic power dominates (1 W against 5 mW); near idle, below the crossover frequency, static power wins.
- $V_{\mathrm{DD}}$ is squared in the dynamic term and linear in the static term, so lowering it is the strongest lever, at a price in noise margin and speed.
- Clock gating cuts dynamic power; power gating cuts static power.

## Review Questions

**1. A gate drives a load of $C = 10$ fF from a 1.0 V supply. How much energy does the supply deliver each time the output rises from 0 to 1?**

A) 5 fJ\
B) 10 fJ\
C) 20 fJ\
D) 1 µJ

**2. When the output of a CMOS gate falls from 1 to 0, where does the heat in the NMOS come from?**

A) The supply delivers a second pulse of energy on the falling edge\
B) The leakage current through the PMOS\
C) The energy that was stored on the load capacitance when the output rose\
D) There is no heat on the falling edge

**3. A designer slows a block's clock from 1 GHz to 100 MHz, changing nothing else. What happens to its dynamic and static power?**

A) Dynamic falls to a tenth; static does not change\
B) Both fall to a tenth\
C) Dynamic falls to a tenth; static rises\
D) Static falls to a tenth; dynamic does not change

**4. The supply of a block is lowered from 1.0 V to 0.8 V. By what factor does its dynamic power change?**

A) ×0.8\
B) ×0.64\
C) ×0.5\
D) ×1.25

**5. A block of a million gates leaks 5 nA per gate at 1.0 V. What is its static power, and when is it drawn?**

A) 5 nW, only while the block is switching\
B) 5 mW, only while the block is switching\
C) 5 mW, whether or not the block is doing anything\
D) 5 W, whether or not the block is doing anything

**6. A block sits idle for long stretches. Which technique reduces its static power?**

A) Gating its clock\
B) Lowering its clock frequency\
C) Shortening its wires to reduce $C$\
D) Power gating: switching its supply off with a header transistor

## Answer Explanations

**1. B.** The supply delivers $C V_{\mathrm{DD}}^2 = (10\ \text{fF})(1.0\ \text{V})^2 = 10$ fJ. Half of it (5 fJ, choice A) is stored on the capacitor and half is heat in the PMOS.

**2. C.** On the 1→0 edge the supply delivers nothing. The NMOS discharges the capacitor, and the 5 fJ stored on it when the output rose becomes heat in the NMOS.

**3. A.** $P_{\mathrm{dynamic}} = \alpha C V_{\mathrm{DD}}^2 f$ is proportional to $f$, so it falls to a tenth (1000 mW to 100 mW). $P_{\mathrm{static}} = N I_{\mathrm{leak}} V_{\mathrm{DD}}$ contains no $f$, so it stays at 5 mW, and its share of the total grows.

**4. B.** The supply is squared in the dynamic term: $0.8^2 = 0.64$. Static power, linear in $V_{\mathrm{DD}}$, changes by ×0.8 (choice A).

**5. C.** $N I_{\mathrm{leak}} V_{\mathrm{DD}} = (10^6)(5\ \text{nA})(1.0\ \text{V}) = 5$ mW. Leakage flows through the off transistors whenever the block is powered, switching or not. 5 nW (choice A) is one gate.

**6. D.** Power gating cuts the idle block off from $V_{\mathrm{DD}}$, so it leaks almost nothing. Gating or slowing the clock and shrinking $C$ all reduce dynamic power only.
