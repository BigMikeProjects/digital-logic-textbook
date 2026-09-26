# Decoders

A **decoder** turns a binary code into a **one-hot** line. Put an $n$-bit code on its inputs and the
decoder asserts exactly one of its $2^n$ outputs — the one whose number matches the code. Nothing is
computed and nothing is stored; the code names an output, and that output goes high.

It helps to borrow the name the hardware world uses for those inputs: **address lines**. That is not
just a label. Decoders earn their keep in memory systems, where the high bits of an address pick
which chip or which row is being spoken to, and thinking of the inputs as an address makes the whole
block obvious — you are naming a destination.

We will work through the decoder using the section's **four-beat cadence** — functionality,
hardware, applications, and Verilog — with a **2-to-4 decoder with enable** as the running example.

## Beat 1: Functionality

A 2-to-4 decoder has two address inputs $A_1$ and $A_0$, four outputs $Y_0$ through $Y_3$, and one
**enable** input $EN$. The behavior is a single sentence: **the code on the address lines names the
output that is asserted.**

| $EN$ | $A_1$ | $A_0$ | $Y_3$ | $Y_2$ | $Y_1$ | $Y_0$ |
|:----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| 0    | ×     | ×     | 0     | 0     | 0     | 0     |
| 1    | 0     | 0     | 0     | 0     | 0     | 1     |
| 1    | 0     | 1     | 0     | 0     | 1     | 0     |
| 1    | 1     | 0     | 0     | 1     | 0     | 0     |
| 1    | 1     | 1     | 1     | 0     | 0     | 0     |

Read the first row carefully, because it is doing something the other four are not. **The enable
dominates.** When $EN = 0$ every output is 0 no matter what the address lines are doing, so there is
no point listing four separate rows for it — the $\times$ entries are **don't-cares**, and they are
a compact way of saying "the address was not consulted." This is a common and worthwhile convention
in truth tables: when one input overrides the rest, give it one row and mark the others $\times$.

The remaining four rows are the decoder proper. Code 00 asserts $Y_0$, code 01 asserts $Y_1$, code
10 asserts $Y_2$, code 11 asserts $Y_3$ — and in every case the other three outputs are 0. That
"exactly one" property has a name: the output is **one-hot**.

The 2-to-4 decoder is the smallest useful member of a family. Because $n$ address lines can name
$2^n$ different things, the output count grows as a power of two:

| Decoder | Address lines | Outputs |
|---------|:-------------:|:-------:|
| 2-to-4  | 2             | 4       |
| 3-to-8  | 3             | 8       |
| 4-to-16 | 4             | 16      |
| $n$-to-$2^n$ | $n$      | $2^n$   |

### A decoder is a minterm generator

Here is the idea worth carrying out of this topic. Look again at the $EN = 1$ rows and ask what each
output actually *is* as a Boolean expression:

$$Y_0 = \bar{A_1}\,\bar{A_0} \qquad Y_1 = \bar{A_1}\,A_0 \qquad Y_2 = A_1\,\bar{A_0} \qquad Y_3 = A_1\,A_0$$

Those are the four **minterms** of two variables. Output $Y_i$ is minterm $m_i$ — it is 1 on exactly
one row of the truth table and 0 everywhere else, which is the definition of a minterm. So a decoder
does not merely select a line: **it generates every minterm of its inputs, all at once, on separate
wires.** We will use that in Beat 3 to build any Boolean function we like.

## Beat 2: Building One from Gates

The construction follows directly from those four expressions. Each output needs its own minterm, so
each output gets **its own AND gate**, and the enable is wired into **every one of them**:

$$Y_0 = EN \cdot \bar{A_1} \cdot \bar{A_0} \qquad Y_1 = EN \cdot \bar{A_1} \cdot A_0$$
$$Y_2 = EN \cdot A_1 \cdot \bar{A_0} \qquad Y_3 = EN \cdot A_1 \cdot A_0$$

That single shared $EN$ term is what makes the first row of the truth table true. With $EN = 0$,
every AND gate has a 0 on one of its inputs, so all four outputs are forced to 0 at once — one wire
shuts down the whole block.

Each AND gate needs its address bits in a particular polarity: $Y_0$ wants both bits complemented,
$Y_3$ wants both true, and the middle two want one of each. Rather than putting an inverter in front
of each gate, the usual construction runs **true and complement rails** across the circuit — four
signals, $A_1$, $\bar{A_1}$, $A_0$ and $\bar{A_0}$, produced by just two inverters and made
available to every gate.

