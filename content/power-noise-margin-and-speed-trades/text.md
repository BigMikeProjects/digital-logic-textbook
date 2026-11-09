Over fifty years the supply voltage of digital logic fell from 5 V to about 1 V, and over the same years chips got enormously faster. That sounds as if a lower supply makes a circuit faster. It does not: for any one kind of transistor, lowering the supply saves power, but it shrinks the noise margin and slows every gate. Chips got faster anyway because the transistors themselves kept getting better. This topic separates those two stories. First it turns the supply knob on one fixed transistor and watches three things move: power, noise margin and speed. Then it looks at how each generation built a better transistor, and at how different products pick different points on the same trade.

## One Car, One Knob

A useful picture is a car. Think of a gate as a vehicle that has to make a trip every time its output changes:

- the **distance** of the trip is the voltage swing, $V_{\mathrm{DD}}$;
- the **weight** of the vehicle is the load capacitance the gate has to charge;
- the **engine** is the current the transistors can push, which depends on how far $V_{\mathrm{DD}}$ sits above the transistor's threshold $V_t$;
- the **ground clearance** is the noise margin, and the **bumps in the road** are noise.

Most of this topic keeps **one fixed car**: the same transistors, the same load, and only the supply changes. Every car also has a safe operating window. For the modern transistor used here it runs from about 0.5 V to 1.2 V. Much above 1.2 V the very thin insulation in the transistor breaks down (the redline); much below 0.5 V the supply gets so close to the threshold $V_t = 0.35$ V that the transistor barely turns on (the stall). Going from 5 V to 1 V over the decades meant building new cars, not turning old ones down.

## Three Dials on One Knob

Turning $V_{\mathrm{DD}}$ moves three dials at once.

**Power is the square.** From Static and Dynamic Power, the switching power of a block of $N$ gates is

$$P = \alpha\, N\, C\, V_{\mathrm{DD}}^2\, f$$

For the same block used there ($N = 10^6$, $C = 10$ fF, $\alpha = 0.1$) at $f = 1$ GHz, that is 1.00 W at 1.0 V. Lowering the supply to 0.8 V multiplies it by $0.8^2 = 0.64$.

**Noise margin is the line.** Every level in a gate's contract scales with the supply. Using the published 1.2 V levels from Gate Technologies and Noise Margin (outputs at $0.25\,V_{\mathrm{DD}}$ and $0.75\,V_{\mathrm{DD}}$, inputs at $0.35\,V_{\mathrm{DD}}$ and $0.65\,V_{\mathrm{DD}}$), both margins are

$$\mathit{NM} = 0.1\, V_{\mathrm{DD}}$$

**Delay is the cliff.** A gate's delay is the time its transistors take to charge the load across the swing. A lower supply has less distance to swing, but it pushes much less current, so the gate switches later:

$$t_{\mathrm{pd}} \propto \frac{V_{\mathrm{DD}}}{(V_{\mathrm{DD}} - V_t)^2}$$

As $V_{\mathrm{DD}}$ approaches $V_t$ the bottom of that fraction collapses and the delay shoots up. With 20 ps per gate at 1.0 V:

| $V_{\mathrm{DD}}$ | Noise margin | Gate delay (vs 1.0 V) | Power at 1 GHz |
|:-:|:-:|:-:|:-:|
| 1.2 V | 0.12 V | ×0.702 | 1.44 W |
| 1.0 V | 0.10 V | ×1 | 1.00 W |
| 0.8 V | 0.08 V | ×1.67 | 0.64 W |
| 0.6 V | 0.06 V | ×4.06 | 0.36 W |
| 0.5 V | 0.05 V | ×9.39 | 0.25 W |

Down the table, one dial moves the good way and two move the bad way: power falls, but the margin shrinks and the gates slow down, slowly at first and then over a cliff.

## Speed Sets the Top Clock

A slower gate matters because a clock period has to cover the slowest path. If the critical path is 20 gates long, the fastest clock the circuit can use is

$$f_{\max} = \frac{1}{20\, t_{\mathrm{pd}}}$$

At 1.0 V the path takes $20 \times 20$ ps $= 400$ ps, so $f_{\max} = 2.50$ GHz. At 0.8 V each gate takes 33.4 ps, the path takes 668 ps, and $f_{\max}$ drops to 1.50 GHz. The circuit operates correctly at frequencies less than $f_{\max}$; above it, the next clock edge arrives before the path has settled and the flip-flops capture wrong values.

