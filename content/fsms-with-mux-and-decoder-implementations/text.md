Every finite state machine so far has had the same three parts: a **state memory** made of flip-flops, **next-state logic** that drives the D inputs of those flip-flops, and **output logic**. In every design so far, the two blocks of logic were built from individual gates, found by drawing a K-map for each flip-flop input and each output and circling the 1s.

Gates are one way to build that logic, but they are not the only way. The next-state logic is combinational logic, and the combinational chapter ended with a set of ready-made building blocks, among them the multiplexer and the decoder. This topic takes one machine that has already been designed with gates and builds its next-state logic twice more, once with multiplexers and once with a decoder. Neither version needs a K-map. Both are wired straight from the state table.

## The Machine and Its Gate Circuit

The example is the level-to-pulse converter from Level-to-Pulse FSM. It has one input, L, and one Moore output, P. Each time L goes high, P goes high for exactly one clock period, no matter how long L stays high. It has three states, coded on two flip-flops $Q_1 Q_0$:

$$\text{LOW} = 00 \qquad \text{PULSE} = 01 \qquad \text{HIGH} = 10$$

The code 11 is unused. Everything about the machine's behavior is in its state table. The last column numbers the rows, reading $Q_1 Q_0 L$ as a three-bit binary number.

| $Q_1$ | $Q_0$ | State | $L$ | $Q_1^+$ | $Q_0^+$ | $P$ | Row |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | LOW | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | LOW | 1 | 0 | 1 | 0 | 1 |
| 0 | 1 | PULSE | 0 | 0 | 0 | 1 | 2 |
| 0 | 1 | PULSE | 1 | 1 | 0 | 1 | 3 |
| 1 | 0 | HIGH | 0 | 0 | 0 | 0 | 4 |
| 1 | 0 | HIGH | 1 | 1 | 0 | 0 | 5 |
| 1 | 1 | unused | × | d | d | d | 6, 7 |

With D flip-flops, the next state is whatever is on the D inputs, so the $Q_1^+$ column is $D_1$ and the $Q_0^+$ column is $D_0$. The earlier design put each column on a K-map and arrived at

$$D_1 = L\,(Q_1 + Q_0) \qquad D_0 = L\,\bar{Q}_1 \bar{Q}_0 \qquad P = \bar{Q}_1 Q_0$$

That is one OR gate and three AND gates, with the complements taken from the flip-flops' $\bar{Q}$ pins. It is a small circuit, but getting there took two K-maps and a decision about the don't-cares, and the result fits this one machine only. Change one arc of the state diagram and the K-maps have to be redrawn.

The two circuits that follow have a fixed structure instead. The parts stay where they are, and the state table decides only what is connected to them. A different state diagram would change a few connections and nothing else.

## A Multiplexer on Each Flip-Flop Input

A 4:1 multiplexer has four data inputs and two select lines, and it passes the data input named by the select code to its output. The mux version of the machine uses one 4:1 multiplexer for each flip-flop. The output of each mux goes to that flip-flop's D input, and the select lines of both muxes are tied to the present state, $Q_1 Q_0$.

Tying the select lines to the state is a choice, and other choices would work, but this one is convenient: **the present state picks the data input.** When the machine is in LOW, both muxes pass their data input 00. In PULSE they pass input 01, and in HIGH, input 10. So the question "what goes on data input 01 of the $D_1$ mux?" is the same question as "what must $D_1$ be when the machine is in PULSE?", and the state table answers it.

Take the table one present state at a time. Each state owns two rows, one for $L = 0$ and one for $L = 1$, and within those two rows a next-state column can only do one of four things: be 0 in both rows, be 1 in both rows, match L, or be the opposite of L. The data input is therefore always 0, 1, $L$ or $\bar{L}$.

Start with LOW. Its two rows show $Q_1^+$ as 0 and 0, so data input 00 of the $D_1$ mux is tied to 0. In the same two rows $Q_0^+$ is 0 when L is 0 and 1 when L is 1, which is L itself, so data input 00 of the $D_0$ mux is wired to L.

PULSE works the same way. In its two rows $Q_1^+$ is 0 then 1, which follows L, and $Q_0^+$ is 0 both times. HIGH turns out identical: $Q_1^+$ follows L and $Q_0^+$ is 0. This small machine does not have much variety, and only 0 and L ever appear, but a machine with more going on would use 1 and $\bar{L}$ as well.

