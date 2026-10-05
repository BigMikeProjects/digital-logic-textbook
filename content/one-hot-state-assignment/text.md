A binary state assignment packs the states of a machine into as few flip-flops as it can, and then pays for that in design work: a coded state table, a Karnaugh map for every flip-flop, and a choice of codes that can double the logic if it goes badly. A **one-hot state assignment** makes the opposite trade. It gives every state its own flip-flop, and exactly one of those flip-flops holds a 1 at any time. The state is simply whichever flip-flop is "hot."

That costs more flip-flops, but it removes almost all of the design work. With one flip-flop per state, each flip-flop's D input can be written down by looking at the state diagram. There is no state table to fill in and there are no K-maps to draw. This topic builds the same machine used in Binary State Assignment, a detector for the sequence 1 0 1, so the two methods can be compared directly.

## One Flip-Flop per State

In a one-hot assignment the number of flip-flops equals the number of states. A machine with four states uses four flip-flops, and a machine with twelve states uses twelve. Nothing is being minimized here. The states are mapped one to one onto flip-flops, and the flip-flop takes the name of its state.

The example machine is a Moore detector for the sequence 1 0 1 with overlaps allowed. It reads a serial input $x$, one bit per clock, and raises $Z$ for one clock period after the last three inputs were 1, 0, 1.

| State | What it means | Next state, $x = 0$ | Next state, $x = 1$ | $Z$ |
|:-:|---|:-:|:-:|:-:|
| S0 | nothing useful seen yet | S0 | S1 | 0 |
| S1 | the last input was 1 | S2 | S1 | 0 |
| S2 | the last two inputs were 1 0 | S0 | S3 | 0 |
| S3 | the last three were 1 0 1 (a match) | S2 | S1 | 1 |

Four states means four flip-flops, named S3, S2, S1 and S0. Writing the register in that order, the four states are

| State | S3 | S2 | S1 | S0 |
|:-:|:-:|:-:|:-:|:-:|
| S0 | 0 | 0 | 0 | 1 |
| S1 | 0 | 0 | 1 | 0 |
| S2 | 0 | 1 | 0 | 0 |
| S3 | 1 | 0 | 0 | 0 |

Four flip-flops can hold sixteen different patterns, and this machine uses only four of them. The other twelve never occur in normal operation. As the machine runs, the single 1 moves from flip-flop to flip-flop, following the arcs of the state diagram. With the input stream 1 0 1 the register goes 0001, 0010, 0100, 1000: S0, S1, S2, S3.

## The Five Steps

Designing with a one-hot assignment follows the same five steps every time.

1. **Draw the state diagram.** As always, this comes from the problem: name the states and label every arc with the input that takes it.
2. **Assign one flip-flop to each state.** There are no codes to choose.
3. **Find every loop-back.** Make sure the diagram shows every arc, including the ones that return to the same state.
4. **Read each D input off the diagram.** For each state, write one term for every arc that arrives at it.
5. **Build the circuit.**

Steps 3 and 4 are the ones that are new, and they are taken in turn below.

## Loop-Backs Must Be Drawn

State diagrams are often drawn in a compact form that leaves out the arcs returning to the same state. The convention is that every state must have somewhere to go for every input value, so if no arc is shown for some input, the machine stays where it is. A compact drawing of the detector would show only the arc leaving S0 on $x = 1$. The reader is expected to understand that on $x = 0$ the machine stays in S0. S2, on the other hand, shows an arc for $x = 0$ and another for $x = 1$, so it has no loop-back at all.

The compact form is easy to read, and the binary method is forgiving about it, because the state table is filled in one row at a time and the "stay" entries get written whether or not they were drawn. The one-hot method has no state table. The equations come straight from the arcs on the diagram, so **an arc that is not drawn becomes a term that is not written**.

In the detector, two arcs are loop-backs: S0 to S0 on $x = 0$, and S1 to S1 on $x = 1$. Reading the equations from a diagram that leaves them out changes two of the four:

