## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied <b data-topic="fsm-coding-template">FSM Coding Template</b>. There is no new material here. Each problem gives you a complete state machine written in Verilog with the template, and asks you to read it backward: recover the state assignment, the next state table or the next state equations, and the output, then draw the state diagram and say what the machine does. You work each problem on paper, and the panel above checks your work one step at a time rather than giving the answer away.

It is a short companion to <b data-topic="fsm-coding-template-practice">FSM Coding Template Practice</b>, with two more machines.

## About the Set

Both machines have one input $x$, one output $Z$ and a synchronous reset, and both are written with the three blocks of the template in order: the state register, the next state logic and the output logic. Problem 1 uses a **binary** state assignment, and its codes are not in counting order, so read them from the `localparam` line rather than assuming them. Problem 2 is **one-hot**: each `next[k]` line is the equation for $D_k$, with one term for every arc that arrives at state $k$. Whether the output is Moore or Mealy is written in the code, in whether the output line reads the state alone or the input as well.

## The Two Problems

| Problem | Assignment | States | What it adds |
|:-:|:-:|:-:|---|
| 1 | binary | 4 | State codes that are not in counting order |
| 2 | one-hot | 3 | A Mealy output, read from the input as well as the state |

## Working a Problem

Each problem page shows the Verilog on the left. The step cards are numbered 0 to 4 to match the method on page 0. Every card starts empty. Work the step on paper first, then use **Hint** for a nudge or **Show** for the worked step. **Next hint** walks through every hint and step in order, and **Final answer** shows everything at once.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
