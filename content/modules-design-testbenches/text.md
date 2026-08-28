## Modules, Design, and Testbenches

The first days of Verilog can feel like a lot arriving at once: the lab workflow, accepting assignments, the Vivado tools, and a language that looks like programming but isn't. Before any more syntax, it is worth slowing down on one structural idea that shapes everything that follows — the **separation between the design and the testbench**. The hello-world topic showed this pair for a single XOR gate. This topic develops it with a more realistic piece of hardware, a **counter**, and uses it to answer the questions the XOR example was too small to raise: what a module's boundary really is, why some signals appear in both files, and what it means for the testbench to *run* a clock.

## Hardware Has No Print Statement

Verilog is not regular programming, because you are describing hardware. In a program, the natural way to find out what is going on is to print a value or stop in a debugger and look at a variable. A circuit has neither. A module has no screen, no console, and no way to volunteer what it is doing. The only thing a piece of hardware can do is respond to its inputs by changing its outputs.

That single fact forces the two-file structure. If the only way to learn what a circuit does is to drive its inputs and watch its outputs, then something *other than the circuit* has to do the driving and the watching. That something is the testbench. Every Verilog project in this course, and every lab you submit, is therefore a pair:

- The **design** describes the hardware — a module, its input and output signals, and how they connect. It does not run, print, or explain itself. It is the circuit, written down.
- The **testbench** is a program that exercises that hardware — it sets the inputs, steps them through the conditions that make the circuit do something, and reports what the outputs did.

Everything you will ever see printed comes from the testbench. The design never says a word.

## A Design Is a Block Diagram

The most useful way to think about a design is as a **block diagram**: a box with named signals entering and leaving. Our example is a 4-bit counter. As a box, it has three inputs and two outputs.

| Signal | Direction | What it does |
|---|---|---|
| `clk` | input | The system clock. The counter advances once per tick. |
| `reset` | input | While 1, forces the count back to 0. |
| `enable` | input | While 1, lets the count advance; while 0, freezes it. |
| `count` | output | The current count, 0 to 15. |
| `overflow` | output | 1 when the count is 15 — one more enabled tick will wrap it to 0. |

Two of these signals are new compared with the XOR gate. `count` is not a single bit but a **4-bit bus**, four wires carrying one number. And `clk` is a **clock**: a signal that alternates 0, 1, 0, 1, forever, at a steady rate. A counter is the first circuit we have met that has a *memory* — it has to remember its current count to produce the next one — and circuits with memory need a clock to tell them when to move. The details of how memory and clocks work inside a circuit come later in the course. For this topic, the block diagram is enough: a counter is a box that advances its count on every tick of `clk`, as long as `enable` is 1 and `reset` is 0.

Notice what the block diagram did and did not say. It named every signal, gave each a direction, and stated what the box does. It said nothing about what is inside. That is exactly what a module's **port list** does in Verilog, and it is why the port list is the part of a design to read first.

## The Design File

Here is the complete design:

```verilog
// counter.v — the hardware we are describing
module counter (
  input  wire       clk,       // system clock: the counter advances on each rising edge
  input  wire       reset,     // 1 forces the count back to 0
  input  wire       enable,    // 1 lets the count advance; 0 freezes it
  output reg  [3:0] count,     // the current count, 0 to 15
  output wire       overflow   // 1 when the count is 15 — the next enabled tick wraps to 0
);

  assign overflow = (count == 4'd15);

  always @(posedge clk) begin      // "every time the clock ticks up, do this"
    if (reset)
      count <= 4'd0;
    else if (enable)
      count <= count + 4'd1;
  end

endmodule
```

Read the port list against the table above. It is the block diagram, line for line: each signal, its direction, and — new here — its **width**. The notation `[3:0]` declares `count` as four bits, numbered 3 down to 0, so the module can hold any value from 0 to 15. Signals with no width are one bit, as before. The keyword `reg` on `count` is a hint that this output is *remembered* between clock ticks rather than computed fresh from the inputs; the full story of `reg` versus `wire` inside a design comes later, and you do not need it to read this file.

The body has two statements, and they are of two different kinds.

