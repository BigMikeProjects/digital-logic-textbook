# Carry-Lookahead Adder

The ripple carry adder always gets the right answer, but it makes you wait for it. Bit 1 cannot finish until bit 0 hands it a carry, bit 2 waits on bit 1, and bit 3 waits on bit 2. Nothing in the chain can commit until the stage below it has made up its mind, so in the worst case the carry has to travel across the whole width of the adder one stage at a time. For four bits that is tolerable. Real adders are 16, 32 or 64 bits wide, and there the wait becomes the thing that limits how fast the whole machine can run.

Here is the observation that gets us out of it. At time zero, every input to the adder is already known: all the $A$ bits, all the $B$ bits, and the carry-in $C_0$. Every carry in the finished addition is some function of those inputs. So nothing forces us to wait for the carries to arrive one at a time. We can work out the logic behind them and **compute every carry directly from the inputs**, all at once. An adder built that way is a **carry-lookahead adder**, and it keeps the same row of full adders while replacing only the wires that carry the carries.

## Why the Ripple Adder Waits

The Ripple Carry Adder topic sorted each stage into three cases by looking at how its carry-out depends on its carry-in. Those three cases are the whole foundation of lookahead, so they are worth restating.

If both data bits are 0, the stage **kills** any carry: $0 + 0 + 1$ is still less than two, so the carry-out is 0 whatever arrives. If both data bits are 1, the stage **generates** a carry: the column is already at two, so a carry comes out whatever arrives. If the data bits differ, the stage **propagates**: the column total is $1 + C_i$, so the carry-out is exactly the carry-in.

Only the propagate case has to wait, and that is where the ripple adder loses its time. A kill or a generate knows its answer from its own two bits. A propagating stage has to be told.

## Generate and Propagate

The carry-lookahead adder turns those three cases into two signals per column, each answering one question about that column.

**Generate** answers *does this column make a carry all by itself?* Only when both bits are 1:

$$G_i = A_i \cdot B_i$$

**Propagate** answers *if a carry arrives, will this column pass it along?* Only when exactly one bit is 1:

$$P_i = A_i \oplus B_i$$

| $A_i$ | $B_i$ | $G_i$ | $P_i$ | this column… |
|:-:|:-:|:-:|:-:|---|
| 0 | 0 | 0 | 0 | kills — no carry out, whatever comes in |
| 0 | 1 | 0 | 1 | propagates — carry out equals carry in |
| 1 | 0 | 0 | 1 | propagates — carry out equals carry in |
| 1 | 1 | 1 | 0 | generates — carry out regardless of carry in |

The important thing about both signals is what they do *not* depend on. $G_i$ and $P_i$ are functions of $A_i$ and $B_i$ alone, so every column can compute them the moment the inputs arrive. Neither one waits for anything.

With them, the carry out of any column can be written in one line:

$$C_{i+1} = G_i + P_i \cdot C_i$$

Read it as a sentence: *a carry leaves this column if the column generated one, or if one came in and the column passes it along.* And the sum bit reuses the propagate signal:

$$S_i = P_i \oplus C_i$$

That second equation is why propagate is defined with XOR rather than OR. With OR, the $1\,1$ row would also count as propagating, which would still give correct carries (that row generates anyway), but then $P_i$ would no longer be half of the sum. Defining $P_i = A_i \oplus B_i$ lets one signal serve both jobs.

## Unrolling the Carry Equations

The recurrence $C_{i+1} = G_i + P_i C_i$ is still a ripple. $C_2$ is written in terms of $C_1$, so as written, it waits for $C_1$. But $C_1$ is itself just a formula in terms of things we already know. So substitute it in.

Start at the bottom. $C_1$ already depends only on inputs, because $C_0$ is the adder's own carry-in:

$$C_1 = G_0 + P_0 C_0$$

Now write $C_2$ from the recurrence and replace $C_1$ with the whole of that expression, then multiply $P_1$ through:

$$C_2 = G_1 + P_1 C_1 = G_1 + P_1 (G_0 + P_0 C_0) = G_1 + P_1 G_0 + P_1 P_0 C_0$$

$C_2$ no longer mentions $C_1$. It stands on the $G$'s, the $P$'s and $C_0$, all of which are known immediately. The same move works one stage up, substituting the whole of $C_2$ into $C_3$, and then the whole of $C_3$ into $C_4$:

$$C_3 = G_2 + P_2 G_1 + P_2 P_1 G_0 + P_2 P_1 P_0 C_0$$

$$C_4 = G_3 + P_3 G_2 + P_3 P_2 G_1 + P_3 P_2 P_1 G_0 + P_3 P_2 P_1 P_0 C_0$$

