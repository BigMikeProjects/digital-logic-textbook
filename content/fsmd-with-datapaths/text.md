An **FSMD**, a finite state machine with a datapath, is a state diagram that also says what the data does. A register transfer is written beside each state, and an arc can depend on the value in a register rather than on an external input. Introduction to Register Transfer Level Design described the three-step method that turns such a diagram into hardware: draw the FSMD, build the datapath, derive the controller. This topic runs the whole method, start to finish, on the smallest machine that needs all three steps: a 3-bit counter that counts up to 7, turns around, counts down to 0, and starts over.

The example is small on purpose. It has no inputs at all, one register and two states, so every step is short enough to see whole. It also has the one feature that makes a state machine necessary: the counter can go up or down, and the datapath by itself cannot say which. There is more than one way to draw an FSMD and no single standard. The notation used here is the one the rest of the chapter follows.

## What the Circuit Should Do

Nothing comes in but the clock. On each clock edge the 3-bit count $C$ moves one step: up from 0 to 7, then down from 7 to 0, then up again, forever. One full bounce takes 14 clocks, and cycle 14 looks exactly like cycle 0:

| Cycle | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $C$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| Direction | up | up | up | up | up | up | up | down | down | down | down | down | down | down | up |

One detail decides the whole design. The machine will be a Moore machine, so its output, the signal that says which way to count, changes one clock after the state changes. If the machine waited to see $C = 7$ before deciding to turn around, it would add once more before the decision took effect and the count would wrap from 7 to 0. So the turn is detected one count early: the machine tests for $C = 6$ on the way up and for $C = 1$ on the way down. Each test fires, the state changes at the next edge, and the count takes one more step in the old direction, reaching 7 or 0, before the new direction takes hold. Simulating the alternative confirms the point: testing at 7 and 0 instead makes the count wrap from 7 to 0 and then toggle between 0 and 7 forever.

## Step 1: Draw the FSMD

A counter that only counted up would need no state machine. A register and an adder would do. This one has to remember a direction, and direction is exactly one bit of state. So the FSMD has two states, **UP** and **DOWN**, with UP the reset state and $C$ reset to 0.

Beside each state is the register transfer the machine performs on every clock while it sits there:

$$\text{UP: } C \leftarrow C + 1 \qquad\qquad \text{DOWN: } C \leftarrow C - 1$$

The arrow is read "gets": at the clock edge, register $C$ loads the value $C + 1$. It is a transfer into a register, which is what register transfer level design is named for, and it is the first thing that separates an FSMD from a plain state diagram.

The second thing is on the arcs. The machine leaves UP when $C = 6$ and leaves DOWN when $C = 1$, and otherwise stays where it is. Those conditions read the data, not an input. A plain FSM leaves a state because a button was pressed or a signal went high. This one leaves because a register holds a particular value. The system as a whole has no inputs, and its one output is the 3-bit count $C$.

The transfer and the transition happen on the same clock edge, which is the other way to see why the conditions are 6 and 1. Leaving UP at $C = 6$ still performs $C \leftarrow C + 1$ on that edge, so $C$ arrives in DOWN holding 7. Leaving DOWN at $C = 1$ still subtracts, so $C$ arrives in UP holding 0.

That is the complete design, drawn before any hardware exists: two states, two transfers, two conditions. It is not yet a circuit. The next two steps split it into the two cooperating parts.

## Step 2: Build the Datapath

The datapath is read off the FSMD three times, and each reading adds hardware.

**Registers.** The FSMD names one register, $C$, so the datapath gets one 3-bit register, clocked by the system clock. Its output feeds the arithmetic below and leaves the datapath as the count.

**Register transfers.** Each different right-hand side becomes a block: one computes $C + 1$ and one computes $C - 1$, both fed from the register's output. Now there are two sources for the same register, and a register has only one data input, so a 2:1 **multiplexer** selects between them, with $C + 1$ on input 1 and $C - 1$ on input 0. This is the first routing decision inside a datapath, and it introduces a signal the FSMD never mentioned. The mux's select line has to be driven by something. Call it `up`: when `up` is 1 the mux passes $C + 1$, and when `up` is 0 it passes $C - 1$. It is a **control input** to the datapath, and the datapath does not generate it.

