A finite state machine is built from three parts: next-state combinational logic, a bank of flip-flops that holds the current state, and output logic that reads the state. The state diagram tells you what the machine must do, but it names its states with labels like S0 and S1, and flip-flops do not store labels. They store bits. Before a single gate can be drawn, every state has to be given a binary code.

That step is called **state assignment**, and it is a genuinely free choice. Any assignment in which each state gets its own code produces a machine that behaves correctly. What the choice changes is the amount of logic you have to build. This topic works one small machine through two different assignments, gets 8 literals from one and 17 from the other, and then searches every possible assignment to find the cheapest.

## From State Diagram to Circuit

Designing a synchronous machine with a binary state assignment follows the same five steps every time.

1. **Draw the state diagram.** This comes from the problem you are solving: what the inputs are, what the output should be, and how the machine must respond over time. No hardware is involved yet, just what the machine has to remember.
2. **Count the flip-flops.** A binary assignment packs the states into the fewest bits it can.
3. **Choose the codes.** Give each state its own binary code. This is the step this topic is about.
4. **Build the state table, K-maps and equations.** Write the coded state table, draw one Karnaugh map for each flip-flop's D input and one for the output, and minimize.
5. **Build the circuit.** Put the D equations in front of the flip-flops and the output equation after them.

Step 3 is the only one where you make a real decision, and its effects only show up in step 4. When the equations come out large, the fix is to go back to step 3, re-code the states and derive the equations again. The machine's behavior does not change when you do this. Only the gates change.

## How Many Flip-Flops, How Many Codes

A single flip-flop can hold two codes, two flip-flops can hold four, and $k$ flip-flops can hold $2^k$. A machine with $n$ states therefore needs at least

$$k = \lceil \log_2 n \rceil$$

flip-flops. The ceiling brackets mean "round up": take $\log_2 n$, and if it is not a whole number, go to the next integer. Four states need $\log_2 4 = 2$ flip-flops exactly. Five states give $\log_2 5 \approx 2.32$, which rounds up to 3.

Once $k$ is fixed there are $2^k$ codes available, and the question becomes how many ways the $n$ states can be matched with them. The first state can take any of the $2^k$ codes, the second any of the $2^k - 1$ codes left, and so on, so the count is

$$\frac{2^k!}{(2^k - n)!}$$

| States $n$ | Flip-flops $k$ | Codes available | Ways to assign them |
|:-:|:-:|:-:|:-:|
| 2 | 1 | 2 | 2 |
| 3 | 2 | 4 | 24 |
| 4 | 2 | 4 | 24 |
| 5 | 3 | 8 | 6,720 |
| 6 | 3 | 8 | 20,160 |
| 8 | 3 | 8 | 40,320 |
| 9 | 4 | 16 | 4,151,347,200 |

Three states and four states both have 24 assignments. Three states still need two flip-flops, so there are still four codes to choose from: $4 \cdot 3 \cdot 2 = 24$, with one code simply left unused. The count also grows very quickly. Twenty-four options can be checked by hand; four billion cannot.

## The Example Machine

The machine used throughout is a **Moore detector for the sequence 1 0 1**, with overlaps allowed. It watches a serial input $x$, one bit per clock, and raises $Z$ for one clock period whenever the last three inputs were 1, 0, 1. Because overlaps are allowed, the final 1 of one match can be the first 1 of the next, so the input 1 0 1 0 1 produces two matches.

Each state records how much of the pattern has been seen:

| State | What it means | Next state, $x = 0$ | Next state, $x = 1$ | $Z$ |
|:-:|---|:-:|:-:|:-:|
| S0 | nothing useful seen yet | S0 | S1 | 0 |
| S1 | the last input was 1 | S2 | S1 | 0 |
| S2 | the last two inputs were 1 0 | S0 | S3 | 0 |
| S3 | the last three were 1 0 1 (a match) | S2 | S1 | 1 |

Follow the table to see how it works. From S1, an input of 0 extends the pattern to 1 0, so the machine moves to S2. From S2, a 1 completes the pattern and the machine moves to S3, where $Z = 1$. From S3, a 0 means the last two inputs are now 1 0, which is S2 again; a 1 means only the last input is useful, which is S1. Because this is a Moore machine, $Z$ depends only on the state.

Four states means two flip-flops, $Q_1$ and $Q_0$, and 24 possible assignments. Two of them follow.

## Assignment A: Codes in Name Order

