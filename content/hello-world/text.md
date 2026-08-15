## Verilog: Hello World

Every programming language has its "hello world" — the smallest program that proves your tools work and shows you the shape of things to come. Verilog's version is different in a telling way: hardware has no screen to print to, so the hello world of digital design is not a message. It is a *pair* of files — a small piece of hardware, and a small program that proves the hardware works. This topic walks through both, using the simplest interesting circuit we know: an XOR gate.

Keep the interactive above alongside this text. It shows the two files exactly the way you will see them in the lab tools: the testbench on the left, the design on the right.

## Two Files, Two Jobs

The pattern at the heart of every Verilog project — and every lab in this course — is a division of labor between two files:

- **The design** (often called the *RTL*) describes a piece of hardware: what its connections are and what logic lives inside. It does not run, print, or explain itself. It just *is* the circuit, written down.
- **The testbench** is a program that exercises that hardware: it wiggles the inputs, watches the outputs, and reports what it saw.

The two files meet in simulation. A simulator such as Icarus Verilog (or the ones behind EDA Playground) compiles both, builds the circuit the design describes, and then runs the testbench's script against it. Everything you will ever see printed comes from the testbench — the design never says a word.

## The Design: an XOR Gate

Here is the complete design file:

```verilog
// design.v — the hardware we are describing
module xor_gate (
  input  wire a,     // first input
  input  wire b,     // second input
  output wire y      // output: 1 when a and b differ
);

  assign y = a ^ b;  // ^ is Verilog's XOR operator

endmodule
```

Three ideas, and they carry the whole file.

**A module is a named block of hardware.** Everything between `module` and `endmodule` is one component, and the name — `xor_gate` — is how other files refer to it. Think of it as the outline of a chip drawn around some circuitry. In Verilog, *every* circuit element becomes a module — and later in the course, sophisticated designs are built exactly this way: by connecting modules to modules, the same move the testbench below makes once.

**Ports are the boundary.** The parenthesized list declares the module's only connections to the outside world: two inputs, `a` and `b`, and one output, `y`, each a `wire` carrying a single bit. Nothing outside the module can see anything *except* these ports — exactly like the pins on a physical chip.

**`assign` is a connection, not a command.** The line `assign y = a ^ b;` does not "execute" once, the way a line in a software program does. It declares a permanent piece of wiring: from now until forever, `y` *is* `a XOR b`. Change an input, and the output follows — continuously, the way real gates behave. This is the single biggest mental shift from software: you are not writing steps; you are describing structure.

## The Testbench

Now the second file:

```verilog
// testbench.v — the program that exercises the hardware
module xor_gate_tb;

  reg  a, b;         // testbench drives these
  wire y;            // testbench watches this

  // instantiate the design under test
  xor_gate dut (.a(a), .b(b), .y(y));

  initial begin
    $display("a b | y");
    $display("----+--");
    a = 0; b = 0; #10 $display("%b %b | %b", a, b, y);
    a = 0; b = 1; #10 $display("%b %b | %b", a, b, y);
    a = 1; b = 0; #10 $display("%b %b | %b", a, b, y);
    a = 1; b = 1; #10 $display("%b %b | %b", a, b, y);
    $finish;
  end

endmodule
```

Read it top to bottom and notice what is different from the design.

**The testbench has no ports.** Its `module` line ends with a bare semicolon — no parenthesized list. That is because nothing sits above a testbench: it is the outermost box, standing in for *you* at the lab bench. All of its signals are internal.

**`reg` for what you drive, `wire` for what you watch.** The bench declares `a` and `b` as `reg` because its script will set their values, and `y` as a `wire` because the bench only observes it — the design drives it. (The full story of `reg` versus `wire` comes later in the Verilog chapter; for now, this driven-versus-watched rule of thumb is all you need.)

**One line builds the hardware.** The instantiation `xor_gate dut (.a(a), .b(b), .y(y));` creates one copy of the design — conventionally named `dut`, for *device under test* — and wires the bench's signals to its ports by name. The notation `.a(a)` reads as "the module's port `a` connects to my signal `a`." The names happen to match here, which is common and convenient, but the dot-name on the left always refers to the *design's* port.

**The `initial` block is a script.** Unlike `assign`, an `initial` block is sequential: it runs once, top to bottom, when simulation starts. Ours sets each input combination in turn, waits ten time units (`#10`) so the values settle, prints one line with `$display`, and moves to the next case. After the fourth case, `$finish` ends the simulation. `$display` and `$finish` are simulator commands, not hardware — one more sign that a testbench is a program, not a circuit.

## Running It

Compile both files and run the simulation, and the console shows:

```text
a b | y
----+--
0 0 | 0
0 1 | 1
1 0 | 1
1 1 | 0
```