The pattern is easy to read once you see it. Each term is one way a carry can reach the top. $G_3$ says the top column made one itself. $P_3 G_2$ says column 2 made one and column 3 passed it. The last term, $P_3 P_2 P_1 P_0 C_0$, says the carry-in came in at the bottom and every column passed it all the way up.

None of these values changed. $C_4$ computed this way is the same bit the ripple adder would eventually produce. The only thing that changed is **the waiting**: the ripple adder computes $C_4$ by asking $C_3$, which asks $C_2$, which asks $C_1$. The lookahead adder computes it straight from the inputs.

## Two Levels, No Waiting

Look at the shape of those equations. Every one is a sum of products: a row of AND gates feeding a single OR gate. So once the $G$ and $P$ signals exist, **every carry is exactly two levels of logic away** — an AND, then an OR — whether it is $C_1$ or $C_4$. That is the speedup. In a ripple adder the top carry is further away than the bottom one; here they are all the same distance.

The hardware is the same four full adders as the ripple adder. What changes is that each full adder's carry-in no longer comes from its neighbour. Instead, a **lookahead block** takes all four $A$ bits, all four $B$ bits and $C_0$, computes $C_1$ through $C_4$ in parallel, and hands each stage its carry directly.

A worked case shows every piece. Take $5 + 3$, which is $0101 + 0011$ with $C_0 = 0$:

| bit $i$ | $A_i$ | $B_i$ | $G_i$ | $P_i$ | what the column does |
|:-:|:-:|:-:|:-:|:-:|---|
| 3 | 0 | 0 | 0 | 0 | kills |
| 2 | 1 | 0 | 0 | 1 | propagates |
| 1 | 0 | 1 | 0 | 1 | propagates |
| 0 | 1 | 1 | 1 | 0 | generates |

Evaluate the carries from the flat equations, not from each other. $C_1 = G_0 + P_0 C_0 = 1$, because column 0 generates. $C_2 = G_1 + P_1 G_0 + P_1 P_0 C_0 = 0 + 1 + 0 = 1$: the $P_1 G_0$ term fires, meaning column 0's carry passes through column 1. $C_3 = 1$ the same way, through the $P_2 P_1 G_0$ term. $C_4 = 0$, because every one of its terms contains either $G_3$ or $P_3$, and column 3 kills. The sum bits are then $S_i = P_i \oplus C_i$, which gives $S = 1000$ with no carry out: $5 + 3 = 8$.

In the ripple adder this case took three delay units to settle, because two propagating stages had to wait in turn. Here all four carries were read off the inputs in the same two levels. And the ripple adder's worst case, $0101 + 1010$ with every stage propagating, is no worse here: it is the single term $P_3 P_2 P_1 P_0 C_0$, one AND gate wide.

The interactive's **R** key picks random inputs and lights whichever term in each carry equation is firing, which is a quick way to build intuition for which columns generate and which only pass a carry along.

## What Lookahead Costs

The speed is not free, and the cost shows up in the size of the gates. Count the inputs on $C_4$: its OR gate has **five** inputs, one per product term, and its last AND term, $P_3 P_2 P_1 P_0 C_0$, also has **five**. The pattern continues with width:

| adder width $n$ | product terms in $C_n$ | widest AND gate |
|:-:|:-:|:-:|
| 4 | 5 | 5 inputs |
| 8 | 9 | 9 inputs |
| 16 | 17 | 17 inputs |
| 32 | 33 | 33 inputs |

Gates with that much fan-in are slow and expensive to build, which undoes the speed they were meant to buy. So nobody builds a flat lookahead thirty-two bits wide. The practical move is to stop at four and use the result as a building block.

## Lookahead in Blocks

The trick is to treat a whole 4-bit lookahead adder as if it were a single, wider column, and ask it the same two questions: does this block make a carry by itself, and will this block pass a carry along?

There is nothing new to derive. Both answers are already sitting in the $C_4$ you just unrolled. Split it into the part that does not involve $C_0$ and the part that does:

$$C_4 = \underbrace{G_3 + P_3 G_2 + P_3 P_2 G_1 + P_3 P_2 P_1 G_0}_{G_G} \; + \; \underbrace{P_3 P_2 P_1 P_0}_{P_G} \cdot C_0$$

The first part, $G_G$, never mentions $C_0$: it is the block producing a carry out on its own. The second part, $P_G$, is what $C_0$ is multiplied by: it is the block passing an incoming carry straight through. So the block's carry out is

$$C_4 = G_G + P_G \cdot C_0$$

