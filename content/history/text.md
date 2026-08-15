## Hardware Description Languages

A modern digital logic course needs a **hardware description language (HDL)** — a way to describe circuits in text so we can simulate them and, eventually, build them. This course uses **Verilog**. Before getting into syntax, it's worth setting the right mindset, because *Verilog is not regular programming*. Its job is to **describe and simulate circuit behavior**, and that changes how you have to think. Students who approach Verilog like ordinary software make confident, wrong predictions about what their code will do — the two differences below are where those wrong predictions come from. The companion video walks through both.

### Circuits are concurrent, not sequential

Ordinary software runs **sequentially**: a single thread moves down the page, finishing one statement before starting the next. A circuit is **physical** — all of its parts exist and operate **at the same time**, in parallel. There is no "current line" in a circuit; every gate is computing its output continuously, all at once.

The classic illustration is a swap. In normal code, the two lines

```
b = a;
a = b;
```

leave `a` and `b` *equal*: the first line overwrites `b`'s value before the second line can use it. In Verilog, when these assignments happen **concurrently** on a clock tick, the two values genuinely **swap** — `a` receives the old `b` and `b` receives the old `a`, simultaneously. If `a` starts at 1 and `b` at 0, they end as `a = 0, b = 1`. Both readings are internally consistent; they just describe different worlds. Software describes one worker following instructions in order. Verilog describes hardware, where both assignments are physical connections operating at the same moment.

We only write Verilog as a sequence of lines because editors and computers require text to be entered in order; the hardware it describes happens all at once. The mantra worth internalizing: **circuits are physical — everything happens at once.**

### No print statement — you simulate, then run

Regular software lets you `print` values or stop at a breakpoint and inspect variables. Verilog has no print-and-poke debugging workflow, because you're **simulating hardware**. A Verilog source file naturally splits into two parts: the code that **describes** the hardware (the design), and the code that **runs** it by driving signal changes (the testbench). You will see this two-part structure in the very next topic, where a small design and its testbench sit side by side.

Debugging shifts accordingly — instead of inspecting variables, you **examine the signals over time as waveforms**. Those waveforms are exactly the timing diagrams from earlier in this lecture: the simulator plots every signal against a shared time axis, and you read the diagram to see whether the circuit did what you intended. It's a different mindset, and the hand-drawn timing-diagram skill transfers to it directly.

### One of several HDLs

Verilog is one choice among a few. We use it because it's the easiest to learn and very widely used. **SystemVerilog** is common in industry and builds on Verilog, but it hides some of the underlying mechanisms — so we learn plain Verilog first to understand the details, and you can move to SystemVerilog later with those details intact. **VHDL** is another long-standing HDL (it originated in the U.S. Department of Defense) and is still used in parts of industry. The concepts transfer: someone who understands one HDL's mindset — concurrency, describe-then-run, waveform debugging — can pick up another's syntax.

### The payoff: FPGAs

In the past, learning logic meant hand-wiring simple circuits in a lab — tedious, error-prone, and limited to very basic designs. Because designs are now **software descriptions**, we can implement sophisticated circuits on **FPGA boards** — programmable hardware that can become whatever circuit you describe. A design with thousands of gates is no harder to *build* than one with ten; you describe it, simulate it, and load it.

The trade-off is a **longer workflow**: you simulate and synthesize a design, across several levels of abstraction, before it becomes real hardware. Where a software change is edit-run, a hardware change is edit, simulate, check the waveforms, synthesize, and program the board. We'll build up those skills through the course, starting from small simulations and working toward complete designs on the FPGA.

### Key Takeaways

Verilog is this course's hardware description language, and the essential adjustment is mindset, not syntax. Circuits are physical and concurrent — everything operates at once, which is why concurrent assignments genuinely swap two values where sequential code would not. There is no print-statement debugging: a source file splits into a design that describes hardware and a testbench that runs it, and you debug by reading the resulting waveforms — the same timing diagrams drawn by hand earlier in this lecture. Verilog sits alongside SystemVerilog and VHDL; we learn plain Verilog first because it exposes the mechanisms the others build on. The payoff for the longer describe-simulate-synthesize workflow is FPGAs: programmable hardware that can become any circuit you can describe.

## Review Questions

**1. What is the most important mental adjustment when moving from ordinary programming to Verilog?**
A. Verilog uses different keywords than most languages
B. Circuits are physical and concurrent — everything operates at once, not line by line
C. Verilog files must be shorter than software programs
D. Verilog can only describe circuits with fewer than 100 gates

**2. Two assignments, `b = a` and `a = b`, execute *concurrently* on a clock tick in Verilog. If `a = 1` and `b = 0` beforehand, what happens?**
A. Both end up 1
B. Both end up 0
C. The values swap: `a = 0`, `b = 1`
D. The simulator reports an error

**3. A Verilog source file naturally splits into two parts. What are they?**
A. Comments and code
B. Code that describes the hardware, and code that runs it by driving signals
C. Inputs and outputs
D. The synthesizable half and the illegal half

**4. How do you debug a Verilog simulation, given that there is no print-and-breakpoint workflow?**
A. By examining the signals over time as waveforms
B. By reading the synthesized transistor netlist
C. By running the code line by line in a debugger
D. Verilog designs cannot be debugged

**5. Why does this course teach plain Verilog before SystemVerilog?**
A. SystemVerilog no longer works with modern tools
B. VHDL requires Verilog as a prerequisite
C. SystemVerilog hides some underlying mechanisms; learning Verilog first exposes the details
D. Plain Verilog is the only HDL used in industry

## Answer Explanations

**1. B.** The core difference is concurrency: software runs sequentially down the page, while a circuit's parts all exist and operate simultaneously. Getting this wrong leads to confident, wrong predictions about what Verilog code does — it is the mindset shift everything else in the course builds on.

**2. C.** Concurrent assignments both read their right-hand sides at the same moment, *then* update: `a` receives the old `b` (0) while `b` receives the old `a` (1) — a true swap. Option A is what sequential software would produce, where `b = a` overwrites `b` before the second line reads it.

**3. B.** One part describes the hardware (the design); the other drives signal changes to exercise it (the testbench). This describe-vs-run split is the standard structure you'll see in the next topic's design/testbench pair.

**4. A.** Simulation produces waveforms — every signal plotted against a shared time axis, exactly the timing diagrams drawn by hand earlier in this lecture. Debugging means reading those waveforms to see where the circuit's behavior diverges from your intent.

**5. C.** SystemVerilog builds on Verilog but abstracts away some of the mechanisms underneath. Learning plain Verilog first means you understand those details, and moving to SystemVerilog later is straightforward. (VHDL is an independent HDL, not a sequel — and industry uses all three.)
