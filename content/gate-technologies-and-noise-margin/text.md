A gate does not promise "5 V for a 1 and 0 V for a 0." Real outputs sag a little under load, real wires pick up noise, and real inputs have to decide what a voltage in the middle means. So every logic family publishes a small contract of voltage levels: what its outputs promise and what its inputs need. The gaps between those numbers are the **noise margins**, the amount of noise a signal can pick up before a bit is misread. This topic reads that contract for one gate, then follows it through fifty years of logic families as the supply voltage came down from 5 V to about 1 V.

## What an Output Promises and an Input Needs

Digital Noise Immunity used a single threshold: anything above it reads as a 1, anything below as a 0. Real gates are described by four levels, two for the output and two for the input.

| Level | Plain words | Whose promise |
|:-:|---|---|
| $V_{\mathrm{OH},\mathrm{min}}$ | an output 1 is **at least** this high | the output |
| $V_{\mathrm{OL},\mathrm{max}}$ | an output 0 is **at most** this high | the output |
| $V_{\mathrm{IH},\mathrm{min}}$ | an input reads a 1 if it is **at least** this high | the input |
| $V_{\mathrm{IL},\mathrm{max}}$ | an input reads a 0 if it is **at most** this high | the input |

The output levels are promises the sending gate keeps no matter how it was built or how warm it is. The input levels are what the receiving gate needs in order to guarantee a correct reading. Between $V_{\mathrm{IL},\mathrm{max}}$ and $V_{\mathrm{IH},\mathrm{min}}$ is the **forbidden zone**: the input promises nothing there. A voltage in the forbidden zone might read as a 0, as a 1, or as neither, and it can change from one chip to the next. That is the "weak input" region of Non-ideal Switching, where neither transistor is fully on or fully off.

The supply voltage $V_{\mathrm{DD}}$ is the top of the picture. A 1 lives near $V_{\mathrm{DD}}$ and a 0 lives near 0 V.

## The Noise Margins

A connection works when every level the output is allowed to send lands where the input reads it correctly. A 1 is safe when $V_{\mathrm{OH},\mathrm{min}} \ge V_{\mathrm{IH},\mathrm{min}}$, and a 0 is safe when $V_{\mathrm{OL},\mathrm{max}} \le V_{\mathrm{IL},\mathrm{max}}$. The size of each gap is a noise margin:

$$\mathit{NM}_H = V_{\mathrm{OH},\mathrm{min}} - V_{\mathrm{IH},\mathrm{min}} \qquad\qquad \mathit{NM}_L = V_{\mathrm{IL},\mathrm{max}} - V_{\mathrm{OL},\mathrm{max}}$$

$\mathit{NM}_H$ is how far a 1 can sag before the input stops reading it as a 1. $\mathit{NM}_L$ is how far a 0 can rise before the input stops reading it as a 0.

Take a 5 V CMOS gate from the 74HC family. Its outputs swing almost rail to rail at light load, and its input thresholds sit at 70 % and 30 % of the supply:

| $V_{\mathrm{DD}}$ | $V_{\mathrm{OH},\mathrm{min}}$ | $V_{\mathrm{OL},\mathrm{max}}$ | $V_{\mathrm{IH},\mathrm{min}}$ | $V_{\mathrm{IL},\mathrm{max}}$ |
|:-:|:-:|:-:|:-:|:-:|
| 5.0 V | 4.90 V | 0.10 V | 3.50 V | 1.50 V |

$$\mathit{NM}_H = 4.90 - 3.50 = 1.40\ \text{V} \qquad \mathit{NM}_L = 1.50 - 0.10 = 1.40\ \text{V}$$

Both margins are 1.40 V. Notice that the margin is a **difference**, not a level: it depends on what the output promises *and* on what the input needs.

## A Margin Is a Noise Budget

Noise is anything that pushes a wire's voltage away from where the output put it: ground bounce when many outputs switch at once, crosstalk from a neighboring wire, ripple on the supply. Suppose the 74HC output sends a 1 and the wire picks up noise that pulls it down.

- **1.0 V of noise.** The input sees $4.90 - 1.00 = 3.90$ V. That is still above $V_{\mathrm{IH},\mathrm{min}} = 3.50$ V, so the input still reads a 1.
- **1.5 V of noise.** The input sees $4.90 - 1.50 = 3.40$ V, below $V_{\mathrm{IH},\mathrm{min}}$. The level has landed in the forbidden zone, and the bit can be misread.

