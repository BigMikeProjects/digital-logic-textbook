## Basic Circuits: From Ohm's Law to Logic

### Learning Objectives

By the end of this section, you should be able to:

- Identify the three elements of a simple single-loop circuit — a voltage source, a resistor, and a load — and explain the role each one plays.
- Apply Ohm's law ($V = I \cdot R$) and Kirchhoff's voltage law to relate the voltage, current, and resistance in a loop.
- Predict how the current and the brightness of an LED change as the series resistance is varied, and explain why a current-limiting resistor is necessary.
- Distinguish a **series** connection (shared current) from a **parallel** connection (shared voltage).
- Reinterpret series and parallel topologies with switches and use **continuity** to show that series corresponds to logical **AND** and parallel to logical **OR**.
- Explain why this series-AND / parallel-OR mapping is the bridge from circuit theory to building logic gates out of transistors.

---

## Why a Little Circuit Theory?

Digital logic is usually taught at the level of gates, truth tables, and Boolean algebra — abstractions that deliberately hide the underlying electronics. That abstraction is powerful, but it rests on a physical foundation, and a small amount of circuit theory is enough to make that foundation solid. We do not need a full course in circuit analysis. We need just two ideas: how voltage, current, and resistance relate in a simple loop, and what it means to connect components in **series** versus in **parallel**. Everything else in this section is built from those two ideas, and by the end we will see that they lead directly to the structure of logic gates.

---

## The Single-Loop Circuit

The simplest useful circuit is a single loop: a source of energy connected to something that uses it, with a resistor in between. We will build one out of three parts.

The first part is a **voltage source**. Picture a battery. A single cell might supply about $1.5$ V, but for digital work it is convenient to idealize the source to a round number — we will call it $5$ V. (Five volts is the classic supply voltage of older digital logic; modern chips run at lower voltages, but $5$ V remains a clean teaching value.) The defining feature of a voltage source is that it holds its voltage **constant**, no matter what we attach to it.

The second part is a **resistor**. Its job in this circuit is to *control the current*. We will see in a moment exactly why that control matters.

The third part is the **load** — the thing we actually want to operate. Here the load is an **LED**, a *light-emitting diode*. An LED is drawn with the standard diode symbol (a triangle pointing into a bar), sometimes with a small circle around it to mark it as light-emitting. The LED is a good choice for a first example because its brightness is a direct, visible readout of the current flowing through it: more current, brighter light.

Connecting these three parts end to end forms a single loop:

![Single-loop LED circuit with a +5 V source, current-limiting resistor, LED load, ground, and current arrow.](./images/single-loop-led-circuit.svg)

---

## Ohm's Law and the Loop

Two relationships govern this loop. The first is **Ohm's law**, which ties together the three quantities we care about:

$$V = I \cdot R$$

Here $V$ is the voltage across a resistor, $I$ is the current through it, and $R$ is its resistance. Each quantity has its own unit: voltage is measured in **volts** (V), current in **amperes** or "amps" (A), and resistance in **ohms** ($\Omega$). In the small circuits of digital electronics, a full ampere is actually a lot of current — the currents we will meet are usually **milliamps** (mA, thousandths of an ampere), and resistances typically run from tens to thousands of ohms.

If the equation feels abstract, water gives a serviceable picture: voltage is the *pressure* pushing flow around the loop, current is the *amount of flow*, and resistance is the *narrowness of the pipe*. More pressure pushes more flow; a narrower pipe passes less of it. Ohm's law is that picture made exact.

The second relationship is **Kirchhoff's voltage law (KVL)**, which says that if you travel all the way around a closed loop, the voltage *rises* and *drops* must cancel out — you end up back where you started, at the same potential.

