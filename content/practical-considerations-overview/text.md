Every state machine so far has been designed with an ideal clock. The rising edge was a single instant, every flip-flop saw it at the same moment, and whatever sat on a flip-flop's D input just before that instant was read perfectly. That picture is what makes state tables and state diagrams work, and it is very nearly true. This topic looks at the part that is not, because the difference decides how fast a real circuit can be clocked and whether it can be trusted.

The idea to carry through this whole section is that a real flip-flop does not read D at an instant. It needs D to hold still for a short stretch of time around the clock edge. As long as D never changes inside that stretch, everything you have learned about state machines holds exactly. The three topics that follow, Clock Skew, Metastable States and Synchronizers, are each about one way a change can land there and what to do about it.

## The Decision Window

Draw a rising clock edge honestly and it has a slope. The clock is very fast, but it does not get from 0 to 1 in zero time, and the flip-flop's internal circuitry needs a little time on either side of the edge to decide what it saw. The result is a **decision window**: a short interval that starts a little before the clock edge and ends a little after it. D must not change inside it.

The window is described by two numbers that come from the flip-flop itself. The **setup time**, $t_{su}$, is how long D must be steady before the clock edge. The **hold time**, $t_h$, is how long D must stay steady after it. The window runs from $t_{su}$ before the edge to $t_h$ after, so its width is $t_{su} + t_h$. The D Flip-Flop topic mentioned that D must be settled before the edge and held after it; the window is the picture of that sentence.

The examples in this section use round numbers: a setup time of 1 ns and a hold time of 0.5 ns, which gives a window 1.5 ns wide. Suppose D changes from 0 to 1 somewhere near a clock edge. What the flip-flop does depends on where the change falls:

| When D changes | What Q does |
|:--|:--|
| At least 1 ns before the edge (before the window) | Takes the new value, shortly after the edge |
| Inside the window | Not guaranteed |
| 0.5 ns or more after the edge (after the window) | Keeps the old value; the new one is picked up at the next edge |

The first row is the case every design aims for. The data arrived in good time, and the flip-flop captures it. The third row is also fine. D changed after the flip-flop had finished deciding, so the flip-flop keeps its old value for this clock period, and the new value will be waiting, long since settled, at the next edge. In a working circuit this is usually just what should happen: the change was produced by this very clock edge and is meant for the next one.

The middle row is the one to avoid. When D changes inside the window, the flip-flop might capture the new value, or it might capture the old one, and there is no way to say which. Worse, it might do neither cleanly and enter a **metastable state**, in which Q hovers between 0 and 1 for a while before it finally settles to one of them. A design is reliable only if this never happens, and the rest of this section is about making sure that it does not.

## The Timing Parameters

Five quantities describe the timing of a clocked circuit. They appear in every timing problem, so it is worth fixing the symbols now.

| Symbol | Name | What it measures | Value used here |
|:-:|:--|:--|:-:|
| $T$ | clock period | From one rising clock edge to the next | 10 ns |
| $t_{co}$ | clock-to-output delay | From the clock edge until Q shows the new value | 1 ns |
| $t_{pd}$ | logic propagation delay | How long the logic between two flip-flops takes to settle after its inputs change | 5 ns |
| $t_{su}$ | setup time | How long D must be steady before the clock edge | 1 ns |
| $t_h$ | hold time | How long D must stay steady after the clock edge | 0.5 ns |

The clock period and the clock frequency are two ways of stating the same thing, since $f = 1/T$. A longer period is a slower clock. Raising the frequency shortens the period, and that leaves less time for everything that has to happen between one edge and the next.

The clock-to-output delay belongs to the flip-flop. A flip-flop does not change its output at the instant of the clock edge; Q shows the new value a short time later. One caution if you look this number up: FPGA datasheets often quote a clock-to-output time measured at the pins of the chip. That figure is larger, because it includes clock wiring and the output circuitry that drives the pin. In this section $t_{co}$ always means the delay of the flip-flop alone.

The propagation delay belongs to the combinational logic. In a state machine this is the next-state logic sitting between the flip-flop outputs and the flip-flop inputs. Every layer of gates a signal must pass through adds to it, so deeper logic means a larger $t_{pd}$.

These values are on the scale of the Basys 3 board used in the lab, rounded for easy arithmetic. Its clock runs at 100 MHz, which is a period of 10 ns, and its flip-flop times are about a nanosecond or less. Faster technology shrinks everything in proportion:

| | Basys 3 board | Inside a 5 GHz processor |
|:--|:-:|:-:|
| Clock period $T$ | 10 ns (100 MHz) | 200 ps |
| Flip-flop times $t_{co}$, $t_{su}$, $t_h$ | about a nanosecond or less | tens of picoseconds |