| $V_{\mathrm{DD}}$ | 1.2 V | 1.0 V | 0.8 V | 0.6 V | 0.5 V |
|---|:-:|:-:|:-:|:-:|:-:|
| $f_{\max}$ | 3.56 GHz | 2.50 GHz | 1.50 GHz | 616 MHz | 266 MHz |

## The Noise Trap

The noise margin shrinks with the supply. The noise does not, unless the design cuts it. Ground bounce, crosstalk and supply ripple come from the board and the package, not from the logic family. Hold the noise at a fixed 75 mV:

- at 1.2 V the margin is 0.12 V, 1.6 times the noise;
- at 0.8 V it is 0.08 V, just enough;
- at 0.7 V it is 0.07 V, and a 75 mV bump pushes a 0 into the forbidden zone.

The reading flips at $0.1\,V_{\mathrm{DD}} = 75$ mV, which is $V_{\mathrm{DD}} = 0.75$ V. To run below that, the design must first cut the noise: more ground pins, capacitors on the chip, better boards. In the car picture, a car that sits lower to the ground needs a smoother road or better suspension. Every drop in supply over the decades was possible only because boards and packages got quieter along with it.

## The Design Triangle

Picture a triangle with power, noise margin and speed at its corners. The supply moves all three corners. The clock frequency $f$ is a second knob, and it moves only one: power rises in proportion to $f$, the margin does not care, and speed is fine until $f$ passes $f_{\max}$. Starting from 1.0 V and 1 GHz (1.00 W):

- **Lower the supply to 0.8 V.** Power ×0.64, margin 0.10 → 0.08 V, gates 1.67 times slower. Still well under $f_{\max} = 1.50$ GHz.
- **Lower the supply but keep a 2 GHz clock.** Power 1.28 W, but the circuit **fails**: the 668 ps path does not fit in a 500 ps period.
- **Raise the supply to 1.2 V.** Margin 0.12 V and gates 1.42 times faster, paid for as the square: ×1.44 the power. Run the clock at the new $f_{\max}$ of 3.56 GHz and the power is 5.13 W, ×2.05 that of 1.0 V at its own top clock.
- **Lower the supply and the clock together.** At 0.8 V and its own top clock, the block uses ×0.38 the power of 1.0 V at its top clock. This is **DVFS**, dynamic voltage and frequency scaling: when full speed is not needed, a chip turns both knobs down together. It is how a phone stretches its battery.

## Why Chips Got Faster Anyway

If a lower supply slows a gate, how did chips get faster while the supply fell? Because each generation built a better car. Smaller transistors are lighter: less capacitance to charge, so a trip takes less fuel (energy per switch) and the vehicle moves faster, even with a smaller engine. The cars also sat lower to the ground, since the margins shrank, so the roads and suspension had to improve with them. Typical numbers (the margins are the published levels; the clocks are typical desktop CPUs and approximate):

| Era | Supply | Noise margin | CPU clock |
|:-:|:-:|:-:|:-:|
| 1980s | 5 V CMOS | 1.40 V | ≈ 25 MHz |
| 1990s | 3.3 V | 0.40 V | ≈ 150 MHz |
| around 2000 | 1.8 V | 0.18 V | ≈ 1 GHz |
| 2005 to today | 1.2 V and below | 0.12 V | 3–5 GHz |

Around 2005 the tiny car could not go much faster. The threshold $V_t$ could not drop further without the transistors leaking too much when off, so the supply could not drop much either, and packing so many cars together ran too hot. Clocks have stayed near 3–5 GHz since then, and chips add **more cars** instead: more cores.

## Who Picks Which Corner

There is no best supply voltage. Each product picks the corner of the triangle it can afford to give up, using the same block as above:

| Job | Supply | Clock | Power | Noise margin | Gives up |
|---|:-:|:-:|:-:|:-:|---|
| Hearing aid or implant sensor | 0.5 V | 10 MHz | 2.50 mW | 0.05 V | speed and margin |
| Phone, light work (an efficiency core) | 0.7 V | 500 MHz | 0.245 W | 0.07 V | speed |
| Laptop, heavy work (a performance core) | 1.0 V | 2 GHz | 2.00 W | 0.10 V | a little of each |
| Server or gaming CPU at turbo | 1.2 V | 3.56 GHz | 5.13 W | 0.12 V | power |

