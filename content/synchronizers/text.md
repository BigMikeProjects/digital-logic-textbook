Every flip-flop in a well-designed circuit gets its D input from logic driven by the same clock, and the timing rules of this section make sure that input never changes inside the decision window. Some inputs cannot be held to those rules. A person pressing a button has no idea where the clock is, and neither does a sensor or a signal arriving from another system. Sooner or later such an input will change inside a decision window. A **synchronizer** is the small circuit that makes this harmless. It is only two flip-flops, and it is the last piece of reliable sequential design in this section.

Metastable States explained what can go wrong inside a single flip-flop when D changes at the wrong moment. This topic starts one level up, with what goes wrong in a state machine, and then shows how a synchronizer fixes it and what the fix costs.

## An Input That Ignores the Clock

An input that does not come from the circuit's own clock is called an **asynchronous input**. It can change at any instant. The examples throughout this topic use the same round numbers as the rest of the section: a clock period $T = 10$ ns (a 100 MHz clock), a setup time $t_{su} = 1$ ns, a hold time $t_h = 0.5$ ns, and a clock-to-output delay $t_{co} = 1$ ns.

Take a push button, A. When it changes well before a clock edge, setup time is met and every flip-flop that looks at A reads the new value. When it changes after the decision window, hold time is met and every flip-flop keeps the old value and reads the new one at the next edge. Both are fine. The trouble is the third case, a change inside the window, from $t_{su}$ before the edge to $t_h$ after it. Then a flip-flop may read the old value or the new one.

The window is narrow, but it comes around on every clock edge. Here it is 1.5 ns out of every 10 ns, or 15% of the period, so about one press in seven lands inside it. A faster clock has more edges every second and gives a button even more chances to hit one.

## How a State Machine Breaks

One flip-flop reading the old value instead of the new one is not a disaster: the change is a clock period late. The real danger comes when A feeds the next-state logic of a state machine, because then **several flip-flops read A at once, and each one decides separately.**

Consider a machine that steps $00 \rightarrow 01 \rightarrow 10 \rightarrow 00$ while $A = 1$ and holds its state while $A = 0$. State 11 is unused. Its next-state equations are

$$D_1 = S_1\bar{A} + S_0A \qquad D_0 = S_0\bar{A} + \bar{S_1}\,\bar{S_0}\,A$$

In state 01 these reduce to $D_1 = A$ and $D_0 = \bar{A}$. The diagram allows two next states: 01 if A is 0, and 10 if A is 1.

Now let A go from 0 to 1 inside the decision window. Flip-flop $S_1$ may read A as 0 or as 1, and so may flip-flop $S_0$, independently. That gives four possibilities.

| $S_1$ reads A as | $S_0$ reads A as | Next state | Result |
|:-:|:-:|:-:|---|
| 1 | 1 | 10 | correct: the $A = 1$ arc |
| 0 | 0 | 01 | correct: the $A = 0$ arc |
| 1 | 0 | 11 | wrong: not a state |
| 0 | 1 | 00 | wrong: there is no arc from 01 to 00 |

Two of the four outcomes are wrong. The machine either follows an arc that is not in its state diagram or lands in a state the design never uses. Nothing in the diagram describes what happens next. And this is before metastability: rarely, a flip-flop caught this way will also hover between 0 and 1 before it settles, which only makes matters worse. The conclusion is that an asynchronous input must never go straight into a state machine.

## Two Flip-Flops and a Clock Period of Waiting

The fix is to let exactly one flip-flop look at the outside world, and then to give it time before anyone looks at that flip-flop. A synchronizer is two D flip-flops connected back to back on the circuit's own clock. The first, FF1, takes the asynchronous input A. The second, FF2, takes FF1's output Q1. The rest of the circuit uses FF2's output Q2, the **synchronized** copy of A.

```verilog
module synchronizer (
    input  wire clk,
    input  wire a,         // asynchronous: can change at any instant
    output reg  q2         // the synchronized copy of a
);
    reg q1;                // FF1: the flip-flop that may go metastable

    always @(posedge clk) begin
        q1 <= a;           // FF1 samples the outside world
        q2 <= q1;          // FF2 samples FF1 a full clock period later
    end
endmodule
```

