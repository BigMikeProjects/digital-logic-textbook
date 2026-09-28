# BCD-to-Seven-Segment Decoder

Sooner or later every digital design has to show a person a number, and the cheapest way to draw a
digit is the **seven-segment display**: seven bars arranged in a figure eight, lit in different
combinations to form the digits 0 through 9. A **BCD-to-seven-segment decoder** is the block that
takes a digit's 4-bit binary code and works out which of the seven bars to light.

Most textbooks do not list this as a building-block part. It earns its place here for two reasons.
First, it is the clearest demonstration in the course of **minimization producing a smaller circuit**
— seven outputs, each with its own truth table, each shrunk by the don't-care conditions studied in
**Karnaugh Maps - Minimization Process**. Second, it is a part you will build again and again in the
lab, because the fastest way to see what a design is doing is to put its output on a display.

We will follow the section's **four-beat cadence** — functionality, hardware, applications, and
Verilog.

## Beat 1: Functionality

### The display and its segment names

The seven segments are named **a** through **g**, and the names are a standard worth memorizing:
**a** is the top bar, then **b, c, d, e, f** run clockwise around the outside starting from the
upper right, and **g** is the bar across the middle.

```
     a
   -----
  |     |
 f|     |b
  |  g  |
   -----
  |     |
 e|     |c
  |     |
   -----
     d
```

Light all seven and you draw an **8**. Light every segment except the middle one, **g**, and you draw
a **0**. A **2** uses **a, b, g, e, d** — across the top, down the right, back across the middle,
down the left, and along the bottom.

### Binary-coded decimal in, seven segments out

**BCD** stands for **binary-coded decimal**: each decimal digit is sent as its own 4-bit binary code.
We will call the four input bits $A\,B\,C\,D$, with $A$ the most significant bit and $D$ the least.
So the digit 8 arrives as $A\,B\,C\,D = 1000$ — setting $A$ alone is enough to ask for an 8 — and
the digit 2 arrives as $0010$, with only $C$ set.

Walk through the ten digits, write down which segments each one lights, and you have a truth table
with four inputs and seven outputs. Reading down any single column gives that segment's own truth
table:

| Digit | $A\,B\,C\,D$ | a | b | c | d | e | f | g |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0000 | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| 1 | 0001 | 0 | 1 | 1 | 0 | 0 | 0 | 0 |
| 2 | 0010 | 1 | 1 | 0 | 1 | 1 | 0 | 1 |
| 3 | 0011 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| 4 | 0100 | 0 | 1 | 1 | 0 | 0 | 1 | 1 |
| 5 | 0101 | 1 | 0 | 1 | 1 | 0 | 1 | 1 |
| 6 | 0110 | 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 7 | 0111 | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
| 8 | 1000 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 9 | 1001 | 1 | 1 | 1 | 1 | 0 | 1 | 1 |

Two digits have competing shapes in the wild. We draw the **6 with its top bar** (segment a lit) and
the **9 with its bottom bar** (segment d lit). That choice matters, because it changes the
equations — and it is the choice that extends cleanly when the same display later has to show the
hexadecimal digits A through F, where a 6 without its top bar would look exactly like a lowercase b.

### The six codes that never arrive

Four input bits can form sixteen codes, but BCD only uses ten of them. The codes $1010$ through
$1111$ — the numbers 10 to 15 — **never occur** on a BCD input. Nobody has promised anything about
what the display shows for them, so on those six rows every segment is a **don't-care**.

That is a deliberate design choice, not an accident of the example. A **hex-to-seven-segment**
converter, which is what you will actually build in the lab, gives all sixteen codes a glyph (A, b,
C, d, E, F) and so has no don't-cares at all. Choosing BCD here keeps the six free rows, and those
rows are what the next beat spends.

## Beat 2: Building One from Gates

### Seven outputs, seven minimizations

The hardware is conceptually simple: **one logic equation per segment**. Each segment's column is a
4-variable truth table with ten specified rows and six don't-cares, so each one gets its own
Karnaugh map and its own minimal sum of products. Minimizing all seven, with codes 10–15 treated as
don't-cares, gives:

$$a = C + \bar{B}\bar{D} + BD + A$$

$$b = \bar{C}\bar{D} + CD + \bar{B}$$

$$c = D + \bar{C} + B$$

$$d = C\bar{D} + \bar{B}\bar{D} + \bar{B}C + B\bar{C}D + A$$

