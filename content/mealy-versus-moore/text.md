Every state machine so far has kept its output logic away from its inputs. The inputs feed the next-state logic, the next-state logic feeds the state register, and the output logic looks only at the register. A machine built that way is called a **Moore machine**: its output is a function of the state and nothing else.

A **Mealy machine** has the same three blocks and one additional connection. The input also reaches the output logic, so the output is a function of the state *and* the input. That single extra path is the entire difference between the two, and everything else follows from it. A Mealy machine can respond sooner and often needs fewer states. It also lets whatever happens on the input, including things that should not be there, pass straight through to the output.

This topic builds the same small machine both ways so the difference can be seen on a timing diagram.

## One Extra Path

The two structures can be written as two equations. For a machine with output $P$ and input $L$:

$$\text{Moore:}\quad P = f(\text{state}) \qquad\qquad \text{Mealy:}\quad P = f(\text{state},\, L)$$

In a Moore machine the output is a property of where the machine *is*. The state only changes at a clock edge, so the output only changes at a clock edge.

In a Mealy machine the output is a property of where the machine is and what is arriving at that moment. Nothing between the input and the output is clocked. If the input changes in the middle of a clock cycle, the output can change with it, without waiting for an edge.

## The Example: A Level-to-Pulse Converter

The machine used here is the level-to-pulse converter from Level-to-Pulse FSM. Its input $L$ is a level: it goes high and may stay high for many clocks. Its output $P$ must go high **once for each rising edge of $L$**, no matter how long $L$ stays high.

The Moore design needed three states.

| State | Code $Q_1Q_0$ | What it means | Next state, $L = 0$ | Next state, $L = 1$ | $P$ |
|:-:|:-:|---|:-:|:-:|:-:|
| LOW | 00 | $L$ is low | LOW | PULSE | 0 |
| PULSE | 01 | $L$ just went high | LOW | HIGH | 1 |
| HIGH | 10 | $L$ has been high for a while | LOW | HIGH | 0 |

The output is written in the $P$ column once per state, because in a Moore machine it belongs to the state. On a state diagram it is written inside each circle. The PULSE state exists for one reason only: to be the place where $P = 1$. The machine passes through it for exactly one clock on its way from LOW to HIGH.

## The Mealy Version

A Mealy machine can produce the pulse without a state set aside for it. All the machine needs to remember is what $L$ was at the last clock edge, and one flip-flop $Q$ can hold that.

| $Q$ | What it means | $L$ | Next $Q$ | $P$ |
|:-:|---|:-:|:-:|:-:|
| 0 | $L$ was low at the last edge | 0 | 0 | 0 |
| 0 | $L$ was low at the last edge | 1 | 1 | 1 |
| 1 | $L$ was high at the last edge | 0 | 0 | 0 |
| 1 | $L$ was high at the last edge | 1 | 1 | 0 |

Here the output column has a value for every *row*, not for every state. In the state $Q = 0$ the output is 0 when $L = 0$ and 1 when $L = 1$. The output depends on the state the machine is coming from and on the input.

On a Mealy state diagram this is shown by writing the output on the arcs. Each arc is labeled **input / output**. The label $L{=}1\ /\ P{=}1$ on the arc from $Q = 0$ to $Q = 1$ reads: "if the input is 1 at this clock edge, take this arc, and drive $P$ to 1." The output is attached to the transition, not to the state it leads to.

The second row of the table is the pulse. "$L$ is 1 now, and it was 0 at the last edge" is exactly what a rising edge of $L$ looks like. That statement is about the state and the input together, so in a Mealy machine it can sit on an arc. The Moore machine had no way to express it except by adding a state.

## Equations and Circuits

Reading the two tables gives the logic. For the Moore machine, with the unused code 11 handled as in Level-to-Pulse FSM:

$$D_1 = L(Q_1 + Q_0) \qquad D_0 = L\,\overline{Q_1}\,\overline{Q_0} \qquad P = \overline{Q_1}\,Q_0$$

For the Mealy machine:

$$D = L \qquad P = L\,\overline{Q}$$

| | Moore | Mealy |
|---|:-:|:-:|
| States | 3 | 2 |
| Flip-flops | 2 | 1 |
| Gates | 4 | 1 |
| $P$ depends on | $Q_1$, $Q_0$ | $L$, $Q$ |

The Mealy circuit is one flip-flop and one AND gate. The flip-flop simply stores $L$, and the AND gate asks "is $L$ high now, and was it low at the last edge?" The complement $\overline{Q}$ comes from the flip-flop's $\overline{Q}$ pin.

Look at where that AND gate sits. One of its inputs is $L$ itself, and its output is $P$. There is no flip-flop anywhere on the path from $L$ to $P$. In the Moore circuit, the only signals that reach the output gate are flip-flop outputs.

## Timing: One Clock Sooner

Run both machines on the same input, $L$ = 0 0 1 1 1 1 0 0 1 1 0 0, one value per clock cycle. Each column shows a clock cycle: the state the machine is in during that cycle and the outputs during it.