A simulation with a 10 ns clock, rising edges at 5, 15, 25 ns and so on, and A pressed at 12 ns, shows the effect. Each line is printed 1 ns after the edge it names.

```text
edge at 5 ns: a=0 q1=0 q2=0
edge at 15 ns: a=1 q1=1 q2=0
edge at 25 ns: a=1 q1=1 q2=1
edge at 35 ns: a=1 q1=1 q2=1
```

The first edge after the press puts A into Q1. Q2 follows one edge later. A simulator never goes metastable, so this run shows only the delay; the protection is in what happens to Q1 during that extra clock period.

Suppose A changes inside FF1's decision window. FF1 may take the new value, keep the old one, or hover for a while before settling. Whatever it does, nothing reads Q1 until FF2's own decision window opens, $t_{su}$ before the next edge. Counted from the edge that caught A, that deadline is

$$T - t_{su} = 10 - 1 = 9 \text{ ns}$$

There is no $t_{co}$ to subtract and no logic delay, because nothing sits between the two flip-flops. Q1 gets nearly the whole period to settle. Metastable States showed that most stalls are over almost at once and long ones are rapidly rarer, so 9 ns is far more than a hover normally needs.

Once Q1 has settled, either result is fine:

- **Q1 settled to 1, the new A.** FF2 reads a steady 1 at the next edge, and Q2 rises at $T + t_{co} = 11$ ns.
- **Q1 settled to 0, the old A.** Then A is still 1 at the next edge, and well outside that edge's window, so FF1 reads it cleanly. Q2 rises one clock later, at $2T + t_{co} = 21$ ns.

Either way, Q2 changes only at a clock edge, it changes once, and every part of the circuit that reads Q2 sees the same value. That is all the state machine needed. The only question left is *when* the press arrives, and that has become a matter of one clock period more or less.

It is worth being honest about the limit. A hover that lasted past 9 ns would still reach FF2 unsettled. That is extremely rare, but it is not impossible. A synchronizer makes the risk negligible, not zero.

## The Cost Is Latency

A synchronizer delays the input. The delay from a change on A to the same change on Q2 is its **latency**, and it is between one and two clock periods. Which one you get depends on where the press fell, and you cannot choose.

| A changes, relative to FF1's clock edge | First edge that reads the new A | Q2 rises at | Latency |
|:-:|:-:|:-:|:-:|
| −1.5 ns (just before the window) | 0 ns | 11 ns | 12.5 ns |
| +1 ns (just after the window) | 10 ns | 21 ns | 20 ns |

Moving the press by only 2.5 ns makes the answer arrive a whole clock period later. For buttons and sensors this does not matter at all. A human press lasts milliseconds, which is millions of clock periods, so a delay of one more is invisible. The coin sensor L in Level-to-Pulse FSM is exactly this kind of input. The rule given in Mealy versus Moore, use a Moore machine unless the inputs are known to be synchronized, is this topic applied: a Mealy output follows its inputs directly, so an unsynchronized input passes straight through to the output.

When the clock is very fast, the period may not leave enough settling time even for a synchronizer. The remedy is a third flip-flop in the chain. Each added flip-flop gives one more full clock period of settling and makes a failure far less likely again, at the price of one more clock period of latency.

## Three Rules for Using a Synchronizer

**Synchronize every asynchronous input.** Buttons, switches, sensors and signals from a circuit running on another clock all qualify. None of them goes straight into a state machine.

**Synchronize each input once, then fan out the synchronized copy.** It is tempting to give each part of the design its own synchronizer on the same signal. But two synchronizers on one signal can disagree for a clock period, one catching the change at this edge and the other at the next. Two parts of the design then see different values of the same input, which is the state-machine failure from the start of this topic all over again.

**Connect the two flip-flops back to back, with no logic between them.** Any gate between FF1 and FF2 would use up part of the clock period, and Q1 needs all of it to settle.