which is exactly the recurrence for a single column, $C_{i+1} = G_i + P_i C_i$, one size up.

| | one column | one 4-bit block |
|---|:-:|:-:|
| makes a carry by itself | $G$ | $G_G$ |
| passes one through | $P$ | $P_G$ |
| carry out | $G + P \cdot C_{in}$ | $G_G + P_G \cdot C_{in}$ |

Because a block obeys the same recurrence as a column, you can wire four blocks together exactly the way you wired four columns. A **16-bit adder** is four 4-bit lookahead blocks, each reporting its own $G_G$ and $P_G$ downward, and a **second-level lookahead block**, the very same circuit, that computes the carry into each block. That adds one more level of logic, but it is still far fewer than sixteen stages of waiting. Four 16-bit groups and a third level gives you 64 bits.

If the block details feel like a lot, hold on to the part that matters most: in the 4-bit case, every carry is two levels of logic from the $G$'s and $P$'s, and no stage waits on another. The block structure is that same idea applied again, one level up.

## Where It Is Used

Addition sits on the critical path of almost every processor. Every add, every compare and every address calculation passes through an adder inside the ALU, so shaving the adder's delay shortens the clock period for the whole machine. That is why a ripple adder is not what you find in a processor's datapath.

The trade is worth naming plainly. The lookahead logic computes nothing the ripple adder did not also compute; it just refuses to wait for it. The speed is **bought with area**: more gates, more wiring, more of the chip. Paying hardware to save time is one of the recurring bargains of digital design, and this adder is one of the cleanest examples of it.

The idea also goes further than this topic takes it. Push lookahead to its logical end and the carry computation becomes a tree. **Prefix adders** such as Kogge–Stone and Brent–Kung are built that way, and they are what you will meet in a VLSI course.

None of this makes the ripple adder wrong. The two produce identical sums for every one of the 512 input combinations of a 4-bit adder; the only difference is when the answer is ready. For a few bits the ripple adder is often the sensible choice, being smaller and simpler to read. Lookahead earns its cost only once the width is large enough that the wait starts to hurt.

## Building It in Verilog

The Verilog for the lookahead unit is just the equations. Nothing in it is clocked; it is combinational logic, and it is written **structurally** here because the structure is the point of the topic:

```verilog
module cla4 (input [3:0] a, b, input cin,
             output [3:0] s, output cout);
    wire [3:0] g = a & b;                 // generate
    wire [3:0] p = a ^ b;                 // propagate

    wire c1 = g[0] | (p[0] & cin);
    wire c2 = g[1] | (p[1] & g[0]) | (p[1] & p[0] & cin);
    wire c3 = g[2] | (p[2] & g[1]) | (p[2] & p[1] & g[0])
                   | (p[2] & p[1] & p[0] & cin);
    assign cout = g[3] | (p[3] & g[2]) | (p[3] & p[2] & g[1])
                       | (p[3] & p[2] & p[1] & g[0])
                       | (p[3] & p[2] & p[1] & p[0] & cin);

    assign s = p ^ {c3, c2, c1, cin};     // all four sum bits at once
endmodule
```

The vector operators do the per-column work in one line each: `a & b` forms all four generate bits and `a ^ b` all four propagate bits. Each carry is then one line of ANDs and ORs, matching its unrolled equation term for term. Notice that `c3` never mentions `c2`; no carry is built from another carry.

The last line is this module's Verilog idiom. The concatenation `{c3, c2, c1, cin}` assembles the four carries-in into a carry vector, lined up so that bit $i$ of the vector is $C_i$. A single XOR against `p` then produces every sum bit at once, which is $S_i = P_i \oplus C_i$ for all four columns.

The same exhaustive testbench used for the ripple adder checks this one against Verilog's own `+`. Running it in Icarus Verilog:

```
   a    b  cin |  cout  s    decimal
0101 0011   0  |   0  1000   5 + 3 + 0 = 8
1001 1000   0  |   1  0001   9 + 8 + 0 = 17
0101 1010   1  |   1  0000   5 + 10 + 1 = 16
1111 0000   1  |   1  0000   15 + 0 + 1 = 16
exhaustive: 512 cases, 0 errors
```

Zero errors over all 512 input combinations: the lookahead adder gives exactly the ripple adder's answers.

In practice, you would write `assign {cout, s} = a + b + cin;` and let the synthesis tool choose the adder structure. It would very likely choose something better than this hand-written version. The explicit form is here because this topic is about that choice, and knowing what the `+` costs in time and area is the point.

## Key Takeaways