**Data conditions.** Each condition on an arc becomes a **comparator**: one tests $C = 6$ and one tests $C = 1$. Their outputs are single bits, `at6` and `at1`, that are 1 exactly when the count sits at the value named. They are **status outputs** of the datapath: facts about the data, reported to whatever is in charge.

The finished datapath has a register, two arithmetic blocks, a mux and two comparators. It can add or subtract, and it can say where the count is. What it cannot do is decide. If $C = 4$, both $C + 1 = 5$ and $C - 1 = 3$ are sitting at the mux, and nothing in the datapath knows which one to load next, because the direction is not stored anywhere in it. Something has to drive `up`. That is step 3.

## Step 3: Derive the Controller

The controller is derived from the same FSMD, and it comes out an ordinary Moore machine.

The states carry over unchanged: UP and DOWN, reset into UP. The register transfers become control outputs, written inside the states in the Moore style. UP, which performed $C \leftarrow C + 1$, now outputs `up` = 1 so that the mux selects the adder. DOWN, which performed $C \leftarrow C - 1$, outputs `up` = 0. The data conditions become inputs: the arc that left UP on $C = 6$ now leaves on the status signal `at6`, and the arc that left DOWN on $C = 1$ leaves on `at1`. The FSMD's "otherwise stay" becomes two self-loops, labeled $\overline{\text{at6}}$ on UP and $\overline{\text{at1}}$ on DOWN, that make the machine complete.

| Present state | Status tested | Next state | Output `up` |
|:-:|:-:|:-:|:-:|
| UP | `at6` = 0 | UP | 1 |
| UP | `at6` = 1 | DOWN | 1 |
| DOWN | `at1` = 0 | DOWN | 0 |
| DOWN | `at1` = 1 | UP | 0 |

Each state listens to only one status signal. UP never looks at `at1`, even though the count passes 1 on the way up and that comparator fires. DOWN never looks at `at6`. With one flip-flop $S$ holding the state and $S = 1$ meaning UP, the table reduces to

$$S^{+} = S\,\overline{\text{at6}} + \overline{S}\,\text{at1} \qquad\qquad \text{up} = S$$

There is nothing new in this box. It is a two-state Moore machine with two inputs and one output, designed exactly the way every state machine in the sequential-logic chapter was designed. The only unusual thing about it is where its inputs come from and where its output goes.

## Connecting the Two

Wire the two boxes together and the dialogue that Introduction to Register Transfer Level Design described in words becomes concrete. One **control** signal runs from the controller to the datapath: `up`, the mux select. Two **status** signals run back: `at6` and `at1`, the comparator outputs. The register $C$ leaves the datapath as the system's output, and both boxes run on the same clock.

A simulation of the connected machine gives the full trace of one bounce:

| Cycle | State | $C$ | `at6` | `at1` | `up` | On the next edge |
|:-:|:-:|:-:|:-:|:-:|:-:|:--|
| 0 | UP | 0 | 0 | 0 | 1 | $C \leftarrow 1$ |
| 1 | UP | 1 | 0 | 1 | 1 | $C \leftarrow 2$ (`at1` is ignored in UP) |
| 2 to 5 | UP | 2 to 5 | 0 | 0 | 1 | $C \leftarrow C + 1$ |
| 6 | UP | 6 | **1** | 0 | 1 | $C \leftarrow 7$, state becomes DOWN |
| 7 | DOWN | 7 | 0 | 0 | 0 | $C \leftarrow 6$ |
| 8 | DOWN | 6 | 1 | 0 | 0 | $C \leftarrow 5$ (`at6` is ignored in DOWN) |
| 9 to 12 | DOWN | 5 to 2 | 0 | 0 | 0 | $C \leftarrow C - 1$ |
| 13 | DOWN | 1 | 0 | **1** | 0 | $C \leftarrow 0$, state becomes UP |
| 14 | UP | 0 | 0 | 0 | 1 | $C \leftarrow 1$ |

Read cycle 6 across. The datapath reports `at6` = 1. The controller is in UP, so `up` is still 1 and the mux is still passing $C + 1 = 7$. At the edge both things happen at once: $C$ loads 7 and the state becomes DOWN. Only in cycle 7 does `up` fall to 0, one clock after the state changed, which is the Moore delay that made 6 the right value to test. Cycle 13 is the mirror image at the bottom.

