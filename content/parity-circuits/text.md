# Parity Circuits

Every circuit we have built so far assumes the bits arrive as they were sent. Real systems do not get
that guarantee. A bit travelling down a bus, sitting in memory, or crossing a serial cable can be
flipped by noise, by a cosmic ray, by a marginal voltage level — and nothing about the bit itself
announces that it is wrong. A 0 that should have been a 1 looks exactly like a 0 that was always a 0.

A **parity circuit** is the cheapest possible answer to that problem: **add one extra bit so that the
number of 1s in the whole word comes out even** (or odd, as long as both ends agree). If the count
arrives wrong, something changed along the way.

One extra bit buys surprisingly little and surprisingly much. It is enough to catch a single flipped
bit every time, which is the overwhelmingly common case. It is not enough to say *which* bit flipped,
and it cannot repair anything. And there is a specific, important case it misses entirely — we will
make that failure happen on purpose rather than just describing it.

We will work through parity with the section's **four-beat cadence** — functionality, hardware,
applications, Verilog — using a **4-bit even-parity generator and checker** as the running example,
and then add a fifth beat on the codes that begin where parity stops.

## Beat 1: Functionality

Call the data bits $D_3 D_2 D_1 D_0$ and the appended parity bit $P$. The five bits together,
$\{D_3, D_2, D_1, D_0, P\}$, form the **word** that actually travels.

The rule for choosing $P$ is a single sentence:

> **Even parity:** choose $P$ so that the number of 1s across the data *and* the parity bit is even.
> **Odd parity:** choose $P$ so that the total is odd.

Neither convention is better than the other. A system simply has to pick one and use it at both ends.
We will use even parity throughout, and odd will turn out to cost exactly one inverter.

Take $D = 0001$. The data holds one 1, which is odd, so $P$ must be 1 to bring the total to two. The
word sent is $00011$. Now take $D = 0101$: the data already holds two 1s, so $P = 0$ and the word is
$01010$. The parity bit is **a function of the data**, not a fixed extra.

There are only sixteen data values, so here is all of it:

| $D_3 D_2 D_1 D_0$ | 1s in data | $P$ (even) | $P$ (odd) | word sent (even) | 1s in word |
|:-----------------:|:----------:|:----------:|:---------:|:----------------:|:----------:|
| 0 0 0 0 | 0 | 0 | 1 | 0 0 0 0 0 | 0 |
| 0 0 0 1 | 1 | 1 | 0 | 0 0 0 1 1 | 2 |
| 0 0 1 0 | 1 | 1 | 0 | 0 0 1 0 1 | 2 |
| 0 0 1 1 | 2 | 0 | 1 | 0 0 1 1 0 | 2 |
| 0 1 0 0 | 1 | 1 | 0 | 0 1 0 0 1 | 2 |
| 0 1 0 1 | 2 | 0 | 1 | 0 1 0 1 0 | 2 |
| 0 1 1 0 | 2 | 0 | 1 | 0 1 1 0 0 | 2 |
| 0 1 1 1 | 3 | 1 | 0 | 0 1 1 1 1 | 4 |
| 1 0 0 0 | 1 | 1 | 0 | 1 0 0 0 1 | 2 |
| 1 0 0 1 | 2 | 0 | 1 | 1 0 0 1 0 | 2 |
| 1 0 1 0 | 2 | 0 | 1 | 1 0 1 0 0 | 2 |
| 1 0 1 1 | 3 | 1 | 0 | 1 0 1 1 1 | 4 |
| 1 1 0 0 | 2 | 0 | 1 | 1 1 0 0 0 | 2 |
| 1 1 0 1 | 3 | 1 | 0 | 1 1 0 1 1 | 4 |
| 1 1 1 0 | 3 | 1 | 0 | 1 1 1 0 1 | 4 |
| 1 1 1 1 | 4 | 0 | 1 | 1 1 1 1 0 | 4 |