$$e = C\bar{D} + \bar{B}\bar{D}$$

$$f = \bar{C}\bar{D} + B\bar{D} + B\bar{C} + A$$

$$g = C\bar{D} + \bar{B}C + B\bar{C} + A$$

All seven share the same four input rails and their complements, and each is an independent
two-level AND-OR network.

The spread is worth noticing. Segment **c** needs only three single-literal terms, because it is lit
for every digit except 2 — nearly everything is a 1, so the groups are enormous. Segment **d** needs
five terms and is the most expensive of the seven. Same inputs, same method, very different results:
the cost of a segment is set entirely by the shape of its column.

### Working one segment in full: segment e

Segment **e** is the lower-left bar. It is lit for only four digits — **0, 2, 6 and 8** — so it makes
a compact example. Here is its map, with rows $AB$ and columns $CD$ in Gray-code order and the six
don't-cares marked ×:

| $AB \backslash CD$ | 00 | 01 | 11 | 10 |
|:-:|:-:|:-:|:-:|:-:|
| **00** | 1 | 0 | 0 | 1 |
| **01** | 0 | 0 | 0 | 1 |
| **11** | × | × | × | × |
| **10** | 1 | 0 | × | × |

Two groups of four cover every 1:

- **The $CD = 10$ column** — cells 2, 6, 14 and 10. Two of those four are don't-cares, and claiming
  them turns a pair into a quad. In that column $C = 1$ and $D = 0$, so the term is $C\bar{D}$.
- **The four corners** — cells 0, 2, 8 and 10, which wrap around both edges of the map. Here
  $B = 0$ and $D = 0$ throughout, so the term is $\bar{B}\bar{D}$.

$$e = C\bar{D} + \bar{B}\bar{D}$$

Two terms, four literals. Now refuse the don't-cares and treat all six unused codes as 0s. The
column can no longer be a quad — cells 14 and 10 are now 0s — and the corners lose cell 10, so both
groups shrink to pairs, and a pair of cells costs one more literal than a quad:

$$e = \bar{A}C\bar{D} + \bar{B}\bar{C}\bar{D}$$

Still two terms, but **six literals instead of four** — two extra gate inputs for this one segment,
repeated across all seven. Being told that don't-cares help is one thing; here you can count what
they save.

### What the unused codes actually show

Because the six unused codes were don't-cares, the minimizer was free to let each segment be
whatever made its groups largest. The result is that codes 10–15 do light *something* — whatever
pattern the chosen groups happen to produce. With the equations above:

| Code | $A\,B\,C\,D$ | a b c d e f g |
|:-:|:-:|:-:|
| 10 | 1010 | 1 1 0 1 1 1 1 |
| 11 | 1011 | 1 1 1 1 0 1 1 |
| 12 | 1100 | 1 1 1 1 0 1 1 |
| 13 | 1101 | 1 0 1 1 0 1 1 |
| 14 | 1110 | 1 0 1 1 1 1 1 |
| 15 | 1111 | 1 1 1 1 0 1 1 |

Those glyphs are garbage — 11, 12 and 15 all draw a 9 — and that is exactly the bargain a don't-care
makes. The savings are free *precisely because* nothing was promised about those inputs. A
commercial part either blanks the display on invalid codes or shows fixed symbols for them, and
either choice costs gates.

### Common cathode and common anode

Each segment is an **LED**, and the seven LEDs of a digit share one terminal. How they share it
decides what "on" means:

- A **common-cathode** display ties all seven cathodes to ground. A segment lights when its driver
  outputs a **1**. The truth table and equations above are written for this case — **active-high**.
- A **common-anode** display ties all seven anodes to the supply. A segment lights when its driver
  pulls it to **0**, so every output must be **complemented** — **active-low**.

The **Basys 3** boards used in the lab are wired **common anode**. On those boards an 8, with every
segment lit, is driven as all zeros: `0000000`. The glyphs do not change; only the drive levels
flip. Whichever kind of display you have, check its datasheet before wiring, because a polarity
mistake shows up as a display that lights exactly the segments you meant to leave dark.

One electrical fact belongs here too: each segment is an LED and **needs a current-limiting
resistor**. This is the point where digital logic meets a real load.

### Sharing groups across segments