One nanosecond is 1000 picoseconds, so the processor's entire clock period is one-fiftieth of the board's. The decision window is a fraction of that period, and every requirement in this topic gets correspondingly harder to meet as the clock gets faster. The ideas do not change.

## How the Window Limits the Clock Speed

Consider the basic arrangement inside any synchronous circuit: one flip-flop, some combinational logic, and a second flip-flop, both flip-flops on the same clock. A state machine is this arrangement folded back on itself, with the next-state logic feeding the same flip-flops it reads from.

Follow one clock period. At the rising edge the first flip-flop captures its input, and $t_{co}$ later its Q output changes. That change now works its way through the logic, which takes $t_{pd}$. The result arrives at the D input of the second flip-flop, and it has to get there before that flip-flop's decision window opens, which is $t_{su}$ before the next edge. All three delays must fit inside one clock period:

$$T \ge t_{co} + t_{pd} + t_{su}$$

Whatever time is left over is called the **slack**:

$$\text{slack} = T - (t_{co} + t_{pd} + t_{su})$$

With the values above, the three delays add up to $1 + 5 + 1 = 7$ ns against a period of 10 ns, so the slack is 3 ns. The data arrives at the second flip-flop 3 ns before it needs to.

Slack is the design's margin. Positive slack means the data settles before the window opens. Zero slack means the setup time is only just met, with nothing to spare if a delay turns out slightly longer than expected. Negative slack means D is still changing when the window opens, and the flip-flop is in the unpredictable middle row of the earlier table. A reliable design keeps a reasonable amount of positive slack. A very large amount is safe, but it means the circuit could have been clocked faster.

Setting the slack to zero gives the shortest period this circuit can run at, and from that the highest clock frequency:

$$T_{min} = t_{co} + t_{pd} + t_{su} = 7 \text{ ns} \qquad f_{max} = \frac{1}{T_{min}} = \frac{1}{7 \text{ ns}} \approx 142.9 \text{ MHz}$$

There are two ways to use up the slack, and they amount to the same thing.

The first is to speed up the clock. It is tempting to make a design run faster by simply clocking it faster, and that works for as long as there is slack to spend. Keep the logic at 5 ns and shorten the period:

| $T$ | $t_{co} + t_{pd} + t_{su}$ | Slack | Result |
|:-:|:-:|:-:|:--|
| 10 ns | 7 ns | 3 ns | Reliable |
| 8 ns | 7 ns | 1 ns | Works, with little margin |
| 7 ns | 7 ns | 0 ns | Setup only just met |
| 6 ns | 7 ns | −1 ns | D changes inside the window |

The second is to make the logic slower. Suppose the clock period is 8 ns, where 5 ns of logic leaves 1 ns of slack, and a design change adds another layer of gates:

| $t_{pd}$ | $t_{co} + t_{pd} + t_{su}$ | Slack at $T = 8$ ns | Result |
|:-:|:-:|:-:|:--|
| 5 ns | 7 ns | 1 ns | Works, with little margin |
| 6 ns | 8 ns | 0 ns | Setup only just met |
| 7 ns | 9 ns | −1 ns | D changes inside the window |

Each extra nanosecond of logic costs a nanosecond of clock period. In both tables the failure is the same one, and it has a single description: **the logic is too slow for the clock**. The cure is equally simple to state. Either lengthen the clock period or shorten the path through the logic.

## Three Ways into the Window

A change on D can end up inside the decision window for three different reasons.

**The logic is too slow for the clock.** This is the case just worked through. The data is still on its way through the gates when the window opens, either because the clock was made faster or because logic was added. It is entirely under the designer's control, through the choice of clock period and the depth of the logic.

**The clock does not reach every flip-flop at the same time.** The inequality above assumed that both flip-flops see the clock edge at the same moment. In a real circuit the clock travels along wires of different lengths to reach different flip-flops, so the edge may arrive at the second flip-flop a little earlier or later than at the first. The difference is called **clock skew**. Its effect is to move the second flip-flop's window relative to the data, and a window that moves can land on a change that would otherwise have been safely clear of it. This is the subject of Clock Skew.

**The input does not come from this clock at all.** A push button, a sensor or a signal from another system knows nothing about the circuit's clock. It can change at any moment, including inside a decision window. Any single change will probably miss, because the window is a small part of the clock period. With the round numbers used here, the window occupies

$$\frac{t_{su} + t_h}{T} = \frac{1.5 \text{ ns}}{10 \text{ ns}} = 15\%$$

of each period, so about one change in seven lands inside it. A real flip-flop's window is narrower than these rounded values and its percentage is smaller. What matters is that the percentage is never zero. Slowing the clock makes a hit less likely per change, but no clock period makes it impossible, and an input that changes often enough will hit the window eventually.

