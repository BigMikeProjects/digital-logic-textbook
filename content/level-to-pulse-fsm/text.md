Many signals in a digital system are **levels**: they go high, stay high for as long as some condition holds, and then go low again. A vending machine's coin sensor is a good example. An optical sensor in the coin chute reads 1 while a coin is passing in front of it and 0 the rest of the time. The trouble is that the machine's logic runs on a clock that is far faster than a falling coin, so a single quarter can hold the sensor high for several clock periods in a row. If the machine counted a coin on every clock edge where the sensor reads 1, one quarter held for four clocks would be credited as four quarters, a whole dollar.

What the machine needs is one **pulse** per event: a signal that is high for exactly one clock period when the level first goes high, no matter how long the level then stays high. A circuit that does this is called a **level-to-pulse converter**, or a rising-edge detector. It is a small, practical machine, and it is a good first example because it exercises every step of the finite state machine design flow: state diagram, state table, state assignment, K-maps, equations and circuit.

## The Specification

The converter has one input and one output.

- **L** is the level. It can stay high for any number of clock periods.
- **P** is the pulse. It must be 1 for exactly one clock period after each rising edge of L, and 0 the rest of the time.

Because the machine only looks at L on clock edges, "a rising edge of L" means a clock edge where L is 1 and was 0 at the previous edge. Recognizing that requires remembering what L was last time, and remembering is what a state machine is for.

## The State Diagram

Three states are enough.

- **LOW**: L has been 0. The machine is waiting, and $P = 0$.
- **PULSE**: L has just gone high. This is the state that produces the pulse, so $P = 1$.
- **HIGH**: L has stayed high since the pulse. The event has already been reported, so $P = 0$.

The transitions follow directly from what each state means.

| Present state | $L = 0$ | $L = 1$ | $P$ |
|:-:|:-:|:-:|:-:|
| LOW | LOW | PULSE | 0 |
| PULSE | LOW | HIGH | 1 |
| HIGH | LOW | HIGH | 0 |

In LOW, a 0 keeps the machine waiting and a 1 starts the pulse. From PULSE, the machine always leaves after one clock: if L is still 1 it moves on to HIGH and the pulse ends, and if L has already dropped it goes back to LOW. In HIGH, the machine stays put for as long as L is 1, because it is still the same event. Only when L returns to 0 does it go back to LOW, ready for the next rising edge.

PULSE is a pass-through state: no arc loops back into it, so the machine can never spend more than one clock there. That is what guarantees the pulse is exactly one clock wide, and returning to LOW is the only way to get another one.

The output depends only on which state the machine is in, so this is a **Moore machine**. One consequence is that the pulse arrives one clock period *after* the edge where L was first seen high, because the machine has to move into PULSE before P can go high. That delay is harmless here: the pulse still marks the event, and the event is still counted exactly once. (A machine whose output can also read the input directly could respond sooner, which is the subject of Mealy versus Moore.)

## Tracing the Diagram

Here is the machine over twelve clock periods, with L rising, staying high for four clocks, falling, and then rising again for two clocks. Each column shows the state during that clock period and the value of L the machine samples at the edge that ends it.

| Clock | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $L$ | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 0 | 0 |
| State | LOW | LOW | LOW | PULSE | HIGH | HIGH | HIGH | LOW | LOW | PULSE | HIGH | LOW |
| $P$ | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |

L is high for four clocks the first time and two clocks the second time, and each run produces exactly one pulse. In vending-machine terms, a slow quarter and a fast quarter are each counted once.

## State Assignment and the Transition Table

To build the machine, each state needs a binary code. Three states need two flip-flops, $Q_1$ and $Q_0$, and this design uses

$$\text{LOW} = 00 \qquad \text{PULSE} = 01 \qquad \text{HIGH} = 10$$

Two flip-flops give four codes, so one code, 11, is never used. Writing every arc of the diagram as a row gives the transition table. The present code and the arc's value of L determine the next code $Q_1^+ Q_0^+$, and P comes from the present state alone.

| $Q_1$ | $Q_0$ | $L$ | $Q_1^+$ | $Q_0^+$ | $P$ |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 | 0 | 1 |
| 0 | 1 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 | 0 | 0 |
| 1 | 1 | × | d | d | d |

Read one row against the diagram to check it. In 10 (HIGH) with $L = 0$, the arc goes to LOW, so the next code is 00. Because the machine never enters 11, nothing it does there is specified by the design, and that row is all **don't-cares**, marked d.

With D flip-flops, the next code is exactly what goes on the D inputs, so $D_1$ is the $Q_1^+$ column and $D_0$ is the $Q_0^+$ column. A different state assignment would give a different table, different K-maps and a different circuit, but a machine that behaves the same way.

