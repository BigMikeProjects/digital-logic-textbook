## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied One Hot State Assignment. There is no new material here. Each problem asks you to carry the one-hot method all the way through, and the panel above checks you one step at a time rather than doing the work for you.

Work the problems in order with paper and pencil. Try every step yourself before you open its hint, and open a step's worked solution only once you have an answer of your own to compare it with. Problem 1 is a warm-up and Problem 5 is the hardest.

## About the Set

These are the same five state machines as Binary State Assignment Practice, built this time with one flip-flop per state. Doing both sets lets you compare the two designs machine by machine: one-hot needs more flip-flops but no state table and no K-maps, and in most of these machines it ends up with more literals.

The diagrams are drawn in compact form, with every arc that returns to its own state left out. Finding those loop-backs is part of the work, because in the one-hot method an arc that is not drawn becomes a term that is not written. Each D input is then read straight off the diagram: one term for every arc that arrives at the state, made of the flip-flop of the state the arc comes from and the arc's input condition. The flip-flops are named Q0, Q1, and so on, with Q0 holding the 1 in state S0, so D0 = $\bar{x}(Q_0 + Q_3)$ means the machine moves to S0 on a 0 from S0 or from S3.

## The Five Problems

Each problem adds one new thing to handle.

| Problem | Machine | What it adds |
|:-:|---|---|
| 1 | Up/down counter | Warm-up: four states and no loop-backs to find |
| 2 | Two 1s in a row | Two loop-backs hidden by the compact diagram |
| 3 | 0 1 1 detector | A Mealy output, read off its arc like a D input |
| 4 | 1 0 0 1 detector | Five states and five flip-flops |
| 5 | Two-request arbiter | Two inputs, so a loop-back's condition has to be worked out |

## Working a Problem

Each problem page has five step cards, numbered 0 to 4 to match the method on page 0: understand the problem, give each state its own flip-flop, find every loop-back, list the arcs into each state, and write the equations. Every card starts empty. Work each step on paper first, then use the card's buttons:

- **Hint** gives a nudge for that step without filling anything in.
- **Show** reveals the worked step, so you can compare it with yours. Showing step 2 also draws the missing loop-backs on the diagram.

**Next hint** walks through every hint and step in order, one press at a time, and **Final answer** shows all five steps at once.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
