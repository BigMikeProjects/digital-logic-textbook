## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied <b data-topic="practical-considerations-overview">Practical Considerations Overview</b>. There is no new material here. Each problem gives you a flip-flop's setup and hold times, a clock and a data input, and asks you to find the decision window around every clock edge and decide what happens there. The panel above checks your answers rather than giving them away.

Work the problems in order. Enter every window and call every edge before you open any hint, and use **Check my work** to see what you have right. Problem 1 is a warm-up and Problem 5 is the hardest.

## About the Set

A real flip-flop does not read its D input at an instant. It needs D to hold still from the **setup time** $t_{su}$ before the clock edge until the **hold time** $t_h$ after it, a stretch called the **decision window**. A change of D outside every window is harmless: before the window it is captured cleanly, and after the window it simply waits for the next edge. A change inside a window is a **setup violation** if it comes before the edge and a **hold violation** if it comes after, and either way the flip-flop's output is not guaranteed.

Every problem runs from t = 0 to 80 ns on a 1 ns grid, every window starts and ends on a whole nanosecond, with a positive-edge flip-flop whose clock-to-output delay is 1 ns. D never changes exactly at an edge or at a window boundary, and no window holds more than one change, so every edge has exactly one right answer.

## The Five Problems

The problems are numbered rather than named, so that nothing on the page hints at the answer. They run from a warm-up to the hardest, and each changes the timing numbers.

| Problem | Setup time | Hold time | Clock period | Edges |
|:-:|:-:|:-:|:-:|:-:|
| 1 | 2 ns | 1 ns | 20 ns | 4 |
| 2 | 1 ns | 2 ns | 20 ns | 4 |
| 3 | 3 ns | 1 ns | 16 ns | 5 |
| 4 | 2 ns | 2 ns | 12 ns | 6 |
| 5 | 4 ns | 3 ns | 20 ns | 4 |

## Working a Problem

Enter each window by typing its start and end, in nanoseconds, into the **[ , ]** boxes under its edge: a window from 8 to 11 ns is entered as [8, 11], and it lights up on the diagram as soon as both numbers are in. Then call each edge by clicking the box under it, which steps through **clean**, **setup** and **hold**. **Check my work** marks every window and every call green if it is right, red if it is wrong, or amber if it is missing, and draws your windows on the diagram, without revealing the answer.

If you get stuck, the five step cards above the diagram are numbered 0 to 4 to match the method on page 0: understand the problem, find each window, place each change of D, call each edge, and work out what Q does. Each card has two buttons:

- **Hint** gives a nudge for that step.
- **Show** draws the worked step on the diagram: the windows, which changes fall inside them, the calls, or the output Q.

**Next hint** walks through every hint and step in order, and **Final answer** shows everything at once.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