Cycles 4 and 10 make the point about the state bit directly. In both, $C = 4$ and the datapath looks identical, yet the next value is 5 in one and 3 in the other. The difference is nowhere in the datapath. It is the single flip-flop in the controller.

## The Machine in Verilog

The two boxes map onto two modules. In the datapath the `always` block is the register, and the `assign` lines are the mux, the arithmetic and the two comparators. In the controller the `always` block is its one flip-flop, and the `assign` lines are the next-state equation and the Moore output.

```verilog
module datapath (input clk, rst, up, output at6, at1, output [2:0] C);
    reg [2:0] c;
    wire [2:0] nxt = up ? c + 3'd1 : c - 3'd1;   // C + 1, C - 1, and the mux; up selects
    always @(posedge clk or posedge rst)
        if (rst) c <= 3'd0; else c <= nxt;       // the register C
    assign C   = c;
    assign at6 = (c == 3'd6);                    // comparator  C = 6 ?  -> status at6
    assign at1 = (c == 3'd1);                    // comparator  C = 1 ?  -> status at1
endmodule

module controller (input clk, rst, at6, at1, output up);
    reg S;                                       // S = 1 means UP (the reset state)
    wire Sn = (S & ~at6) | (~S & at1);           // S+ = S.at6' + S'.at1
    always @(posedge clk or posedge rst)
        if (rst) S <= 1'b1; else S <= Sn;
    assign up = S;                               // Moore output: control to the datapath
endmodule
```

A testbench that instantiates both, connects `up`, `at6` and `at1` between them, and prints once per cycle produces the following with Icarus Verilog:

```
cycle  0: state=UP    C=0  at6=0  at1=0  up=1
cycle  1: state=UP    C=1  at6=0  at1=1  up=1
cycle  2: state=UP    C=2  at6=0  at1=0  up=1
cycle  3: state=UP    C=3  at6=0  at1=0  up=1
cycle  4: state=UP    C=4  at6=0  at1=0  up=1
cycle  5: state=UP    C=5  at6=0  at1=0  up=1
cycle  6: state=UP    C=6  at6=1  at1=0  up=1
cycle  7: state=DOWN  C=7  at6=0  at1=0  up=0
cycle  8: state=DOWN  C=6  at6=1  at1=0  up=0
cycle  9: state=DOWN  C=5  at6=0  at1=0  up=0
cycle 10: state=DOWN  C=4  at6=0  at1=0  up=0
cycle 11: state=DOWN  C=3  at6=0  at1=0  up=0
cycle 12: state=DOWN  C=2  at6=0  at1=0  up=0
cycle 13: state=DOWN  C=1  at6=0  at1=1  up=0
cycle 14: state=UP    C=0  at6=0  at1=0  up=1
cycle 15: state=UP    C=1  at6=0  at1=1  up=1
```

The count climbs to 7, comes back to 0 and starts up again, exactly as the trace table says, and the `up` column changes one cycle after the state. Verilog's `==` in the comparator lines is the same test the FSMD wrote as $C = 6$ on the arc.

## Why Learn It This Way

A synthesis tool reading those two modules would build the register, the adder, the subtractor, the mux, the comparators and the one-flip-flop controller without being told which is which. In practice designers write the RTL directly and let the tools build both boxes. The three steps are not how the tools work. They are how to read what the code implies. Drawing the FSMD first, building the datapath from it and deriving the controller from it makes the split between controller and datapath visible once, by hand, so that the same split can be seen in any `always` block and `assign` statement afterward. The topics that follow apply the same three steps to larger designs until the habit is automatic.

## Key Takeaways

An FSMD is a state diagram with register transfers written beside the states, such as $C \leftarrow C + 1$, and arcs that can depend on the data, such as $C = 6$. The three-step method turns it into hardware: draw the FSMD, build the datapath, derive the controller. The datapath is read off the FSMD three times: registers become registers, transfers become arithmetic blocks with a mux wherever a register has more than one source, and arc conditions become comparators. Every mux select is a new control input to the datapath and every comparator output is a new status output. The controller is an ordinary Moore machine with the FSMD's states, the transfers turned into control outputs inside the states, the conditions turned into status inputs on the same arcs, and self-loops for "otherwise stay." In the bounce counter the controller is one flip-flop, $S^{+} = S\,\overline{\text{at6}} + \overline{S}\,\text{at1}$ with up $= S$, and it tests 6 and 1 rather than 7 and 0 because a Moore output changes one clock after the state. The datapath by itself cannot say which way it is counting. That one bit of information lives only in the controller.