| | From the compact diagram | From the complete diagram |
|:-:|:-:|:-:|
| $D_{S0}$ | $\bar{x} \cdot S2$ | $\bar{x}(S0 + S2)$ |
| $D_{S1}$ | $x(S0 + S3)$ | $x(S0 + S1 + S3)$ |
| $D_{S2}$ | $\bar{x}(S1 + S3)$ | $\bar{x}(S1 + S3)$ |
| $D_{S3}$ | $x \cdot S2$ | $x \cdot S2$ |

The result of the mistake is not a wrong output. It is a dead machine. Start both versions in S0 and apply the inputs 0, 1, 1, 0, 1, 0:

| Clock | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $x$ | 0 | 1 | 1 | 0 | 1 | 0 | |
| Complete diagram | 0001 | 0001 | 0010 | 0010 | 0100 | 1000 | 0100 |
| Loop-backs missing | 0001 | 0000 | 0000 | 0000 | 0000 | 0000 | 0000 |

The first input is a 0, and the correct response from S0 is to stay in S0. That is the arc that was never drawn, so in the second version no D input is 1, and at the first clock edge every flip-flop loads a 0. From 0000 there is no 1 left to pass along, and the register stays at 0000 no matter what arrives.

The check to make before writing any equation is simple. Go through the diagram one state at a time and ask, for each input value, whether an arc leaves the state. If one does not, draw the loop-back.

## Reading the Equations from the Diagram

A D flip-flop loads whatever is on its D input at the clock edge, so its next value equals D. The S0 flip-flop should hold a 1 after the next clock edge exactly when the machine's next state is S0. So the question to ask for each state is: **how does the machine get here?**

Every arc that arrives at a state is one way of getting there, and each arc contributes one term. The term is the state the arc comes from, ANDed with the input condition on the arc. The D input is the OR of those terms.

Take S0. Two arcs arrive. One is its own loop-back: the machine is in S0 and $x = 0$. That is the term $S0 \cdot \bar{x}$. The other comes from S2 on $x = 0$, which is $S2 \cdot \bar{x}$. So

$$D_{S0} = S0 \cdot \bar{x} + S2 \cdot \bar{x} = \bar{x}(S0 + S2)$$

Both arcs carry the same input condition, so it factors out.

S1 has three arcs arriving, so its equation has three terms. From S0 on $x = 1$, from S1 itself on $x = 1$ (the loop-back), and from S3 on $x = 1$:

$$D_{S1} = S0 \cdot x + S1 \cdot x + S3 \cdot x = x(S0 + S1 + S3)$$

The other two states work the same way. S2 is reached from S1 and from S3, both on $x = 0$. S3 is reached only from S2, on $x = 1$.

| State | Arcs that arrive | D input |
|:-:|---|:-:|
| S0 | from S0 on $x = 0$, from S2 on $x = 0$ | $D_{S0} = \bar{x}(S0 + S2)$ |
| S1 | from S0 on $x = 1$, from S1 on $x = 1$, from S3 on $x = 1$ | $D_{S1} = x(S0 + S1 + S3)$ |
| S2 | from S1 on $x = 0$, from S3 on $x = 0$ | $D_{S2} = \bar{x}(S1 + S3)$ |
| S3 | from S2 on $x = 1$ | $D_{S3} = x \cdot S2$ |

The output is read the same way. In a Moore machine the output belongs to the states, and $Z$ is 1 only in S3. Since there is a flip-flop that is 1 exactly when the machine is in S3,

$$Z = S3$$

No state table was written and no K-map was drawn. The equations are also already in a sensible form. Because exactly one state flip-flop is 1 at a time, there is nothing to gain by trying to combine terms across different source states.

## The Circuit

The circuit has the same three regions as any finite state machine. The next-state logic is one small AND-OR structure in front of each flip-flop: an OR gate that collects the source states, and an AND gate that applies the input condition. $D_{S3}$ has a single source, so it needs only the AND. One inverter produces $\bar{x}$ for the two equations that use it. The state memory is the four flip-flops on a common clock. The output logic is a wire from the S3 flip-flop's $Q$ output.

