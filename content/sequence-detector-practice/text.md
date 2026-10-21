## Practice Homework

This page works differently from the other topics in the Infobook. It is not a reading. It is homework: a set of practice problems to work on your own after you have studied <b data-topic="sequence-detector">Sequence Detector</b>. There is no new material here. Each problem gives you a bit pattern and an overlap rule and asks you to design a Moore sequence detector for it, the same way the topic designs one for 1 0 1 0. You work each problem on paper, and the panel above checks your work one step at a time rather than giving the answer away.

Work the problems in order. Finish each step before you open its hint. Problem 1 is a warm-up and Problem 5 is the hardest.

## About the Set

Every problem uses the same method. A state is named by **how many digits are correct toward the sequence**, so a pattern of n bits needs n + 1 states, S0 through Sn, and the output Z is 1 only in Sn. From each state, ask what a 0 does and what a 1 does. The next digit of the pattern moves the machine one state to the right. A wrong bit does not always send it back to S0: it goes to the state for the **longest ending of the bits seen so far that is also a beginning of the pattern**.

Because the states are named by the count, every problem has exactly one right answer. Every detector is Moore, so Z is 1 for the clock after the last digit arrives. When you trace a stream, write the digits correct **after** each bit and Z one column later.

## The Five Problems

Each problem adds one new thing. Problems 1 and 2 use the same pattern and the same input stream, so you can compare the overlapping and non-overlapping designs directly.

| Problem | Pattern | Overlap | States | What it adds |
|:-:|:-:|:-:|:-:|---|
| 1 | 1 0 1 | allowed | 4 | Warm-up: one arc that falls back part of the way |
| 2 | 1 0 1 | not allowed | 4 | The same detector with the overlap rule changed |
| 3 | 0 0 1 1 | allowed | 5 | A state that loops back to itself, and an overlap rule that changes nothing |
| 4 | 1 1 0 1 | allowed | 5 | A partial match kept after a wrong bit, and a match that starts the next one |
| 5 | 1 0 1 1 0 | allowed | 6 | A five-bit pattern, with fallbacks to S1, S2 and S3 |

## Working a Problem

Each problem page shows the pattern, the overlap rule and an input stream to trace. The five step cards are numbered 0 to 4 to match the method on page 0: understand the problem, name the states, trace the stream, draw the state diagram, and write the state table. Every card starts empty. Work the step on paper first. Then each card has two buttons:

- **Hint** gives a nudge for that step.
- **Show** fills in the worked step: the states and the bits each stands for, the traced stream, every arc with the reason it goes where it does, or the state table. Showing Step 3 also draws the state diagram beside the problem.

**Next hint** walks through every hint and step in order, and **Final answer** shows everything at once. The last step also says what the other overlap rule would change.

The panel is easiest to use at full size. Use the **Open full screen** button below it.
