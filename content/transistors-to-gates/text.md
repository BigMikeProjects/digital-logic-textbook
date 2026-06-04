## Transistors to Gates: How CMOS Builds Digital Logic

### Learning Objectives

By the end of this section, you should be able to:

- Explain how a CMOS inverter uses complementary PMOS and NMOS transistors to produce a logic inversion.
- Describe the pull-up and pull-down network structure that underlies every CMOS gate.
- Trace signal paths through CMOS NAND and NOR gate transistor configurations to verify their truth tables.
- Apply the series-means-AND and parallel-means-OR principle to read CMOS circuit topologies.
- Connect De Morgan's theorem to the physical structure of CMOS gates.

---

## From Abstraction Back to Reality

Every gate symbol we have used so far — AND, OR, NOT, NAND, NOR — is an abstraction. When you draw an AND gate on a schematic, you are saying "I want a circuit whose output is high only when all inputs are high," but you are not saying how that behavior is achieved physically. At some point, the abstraction must give way to transistors, wires, and voltage levels.

This section makes that connection. We will see how complementary metal-oxide semiconductor (CMOS) transistors are arranged to build the fundamental logic gates. Understanding this level is not just academic — it explains why certain gates are cheaper to build than others, why NAND and NOR gates are the natural primitives of digital design, and why power consumption depends on switching activity.

---

## The Two Transistor Types

CMOS logic uses two types of transistors that work as complementary partners: **PMOS** and **NMOS**.

An **NMOS transistor** conducts when a high voltage is applied to its gate. Think of it as a switch that closes when its control signal is 1. When the gate voltage is low, the NMOS transistor is off and no current flows through it.

A **PMOS transistor** is the complement. It conducts when a *low* voltage is applied to its gate — the opposite of NMOS. In schematics, the PMOS transistor is drawn with a small bubble at its gate terminal to indicate this inversion. When the gate voltage is high, the PMOS transistor is off.

This complementary behavior is the foundation of CMOS design. For any given input, one type of transistor turns on while the other turns off, ensuring that the output is always driven to a definite logic level.

---

## The CMOS Inverter

The simplest CMOS gate is the inverter. It uses exactly one PMOS transistor and one NMOS transistor, stacked between the power supply ($V_{DD}$, representing logic high) and ground ($GND$, representing logic low).

The PMOS transistor sits on top, connected to $V_{DD}$. The NMOS transistor sits on the bottom, connected to ground. Both gates are tied to the same input $A$, and the output $Y$ is taken from the node between them.

When input $A$ is **high (1)**: the PMOS transistor turns off (bubble inverts the high signal) and the NMOS transistor turns on. The NMOS transistor creates a path from the output to ground, pulling the output low. The result is $Y = 0$.

When input $A$ is **low (0)**: the PMOS transistor turns on (bubble inverts the low signal) and the NMOS transistor turns off. The PMOS transistor creates a path from $V_{DD}$ to the output, pulling the output high. The result is $Y = 1$.

In both cases, exactly one transistor is on and the other is off. The output is always actively driven — either pulled up to $V_{DD}$ or pulled down to ground. There is never a state where both transistors are on simultaneously (which would create a short circuit) or both are off (which would leave the output floating). This complementary switching is what makes CMOS so efficient: in a steady state, no current flows from $V_{DD}$ to ground.

The logic function is simply:

$$Y = \bar{A}$$

| $A$ | $Y$ |
|:---:|:---:|
| 0   | 1   |
| 1   | 0   |

---

## Pull-Up and Pull-Down Networks

The inverter reveals a pattern that generalizes to every CMOS gate. Every CMOS gate is built from two complementary networks:

- The **pull-up network** connects the output to $V_{DD}$. It is constructed entirely from PMOS transistors. When the pull-up network conducts, the output is driven high.
- The **pull-down network** connects the output to ground. It is constructed entirely from NMOS transistors. When the pull-down network conducts, the output is driven low.

These two networks implement complementary logic functions. If the desired output function is $F$, then the pull-up network implements $F$ (it conducts when $F = 1$, pulling the output high) and the pull-down network implements $\bar{F}$ (it conducts when $F = 0$, pulling the output low).