Treating the seven segments independently is simple and is how we have done it here. A smaller
circuit is possible with **multiple-output minimization**, which looks for product terms that can be
shared between segments. $C\bar{D}$, for instance, appears in the equations for d, e and g, and one
AND gate could feed all three OR gates. Finding the best shared set is a harder problem than
minimizing each map alone, but it can save a good deal of hardware.

## Beat 3: Applications

**Numeric displays.** Clocks, meters, instrument panels, scales, appliance front panels — anything
that shows digits with bars rather than pixels relies on BCD-to-seven-segment conversion somewhere.

**Multi-digit displays.** A four-digit display does not need four decoders. One decoder drives the
segment lines of every digit in parallel, and a **decoder** on the digit-select lines (see
**Decoders**) enables one digit at a time. Cycle through the digits fast enough and persistence of
vision shows all four at once. The Basys 3's four-digit display is wired exactly this way.

**Catalog parts.** The **7447** (active-low, for common-anode displays) and **7448** (active-high,
for common-cathode displays) are the classic single-chip BCD-to-seven-segment decoders. They are
worth recognizing by number in lab kits and datasheets.

**What modern practice actually does.** Nobody hand-minimizes seven K-maps in industry. The pattern
table is written directly — as a lookup table or, as in the next beat, a `case` statement — and
synthesis tools do the reduction. The minimization is still worth doing by hand once, because it is
the clearest multi-output design exercise there is; it is just not how the job is done day to day.

## Beat 4: A BCD-to-Seven-Segment Decoder in Verilog

In Verilog the natural description is **functional**: a `case` statement that maps each input code
to the bit pattern for the segments. It is the truth table, transcribed.

```verilog
module bcd7seg (input [3:0] bcd, output reg [6:0] seg);   // seg = {a,b,c,d,e,f,g}
  always @(*) begin
    case (bcd)
      4'd0: seg = 7'b1111110;
      4'd1: seg = 7'b0110000;
      4'd2: seg = 7'b1101101;
      4'd3: seg = 7'b1111001;
      4'd4: seg = 7'b0110011;
      4'd5: seg = 7'b1011011;
      4'd6: seg = 7'b1011111;
      4'd7: seg = 7'b1110000;
      4'd8: seg = 7'b1111111;
      4'd9: seg = 7'b1111011;
      default: seg = 7'b0000000;   // blank the display on codes 10-15
    endcase
  end
endmodule
```

Three details carry most of the weight.

**The bit order has to be stated.** The comment `seg = {a,b,c,d,e,f,g}` is not decoration. Without
it, `7'b1111110` is unreadable, and packing the segments in the opposite order is a silent bug: every
digit comes out as a different, wrong glyph.

**The `default` branch prevents a latch.** A 4-bit input has sixteen values and the `case` lists
ten. Without `default`, `seg` would have no assigned value for codes 10–15, and synthesis would infer
a latch to hold the old value — the same trap as in **Decoders**.

**`default` is not a don't-care.** This is the most useful line in the whole topic. Beat 2's
equations treated codes 10–15 as don't-cares and let them light garbage glyphs; this module
*chooses* to blank them. Those are two different circuits. Simulating the module next to the
minimized equation for segment e, $e = C\bar{D} + \bar{B}\bar{D}$, shows exactly where they part:

```
bcd=1001  seg(abcdefg)=1111011  e=0  e_eq=0
bcd=1010  seg(abcdefg)=0000000  e=0  e_eq=1
bcd=1110  seg(abcdefg)=0000000  e=0  e_eq=1
```

On every valid digit the two agree. On codes 10 and 14 the equation lights segment e and the `case`
does not. Writing "don't care" on a K-map means *I have no opinion here*; writing `default:` in
Verilog is an opinion.

For a common-anode display like the Basys 3's, complement the whole output on the way out:

```verilog
assign seg_n = ~seg;   // active-low segment drive for a common-anode display
```

## Key Takeaways

A BCD-to-seven-segment decoder converts a 4-bit binary-coded decimal digit into the seven signals
that light segments a through g, where a is the top bar, b through f run clockwise, and g is the
middle. Its truth table has four inputs and seven outputs, so the design is seven separate
minimizations sharing one set of inputs. Because BCD uses only the codes 0–9, the six codes 10–15
are don't-cares in every segment's map, and claiming them makes the groups larger and the equations
smaller — segment e drops from six literals to four. The price is that invalid codes light whatever
the minimization happened to choose. Common-cathode displays want active-high drivers; common-anode
displays such as the Basys 3's want every output complemented. In Verilog the block is a `case`
statement with one 7-bit pattern per digit, and its `default` branch both prevents a latch and makes
a real decision about invalid codes that a K-map's don't-cares never make.