Each flip-flop's $Q$ output carries the name of its state and is fed back to the gates that use it. Rather than drawing all of those feedback wires, the schematic labels them: every wire labeled S0 is the same wire, the output of the S0 flip-flop.

Stepping the circuit through the input stream 1 0 1 0 1 1 0 1 0 0 1 0 1 from S0 gives the following. Exactly one D input is 1 before each clock edge, so exactly one flip-flop is 1 after it.

| Clock | $x$ | State | S3 S2 S1 S0 | $Z$ |
|:-:|:-:|:-:|:-:|:-:|
| 0 | 1 | S0 | 0001 | 0 |
| 1 | 0 | S1 | 0010 | 0 |
| 2 | 1 | S2 | 0100 | 0 |
| 3 | 0 | S3 | 1000 | 1 |
| 4 | 1 | S2 | 0100 | 0 |
| 5 | 1 | S3 | 1000 | 1 |
| 6 | 0 | S1 | 0010 | 0 |
| 7 | 1 | S2 | 0100 | 0 |
| 8 | 0 | S3 | 1000 | 1 |
| 9 | 0 | S2 | 0100 | 0 |
| 10 | 1 | S0 | 0001 | 0 |
| 11 | 0 | S1 | 0010 | 0 |
| 12 | 1 | S2 | 0100 | 0 |

## Comparing One-Hot with Binary

Binary State Assignment built this same machine with the codes S0 = 00, S1 = 01, S2 = 10, S3 = 11 and arrived at $D_1 = \bar{x}Q_0 + xQ_1\bar{Q}_0$, $D_0 = x$ and $Z = Q_1Q_0$. Putting the two designs side by side:

| | Binary | One-hot |
|---|:-:|:-:|
| Flip-flops | 2 | 4 |
| Next-state gates | 3 | 7 |
| Output logic | 1 AND gate | a wire |
| Widest gate | 3 inputs | 3 inputs |
| K-maps needed | 2, after a state table | 0 |
| Literals | 8 | 13 |
| Unused codes | 0 | 12 |

It would be easy to assume that the one-hot machine, with its short equations, always has less combinational logic. In this example it does not: 13 literals against 8. The binary version benefits from a lucky assignment in which one D input turned out to be a plain wire. Neither method wins on logic every time. A poorly chosen binary assignment for this same machine costs 17 literals, more than the one-hot design.

What one-hot reliably gives is simple, uniform logic at each flip-flop and very little design effort. That advantage grows with the size of the machine. A 20-state controller in binary is 5 flip-flops and five 5-variable K-maps, preceded by a choice among an enormous number of possible assignments. In one-hot it is 20 flip-flops and twenty equations read from the diagram. The choice between the two is an implementation decision. It does not change what the machine does.

## Reset and the All-Zeros Problem

A binary assignment usually gives its starting state the code 00, which means that clearing every flip-flop is the reset. Many hardware systems are built around exactly that: one signal that takes every flip-flop to 0.

One-hot has no such luck. The code 0000 is not a state. If the register is cleared to 0000, every D input reads 0, and the machine is stuck in the same dead condition that the missing loop-backs produced. There are two ways to deal with this.

The first is a reset that loads the starting pattern, 0001, instead of all zeros.

The second keeps the simple clear-everything reset and adds one gate so that 0000 leads to the starting state by itself. This arrangement is often called **almost one-hot**: the all-zeros pattern is treated as a reset condition rather than as one of the one-hot states. A four-input NOR gate watches the four flip-flops. Its output is 1 only when none of them holds a 1. That signal is ORed into the D input of the starting state:

$$D_{S0} = \bar{x}(S0 + S2) + \overline{S3} \cdot \overline{S2} \cdot \overline{S1} \cdot \overline{S0}$$

With 0000 in the register, the NOR output is 1, it passes through the OR gate, and the next clock edge loads 0001. The machine is in S0 and runs normally from there, one clock later than it otherwise would have. In any of the four real states one flip-flop holds a 1, the NOR output is 0, and the equations behave exactly as before.