When an unsynchronized input does change inside the window, the most likely outcome is harmless in itself but unpredictable: the flip-flop sees the change either on this clock edge or on the next one, and you cannot tell which. The rarer and more serious outcome is a metastable state. Metastable States explains what that is and why it cannot be designed away, and Synchronizers presents the standard circuit that reduces the risk to a negligible level.

The first cause is different in kind from the other two. Slow logic is fixed by arithmetic: add up the delays and choose the clock period to suit. Skew and unsynchronized inputs need techniques of their own, which is why each gets its own topic.

## Key Takeaways

A real flip-flop needs its D input to be steady for a short decision window around the clock edge, from the setup time $t_{su}$ before the edge to the hold time $t_h$ after it. A change before the window is captured, a change after it is ignored until the next edge, and a change inside it gives an unpredictable result that may include a metastable state. For data passing from one flip-flop through logic to another, the clock-to-output delay, the logic propagation delay and the setup time must all fit in one clock period, $T \ge t_{co} + t_{pd} + t_{su}$, and the time left over is the slack. Positive slack is the margin that makes a design reliable, and setting it to zero gives the minimum clock period and the maximum clock frequency. Speeding up the clock and adding logic both use up slack, and both fail in the same way: the logic becomes too slow for the clock. Changes can also land in the window because the clock reaches different flip-flops at different times, which is clock skew, or because an input does not come from the circuit's clock at all, in which case no choice of clock period can keep it out.

## Review Questions

**1. A flip-flop has a setup time of 1 ns and a hold time of 0.5 ns. Its D input changes 0.3 ns before the rising clock edge. What happens to Q?**

A. Q takes the new value, because D changed before the edge\
B. Q keeps the old value, because D changed too late\
C. The result is not guaranteed, because D changed inside the decision window\
D. Q takes the new value after a delay of 0.3 ns

**2. The same flip-flop's D input changes 2 ns after the rising clock edge and then stays steady. The clock period is 10 ns. What happens?**

A. Q keeps the old value until the next clock edge, where the new value is captured\
B. Q changes 2 ns after the edge\
C. The flip-flop enters a metastable state\
D. The new value is lost

**3. A circuit has $t_{co} = 1$ ns, $t_{pd} = 4$ ns and $t_{su} = 1$ ns. What is the slack with a clock period of 10 ns?**

A. 3 ns\
B. 4 ns\
C. 5 ns\
D. 6 ns

**4. For the circuit in question 3, what is the maximum clock frequency?**

A. 100 MHz\
B. About 142.9 MHz\
C. About 166.7 MHz\
D. 250 MHz

**5. A design has 1 ns of slack. A change to the next-state logic adds 2 ns of propagation delay, and the clock is left alone. What is the result?**

A. Nothing changes, because the clock period is the same\
B. The slack becomes −1 ns, so D can change inside the decision window\
C. The slack becomes 3 ns\
D. The hold time is violated but the setup time is still met

**6. A push button is wired directly to the D input of a flip-flop. Why can no choice of clock period guarantee that the button never changes inside the decision window?**

A. Push buttons are too slow for a 100 MHz clock\
B. The button's changes have no relationship to the clock, so they can occur at any moment\
C. The setup time grows as the clock period grows\
D. A longer clock period makes the decision window wider

## Answer Explanations

**1. C.** The decision window runs from 1 ns before the edge to 0.5 ns after it. A change 0.3 ns before the edge is inside the window, so the setup time has not been met. Q might take the new value, keep the old one, or go metastable. Changing before the edge is not enough; D has to change before the window.

**2. A.** The window closed 0.5 ns after the edge, so a change at 2 ns is well clear of it. The flip-flop has already made its decision and keeps the old value. The new value then sits steady on D for the remaining 8 ns of the period, far longer than the setup time, and is captured cleanly at the next edge.

**3. B.** The three delays add up to $1 + 4 + 1 = 6$ ns. The slack is what remains of the period: $10 - 6 = 4$ ns.

**4. C.** The minimum period is the sum of the three delays, 6 ns, which is the period at which the slack is zero. The maximum frequency is $1/(6 \text{ ns}) \approx 166.7$ MHz. The 142.9 MHz figure belongs to the example in the text, which has 5 ns of logic and a 7 ns minimum period.

**5. B.** Each nanosecond of added logic delay removes a nanosecond of slack, so $1 - 2 = -1$ ns. Negative slack means the data is still changing when the window opens before the next edge. This is a setup problem: the logic is now too slow for the clock.

**6. B.** The button is pressed by a person who cannot see the clock, so its changes fall at random moments in the clock period. The window takes up a fraction $(t_{su} + t_h)/T$ of every period. A longer period makes that fraction smaller but never zero, and the window's width does not depend on the period at all, which rules out C and D.