For the inverter, this is straightforward: the pull-up function is $\bar{A}$ (PMOS conducts when $A = 0$ because of the bubble), and the pull-down function is $A$ (NMOS conducts when $A = 1$). The two networks are always complementary — when one conducts, the other does not.

This structure extends to any logic function by choosing the right arrangement of transistors within each network.

---

## Series and Parallel: The Topology of Logic

The way transistors are connected within a network directly maps to logic operations:

**Series connection means AND.** When two transistors are placed in series (end to end), current can flow through the chain only if *both* transistors are on. Both conditions must be true for the path to conduct.

**Parallel connection means OR.** When two transistors are placed in parallel (side by side), current can flow if *either* transistor is on. Only one condition needs to be true for the path to conduct.

This mapping between circuit topology and Boolean logic is the key to reading any CMOS gate schematic. If you can identify which transistors are in series and which are in parallel, you can determine the logic function directly from the circuit.

---

## The CMOS NAND Gate

A NAND gate outputs low only when all inputs are high. Its function is:

$$Y = \overline{A \cdot B}$$

By De Morgan's theorem, this is equivalent to $\bar{A} + \bar{B}$. The CMOS implementation reflects both forms directly.

**Pull-down network (NMOS, series):** Two NMOS transistors are placed in series between the output and ground. The top NMOS transistor is controlled by input $A$; the bottom by input $B$. Because they are in series, both must be on for the path to ground to exist. Both $A$ and $B$ must be high — this implements $A \cdot B$, which is the condition for pulling the output low (implementing $\bar{F}$).

**Pull-up network (PMOS, parallel):** Two PMOS transistors are placed in parallel between $V_{DD}$ and the output. One is controlled by $A$; the other by $B$. Because of the PMOS bubbles, the transistor controlled by $A$ turns on when $A$ is low (implementing $\bar{A}$), and similarly the transistor controlled by $B$ implements $\bar{B}$. Because they are in parallel, either one being on pulls the output high. This implements $\bar{A} + \bar{B}$, which by De Morgan's theorem equals $\overline{A \cdot B}$ — exactly the NAND function.

| $A$ | $B$ | Pull-up (PMOS) | Pull-down (NMOS) | $Y$ |
|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 | Both ON | Both OFF | 1 |
| 0 | 1 | $\bar{A}$ ON | Only $B$ ON | 1 |
| 1 | 0 | $\bar{B}$ ON | Only $A$ ON | 1 |
| 1 | 1 | Both OFF | Both ON | 0 |

The only input combination that produces a 0 output is when both inputs are high — exactly the NAND truth table.

---

## The CMOS NOR Gate

A NOR gate outputs high only when all inputs are low. Its function is:

$$Y = \overline{A + B}$$

By De Morgan's theorem, this equals $\bar{A} \cdot \bar{B}$. Again, the CMOS structure maps directly to both forms.

**Pull-up network (PMOS, series):** Two PMOS transistors are placed in series between $V_{DD}$ and the output. The transistor controlled by $A$ turns on when $A$ is low ($\bar{A}$), and the transistor controlled by $B$ turns on when $B$ is low ($\bar{B}$). Because they are in series, both must be on — both inputs must be low — for the pull-up path to conduct. This implements $\bar{A} \cdot \bar{B}$, which equals $\overline{A + B}$.

**Pull-down network (NMOS, parallel):** Two NMOS transistors are placed in parallel between the output and ground. One is controlled by $A$; the other by $B$. Because they are in parallel, either one being on creates a path to ground. This implements $A + B$, which is the condition for pulling the output low.

| $A$ | $B$ | Pull-up (PMOS) | Pull-down (NMOS) | $Y$ |
|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 | Both ON | Both OFF | 1 |
| 0 | 1 | Only $\bar{A}$ ON | $B$ ON | 0 |
| 1 | 0 | Only $\bar{B}$ ON | $A$ ON | 0 |
| 1 | 1 | Both OFF | Both ON | 0 |