| Clock | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $x$ | 1 | 0 | 1 | 0 | 1 | 1 | |
| Without the NOR | 0000 | 0000 | 0000 | 0000 | 0000 | 0000 | 0000 |
| With the NOR | 0000 | 0001 | 0001 | 0010 | 0100 | 1000 | 0010 |

This repairs the all-zeros pattern only. A register that somehow holds two 1s is not corrected by it and still needs a proper reset.

Reset is often left out of a first draft of a design, on the understanding that it can be added in one of these ways later. It should not be left out of the finished circuit.

## One-Hot in Verilog

In a behavioral description, switching from binary to one-hot changes one line. The states become four-bit constants with a single 1, and the `case` statement that describes the state diagram is untouched:

```verilog
module detect101_onehot (
    input  wire clk,
    input  wire reset,
    input  wire x,
    output wire z
);
    // One flip-flop per state: exactly one bit of the register is 1
    localparam [3:0] S0 = 4'b0001, S1 = 4'b0010, S2 = 4'b0100, S3 = 4'b1000;

    reg [3:0] state, next;

    always @(posedge clk)
        if (reset) state <= S0;
        else       state <= next;

    always @* begin
        case (state)
            S0:      next = x ? S1 : S0;
            S1:      next = x ? S1 : S2;
            S2:      next = x ? S3 : S0;
            S3:      next = x ? S1 : S2;
            default: next = S0;
        endcase
    end

    assign z = (state == S3);
endmodule
```

Here the reset loads `S0`, which is 0001. The `default` line sends any pattern that is not one of the four states back to S0.

The equations read from the diagram can also be written out directly. This version clears its flip-flops to 0000 and includes the NOR term, so it starts itself:

```verilog
module detect101_onehot_gates (
    input  wire clk,
    input  wire clear,
    input  wire x,
    output wire z,
    output wire [3:0] q
);
    reg S3, S2, S1, S0;

    wire none = ~(S3 | S2 | S1 | S0);          // 1 only when no flip-flop holds a 1
    wire D_S0 = (~x & (S0 | S2)) | none;
    wire D_S1 =   x & (S0 | S1 | S3);
    wire D_S2 =  ~x & (S1 | S3);
    wire D_S3 =   x &  S2;

    always @(posedge clk)
        if (clear) {S3, S2, S1, S0} <= 4'b0000;
        else       {S3, S2, S1, S0} <= {D_S3, D_S2, D_S1, D_S0};

    assign z = S3;
    assign q = {S3, S2, S1, S0};
endmodule
```

Simulating the two side by side shows the gate-level register at 0000 after the clear and at 0001 one clock later. From that point the two modules agree on every clock:

```
after clear: case=0001 gates=0000
one clock later: case=0001 gates=0001
clk  x  state  z(case)  z(gates)
  0  1  0001    0        0
  1  0  0010    0        0
  2  1  0100    0        0
  3  0  1000    1        1
  4  1  0100    0        0
  5  1  1000    1        1
  6  0  0010    0        0
  7  1  0100    0        0
  8  0  1000    1        1
  9  0  0100    0        0
 10  1  0001    0        0
 11  0  0010    0        0
 12  1  0100    0        0
end     1000    1        1
```

$Z$ goes high at clocks 3, 5 and 8 and again at the end, each time one clock after a 1 0 1 has finished arriving. Those are the same four matches the binary version found.

## Key Takeaways

A one-hot state assignment uses one flip-flop for every state, and exactly one of them holds a 1 at any time. The method trades flip-flops for design effort: the D input of each state's flip-flop is the OR of the arcs that arrive at that state, each arc written as its source state ANDed with its input condition, and a Moore output is simply the OR of the states in which it is 1. No state table or K-map is needed. Because the equations are read from the arcs, the diagram has to show all of them, including loop-backs; a missing loop-back leaves out a term and can drive the register to all zeros, from which it never recovers. One-hot does not always use less logic than binary (13 literals against 8 for the 1 0 1 detector), but its logic is simple and uniform, and the savings in effort grow with the number of states. The all-zeros pattern is not a state, so the reset must either load the starting pattern or, in an almost one-hot design, a NOR of the flip-flops must steer all zeros into the starting state on the next clock.

