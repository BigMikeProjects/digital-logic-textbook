# Ripple Carry Adder

A single full adder handles one column of a binary addition. To add two four-bit numbers you need four of them, arranged the way you would do the addition by hand: add the least-significant column first, and if that column produces a carry, hand it to the column on its left. Wire four full adders together that way and you have a **ripple carry adder**.

Logically, that is the entire design. There is nothing clever in it, and that is part of why it is worth studying first. The interesting question is not whether it works — it obviously does — but **how long it takes to settle**, because the answer turns out to depend on the numbers you happen to be adding.

## One Column

Each stage adds three bits: the two data bits $A_i$ and $B_i$ for that column, and the carry arriving from the column below, $C_i$. It produces a sum bit $S_i$ and a carry-out $C_{i+1}$ that becomes the next stage's carry-in.

$$S_i = A_i \oplus B_i \oplus C_i$$

$$C_{i+1} = A_i B_i + C_i (A_i \oplus B_i)$$

That second form is the one that falls out of building the stage from two half adders. Karnaugh-map minimization of the same truth table gives $A_i B_i + A_i C_i + B_i C_i$ instead, and the two are algebraically equal — the full adder topic works through both realizations and weighs them against each other.

The truth table is the familiar one:

| $A$ | $B$ | $C_i$ | $S$ | $C_{i+1}$ |
|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

Read a row or two to confirm it behaves like addition. The row $0 + 1 + 0$ gives a sum of 1 with no carry out. The row $1 + 1 + 0$ gives two, which in one bit means a sum of 0 and a carry out of 1.

## Three Things a Stage Can Do With Its Carry-In

To reason about delay, stop looking at the gates inside a stage and look instead at how the stage's carry-out **depends** on its carry-in. There are only three possibilities, and they are set entirely by $A_i$ and $B_i$.

| $A_i\,B_i$ | what the stage does | $C_{i+1}$ | does it have to wait? |
|:---:|---|:---:|:---:|
| 0 0 | **kills** the carry | 0 | no |
| 0 1 or 1 0 | **propagates** the carry | $C_i$ | **yes** |
| 1 1 | **generates** a carry | 1 | no |

If both data bits are 0, there is no way to get a carry out. A carry-in of 0 gives $0 + 0 + 0$, and a carry-in of 1 gives $0 + 0 + 1$, which is still just 1 with nothing to carry. The stage **kills** the carry.

If both data bits are 1, the column is already at least two, so a carry comes out no matter what arrives on the carry-in. The stage **generates** its own carry.

The interesting case is when the two data bits differ. Then the column total is 1 plus whatever the carry-in is, so the carry-out *is* the carry-in. The stage **propagates**. And here is the part that costs time: a propagating stage cannot announce its carry-out until it knows its carry-in. It has to **wait**.

The other two cases do not wait. A killing or generating stage knows its carry-out from its own two data bits, before any carry arrives. This is the key to the whole timing story: **a kill or a generate breaks the chain, and the waiting starts over.**

## What the Waiting Costs

Let one **delay unit Δ** be the time a carry needs to cross a single stage that has to pass it along. Then:

- The carry-in to the whole adder is available immediately, at $t = 0$.
- A propagating stage produces its carry-out one Δ after its carry-in arrives.
- A killing or generating stage produces its carry-out immediately, at $t = 0$.
- A stage's sum bit settles one step after its own carry-in settles.

Everything about the adder's speed follows from those four lines. In particular, **the worst case is every stage propagating**, which for an $n$-bit adder takes $n\Delta$.

That is worth pausing on, because it is not the answer most people guess. The slowest addition is not the one with the biggest carry travelling the furthest. It is the one where every stage merely *passes a carry along* — whether or not a carry ever actually appears.

### Three worked cases

**9 + 8 settles in 2Δ.** In binary that is $1001 + 1000$. Bit 0 has $A_0 B_0 = 1\,0$, so it propagates, and its sum bit has to wait one Δ for the carry-in. But bits 1 and 2 both have $0\,0$ — they *kill*. Since neither can ever produce a carry out, those columns can be computed straight away without waiting for anything to arrive from below. Bit 3 has $1\,1$ and generates. The longest anything waits is two Δ.

**5 + 3 settles in 3Δ.** Here $0101 + 0011$ starts with $1\,1$ at bit 0, which generates — and a generate costs nothing, because the stage does not need its carry-in. Bits 1 and 2 propagate, so each adds a Δ. Bit 3 is $0\,0$ and kills, which means the adder's final carry-out is known at $t = 0$, before the middle of the chain has settled. The last thing to resolve is the sum bit at bit 3, three Δ in.