| Select $Q_1 Q_0$ | State | $D_1$ mux data input | $D_0$ mux data input |
|:-:|:-:|:-:|:-:|
| 00 | LOW | 0 | $L$ |
| 01 | PULSE | $L$ | 0 |
| 10 | HIGH | $L$ | 0 |
| 11 | unused | $L$ | 0 |

The last row is the unused state. Its table entries are don't-cares, so those two data inputs can be tied to anything. Here they are tied to $L$ and 0, which makes the mux circuit behave exactly like the gate circuit even in state 11: the K-map for $D_1$ circled its don't-care as a 1 when L is 1, and $L$ on this input does the same thing. Tying both to 0 would be just as legal.

That finishes the next-state logic, and no K-map was drawn. Each column of the state table was cut into four pieces by present state, and each piece became one data input.

The output logic is left alone in this circuit. P is still the single AND gate $\bar{Q}_1 Q_0$, because one gate is simpler than a multiplexer. A machine with more complicated outputs could use a mux for each output in the same way.

The size of the multiplexer follows the number of states, not the number of gates the logic would have needed. Two flip-flops mean two select lines and a 4:1 mux. A machine with eight states has three flip-flops, so it would use an 8:1 mux on each one.

## A Decoder That Makes Every Row

A decoder takes a binary code on its address lines and turns on exactly one output, the one that code names. The Decoders topic described each output as a **minterm** of the address inputs: output $Y_k$ is 1 for input combination $k$ and 0 for every other.

The decoder version uses one 3-to-8 decoder whose address lines are $Q_1$, $Q_0$ and $L$, in that order, with its enable tied high. Those are exactly the three columns on the left of the state table, so each decoder output is one row of the table. $Y_3$, for example, is high when $Q_1 Q_0 L = 011$, which is row 3: the machine is in PULSE and L is 1. At any moment exactly one of the eight lines is high, and it is the row the machine is in.

With every row available as a signal, each D input is found by reading down its column and listing the rows where it is 1.

- $Q_0^+$ is 1 in row 1 only. So $D_0$ is 1 exactly when $Y_1$ is high, and $D_0$ is simply a wire from $Y_1$.
- $Q_1^+$ is 1 in rows 3 and 5. So $D_1$ must be 1 when either $Y_3$ or $Y_5$ is high, which is an OR gate.

$$D_0 = \sum m(1) = Y_1 \qquad D_1 = \sum m(3, 5) = Y_3 + Y_5$$

This is the canonical sum of minterms, built directly. The decoder supplies every minterm, and each flip-flop input ORs together the ones on its list. A list with a single minterm, like the one for $D_0$, needs no gate at all.

Rows 0, 2 and 4 are on neither list. They are the three rows where L is 0, and all of them send the machine to LOW, which is 00. A next state of 00 needs no D input to be 1, so those lines drive nothing in the next-state logic. Lines $Y_6$ and $Y_7$ belong to the unused state and are left unconnected.

The output can be built the same way. P is 1 in rows 2 and 3, the two PULSE rows, so

$$P = \sum m(2, 3) = Y_2 + Y_3$$

A Moore output is 1 in every row of its state regardless of the input, which is why both PULSE rows appear. The AND gate $\bar{Q}_1 Q_0$ from the flip-flop pins would work equally well here. Taking P from the decoder means all three signals come from the same part.

The whole circuit is one decoder and two OR gates. A decoder-based machine always has this shape: a decoder on the state bits and inputs that produces every row of the state table, and one OR gate per flip-flop input or output that collects the rows on its list.

## Checking That the Three Circuits Agree

All three circuits were built from the same table, so they should behave the same way. Here are the mux and decoder versions in Verilog. In the first, a `case` statement on the state is the multiplexer: the present state selects what goes to each D input. In the second, a shift builds the eight decoder lines, and the D inputs are ORs of those lines.

