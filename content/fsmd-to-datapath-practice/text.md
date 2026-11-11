## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied <b data-topic="fsmd-with-datapaths">FSMD - Finite State Machines with Datapaths</b>. There is no new material here. Each problem gives you a finite state machine with datapath, an FSMD, and asks you to build the datapath that carries out its register transfers: the registers, the muxes and load lines in front of them, the arithmetic blocks, the comparators that make the status signals, and the control signals that run it all. You make each choice in the panel above, and the datapath draws itself one part at a time as each step comes out right.

Work the problems in order. Problem 1 is a warm-up and Problem 5 is the hardest.

## About the Set

Every problem follows the rules used in class. A register gets a **load line** unless every state writes it, because a register that some state leaves alone has to hold its value. When two or more transfers write the same register, a **mux** chooses between them, and its select line comes from the controller. Each different operation in the transfers, such as $S + X$ or $C + 1$, needs an arithmetic block, and each data condition on an arc, such as $C = 3$, needs a comparator whose output is a **status** signal back to the controller. The load lines and mux selects are **control** signals, from the controller to the datapath.

Holding a value by feeding a register back through its own mux would also work in hardware, but it is not the method this set uses. Holding is the load line's job, so a register listed as its own source is marked wrong.

## The Five Problems

| Problem | What it adds |
|:-:|---|
| 1 | Warm-up: one register, one mux and a load line, with no arithmetic |
| 2 | Two registers, an adder, an incrementer and a comparator |
| 3 | A register with three sources, so a 4:1 mux with one leg unused |
| 4 | One adder shared by two transfers in different states |
| 5 | A transfer written on an arc, so its load line is a Mealy signal |

## Working a Problem

Each problem page shows the FSMD on the left and an empty datapath on the right. The five step cards are numbered 0 to 4 to match the method on page 0: understand the FSMD, find the registers, decide what feeds each register, choose the arithmetic blocks and comparators, and sort the signals into control and status. Click your choices on each card, then press **Check my work**: right picks turn green, wrong ones red, and each step that is fully right draws its part of the datapath. Each card also has two buttons:

- **Hint** gives a nudge for that step.
- **Show** fills in the worked step and draws its part.

**Next hint** walks through every hint and step in order, **Final answer** shows everything at once, and **Clear** starts the problem over.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