Read the last column top to bottom: every entry is even. That is the whole invariant the scheme
maintains, and the $P$ (even) column is nothing more than a restatement of the "1s in data" column —
1 when the data count is odd, 0 when it is even.

### The checker

At the receiving end sit five bits, $R_4 \dots R_0$, which are *supposed* to be the five bits that
were sent. The **checker** counts their 1s. An even count means the word is consistent with the
convention; an odd count means something changed in transit. The checker's output is a single error
flag:

$$E = 1 \;\Longrightarrow\; \text{the word is corrupt}$$

Notice that the checker needs nothing but the received bits. It does not need a copy of the original
data, and it does not need to know what the data was supposed to be.

### What parity can and cannot do

This is the honest framing, and it belongs here rather than buried in a footnote:

- Parity **detects; it does not correct.** The flag says something is wrong. It cannot say which bit,
  so it cannot repair anything. The usual response is to discard the word and ask for it again, or
  raise an exception.
- Parity detects only an **odd** number of flipped bits. **One flipped bit is always caught.** **Two
  flipped bits are always missed** — the count returns to even and the word looks perfect.

That second point is not a rare corner case to be waved at. It is a guarantee running the wrong way,
and Beat 3 will walk straight into it.

## Beat 2: Building One from Gates

Parity **is** XOR. That is the entire hardware story, and it follows from one observation about the
XOR gate.

A two-input XOR outputs 1 when its inputs differ. Chain more inputs in and that generalizes to
something much more useful: **an XOR of many bits outputs 1 exactly when the number of 1s among them
is odd.** Feeding in one more 1 flips the running answer; feeding in a 0 leaves it alone. So the XOR
of a group of bits *is* the answer to "is the count odd?"

Which is precisely the parity bit we need. For even parity:

$$P_\text{even} = D_3 \oplus D_2 \oplus D_1 \oplus D_0$$

If the data holds an odd number of 1s, this is 1, and appending it makes the total even. If the data
holds an even number, this is 0, and the total stays even. For odd parity, invert the output:

$$P_\text{odd} = \overline{D_3 \oplus D_2 \oplus D_1 \oplus D_0}$$

One inverter on the last stage — or equivalently an XNOR in place of the final XOR. That is the whole
difference between the two conventions in hardware.

The checker is the same structure, one input wider, taking all five received bits:

$$E = R_4 \oplus R_3 \oplus R_2 \oplus R_1 \oplus R_0$$

**The generator and the checker are the same circuit.** That is worth stating outright: one XOR-tree
design serves both ends of the link, and the only difference is how wide it is and what you call its
output. Working through why is a good check of the idea — the received word has even parity exactly
when its 1-count is even, and an XOR over all five bits is 1 exactly when that count is odd.

### The shape of the tree matters, even though the logic does not

XOR is associative, so we may group those four terms however we like and the function is unchanged.
The *timing* is not unchanged, and this is the cleanest example in the course of that distinction.

**As a chain** — $((D_3 \oplus D_2) \oplus D_1) \oplus D_0$ — each gate waits on the one before it.
Depth grows **linearly**: $n - 1$ gates from input to output. Four bits are 3 gates deep.

**As a balanced tree** — $(D_3 \oplus D_2) \oplus (D_1 \oplus D_0)$ — the two inner XORs evaluate at
the same time and only the final gate waits. Depth grows as $\lceil \log_2 n \rceil$. Four bits are 2
gates deep.

At four bits, 3 versus 2 hardly seems worth the trouble. Scale it up and the gap is the whole design:

| Width | Chain depth | Tree depth |
|:-----:|:-----------:|:----------:|
| 4  | 3  | 2 |
| 8  | 7  | 3 |
| 32 | 31 | 5 |
| 64 | 63 | 6 |

A 32-bit parity chain is **31 gate delays** deep; the balanced tree over the same 32 bits is **5**.
Same gates, same count, same truth table, six times shorter critical path. **Logic and timing are
separate concerns**, and a circuit that is correct can still be too slow.

