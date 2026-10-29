A finite state machine with a datapath is easy to describe and surprisingly hard to read in time. The diagram says what happens in each state, but a timing diagram asks something sharper: on this clock edge, which state comes next, and what value lands in the register? This topic answers that question for one small machine. It is not a useful circuit. It is an exercise, built so that every rule about FSMD timing shows up within a dozen clock cycles.

The topic has two parts. First the three-step method from FSMD - Finite State Machines with Datapaths is run quickly on the given machine: build the datapath, then derive the controller, this time with one flip-flop per state. Then the machine is clocked through a timing diagram one edge at a time, and the reading rules are spelled out as they come up.

## The Given FSMD

The machine is handed to you complete. It has three states, A, B and C, and resets into A. One input, $a$, steers the machine from state to state. Two 8-bit inputs, $X$ and $Y$, carry data. The outputs are the 8-bit register $R$ and a single bit $z$.

Each state performs one register transfer on every clock it spends there:

$$\text{A: } R \leftarrow 0 \qquad\qquad \text{B: } R \leftarrow X \qquad\qquad \text{C: } R \leftarrow Y$$

The output $z$ is a Moore output: it is 1 in state C and 0 in A and B.

The arcs depend only on $a$. From every state, $a = 1$ leads to C. When $a = 0$, A goes to B, B goes back to A, and C goes to B.

| Present state | $a = 0$ | $a = 1$ | Transfer | $z$ |
|:-:|:-:|:-:|:-:|:-:|
| A | B | C | $R \leftarrow 0$ | 0 |
| B | A | C | $R \leftarrow X$ | 0 |
| C | B | C | $R \leftarrow Y$ | 1 |

## Building the Datapath

The datapath is read off the FSMD the same way as before: registers first, then the transfers, then the conditions on the arcs.

There is one register, $R$, so the datapath gets one 8-bit register. Three different values are written into it: 0, $X$ and $Y$. A register has only one data input, so a three-input multiplexer chooses among them and feeds $R$. The multiplexer needs select lines, and the FSMD never mentions them. Call them $\text{selX}$ and $\text{selY}$. With both at 0 the multiplexer passes 0; with $\text{selX} = 1$ it passes $X$; with $\text{selY} = 1$ it passes $Y$. These are **control signals**: the datapath receives them but cannot produce them.

The last reading usually adds comparators, one for each condition that tests the data. Here there are none. Every arc depends on the input $a$, not on a register value, so the datapath sends no status signals back. That keeps this example small enough to focus on timing.

## Deriving the Controller

The controller keeps the FSMD's states and arcs and replaces each transfer with the control signals that make it happen. In state A, $R \leftarrow 0$ needs both selects at 0. In state B, $R \leftarrow X$ needs $\text{selX} = 1$. In state C, $R \leftarrow Y$ needs $\text{selY} = 1$.

This time the controller is built **one-hot**: one flip-flop per state, named $Q_A$, $Q_B$ and $Q_C$, with exactly one of them holding a 1 at any time. Reset sets $Q_A = 1$ and clears the other two. One-hot has a useful property here: the next-state equations can be written by inspection, one term for each arc that enters a state. The only arc into A comes from B on $\overline{a}$, so

$$Q_A^{+} = Q_B\,\overline{a}$$

Two arcs enter B, from A and from C, both on $\overline{a}$:

$$Q_B^{+} = Q_A\,\overline{a} + Q_C\,\overline{a}$$

Three arcs enter C, one from each state, all on $a$:

$$Q_C^{+} = Q_A\,a + Q_B\,a + Q_C\,a$$

The outputs are even simpler. Each control signal is 1 in exactly one state, so it is just that state's flip-flop:

$$\text{selX} = Q_B \qquad\qquad \text{selY} = Q_C \qquad\qquad z = Q_C$$

The control signals are the state bits themselves, and $z$ and $\text{selY}$ are the same wire. No output logic is needed at all.

## The Machine in Verilog

Written as one module, the controller is three flip-flops whose inputs are the equations above, and the datapath is the multiplexer and register:

