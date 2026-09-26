# Encoders

An **encoder** is the decoder run backwards. A decoder takes a binary code and asserts one of many
output lines; an encoder takes one asserted input line and produces **the binary code that names
it**. Four inputs collapse to two output bits, eight to three, sixteen to four — in general $2^n$
inputs give $n$ outputs.

That inverse relationship is the easiest way to hold the two blocks in mind, and it is literal: feed
a code into a decoder and the decoder's one-hot output straight into an encoder, and the original
code comes back out. The pair undoes itself.

We will work through the encoder using the section's **four-beat cadence** — functionality,
hardware, applications, and Verilog — with a **4-to-2 encoder** as the running example. Along the
way we will run into a genuine design problem, and solving it is what produces the **priority
encoder** that you will actually use in practice.

## Beat 1: Functionality

A 4-to-2 encoder has four input lines $I_3$ through $I_0$ and two output bits $A_1 A_0$. Assert
$I_3$ alone and the output is 11; assert $I_1$ alone and the output is 01. The code is just the
input's index written in binary.

| $I_3$ | $I_2$ | $I_1$ | $I_0$ | $A_1$ | $A_0$ | $V$ |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:---:|
| 0     | 0     | 0     | 1     | 0     | 0     | 1   |
| 0     | 0     | 1     | 0     | 0     | 1     | 1   |
| 0     | 1     | 0     | 0     | 1     | 0     | 1   |
| 1     | 0     | 0     | 0     | 1     | 1     | 1   |
| 0     | 0     | 0     | 0     | ×     | ×     | 0   |

### Why there is a third output

That last row is the reason for the $V$ column, and it is worth slowing down for. Suppose the output
reads 00. Two completely different situations produce it: **$I_0$ is asserted**, or **nothing is
asserted at all**. The code alone cannot tell them apart, because 00 is a perfectly good answer for
$I_0$ and it is also what an idle encoder naturally sits at.

So a real encoder carries a third output, **$V$ for valid**. $V = 1$ means "some input is asserted,
and the code is meaningful"; $V = 0$ means "nothing is asserted, ignore the code entirely." With $V$
in hand the ambiguity disappears — and on the $V = 0$ row the code outputs are marked $\times$,
because nobody should be reading them.

### The problem with asserting two inputs

Now the design problem. What happens if **two** inputs go high at once?

The honest answer is that a plain encoder has no defined behavior for it — and what it actually does
is worse than merely undefined. Take $I_2$ and $I_1$ asserted together. As we will see in Beat 2,
$A_1$ is the OR of $I_3$ and $I_2$, and $A_0$ is the OR of $I_3$ and $I_1$. With $I_2$ and $I_1$
both high, $A_1 = 1$ and $A_0 = 1$, so the encoder reports:

$$A_1 A_0 = 11 = 3$$

**It reports line 3 — an input that is not even asserted.** This is not a rounding error or an
ambiguity to be tolerated; it is a confident wrong answer about a line nobody touched. A plain
encoder is correct only when its input is genuinely **one-hot**, and nothing in the circuit enforces
that.

### Priority encoders

The fix is to **define** what should happen, rather than leaving it to whatever the gates do. The
rule is simple: **if more than one input is asserted, report the highest-numbered one.** A block
built to that rule is a **priority encoder**, and it is what almost everyone actually uses.

With $I_2$ and $I_1$ both high, a priority encoder reports 10 — line 2, the higher of the two, which
is at least an input that is genuinely on.

The strong argument for reaching for a priority encoder by default is that you give up nothing. When
exactly one input is asserted, a priority encoder behaves **identically** to a plain one. So it is
correct in the case a plain encoder handles, and it is also correct — or at least defined and
sensible — in the case a plain encoder gets wrong.

## Beat 2: Building One from Gates

### The plain encoder is three OR gates

The gate-level construction falls out of reading the truth table **column by column**. Ask, for each
output bit, which input rows require it to be 1, and OR those inputs together.

$A_1$ is 1 on the rows for $I_3$ (code 11) and $I_2$ (code 10). $A_0$ is 1 on the rows for $I_3$
(code 11) and $I_1$ (code 01). And $V$ is 1 whenever anything at all is asserted:

$$A_1 = I_3 + I_2 \qquad A_0 = I_3 + I_1 \qquad V = I_3 + I_2 + I_1 + I_0$$

That is the whole plain encoder: three OR gates. Notice that **$I_0$ appears in neither code
equation.** That is not an oversight — input 0's code is 00, so asserting $I_0$ requires no output
bit to be set. Its only job is to raise $V$, which is exactly why $V$ is needed.

This construction extends directly. For an 8-to-3 encoder, $A_2$ is the OR of inputs 4 through 7,
$A_1$ the OR of those whose index has bit 1 set, and so on — the same column-by-column reading.

### The priority encoder adds a masking stage

To build a priority encoder, we do not redesign the encoder. We put a **masking stage** in front of
the plain one, and let the plain encoder behind it do the work it is already good at.

The masking stage's job is to **kill every asserted line below the highest one**, so that whatever
reaches the plain encoder is guaranteed one-hot. Each masked line is its own input ANDed with the
complement of every higher input:

$$y_3 = I_3 \qquad y_2 = I_2 \cdot \bar{I_3} \qquad y_1 = I_1 \cdot \bar{I_3} \cdot \bar{I_2} \qquad y_0 = I_0 \cdot \bar{I_3} \cdot \bar{I_2} \cdot \bar{I_1}$$

Read one of those aloud and the rule is obvious: $y_1$ is "$I_1$ is asserted **and** neither $I_3$
nor $I_2$ outranks it." $I_3$ needs no gate at all, because nothing outranks it. At the bottom,
$y_0$ has to be masked by all three higher lines, which is why the gates grow as you go down.

![A priority encoder drawn as two stages. On the left, a masking stage: I3 passes straight through
because nothing outranks it, while I2, I1 and I0 each feed an AND gate whose other inputs are the
higher inputs, bubbled to mean NOT. The gates grow downward, from two inputs to four. Their outputs
y3 through y0 form a bus marked one-hot, guaranteed, which feeds the second stage, a plain encoder of
three OR gates producing A1 = y3 + y2, A0 = y3 + y1, and V = y3 + y2 + y1 +
y0.](./images/priority-encoder-two-stage.svg)

The bubbles carry the "not" — a bubbled $I_3$ on the $y_2$ gate reads "and $I_3$ is not on." Notice
what the picture makes obvious that the equations only imply: **the gates grow downward.** The
lowest-priority line has the most outranking it, so it needs the most masking, and $I_3$ needs no
gate at all.

The two-stage structure is the point worth remembering:

**Stage 1 masks, stage 2 encodes.** The plain encoder was never wrong about one-hot inputs — it was
just never given one. The masking stage guarantees the input it needs, and the block as a whole
becomes correct for every input pattern.

## Beat 3: Applications

**Interrupt servicing.** Several devices raise a request at the same moment and the processor can
only service one. A priority encoder reports the number of the most important pending request, and
$V$ answers the separate question of whether there is any request at all. This is the application
that priority exists for, and you will meet it properly in a microprocessors course.

**Keypad scanning.** Pressing a key closes one connection among many. An encoder turns that into a
compact code, so a keyboard sends a few code bits back to the computer instead of one wire per key.
Two keys pressed at once is not a hypothetical here — it is the multiple-input problem, happening
every day, which is why the part in a keypad is a priority encoder.

**Leading-one detection.** Given a word, find the position of its most significant 1. That is
precisely what a priority encoder computes, and it is the core of floating-point normalization and
of count-leading-zeros instructions.

**The round trip with the decoder.** Feed a binary code into a decoder and route its one-hot output
straight into an encoder of the same size, and the original code comes back out unchanged. Put in 2
and you get back 2. The decoder's entire output is the encoder's entire input, and the two operations
cancel — which is the clearest possible statement that these blocks are duals.

## Beat 4: Encoders in Verilog

The plain encoder is a direct transcription of the three equations:

```verilog
module enc4to2 (input [3:0] i, output [1:0] a, output v);
  assign a[1] = i[3] | i[2];
  assign a[0] = i[3] | i[1];
  assign v    = i[3] | i[2] | i[1] | i[0];
endmodule
```

The priority encoder is more interesting, because Verilog has a construct that expresses priority
directly — **`casez`**, in which `?` is a **don't-care** in the pattern:

```verilog
module enc4to2_pri (input [3:0] i, output reg [1:0] a, output reg v);
  always @(*) begin
    a = 2'b00; v = 1'b0;            // defaults first
    casez (i)
      4'b1???: begin a = 2'd3; v = 1'b1; end
      4'b01??: begin a = 2'd2; v = 1'b1; end
      4'b001?: begin a = 2'd1; v = 1'b1; end
      4'b0001: begin a = 2'd0; v = 1'b1; end
    endcase
  end
endmodule
```

Read the patterns and the priority rule is visible in the source. `4'b1???` means "$I_3$ is set and
**I do not care** about the rest" — which is the priority rule for the top line, written literally.
`4'b01??` means "$I_3$ is clear **and** $I_2$ is set, rest don't care." The leading zeros are
carrying the "nothing higher is asserted" condition that the masking AND gates carry in hardware.

Three things about this module deserve attention.

**`casez` is what makes `?` a don't-care.** Write the same patterns under a plain `case` and the
question marks are matched **literally**, against a value that will never contain them — so no
branch ever fires and the design silently stops working. The `z` is not decoration.

**Branch order carries the priority.** `casez` takes the *first* matching branch, so reordering
those four lines reverses the priority. Unlike an ordinary truth-table `case`, where the branches are
mutually exclusive and order is irrelevant, this code is **order-dependent by design**.

**The defaults come first.** `a = 2'b00; v = 1'b0;` runs before the `casez`, so every path assigns
both outputs. Without them, the all-zeros input matches no branch, nothing is assigned, and synthesis
infers a **latch** — the same trap as in the decoder, and the most common Verilog error in this
course.

Simulating both modules over all sixteen input patterns shows the relationship precisely:

```
 i     plain a,v   priority a,v
 0000    00 0        00 0
 0001    00 1        00 1
 0010    01 1        01 1
 0100    10 1        10 1
 0110    11 1        10 1     <- two inputs: plain reports 3, priority reports 2
 1000    11 1        11 1
 1111    11 1        11 1
```

The two agree on every one-hot input and part company the moment a second line goes high — which is
the whole argument for priority in one table.

## Key Takeaways

An **encoder** is the inverse of a decoder: assert one of $2^n$ input lines and it outputs the
$n$-bit **binary code naming that line**. Because code 00 is ambiguous — it means both "input 0" and
"nothing asserted" — a real encoder carries a **valid** output $V$, which is 1 only when some input
is asserted. A **plain encoder is correct only for one-hot input**: assert $I_2$ and $I_1$ together
and it confidently reports 3, a line that is not even on. The fix is the **priority encoder**, which
defines the multi-input case as "report the highest," and which costs nothing because it behaves
identically to a plain encoder when only one line is asserted. In hardware the plain encoder is just
**three OR gates**, obtained by reading the truth table column by column, and the priority encoder
adds a **masking stage** of AND gates in front of it so the bus it feeds is guaranteed one-hot —
**stage 1 masks, stage 2 encodes**. Applications are interrupt servicing, keypad scanning,
leading-one detection, and the **round trip with the decoder**, which returns the original code. In
Verilog the plain encoder is three `assign` statements and the priority encoder is a **`casez`**
whose `?` don't-cares and **branch order** express the priority rule directly.

## Review Questions

**1. What does an encoder output?**

A. A one-hot line selected by a binary code\
B. The binary code identifying which input line is asserted\
C. The number of inputs that are asserted\
D. The complement of its input

**2. Why does an encoder need a valid ($V$) output?**

A. To indicate that the power supply is stable\
B. Because the code 00 cannot otherwise be distinguished from no input being asserted\
C. To report that two inputs were asserted at once\
D. Because the output code is undefined for input 0

**3. On a plain 4-to-2 encoder, inputs $I_2$ and $I_1$ are asserted at the same time. What appears on the outputs?**

A. 10, the higher of the two\
B. 01, the lower of the two\
C. 11, a code for a line that is not asserted\
D. 00, with $V$ forced low

**4. What rule defines a priority encoder?**

A. It reports the lowest-numbered asserted input\
B. It reports the highest-numbered asserted input\
C. It refuses to output a code when more than one input is asserted\
D. It outputs the count of asserted inputs

**5. What is the job of the masking stage in a priority encoder?**

A. It inverts the inputs before they reach the encoder\
B. It kills every asserted line below the highest, so the plain encoder behind it sees a one-hot input\
C. It stores the previous input for comparison\
D. It generates the valid output

**6. Why must the priority encoder's Verilog use `casez` rather than `case`?**

A. `case` cannot be used inside an `always` block\
B. `casez` is faster in simulation\
C. Under `case` the `?` characters are matched literally, so no branch ever fires\
D. `case` does not allow a default assignment

## Answer Explanations

**1. B.** The encoder runs the decoder backwards: one asserted line in, the binary index of that line
out. Option A describes the decoder. Counting how many inputs are asserted is a different circuit
entirely (a population counter), and an encoder has fewer outputs than inputs, so it cannot simply
be complementing anything.

**2. B.** Code 00 is a legitimate answer — it is what $I_0$ produces — and it is also what the
outputs sit at when nothing is asserted. Without a separate signal those two situations are
indistinguishable, so $V$ is added: 1 when some input is asserted, 0 when none is. Note that the
code for input 0 is perfectly well defined; the ambiguity is between that case and the idle case.

**3. C.** Since $A_1 = I_3 + I_2$ and $A_0 = I_3 + I_1$, asserting $I_2$ and $I_1$ drives both
outputs to 1, giving 11 — the code for $I_3$, which is not asserted. That the answer names an
untouched line, rather than merely being one of the two correct candidates, is what makes the plain
encoder genuinely unsafe rather than just imprecise. Reporting 10 is what a *priority* encoder does.

**4. B.** Priority means highest-numbered wins, which turns an undefined situation into a defined
one. It never refuses to answer, and it still asserts $V$ normally. The convention could in principle
have been lowest-wins, but highest-wins is what "priority encoder" means in practice.

**5. B.** The masking stage ANDs each input with the complements of all higher inputs, so at most one
line survives to reach the second stage. That matters because the plain encoder was never wrong about
one-hot inputs — it was simply never guaranteed one. Stage 1 masks, stage 2 encodes. The valid output
is produced by OR-ing the lines, not by the mask.

**6. C.** In `casez`, `?` is a don't-care that matches either 0 or 1, which is what lets `4'b1???`
mean "$I_3$ set, rest irrelevant." A plain `case` compares patterns literally, and since the input
will never literally contain a `?` character, no branch matches, the defaults stand, and the encoder
silently outputs 00 with $V = 0$ forever. The design compiles and simulates — it just does nothing,
which is what makes the mistake dangerous.
