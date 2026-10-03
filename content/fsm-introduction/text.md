A D flip-flop remembers one bit. Put a few of them side by side on one clock, wrap some combinational logic around them, and you have a machine that remembers *where it is* in a task and decides what to do next: a traffic light that knows which light is lit, a vending machine that knows how much money it has taken, a lock that knows how many digits of the code have been entered correctly. Each of these has a fixed, countable list of situations it can be in. Those situations are called **states**, and a circuit that steps from state to state is a **finite state machine**, or FSM.

This topic introduces the structure that every synchronous FSM shares, then describes one small machine three different ways: as a state diagram, as a state table and as a circuit. The aim is to learn to read all three and to see that they describe the same thing. How to *design* the circuit from the diagram comes next, in Binary State Assignment.

## The Three Boxes

Every synchronous finite state machine is built from the same three blocks.

1. **Next-state logic.** Combinational logic that reads the machine's inputs *and its current state* and computes what the state should become at the next clock edge. Its output is wired to the D inputs of the flip-flops, so it is usually called $D$.
2. **State register.** A bank of D flip-flops sharing one clock. This is the only part of the machine that remembers anything. It holds the current state, written $Q$, and it changes only on the rising edge of the clock, when every flip-flop loads its $D$ at the same moment.
3. **Output logic.** Combinational logic that produces the machine's outputs.

Only one box has memory. The other two are ordinary combinational circuits of the kind built in the previous chapter, with nothing new about them. What makes the whole thing sequential is how they are connected.

**Feedback.** The current state $Q$ leaves the register and loops back into the next-state logic. It has to, because what a machine does next depends on where it is now. A counter cannot decide that the next count is 2 unless it knows the current count is 1. This loop from the register's output, through combinational logic, and back to the register's input is the defining feature of an FSM. The flip-flops are what make the loop stable: the next-state logic can settle on a new value for $D$ while $Q$ holds still, and nothing moves until the clock edge.

**One clock.** Every flip-flop in the state register shares the same system clock, so the whole state changes at once, on the edge. Between edges the state is frozen, no matter what the inputs do. That is what *synchronous* means.

**Reset.** When power is first applied, a flip-flop can come up holding either value. A machine that wakes up in a random state is not much use, so the state register has a reset input that forces it into a known **initial state**. In this topic, reset loads state 0.

In the form shown here, the output logic reads the state and nothing else. A machine whose outputs depend only on the current state is called a **Moore machine**. The other arrangement, in which the outputs also read the inputs directly, is the **Mealy machine**. The difference between the two is the subject of Mealy versus Moore; for now, every machine is a Moore machine.

## The Example Machine: A 2-Bit Up/Down Counter

The running example is deliberately simple, so that attention stays on the structure rather than the application. It is a **2-bit up/down counter with a MAX flag**.

- It has one input, $U$. When $U = 1$ the machine counts up; when $U = 0$ it counts down.
- It counts through 0, 1, 2, 3 and **wraps around in both directions**: counting up from 3 gives 0, and counting down from 0 gives 3.
- It has one output, $MAX$, which is 1 when the count is 3 and 0 otherwise.

Four states need two flip-flops, since two bits give exactly four codes. Call their outputs $Q_1$ and $Q_0$, with $Q_1$ the most significant bit, so the state is simply the count written in binary: 00, 01, 10, 11.

## The State Diagram

A **state diagram** draws the machine as a graph.

- Each **bubble** is a state, one value the register can hold. With two flip-flops there are four bubbles.
- Each **arc** is one clock edge. It starts at the current state, ends at the next state, and is labeled with the input value that takes it. Every state has one outgoing arc for each value of the input, so each bubble here has two: one for $U = 1$ and one for $U = 0$.
- The **output** is written inside the bubble. In a Moore machine the output belongs to the state, not to the arc, so it goes where the state is.

For the counter, the $U = 1$ arcs run around the ring in one direction, 00 → 01 → 10 → 11 → 00, and the $U = 0$ arcs run the other way, 00 → 11 → 10 → 01 → 00. Only the bubble for 11 carries $MAX = 1$. An arrow labeled *reset* points into 00, marking it as the initial state.

To read a state diagram, start at the initial state and follow one arc per clock edge, choosing the arc that matches the input at that edge. Take the input sequence $U$ = 1, 1, 1, 1, 0, 0:

| Clock edge | State before the edge | $U$ | State after the edge | $MAX$ before the edge |
|:-:|:-:|:-:|:-:|:-:|
| 1 | 00 | 1 | 01 | 0 |
| 2 | 01 | 1 | 10 | 0 |
| 3 | 10 | 1 | 11 | 0 |
| 4 | 11 | 1 | 00 | 1 |
| 5 | 00 | 0 | 11 | 0 |
| 6 | 11 | 0 | 10 | 1 |

The fourth edge wraps the count from 3 to 0. The fifth, with $U = 0$, wraps it back from 0 to 3. $MAX$ is 1 exactly while the machine sits in state 11, whatever the input is doing.

The details of this counter matter less than the idea behind it: **a state is a binary code, and the flip-flops are what hold it.** Every bubble on the diagram is one combination of $Q_1 Q_0$.

## The State Table

A **state table** (also called a next-state table) lists the same information as rows. Each row is one arc of the diagram: the input and the current state go in, and the next state and the output come out. Two input values times four states gives eight rows. Next-state values are written with a plus sign, $Q_1^+ Q_0^+$, meaning "the value after the next clock edge".

| $U$ | $Q_1$ | $Q_0$ | $Q_1^+$ | $Q_0^+$ | $MAX$ |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 0 | 1 | 1 | 0 |
| 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 | 1 | 0 |
| 0 | 1 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 | 0 |
| 1 | 1 | 1 | 0 | 0 | 1 |

Read the first row: with $U = 0$ the machine counts down, and down from 00 wraps to 11. Read the fifth: with $U = 1$, up from 00 is 01. Filling in the table is nothing more than doing that once per row.

Look at the $MAX$ column. It depends only on $Q_1$ and $Q_0$: rows 4 and 8 are both state 11, and both have $MAX = 1$ regardless of $U$. A Moore machine's output is a column of the *state*, which is why it can be written inside the bubble.

The state table is the bridge to hardware. Its left side lists every input to the next-state logic, and its right side lists every output, so it is a truth table for the combinational parts of the machine.

## The Circuit

Treat $Q_1^+$, $Q_0^+$ and $MAX$ as three outputs of a truth table, minimize each one, and you have the gates. The method for doing this, coding the states and using K-maps, is the subject of Binary State Assignment. Here are the results, so you can see the three boxes in an actual circuit.

**Next-state logic.** The low bit toggles on every clock edge, whether counting up or down, so

$$D_0 = \overline{Q_0}$$

That needs no gate at all. The flip-flop's own $\overline{Q}$ output feeds straight back to its $D$ input.

The high bit toggles only at certain points. Counting up, $Q_1$ flips when $Q_0 = 1$ (01 → 10, and 11 → 00). Counting down, it flips when $Q_0 = 0$ (10 → 01, and 00 → 11). So $Q_1$ flips exactly when $Q_0$ and $U$ are equal, which is what an XNOR gate detects, and an XOR gate flips a bit on command:

$$D_1 = Q_1 \oplus \overline{(Q_0 \oplus U)}$$

Check one row. In state 10 with $U = 0$: $Q_0 \oplus U = 0 \oplus 0 = 0$, the XNOR gives 1, and $D_1 = 1 \oplus 1 = 0$. Together with $D_0 = \overline{0} = 1$, the next state is 01, which matches row 3 of the table.

**State register.** Two D flip-flops on the shared clock, with a reset that loads 00.

**Output logic.** $MAX$ is 1 only in state 11:

$$MAX = Q_1 \cdot Q_0$$

That is a single AND gate, and its inputs come only from the flip-flops, as a Moore machine requires.

You can now point at each of the three boxes on the circuit: the XNOR and XOR feeding $D_1$, plus the wire from $\overline{Q_0}$ to $D_0$, are the next-state logic; the two flip-flops are the state register; the AND gate is the output logic. The interactive on this page draws exactly this circuit and steps it alongside the diagram and the table, so you can watch $D$ form from the inputs and the current state and then get loaded on each edge.

## The Same Machine in Verilog

The three boxes map directly onto Verilog. The next-state logic and output logic are continuous assignments, and the state register is a clocked `always` block, the same pattern as the D flip-flop.

```verilog
module updown_counter (
    input  wire       clk,
    input  wire       reset,
    input  wire       U,
    output wire [1:0] state,
    output wire       MAX
);
    reg  [1:0] Q;        // state register
    wire [1:0] D;        // next state

    // next-state logic
    assign D = U ? Q + 2'd1 : Q - 2'd1;

    // state register
    always @(posedge clk)
        if (reset) Q <= 2'd0;
        else       Q <= D;

    // output logic (reads the state only)
    assign MAX   = Q[1] & Q[0];
    assign state = Q;
endmodule
```

