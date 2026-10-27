## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied <b data-topic="fsm-coding-template">FSM Coding Template</b>. There is no new material here. Each problem gives you a complete state machine written in Verilog with the template and asks you to read it backward, the way the lecture examples did: recover the state assignment, the next state table and the output from the code, then draw the state diagram and say what the machine does. You work each problem on paper, and the panel above checks your work one step at a time rather than giving the answer away.

Work the problems in order. Finish each step before you open its hint. Problem 1 is a warm-up and Problem 4 is the hardest.

## About the Set

Every machine has one input $x$, one output $Z$, and a synchronous reset, and every one is written with the three blocks of the template in order: the state register, the next state logic and the output logic. Two of the machines use a **binary** state assignment, where the `localparam` line gives each state its code and the next state logic is a `case` statement with one arm per arc. Two use a **one-hot** assignment, where the `localparam` line gives each state its own flip-flop and each `next[k]` line is the equation for $D_k$, with one term for every arc that arrives at state $k$. The flip-flop for state $k$ is $Q_k$, equal to 1 only in that state, and its input is $D_k$, as in <b data-topic="one-hot-state-assignment">One Hot State Assignment</b>.

Because the code is a complete description of the machine, every problem has exactly one right answer: one assignment, one table and one set of arcs. Only the layout of your drawing is up to you. Whether an output is Moore or Mealy is also written in the code, in whether the output line reads the state alone or the input as well, as <b data-topic="mealy-versus-moore">Mealy versus Moore</b> describes.

## The Four Problems

Each problem adds one new thing. The first two are binary and the last two are one-hot, so you can compare how the same kind of reading goes in each style.

| Problem | Module | Assignment | States | What it adds |
|:-:|:-:|:--|:-:|---|
| 1 | `fsm_c` | binary | 3 | Warm-up: one arm per arc, and a code that is never named |
| 2 | `fsm_d` | binary | 4 | An output line that reads the input as well as the state |
| 3 | `fsm_e` | one-hot | 3 | Each `next[k]` line is $D_k$, and each term is an arc into state $k$ |
| 4 | `fsm_f` | one-hot | 4 | Terms with no input, which are arcs taken on every clock, and an output that is 1 in two states |

## Working a Problem

Each problem page shows the Verilog on the left. The five step cards are numbered 0 to 4 to match the method on page 0: understand the problem, read the state assignment, read the next state logic, read the output, and draw the state diagram. Every card starts empty. Work the step on paper first. Then each card has two buttons:

- **Hint** gives a nudge for that step.
- **Show** fills in the worked step: the assignment with its reset state and any unused code, the next state table (with the $D$ equations for a one-hot machine, each term labeled with the arc it stands for), the output and whether it is Moore or Mealy, or the state diagram with a sentence saying what the machine does.

**Next hint** walks through every hint and step in order, and **Final answer** shows everything at once.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