The reading flips exactly when the noise equals the margin, 1.40 V. A margin is a noise budget: noise smaller than the margin is absorbed, and noise bigger than the margin can flip a bit. The same reasoning applies to a 0 that picks up noise pushing it up, with $\mathit{NM}_L$ as the budget.

## Two Ways to Build a Gate: TTL and CMOS

Logic families differ in how their gates are built, and that shows up in their contracts.

**TTL** (transistor-transistor logic) builds gates from bipolar transistors. It was the standard logic of the 1970s, on a 5 V supply. Its output stage cannot pull all the way up to the supply, so a TTL 1 is only promised at 2.7 V. The 74LS family's levels give lopsided margins:

$$\mathit{NM}_H = 2.7 - 2.0 = 0.70\ \text{V} \qquad \mathit{NM}_L = 0.8 - 0.5 = 0.30\ \text{V}$$

TTL also burns power even while its outputs sit still.

**CMOS** builds gates from the pull-up and pull-down MOSFETs of Transistors to Gates. One network is always off, so an idle CMOS gate draws almost no current, and its outputs swing almost all the way between the rails. That is why the 74HC margins above are so wide, and why CMOS replaced TTL through the 1980s.

## Going Lower

The power a CMOS gate spends switching grows with the **square** of the supply voltage, so every step down in $V_{\mathrm{DD}}$ buys a large power saving. The industry took that step again and again. To let chips from different makers talk to each other at each new supply, the standards body JEDEC publishes the levels for each voltage. The table lists typical published levels, with each column relative to 5 V CMOS in the last column:

| Era | Family | $V_{\mathrm{DD}}$ | $V_{\mathrm{OH},\mathrm{min}}$ | $V_{\mathrm{OL},\mathrm{max}}$ | $V_{\mathrm{IH},\mathrm{min}}$ | $V_{\mathrm{IL},\mathrm{max}}$ | $\mathit{NM}_H$ | $\mathit{NM}_L$ | Power per switch vs 5 V |
|:-:|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 1970s | 5 V TTL (74LS) | 5.0 | 2.70 | 0.50 | 2.00 | 0.80 | 0.70 | 0.30 | — |
| 1980s | 5 V CMOS (74HC) | 5.0 | 4.90 | 0.10 | 3.50 | 1.50 | 1.40 | 1.40 | 1 |
| 1990s | 3.3 V LVCMOS | 3.3 | 2.40 | 0.40 | 2.00 | 0.80 | 0.40 | 0.40 | 0.44 |
| late 1990s | 2.5 V | 2.5 | 2.00 | 0.40 | 1.70 | 0.70 | 0.30 | 0.30 | 0.25 |
| around 2000 | 1.8 V | 1.8 | 1.35 | 0.45 | 1.17 | 0.63 | 0.18 | 0.18 | 0.13 |
| 2000s | 1.2 V | 1.2 | 0.90 | 0.30 | 0.78 | 0.42 | 0.12 | 0.12 | 0.06 |

The power column is $(V_{\mathrm{DD}}/5\ \text{V})^2$. TTL is left out of it because TTL also burns power while idle, so its power is not set by switching alone. The exact levels depend on the part and on how much current its output drives; the 74HC row uses light-load outputs, the JEDEC rows their rated loads.

Read the table down the columns:

- **Power fell fast.** From 5 V CMOS to 1.2 V, the power per switch fell by a factor of $5^2 / 1.2^2 \approx 17$.
- **Every level came down with the supply,** and the margins came down with them: from 1.40 V at 5 V to 0.12 V at 1.2 V. At 1.2 V, 0.12 V of noise is enough to put a bit in the forbidden zone.
- **The noise had to come down too.** Ground bounce and crosstalk come from the board and the package, not from the logic family, so they do not shrink on their own when the supply does. Each step down was possible only because boards and packages got quieter: more ground pins, capacitors on the chip, better boards.

## Why Not Lower Still?

If a lower supply saves so much power, why not keep going? Lowering $V_{\mathrm{DD}}$ shrinks the margins, as the table shows, and on its own it also slows every gate. Chips still got faster through all of these years, but not because the supply came down: better circuits were being built all along, smaller and quicker to switch, which more than made up for the lower supply. Power, Noise Margin and Speed Trades takes up that question: one supply voltage, three consequences, and why chips settled near 1 V.

## Key Takeaways