The only input combination that produces a 1 is when both inputs are low — exactly the NOR truth table.

---

## The Duality Between NAND and NOR

Comparing the NAND and NOR implementations reveals a beautiful symmetry. The NAND gate uses parallel PMOS and series NMOS. The NOR gate uses series PMOS and parallel NMOS. They are duals of each other — swap series for parallel, and NAND becomes NOR.

This duality is De Morgan's theorem made physical. De Morgan's tells us that $\overline{A \cdot B} = \bar{A} + \bar{B}$ and $\overline{A + B} = \bar{A} \cdot \bar{B}$. In the CMOS implementation, the AND/OR relationship in the pull-down network always appears as the complementary OR/AND relationship in the pull-up network. The bubbles on the PMOS transistors provide the necessary inversions.

This also explains why NAND and NOR gates are the natural building blocks of CMOS logic. An AND gate in CMOS would actually require a NAND gate followed by an inverter — an extra pair of transistors. The inversion that the complementary pull-up/pull-down structure provides for free makes NAND and NOR the most efficient gates to build. This is why, in practice, complex logic is often implemented using NAND-only or NOR-only networks rather than mixtures of AND, OR, and NOT gates.

---

## Reading CMOS Circuits: A Practical Method

When you encounter an unfamiliar CMOS gate schematic, you can determine its function using a systematic approach:

1. **Identify the pull-down network** (NMOS transistors, connected to ground). Determine which transistors are in series (AND) and which are in parallel (OR). The pull-down function tells you when the output is low — this is $\bar{F}$.

2. **Invert to find $F$.** The gate's output function is the complement of the pull-down function.

3. **Verify with the pull-up network** (PMOS transistors, connected to $V_{DD}$). The pull-up network should implement $F$ directly, but remember that each PMOS transistor provides a built-in inversion due to its bubble.

For example, if the pull-down network has two NMOS transistors in series (implementing $A \cdot B$), then $\bar{F} = A \cdot B$, so $F = \overline{A \cdot B}$ — a NAND gate. If the pull-down has two NMOS transistors in parallel (implementing $A + B$), then $F = \overline{A + B}$ — a NOR gate.

---

## Key Takeaways

CMOS logic builds every gate from two complementary networks of transistors. The pull-up network (PMOS) drives the output high; the pull-down network (NMOS) drives the output low. Series connections implement AND logic; parallel connections implement OR. The bubbles on PMOS gates provide built-in inversion, which is why NAND and NOR gates — not AND and OR — are the natural primitives of CMOS design. De Morgan's theorem is not just an algebraic identity; it is a direct description of how CMOS pull-up and pull-down networks relate to each other. Understanding this transistor-level view explains the cost, efficiency, and design choices behind the digital systems built on these foundations.

---

## Review Questions

**1. In a CMOS inverter, what happens when the input is driven high?**

- A) Both transistors turn on, creating a short circuit between $V_{DD}$ and ground
- B) The PMOS transistor turns on, pulling the output high
- C) The NMOS transistor turns on, pulling the output low
- D) Both transistors turn off, leaving the output floating

**2. What does a series connection of NMOS transistors in the pull-down network represent logically?**

- A) OR — either transistor conducting creates a path to ground
- B) AND — both transistors must be on for the path to ground to exist
- C) NOT — the series connection inverts the input signal
- D) XOR — the path conducts only when the inputs differ

**3. In a CMOS NAND gate, what is the configuration of the pull-up (PMOS) network?**

- A) Two PMOS transistors in series
- B) Two PMOS transistors in parallel
- C) One PMOS transistor with a double-width channel
- D) Two PMOS transistors with cross-coupled feedback

**4. Why are NAND and NOR gates considered the natural primitives of CMOS design, rather than AND and OR?**

- A) NAND and NOR gates use fewer wires in the layout
- B) The complementary pull-up/pull-down structure provides inversion for free, so AND and OR require extra transistors
- C) AND and OR gates cannot be built using CMOS transistors at all
- D) NAND and NOR gates consume less power because they never switch