## Review Questions

**1. A state machine has six states and uses a one-hot state assignment. How many flip-flops does it need?**

A. 3\
B. 6\
C. 8\
D. 64

**2. In a one-hot machine, state S2 is reached from S1 when $x = 0$ and from S3 when $x = 0$. What is $D_{S2}$?**

A. $x(S1 + S3)$\
B. $\bar{x} \cdot S1 \cdot S3$\
C. $\bar{x}(S1 + S3)$\
D. $\bar{x} \cdot S2$

**3. A state diagram is drawn in compact form, with the loop-backs left out. Why is that a particular hazard for the one-hot method?**

A. Each D equation is read from the arcs that are drawn, so a missing arc is a missing term\
B. One-hot machines are not allowed to stay in the same state for two clocks\
C. The loop-backs decide how many flip-flops are needed\
D. Without loop-backs the output equation cannot be written

**4. In the 1 0 1 detector the output is $Z = S3$. Why does a one-hot Moore output need no gate here?**

A. Moore outputs never need logic, in any assignment\
B. The S3 flip-flop is 1 exactly when the machine is in the only state where $Z = 1$\
C. S3 is the most significant bit of the register\
D. The output is taken from the input $x$

**5. A one-hot register is cleared to 0000 and nothing has been added to handle reset. What happens on the following clock edges?**

A. The machine moves to S0 on the first edge\
B. The machine moves to whichever state the input selects\
C. The register counts up through the unused codes\
D. Every D input is 0, so the register stays at 0000

**6. For the 1 0 1 detector, the binary design used 2 flip-flops and 8 literals, and the one-hot design used 4 flip-flops and 13 literals. Which statement is a fair conclusion?**

A. One-hot always needs more logic than binary\
B. One-hot always needs less logic than binary\
C. One-hot uses more flip-flops and is quicker to design, but it does not always reduce the logic\
D. The two designs produce different outputs

## Answer Explanations

**1. B.** One-hot uses one flip-flop per state, so six states need six flip-flops. Three is the binary answer, $\lceil \log_2 6 \rceil$. Sixty-four is the number of patterns six flip-flops can hold, of which only six are used.

**2. C.** Each arriving arc gives one term: source state ANDed with the input condition. That is $S1 \cdot \bar{x} + S3 \cdot \bar{x}$, and the shared condition factors out to give $\bar{x}(S1 + S3)$. B ANDs the two sources together, which could never be 1, because only one state flip-flop is 1 at a time. D uses the state itself as a source, which would be a loop-back that this state does not have.

**3. A.** In the one-hot method the diagram is the only source for the equations. If the arc from S0 back to S0 is not drawn, the term $\bar{x} \cdot S0$ is never written, and when that input arrives no D input is 1. The binary method is less exposed because its state table is filled in row by row, including the rows where the machine stays put.

**4. B.** With one flip-flop per state, each flip-flop's output already means "the machine is in this state." $Z$ is 1 only in S3, so the S3 flip-flop's output is $Z$. If $Z$ were 1 in two states, the output would be the OR of those two flip-flops, so A overstates it. In the binary design the same output needed an AND gate, $Q_1Q_0$.

**5. D.** Every term in every D equation contains a state flip-flop, and all of them are 0, so every D input is 0 and the register reloads 0000 on each edge. The machine does not recover without help. That is why the reset must load 0001, or a NOR of the flip-flops must be ORed into $D_{S0}$.

**6. C.** One example cannot support "always" in either direction. Here binary came out ahead on literals, helped by an assignment that turned one D input into a wire; a different binary assignment of the same machine costs 17 literals. What one-hot gives consistently is one short equation per state with no state table or K-maps. Both designs detect the same sequence on the same clocks.
