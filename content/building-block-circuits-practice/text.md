## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied the Building Block Circuits topics, from Multiplexers through Tri-State Buffers. There is no new material here. Each problem shows you a short Verilog module and asks what building block it is, and the panel above checks you one step at a time rather than doing the work for you.

Work the problems in order with paper and pencil. Try every step yourself before you open its hint, and open a step's worked solution only once you have an answer of your own to compare it with. Problem 1 is a warm-up and Problem 5 is the hardest.

## About the Set

In practice you often meet a building block as code before you meet it as a schematic: a module in someone else's design, with port names that may or may not help. Every module here has deliberately neutral names, such as `a`, `k` and `r`, so the only way to identify it is to read what the code does. Several of them are also written in a different style from the one their own topic used, which is the point. A decoder is still a decoder when it is written with a shift instead of a `case` statement.

Every listing was simulated for every combination of its inputs, and the answer tables come from those simulations, so each module has exactly one correct rule.

## The Five Problems

Each problem adds one new thing to read.

| Problem | Module | What it adds |
|:-:|---|---|
| 1 | `m1` | Warm-up: one assignment with the conditional operator |
| 2 | `m2` | A shift operator doing the work of a `case` statement |
| 3 | `m3` | An if–else chain, where the order of the tests matters |
| 4 | `m4` | Arithmetic: an answer hidden in the borrow bit of a subtraction |
| 5 | `m5` | Defaults that are overwritten, and a block with two common names |

## Working a Problem

Each problem page has five step cards, numbered 0 to 4 to match the method on page 0: understand the problem by listing the ports, read the body, try some inputs, state the rule, and name the block. Every card starts empty. Work each step on paper first, then use the card's buttons:

- **Hint** gives a nudge for that step without filling anything in.
- **Show** reveals the worked step, so you can compare it with yours.

**Next hint** walks through every hint and step in order, one press at a time, and **Final answer** shows all five steps at once.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