![A gate-level 2-to-4 decoder with enable. On the left, inputs A1, A0 and EN enter; two inverters
produce A1-bar and A0-bar, giving five named signals. On the right, four AND gates each take three
named inputs and drive one output: Y0 from A1-bar, A0-bar and EN; Y1 from A1-bar, A0 and EN; Y2 from
A1, A0-bar and EN; Y3 from A1, A0 and EN. Each output is labeled with the minterm it
forms.](./images/decoder-2to4-gates.svg)

Reading the circuit is then a matter of reading each gate's inputs: a gate fed by $\bar{A_1}$,
$\bar{A_0}$ and $EN$ is $Y_0$, and the enable appears on all four. The figure names each gate's
inputs rather than drawing a wire from every rail to every gate — with four gates drawing on five
signals, the traced version becomes a thicket of crossings that hides the very pattern you are
trying to see.

The cost scales the way the family table suggests. An $n$-to-$2^n$ decoder needs $2^n$ AND gates of
$n+1$ inputs each, plus $n$ inverters for the complement rails.

## Beat 3: Applications

**Memory and device selection.** This is the canonical job and the source of the "address lines"
name. Feed the high bits of an address into a decoder and each output becomes a **chip enable** for
one device or one bank of memory. Exactly one responds, because the output is one-hot — which is
precisely what a shared bus requires.

**Instruction decoding.** The front end of a processor takes an opcode and must light up the control
lines for that one instruction. That is a decoder, scaled up, and it is where the block's name comes
from. The details belong to a later course.

**A decoder with an enable is a demultiplexer.** A multiplexer takes several inputs and passes one
to a single output. Run that backwards — one input, several outputs, a code choosing which — and you
have a **demultiplexer**. You do not need a new part for it. Instead of holding the enable at 1,
**drive your data onto the enable pin**: the address lines then decide which output that data
appears on, and every other output stays at 0. Since $Y_i = EN \cdot m_i$ and exactly one minterm is
1, the selected output is $EN$ itself and the rest are 0. Same silicon, read a different way.

**Any Boolean function at all.** This is the payoff of the minterm framing. A decoder hands you
every minterm of its inputs on separate wires, so to build a function you simply **OR together the
minterms your truth table marks with a 1**. Want $F = \sum m(0, 2, 3)$ of two variables? Take a
2-to-4 decoder and OR $Y_0$, $Y_2$ and $Y_3$. No algebra, no minimization — you are picking outputs
off a part that already computed all of them. It is not the cheapest way to build a small function,
but it is a genuinely general one, and it explains why decoders show up inside so many larger
blocks.

## Beat 4: Decoders in Verilog

A decoder is naturally described with a **`case` statement**, because a case is exactly "look at
this code and pick the matching branch":

```verilog
module dec2to4 (input [1:0] a, input en, output reg [3:0] y);
  always @* begin
    y = 4'b0000;                 // default first, or synthesis infers a latch
    if (en) case (a)
      2'b00: y = 4'b0001;
      2'b01: y = 4'b0010;
      2'b10: y = 4'b0100;
      2'b11: y = 4'b1000;
    endcase
  end
endmodule
```

Three details in that module are worth more than the `case` itself.

**The output is declared `reg`.** Not because it stores anything — it does not — but because in
Verilog anything assigned inside an `always` block must be declared `reg`. Assign it with a
continuous `assign` instead and it would be a `wire`. This trips people up constantly; the keyword
describes *how it is assigned*, not whether it remembers.

**`always @*` means "whenever anything read in here changes."** The star builds the sensitivity list
automatically from the signals the block reads — here `en` and `a`. Listing them by hand is legal and
was once required, but forgetting one produces hardware that does not match the simulation. Let the
star do it.

**The default assignment comes first, and it is the important line.** `y = 4'b0000;` runs before the
`if`, so every path through the block assigns `y`. Delete it and the `en = 0` case assigns nothing —
and in Verilog, a combinational block that does not assign an output on some path means that output
must **hold its previous value**. Holding a value requires memory, so synthesis quietly infers a
**latch**. You asked for combinational logic and received something that remembers, which is a
classic source of glitches and timing problems that are miserable to debug. **Assign a default
before every conditional** is the habit that prevents it.

Simulating the module over all eight input combinations gives exactly the truth table from Beat 1:

```
en a    y
 0 00  0000
 0 01  0000
 0 10  0000
 0 11  0000
 1 00  0001
 1 01  0010
 1 10  0100
 1 11  1000
```

## Key Takeaways

A **decoder** converts an $n$-bit binary code into a **one-hot** output: exactly one of its $2^n$
outputs is asserted, the one named by the code. Its inputs are usefully thought of as **address
lines**, which is where the block earns its keep — selecting a memory chip, a device, or an
instruction's control lines. An **enable** input **dominates** the address: with $EN = 0$ every
output is 0, which a truth table records as a single row with $\times$ in the address columns. The
gate-level construction is **one AND gate per output**, each tapping **true and complement rails**
for the polarity its minterm needs, with the enable wired into all of them so one wire can shut the
block down. The framing to remember is that **a decoder is a minterm generator**: $Y_i$ is minterm
$m_i$, so the part hands you every minterm of its inputs at once. Two consequences follow — driving
data onto the enable pin turns the decoder into a **demultiplexer**, and **OR-ing the outputs your
truth table marks with a 1 builds any Boolean function** without algebra. In Verilog a decoder is a
`case` inside `always @*`, with the output declared `reg` and a **default assignment before the
conditional** so that synthesis does not infer a latch.

## Review Questions

**1. What does a decoder produce at its outputs?**

A. A binary code identifying which input is active\
B. A one-hot output, with exactly one line asserted\
C. The sum of its inputs\
D. The same number of outputs as inputs

**2. A decoder has five address lines. How many outputs does it have?**

A. 10\
B. 16\
C. 25\
D. 32

**3. In the truth table for a decoder with an enable, why do the address columns show × on the row where $EN = 0$?**

A. The address lines are disconnected in that state\
B. The enable dominates — with $EN = 0$ the outputs are 0 regardless of the address\
C. That row is an error condition\
D. The address value is unknown until the circuit settles

**4. Why is output $Y_i$ of a decoder described as a minterm?**

A. Because it is the smallest output of the group\
B. Because it uses the fewest gates\
C. Because it is 1 on exactly one row of the truth table and 0 on all the others\
D. Because it is always the complement of $Y_0$

**5. How do you use a decoder as a demultiplexer?**

A. Reverse the direction of the address lines\
B. Drive the data onto the enable pin and let the address select which output it reaches\
C. Tie all the outputs together\
D. Remove the enable input entirely

**6. What goes wrong if the `y = 4'b0000;` default is deleted from the Verilog module?**

A. The module will not compile\
B. The outputs become one-hot in the wrong order\
C. Some path assigns nothing, so synthesis infers a latch and the logic is no longer purely combinational\
D. The enable input stops working

## Answer Explanations

**1. B.** The defining behavior is one-hot: the code names exactly one output and that output is
asserted while the rest stay at 0. Producing a code *from* an active line is the reverse operation —
that is an encoder. A decoder deliberately has more outputs than inputs.

**2. D.** Each additional address line doubles the number of things that can be named, so $n$ lines
give $2^n$ outputs; $2^5 = 32$. Option B is $2^4$ and option C is $5^2$, both easy slips if you
reach for the wrong operation.

**3. B.** The $\times$ marks are don't-cares, and they record that the address was never consulted:
with the enable low, all four AND gates are forced to 0 whatever the rails carry. Writing one row
with $\times$ replaces four identical rows. The address lines are still physically connected and
their values are perfectly well defined — they simply do not matter.

**4. C.** A minterm is a product term that is true on exactly one row of the truth table. Each
decoder output is the AND of the address bits in one specific polarity, so it is 1 for exactly one
code — $Y_0 = \bar{A_1}\bar{A_0}$, $Y_3 = A_1 A_0$, and so on. That is what makes a decoder a
minterm generator, and it is why you can build any function by OR-ing the outputs you need.

**5. B.** Since $Y_i = EN \cdot m_i$, and exactly one minterm is 1 for any given address, the
selected output carries whatever is on $EN$ while the others sit at 0. Put your data on the enable
and the address becomes a routing control — one input steered to one of several outputs, which is
precisely a demultiplexer. No rewiring of the part is involved.

**6. C.** With the default gone, the `en = 0` path through the `always` block assigns nothing to
`y`. Verilog's rule is that an output not assigned on some path must retain its previous value, and
retaining a value requires storage — so synthesis infers a latch. The module still compiles and
still simulates, which is what makes the bug dangerous; the damage shows up as glitches and timing
problems in real hardware. Assigning a default before every conditional avoids it entirely.