```verilog
module fsmd_timing (
  input            clk,
  input            reset,
  input            a,
  input      [7:0] X,
  input      [7:0] Y,
  output reg [7:0] R,
  output           z
);
  // Controller: one flip-flop per state, reset into A
  reg QA, QB, QC;
  wire selX = QB;
  wire selY = QC;
  assign z = QC;

  always @(posedge clk) begin
    if (reset) begin
      QA <= 1'b1;
      QB <= 1'b0;
      QC <= 1'b0;
    end else begin
      QA <= QB & ~a;
      QB <= (QA & ~a) | (QC & ~a);
      QC <= (QA & a) | (QB & a) | (QC & a);
    end
  end

  // Datapath: a 3-input mux (0, X, Y) into register R
  always @(posedge clk) begin
    if (selY)
      R <= Y;
    else if (selX)
      R <= X;
    else
      R <= 8'h00;
  end
endmodule
```

Simulated in Icarus Verilog with the input sequence used in the timing diagram below, it prints one row per clock cycle:

```
cycle  0  state A  a=0  X=3c  Y=a5  R=00  z=0
cycle  1  state B  a=1  X=3c  Y=a5  R=00  z=0
cycle  2  state C  a=1  X=3c  Y=a5  R=3c  z=1
cycle  3  state C  a=1  X=3c  Y=a5  R=a5  z=1
cycle  4  state C  a=0  X=5a  Y=a5  R=a5  z=1
cycle  5  state B  a=0  X=5a  Y=a5  R=a5  z=0
cycle  6  state A  a=1  X=5a  Y=7e  R=5a  z=0
cycle  7  state C  a=0  X=5a  Y=7e  R=00  z=1
cycle  8  state B  a=0  X=5a  Y=7e  R=7e  z=0
cycle  9  state A  a=1  X=5a  Y=7e  R=5a  z=0
cycle 10  state C  a=0  X=5a  Y=7e  R=00  z=1
cycle 11  state B  a=1  X=5a  Y=7e  R=7e  z=0
```

The simulation shows $R = 00$ at cycle 0 because the reset edge already performed A's transfer. The interactive starts at reset itself, so it shows $R$ as unknown there.

## Reading the Timing Diagram

A timing diagram of an FSMD lists the clock, the inputs, the state, the register and the outputs, one column per clock cycle. The convention is that **values change only at clock edges**. Between edges every signal is steady, so each cell holds one value for the whole cycle.

Four rules are enough to fill one in.

1. **Nothing happens except at a rising clock edge.** The state and the register change there and nowhere else.
2. **The input just before the edge picks the arc.** To find the next state, look at the present state and the value of $a$ in the present cycle.
3. **The register lags by one cycle.** The transfer written beside the state you are *leaving* is the one performed on the edge, so its result appears in $R$ in the next cycle.
4. **Inputs are sampled at the edge.** $X$ and $Y$ are read at the moment of the edge; a later change does not matter until the next one.

The Moore output $z$ follows the state with no delay: it is 1 in every cycle the machine spends in C.

Here is the scripted run from the interactive, filled in by those rules:

| Cycle | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $a$ | 0 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 1 |
| $X$ | 3C | 3C | 3C | 3C | 5A | 5A | 5A | 5A | 5A | 5A | 5A | 5A |
| $Y$ | A5 | A5 | A5 | A5 | A5 | A5 | 7E | 7E | 7E | 7E | 7E | 7E |
| State | A | B | C | C | C | B | A | C | B | A | C | B |
| $R$ | ?? | 00 | 3C | A5 | A5 | A5 | 5A | 00 | 7E | 5A | 00 | 7E |
| $z$ | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 |

Three edges from that run show how the rules work together.

**From cycle 1 to cycle 2.** The machine is in B and $a = 1$. Rule 2 says B goes to C on $a$, so cycle 2 is in C. Rule 3 says the transfer of the state being left, B's $R \leftarrow X$, happens on this edge. $X$ is 3C, so cycle 2 shows $R = 3C$. The machine is now in C, so $z = 1$.

**From cycle 2 to cycle 3.** The machine is in C and $a$ is still 1, so it stays in C. Staying still means leaving C for one edge, so C's transfer, $R \leftarrow Y$, runs. $Y$ is A5, so cycle 3 shows $R = A5$, and $z$ stays 1 because the machine is still in C.

**From cycle 5 to cycle 6.** The machine is in B with $a = 0$, so it goes to A. B's transfer loads $X$, which changed to 5A back in cycle 4, so cycle 6 shows $R = 5A$. Notice what $R$ does *not* show: in cycle 6 the machine is in A, whose transfer is $R \leftarrow 0$, but that transfer has not happened yet. The 0 appears one cycle later, in cycle 7.