## Beat 3: Applications

**Memory parity.** The classic use, and the one that gave the technique its reputation. One extra bit
per byte of DRAM, checked on every read. A parity error raises an exception rather than letting
corrupt data flow silently into a calculation — which is the real value. Silent corruption is far
worse than a halt, because a halt tells you something happened.

**Serial links.** The parity bit in a UART frame, the middle letter in the `8N1` / `8E1` settings on
a serial port: 8 data bits, **N**one or **E**ven parity, 1 stop bit. Anyone who has configured a
serial connection has already chosen a parity convention, usually without knowing what it did.

**Bus and interconnect checking.** A parity bit carried alongside an address or data bus and checked
at the far end. On an address bus this matters more than it first appears — a flipped address bit does
not corrupt the data, it reads or writes **the wrong location entirely**, and the data that comes back
is perfectly valid data from somewhere else.

### Watching it succeed, and then watching it fail

Take $D = 0001$ again, so $P = 1$ and the word sent is $00011$.

**One bit flips in transit.** Say $D_2$ arrives as 1 instead of 0. The received word is $00111$ —
three 1s, an odd count, so $E = 1$. Caught. The receiver knows the word is bad, discards it, and asks
again.

**A second bit flips.** Now suppose the parity bit is *also* corrupted on the way, so the received
word is $00110$. Count the 1s: two, an even count, so $E = 0$. The checker reports the word is fine.

It is not fine. The data bits read $0011$ and the data bits sent were $0001$. The receiver will
happily use a value that is simply wrong, with no indication whatsoever that anything happened. And
it does not matter that one of the two flips landed on the parity bit — any two flips do this,
because the second flip undoes the first flip's effect on the count.

A third flip would be caught again, a fourth missed again. The pattern is the rule stated in Beat 1,
and it is worth deriving rather than memorizing: parity tracks the *count* of 1s modulo 2, so it sees
exactly the changes that alter that count.

**Where parity runs out.** One check bit buys exactly one fact — the count is wrong — and buys it
only for an odd number of errors. It can never say which bit is broken, and so it can never repair
one. Locating and correcting an error takes several check bits; catching bursts of adjacent errors
reliably takes a different construction entirely. Both are Beat 5.

## Beat 4: Parity in Verilog

Because the circuit is a single XOR tree, the Verilog is a single line — and it uses an operator that
has not come up before.

```verilog
module par_gen (input [3:0] d, output p);
  assign p = ^d;   // even parity: 1 when d holds an odd count
endmodule

module par_chk (input [4:0] w, output e);
  assign e = ^w;   // 1 => odd count => corrupt
endmodule
```

The `^` in `^d` is a **reduction operator**. Applied to a single vector, it XORs *every bit of that
vector together* and produces one bit. It is the whole tree from Beat 2 written as one character —
and, importantly, the synthesizer is free to build it as a balanced tree rather than a chain, so you
get the short critical path without drawing it.

Widen the bus and the operator does not change at all. `input [31:0] d` with the same `assign p = ^d;`
is a 32-bit parity generator. That scaling-for-free property is why the reduction operator is the
idiom worth knowing here.

> **The one gotcha that costs marks: even parity's generator is `^d`, not `~^d`.**
>
> The instinct is to reach for the inverted form, because we are generating *even* parity and `^`
> sounds like it is testing for odd. It is — and that is exactly the point. Read `^d` as **"is the
> count odd?"**, because that is the bit you must append to *make* the count even. The naming feels
> backwards the first several times. (`~^` is XNOR, and `~^d` is the **odd**-parity generator.)

Simulating both modules over all sixteen data values, and then sweeping every possible flip, confirms
the behavior from Beats 1 and 3:

```
 d    p   word   ones  E
0000  0  00000    0    0
0001  1  00011    2    0
0010  1  00101    2    0
0011  0  00110    2    0
...
1101  1  11011    4    0
1110  1  11101    4    0
1111  0  11110    4    0

single-bit flips undetected : 0 of 80
two-bit   flips detected    : 0 of 160
two-bit   flips missed      : 160 of 160
```