**5. A CMOS gate has a pull-down network with two NMOS transistors in parallel. What gate function does this implement?**

- A) NAND
- B) NOR
- C) AND
- D) OR

**6. Which statement correctly describes the relationship between the pull-up and pull-down networks in a CMOS gate?**

- A) Both networks implement the same function $F$ for redundancy
- B) The pull-up implements $F$ and the pull-down implements $\bar{F}$ — they are always complementary
- C) The pull-up implements AND logic and the pull-down implements OR logic in all gates
- D) The pull-up is active during one clock phase and the pull-down during the other

---

## Answer Explanations

**1. Answer: C) The NMOS transistor turns on, pulling the output low**

When the input is high, the NMOS transistor (no bubble) turns on because it activates on high gate voltage. The PMOS transistor (with bubble) turns off because the bubble inverts the high signal, deactivating it. The conducting NMOS connects the output to ground, producing a low output.

- *Both on / short circuit* (A) never occurs in a properly designed CMOS gate because the complementary transistors ensure exactly one network is active for any valid input.
- *PMOS on, output high* (B) describes what happens when the input is low, not high.
- *Both off / floating* (D) also never occurs — for any valid input, exactly one transistor in the inverter is always on.

**2. Answer: B) AND — both transistors must be on for the path to ground to exist**

Series means the transistors are stacked end to end. Current can only flow through the chain if every transistor in the series is conducting. This is exactly the AND operation: all conditions must be true.

- *OR* (A) describes a parallel connection, not series.
- *NOT* (C) is provided by the PMOS bubble, not by a series arrangement.
- *XOR* (D) cannot be implemented by a simple series or parallel connection — it requires a more complex topology.

**3. Answer: B) Two PMOS transistors in parallel**

In a NAND gate, the pull-up network uses parallel PMOS transistors. Each PMOS transistor provides inversion through its bubble, so they implement $\bar{A} + \bar{B}$. By De Morgan's theorem, this equals $\overline{A \cdot B}$, which is the NAND function.

- *Series PMOS* (A) describes the NOR gate's pull-up network, not the NAND gate's.
- *Double-width channel* (C) is a transistor sizing technique unrelated to the logic topology.
- *Cross-coupled feedback* (D) is used in sequential circuits like latches, not in combinational gates.

**4. Answer: B) The complementary pull-up/pull-down structure provides inversion for free, so AND and OR require extra transistors**

The CMOS structure naturally produces an inverted output: the pull-up network implements $F$ using PMOS transistors (which invert their input via the bubble), and the pull-down implements $\bar{F}$. To build a non-inverting gate like AND, you would need a NAND gate followed by an inverter — two extra transistors.

- *Fewer wires* (A) is not the fundamental reason for the preference.
- *Cannot be built* (C) is false — AND and OR gates can be built in CMOS, they just require more transistors (NAND + inverter or NOR + inverter).
- *Never switch* (D) is false — all gates switch when inputs change, and CMOS power consumption is dominated by switching activity.

**5. Answer: B) NOR**

Parallel NMOS in the pull-down means the output is pulled low when either $A$ or $B$ is high — the pull-down function is $A + B$. The gate function is the complement: $F = \overline{A + B}$, which is NOR.

- *NAND* (A) would have series NMOS in the pull-down (implementing $A \cdot B$).
- *AND* (C) and *OR* (D) are non-inverting functions that are not directly produced by the CMOS pull-up/pull-down structure.

**6. Answer: B) The pull-up implements $F$ and the pull-down implements $\bar{F}$ — they are always complementary**

This is the fundamental CMOS design principle. The pull-up network conducts when $F = 1$ (driving the output high), and the pull-down network conducts when $F = 0$ (driving the output low). They must be complementary to ensure the output is always driven and never shorted.

- *Same function for redundancy* (A) would create a short circuit whenever $F = 1$, since both networks would conduct simultaneously.
- *AND pull-up / OR pull-down* (C) describes one specific gate (NOR) but is not true for all gates.
- *Clock-phase alternation* (D) describes dynamic logic, not standard static CMOS.
