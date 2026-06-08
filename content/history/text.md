## Hardware Description Languages

A modern digital logic course needs a **hardware description language (HDL)** — a way to describe
circuits in text so we can simulate them and, eventually, build them. This course uses **Verilog**.
Before getting into syntax, it's worth setting the right mindset, because *Verilog is not regular
programming*. Its job is to **describe and simulate circuit behavior**, and that changes how you have
to think. The companion video walks through the differences below.

### Circuits are concurrent, not sequential

Ordinary software runs **sequentially**: a single thread moves down the page, finishing one statement
before starting the next. A circuit is **physical** — all of its parts exist and operate **at the same
time**, in parallel.

The classic illustration is a swap. In normal code, the two lines

```
b = a;
a = b;
```

leave `a` and `b` *equal*: the first line overwrites `b`'s value before the second line can use it. In
Verilog, when these assignments happen **concurrently** on a clock tick, the two values genuinely
**swap** — `a` receives the old `b` and `b` receives the old `a`, simultaneously. We only write code as
a sequence because editors and computers require text to be entered in order; the hardware it
describes happens all at once.

### No print statement — you simulate, then run

Regular software lets you `print` values or stop at a breakpoint and inspect variables. Verilog has no
print statement, because you're **simulating hardware**. A Verilog source file naturally splits into
two parts: the code that **describes** the hardware and the code that **runs** it by driving signal
changes. Debugging shifts accordingly — instead of inspecting variables, you **examine the signals
(waveforms)** over time. It's a different mindset.

### One of several HDLs

Verilog is one choice among a few. We use it because it's the easiest to learn and very widely used.
**SystemVerilog** is common in industry and builds on Verilog, but it hides some of the underlying
mechanisms — so we learn plain Verilog first to understand the details, and you can move to
SystemVerilog later. **VHDL** is another long-standing HDL (it originated in the U.S. Department of
Defense) and is still used in parts of industry.

### The payoff: FPGAs

In the past, learning logic meant hand-wiring simple circuits in a lab — tedious, and limited to very
basic designs. Because designs are now **software descriptions**, we can implement sophisticated
circuits on **FPGA boards** — programmable hardware that can become whatever circuit you describe. The
trade-off is a **longer workflow**: you simulate and synthesize a design, across several levels of
abstraction, before it becomes real hardware. We'll build up those skills through the course.
