A **registered output** is an output that comes straight off a flip-flop, with no logic after it. Because a flip-flop's output can only change at a clock edge, a registered output can only change at a clock edge too. It never follows an input between edges, and it never carries the brief stray pulses that gates produce while their inputs are changing.

This topic starts from the weakness found in Mealy versus Moore: the Mealy level-to-pulse machine lets its input reach its output through a single gate, so a glitch on the input becomes a false pulse on the output. Putting one flip-flop on the output fixes that, at a price. The topic then looks at what the resulting machine actually is, and at a subtler problem that affects every output with logic in front of it, Moore as well as Mealy, which matters as soon as the output is read by a system running on a different clock.

## The Mealy Output Follows Its Input

The Mealy version of the level-to-pulse converter needs one flip-flop and one AND gate. The flip-flop $Q$ remembers what the level input $L$ was at the last clock edge, and the AND gate asks whether $L$ is high now and was low at the last edge:

$$D = L \qquad P = L\,\overline{Q}$$

That is what makes it fast. The pulse appears in the same clock cycle in which $L$ rises, one clock sooner than the Moore machine can manage. It is also what makes it fragile. One input of the AND gate is $L$ itself and its output is $P$, so nothing clocked stands between the input and the output.

Suppose the machine is resting with $L = 0$, so $Q = 0$ and $\overline{Q} = 1$. In that state the gate computes $P = L \cdot 1 = L$, and the output is simply a copy of the input. If noise makes $L$ blip high for a moment in the middle of a clock cycle and then drop back before the next edge, the machine's state never changes, because no edge ever saw $L = 1$. The blip still passes straight through the AND gate and appears on $P$ as a pulse. The machine has reported a rising edge of the level that never happened.

## One Flip-Flop on the Output

The fix is to put a second flip-flop between the AND gate and the output. The gate still computes $L\,\overline{Q}$, but now that value is only captured at a clock edge, and the output is the flip-flop that holds it:

$$D_Q = L \qquad D_P = L\,\overline{Q} \qquad \text{output} = P$$

Run the same blip through this circuit. It comes and goes between two edges. The AND gate's output does flicker, but the flip-flop on $P$ is not looking at that moment. At the next edge $L$ is back to 0, the gate's output is 0, and the flip-flop loads 0. The output never moves.

There is an honest limit to this. A flip-flop guards against changes *between* clock edges, not at them. If a blip happens to still be present at the instant of an edge, the flip-flop captures it, and the output shows a pulse a full clock wide. A short glitch is unlikely to line up with an edge, so the protection is a matter of probability rather than a guarantee. Making an input safe to sample at all is a different job, the one done by a synchronizer, covered in Synchronizers.

## What It Costs

The registered output only changes at an edge, and the AND gate's answer has to wait for the next edge to be captured. So the pulse that the Mealy machine produced in the cycle where $L$ rose now appears one cycle later. Run all three machines on the input used in Mealy versus Moore:

| Clock | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $L$ | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 0 | 0 |
| $P$ Mealy | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| $P$ registered | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| $P$ Moore | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |

The registered pulse is exactly the Moore pulse: clocks 3 and 9, one clock after the Mealy pulses in clocks 2 and 8. Registering the output gives back the Mealy machine's head start. What it keeps is the glitch-free output and a pulse that is always exactly one clock wide.

## What the Registered Machine Really Is

The registered circuit has two flip-flops, $Q$ and $P$. Treat the pair $(Q, P)$ as the state and read off what the circuit does. The next value of $Q$ is $L$ and the next value of $P$ is $L\,\overline{Q}$:

| Present $(Q, P)$ | $L = 0$ | $L = 1$ | Output $P$ |
|:-:|:-:|:-:|:-:|
| 00 | 00 | 11 | 0 |
| 11 | 00 | 10 | 1 |
| 10 | 00 | 10 | 0 |

The fourth code, 01, never occurs: $P$ can only be 1 at an edge where $L$ is 1, and that same edge loads a 1 into $Q$. Now compare the three rows with the Moore level-to-pulse machine. From 00 a 0 stays put and a 1 starts the pulse; from 11 the machine always leaves after one clock; from 10 it stays while $L$ is 1. Name the codes

$$\text{LOW} = 00 \qquad \text{PULSE} = 11 \qquad \text{HIGH} = 10$$

and every arc matches the Moore diagram exactly. The output depends only on the state, so this is a **Moore machine**, and because the output is one of the state bits it needs no output logic at all.

That is the real lesson of the construction. The registered Mealy design is the Moore design with a different state assignment, one in which the output is a flip-flop. Level-to-Pulse FSM chose LOW = 00, PULSE = 01, HIGH = 10 and needed an AND gate, $P = \overline{Q_1}\,Q_0$, to produce the output. Starting from the Mealy machine and registering its output found an assignment where that gate disappears.

## Glitches After the Clock Edge