## The K-Maps

Each output gets a three-variable K-map with $Q_1$ on the rows and $Q_0 L$ on the columns in Gray order. The don't-cares from the unused state fill the two right-hand cells of the bottom row. The three maps show three different things a don't-care can do.

**$D_1$: the don't-care helps.**

| $Q_1$ \ $Q_0 L$ | 00 | 01 | 11 | 10 |
|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | d | d |

The two 1s are not adjacent to each other, but each is adjacent to the d at $Q_1 Q_0 L = 111$. Treating that d as a 1 gives two pairs, $Q_0 L$ and $Q_1 L$:

$$D_1 = Q_0 L + Q_1 L = L\,(Q_1 + Q_0)$$

Without the don't-care, $D_1$ would need two three-literal product terms.

**$D_0$: the don't-care cannot help.**

| $Q_1$ \ $Q_0 L$ | 00 | 01 | 11 | 10 |
|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 1 | 0 | 0 |
| 1 | 0 | 0 | d | d |

The single 1 has no neighboring 1 or d to pair with, so it stays a three-literal term:

$$D_0 = L\,\bar{Q}_1 \bar{Q}_0$$

In words, the machine enters PULSE only from LOW, and only when L is 1.

**$P$: the don't-care is refused on purpose.**

| $Q_1$ \ $Q_0 L$ | 00 | 01 | 11 | 10 |
|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 0 | 1 | 1 |
| 1 | 0 | 0 | d | d |

Here the two 1s and the two d's form a block of four, and taking it would give the smallest possible answer, $P = Q_0$. This design does not take it:

$$P = \bar{Q}_1 Q_0$$

## Why the Minimal Answer Is Not Used

A don't-care means "the specification does not care what happens here." But the hardware still does *something* in state 11, and it is worth asking what.

The machine never moves into 11 on its own, but flip-flops can power up holding any value. If the machine happens to wake up in 11 and the output is $P = Q_0$, P is 1 in that state. The machine produces a pulse at power-up for an event that never happened, and a vending machine would credit a coin nobody inserted. With $P = \bar{Q}_1 Q_0$, P is 0 in state 11, so no stray pulse is possible.

The next-state equations also take care of what happens next. In state 11, $D_1 = L(1 + 1) = L$ and $D_0 = L \cdot 0 \cdot 0 = 0$, so on the very next clock edge the machine moves to 00 (LOW) if L is 0 or to 10 (HIGH) if L is 1. Either way it is back in a legal state after one clock, and it never passes through PULSE to get there. A machine that always finds its way back into its legal states from an unused one is called **self-starting**.

The lesson goes beyond this circuit. K-map minimization finds the smallest logic that meets the specification, but the specification is silent about states that should never happen. In a state machine, the unused states are exactly where the hardware can wake up, so the right design is sometimes not the minimal one. Here it costs one extra AND input to make power-up safe.

## The Circuit

The three equations go in front of and behind two D flip-flops on a shared clock:

$$D_1 = L\,(Q_1 + Q_0) \qquad D_0 = L\,\bar{Q}_1 \bar{Q}_0 \qquad P = \bar{Q}_1 Q_0$$

- **Next-state logic for $D_1$:** an OR gate combines $Q_1$ and $Q_0$, and an AND gate combines that with L.
- **Next-state logic for $D_0$:** one three-input AND gate of L, $\bar{Q}_1$ and $\bar{Q}_0$.
- **Output logic for P:** one two-input AND gate of $\bar{Q}_1$ and $Q_0$.

No inverters are needed: each flip-flop supplies its complement on its $\bar{Q}$ pin. The flip-flop outputs feed back into the next-state logic, and in the interactive those feedback wires are drawn as labels, so a net named $Q_1$ at a gate input is the same wire as the $Q_1$ output of the flip-flop. Because P is computed from flip-flop outputs alone, it can only change on a clock edge, which is why the pulse is clean and exactly one clock wide.

## The Same Machine in Verilog

The flip-flop equations translate line for line.

```verilog
module level_to_pulse (
    input  wire clk,
    input  wire reset,
    input  wire L,
    output wire P
);
    reg Q1, Q0;                       // state register: LOW = 00, PULSE = 01, HIGH = 10

    always @(posedge clk)
        if (reset) {Q1, Q0} <= 2'b00;
        else begin
            Q1 <= L & (Q1 | Q0);      // D1
            Q0 <= L & ~Q1 & ~Q0;      // D0
        end

    assign P = ~Q1 & Q0;              // Moore output: high only in PULSE
endmodule
```

A testbench that releases reset and applies the same twelve values of L as the trace above prints the following (simulated with Icarus Verilog). Each line shows the input and state during that clock period.

