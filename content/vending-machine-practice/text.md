## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied <b data-topic="fsmd-with-datapaths">FSMD - Finite State Machines with Datapaths</b> and the vending machine example from lecture. There is no new material here. The set shows you one complete design, a vending machine, as three figures: its FSMD, its datapath and its controller. Then it asks eight multiple-choice questions about how that design works. Each question is answered from the figures, so keep them in front of you.

Work the questions in order. The first few ask about one part of the design at a time, and the later ones put two parts together or follow the design for a clock cycle.

## About the Set

The machine sells two items, one for 75 cents and one for 90 cents. It takes nickels, dimes and quarters, one coin at a time, keeps the amount paid in a register $A$ and the price in a register $P$, and computes the change $C = A - P$. Its states are WAIT, PAY, VEND and RET. The questions ask why the money lives in a register rather than in the state, how the datapath turns a coin into its value, what the comparator tells the controller, how much change a given set of coins produces, which registers need load lines, what the return button does, which load equation is right, and what happens in the cycle a coin arrives.

## Working a Question

Page 0 shows the three figures at full size with a short description of the system. Each question page shows the figure that question is about beside the question. Click the choice you think is right, then press **Check my work**. A right answer turns green. A wrong one turns red, but the page does not tell you which choice is right, so you can try again. Each question also has two buttons:

- **Hint** gives a nudge, in the bar at the bottom.
- **Show** reveals the answer and a one-line reason.

**Next hint** walks through the hints and answers in order, **Final answer** shows every answer at once, and **Clear** starts over. 

The panel is easiest to use at full size. Use the **Open full screen** button below it.