![Ohm's law relationship graphic showing V = I * R, I = V/R, and R = V/I.](./images/ohms-law-relationships.svg)

Apply KVL to our loop. Starting at the bottom and going up through the source, the voltage **rises** by $V$ (the full $5$ V). Coming back down through the resistor, the voltage **drops** by $I \cdot R$. To keep the example simple, we will assume the LED itself drops $0$ V. (That is not exactly true — a real LED drops something like $1.8$–$3$ V — but it is close enough to see the main idea.) With that simplification, the rise must equal the drop:

$$V = I \cdot R$$

This is the same equation as Ohm's law, which is no accident: in a single loop with one resistor, the source voltage appears entirely across that resistor.

![Kirchhoff voltage loop diagram showing a +5 V rise, an -IR drop, and the loop sum equal to zero.](./images/kirchhoff-voltage-loop.svg)

The crucial move is to **solve for the current**, because in this circuit the voltage is the fixed quantity and the resistance is the knob we turn:

$$I = \frac{V}{R}$$

With $V$ held constant by the source, the current is determined entirely by $R$.

Put numbers in to see the sizes involved. With the $5$ V source and a common $330\ \Omega$ resistor:

$$I = \frac{5\text{ V}}{330\ \Omega} \approx 0.015\text{ A} = 15\text{ mA}$$

Fifteen milliamps happens to sit right in the range where a typical indicator LED glows nicely — roughly $5$–$20$ mA — which is exactly why $330\ \Omega$ shows up so often in beginner electronics kits.

We can even undo our earlier simplification. A real red LED holds back about $2$ V of the loop's budget, leaving only $5 - 2 = 3$ V across the resistor, so the honest current is $3/330 \approx 9$ mA — dimmer than the idealized answer, but still comfortably lit. And this calculation runs just as well in reverse, which is how it is used in practice: *choose* a target current, then solve for the resistor. Want $10$ mA through that LED? Then

$$R = \frac{5\text{ V} - 2\text{ V}}{0.010\text{ A}} = 300\ \Omega$$

Pick the nearest standard resistor value and the design is done. This little computation — budget the voltage, choose the current, solve for $R$ — is the single most common calculation in practical electronics.

---

## Varying the Load

Now experiment with the resistor. Because $I = V/R$ and $V$ is fixed, the current and the resistance move in opposite directions:

| Action on $R$ | Effect on $I = V/R$ | Effect on the LED |
|---------------|---------------------|-------------------|
| Increase $R$  | $I$ decreases       | LED dims          |
| Decrease $R$  | $I$ increases       | LED brightens     |

![Three LED circuits showing high, medium, and low resistance producing dim, medium, and bright LEDs.](./images/led-brightness-vs-resistance.svg)

Make the resistance large and you choke off the current, and the LED grows dim. Make the resistance small and you let more current through, and the LED glows brighter. This inverse relationship is the whole behavior of the loop.

It also answers a natural question: *why have a resistor at all?* Suppose we removed it — set $R = 0$. Then $I = V/R = 5\text{ V} / 0$, which the math says is infinite current. In reality the current does not literally become infinite; instead the excessive current destroys the LED ("blows up the diode"). The resistor exists precisely to **limit the current** to a safe level. A resistor used this way is called a **current-limiting resistor**, and it is one of the most common building blocks in practical electronics.

One more idea is worth naming, because it returns later. We held the *source* constant and varied the *load*. When we get to logic gates, we will study **ideal** gates in which the loading does not affect the output at all — an idealization that lets us reason about logic without worrying about these circuit details. The single-loop circuit is where the habit of "constant source, variable load" first appears.

---

## Series and Parallel

The single loop had its parts strung one after another. That arrangement — components connected end to end so that the **same current** flows through each — is called a **series** connection. There is a second fundamental way to connect components, called **parallel**, and the contrast between the two is the second idea we need.

### Series: shared current

Place two resistors, $R_1$ and $R_2$, one after the other in a loop. The same charge that flows through $R_1$ must continue on through $R_2$ — there is nowhere else for it to go. So the defining property of a series connection is a **shared current**:

![Series resistor schematic showing two resistors between A and B with one shared current and separate voltage drops V1 and V2.](./images/series-resistors.svg)

The *voltages*, however, are generally **not** the same. By Ohm's law, the drop across each resistor depends on its own resistance:

$$V_1 = I \cdot R_1 \qquad V_2 = I \cdot R_2$$

If $R_1 \neq R_2$, then $V_1 \neq V_2$. In series, the current is common and the voltage divides up among the components.

Series resistances also *add*. From the current's point of view, two resistors in a row are simply two obstacles crossed one after the other, so the loop behaves as if it contained a single resistor of $R_1 + R_2$. Put a $330\ \Omega$ and a $470\ \Omega$ resistor in series and the source sees $800\ \Omega$ — the current drops accordingly.

### Parallel: shared voltage

Now connect the same two resistors side by side, both spanning the same two points $A$ and $B$:

![Parallel resistor schematic showing two branches between A and B with split currents I1 and I2 and a shared voltage.](./images/parallel-resistors.svg)

Here the situation is mirrored. Both resistors are connected to the identical pair of nodes, so the **same voltage** appears across each — that is the defining property of a parallel connection. The *currents* now generally differ, since each branch carries $I = V/R$ for its own resistance. In parallel, the voltage is common and the current divides up among the branches.

And where series connections *add* resistance, parallel connections *reduce* it: each added branch opens another lane for current, so the combination passes more total current than either branch alone — meaning the pair behaves like a resistor *smaller* than either one. (The exact formula can wait; the direction of the effect is what matters here.) Adding lanes to a highway never slows the traffic.

A compact way to remember the contrast:

| Connection | Shared quantity | Quantity that divides |
|------------|-----------------|-----------------------|
| Series     | current $I$     | voltage               |
| Parallel   | voltage $V$     | current               |

![Series versus parallel comparison infographic contrasting shared current and divided voltage with shared voltage and divided current.](./images/series-vs-parallel.svg)

---

## From Resistors to Switches: Continuity

Series and parallel become far more interesting when we replace the resistors with **switches**. A switch is either *closed* (a solid wire, current can pass) or *open* (a break, no current can pass). With switches in the circuit, the question is no longer "how much current?" but a simple yes/no question: **is there continuity** between two points — an unbroken conductive path connecting node $A$ to node $B$?

This yes/no view is exactly the world of digital logic, where everything is a 1 or a 0. Watch what the two topologies do to continuity.

![Switch continuity graphic showing a closed switch as continuity and an open switch as a broken path.](./images/switch-continuity.svg)

### Series switches behave like AND

Put two switches, $SW_1$ and $SW_2$, in series between $A$ and $B$:

![Series switches implementing AND logic with an AND gate and truth table.](./images/series-switches-and.svg)

Because they are in series, current would have to pass through *both* to get from $A$ to $B$. If either one is open, the path is broken. You get continuity **if and only if** $SW_1$ is closed **AND** $SW_2$ is closed:

| $SW_1$ | $SW_2$ | Continuity $A\!-\!B$ |
|:------:|:------:|:--------------------:|
| open   | open   | no                   |
| open   | closed | no                   |
| closed | open   | no                   |
| closed | closed | **yes**              |

This is precisely the truth table of the logical **AND** operation, with "closed" playing the role of 1 and "continuity" playing the role of a true output. **Series means AND.**

### Parallel switches behave like OR

Now put the two switches in parallel, each offering its own path from $A$ to $B$:

![Parallel switches implementing OR logic with an OR gate and truth table.](./images/parallel-switches-or.svg)

Here current can take either branch. As long as *at least one* switch is closed, a path exists. You get continuity when $SW_1$ is closed **OR** $SW_2$ is closed:

| $SW_1$ | $SW_2$ | Continuity $A\!-\!B$ |
|:------:|:------:|:--------------------:|
| open   | open   | no                   |
| open   | closed | **yes**              |
| closed | open   | **yes**              |
| closed | closed | **yes**              |

That is the truth table of the logical **OR** operation. **Parallel means OR.**

---

## Why This Matters: The Bridge to Logic Gates

We started with three resistors and a battery, and we have arrived at AND and OR. That is not a coincidence — it is the central reason a digital-logic course bothers with circuit theory at all.

A **transistor** can act as a voltage-controlled switch: a signal on its control terminal closes or opens the path between its other two terminals. Once you can build a switch out of a transistor, the series-means-AND and parallel-means-OR rules tell you how to wire transistors together to compute any logic function. Stringing transistors in series gives you an AND-like condition; placing them in parallel gives you an OR-like condition. Combining these patterns is exactly how the logic gates at the heart of every digital chip — and, eventually, every computer — are built.

One ingredient is still missing from the story: nothing in series-AND or parallel-OR ever *inverts* — turns a 1 into a 0. Inversion takes one more trick, using a transistor switch to pull an output's voltage down, and it is the first thing the next topic adds. With that third piece, the set is complete: AND, OR, and NOT are enough to build everything else. The humble single-loop LED circuit and the two ways of connecting components turn out to be the foundation of the whole subject.

![Concept map showing the progression from circuit theory to series and parallel circuits, switches, AND/OR logic, transistors as switches, logic gates, and computers.](./images/circuits-to-logic-concept-map.svg)

![NMOS transistor switch preview showing the gate controlling current between drain and source.](./images/nmos-transistor-switch.svg)

---

## Key Takeaways

A single-loop circuit consists of a voltage source, a current-limiting resistor, and a load, with the **same current flowing through every element**. Ohm's law ($V = I \cdot R$) together with Kirchhoff's voltage law lets us solve for that current as $I = V/R$. Because the source holds the voltage constant, the resistance is the controlling variable: increasing $R$ decreases the current (a dimmer LED), and decreasing $R$ increases it (a brighter LED). The resistor is essential because $R = 0$ would imply runaway current that destroys the load, and choosing it is a three-step habit: budget the voltage, pick the target current, solve for $R$ — with $5$ V, a $2$ V LED drop, and $330\ \Omega$ giving a comfortable $9$ mA. Connecting components in **series** forces a shared current while the voltage divides; connecting them in **parallel** forces a shared voltage while the current divides. Reinterpreted with switches, a series path has continuity only when *both* switches are closed — the logical **AND** — while a parallel path has continuity when *either* switch is closed — the logical **OR**. Because a transistor is a controllable switch, these two topologies are exactly how transistors are arranged to build logic gates, making basic circuit theory the bridge to all of digital logic.

---

## Review Questions

**1.** In the single-loop circuit, the voltage source is held constant at $5$ V and the series resistance $R$ is increased. What happens to the current $I$ and the brightness of the LED?

- A. $I$ increases and the LED gets brighter
- B. $I$ decreases and the LED gets dimmer
- C. $I$ stays the same because the source is constant
- D. $I$ increases and the LED gets dimmer

**2.** Why does a single-loop LED circuit include a current-limiting resistor?

- A. To increase the supply voltage to a safe level
- B. To store charge while the LED is off
- C. To limit the current so the LED is not destroyed
- D. To convert the LED's voltage drop into light

**3.** Two resistors are connected in **series**. Which quantity is necessarily the same for both?

- A. The voltage across each resistor
- B. The current through each resistor
- C. The power dissipated by each resistor
- D. The resistance of each resistor

**4.** Two switches are wired in **parallel** between nodes $A$ and $B$. There is continuity (an unbroken path) from $A$ to $B$ when:

- A. Both switches are closed
- B. Both switches are open
- C. At least one switch is closed
- D. Exactly one switch is closed

**5.** A designer wires two transistor-switches in **series**. Which logic operation does this arrangement implement, and why?

- A. OR, because either switch alone completes the path
- B. AND, because both switches must be closed to complete the path
- C. NOT, because the second switch inverts the first
- D. OR, because the current divides between the two switches

**6.** An LED that drops $2$ V should carry about $15$ mA from a $5$ V source. Which resistor value is closest to the right choice?

- A. $100\ \Omega$
- B. $200\ \Omega$
- C. $330\ \Omega$
- D. $470\ \Omega$

---

## Answer Explanations

**1. B.** Since $I = V/R$ with $V$ fixed, increasing $R$ makes the current smaller. Less current through the LED means it glows more dimly. (Choice D pairs the right brightness with the wrong current direction; A reverses both; C wrongly assumes a constant source means a constant current.)

**2. C.** With no resistor ($R = 0$), Ohm's law predicts $I = V/0$ — effectively unlimited current, which would destroy the LED. The resistor caps the current at a safe value. It does not raise the supply voltage (A) or store charge (B), and it is the LED, not the resistor, that emits light (D).

**3. B.** In a series connection, the same current must flow through every component because there is only one path. The voltage generally differs between resistors ($V_1 = IR_1$, $V_2 = IR_2$), so A is wrong; power and resistance need not match either (C, D).

**4. C.** Parallel switches each provide an independent path from $A$ to $B$, so the path is complete whenever *at least one* switch is closed — the logical OR. Requiring both (A) describes the series/AND case; "exactly one" (D) is the exclusive-or, not plain OR.

**5. B.** Series switches share a single path, so current reaches the far node only if *both* are closed — the defining behavior of AND. OR corresponds to the parallel arrangement (A, D), and a single switch in series does not invert anything (C).

**6. B.** Budget the voltage first: the LED takes $2$ V, leaving $5 - 2 = 3$ V for the resistor. Then $R = 3\text{ V} / 0.015\text{ A} = 200\ \Omega$. Choosing $100\ \Omega$ (A) would push $30$ mA — likely too much; $330\ \Omega$ (C) and $470\ \Omega$ (D) give roughly $9$ mA and $6$ mA — safe but noticeably dimmer than the $15$ mA target. (Forgetting the LED's $2$ V drop and computing $5/0.015 \approx 330\ \Omega$ is exactly the error choice C is waiting for.)