```
clock  0: L=0  Q1Q0=00  P=0
clock  1: L=0  Q1Q0=00  P=0
clock  2: L=1  Q1Q0=00  P=0
clock  3: L=1  Q1Q0=01  P=1
clock  4: L=1  Q1Q0=10  P=0
clock  5: L=1  Q1Q0=10  P=0
clock  6: L=0  Q1Q0=10  P=0
clock  7: L=0  Q1Q0=00  P=0
clock  8: L=1  Q1Q0=00  P=0
clock  9: L=1  Q1Q0=01  P=1
clock 10: L=0  Q1Q0=10  P=0
clock 11: L=0  Q1Q0=00  P=0
```

The states match the hand trace (00 = LOW, 01 = PULSE, 10 = HIGH), and P is 1 on exactly two clocks, one for each rising edge of L.

## Key Takeaways

A level-to-pulse converter turns a signal that stays high for many clocks into a pulse exactly one clock wide, once per rising edge, so that one event is counted once. Three states do it: LOW waits, PULSE produces the pulse and can only be occupied for one clock, and HIGH waits out the rest of the level. Because P depends only on the state, the machine is a Moore machine, and the pulse comes one clock after the edge is seen. With the assignment LOW = 00, PULSE = 01, HIGH = 10, the unused code 11 becomes a row of don't-cares. The K-maps show don't-cares helping ($D_1 = L(Q_1 + Q_0)$), not helping ($D_0 = L\bar{Q}_1\bar{Q}_0$), and being deliberately refused ($P = \bar{Q}_1 Q_0$ rather than $P = Q_0$), so that a machine that powers up in 11 cannot emit a false pulse. From 11 the machine returns to a legal state on the next clock, so it is self-starting. Minimal logic is not always the logic you should build.

## Review Questions

**1. A coin sensor holds L high for five clock periods while one coin passes. How many clock periods is P high?**

A. Zero\
B. One\
C. Four\
D. Five

**2. Why can the machine never stay in the PULSE state for more than one clock?**

A. Its output P is 1\
B. It has no arc that leads back into itself\
C. It is the only state with an odd code\
D. The flip-flops reset it after one clock

**3. The machine is in HIGH (10) and samples $L = 1$. What is the next state?**

A. LOW (00)\
B. PULSE (01)\
C. HIGH (10)\
D. The unused code (11)

**4. On the P K-map, using the two don't-cares would give $P = Q_0$. Why does the design use $P = \bar{Q}_1 Q_0$ instead?**

A. $P = Q_0$ gives the wrong output in the PULSE state\
B. $P = Q_0$ needs more gates than $P = \bar{Q}_1 Q_0$\
C. With $P = Q_0$, a power-up into state 11 would produce a false pulse\
D. Don't-cares can only be used in next-state maps, never in output maps

**5. The machine powers up in the unused state 11 with $L = 0$. What happens at the next clock edge?**

A. It stays in 11 until reset is applied\
B. It moves to PULSE and produces a pulse\
C. It moves to HIGH and waits for L to fall\
D. It moves to LOW, with P = 0 throughout

## Answer Explanations

**1. B.** That is the whole point of the converter. On the first edge where L is 1, the machine moves from LOW to PULSE and P goes high. On the next edge L is still 1, so the machine moves to HIGH and P drops. It stays in HIGH for the rest of the level. Five clocks of L produce one clock of P. Answer D is what a circuit that simply copied L would give.

**2. B.** Every arc out of PULSE leads somewhere else: to HIGH if L is 1 and to LOW if L is 0. With no self-loop, one clock edge always moves the machine out. P being 1 (A) is the consequence, not the cause, and nothing resets the flip-flops (D) during normal operation.

**3. C.** HIGH means "L has stayed high since the pulse," so while L remains 1 the machine stays in HIGH. Going back to PULSE (B) would produce a second pulse for the same event, which is exactly what the converter exists to prevent.

**4. C.** The two forms agree on every legal state. They differ only in state 11, where $P = Q_0$ is 1 and $P = \bar{Q}_1 Q_0$ is 0. The machine never enters 11 by itself, but it can power up there, and a false pulse at power-up would count an event that never happened. Answer B has it backwards: $P = Q_0$ is the *smaller* expression, which is why refusing it is a deliberate choice.

**5. D.** In state 11, $D_1 = L(Q_1 + Q_0) = 0$ and $D_0 = L\bar{Q}_1\bar{Q}_0 = 0$ when L is 0, so the next state is 00, LOW. P is $\bar{Q}_1 Q_0 = 0$ in state 11 and in LOW, so no pulse is produced. If L had been 1, the machine would have gone to HIGH instead (C), still without a pulse.