```verilog
module level_to_pulse_mux (
    input  wire clk,
    input  wire reset,
    input  wire L,
    output wire P
);
    reg Q1, Q0;                       // state register: LOW = 00, PULSE = 01, HIGH = 10
    reg D1, D0;

    always @(*)
        case ({Q1, Q0})               // select lines = present state
            2'b00: begin D1 = 1'b0; D0 = L;    end   // LOW
            2'b01: begin D1 = L;    D0 = 1'b0; end   // PULSE
            2'b10: begin D1 = L;    D0 = 1'b0; end   // HIGH
            2'b11: begin D1 = L;    D0 = 1'b0; end   // unused
        endcase

    always @(posedge clk)
        if (reset) {Q1, Q0} <= 2'b00;
        else       {Q1, Q0} <= {D1, D0};

    assign P = ~Q1 & Q0;              // Moore output: high only in PULSE
endmodule

module level_to_pulse_dec (
    input  wire clk,
    input  wire reset,
    input  wire L,
    output wire P
);
    reg Q1, Q0;
    wire [7:0] Y = 8'b1 << {Q1, Q0, L};   // 3-to-8 decoder: Y[k] = minterm k of Q1 Q0 L

    wire D0 = Y[1];
    wire D1 = Y[3] | Y[5];

    always @(posedge clk)
        if (reset) {Q1, Q0} <= 2'b00;
        else       {Q1, Q0} <= {D1, D0};

    assign P = Y[2] | Y[3];
endmodule
```

A testbench runs these two beside the original gate version and applies the same twelve values of L to all three: L rises and stays high for four clocks, falls, then rises again for two clocks. Simulated with Icarus Verilog, it prints the following. Each line shows the input, and each circuit's state and output, during that clock period.

```
clock  0: L=0  gates=00 P=0  mux=00 P=0  decoder=00 P=0
clock  1: L=0  gates=00 P=0  mux=00 P=0  decoder=00 P=0
clock  2: L=1  gates=00 P=0  mux=00 P=0  decoder=00 P=0
clock  3: L=1  gates=01 P=1  mux=01 P=1  decoder=01 P=1
clock  4: L=1  gates=10 P=0  mux=10 P=0  decoder=10 P=0
clock  5: L=1  gates=10 P=0  mux=10 P=0  decoder=10 P=0
clock  6: L=0  gates=10 P=0  mux=10 P=0  decoder=10 P=0
clock  7: L=0  gates=00 P=0  mux=00 P=0  decoder=00 P=0
clock  8: L=1  gates=00 P=0  mux=00 P=0  decoder=00 P=0
clock  9: L=1  gates=01 P=1  mux=01 P=1  decoder=01 P=1
clock 10: L=0  gates=10 P=0  mux=10 P=0  decoder=10 P=0
clock 11: L=0  gates=00 P=0  mux=00 P=0  decoder=00 P=0
```

The three circuits are in the same state on every clock, and each produces one pulse, one clock wide, for each of the two rising edges of L. That is not surprising, since one table produced all three, but it is satisfying to watch.

There is one place where they are allowed to differ, and they do. The table says nothing about the unused state 11, so each circuit does there whatever its wiring happens to do. Forcing all three into 11 in the same simulation gives

```
from 11, L=0: P gates=0 mux=0 decoder=0 -> gates=00  mux=00  decoder=00
from 11, L=1: P gates=0 mux=0 decoder=0 -> gates=10  mux=10  decoder=00
```

With L at 1, the gate and mux circuits go to HIGH, because both treat the $D_1$ don't-care as a 1. The decoder circuit goes to LOW, because lines $Y_6$ and $Y_7$ are not connected to anything, so both D inputs are 0. Every circuit is back in a legal state after one clock, and none produces a pulse on the way, so all three are safe if the flip-flops power up in 11. The difference is a reminder of what a don't-care is: minimization puts it to use, and wiring the table directly just leaves it out.

## Comparing the Three

| Version | Hardware | How the logic is found |
|---|---|---|
| Gates | 1 OR gate, 3 AND gates | A K-map for each D input and output |
| Multiplexers | Two 4:1 muxes, 1 AND gate for P | Split each next-state column by present state |
| Decoder | One 3-to-8 decoder, 2 OR gates | List the rows where each column is 1 |

The gate version uses the least hardware. The other two use more, since a multiplexer or a decoder contains a good many gates of its own, and in exchange they ask for less design work and are easier to change. In the mux version, changing where one state goes means moving one or two data-input connections. In the decoder version, it means adding or removing a line from an OR gate.

The larger point is about how to think of a state machine. Next-state logic is a block with a job: take the present state and the inputs, and produce the next state. Gates, multiplexers and decoders are three ways to fill that block, and a designer who sees the block first can choose whichever suits the machine at hand.