**5 + 10 settles in 4Δ — the worst case.** In $0101 + 1010$ every column has one 1 and one 0, so all four stages propagate. Each must wait for the one below it, and the carry crawls from bit 0 to the top one stage at a time. What makes this case instructive is that **every carry in the finished addition is 0**. No carry ever appears anywhere, and the adder still takes the full four Δ. The delay was never about whether a carry happened; it was about which stages had to wait to find out.

Over all 512 possible combinations of $A$, $B$ and $C_{in}$ for a four-bit adder, the longest settle time is 4Δ, and 64 of those combinations hit it.

### How this scales

| width $n$ | worst-case settle |
|:-:|:-:|
| 4 | 4Δ |
| 8 | 8Δ |
| 32 | 32Δ |
| 64 | 64Δ |

The appealing thing about a ripple carry adder is how little hardware it costs: one full adder per bit, so the gate count grows **linearly** with width. The problem is that the worst-case delay grows linearly too. A 64-bit ripple adder needs 64Δ to settle, and for a processor adding numbers every clock cycle that is slow.

What is Δ actually worth? It is one stage's carry delay, so it depends on which full adder you built. The full adder topic measures the flat two-level realization at a delay of about 3 and the two-half-adder version at about 6, which puts 4Δ somewhere in the range of 12 to 24 gate transitions. The scaling law is the same either way, which is why it is written in Δ rather than in gates.

The logic never gets harder as $n$ grows — only the time does. That is precisely the problem the carry-look-ahead adder is built to solve, by computing the carries in parallel instead of passing them along. Notice that it can do this because "generate" and "propagate" are properties of $A_i$ and $B_i$ alone: they are known immediately, without waiting for any carry at all.

## Building It in Verilog

Because the design is literally four copies of one block, the natural Verilog is **structural**: declare the wires that carry the internal carries, then instantiate the stages and connect them.

```verilog
module full_adder (input a, b, cin, output sum, cout);
    assign sum  = a ^ b ^ cin;
    assign cout = (a & b) | (cin & (a ^ b));
endmodule

module ripple_carry_adder_4bit (
    input  wire [3:0] a, b,
    input  wire       cin,
    output wire [3:0] sum,
    output wire       cout
);
    wire c1, c2, c3;                       // the carries that ripple

    full_adder fa0 (.a(a[0]), .b(b[0]), .cin(cin), .sum(sum[0]), .cout(c1));
    full_adder fa1 (.a(a[1]), .b(b[1]), .cin(c1),  .sum(sum[1]), .cout(c2));
    full_adder fa2 (.a(a[2]), .b(b[2]), .cin(c2),  .sum(sum[2]), .cout(c3));
    full_adder fa3 (.a(a[3]), .b(b[3]), .cin(c3),  .sum(sum[3]), .cout(cout));
endmodule
```

Note what the carry-in is: an **input** to the module, not something generated inside it. Bit 0 gets a real full adder rather than a half adder, which costs one extra gate's worth of hardware and buys something specific — the next topic uses that carry-in as a subtract control.

The three internal wires are the whole diagram. Named-port instantiation makes the structure readable directly from the code: `.cin(c1)` on `fa1` is the same wire as `.cout(c1)` on `fa0`, so the list of instantiations is an RTL-level picture of the chain.

With only nine input bits — four, four, and the carry-in — the design is small enough to check **exhaustively**, all $2^9 = 512$ cases, against Verilog's own `+` operator:

```verilog
module tb;
    integer i, errors;
    reg [3:0] a, b; reg cin;
    wire [3:0] sum; wire cout;
    ripple_carry_adder_4bit dut (.a(a), .b(b), .cin(cin), .sum(sum), .cout(cout));
    initial begin
        errors = 0;
        for (i = 0; i < 512; i = i + 1) begin
            {cin, a, b} = i[8:0]; #1;
            if ({cout, sum} !== (a + b + cin)) errors = errors + 1;
        end
        $display("exhaustive: 512 cases, %0d errors", errors);
    end
endmodule
```

Running it:

```
   a    b  cin |  cout sum   decimal
0101 0011   0  |   0  1000    5 + 3 = 8
1001 1000   0  |   1  0001    9 + 8 = 17
0101 1010   0  |   0  1111    5 + 10 = 15
1111 0000   1  |   1  0000    15 + 0 + 1 = 16
exhaustive: 512 cases, 0 errors
```

One trap in that loop is worth knowing, because it does not fail loudly — it hangs. The counter must be an `integer`. If you declare it `reg [8:0]`, it can only hold 0 through 511, so `i < 512` is *always* true, `i` wraps around to 0 forever, and the simulation never ends.

It is also worth knowing what this structural version gives up. Writing the adder as a single line, `assign {cout, sum} = a + b + cin;`, describes the same function and lets the synthesis tool choose whatever adder structure it prefers — very likely something faster than a ripple. Spelling out the four instantiations is how you *pin the ripple down*, which is exactly what you want while studying it, and not what you want in production.

## Key Takeaways