## Review Questions

**1. Which segments are lit when the decoder displays the digit 4?**

A. a, b, c, d\
B. b, c, f, g\
C. a, c, d, f, g\
D. b, c, e, g

**2. Why are the input codes 1010 through 1111 treated as don't-cares for every segment?**

A. They light all seven segments, so their outputs are already known\
B. They are reserved for the hexadecimal digits A through F\
C. A BCD input only ever carries the codes 0 through 9, so those six codes never occur\
D. They would require a fifth input bit to represent

**3. A Basys 3 board uses common-anode displays. What 7-bit pattern, in the order $\{a,b,c,d,e,f,g\}$, must the decoder drive to show the digit 1?**

A. `0110000`\
B. `1111110`\
C. `0000001`\
D. `1001111`

**4. Segment e is lit for the digits 0, 2, 6 and 8. With the codes 10–15 used as don't-cares it minimizes to $C\bar{D} + \bar{B}\bar{D}$. What happens if the don't-cares are instead forced to 0?**

A. The expression becomes $\bar{A}C\bar{D} + \bar{B}\bar{C}\bar{D}$, which needs six literals instead of four\
B. The expression is unchanged, because none of the don't-cares were used\
C. The expression grows to four terms, one for each lit digit\
D. Segment e can no longer be written as a sum of products

**5. A Verilog `case` with `default: seg = 7'b0000000;` and a gate-level circuit built from the minimized equations both display 0 through 9 correctly. Which statement is true of the input code 1110?**

A. Both circuits blank the display, because 1110 is not a BCD digit\
B. The `case` blanks the display, while the minimized circuit lights whatever pattern its don't-care groups produce\
C. Both circuits light the same garbage glyph, because they implement the same truth table\
D. The minimized circuit blanks the display, while the `case` infers a latch

**6. Why does segment c minimize to just three single-literal terms, $c = D + \bar{C} + B$, while segment d needs five?**

A. Segment c is lit for every digit except 2, so its 1s form very large groups\
B. Segment c has no don't-cares, so its map is simpler\
C. Segment c is only lit for the digits 1 and 7\
D. Segment d is on the common anode, so it needs more gates

## Answer Explanations

**1. B.** A 4 is drawn with the upper-left bar (f), the middle bar (g), and both right-hand bars (b
and c): **b, c, f, g**. Option A traces most of the outside of a 0; option C is the set for a 5;
option D swaps the upper-left bar f for the lower-left bar e.

**2. C.** Binary-coded decimal encodes one decimal digit, 0 through 9, so the codes 10 through 15
can never appear on the input. Nothing is promised about them, which makes them don't-cares. Option B
describes the hex version of the decoder, which is a different design with no don't-cares; options A
and D are not true of those codes.

**3. D.** A 1 lights only b and c, so the common-cathode (active-high) pattern is `0110000`. A
common-anode display lights a segment on a 0, so every bit is complemented: `1001111`. Option A is the
active-high pattern — correct for a common-cathode display, wrong for the Basys 3. Option B is the
pattern for a 0, and option C is its complement.

**4. A.** Without the don't-cares, the $CD = 10$ column loses cells 14 and 10 and shrinks to the pair
of cells 2 and 6 → $\bar{A}C\bar{D}$, and the four corners lose cell 10 and shrink to the pair of cells 0 and 8 →
$\bar{B}\bar{C}\bar{D}$. Both terms survive but each grows by one literal, for six in total instead
of four. Option B is wrong because both groups did use don't-cares; option C ignores that pairs can
still combine cells.

**5. B.** Writing `default:` is a decision to blank invalid codes. The don't-care minimization made no
such decision; on 1110 its equations light a, c, d, e, f and g (segment e, for one, comes out 1).
Option C would be true only if a don't-care and a `default` meant the same thing, which is exactly the
misconception this question targets. Option D is backwards: the `default` branch is what *prevents*
the latch.

**6. A.** Segment c is dark only for the digit 2. With nine 1s among the ten valid rows plus six
don't-cares, its map is almost entirely 1s and ×s, so the groups are as large as they can be —
each covers half the map and needs just one literal. Option B is false: every segment shares the
same six don't-cares. Option C describes a segment that is lit for very few digits, which is the
opposite situation.