- A logic family is described by four levels: the output promises $V_{\mathrm{OH},\mathrm{min}}$ and $V_{\mathrm{OL},\mathrm{max}}$, and the input needs $V_{\mathrm{IH},\mathrm{min}}$ and $V_{\mathrm{IL},\mathrm{max}}$. Between the two input levels is the forbidden zone.
- The noise margins are the gaps between promise and need: $\mathit{NM}_H = V_{\mathrm{OH},\mathrm{min}} - V_{\mathrm{IH},\mathrm{min}}$ and $\mathit{NM}_L = V_{\mathrm{IL},\mathrm{max}} - V_{\mathrm{OL},\mathrm{max}}$.
- A margin is a noise budget: noise smaller than the margin is absorbed; noise bigger than the margin can flip a bit.
- TTL's outputs cannot reach the supply, so its margins are lopsided; CMOS swings almost rail to rail and draws almost nothing while idle.
- Lowering the supply from 5 V to 1.2 V cut the power per switch about 17 times, but shrank the margins from 1.40 V to 0.12 V, so boards and packages had to get quieter at every step.

## Review Questions

**1. Which level is a promise made by a gate's output?**

A. $V_{\mathrm{IH},\mathrm{min}}$\
B. $V_{\mathrm{IL},\mathrm{max}}$\
C. $V_{\mathrm{OH},\mathrm{min}}$\
D. $V_{\mathrm{DD}}$

**2. A 3.3 V family has $V_{\mathrm{OH},\mathrm{min}} = 2.4$ V, $V_{\mathrm{OL},\mathrm{max}} = 0.4$ V, $V_{\mathrm{IH},\mathrm{min}} = 2.0$ V and $V_{\mathrm{IL},\mathrm{max}} = 0.8$ V. What is $\mathit{NM}_H$?**

A. 0.4 V\
B. 1.6 V\
C. 2.0 V\
D. 0.8 V

**3. A 74HC output (5 V) sends a 1, and the wire picks up 1.2 V of noise. What does the 74HC input read?**

A. A 1, because 3.70 V is above $V_{\mathrm{IH},\mathrm{min}} = 3.50$ V\
B. A 0, because 1.2 V of noise is below $V_{\mathrm{IL},\mathrm{max}}$\
C. Nothing reliable, because 3.70 V is in the forbidden zone\
D. A 1, because any voltage above 2.5 V is a 1

**4. A 74LS (TTL) output sends a 0 and picks up 0.35 V of noise. With $V_{\mathrm{OL},\mathrm{max}} = 0.5$ V and $V_{\mathrm{IL},\mathrm{max}} = 0.8$ V, what happens at a 74LS input?**

A. It reads a 0, because 0.35 V is less than 0.8 V\
B. The level is 0.85 V, in the forbidden zone, so the bit can be misread\
C. It reads a 1, because 0.85 V is above $V_{\mathrm{OL},\mathrm{max}}$\
D. It reads a 0, because TTL has no forbidden zone

**5. Going from 5 V CMOS to 1.2 V, what happened to the power per switch and to the noise margin?**

A. Power fell about 17 times; the margin fell from 1.40 V to 0.12 V\
B. Power fell about 4 times; the margin stayed at 1.40 V\
C. Power rose; the margin grew\
D. Power fell about 17 times; the margin grew, because the levels came closer together

## Answer Explanations

**1. C.** $V_{\mathrm{OH},\mathrm{min}}$ is the output's promise: an output 1 is at least this high. $V_{\mathrm{IH},\mathrm{min}}$ and $V_{\mathrm{IL},\mathrm{max}}$ are what an input needs, and $V_{\mathrm{DD}}$ is the supply.

**2. A.** $\mathit{NM}_H = V_{\mathrm{OH},\mathrm{min}} - V_{\mathrm{IH},\mathrm{min}} = 2.4 - 2.0 = 0.4$ V. (The low margin is $0.8 - 0.4 = 0.4$ V too.)

**3. A.** The output promises at least 4.90 V, so with 1.2 V of noise the input sees $4.90 - 1.20 = 3.70$ V, still above 3.50 V. The noise is smaller than $\mathit{NM}_H = 1.40$ V, so it is absorbed.

**4. B.** The input sees $0.5 + 0.35 = 0.85$ V, above $V_{\mathrm{IL},\mathrm{max}} = 0.8$ V: the forbidden zone. The noise, 0.35 V, is bigger than $\mathit{NM}_L = 0.30$ V. (0.25 V of noise would leave 0.75 V, still a 0.)

**5. A.** Power per switch goes with the square of the supply: $5^2/1.2^2 \approx 17$. Every level came down with the supply, so the margin shrank from 1.40 V to 0.12 V.