Look at what those four lines are: the XOR truth table, produced by the actual circuit description rather than copied from a textbook. The design computed every `y`; the bench set up every case and did all the printing. That output is the moment "hello world" happens in hardware — not a greeting, but *evidence*.

And that is the standard you should hold every run to: you knew before simulating what XOR must do, so the run is judged against the truth table. Output matches the table — the design works. Output differs — something is wrong, and the printout tells you exactly which input combination to go stare at.

## Why Testbenches

It is tempting, early on, to treat the testbench as ceremony — the design is three lines, so why write twenty more to check it? Three reasons, and they only grow stronger as designs grow:

First, **hardware cannot be asked directly.** In Python you would print a value or step through the code in a debugger, watching variables change. A Verilog design has neither — you are not watching variables, you are watching *circuits*, and a module has no print statement and no way to volunteer its own correctness. The only way to know what a design does is to drive its inputs and watch its outputs — and that is precisely what a testbench automates. No bench, no evidence.

Second, **the bench encodes your expectations.** Writing the stimulus forces you to decide what the design *should* do for each case before you see what it *does*. For the XOR gate that expectation is a four-row truth table; for later designs it will be longer tables, timing behavior, and sequences of states. The habit starts here.

Third, **the pattern scales.** Every design in this course — every gate, adder, multiplexer, and state machine, and every lab you submit — ships as this same pair: a module that describes, and a bench that exercises. The bench you just read is the seed of every bench you will write; later ones add loops, self-checking, and waveforms, but the skeleton never changes.

## Key Takeaways

Verilog work comes in pairs: a design file that *describes* hardware and a testbench that *exercises* it. A module is a named block whose ports are its only boundary; `assign` declares a continuous connection, not a step in a program. The testbench has no ports, declares `reg` for signals it drives and `wire` for signals it watches, instantiates the design as a device under test with port-by-name connections, and uses an `initial` script with `$display` to walk the input cases and print results. The simulation output is compared against the truth table you already trusted — the testbench is how a design gets interrogated, and this two-file skeleton carries through every design in the course.

## Review Questions

### Question 1

What does the `module ... endmodule` pair define in a Verilog design file?

A. A function that runs once when the simulation starts
B. A named block of hardware with a boundary of ports
C. A loop that repeats for every input combination
D. A comment block ignored by the simulator

### Question 2

The testbench's `module xor_gate_tb;` line has no port list. Why?

A. Testbenches are not allowed to contain signals
B. The port list is optional for all modules
C. Nothing sits above the testbench — it is the outermost box, so it has no external connections
D. Ports are only used by sequential circuits

### Question 3

In the testbench, `a` and `b` are declared `reg` while `y` is a `wire`. What is the working rule of thumb?

A. `reg` for signals the bench drives; `wire` for signals it only watches
B. `reg` for inputs of any module; `wire` for outputs of any module
C. `reg` for one-bit signals; `wire` for multi-bit signals
D. The two keywords are interchangeable in a testbench

### Question 4

What does the line `xor_gate dut (.a(a), .b(b), .y(y));` do?

A. Runs the design once and stores its output
B. Builds one copy of the design and connects the bench's signals to its ports by name
C. Declares three new wires named a, b, and y
D. Compares the design's output against the truth table

### Question 5

How does `assign y = a ^ b;` differ from an assignment statement in a software program?

A. It runs faster because hardware is parallel
B. It executes exactly once, when the simulation starts
C. It declares a permanent connection — y follows a ^ b continuously, like real wiring
D. It only takes effect when the testbench calls it

### Question 6

The simulation prints the XOR truth table. Which file did the printing, and why does that matter?

A. The design — modules print their outputs automatically
B. The simulator — it prints every signal by default
C. The testbench — the design has no way to print or report; the bench is the only source of evidence about its behavior
D. Both files print alternate lines

## Answer Explanations

**1. B.** A module is a named block of hardware; its port list is the boundary through which the outside world connects. It isn't executed like a function — it *is* the circuit.

**2. C.** The testbench is the top of the hierarchy, standing in for the person at the lab bench. With nothing above it, it has no external connections, so all of its signals are internal.

**3. A.** The bench's script sets `a` and `b`, so they are `reg`; the design drives `y`, and the bench only observes it, so it is a `wire`. The deeper story of the two keywords comes later — the driven/watched rule covers testbench use.

**4. B.** The instantiation creates the device under test and wires bench signals to the module's ports; `.a(a)` means "the module's port `a` gets my signal `a`." No running or comparing happens on that line.

**5. C.** `assign` describes structure, not steps: the output follows the inputs continuously, exactly as a physical gate would. This describe-not-execute shift is the core difference between Verilog and software.

**6. C.** Every printed line came from the testbench's `$display` calls. Hardware has no print statement — which is exactly why a testbench must exist: it is the only way a design's behavior becomes visible evidence.
