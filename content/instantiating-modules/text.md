# Instantiating Modules

The hello-world topic ended with a single module and its testbench. This topic takes the next step — the one that makes Verilog scale to real designs: **instantiation**, placing copies of a finished module inside a bigger one. Along the way it reinforces the mindset from the HDL introduction: *modules are circuits*. A module isn't a function or a subroutine; it's the description of a physical part, and instantiating it stamps another copy of that part onto the board.

## The Part: a Half Adder

Our building block is a **half adder** — later in the course we'll study what a half adder is *for*; for now, just treat it as a circuit. And it is literally a circuit: an XOR gate and an AND gate, with inputs `a` and `b` and outputs `sum` and `carry`.

```verilog
// half_adder.v — the building block we will instantiate (twice!)
module half_adder (
    input  wire a,
    input  wire b,
    output wire sum,
    output wire carry
);

    assign sum   = a ^ b;   // XOR: 1 when the inputs differ
    assign carry = a & b;   // AND: 1 only when both inputs are 1

endmodule
```

You already know how to read every line of this: the port list defines the part's pins — two inputs, two outputs — and the two `assign` statements describe the logic inside. That's the whole part, completely described. Think of the file as adding a new part *type* to your parts bin: it defines the part but doesn't build anything by itself. One description — and a design can place as many copies as it likes.

## The Bigger Circuit: a Full Adder from Two Half Adders

The larger circuit we'll build is a **full adder**: three inputs (`a`, `b`, and a carry-in `cin`), two outputs (`sum` and a carry-out `cout`). Its schematic contains the half adder *twice* — and here an important shift happens in how we draw and think. Inside each half-adder box the XOR and AND still exist, but **the box is closed**: we no longer look inside. The internals are part of the module's description; the ports are the only surface the outer design can see or touch. The schematic shows two closed boxes, some internal wiring between them, and one OR gate.

Writing the Verilog for this is a four-step recipe.

**Step 1 — define the outer module's ports.** Read them straight off the schematic's external pins: inputs `a`, `b`, `cin`; outputs `sum`, `cout`.

**Step 2 — declare the internal wires.** The schematic needs three wires to connect everything: the first half adder's sum has to reach the second one, and the two carries have to reach the OR gate. These are `wire s1, c1, c2;` — internal wiring that exists only *inside* the full adder. From outside, no one can see them; the ports are all anyone gets.

**Step 3 — instantiate the module, with an instance name.** To place a copy you write the module name, then a name for *this particular copy*:

```verilog
half_adder ha0 ( ... );
half_adder ha1 ( ... );
```

`half_adder` says which part to place — which blueprint. `ha0` and `ha1` name the individual copies. The instance name is required because the design contains more than one copy of the same circuit, and the hardware description has to be able to say *which one* it means — the same way a schematic labels two identical resistors R1 and R2.

**Step 4 — connect the pins by name.** Each connection is written `.pin(wire)`: the port name on the inner module, then, in parentheses, the signal in *this* module that attaches to it. Walking `ha0`'s hookups the way the interactive does when you click them:

- `.a(a)` — the copy's pin `a` connects to the full adder's own input `a`. (Same name on both sides here — that's allowed and common, but it's still two different things: a pin on the part, and a wire in the design.)
- `.b(b)` — likewise for `b`.
- `.sum(s1)` — now it gets more interesting: `ha0`'s **output** `sum` drives the internal wire `s1`.
- `.carry(c1)` — and its carry drives wire `c1`.

Every input and every output of the copy is now attached, which *totally instantiates* `ha0`. The same recipe places `ha1`, and its hookups are where the composition pays off: `.a(s1)` — the second half adder's input is fed by wire `s1`, so **ha0's sum becomes ha1's input** — then `.b(cin)`, `.sum(sum)` (this copy's sum *is* the full adder's own output), and `.carry(c2)`.

Because the hookups are **by name**, their order inside the parentheses never matters — `.b(b), .a(a)` would place the identical circuit. The name is the connection.

## Glue Logic Mixes Freely

The schematic has one piece that isn't an instance: the OR gate combining the two carries. Plain logic and instances mix freely inside a module — the OR is just an assign, where the vertical bar `|` is Verilog's OR:

```verilog
assign cout = c1 | c2;
```

Putting all four steps together, here is the complete module:

```verilog
// full_adder.v — connecting modules with NAMED port mapping
module full_adder (
    input  wire a,
    input  wire b,
    input  wire cin,
    output wire sum,
    output wire cout
);

    // Internal wires — the "solder" between the parts (invisible from outside)
    wire s1, c1, c2;

    half_adder ha0 (.a(a),  .b(b),   .sum(s1),  .carry(c1));
    half_adder ha1 (.a(s1), .b(cin), .sum(sum), .carry(c2));

    assign cout = c1 | c2;

endmodule
```