Sixteen data values across five bit positions give 80 possible single-bit flips, and **every one is
detected**. The same sixteen values across ten bit-pairs give 160 possible two-bit flips, and **every
one is missed**. Both halves of parity's guarantee are exact, not approximate.

## Beat 5: Going Further

Parity is the first rung on a ladder. It is worth seeing the rungs above it, even without climbing
them, because the trade being made is the same at every level: **spend more check bits, buy more
capability.**

One check bit buys one fact — the count is wrong. Spend a few more and you can buy the *location* of
the error, and once you know the location of a bit error you can repair it, because there is only one
other thing a bit could have been.

**Hamming codes.** Instead of one parity bit over everything, use several parity bits over
*overlapping* subsets of the bits. When one bit goes bad, some of those checks fail and others do not,
and the pattern of which ones failed spells out the **binary index of the broken bit** — so you can
flip it back. **Hamming(7,4)** protects 4 data bits with 3 check bits, and corrects any single-bit
error among all seven. Notice the cost the video points out directly: seven bits transmitted to
deliver four bits of information.

**ECC memory.** Server DRAM carries **8 check bits per 64 data bits** — extended Hamming, known as
**SECDED**: single error corrected, double error detected. It is Beat 3's memory parity one rung up,
and the machines running serious workloads use it precisely because "raise an exception" is not a good
enough answer when the error rate times the uptime stops being small.

**CRC.** Treats the message as the coefficients of a polynomial and divides by a fixed generator
polynomial, sending the remainder along with the data. It is exceptionally strong at detecting
**bursts** of adjacent errors, which is the failure mode of real communication channels and storage
media. Every Ethernet frame you have ever sent ends in a **CRC-32**.

**Reed–Solomon.** Works on whole **symbols** rather than individual bits, so a single correction
repairs a run of damaged bits at once. It is why a scratched CD still plays, why a torn QR code still
scans, and how deep-space probes get their data home.

### The idea underneath all of it

The unifying concept is **distance**: how many bits must flip to turn one legal codeword into another
legal codeword.

Parity has **distance 2** — any two legal words differ in at least two places, which is enough to
*notice* a single flip (it lands between legal words) but not enough to tell which legal word it came
from. Hamming has **distance 3**, which is enough to *identify* the nearest legal word and therefore
to correct. Correction always means buying distance, and distance is always paid for in check bits.

Beyond these, **LDPC** and **turbo** codes carry 5G, Wi-Fi and SSDs, and get close to the theoretical
limit Claude Shannon proved in 1948. None of it changes what parity is. It changes how much you are
willing to spend.

## Key Takeaways

A **parity bit** is one extra bit appended to a word so the total number of 1s comes out **even** (or
odd — both ends just have to agree). It is chosen as a function of the data, and the receiver checks
it by counting the 1s in everything it received. Parity **detects but never corrects**, and it detects
only an **odd** number of flips: one flipped bit is always caught, two flipped bits are always
silently missed. In hardware **parity is XOR**, because an XOR over many bits is 1 exactly when the
count of 1s is odd — so $P_\text{even} = D_3 \oplus D_2 \oplus D_1 \oplus D_0$, odd parity is the same
tree plus one inverter, and **the generator and checker are the same circuit**, the checker just one
input wider. The tree's *shape* does not change the logic but does change the timing: a chain is
$n-1$ deep and a balanced tree $\lceil \log_2 n \rceil$, which at 32 bits is 31 gate delays against 5.
In Verilog the whole circuit is the **reduction operator** `^`, as in `assign p = ^d;` — and even
parity's generator is `^d`, **not** `~^d`, because `^d` asks "is the count odd?", which is exactly the
bit that makes the total even. Where parity stops, **Hamming** codes (location, then correction),
**ECC memory** (SECDED), **CRC** (bursts) and **Reed–Solomon** (symbols) continue, all of them buying
capability with **distance**, and paying for distance in check bits.