The `assign` line is the kind you already know from the XOR gate: a permanent piece of wiring. `overflow` *is* the comparison "count equals 15," continuously, for as long as the circuit exists. The constant `4'd15` is Verilog's way of writing a 4-bit number in decimal — the width, an apostrophe, `d` for decimal, then the value. Number formats get their own topic later.

The `always @(posedge clk)` block is new, and it is where the counter's memory lives. Read it in plain language: *every time the clock has a rising edge — a 0-to-1 transition — do the following.* If `reset` is 1, set the count to 0. Otherwise, if `enable` is 1, add one to the count. Otherwise do nothing, so the count holds. The arrow `<=` is the assignment used inside clocked blocks; treat it as "becomes, at this tick." You will study `always` blocks, clock edges, and the two kinds of assignment properly when the course reaches sequential circuits. The point of showing the body now is to make one thing concrete: everything a counter *does* is written inside this box, and none of it is visible from outside except through the five ports.

That last sentence is the definition of a module. A **module** is a named block of hardware whose port list is its entire boundary. Nothing outside the module can reach in and read `count` mid-calculation or nudge the clock; nothing inside can see the outside world except through `clk`, `reset`, and `enable`. It is the same rule as the pins on a physical chip, and it is the rule that lets large designs be built from modules the way boards are built from chips.

## The Testbench Drives the Signals

The design declares that a clock arrives on `clk`. It says nothing about where that clock comes from, and in simulation nothing exists to produce one — unless the testbench does. The same goes for `reset` and `enable`: the design says what it will do when they change, and the testbench is what changes them. Here is a testbench that walks the counter through a full cycle:

```verilog
// counter_tb.v — the program that exercises the hardware
module counter_tb;

  reg        clk;              // testbench drives these three
  reg        reset;
  reg        enable;
  wire [3:0] count;            // testbench watches these two
  wire       overflow;

  // instantiate the design under test
  counter dut (.clk(clk), .reset(reset), .enable(enable),
               .count(count), .overflow(overflow));

  // the clock: start at 0, then flip every 5 time units, forever (a 10-unit period)
  initial clk = 0;
  always #5 clk = ~clk;

  initial begin
    $display("time  reset enable | count overflow");
    $monitor("%4t    %b     %b    |  %2d      %b", $time, reset, enable, count, overflow);

    reset = 1; enable = 0;     // hold the counter in reset
    #12 reset = 0;             // release it
    #10 enable = 1;            // let it count
    #160 enable = 0;           // sixteen ticks later, freeze it
    #20 $finish;
  end

endmodule
```

The skeleton is the one from hello world, and it is worth confirming that every piece is still there before looking at what is new. The testbench module has no ports, because nothing sits above it. It declares `reg` for the three signals it will drive and `wire` for the two it will only watch — the same widths as the design's ports, so `count` is `wire [3:0]`. One instantiation line builds a copy of the counter, named `dut`, and connects each of the bench's signals to the design's port of the same name. And an `initial` block is the script that runs once, top to bottom.

What is new is the clock, and it is the most important line in the file:

```verilog
initial clk = 0;
always #5 clk = ~clk;
```

The first line starts the clock at 0. The second is an `always` block with no `@(...)` condition: it runs forever, and each time through it waits 5 time units and then flips `clk` to its opposite (`~` is NOT). The result is a square wave — 0 for 5 units, 1 for 5 units, over and over — with a rising edge every 10 units for the whole simulation. That is what it means for the testbench to *run* the clock. The design's `always @(posedge clk)` block is waiting for rising edges; this two-line generator is what supplies them. Without it, no edge ever arrives, the counter never advances, and the simulation shows nothing at all.

The script then manages `reset` and `enable` in the order a real power-up would. It holds `reset` high while the first clock edge goes by, so the counter starts from a known 0 rather than from whatever the simulator happened to have. It releases `reset`, waits, and raises `enable`. It leaves `enable` high for 160 time units — sixteen rising edges, enough to count from 0 all the way to 15 and past it — then drops `enable`, waits two more ticks to show the count holding, and calls `$finish`.

One more new item: `$monitor`. Where `$display` prints once when it is executed, `$monitor` prints its line *every time any of its listed signals changes*, for the rest of the simulation. Setting it up once at the top means the bench automatically logs each event — every reset, every enable change, every tick of the count — without a `$display` after each step. Both are simulator commands, not hardware; they are further evidence that a testbench is a program.