| Clock | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $L$ | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 0 | 0 |
| Moore state | LOW | LOW | LOW | PULSE | HIGH | HIGH | HIGH | LOW | LOW | PULSE | HIGH | LOW |
| $P$ Moore | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| Mealy $Q$ | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 0 |
| $P$ Mealy | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |

$L$ rises during cycle 2. Both machines are still in their resting state during that cycle, because neither has seen a clock edge with $L = 1$ yet.

The Mealy machine does not need to wait. In state $Q = 0$ with $L = 1$, its output logic already produces $P = 1$, so the pulse appears in cycle 2, the same cycle in which $L$ rose. At the edge that ends cycle 2 the flip-flop loads a 1, and $P = L\,\overline{Q}$ drops back to 0.

The Moore machine can only change its output by changing its state. At the edge that ends cycle 2 it moves from LOW to PULSE, and $P$ is high during cycle 3. It then moves on to HIGH and the pulse ends.

Both machines produce one pulse for each rising edge of $L$, and the same is true at the second rising edge in cycle 8. The Mealy pulse is always exactly one clock earlier than the Moore pulse. That holds for any input: the Mealy output in one cycle equals the Moore output in the next.

So the Mealy machine is faster by one clock and smaller by one state. That is the payoff of the extra path.

## The Cost: The Input Reaches the Output

The comparison above assumed a well-behaved input, one that changes right at a clock edge and then holds still. Inputs often come from outside the system, from a switch, a sensor or another piece of equipment running on a different clock. There is no guarantee about when such a signal changes, and it may briefly glitch between clock edges.

Two things follow for the Mealy machine, because nothing between $L$ and $P$ is clocked.

**The pulse is only as wide as the input makes it.** $P = L\,\overline{Q}$ goes high the moment $L$ does and drops at the next clock edge. If $L$ rises early in the cycle, the pulse lasts nearly a full clock. If $L$ rises just before the edge, the pulse is a sliver, a **glitch pulse** that the circuit downstream may or may not catch. The Moore pulse comes straight from flip-flops, so it is always exactly one clock wide.

**A glitch on the input becomes a glitch on the output.** Suppose both machines are resting with $L$ low, and $L$ blips high for a moment in the middle of a cycle and returns low before the next edge. Neither machine's *state* changes, because no clock edge ever saw $L = 1$. The Moore output does not move, since it depends only on the state. But the Mealy machine is in $Q = 0$, where $P = L \cdot 1 = L$. During that cycle the output is simply a copy of the input, and the blip appears on $P$ as a false pulse. No rising edge of the level ever happened, and the machine reported one anyway.

The Moore machine does not have this problem because its output logic is isolated from the input by the state register. The register only looks at the input at clock edges, so anything that comes and goes between edges is ignored.

## Choosing Between Them

| | Moore | Mealy |
|---|---|---|
| Output depends on | the state | the state and the input |
| Output written on the diagram | inside the circles | on the arcs, as input / output |
| Output changes | only at a clock edge | whenever the input changes |
| Response to an input | the clock after it is sampled | in the same clock cycle |
| States needed | often more | often fewer |
| Output pulse width | whole clock periods | depends on input timing |
| Input glitches | cannot reach the output | pass through to the output |

A sound working rule: **use a Moore machine unless you know the inputs are synchronized to the clock.** If an input comes from flip-flops on the same clock as the machine, it changes just after each edge and holds still for the rest of the cycle, and the Mealy machine's faster response comes with no risk. If an input comes from the outside world, the Moore machine's extra state and extra clock of delay buy an output that cannot glitch.

It is also possible to get most of the Mealy machine's economy while keeping the input away from the output, by passing signals through flip-flops first. That design is the subject of Registered Outputs.

## Both Machines in Verilog

Written from their equations, the two modules differ in what the `assign` line for `P` reads.

```verilog
module l2p_moore (
    input  wire clk,
    input  wire reset,
    input  wire L,
    output wire P
);
    reg Q1, Q0;                        // LOW = 00, PULSE = 01, HIGH = 10

    always @(posedge clk)
        if (reset) {Q1, Q0} <= 2'b00;
        else begin
            Q1 <= L & (Q1 | Q0);
            Q0 <= L & ~Q1 & ~Q0;
        end

    assign P = ~Q1 & Q0;               // the state only
endmodule

module l2p_mealy (
    input  wire clk,
    input  wire reset,
    input  wire L,
    output wire P
);
    reg Q;                             // what L was at the last clock edge

    always @(posedge clk)
        if (reset) Q <= 1'b0;
        else       Q <= L;

    assign P = L & ~Q;                 // the state AND the input
endmodule
```

Simulating both on the input stream from the timing table gives:

```
clk  L  Moore Q1Q0  P(Moore)  Mealy Q  P(Mealy)
  0  0      00         0        0        0
  1  0      00         0        0        0
  2  1      00         0        0        1
  3  1      01         1        1        0
  4  1      10         0        1        0
  5  1      10         0        1        0
  6  0      10         0        1        0
  7  0      00         0        0        0
  8  1      00         0        0        1
  9  1      01         1        1        0
 10  0      10         0        1        0
 11  0      00         0        0        0
```