The next-state line describes the behavior rather than the gates. Because `Q` is only two bits wide, `Q + 1` from 3 wraps to 0 and `Q - 1` from 0 wraps to 3 automatically, which is exactly the wrap-around the counter needs. The synthesis tool turns that line into gates equivalent to $D_1$ and $D_0$ above.

A testbench that releases reset and then applies the input sequence $U$ = 1 1 1 1 0 0 0 0 1 1 0 1, one value per clock, prints the following (simulated with Icarus Verilog):

```
clock  1: state=0 MAX=0 U=1
clock  2: state=1 MAX=0 U=1
clock  3: state=2 MAX=0 U=1
clock  4: state=3 MAX=1 U=1
clock  5: state=0 MAX=0 U=0
clock  6: state=3 MAX=1 U=0
clock  7: state=2 MAX=0 U=0
clock  8: state=1 MAX=0 U=0
clock  9: state=0 MAX=0 U=1
clock 10: state=1 MAX=0 U=1
clock 11: state=2 MAX=0 U=0
clock 12: state=1 MAX=0 U=1
after 12 clocks: state=2 MAX=0
```

Each line shows the state *before* that clock edge. The first six lines are the trace worked through the state diagram above, and $MAX$ is 1 only on the two lines where the state is 3.

## Key Takeaways

Every synchronous finite state machine is three boxes: next-state logic, a state register of D flip-flops, and output logic. Only the state register remembers anything; the other two are combinational. The current state feeds back into the next-state logic, all the flip-flops load together on one clock edge, and a reset puts the machine in a known initial state at power-up. When the outputs read only the state, the machine is a Moore machine. The same machine can be described three ways: a state diagram (bubbles are states, arcs are clock edges labeled with inputs, outputs inside the bubbles), a state table (one row per arc, with the current state and inputs in and the next state and outputs out), and a circuit. The state table is a truth table for the two combinational boxes, which is what makes it the bridge from the diagram to the hardware. For the 2-bit up/down counter, $D_0 = \overline{Q_0}$, $D_1 = Q_1 \oplus \overline{(Q_0 \oplus U)}$ and $MAX = Q_1 Q_0$.

## Review Questions

**1. Which part of a synchronous finite state machine holds the machine's memory?**

A. The next-state logic\
B. The output logic\
C. The state register\
D. The feedback wire from the output logic to the input

**2. Why must the current state be fed back into the next-state logic?**

A. So the flip-flops can be reset at power-up\
B. Because the next state depends on both the inputs and the current state\
C. So the output logic can read the inputs directly\
D. To keep the clock synchronized with the inputs

**3. The 2-bit up/down counter is in state 00 and $U = 0$. What is the state after the next clock edge?**

A. 01\
B. 00\
C. 10\
D. 11

**4. What makes the up/down counter a Moore machine?**

A. Its output $MAX$ depends only on the current state\
B. It counts in both directions\
C. Its state register is built from D flip-flops\
D. It has a reset input

**5. A machine has one input and four states. How many rows does its state table have?**

A. 4\
B. 6\
C. 8\
D. 16

**6. Starting from reset, the counter receives $U$ = 1, 1, 0 on three clock edges. What state is it in afterward?**

A. 00\
B. 01\
C. 10\
D. 11

## Answer Explanations

**1. C.** The state register is the bank of D flip-flops, and it is the only part of the machine with memory. The next-state logic and output logic are combinational, so their outputs follow their inputs and store nothing. There is no feedback wire from the output logic; the feedback runs from the state register back into the next-state logic.

**2. B.** What a machine does next depends on where it is now. A counter can only compute the next count if it knows the current one, so the register's output $Q$ loops back as an input to the next-state logic. Reset (A) is a separate input to the register, and a Moore machine's output logic does not read the inputs at all (C).

**3. D.** With $U = 0$ the counter counts down, and counting down from 0 wraps around to 3, which is 11. This is the first row of the state table. Answer A is what counting *up* would give.

**4. A.** A Moore machine is defined by where its outputs come from: they depend only on the state. $MAX = Q_1 Q_0$ reads the flip-flops and never the input $U$, which is why $MAX$ can be written inside the state bubble. The other three properties are true of this counter, but none of them is what makes it a Moore machine.

**5. C.** The state table has one row for every combination of input value and current state: $2 \times 4 = 8$. That is also the number of arcs on the state diagram, since every state has one outgoing arc per input value.

**6. B.** Reset puts the counter in 00. The first edge ($U = 1$) counts up to 01, the second ($U = 1$) to 10, and the third ($U = 0$) counts down to 01.