The most natural choice is to number the states in order: S0 = 00, S1 = 01, S2 = 10, S3 = 11. Substituting these codes into the state table gives the coded table, with $Q_1^+ Q_0^+$ standing for the next state:

| $Q_1 Q_0$ | State | $Q_1^+ Q_0^+$, $x = 0$ | $Q_1^+ Q_0^+$, $x = 1$ | $Z$ |
|:-:|:-:|:-:|:-:|:-:|
| 00 | S0 | 00 | 01 | 0 |
| 01 | S1 | 10 | 01 | 0 |
| 10 | S2 | 00 | 11 | 0 |
| 11 | S3 | 10 | 01 | 1 |

With D flip-flops, the value a flip-flop should hold next is exactly the value to put on its D input, so $D_1$ is the $Q_1^+$ column and $D_0$ is the $Q_0^+$ column. Each becomes a three-variable K-map with $x$ on the rows and $Q_1 Q_0$ on the columns in Gray order. The two end columns, 00 and 10, are neighbors.

$D_1$:

| $x$ \ $Q_1 Q_0$ | 00 | 01 | 11 | 10 |
|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 |

$D_0$:

| $x$ \ $Q_1 Q_0$ | 00 | 01 | 11 | 10 |
|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 |

The $D_1$ map has a pair in the top row ($\bar{x}Q_0$) and a lone 1 that cannot join anything ($xQ_1\bar{Q}_0$). The $D_0$ map is the whole bottom row, which is just $x$. The output is 1 only in S3 = 11.

$$D_1 = \bar{x}Q_0 + xQ_1\bar{Q}_0 \qquad D_0 = x \qquad Z = Q_1 Q_0$$

That comes to **8 literals and 4 gates**: two ANDs and an OR for $D_1$, one AND for $Z$, and nothing at all for $D_0$, which is a plain wire from $x$ to the flip-flop. The complemented variables $\bar{Q}_1$ and $\bar{Q}_0$ cost nothing, because each flip-flop provides them on its $\bar{Q}$ pin.

$D_0 = x$ is not an accident, and it is worth seeing why. Look at the state table: every arc with $x = 1$ leads to S1 or S3, and every arc with $x = 0$ leads to S0 or S2. S1 and S3 are exactly the states that mean "the last input was 1." Assignment A happens to give both of them codes ending in 1, and gives S0 and S2 codes ending in 0. So the low bit of the state simply *is* the last input, and one whole K-map collapsed into a wire.

## Assignment B: The Same Codes in Gray Order

Now keep S0 and S1 where they were and swap the other two: S0 = 00, S1 = 01, S2 = 11, S3 = 10. The four codes are the same; only the labeling is different.

| $Q_1 Q_0$ | State | $Q_1^+ Q_0^+$, $x = 0$ | $Q_1^+ Q_0^+$, $x = 1$ | $Z$ |
|:-:|:-:|:-:|:-:|:-:|
| 00 | S0 | 00 | 01 | 0 |
| 01 | S1 | 11 | 01 | 0 |
| 11 | S2 | 00 | 10 | 0 |
| 10 | S3 | 11 | 01 | 1 |

$D_1$:

| $x$ \ $Q_1 Q_0$ | 00 | 01 | 11 | 10 |
|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |

$D_0$:

| $x$ \ $Q_1 Q_0$ | 00 | 01 | 11 | 10 |
|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 1 | 0 | 1 |
| 1 | 1 | 1 | 0 | 1 |

The $D_1$ map is a checkerboard: no 1 sits next to another 1, so nothing groups and every term needs all three literals. $D_0$ only groups in pairs.

$$D_1 = \bar{x}\bar{Q}_1 Q_0 + \bar{x}Q_1\bar{Q}_0 + xQ_1Q_0$$

$$D_0 = x\bar{Q}_1 + \bar{Q}_1Q_0 + Q_1\bar{Q}_0 \qquad Z = Q_1\bar{Q}_0$$

That is **17 literals and 9 gates**, more than twice the logic of Assignment A. Nothing about the machine changed. It detects the same sequence, clock for clock, from the same state diagram. The only thing that changed was which code sat in which state, and that was enough to scatter the 1s across the K-maps.

## Searching All 24 Assignments

With only 24 candidates, the obvious move is to try them all: for each assignment, build the coded table, minimize $D_1$, $D_0$ and $Z$, and count literals. That is tedious by hand but trivial for a short program, which is also how the numbers in this topic were checked. The results fall into two clearly separated groups:

| Total literals | Number of assignments |
|:-:|:-:|
| 6 | 4 |
| 7 | 4 |
| 8 | 4 |
| 9 | 4 |
| 16 | 4 |
| 17 | 4 |

Assignment A is in the good group and Assignment B is at the very bottom. The cheapest assignments reach 6 literals. One of them is

$$\text{S0} = 00 \qquad \text{S1} = 11 \qquad \text{S2} = 01 \qquad \text{S3} = 10$$

| $Q_1 Q_0$ | State | $Q_1^+ Q_0^+$, $x = 0$ | $Q_1^+ Q_0^+$, $x = 1$ | $Z$ |
|:-:|:-:|:-:|:-:|:-:|
| 00 | S0 | 00 | 11 | 0 |
| 11 | S1 | 01 | 11 | 0 |
| 01 | S2 | 00 | 10 | 0 |
| 10 | S3 | 01 | 11 | 1 |

$$D_1 = x \qquad D_0 = Q_1 + x\bar{Q}_0 \qquad Z = Q_1\bar{Q}_0$$

**6 literals and 3 gates.** The same trick as Assignment A is at work, but on the other bit: S1 and S3 both have $Q_1 = 1$ and S0 and S2 both have $Q_1 = 0$, so the high bit is the last input and $D_1$ is a wire. The rest of the codes also happen to make $D_0$ group well.

Swapping which flip-flop you call $Q_1$ and which you call $Q_0$ never changes the cost; it just relabels the K-maps. That is why each literal count in the table above appears an even number of times.

## Rules of Thumb for Choosing Codes

There is no formula that produces the best assignment directly, but a few rules of thumb reliably steer you toward the good group:

- **Give the reset state the all-zeros code.** Clearing every flip-flop is the simplest reset to build.
- **Give adjacent codes to states with the same next states.** "Adjacent" means differing in one bit. When two states go to the same places on the same inputs, putting them next to each other on the K-map lets their 1s combine.
- **Give adjacent codes to states that are both next states of the same state.**

When the rules conflict, the second one usually matters most. In this machine, S1 and S3 have identical next-state rows (both go to S2 on 0 and S1 on 1); they differ only in the output. S0 and S2 both go to S0 on a 0. Assignment A and the 6-literal assignment both give each of these pairs codes one bit apart. Assignment B gives S1 and S3 the codes 01 and 10, and S0 and S2 the codes 00 and 11, which differ in both bits, and it lands at 17 literals.

The rules get you into the good group, not necessarily to the single best answer. For larger machines, where the number of assignments runs into the billions, synthesis tools search the space with heuristics of their own.

## State Assignment in Verilog

In Verilog the state assignment is usually written as a set of named constants, and the rest of the description refers only to the names:

```verilog
module detect101 (
    input  wire clk,
    input  wire reset,
    input  wire x,
    output wire z
);
    // The state assignment: change these four codes and nothing else
    localparam [1:0] S0 = 2'b00, S1 = 2'b11, S2 = 2'b01, S3 = 2'b10;

    reg [1:0] state, next;

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

The `case` statement is just the state table, one line per row. The `localparam` line is step 3 of the method, and it is the only line that differs between Assignment A, Assignment B and the 6-literal assignment. Everything else stays the same because the behavior stays the same. The synthesis tool performs step 4 for whichever codes you give it (and many tools will re-encode the states on their own unless told not to).

The same machine can also be written directly from the minimized equations:

```verilog
module detect101_gates (
    input  wire clk,
    input  wire reset,
    input  wire x,
    output wire z
);
    reg  Q1, Q0;
    wire D1 = x;
    wire D0 = Q1 | (x & ~Q0);

    always @(posedge clk)
        if (reset) {Q1, Q0} <= 2'b00;
        else       {Q1, Q0} <= {D1, D0};

    assign z = Q1 & ~Q0;
endmodule
```

Simulating both modules side by side on the input stream 1 0 1 0 1 1 0 1 0 0 1 0 1 gives identical outputs:

```
clk  x  state  z(case)  z(gates)
  0  1   00      0        0
  1  0   11      0        0
  2  1   01      0        0
  3  0   10      1        1
  4  1   01      0        0
  5  1   10      1        1
  6  0   11      0        0
  7  1   01      0        0
  8  0   10      1        1
  9  0   01      0        0
 10  1   00      0        0
 11  0   11      0        0
 12  1   01      0        0
