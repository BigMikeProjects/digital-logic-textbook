## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied <b data-topic="practical-considerations-overview">Practical Considerations Overview</b>. There is no new material here. Each problem gives you a state machine's flip-flop timing, its next-state logic and its clock period, and asks you to lay the delays out on one clock period, find how much time is left over, and work out how fast the circuit could be clocked. The panel above checks your answers rather than giving them away.

Work the problems in order. Fill in every box before you open any hint, and use **Check my work** to see what you have right. Problem 1 is a warm-up and Problem 5 is the hardest.

## About the Set

In one clock period, data leaves a flip-flop the clock-to-output delay $t_{co}$ after the edge, crosses the next-state logic in its propagation delay $t_{pd}$, and has to reach the next flip-flop the setup time $t_{su}$ before the following edge. All three have to fit inside the clock period $T$:

$$T \ge t_{co} + t_{pd} + t_{su} \qquad \text{slack} = T - (t_{co} + t_{pd} + t_{su})$$

The **slack** is the time left over. Setting it to zero gives the shortest period the circuit can run at, $T_{min} = t_{co} + t_{pd} + t_{su}$, and from that the **maximum clock frequency**, $f_{max} = 1 / T_{min}$. With times in nanoseconds and frequencies in megahertz, $f = 1000 / T$ and $f_{max} = 1000 / T_{min}$. Each problem gives $T$ and shows its frequency. Every answer in the set is exact, and slack can be zero or negative.

## The Five Problems

The problems are numbered rather than named, so that nothing on the page hints at the answer.

| Problem | $t_{co}$ | $t_{su}$ | Clock period |
|:-:|:-:|:-:|:-:|
| 1 | 1 ns | 1 ns | 10 ns |
| 2 | 1.5 ns | 0.5 ns | 8 ns |
| 3 | 0.5 ns | 0.5 ns | 5 ns |
| 4 | 1.5 ns | 1 ns | 10 ns |
| 5 | 2 ns | 1 ns | 12.5 ns |

## Working a Problem

The launch edge at $t = 0$ and the capture edge at $t = T$ are drawn for you. Place each delay on the timing budget by typing its **start** time and its **duration** in nanoseconds: $t_{co}$, $t_{pd}$, $t_{su}$ and the slack. Each bar draws itself as soon as both numbers are in, so you can see whether $t_{co}$ and $t_{pd}$ run on from the launch edge, whether $t_{su}$ ends exactly at the capture edge, and whether the slack fills the gap between them. The slack starts where $t_{pd}$ ends, and a negative duration draws it backwards in red. Then type $f_{max}$: it draws a dashed line at $1/f_{max}$, the earliest the capture edge could come, with a ghost setup time in front of it that should just meet the end of the logic. **Check my work** marks every box green if it is right, red if it is wrong, or amber if it is empty, without revealing anything.

If you get stuck, the five step cards are numbered 0 to 4 to match the method on page 0: understand the problem, place $t_{co}$ and $t_{pd}$, place $t_{su}$, find the slack, and find the maximum frequency. Each card has two buttons:

- **Hint** gives a nudge for that step.
- **Show** fills in that step's boxes and draws them on the timing budget.

**Next hint** walks through every hint and step in order, and **Final answer** shows everything at once.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
