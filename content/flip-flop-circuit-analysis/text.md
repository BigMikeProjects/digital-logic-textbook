Every state machine so far has been built in one direction. You start with a description of what the machine should do, draw a state diagram, turn it into a state table, derive equations, and end with a circuit. That direction is called **synthesis**.

Sometimes the problem arrives the other way around. You are handed a schematic, perhaps from an old engineering drawing with no explanation attached, and asked what the circuit does. Answering that is called **analysis**, and it is synthesis run backwards. From the circuit you recover the equations, from the equations the state table, and from the table the state diagram. The state diagram is the answer, because it shows in one picture everything the circuit can do.

Analysis is also how a design gets checked. If the diagram you recover from your finished circuit is not the diagram you started from, something went wrong along the way.

## The Six Steps

Analysis works because every synchronous state machine has the same structure: next-state logic, a register of flip-flops, and output logic. Knowing that structure tells you what to look for.

1. **Find the state.** The flip-flop outputs are the state. Name the inputs and outputs.
2. **Write the excitation equations.** These are the equations for the flip-flop inputs.
3. **Write the output equation.**
4. **Build the state table.** Evaluate the equations for every combination of state and input.
5. **Draw the state diagram.** One arc for each row of the table.
6. **Say what it does.**

The rest of this topic works through the steps on one circuit.

## The Circuit

The circuit has two D flip-flops on a common clock, one input $X$, one output $Z$, and three gates:

| Gate | Its inputs | What it drives |
|:-:|---|:-:|
| XOR | $X$ and the $\overline{Q}$ output of flip-flop 0 | $D_1$ |
| XOR | $X$ and the $Q$ output of flip-flop 1 | $D_0$ |
| AND | the $Q$ output of flip-flop 1 and the $\overline{Q}$ output of flip-flop 0 | $Z$ |

There are no inverters. Each complemented signal is taken from a flip-flop's $\overline{Q}$ pin. Nothing about this schematic suggests what the circuit is for.

## Step 1: Find the State

The state of a machine is whatever its flip-flops are holding. This circuit has two flip-flops, so the state is the pair $Q_1 Q_0$ and there are four possible states: 00, 01, 10 and 11.

The one signal that comes in from outside is $X$, and the one that goes out is $Z$.

## Step 2: The Excitation Equations

An **excitation equation** gives a flip-flop's input in terms of the present state and the external inputs. To find one, start at the flip-flop's D input and trace back through whatever gate drives it.

$D_1$ is driven by an XOR gate whose inputs are $X$ and $\overline{Q_0}$. $D_0$ is driven by an XOR gate whose inputs are $X$ and $Q_1$.

$$D_1 = X \oplus \overline{Q_0} \qquad D_0 = X \oplus Q_1$$

The two gates are identical. The whole difference between the two equations is which flip-flop pin each gate is wired to: the $\overline{Q}$ pin of flip-flop 0 in one case and the $Q$ pin of flip-flop 1 in the other. This is the step where analysis usually goes wrong. The algebra that follows is routine, but if a pin is misread here, reading $Q$ for $\overline{Q}$ or one flip-flop for the other, every later step faithfully analyzes the wrong circuit.

## Step 3: The Output Equation

Trace the output back the same way. $Z$ comes from an AND gate fed by $Q_1$ and $\overline{Q_0}$:

$$Z = Q_1\,\overline{Q_0}$$

Two things can be read from this. First, $Z$ is 1 only when $Q_1 = 1$ and $Q_0 = 0$, which is the state 10. Second, $X$ does not appear. The output depends on the state alone, so this is a Moore machine, in the sense described in Mealy versus Moore.

## Step 4: The State Table

The state table needs a row for every combination of present state and input: four states times two input values, eight rows. For each row, work out $D_1$ and $D_0$ from the excitation equations.

What turns those D values into a state table is the behavior of the D flip-flop. At the clock edge a D flip-flop loads whatever is on its D input:

$$Q^+ = D$$

So the D inputs *are* the next state. Whatever $D_1 D_0$ works out to in a row is what $Q_1 Q_0$ will be after the next clock edge.

Take the first row, where $Q_1 Q_0 = 00$ and $X = 0$. Since $Q_0 = 0$, its complement $\overline{Q_0}$ is 1, and $D_1 = 0 \oplus 1 = 1$. For the other flip-flop, $D_0 = X \oplus Q_1 = 0 \oplus 0 = 0$. So $D_1 D_0 = 10$, and the next state is 10. The output is 0, because the present state is not 10.