end     10      1        1
```

$Z$ goes high four times, each time the clock after a 1 0 1 has finished arriving, including the overlapping matches at clocks 3 and 5.

## Key Takeaways

State assignment is the step where the symbolic states of a state diagram receive the binary codes that the flip-flops actually store. A binary assignment uses the fewest flip-flops possible, $\lceil \log_2 n \rceil$ for $n$ states, and even then leaves many ways to hand out the codes: 24 for three or four states, and billions for a machine with just nine. Every one of those assignments produces a correctly working machine, but they do not produce the same amount of logic. In the 1 0 1 detector, codes in name order cost 8 literals, the same codes in Gray order cost 17, and the best assignments cost 6. The difference comes entirely from where the 1s land on the K-maps. Assigning adjacent codes to states that share next states keeps those 1s together, and when a code bit can be made to mean something simple, such as "the last input was 1," its whole next-state equation can shrink to a wire. When the equations come out large, go back and re-code the states; the behavior will not change, only the gates.

## Review Questions

**1. A state machine has five states and uses a binary state assignment. How many flip-flops does it need?**

A. 2\
B. 3\
C. 5\
D. 8

**2. A machine has four states and two flip-flops. How many different ways can the four codes be assigned to the four states?**

A. 4\
B. 16\
C. 24\
D. 256

**3. Two designers build the same state diagram with different state assignments. What must be true of their two circuits?**

A. They detect different input sequences\
B. They use different numbers of flip-flops\
C. Their outputs are one clock period apart\
D. They behave identically but may need different amounts of logic

**4. In Assignment A (S0 = 00, S1 = 01, S2 = 10, S3 = 11), why does $D_0$ reduce to just $x$?**

A. Every arc with $x = 1$ leads to a state whose code ends in 1, and every arc with $x = 0$ leads to a state whose code ends in 0\
B. $D_0$ is always equal to the input in a Moore machine\
C. The output $Z$ does not depend on $Q_0$\
D. $Q_0$ is the least significant bit, so it always follows the input

**5. In the 1 0 1 detector, S1 and S3 go to the same next states for every input. According to the rules of thumb, what codes should they receive?**

A. Codes that differ in both bits, such as 01 and 10\
B. Codes that differ in exactly one bit, such as 01 and 11\
C. The two largest codes, 10 and 11\
D. It does not matter, since every assignment works

**6. In the `detect101` Verilog module, what would you change to try Assignment B instead?**

A. The `case` statement, one line per state\
B. The `always @(posedge clk)` block\
C. The four values on the `localparam` line\
D. The width of the `state` register

## Answer Explanations

**1. B.** Two flip-flops hold only four codes, which is not enough for five states. $\lceil \log_2 5 \rceil = \lceil 2.32 \rceil = 3$, and three flip-flops provide eight codes, three of which go unused.

**2. C.** The first state can take any of the 4 codes, the second any of the remaining 3, the third either of the remaining 2, and the last state takes whatever is left: $4 \cdot 3 \cdot 2 \cdot 1 = 24$. Two flip-flops give $2^2 = 4$ codes, not 16, so B and D count something else.

**3. D.** The state assignment only decides which bit pattern stands for which state. The state diagram, and so the machine's behavior, is unchanged. What changes is the coded state table, and with it the K-maps and the size of the minimized equations: 8 literals versus 17 in the two assignments worked through here. The number of flip-flops is set by the number of states, not by the assignment.

**4. A.** Every $x = 1$ arc goes to S1 or S3, and Assignment A gives both codes ending in 1. Every $x = 0$ arc goes to S0 or S2, both with codes ending in 0. So the next value of $Q_0$ is always the current input, and the $D_0$ K-map is a full row of 1s for $x = 1$. This is a property of this assignment, not of Moore machines or of the low bit in general; in Assignment B, $D_0$ needs three terms.

**5. B.** States with the same next states produce matching entries in the coded table. Giving them codes one bit apart places those entries in adjacent K-map cells, where they combine and the differing bit drops out. Assignment B gave them 01 and 10, which differ in both bits, and cost 17 literals. D is true of correctness but misses the point of the rule, which is about cost.

**6. C.** The `localparam` line is the state assignment. The `case` statement and the rest of the module refer to the states only by name, so changing the codes to `S0 = 2'b00, S1 = 2'b01, S2 = 2'b11, S3 = 2'b10` gives Assignment B with no other edits. The register stays two bits wide because the number of states has not changed.