`endmodule`, and the full adder is fully described: one part definition, two placements, three internal wires, one gate of glue.

## Copies, Not Calls

If you're coming from software, the instance lines look like function calls. They are not — and the difference is the concurrency lesson from the HDL topic made concrete. A function is *invoked*: it runs when called, and twice the calls cost twice the time. An instance is *placed*: `ha0` and `ha1` are two complete, independent circuits that both exist and both compute at every instant, along with the OR gate. Two placements cost twice the *hardware*, not twice the time. When the inputs change, the signals ripple through both copies simultaneously — there is no "current line."

## Testing It

A testbench (the pattern from hello-world — we'll leave its code for the lab) simply steps through all eight combinations of `a`, `b`, and `cin` and prints what comes out. Running the real simulation:

```
a b cin | cout sum
--------+---------
0 0  0  |  0    0
0 0  1  |  0    1
0 1  0  |  0    1
0 1  1  |  1    0
1 0  0  |  0    1
1 0  1  |  1    0
1 1  0  |  1    0
1 1  1  |  1    1
```

You can watch the signals take effect through the circuit in the waveforms — including the internal wires `s1`, `c1`, `c2` that are invisible from outside the module but fully visible to the simulator. The interactive for this topic steps this same simulation and lights up the schematic row by row.

## Key Takeaways

Instantiation is how Verilog builds hierarchy: define a module once, then place named copies of it inside bigger modules. The outer module declares its own ports, declares internal wires to solder the pieces together, places each copy with a module name (*which part*) plus an instance name (*which copy*), and connects pins with named port mapping — `.pin(wire)`, where order never matters because the name is the connection. Plain glue logic like `assign cout = c1 | c2;` mixes freely with instances. And instances are placements, not calls: every copy exists and computes at once. One half-adder description, two placements, and a full adder exists — blocks made of blocks is how every chip is built.

## Review Questions

**1. In the line `half_adder ha0 (.a(a), .b(b), .sum(s1), .carry(c1));`, what are `half_adder` and `ha0` respectively?**
A. The module name (which part to place) and the instance name (this copy's name)
B. The instance name and the module name
C. Two different module types
D. The input and output of the circuit

**2. Why does each placed copy need an instance name?**
A. Verilog requires all lines to start with two words
B. With more than one copy of the same module, the description must distinguish which copy is meant
C. The instance name sets the module's propagation delay
D. Instance names are optional decoration

**3. What does the hookup `.sum(s1)` mean?**
A. Wire s1 is renamed to sum
B. The copy's `sum` port connects to the outer module's wire `s1`
C. The value of sum is always 1
D. s1 is an input to the half adder

**4. The wires `s1`, `c1`, `c2` are declared inside `full_adder`. Who can see them?**
A. Any module anywhere in the design
B. Only the code inside `full_adder` — from outside, the ports are the only surface
C. Only the testbench
D. Only `ha0`, but not `ha1`

**5. Named port mapping means `.b(cin), .a(s1)` would behave differently from `.a(s1), .b(cin)`. True or false, and why?**
A. True — connections are assigned in the order written
B. True — but only for output ports
C. False — hookups are by name, so their order in the list never matters
D. False — because a and b are interchangeable in any circuit

**6. How do the two instance lines differ from two calls to a software function?**
A. They don't — instantiation is Verilog's word for a function call
B. Each instance is a separate physical copy of the circuit; both exist and compute at every instant
C. Instances run one after the other, like statements
D. The second instance reuses the first one's gates to save hardware

## Answer Explanations

**1. A.** `half_adder` picks the blueprint — which part type to place — and `ha0` names this particular copy, like "resistor" versus "R1" on a schematic. Both are required on every instance line.

**2. B.** The design contains two physically separate copies of the same circuit, and the hardware description (and every tool reading it — simulators, waveform viewers) has to be able to say which one it means. `ha0` and `ha1` are those names; they'll label the copies in your waveforms too.

**3. B.** Read `.pin(wire)` as "this copy's pin ⟵ connects to ⟶ my wire": `ha0`'s `sum` output drives the internal wire `s1` — which then feeds `ha1`'s input `a`. It's a physical connection, not a renaming (A) and not a value (C).

**4. B.** Internal wires are the solder between the parts, and they exist only inside `full_adder` — the module's ports are the only thing an outer design can see or touch. (A simulator can still *display* them, which is exactly what makes waveform debugging useful.)

**5. C.** Named mapping attaches each connection by the port's name, so list order is irrelevant — `.b(cin), .a(s1)` places the identical circuit. That immunity to ordering is precisely why this style is preferred.

**6. B.** Instances are placements, not invocations: `ha0` and `ha1` are two complete circuits that operate simultaneously, all the time — the concurrency principle from the HDL topic in physical form. Two placements cost twice the hardware (D is backwards), never twice the time (C describes software).