It is tempting to conclude that synchronized inputs are the whole answer: if $L$ comes from a flip-flop on the same clock, it changes only just after an edge and cannot blip in the middle of a cycle. That does remove the input glitch. It does not make an output with logic in front of it clean, and this applies to Moore machines too.

Signals that change on the same clock edge do not change at the same instant. Each flip-flop has its own clock-to-output delay, and the wires and gates after it add their own. Consider a Moore output that decodes one state with an AND gate,

$$Z = Q_1\,Q_0$$

so that $Z = 1$ only in state 11. In the Moore level-to-pulse machine, which never enters 11, $Z$ should be 0 forever. But on the edge where the machine moves from PULSE to HIGH, the state goes from 01 to 10: $Q_1$ rises and $Q_0$ falls. If $Q_1$ gets there first, the gate sees $Q_1 Q_0 = 11$ for a sliver of a nanosecond, and $Z$ pulses even though it is 0 both before and after the edge. A Mealy output has the same hazard, plus the input path described above.

Whether this sliver matters depends on who reads $Z$. Flip-flops on the same clock never see it. They sample only at their own edges, and by the time the next edge arrives the gate has long since settled. That is why a synchronous design can tolerate these glitches everywhere inside it. A system running on a *different* clock is another matter. Its edges fall at arbitrary moments relative to yours, so sooner or later one of them lands on the sliver and captures a pulse that never existed. The same is true of an output that drives a chip pin, an asynchronous reset or anything else that reacts to levels rather than sampling at your edges.

A registered output does not have this problem. It is a flip-flop output with nothing after it, so it makes one clean change just after each edge and is steady the rest of the time.

## Outputs That Cross a Clock Domain

When a signal leaves one clock domain for another, two different things can go wrong, and each has its own fix.

| Fix | What it solves | Where it goes |
|---|---|---|
| Registered output | glitches on an output | on the sending side, at the output |
| Synchronizer | an input from outside the clock domain | on the receiving side, at the input |

The two are used together: **register the signal before it leaves, and synchronize it when it arrives.** Neither alone is enough. A synchronizer on the receiving side can pass a sending-side glitch straight through as a valid pulse, because the glitch may be present at the receiver's edge. A registered output on its own is clean, but it still changes just after the sender's edge, which is an arbitrary moment for the receiver, so to the receiver it is an asynchronous input that can leave its flip-flop hovering in a metastable state. Registering removes the false pulses; synchronizing makes the clean signal safe to sample.

Both fixes as described here are for single-bit signals. A value several bits wide needs more than one synchronizer per bit to cross safely, a point taken up in Synchronizers. Most of this goes beyond a first digital logic course, but the problem is real, and it shows up the first time two systems with different clocks are connected.

## The Registered Machine in Verilog

In Verilog the registered output is simply a second register assigned in the clocked block. The AND gate's value is never given a name of its own; it exists only as the expression the flip-flop on $P$ loads.

```verilog
// Level-to-pulse, Mealy logic with a registered output
module l2p_registered (
    input  wire clk,
    input  wire L,
    output reg  P        // registered: straight off a flip-flop
);
    reg Q;                // L at the last clock edge

    always @(posedge clk) begin
        Q <= L;           // D = L
        P <= L & ~Q;      // the Mealy output, captured at the edge
    end
endmodule
```

Both assignments use nonblocking `<=`, so on each edge $P$ is computed from the old value of $Q$, exactly as the two-flip-flop circuit does. A testbench that drives $L$ = 0 0 1 1 1 1 0 0 1 1 0 0, changing $L$ just after each edge and printing in the middle of each cycle, prints the following (simulated with Icarus Verilog). The `mealy` column is $L\,\overline{Q}$, what the unregistered Mealy output would be during that cycle.

```
cycle  0: L=0  Q=0  mealy=0  P=0  (Q,P)=00
cycle  1: L=0  Q=0  mealy=0  P=0  (Q,P)=00
cycle  2: L=1  Q=0  mealy=1  P=0  (Q,P)=00
cycle  3: L=1  Q=1  mealy=0  P=1  (Q,P)=11
cycle  4: L=1  Q=1  mealy=0  P=0  (Q,P)=10
cycle  5: L=1  Q=1  mealy=0  P=0  (Q,P)=10
cycle  6: L=0  Q=1  mealy=0  P=0  (Q,P)=10
cycle  7: L=0  Q=0  mealy=0  P=0  (Q,P)=00
cycle  8: L=1  Q=0  mealy=1  P=0  (Q,P)=00
cycle  9: L=1  Q=1  mealy=0  P=1  (Q,P)=11
cycle 10: L=0  Q=1  mealy=0  P=0  (Q,P)=10
cycle 11: L=0  Q=0  mealy=0  P=0  (Q,P)=00
```

The Mealy value is high in cycles 2 and 8, and the registered $P$ follows one clock later in cycles 3 and 9. The $(Q, P)$ column walks through 00, 11, 10 and back to 00, which is LOW, PULSE, HIGH and LOW, and 01 never appears.

## Key Takeaways