## Key Takeaways

The next-state logic and output logic of a finite state machine are combinational logic described by the state table, and they can be built from combinational building blocks as well as from gates. In the multiplexer version, each flip-flop's D input is driven by a mux whose select lines are the present state, and each data input is read from that state's rows of the table as 0, 1, $L$ or $\bar{L}$. For the level-to-pulse converter the $D_1$ mux gets 0, $L$, $L$, $L$ and the $D_0$ mux gets $L$, 0, 0, 0. In the decoder version, a decoder on the state bits and the input produces one line for each row of the table, and each D input is the OR of the rows where it must be 1: $D_0 = Y_1$ and $D_1 = Y_3 + Y_5$, with $P = Y_2 + Y_3$. Neither version needs a K-map. All three circuits behave identically in every defined state and may differ only in the unused state, where the table has don't-cares. The gate circuit is the smallest, and the structured circuits trade extra hardware for a fixed layout that is quick to design and easy to rewire for a different state diagram.

## Review Questions

**1. In the multiplexer version, what is connected to the select lines of both multiplexers?**

A. The input L and the clock\
B. The present state, $Q_1 Q_0$\
C. The next state, $D_1 D_0$\
D. The output P and the input L

**2. In the HIGH state (10), $Q_1^+$ is 0 when $L = 0$ and 1 when $L = 1$. What goes on data input 10 of the $D_1$ multiplexer?**

A. 0\
B. 1\
C. $L$\
D. $\bar{L}$

**3. The 3-to-8 decoder has address lines $Q_1 Q_0 L$. When is output $Y_5$ high?**

A. Whenever the machine is in HIGH\
B. When the machine is in HIGH and L is 1\
C. When the machine is in PULSE and L is 1\
D. When exactly five clock periods have passed

**4. Why is $D_0$ a plain wire from $Y_1$ with no OR gate?**

A. $Q_0^+$ is 1 in only one row of the state table\
B. $Q_0$ is the least significant state bit\
C. The decoder's enable input is tied high\
D. $D_0$ uses the don't-cares from the unused state

**5. A machine with eight states is built the multiplexer way, with the select lines tied to the state. What size multiplexer does each flip-flop need?**

A. 2:1\
B. 4:1\
C. 8:1\
D. 16:1

**6. All three circuits start in the unused state 11 with $L = 1$. After one clock the gate and mux circuits are in HIGH and the decoder circuit is in LOW. What does this show?**

A. The decoder circuit has a wiring error\
B. The three circuits implement different state tables\
C. The decoder circuit cannot recover from the unused state\
D. The circuits handle the don't-cares differently, which the table allows

## Answer Explanations

**1. B.** The select lines carry the present state, so the state chooses which data input reaches each D input. That is what lets each data input be read from one state's rows of the table. The input L (A, D) appears on the data inputs, not the select lines, and the next state (C) is what the muxes produce, not what controls them.

**2. C.** Within the two HIGH rows, $Q_1^+$ is 0 when L is 0 and 1 when L is 1, so it equals L, and the data input is wired to L. A constant 0 (A) or 1 (B) would be right only if the column held the same value in both rows, and $\bar{L}$ (D) would be right if the column were 1 then 0.

**3. B.** Line 5 is the input combination $Q_1 Q_0 L = 101$: state 10, which is HIGH, with L at 1. Answer A is too broad, because HIGH with $L = 0$ is row 4 and turns on $Y_4$ instead. PULSE with $L = 1$ (C) is row 3.

**4. A.** Each D input is the OR of the rows where its next-state column is 1. The $Q_0^+$ column has a single 1, in row 1, so the list has one minterm and there is nothing to OR it with. $D_1$ has two rows on its list, 3 and 5, which is why it needs the gate.

**5. C.** Eight states need three flip-flops, so there are three state bits on the select lines, and three select lines choose among eight data inputs. The mux size follows the number of states. A 4:1 mux (B) is the right size for up to four states, as in the level-to-pulse converter.

**6. D.** The state table has don't-cares for state 11, so any behavior there meets the specification. The gate circuit used the $D_1$ don't-care as a 1, the mux circuit was wired to match it, and the decoder circuit leaves lines $Y_6$ and $Y_7$ unconnected, which sends it to LOW. All three implement the same table (B) and all three reach a legal state in one clock (C).
