## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied the Building Block Circuits topics, from Multiplexers through Tri-State Buffers, and the D Flip-Flop. There is no new material here. Each problem shows you a short Verilog module and asks what building block it is, and the panel above checks you one step at a time rather than doing the work for you.

Work the problems in order with paper and pencil. Try every step yourself before you open its hint, and open a step's worked solution only once you have an answer of your own to compare it with. Problem 1 is a warm-up and the later problems get harder.

## About the Set

In practice you often meet a building block as code before you meet it as a schematic: a module in someone else's design, with port names that may or may not help. Every module here has deliberately neutral names, such as `a`, `k` and `r`, so the only way to identify it is to read what the code does. The code itself is kept simple: each part is written the most obvious way, usually with a `case` statement, so the set tests whether you know what each part does rather than how much Verilog you know.

Five of the six modules are combinational, and each was simulated for every combination of its inputs. The sixth is clocked, so it has memory and no truth table; it was simulated over a long sequence of clock edges instead. The answer tables come from those simulations, so each module has exactly one correct rule.

## The Six Problems

Each problem adds one new thing to read.

| Problem | Module | What it adds |
|:-:|---|---|
| 1 | `m1` | Warm-up: a `case` that copies one input to the output |
| 2 | `m2` | An enable in front of a `case` |
| 3 | `m3` | The high-impedance value `z` |
| 4 | `m4` | A `casez` with `?` bits, where the first match wins |
| 5 | `m5` | A clock: the only module with memory |
| 6 | `m6` | Three outputs answering three questions about two numbers |

## Working a Problem

Each problem page has five step cards, numbered 0 to 4 to match the method on page 0: understand the problem by listing the ports, read the body, try some inputs (or, for the clocked module, a few clock edges), state the rule, and name the block. Every card starts empty. Work each step on paper first, then use the card's buttons:

- **Hint** gives a nudge for that step without filling anything in.
- **Show** reveals the worked step, so you can compare it with yours.

**Next hint** walks through every hint and step in order, one press at a time, and **Final answer** shows all five steps at once.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