## One Signal, Two Roles

Step back and look at `clk` across the two files. In `counter.v` it is declared as an input: the design says "a clock arrives here" and describes what to do on each edge. In `counter_tb.v` it is declared as a `reg`, started at 0, and toggled forever by an `always` block: the bench actually *generates* it. Same name, same wire in simulation, two entirely different roles.

Every input works this way, and the table makes the split explicit:

| Signal | In the design (`counter.v`) | In the testbench (`counter_tb.v`) |
|---|---|---|
| `clk` | Declared as an input; the `always` block reacts to its rising edges | A `reg`, generated by `always #5 clk = ~clk` |
| `reset` | Declared as an input; when 1, forces `count` to 0 | A `reg`, held at 1 through the first tick and then released by the script |
| `enable` | Declared as an input; when 1, lets `count` advance | A `reg`, raised and later lowered by the script |
| `count` | Computed and remembered inside the module; declared as an output | A `wire` the bench watches and prints; it never assigns to it |
| `overflow` | Computed by the `assign`; declared as an output | A `wire` the bench watches and prints |

Rows one through three are the rule to remember: the design *declares and uses* an input; the testbench *generates and controls* it. Rows four and five are the mirror image: the design *produces* an output; the testbench can only *observe* it. If you ever find yourself unsure which file a piece of code belongs in, ask which side of that line it is on. Code that decides what a signal should be, moment by moment, in order to test the circuit, belongs in the bench. Code that describes what the circuit does with a signal belongs in the design.

## Running It

Compile both files and run the simulation. The `$monitor` line prints every change:

```text
time  reset enable | count overflow
   0    1     0    |   x      x
   5    1     0    |   0      0
  12    0     0    |   0      0
  22    0     1    |   0      0
  25    0     1    |   1      0
  35    0     1    |   2      0
  45    0     1    |   3      0
  ...
 155    0     1    |  14      0
 165    0     1    |  15      1
 175    0     1    |   0      0
 182    0     0    |   0      0
```

Read it as a story, because that is what a testbench log is. At time 0 the count is `x` — Verilog's *unknown* value. Nothing has told the counter what to hold yet, and the simulator refuses to pretend; a circuit's memory is not zero until something makes it zero. At time 5 the first rising edge arrives while `reset` is 1, and the count becomes 0 — this is what the reset was for. At 12 the bench releases reset; at 22 it raises enable; and from the very next edge at 25 the count climbs by one every 10 time units, exactly the clock period. At 165 the count reaches 15 and `overflow` goes to 1 — the `assign` line doing its job continuously, with no tick needed. At 175 the next edge wraps the count to 0, because a 4-bit number cannot hold 16. At 182 the bench drops enable, and the count holds through the remaining ticks.

Every one of those events was caused by the testbench and computed by the design. The bench never assigned to `count`; it only set up conditions and watched. And the standard is the one from hello world: you knew before running what a counter must do — reset to 0, climb by one per tick, wrap at 16, freeze when disabled — so the log is judged against that expectation. It matches, so the design works. If it hadn't, the time column would say exactly where to look.

## Design and RTL

You will hear the word **RTL** used where this topic says **design**, and in Vivado you will see both "design sources" and "RTL" for the same files. RTL stands for **register transfer level**. It names the level of abstraction at which designs in this course are written: circuits described as registers — places where values are remembered, like the counter's `count` — and the logic that transfers values between them on each clock tick. The counter above is RTL: one register, one piece of logic that computes the next value, and a clock that moves it. Treat "design," "RTL," and "design sources" as the same thing, and treat "testbench," "simulation sources," and "the bench" as the other.

## Key Takeaways

A Verilog project is a pair: a **design** that describes hardware and a **testbench** that exercises it, because hardware has no print statement and can only be understood by driving its inputs and watching its outputs. A **module** is a named block of hardware whose **port list** is its entire boundary — a block diagram written down, with each signal's direction and width — and everything the module does is hidden inside it. Every input signal has two roles: the design *declares and uses* it, the testbench *generates and controls* it; every output is *produced* by the design and only *observed* by the bench. A clocked design does nothing until the testbench runs its clock, which takes two lines: an `initial` to start it and an `always #N` to flip it forever. The testbench log is read as a story and judged against what you already knew the circuit must do. **RTL** — register transfer level — is another name for the design.