Now the last row, where $Q_1 Q_0 = 11$ and $X = 1$. Here $\overline{Q_0} = 0$, so $D_1 = 1 \oplus 0 = 1$, and $D_0 = 1 \oplus 1 = 0$. The next state is 10 again, and the output is 0.

A helper column for $\overline{Q_0}$ makes the $D_1$ calculation easier to carry out without slips. The full table:

| $Q_1$ | $Q_0$ | $X$ | $\overline{Q_0}$ | $D_1 = X \oplus \overline{Q_0}$ | $D_0 = X \oplus Q_1$ | $Q_1^+$ | $Q_0^+$ | $Z$ |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 0 | 1 | 1 | 0 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 1 |
| 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 |
| 1 | 1 | 1 | 0 | 1 | 0 | 1 | 0 | 0 |

The next-state columns are copies of the D columns, which is $Q^+ = D$ at work. The $Z$ column is 1 in the two rows where the present state is 10, and it is the same for both values of $X$ in those rows, as it must be for a Moore machine.

## Step 5: The State Diagram

The diagram is drawn straight from the table. Draw one circle for each of the four states and write the output inside it, since this is a Moore machine. Then take the table one row at a time. Each row is one arc: it starts at the row's present state, ends at its next state, and is labeled with the row's value of $X$.

The first row says that from 00 with $X = 0$ the machine goes to 10. The second says that from 00 with $X = 1$ it goes to 01. Continuing through all eight rows gives eight arcs:

| From | On $X = 0$ go to | On $X = 1$ go to | $Z$ |
|:-:|:-:|:-:|:-:|
| 00 | 10 | 01 | 0 |
| 01 | 00 | 11 | 0 |
| 11 | 01 | 10 | 0 |
| 10 | 11 | 00 | 1 |

Every state has two arcs leaving it, one for each value of $X$, and no state has an arc back to itself. With that, the question "what does this circuit do?" is answered. Given any starting state and any sequence of inputs, the diagram tells you every state the circuit will pass through and every value $Z$ will take. On an exam, the completed state diagram is the answer to an analysis problem.

## Step 6: What the Circuit Does

It is often possible to go one step further and describe the behavior in words. Follow the $X = 1$ arcs:

$$00 \rightarrow 01 \rightarrow 11 \rightarrow 10 \rightarrow 00$$

Now follow the $X = 0$ arcs:

$$00 \rightarrow 10 \rightarrow 11 \rightarrow 01 \rightarrow 00$$

It is the same ring of four states, walked in the opposite direction. And the order 00, 01, 11, 10 is a familiar one. It is Gray code, the same order written across the top of a Karnaugh map, in which exactly one bit changes at each step. That is true of all eight arcs in this diagram.

So the circuit is a **2-bit Gray-code up/down counter**. With $X = 1$ it counts up through the Gray sequence, with $X = 0$ it counts down, and $Z$ goes high in state 10, the last state of the up sequence before it wraps around.

Nothing in the schematic looked like a counter. Two XOR gates and an AND gate only revealed what they were doing once the table and the diagram were on the page, and that is the reason for following the procedure instead of trying to guess a circuit's purpose by staring at it.

## Checking the Answer

A recovered state diagram can be checked by clocking the circuit through a sequence of inputs and comparing each step with the diagram. Starting in 00 and applying $X$ = 1 1 1 1 0 0 0 1 1 1 0 0:

| Clock | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $X$ | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 0 |
| $Q_1 Q_0$ | 00 | 01 | 11 | 10 | 00 | 10 | 11 | 01 | 11 | 10 | 00 | 10 |
| $Z$ | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | 1 |

Four 1s take the machine once around the ring and back to 00, with $Z$ high as it passes through 10. Three 0s then walk it backwards: 00 to 10 to 11 to 01. The next three 1s move it forward again, and the last two 0s reverse it once more. The changes of direction in the middle of the run are what make the up/down behavior unmistakable.

The same circuit written in Verilog, gate for gate:

```verilog
module mystery (
    input  wire clk,
    input  wire reset,
    input  wire X,
    output wire Z
);
    reg Q1, Q0;

    wire D1 = X ^ ~Q0;      // XOR gate: X and the Q0-bar pin
    wire D0 = X ^  Q1;      // XOR gate: X and the Q1 pin

    always @(posedge clk)
        if (reset) {Q1, Q0} <= 2'b00;
        else       {Q1, Q0} <= {D1, D0};

    assign Z = Q1 & ~Q0;    // AND gate: Q1 and the Q0-bar pin
endmodule
```

Simulating it with the same input sequence gives the same states and outputs as the table:

```
clk  X  Q1Q0  Z
  0  1   00   0
  1  1   01   0
  2  1   11   0
  3  1   10   1
  4  0   00   0
  5  0   10   1
  6  0   11   0
  7  1   01   0
  8  1   11   0
  9  1   10   1
 10  0   00   0
 11  0   10   1
end      11   0
```

## Key Takeaways

Analysis is synthesis run backwards: given a flip-flop circuit, you recover its equations, then its state table, then its state diagram. The flip-flop outputs are the state, so counting flip-flops tells you how many state bits there are. Tracing each D input back through its gates gives the excitation equations, and tracing each output back gives the output equation; if no input appears in the output equation, the machine is a Moore machine. Because a D flip-flop obeys $Q^+ = D$, evaluating the excitation equations for every combination of present state and input gives the next state directly, and those rows are the state table. Each row of the table becomes one arc of the state diagram, and the diagram is the complete answer to what the circuit does. The step that most often goes wrong is the first reading of the schematic, where a $Q$ pin is mistaken for a $\overline{Q}$ pin or one flip-flop for another. In the example, two XOR gates and an AND gate turned out to be a 2-bit Gray-code up/down counter, which could not have been seen from the schematic alone.

## Review Questions

**1. A circuit contains three D flip-flops, two inputs and one output. How many rows does its state table have?**

A. 5\
B. 8\
C. 16\
D. 32

**2. In flip-flop circuit analysis, what is an excitation equation?**

A. The equation for an external output in terms of the state\
B. The equation for a flip-flop's input in terms of the present state and the inputs\
C. The equation that gives the number of flip-flops needed\
D. The equation for the clock signal

**3. The excitation equations of a D flip-flop circuit give $D_1 D_0 = 10$ for a particular row of the state table. What is the next state in that row?**

A. 10, because a D flip-flop loads its D input at the clock edge\
B. 01, because the flip-flop outputs are complemented\
C. It depends on the present state\
D. It cannot be determined without the output equation

**4. An analysis produces the output equation $Z = Q_1\,\overline{Q_0}$ for a circuit with an input $X$. What does this tell you?**

A. The machine is a Mealy machine\
B. The output is 1 in two different states\
C. The machine is a Moore machine, and $Z$ is 1 only in state 10\
D. The input $X$ is not connected to anything

**5. In the example circuit, the present state is $Q_1 Q_0 = 01$ and $X = 1$. Using $D_1 = X \oplus \overline{Q_0}$ and $D_0 = X \oplus Q_1$, what is the next state?**

A. 00\
B. 01\
C. 10\
D. 11

**6. A student analyzing the example circuit reads the first XOR gate as connected to $Q_0$ when it is actually connected to $\overline{Q_0}$. What is the consequence?**

A. Only the output column of the state table is wrong\
B. The state table and state diagram are worked out correctly, but for a different circuit\
C. The mistake cancels out when the state diagram is drawn\
D. The number of states changes

## Answer Explanations

**1. D.** The table needs one row for every combination of present state and inputs. Three flip-flops give $2^3 = 8$ states and two inputs give $2^2 = 4$ input combinations, so there are $8 \times 4 = 32$ rows. The number of outputs adds columns, not rows.

**2. B.** An excitation equation describes what is applied to a flip-flop's input, written in terms of the present state and the external inputs. It is found by tracing back from the flip-flop input through the gates that drive it. A describes the output equation.

**3. A.** For a D flip-flop, $Q^+ = D$. Whatever is on the D inputs before the clock edge is the state after it, so $D_1 D_0 = 10$ means the next state is 10. The present state has already been used in computing the D values and plays no further part.

**4. C.** The input $X$ does not appear in the output equation, so the output depends on the state alone, which is the definition of a Moore machine. $Q_1\,\overline{Q_0}$ is 1 only when $Q_1 = 1$ and $Q_0 = 0$, the single state 10. $X$ is still connected to the next-state logic, so D does not follow.

**5. D.** With $Q_0 = 1$, $\overline{Q_0} = 0$, so $D_1 = 1 \oplus 0 = 1$. With $Q_1 = 0$, $D_0 = 1 \oplus 0 = 1$. The D inputs are 11, so the next state is 11. This is the fourth row of the state table, and on the diagram it is the $X = 1$ arc from 01 to 11.

**6. B.** Every later step depends on the excitation equations. With $D_1 = X \oplus Q_0$ in place of $X \oplus \overline{Q_0}$, the $D_1$ column is inverted in every row, so the table and diagram are internally consistent but describe a circuit that was never built. Nothing later in the procedure will catch the error, which is why the pins should be read carefully and the result checked by stepping the real circuit.
