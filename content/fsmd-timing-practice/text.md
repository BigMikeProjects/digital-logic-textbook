## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied <b data-topic="fsmd-timing">FSMD Timing</b>. There is no new material here. Each problem gives you a small finite state machine with datapath, the signals between its controller and datapath, and a timing diagram that is mostly filled in. A window of a few clock cycles is left blank on every row, placed on the edges the problem is about, and you complete it.

Work the problems in order. Problem 1 is a warm-up and Problem 4 is the hardest.

## About the Set

Every diagram follows the conventions from class. Values change only at clock edges. A register transfer written in a state takes effect at the edge as you leave that state, so registers lag one clock behind the state that loads them. Controller outputs and status signals are combinational, so they change in the same cycle as the state or register they depend on. To stay in a state for $N$ clocks, the comparator tests $N - 1$. A register nobody has loaded yet shows `??`.

## The Four Problems

| Problem | What it adds |
|:-:|---|
| 1 | A register loaded from an input in one state, then shown in the next |
| 2 | A count-down delay, and a start pulse that arrives while it is running |
| 3 | An arc that depends on data, through a comparator |
| 4 | Two counters, one counted only when an input is 1 |

## Working a Problem

Each problem page shows the FSMD beside its timing diagram. Fill in the blank cells in the shaded window. Click a one-bit cell to step it through 0, 1 and blank, click a state cell to step through the state names, and type register values (in decimal, except Problem 1's register, which is in hex). Then press **Check my work**: right cells turn green, wrong ones red. The step cards, numbered 0 to 4 to match page 0, each have **Hint** for a nudge and **Show** to fill in that step's rows. **Next hint** walks through every hint and step in order, **Final answer** fills in everything, and **Clear** starts the problem over.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