## Review Questions

**1. Even parity is in use. The data bits are $1011$. What is the parity bit $P$?**

A. 0, because the data already holds an even number of 1s\
B. 1, because the data holds three 1s and the total must be made even\
C. 1, because the leftmost data bit is 1\
D. 0, because even parity always appends a 0

**2. A 5-bit word arrives at an even-parity checker and exactly two of its bits were flipped in transit. What does the checker report?**

A. An error, because the data no longer matches what was sent\
B. An error, and it identifies which two bits are wrong\
C. No error, because the 1-count is even again even though the word is wrong\
D. No error, because two flips cancel and the received data is correct

**3. Why is an XOR gate the natural building block for a parity circuit?**

A. XOR is the cheapest gate to build in CMOS\
B. An XOR over many bits outputs 1 exactly when the number of 1s among them is odd\
C. XOR is the only gate that can be chained without an inverter\
D. An XOR over many bits outputs 1 exactly when all of its inputs agree

**4. A 4-bit even-parity generator is built as a chain of XOR gates and rebuilt as a balanced tree. What changes?**

A. The logic function changes, and the tree gives the correct parity\
B. Nothing changes; the two circuits are identical in every respect\
C. The logic function is the same, but the tree has a shorter critical path\
D. The tree uses fewer gates and is therefore cheaper

**5. In Verilog, what does `^d` compute when `d` is declared `input [3:0] d`?**

A. The XOR of `d` with the next signal in the expression\
B. A 4-bit vector in which each bit has been inverted\
C. A single bit that is 1 when `d` holds an odd number of 1s\
D. A single bit that is 1 when `d` holds an even number of 1s

**6. What does a Hamming code provide that a single parity bit does not?**

A. It detects errors without adding any extra bits to the word\
B. It detects bursts of adjacent errors but cannot handle single-bit errors\
C. It locates the bit in error and can therefore correct it\
D. It guarantees that no errors will occur in transmission

## Answer Explanations

**1. B.** $1011$ holds three 1s, which is odd, so $P = 1$ brings the total in the five-bit word to
four — even. Option A misreads the count. Option D describes no scheme at all: a parity bit that is
always 0 carries no information and could not detect anything, which is the quickest way to see that
$P$ must depend on the data.

**2. C.** The first flip changes the 1-count's parity and the second changes it back, so the received
word has an even count and the checker is satisfied. This is parity's central limitation, and it is
worth being precise about why D is wrong: the received *data* is genuinely different from the data
sent — the flips do not cancel in the word, only in the count. The checker reports the word is fine
and the word is wrong.

**3. B.** XOR outputs 1 when its inputs differ, and chaining that property across many bits gives
exactly "the number of 1s is odd" — which is precisely the question a parity bit answers. Option D
describes XNOR. Relative gate cost (A) is irrelevant here; the reason is functional, and it is why the
same XOR tree serves as both generator and checker.

**4. C.** XOR is associative, so regrouping the terms cannot change the function — both circuits use
three XOR gates and produce the same parity bit. What changes is depth: the chain makes each gate wait
on the one before it (3 deep), while the tree evaluates two XORs in parallel (2 deep). This is the
example worth remembering for the general point that logic and timing are separate concerns.

**5. C.** A single `^` in front of one vector is the **reduction** XOR: it XORs all four bits together
and yields one bit, which is 1 when the count of 1s is odd. That is the even-parity generator, despite
sounding backwards — it is the bit you append to *make* the count even. Option D describes `~^d`, the
odd-parity generator, and confusing the two is the mistake the gotcha in Beat 4 exists to prevent.

**6. C.** A Hamming code runs several parity checks over overlapping subsets of the bits, and the
pattern of which checks fail identifies the position of the bad bit — and knowing the position is
enough to repair it, since a bit has only one other value it could have had. Option B describes a CRC.
No code prevents errors (D); codes only change what you can do once one has happened.