A ripple carry adder is slow because each stage waits for the carry from the stage below. The carry-lookahead adder removes the wait by describing each column with two signals that depend only on that column's own bits: **generate**, $G_i = A_i B_i$, for a column that makes a carry by itself, and **propagate**, $P_i = A_i \oplus B_i$, for a column that passes an incoming carry along. The carry recurrence $C_{i+1} = G_i + P_i C_i$ is then **unrolled** by substituting each carry into the next, until every carry is a sum of products over the $G$'s, $P$'s and $C_0$ alone. Each carry is then two levels of logic, an AND followed by an OR, no matter how far up the adder it is. The cost is area and fan-in: $C_n$ needs an $(n+1)$-input OR and an $(n+1)$-input AND, so flat lookahead stops at about four bits. Larger adders reuse the same idea hierarchically, since a 4-bit block has its own group generate $G_G$ and group propagate $P_G$ and obeys the same recurrence as a single column. The lookahead adder gives exactly the same sums as a ripple adder; it trades more logic for less waiting, which is the bargain it exists to demonstrate.

## Review Questions

**1. Why can every column compute its generate and propagate signals immediately, without waiting?**

A. Because they are computed by a clocked register\
B. Because they depend only on that column's $A_i$ and $B_i$\
C. Because they depend only on the carry-in $C_0$\
D. Because the ripple adder has already computed them

**2. Which pair of bits makes a column propagate a carry?**

A. $A_i = 0,\ B_i = 0$\
B. $A_i = 1,\ B_i = 1$\
C. $A_i \ne B_i$\
D. Any pair, as long as $C_i = 1$

**3. After substituting $C_1 = G_0 + P_0 C_0$ into $C_2 = G_1 + P_1 C_1$, what is $C_2$?**

A. $G_1 + P_1 G_0 + P_0 C_0$\
B. $G_1 + G_0 + P_1 P_0 C_0$\
C. $G_1 + P_1 G_0 + P_1 P_0 C_0$\
D. $G_1 P_1 + G_0 P_0 + C_0$

**4. Once the $G$ and $P$ signals are available, how many levels of logic does it take to produce $C_4$ in a 4-bit carry-lookahead adder?**

A. Two — an AND level followed by an OR level\
B. Four — one per stage, as in the ripple adder\
C. Five — one per product term\
D. One — a single XOR

**5. Why is a flat carry-lookahead adder not built 32 bits wide?**

A. It would give wrong answers for some inputs\
B. Its top carry would need 33-input AND and OR gates\
C. It would be slower than a 32-bit ripple adder in every case\
D. Verilog cannot describe carries beyond four bits

**6. In a 16-bit adder built from four 4-bit lookahead blocks, what does each block report to the second-level lookahead logic?**

A. Its four sum bits\
B. Its group generate $G_G$ and group propagate $P_G$\
C. Its carry-in $C_0$\
D. Its four individual carries $C_1$ through $C_4$

## Answer Explanations

**1. B.** $G_i = A_i B_i$ and $P_i = A_i \oplus B_i$ are functions of that column's two data bits and nothing else. Those bits are primary inputs, available at time zero, so every column forms its $G$ and $P$ in parallel. Nothing in the adder is clocked, and the carry-in plays no part in either signal.

**2. C.** When the bits differ, the column total is $1 + C_i$, so the carry-out equals the carry-in, which is exactly what $P_i = A_i \oplus B_i$ detects. Two 0s kill the carry and two 1s generate one. The value of $C_i$ does not decide whether a column propagates; it decides *what* gets propagated.

**3. C.** Multiplying $P_1$ through the whole of $C_1$ gives $P_1 G_0 + P_1 P_0 C_0$. Option A drops the $P_1$ from the last term, which would let a carry-in reach $C_2$ even when column 1 does not propagate. The correct term reads as "the carry-in entered at the bottom and both columns passed it."

**4. A.** Every unrolled carry is a sum of products: the AND gates form the terms and one OR gate combines them. That depth is the same for $C_1$ as for $C_4$, which is the whole speedup over the ripple adder, where the top carry is four stages away.

**5. B.** The top carry of an $n$-bit flat lookahead has $n + 1$ product terms, and its longest term has $n + 1$ factors, so 32 bits would need 33-input gates. Gates with that fan-in are slow and large, which cancels the benefit. The answers would still be correct; the practical fix is to build 4-bit blocks and add a second level of lookahead.

**6. B.** A 4-bit block answers the same two questions a single column does: does it make a carry by itself ($G_G$), and does it pass one through ($P_G$)? Its carry out is $G_G + P_G \cdot C_{in}$, the column recurrence one size up, so the second-level logic is the very same lookahead circuit fed with block signals instead of column signals.