That one-cycle lag is the heart of FSMD timing, and it is the part that takes practice. The value in $R$ during a cycle was decided by the state *before* it, not the state shown above it. The interactive marks this with two lines on the timing diagram: an amber line at the edge just taken, and a dashed line at the next edge, whose arc and transfer are lit on the FSMD beside it.

## Key Takeaways

- Build the datapath from the FSMD: one register per register named, a multiplexer when a register has more than one source, and a comparator for each condition that tests data. When every arc tests only inputs, there are no status signals.
- With one-hot encoding, write each next-state equation by inspection: one term per arc entering the state, the source state's flip-flop ANDed with the arc's condition.
- When a transfer is used in only one state, its control signal is simply that state's flip-flop.
- In a timing diagram, values change only at clock edges. The present state and the input before the edge pick the next state.
- The register lags the state by one cycle: the transfer of the state being left lands in the register in the next cycle.

## Review Questions

**1.** In the given FSMD, why does the datapath have no status signals?

A. The register $R$ is only 8 bits wide\
B. Every arc depends on the input $a$, not on a value in a register\
C. A one-hot controller does not need status signals\
D. The multiplexer has three inputs

**2.** Using one-hot encoding, which equation gives the next value of $Q_B$?

A. $Q_B^{+} = Q_A\,a + Q_C\,a$\
B. $Q_B^{+} = Q_B\,\overline{a}$\
C. $Q_B^{+} = Q_A\,\overline{a} + Q_C\,\overline{a}$\
D. $Q_B^{+} = Q_A + Q_C$

**3.** The machine is in state B, $a = 1$, $X = 3C$ and $Y = A5$. What are the state and $R$ in the next cycle?

A. State C, $R = A5$\
B. State C, $R = 3C$\
C. State A, $R = 3C$\
D. State C, $R = 00$

**4.** The machine is in state C with $a = 1$ and $Y = A5$. In the next cycle, what is $z$?

A. 0, because the machine just left C\
B. 1, because the machine is still in C\
C. 1, because $Y$ is nonzero\
D. It depends on $X$

**5.** In cycle 6 of the scripted run the machine is in state A, yet $R = 5A$. Why?

A. A's transfer is $R \leftarrow X$\
B. The register is wrong for one cycle after reset\
C. $R$ shows the transfer of the state the machine just left, B, whose transfer loads $X = 5A$\
D. A's transfer $R \leftarrow 0$ is ignored when $a = 1$

**6.** Which signals in this controller need no logic gates at all?

A. Only $z$\
B. $\text{selX}$, $\text{selY}$ and $z$, which are each a single state flip-flop\
C. $Q_A^{+}$, $Q_B^{+}$ and $Q_C^{+}$\
D. None; every signal needs at least one gate

## Answer Explanations

**1. B.** Comparators, and the status signals they produce, come from conditions that test data in a register. Every arc in this FSMD tests the input $a$, which goes straight to the controller, so the datapath has nothing to report.

**2. C.** Two arcs enter B: from A on $\overline{a}$ and from C on $\overline{a}$. One term per arc gives $Q_A\,\overline{a} + Q_C\,\overline{a}$. Choice A lists the arcs into C, and choice B is the equation for $Q_A$ with the wrong source.

**3. B.** From B, $a = 1$ leads to C. On that edge the machine performs the transfer of the state it is leaving, B's $R \leftarrow X$, so $R$ becomes 3C in the next cycle.

**4. B.** With $a = 1$, C goes back to C. $z$ is a Moore output that is 1 whenever the machine is in C, so it stays 1. ($R$ becomes A5 because C's transfer loads $Y$, but that does not affect $z$.)

**5. C.** The register lags the state by one cycle. The edge into cycle 6 left state B, so B's transfer, $R \leftarrow X$, ran on that edge, and $X$ was 5A. A's own transfer, $R \leftarrow 0$, shows up one cycle later, in cycle 7.

**6. B.** Each control signal is 1 in exactly one state, so $\text{selX} = Q_B$, $\text{selY} = Q_C$ and $z = Q_C$ are plain wires from the flip-flops. The next-state signals are the ones that need AND and OR gates.
