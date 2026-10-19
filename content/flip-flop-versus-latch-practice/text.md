## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied D Latch and D Flip-Flop. There is no new material here. Each problem gives you a clock and a data input and asks you to draw the output of a latch and of a flip-flop, and the panel above checks your drawing rather than doing it for you.

Work the problems in order. Draw both outputs before you open any hint, and use **Check my work** to see which segments you have right. Problem 1 is a warm-up and Problem 5 is the hardest.

## About the Set

A latch and a flip-flop can both store one bit, but they listen at different times. A latch is **level-sensitive**: while its enable is active it is transparent, and its output copies every change on its data input. A flip-flop is **edge-sensitive**: it looks at its data input only at a clock edge and ignores it the rest of the time. The fastest way to see the difference is to feed both devices the same clock and the same data and compare the two outputs, which is what every problem here asks you to do.

Each timing diagram covers four clock periods, and each period is split into eight segments, so time runs from t = 0 to t = 32. The data input never changes exactly at a clock edge, so there is always a clear answer to "what was D just before the edge?"

## The Five Problems

Each problem adds one new thing to handle.

| Problem | What D does | What it shows |
|:-:|---|---|
| 1 | Changes only while the clock is low | Warm-up: the two outputs are identical |
| 2 | Changes in the middle of a high window | The latch reacts at once; the flip-flop waits for the next edge |
| 3 | Carries short glitches | The latch passes a glitch that the flip-flop never sees |
| 4 | Toggles several times in one window | The latch output follows every change |
| 5 | The same kind of data, with both devices reversed | A latch open on a low clock and a negative-edge flip-flop |

## Working a Problem

Draw each output by clicking in its row of the timing diagram: the upper half of a segment for a 1, the lower half for a 0. Hold the mouse button and drag to fill several segments at once. **Check my work** then marks every segment green if it is right, red if it is wrong, or amber if you have not drawn it yet, without revealing anything.

If you get stuck, the five step cards above the diagram are numbered 0 to 4 to match the method on page 0: understand the problem, mark the clock, draw the flip-flop output, draw the latch output, and compare the two. Each card has two buttons:

- **Hint** gives a nudge for that step.
- **Show** draws the worked step on the diagram: the clock edges and open windows, one of the output rows, or the segments where the two outputs differ.

**Next hint** walks through every hint and step in order, and **Final answer** shows everything at once.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