## Review Questions

### Question 1

Why does every Verilog project come as a design file plus a testbench file?

A. The simulator requires exactly two files to run\
B. Hardware cannot print or report on itself, so something else must drive its inputs and watch its outputs\
C. The design holds the inputs and the testbench holds the outputs\
D. Testbenches are only needed for designs with a clock

### Question 2

A module's port list is best described as which of the following?

A. The list of every signal used anywhere inside the module\
B. A block diagram of the module written down: each external signal with its direction and width\
C. The order in which the module's statements execute\
D. A list of the other modules this one depends on

### Question 3

The counter's `clk` signal appears in both `counter.v` and `counter_tb.v`. What is its role in each?

A. Generated by the design; declared as a `wire` in the testbench\
B. Declared as an input the design reacts to; generated and toggled by the testbench\
C. Declared in both files; generated by the simulator automatically\
D. It appears only in the testbench — designs have no clock

### Question 4

What do these two testbench lines accomplish?

```verilog
initial clk = 0;
always #5 clk = ~clk;
```

A. They set the clock to 0 and then to 1, once each\
B. They wait 5 time units and then stop the simulation\
C. They produce a square wave that flips every 5 time units for the whole simulation — a rising edge every 10 units\
D. They declare that the design's clock input is 5 bits wide

### Question 5

In the simulation log, `count` is `x` at time 0 and becomes 0 at time 5. What does this show?

A. The simulator failed to compile the design\
B. The counter's memory holds no defined value until the first clock edge under reset makes it 0\
C. The testbench forgot to declare `count` as a `wire`\
D. `x` means the count is 10 in hexadecimal

### Question 6

Which statement about the testbench's relationship to the output `count` is correct?

A. The testbench assigns `count` its next value on each tick\
B. The testbench declares `count` as a `reg` so it can be changed\
C. The testbench only watches `count`; every value it takes was computed by the design\
D. The testbench resets `count` directly by writing 0 to it

### Question 7

What does RTL stand for, and how does it relate to the word "design"?

A. Run-Time Library — the testbench's collection of `$display` and `$monitor` commands\
B. Register Transfer Level — the abstraction the design is written at; the two words are used interchangeably\
C. Reset-Then-Load — the power-up sequence the testbench performs\
D. Real-Time Logic — the design after it is loaded onto an FPGA

## Answer Explanations

**1. B.** A circuit can only respond to its inputs by changing its outputs; it has no way to volunteer what it is doing. Driving inputs and watching outputs therefore has to be done by something outside the circuit — the testbench. Every project is the pair for that reason, clock or no clock.

**2. B.** The port list names each signal that crosses the module's boundary, with its direction (`input`/`output`) and width (`[3:0]` for a 4-bit bus). It is the block diagram in text form and says nothing about the internals — which is exactly the point of a module.

**3. B.** In the design, `clk` is an input and the `always @(posedge clk)` block reacts to its rising edges. In the testbench, `clk` is a `reg` started at 0 and flipped forever by `always #5 clk = ~clk`. Same signal, two roles: declared and used in the design, generated and controlled in the bench.

**4. C.** The `initial` gives the clock a starting value; the `always` block with no `@` condition runs forever, waiting 5 units and inverting `clk` each time. The result is a square wave with a 10-unit period, and every rising edge is one tick the design can respond to.

**5. B.** `x` is Verilog's unknown value. A register holds nothing meaningful until something sets it, and the simulator shows that honestly. The first rising edge arrives at time 5 while `reset` is 1, and the design's `always` block sets `count` to 0 — this is what a reset is for.

**6. C.** `count` is a `wire` in the bench and is connected to the design's output port. The bench never assigns to it; the design computes every value it shows. The bench's only influence on `count` is indirect, through the inputs it drives.

**7. B.** RTL is register transfer level: circuits described as registers plus the logic that moves values between them on each clock tick — the level at which this course's designs are written. Vivado uses "design sources" and "RTL" for the same files.