## Review Questions

**1. In an FSMD, what does $C \leftarrow C + 1$ written beside a state mean?**

A. The state is entered as soon as $C + 1$ has been computed\
B. On every clock edge spent in that state, register $C$ loads the value $C + 1$\
C. The state's binary code is one greater than the value of $C$\
D. The arc leaving the state is taken when $C$ is greater than 1

**2. In an FSMD, one register $R$ is loaded by two different transfers: $R \leftarrow R + 1$ in one state and $R \leftarrow 0$ in another. What does step 2 add to the datapath because of this, and what new signal appears?**

A. A second copy of $R$, with no new signal\
B. A comparator on $R$, whose output is a new status signal\
C. A multiplexer in front of $R$, whose select line is a new control input\
D. Nothing, because the two transfers happen in different states

**3. The bounce counter leaves UP when $C = 6$ rather than when $C = 7$. Why?**

A. A 3-bit register cannot hold the value 7\
B. The controller is a Moore machine, so its output changes one clock after the state; testing at 6 lets the count reach 7 before it turns\
C. Comparators can test only even values\
D. The adder would overflow if it were allowed to compute $6 + 1$

**4. In the connected machine, which signals are control signals and which are status signals?**

A. `up` is control; `at6` and `at1` are status\
B. `at6` and `at1` are control; `up` is status\
C. All three are control signals, since all three go to the mux\
D. `C` is the only control signal; the rest are status

**5. In cycle 4 and in cycle 10 the datapath holds $C = 4$ and looks identical, yet the next value is 5 in one case and 3 in the other. What decides which it is?**

A. The comparator outputs, which differ between the two cycles\
B. The multiplexer, which remembers its most recent selection\
C. The value of $C$ itself, which encodes the direction\
D. The controller's state bit, which drives `up`

**6. The derived controller has a self-loop on UP labeled $\overline{\text{at6}}$. What in the FSMD does that self-loop come from?**

A. The register transfer $C \leftarrow C + 1$ written beside UP\
B. The rule that the machine stays in UP whenever the condition $C = 6$ is false\
C. The reset arrow into UP\
D. The output $C$, which must hold its value while the machine is in UP

## Answer Explanations

**1. B.** The arrow is a register transfer: at each clock edge while the machine is in that state, $C$ is loaded with $C + 1$. It is not a condition for entering or leaving the state (A and D), and it says nothing about how the state is encoded (C).

**2. C.** Two sources for one register need a multiplexer, because a register has a single data input. The mux has to be told which source to pass, and that select line is a new control input that the datapath cannot drive itself. A comparator (B) comes from a condition on an arc, not from a transfer. Duplicating the register (A) would leave two copies to keep consistent, and the states being different (D) does not change the fact that one register is loaded from two places.

**3. B.** The direction signal `up` is a Moore output, so it changes one clock after the state. When `at6` fires in cycle 6 the mux is still passing $C + 1$, and the edge that moves the state to DOWN also loads 7. Testing at 7 instead would load 0 on that edge; in simulation the count then toggles between 0 and 7. The other choices describe hardware limits that do not exist: 3 bits hold 0 through 7, a comparator can test any value, and $6 + 1$ fits in 3 bits.

**4. A.** Control flows from the controller to the datapath: `up` selects the mux input. Status flows from the datapath back to the controller: `at6` and `at1` report where the count is. The count $C$ is the system's data output, neither control nor status.

**5. D.** The datapath has no memory of direction. In both cycles it offers $C + 1 = 5$ and $C - 1 = 3$ at the mux, and the comparators read 0 in both (A). A mux has no memory (B), and the value 4 is the same in both cycles (C). What differs is the controller's state, UP in cycle 4 and DOWN in cycle 10, and that state bit drives `up`.

**6. B.** The FSMD leaves UP only when $C = 6$ and otherwise stays. In the controller the condition becomes the status input `at6`, and "otherwise stay" becomes a self-loop on UP taken when `at6` is 0. The transfer (A) became the output `up` = 1 inside the state, and the reset arrow (C) is a separate entry into UP.