A registered output comes straight off a flip-flop, so it changes only at clock edges and carries no glitches from logic. Putting one flip-flop on the Mealy level-to-pulse output, $D_P = L\,\overline{Q}$, stops input blips between edges from reaching $P$, though a blip that is present at an edge is still captured; making inputs safe to sample is the synchronizer's job. The price is the Mealy head start: the registered pulse arrives one clock later, at the same time as the Moore pulse. Read with $(Q, P)$ as the state, the registered circuit is the Moore level-to-pulse machine with LOW = 00, PULSE = 11, HIGH = 10, an assignment in which the output needs no logic. Separately, any output with logic in front of it, Moore or Mealy, can glitch just after an edge because its inputs do not change at the same instant, as $Z = Q_1Q_0$ does on the 01 → 10 transition. Flip-flops on the same clock never see such glitches, but another clock domain can. An output that leaves its clock domain should be registered before it leaves and synchronized when it arrives.

## Review Questions

**1. What makes an output a registered output?**

A. It is computed only from the state, never from an input\
B. It is driven straight by a flip-flop, with no logic after it\
C. It passes through a two-flip-flop synchronizer\
D. It is stored in a register file

**2. The Mealy level-to-pulse machine ($P = L\,\overline{Q}$) is resting with $L = 0$. $L$ blips high in the middle of a clock cycle and drops back before the next edge. What happens to $P$, unregistered and registered?**

A. Neither output changes, because the state does not change\
B. Both outputs pulse\
C. The unregistered $P$ pulses; the registered $P$ does not change\
D. The registered $P$ pulses for a full clock; the unregistered $P$ does not change

**3. Registering the Mealy output costs one thing. What is it?**

A. A second state, so the machine needs two more flip-flops\
B. The output can no longer be a single clock wide\
C. The pulse arrives one clock later, at the same time as the Moore machine's\
D. The machine can no longer respond to synchronized inputs

**4. With $(Q, P)$ treated as the state, which assignment does the registered level-to-pulse machine use?**

A. LOW = 00, PULSE = 01, HIGH = 10\
B. LOW = 00, PULSE = 11, HIGH = 10\
C. LOW = 00, PULSE = 10, HIGH = 11\
D. LOW = 11, PULSE = 01, HIGH = 00

**5. A Moore machine has synchronized inputs and an output $Z = Q_1 Q_0$. On one edge the state goes from 01 to 10. Why might $Z$ glitch, and who can be affected?**

A. It cannot glitch, because Moore outputs depend only on the state\
B. $Q_1$ may rise before $Q_0$ falls, so the gate briefly sees 11; only a reader on a different clock (or reacting to levels) can catch it\
C. The inputs may change between edges; every flip-flop in the design can catch it\
D. The state passes through 11 for a full clock; only same-clock flip-flops can catch it

**6. A single-bit output crosses into another clock domain. What is the right treatment?**

A. A synchronizer on the receiving side only\
B. A registered output on the sending side only\
C. Register it on the sending side and synchronize it on the receiving side\
D. Slow both clocks down until they match

## Answer Explanations

**1. B.** A registered output is a flip-flop output with nothing after it, so it can only change at a clock edge. Choice A describes a Moore output, which may still have logic in front of it, such as $P = \overline{Q_1}\,Q_0$. Choice C describes how an input is made safe, not how an output is driven.

**2. C.** No edge sees $L = 1$, so the state stays at $Q = 0$, where the unregistered output is $P = L \cdot 1 = L$; the blip passes straight through. In the registered circuit the AND gate flickers, but the flip-flop on $P$ samples only at the next edge, when $L$ is back to 0, so the output never moves.

**3. C.** The registered output must wait for an edge to capture $L\,\overline{Q}$, so the pulse appears one clock after the Mealy pulse, in clocks 3 and 9 instead of 2 and 8 for the input in the text. That is exactly when the Moore machine pulses. The pulse is still one clock wide (B), and no extra states are needed beyond the two flip-flops (A).

**4. B.** From 00 a 1 loads $Q = 1$ and $P = L\,\overline{Q} = 1$, giving 11, which is PULSE. From 11 with $L = 1$ the next state is $Q = 1$, $P = 1 \cdot 0 = 0$, giving 10, which is HIGH. Choice A is the assignment used in Level-to-Pulse FSM, which needed an AND gate for the output.

**5. B.** Signals that change on the same edge do not change at the same instant. If $Q_1$ rises before $Q_0$ falls, the gate sees 11 for a sliver and $Z$ pulses. Flip-flops on the same clock sample only at their own edges, after the sliver has gone; a system on another clock, or anything that reacts to levels, can catch it. The state itself never spends a clock in 11 (D), and synchronized inputs do not prevent it (A).

**6. C.** The registered output removes glitches the receiver could otherwise capture as false pulses, and the synchronizer handles the fact that even a clean signal changes at a moment unrelated to the receiver's clock. A synchronizer alone (A) can pass a glitch through as a valid pulse; a registered output alone (B) can still leave the receiver's flip-flop metastable.
