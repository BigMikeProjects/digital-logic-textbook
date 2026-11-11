## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied <b data-topic="fsmd-with-datapaths">FSMD - Finite State Machines with Datapaths</b>. There is no new material here. It is the second half of <b data-topic="fsmd-to-datapath-practice">FSMD to Datapath Practice</b>, with the same five machines. There, you built the datapath from each FSMD. Here the datapath is given, and you derive the **controller**: the ordinary state machine that runs the datapath, with control signals in place of the register transfers and status signals in place of the data tests.

Work the problems in order. Problem 1 is a warm-up and Problem 5 is the hardest.

## About the Set

The controller has the same states and the same arcs as the FSMD. Only the labels change. An arc is labeled with inputs and status signals only, never with a register, because the controller cannot see the registers; a test such as $C = 3$ reaches it as a status signal from a comparator. Inside each state, a register transfer becomes the values of the control signals that make it happen: the load lines and mux selects. As in class, a state lists only the signals it asserts, and every signal it does not list is 0. Each output is then a one-hot equation: the OR of the states that assert it, or for a Mealy output, of the arcs that assert it.

## The Five Problems

| Problem | What it adds |
|:-:|---|
| 1 | Warm-up: the same three states, with the transfers replaced by load and clear signals |
| 2 | A data test that reaches the controller as a status signal |
| 3 | A mux select that takes two bits |
| 4 | Two registers whose load lines cannot share a wire |
| 5 | A Mealy output, asserted on an arc rather than in a state |

## Working a Problem

Each problem page shows the FSMD and its datapath on the left and an empty controller on the right. The five step cards are numbered 0 to 4 to match the method on page 0: understand the transfers, find the controller's states, label the arcs, fill in each state's control outputs, and say whether each output is Moore or Mealy and write its equation. Click your choices on each card, then press **Check my work**: right picks turn green, wrong ones red, and each step that is fully right draws its part of the controller. Each card also has two buttons:

- **Hint** gives a nudge for that step.
- **Show** fills in the worked step and draws its part.

**Next hint** walks through every hint and step in order, **Final answer** shows everything at once, and **Clear** starts the problem over.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