A hearing aid lives on a tiny battery; sound and heartbeats are slow, so 10 MHz is plenty (its $f_{\max}$ at 0.5 V is 266 MHz), and its small, well-made package is quiet enough for a 0.05 V margin. A phone doing light work puts the battery first. A server plugged into the wall spends power for speed. Apple's chips put both phone and laptop rows on one die, with efficiency cores for light work and performance cores for heavy work, and move each group's supply and clock all day.

Two jobs fall outside this table. A car's engine controller sits next to the ignition and motors, where the road is very bumpy, so it uses bigger, older transistors rated for 3.3 V or 5 V: a different car with a wider window and much more clearance. And GPUs and AI chips take a third way out: **more gates, each one slower**. Doing the same 2.5 billion operations per second with one copy at 1.0 V and 2.5 GHz takes 2.50 W; split over two copies at 0.8 V and 1.25 GHz it takes 1.60 W (36 % less); over four copies at 0.7 V and 625 MHz, 1.23 W (51 % less). Splitting the work lets every copy slow down, a slower clock lets the supply drop, and the supply pays back as the square. The price is silicon: four copies need four times the gates.

## Key Takeaways

- For one fixed transistor, the supply turns three dials: power goes as $V_{\mathrm{DD}}^2$, noise margin as $V_{\mathrm{DD}}$, and gate delay as $V_{\mathrm{DD}}/(V_{\mathrm{DD}} - V_t)^2$, a cliff near the threshold.
- The top clock is $f_{\max} = 1/(20\,t_{\mathrm{pd}})$ for a 20-gate path; the circuit operates correctly at frequencies less than $f_{\max}$.
- The margin shrinks with the supply but the noise does not, so every lower supply needs quieter boards and packages.
- The clock is a second knob that moves only power, until it passes $f_{\max}$. Lowering both together is DVFS.
- Chips got faster while the supply fell because the transistors got smaller and lighter, not because of the lower supply. Since about 2005, speed comes from more cores rather than faster clocks.
- There is no best supply: each product gives up the corner it can afford.

## Review Questions

**1. For one fixed transistor, the supply drops from 1.0 V to 0.8 V at the same clock. What happens?**

A. Power falls, noise margin falls, gates get slower\
B. Power falls, noise margin rises, gates get faster\
C. Power rises, noise margin falls, gates get slower\
D. Power falls, noise margin is unchanged, gates get faster

**2. At 1.0 V, a 20-gate path takes 400 ps. What is $f_{\max}$?**

A. 400 MHz\
B. 1.0 GHz\
C. 2.5 GHz\
D. 20 GHz

**3. At 0.8 V, the 20-gate path takes 668 ps. Which clock makes the circuit fail?**

A. 500 MHz\
B. 1.0 GHz\
C. 1.4 GHz\
D. 2.0 GHz

**4. The noise on a board is a fixed 75 mV and $\mathit{NM} = 0.1\,V_{\mathrm{DD}}$. Which supply is the lowest that still absorbs the noise?**

A. 0.70 V\
B. 0.75 V\
C. 0.80 V, and nothing lower\
D. Any supply, because noise shrinks with the supply

**5. Over the decades the supply fell from 5 V to about 1 V while chips got much faster. Why?**

A. A lower supply makes every transistor switch faster\
B. The transistors got smaller and lighter, which more than made up for the lower supply\
C. The noise margins grew\
D. Clock frequencies stopped mattering after 2005

## Answer Explanations

**1. A.** Power goes as the square of the supply (×0.64), the margin is $0.1\,V_{\mathrm{DD}}$ (0.10 → 0.08 V), and the delay grows as the supply nears $V_t$ (×1.67).

**2. C.** $f_{\max} = 1/(400\ \text{ps}) = 2.5$ GHz.

**3. D.** A 2.0 GHz clock has a 500 ps period, shorter than the 668 ps path, so the flip-flops capture before the path settles. $f_{\max} = 1/(668\ \text{ps}) \approx 1.50$ GHz, so 1.4 GHz still works.

**4. B.** The margin equals the noise when $0.1\,V_{\mathrm{DD}} = 75$ mV, at $V_{\mathrm{DD}} = 0.75$ V. Below that the noise is bigger than the margin. The noise does not shrink with the supply unless the design cuts it.

**5. B.** For any one kind of transistor, a lower supply slows the gates. Chips got faster because each generation's transistors were smaller and lighter: less capacitance to charge per switch.