The same test bench then runs 2000 random clocks and checks that each Moore output equals the Mealy output from the clock before, and finally puts a short blip on `L` between two clock edges while both machines are resting:

```
clocks where P(Moore) differs from the previous clock's P(Mealy): 0 of 2000
glitch on L between edges: pulses on P(Mealy) = 1, pulses on P(Moore) = 0
```

The blip produced a pulse on the Mealy output and nothing on the Moore output.

## Key Takeaways

A Moore machine's output is a function of the state alone, and a Mealy machine's output is a function of the state and the input. Structurally the only difference is one path from the input to the output logic. On a state diagram, Moore outputs are written inside the circles and Mealy outputs are written on the arcs as input / output. Because a Mealy output can depend on what is arriving as well as on what is stored, a Mealy machine often needs fewer states and responds in the same clock cycle as the input; in the level-to-pulse converter it uses two states and one flip-flop where Moore uses three states and two, and its pulse comes exactly one clock sooner. The cost is that nothing between the input and the output is clocked. The width of a Mealy output pulse depends on when the input changes within the cycle, and a glitch on the input can appear on the output as a false pulse. A Moore output comes from flip-flops, so it changes only at clock edges and lasts whole clock periods. Unless the inputs are known to be synchronized to the clock, the Moore machine is the safer choice.

## Review Questions

**1. What is the structural difference between a Mealy machine and a Moore machine?**

A. A Mealy machine has no state register\
B. In a Mealy machine the input also feeds the output logic\
C. A Mealy machine uses a different kind of flip-flop\
D. In a Mealy machine the output feeds back into the next-state logic

**2. On a Mealy state diagram an arc is labeled $L{=}1\ /\ P{=}1$. What does the label mean?**

A. The machine takes this arc only when $P$ is already 1\
B. $P$ becomes 1 one clock after the machine arrives at the next state\
C. If $L = 1$ at the clock edge the machine takes this arc, and $P$ is 1 while it is in the source state with $L = 1$\
D. $L$ and $P$ are both inputs that must be 1

**3. The Moore level-to-pulse converter has three states and the Mealy version has two. Which state did the Mealy machine not need, and why?**

A. LOW, because a Mealy machine has no resting state\
B. HIGH, because the input stays high by itself\
C. PULSE, because "$L$ is 1 now and was 0 at the last edge" can be expressed on an arc\
D. PULSE, because a Mealy machine cannot produce a one-clock pulse

**4. Both machines are driven by the same input. $L$ rises during clock cycle 5. In which cycles do the two output pulses appear?**

A. Mealy in cycle 5, Moore in cycle 6\
B. Moore in cycle 5, Mealy in cycle 6\
C. Both in cycle 5\
D. Both in cycle 6

**5. Both machines are resting with $L$ low. $L$ blips high briefly in the middle of a clock cycle and returns low before the next clock edge. What happens?**

A. Both outputs pulse\
B. Neither output pulses\
C. Only the Moore output pulses\
D. Only the Mealy output pulses

**6. A state machine's input comes from a push button, which is not synchronized to the clock. Which choice is the safer one, and why?**

A. Mealy, because it needs fewer flip-flops\
B. Mealy, because it responds in the same clock cycle\
C. Moore, because its output comes only from flip-flops and cannot change between clock edges\
D. Either, because both produce the same output on the same clock

## Answer Explanations

**1. B.** Both machines have next-state logic, a state register and output logic. In a Moore machine the output logic reads only the register. In a Mealy machine it reads the register and the input. Nothing else about the structure changes.

**2. C.** A Mealy arc label is input / output. The input part says when the arc is taken; the output part gives the output for that state and input combination. The output is tied to the transition, not to the destination, and it is present as soon as the input is, without waiting for the next state.

**3. C.** PULSE existed in the Moore machine only to be the state in which $P = 1$. A rising edge of $L$ is a fact about the stored value (what $L$ was) and the present input (what $L$ is) together. A Mealy output can depend on both, so the pulse goes on the arc from $Q = 0$ taken when $L = 1$, and no state is needed for it.

**4. A.** The Mealy output is $P = L\,\overline{Q}$, which is 1 as soon as $L$ rises while $Q$ is still 0, so its pulse is in cycle 5. The Moore machine has to move to its PULSE state at the edge that ends cycle 5, so its pulse is in cycle 6. The Mealy pulse is always one clock earlier.

**5. D.** No clock edge occurs while $L$ is high, so neither machine changes state. The Moore output depends only on the state and stays at 0. The Mealy machine is in $Q = 0$, where $P = L\,\overline{Q} = L$, so its output copies the blip. This is the false pulse that makes Mealy outputs risky with unsynchronized inputs.

**6. C.** A push button can change at any time and can glitch. In a Moore machine the register samples the input only at clock edges, and the output is built only from flip-flop outputs, so it changes only at edges and lasts whole clock periods. The Mealy advantages in A and B are real, but with an unsynchronized input they come with narrow or false output pulses. D is wrong on timing: the two outputs are one clock apart.
