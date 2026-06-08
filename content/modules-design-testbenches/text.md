## Modules, Design, and Testbenches

The first day of Verilog can feel like a lot at once — the workflow, accepting assignments, using Box,
and using Vivado all arrive together. Before any syntax, it helps to internalize one structural idea
that shapes everything afterward: the **separation between the design and the testbench**. The
companion video introduces it with a simple block-diagram example.

### Verilog describes hardware

Verilog is not regular programming — you're **describing hardware**, so there's no "print statement."
To observe and exercise a circuit, you instead **control its signals**. That naturally splits a
project into two cooperating pieces.

### Design (RTL) vs. testbench

- **Design** is where you describe the actual hardware — the **module**, its **input and output
  signals**, and how they're connected. Take a **counter**: its inputs might be a **system clock**, a
  **reset**, and an **enable**; its outputs might be **count** and **overflow**. Each of these signals
  is *declared* in the design module.
- **Testbench** is a software configuration whose job is to **test** the design. The same signals are
  *driven* here: the testbench actually **runs the clock**, asserts and releases **reset**, and steps
  the inputs through the conditions needed to make the hardware do something observable.

So a single signal lives on both sides with different roles. The `clock`, for example, is **declared**
in the design but **generated and controlled** by the testbench. The detailed mechanics of
configuring these signals come later (in the labs and the Vivado workflow); the goal now is just to
hold the relationship in mind.

### A note on "design" vs. "RTL"

You'll hear **design** and **RTL** used interchangeably. **RTL** stands for **register transfer
level** — the abstraction at which we conceive of designs in this course. Inside Vivado you'll
sometimes see "design files" and sometimes "RTL"; treat them as the same idea.