## Key Takeaways

An asynchronous input, such as a push button, a sensor or a signal from another system, can change at any instant, and eventually it will change inside a flip-flop's decision window. Wired straight into a state machine, it can be read as 0 by one flip-flop and as 1 by another, sending the machine along an arc that is not in its diagram or into an unused state. A synchronizer prevents this with two D flip-flops back to back on the circuit's clock. FF1 is the only flip-flop that sees the outside world, and FF2 does not look at Q1 until $T - t_{su}$ after the edge, which gives any metastable state almost a full clock period to settle. Whichever way FF1 decides, Q2 changes cleanly at a clock edge and every reader sees the same value. The price is a latency of one to two clock periods, which is irrelevant for human-speed inputs. A very fast clock may call for a third flip-flop. The risk becomes negligible, though never exactly zero. Synchronize every asynchronous input, synchronize each one only once, and keep logic out from between the two flip-flops.

## Review Questions

**1. Why is it dangerous to connect a push button directly to the next-state logic of a state machine?**

A. A push button produces a voltage too high for the flip-flops\
B. Two flip-flops can read the same press differently, sending the machine to a state its diagram does not allow\
C. The state machine will ignore every press that occurs between clock edges\
D. The button's signal is too slow for the clock

**2. What is a synchronizer?**

A. A gate that blocks an input while the clock is high\
B. A circuit that makes the clock wait for the input\
C. Two D flip-flops connected back to back on the circuit's own clock\
D. A flip-flop with a wider decision window

**3. With $T = 10$ ns and $t_{su} = 1$ ns, how long after the clock edge does FF1's output have to settle before FF2 reads it?**

A. 1 ns\
B. 8 ns\
C. 9 ns\
D. 10 ns

**4. A changes inside FF1's decision window, and FF1 settles to the old value. What happens?**

A. The press is lost permanently\
B. FF1 reads the new value cleanly at the next edge, so Q2 changes one clock period later\
C. Q2 goes metastable\
D. The state machine enters an unused state

**5. What is the cost of using a two-flip-flop synchronizer?**

A. A latency of one to two clock periods\
B. The clock must run at half speed\
C. The input can only change once per second\
D. Metastability is moved into the state machine instead

**6. A design uses one input, a sensor, in two different state machines. What is the correct way to synchronize it?**

A. Give each state machine its own synchronizer\
B. Synchronize it once and send the synchronized copy to both machines\
C. Synchronize it only for the machine with the faster clock\
D. Put an AND gate between the two synchronizer flip-flops

## Answer Explanations

**1. B.** The press can land inside the decision window, where each flip-flop may read the old or the new value on its own. In the example machine, two of the four combinations led to a missing arc or the unused state 11. A press between edges is not ignored (C); it is read at the next edge, which is fine if every flip-flop reads it the same way.

**2. C.** A synchronizer is two flip-flops in a chain, both clocked by the circuit's own clock. FF1 takes the asynchronous input and FF2 hands the rest of the circuit a copy that changes only at clock edges. It does not change the clock (B) or the flip-flop's decision window (D).

**3. C.** FF2's decision window opens $t_{su}$ before the next edge, at $T - t_{su} = 10 - 1 = 9$ ns. No $t_{co}$ or logic delay comes off it, because nothing sits between FF1 and FF2.

**4. B.** Settling to the old value is not a failure. A is still at its new value at the next edge, and that change is now well outside the window, so FF1 reads it cleanly and Q2 follows one clock later. The press arrives a clock period later than it might have, and nothing worse happens.

**5. A.** The synchronized output follows the input one to two clock periods late, and the exact delay depends on where the change fell relative to the clock. The clock speed is unchanged (B), and the point of the circuit is to keep metastability out of the state machine (D).

**6. B.** Two separate synchronizers on the same signal can disagree for a clock period, with one catching the change at one edge and the other at the next. That reproduces the original problem, two parts of the design reading the same input differently. Synchronize once and fan out the copy. Logic between the two flip-flops (D) would eat into the settling time.