A ripple carry adder chains one full adder per bit, each stage's carry-out feeding the next stage's carry-in, mirroring the way addition is done by hand. Its correctness is obvious; its cost is time. Looking at how a stage's carry-out depends on its carry-in gives exactly three cases, set by $A_i$ and $B_i$ alone: the stage **kills** the carry ($0\,0$), **propagates** it ($0\,1$ or $1\,0$), or **generates** one ($1\,1$). Only a propagating stage has to wait for its carry-in; a kill or a generate resolves immediately and breaks the chain. With one Δ as the time to cross one waiting stage, the **worst case is every stage propagating, or $n\Delta$** — and that worst case can occur with no carry appearing anywhere in the result, which shows the delay is about waiting, not about carries. The hardware grows linearly with width, which is the design's virtue, but so does the delay: 64 bits means 64Δ. In Verilog the chain is four instantiations plus three internal wires, small enough to verify exhaustively over all 512 input combinations.

## Review Questions

**1. Why can a stage with $A_i = B_i = 0$ produce its carry-out without waiting?**
A. Because the sum bit is always 0 in that case\
B. Because the carry-out is 0 regardless of the carry-in\
C. Because zeros propagate faster than ones through a gate\
D. Because the stage is skipped entirely during addition

**2. Which input combination on a stage forces it to wait for its carry-in?**
A. $A_i = B_i = 0$\
B. $A_i = B_i = 1$\
C. $A_i \ne B_i$\
D. Every combination waits equally

**3. For a four-bit ripple carry adder, which addition takes the longest to settle?**
A. One where a carry is generated at bit 0 and propagates to the top\
B. One where every stage propagates\
C. One where every stage generates a carry\
D. The one producing the largest sum

**4. What is the worst-case settle time of a 32-bit ripple carry adder, in delay units?**
A. 5Δ, because $\log_2 32 = 5$\
B. 32Δ\
C. 64Δ\
D. 1Δ, because all the stages work at the same time

**5. In the Verilog above, what is the role of the wires `c1`, `c2` and `c3`?**
A. They carry the sum bits to the module output\
B. They carry each stage's carry-out to the next stage's carry-in\
C. They synchronize the stages to a clock\
D. They are test signals and can be deleted

**6. Why does an exhaustive testbench for this module need only 512 cases?**
A. Because 512 is the largest number four bits can represent\
B. Because there are nine input bits in total, and $2^9 = 512$\
C. Because each of the four stages has 128 possible states\
D. Because the carry-in doubles the 256 cases of a two-bit adder

**7. What does the ripple carry adder trade away compared with a carry-look-ahead adder?**
A. Hardware size, in exchange for speed\
B. Speed, in exchange for a small and simple design\
C. Correctness for some input combinations\
D. The ability to handle a carry-in

## Answer Explanations

**1. B.** With both data bits at 0, the column total is just the carry-in, which is at most 1 — enough for a sum bit but never enough to carry. So the carry-out is 0 no matter what arrives, and the stage can assert it immediately. This is what "killing" the carry means, and it is why a $0\,0$ stage resets the delay count.

**2. C.** When the data bits differ, the column total is $1 + C_i$, so the carry-out is exactly the carry-in — the stage cannot know its output until the carry arrives. That is the propagate case, and it is the only one that costs a delay unit. In the other two cases the two data bits alone settle the carry-out.

**3. B.** The worst case is four propagating stages, because each one has to wait for the one below it. Option A is slower-sounding but is actually *faster*: a generate at bit 0 resolves instantly, so the chain only has three stages left to cross, giving 3Δ. Option C is fastest of all, since every generate resolves immediately. The size of the sum has nothing to do with it.

**4. B.** The worst case for an $n$-bit ripple adder is $n\Delta$, so 32 bits gives 32Δ. Option A is the kind of logarithmic behaviour a carry-look-ahead adder aims for, not what a ripple adder does. The stages do *not* all work simultaneously — that is precisely the design's weakness.

**5. B.** They are the internal carry chain: `c1` connects `fa0`'s carry-out to `fa1`'s carry-in, and so on. They are the wires the "ripple" actually travels along. The sum bits go straight to the `sum` output, and nothing here is clocked — a ripple carry adder is purely combinational.

**6. B.** The module has $4 + 4 + 1 = 9$ input bits, so there are $2^9 = 512$ distinct input combinations, and a loop over all of them covers every possible case. Note that this requires an `integer` loop counter: a `reg [8:0]` cannot hold 512, so the loop condition never becomes false and the simulation hangs.

**7. B.** The ripple carry adder is small and simple — one full adder per bit — and its cost is a worst-case delay that grows linearly with width. A carry-look-ahead adder spends extra hardware computing the carries in parallel to break that linear dependence. It can do so because generate and propagate depend only on $A_i$ and $B_i$, so every stage knows its own behaviour before any carry arrives.
