Every circuit in this book so far has been drawn with one clock wire reaching every flip-flop, and with the unstated assumption that the rising edge arrives at all of them at the same instant. Practical Considerations Overview worked out the timing budget of a clocked circuit on exactly that assumption. This topic removes it.

The clock is a signal on a wire, like any other signal, and an edge takes time to travel along a wire. Two flip-flops at the ends of clock wires of different lengths see the same edge at slightly different times. That difference in arrival time is called **clock skew**. This topic explains where skew comes from and shows the two ways it can make a correct design give wrong answers. It does not teach how skew is removed. That is the job of the design tools and of circuit techniques beyond the level of this course, and the last section says what you can rely on them to do.

## Launch and Capture

Skew is always a statement about two flip-flops, so it helps to name their roles. Take the basic arrangement from the previous topic: a flip-flop, some combinational logic, and a second flip-flop. At a clock edge the first flip-flop puts a new value on its output and sends it into the logic. It is the **launch** flip-flop, called FF1 here, with output Q1. The second flip-flop takes in whatever comes out of the logic. It is the **capture** flip-flop, FF2, with input D2 and output Q2.

The examples use the same round numbers as before:

| Symbol | Name | Value |
|:-:|:--|:-:|
| $T$ | clock period | 10 ns |
| $t_{co}$ | clock-to-output delay | 1 ns |
| $t_{pd}$ | logic propagation delay | 5 ns |
| $t_{su}$ | setup time | 1 ns |
| $t_h$ | hold time | 0.5 ns |

With no skew, the story of one clock period is the one already told. FF1 sees the edge, Q1 changes 1 ns later, the change takes 5 ns to pass through the logic, and it must arrive at D2 at least 1 ns before the next edge, when FF2's decision window opens. Those three delays use 7 ns of the 10 ns period, and the remaining 3 ns is the slack. After its edge, FF2 also needs D2 to stay steady for the hold time, 0.5 ns. With no skew that is easy, because nothing on D2 can change until a new value has left FF1 and come through the logic, which takes 6 ns.

## Where Skew Comes From

The simplest source of skew is wiring. Suppose the clock wire to FF2 is longer than the clock wire to FF1. The edge reaches FF1 first and FF2 a little later. Rearrange the wiring so that FF1 has the longer wire and the edge reaches FF2 first. Nothing about the flip-flops or the logic has changed, only the distance the clock had to travel.

Skew is measured from the launch flip-flop to the capture flip-flop:

$$t_{skew} = (\text{time the edge reaches FF2}) - (\text{time the edge reaches FF1})$$

If the edge reaches FF2 1 ns after it reaches FF1, the skew is +1 ns. If it reaches FF2 1 ns before, the skew is −1 ns. Because a sign is easy to get backward, each case also has a name that says which flip-flop is behind:

| Skew | Name | What it means |
|:-:|:--|:--|
| $t_{skew} > 0$ | capture clock late | FF2 sees the edge after FF1 |
| $t_{skew} = 0$ | no skew | Both see the edge together |
| $t_{skew} < 0$ | launch clock late | FF1 sees the edge after FF2 |

A wire can only add delay, so in each case there is one clock branch that is late, and the name points at it. The two cases cause two different problems, and the next two sections take them one at a time.

## Launch Clock Late: The Data Arrives Too Late

Suppose FF1's clock is late by 2 ns and FF2's clock is on time. FF2's edges, and the decision windows around them, are where they always were. FF1, though, does not launch until 2 ns after it should have. Q1 changes 2 ns late, the value comes out of the logic 2 ns late, and it reaches D2 2 ns closer to the window that is waiting for it.

Every nanosecond the launch is delayed comes straight out of the slack. If the launch clock is late by $d$, the path has only $T - d$ to work with, and the setup requirement becomes

$$T - d \ge t_{co} + t_{pd} + t_{su} \qquad \text{slack} = T - d - (t_{co} + t_{pd} + t_{su})$$

With the 7 ns of delay in this example and a 10 ns clock:

| Launch clock late by | Time the path has | Slack | Result |
|:-:|:-:|:-:|:--|
| 0 ns | 10 ns | 3 ns | Reliable |
| 2 ns | 8 ns | 1 ns | Works, with little margin |
| 3 ns | 7 ns | 0 ns | Setup only just met |
| 4 ns | 6 ns | −1 ns | D2 changes inside the window |

In the last row D2 is still changing when FF2's decision window opens. This is the same failure as logic that is too slow for the clock, and it is called a **setup violation**. FF2 may capture the new value, the old one, or go into a metastable state.

Because this is a setup problem, it has the setup cure: lengthen the clock period. The shortest period that works is now $7 + d$ ns, so a launch clock 4 ns late needs a period of at least 11 ns. Skew of this kind costs speed. A circuit that could have run with a 7 ns period has to run slower to stay correct.

## Capture Clock Late: The Next Data Arrives Too Soon

Now turn it around. FF1's clock is on time and FF2's clock is late. This case is easiest to see, and most dangerous, when there is very little logic between the two flip-flops. The extreme is a shift register, where Q1 is wired straight to D2 and $t_{pd} = 0$.

Think about what one clock edge is supposed to do in a shift register. FF1 takes in a new value, and on the same edge FF2 takes in the value FF1 was holding. FF2 is supposed to capture the *old* Q1. That works with no skew, because Q1 does not change until 1 ns after the edge, and FF2's window closed 0.5 ns after the edge. The old value was still there for the whole window.

Delay FF2's clock and its window slides later, toward the moment Q1 changes. FF2 keeps the old value correctly only if its window closes before Q1 moves. With FF1's edge at time 0, Q1 changes at $t_{co}$ and FF2's window closes at $t_{skew} + t_h$, so the requirement is

$$t_{co} \ge t_h + t_{skew}$$

With $t_{co} = 1$ ns and $t_h = 0.5$ ns, this holds only while the skew is 0.5 ns or less. FF2's window runs from $t_{skew} - 1$ ns to $t_{skew} + 0.5$ ns, and Q1 changes at 1 ns. That gives three outcomes:

| Capture clock late by | FF2's window | What FF2 captures | Result |
|:-:|:-:|:--|:--|
| 0 to 0.5 ns | Closes before Q1 changes | The old Q1 | Correct |
| Between 0.5 and 2 ns | Q1 changes inside it | Not guaranteed | Hold violation |
| 2 ns or more | Opens after Q1 has changed | The new Q1 | Race-through |

In the middle row the old value did not last through the window. The hold time has not been met, which is a **hold violation**, and the result is as unpredictable as any other change inside the window: FF2 may end up with the old value, the new value, or a metastable state.

In the bottom row something stranger happens, and it is not unpredictable at all. The window has slid so far that Q1's new value is already steady when it opens. FF2 captures the new value cleanly, but it is the wrong value. Data that should have waited in FF1 for one more clock has passed through FF1 and FF2 on a single edge. This is called **race-through**: the new data raced the late clock to FF2 and won.

Look at the inequality again and notice what is missing. The clock period $T$ does not appear in it. A hold problem involves a single clock edge, arriving at two flip-flops at two different times, so the time until the next edge has nothing to do with it. **Slowing the clock does not fix a hold violation.** A circuit with this fault fails at any clock speed. That is the important difference between the two cases. Launch-clock skew costs speed, but capture-clock skew on a short path costs correctness. The cure for it is to make the two clock edges arrive together.

The same skew is harmless on the long path of the previous section. There the new value takes $t_{co} + t_{pd} = 6$ ns to reach D2, so FF2's clock would have to be more than 5.5 ns late before that change could land in its window. Hold problems belong to short paths: flip-flops connected directly, or through very little logic.

## Race-Through in a Shift Register

A three-stage shift register shows what race-through does to data. The input feeds FF1, Q1 feeds FF2, and Q2 feeds FF3. Shift in a single 1: the input is 1 for one clock and 0 after that. In a correct register the 1 moves one flip-flop to the right on each clock and leaves after the third.

Now suppose FF1 and FF3 get the clock on time but FF2's clock is 2 ns late, enough for race-through. On the first clock FF1 captures the 1. Then FF2, clocking late, sees the new Q1 and captures the 1 as well. The bit is in two flip-flops at once.

| Clock | Correct Q1 Q2 Q3 | With race-through |
|:-:|:-:|:-:|
| 1 | 1 0 0 | 1 1 0 |
| 2 | 0 1 0 | 0 0 1 |
| 3 | 0 0 1 | 0 0 0 |
| 4 | 0 0 0 | 0 0 0 |

The 1 reaches Q3 after two clocks, not three, and is gone a clock early. The bit skipped a flip-flop, and the three-stage register is behaving as a two-stage one. Nothing here is random. The circuit does the same wrong thing every time, at any clock speed.

With a smaller skew, between 0.5 and 2 ns, Q1 changes inside FF2's window and the result is worse in a different way: Q2 cannot be predicted on any clock where Q1 changes, and the uncertainty is passed along to FF3 on the next clock.

## Living with Skew

The two cases pull in opposite directions. A late launch clock takes time away from the data and threatens setup. A late capture clock gives the data extra time, which helps setup, and at the same moment takes it away from the hold requirement. There is no direction of skew that is safe for every path, which is why the goal in a real design is to keep skew small everywhere.

You will not have to do that by hand. Clock skew is a well-understood problem, and it is managed for you. An FPGA carries its clock on a dedicated network built to deliver the edge to every flip-flop at very nearly the same time, and the design tools check both requirements, setup and hold, on every path from one flip-flop to another and report any that fail. Your part is to give the tools a design they can do that for: use one clock for the whole circuit, connect it only to the clock inputs of flip-flops, and never pass it through gates of your own. The Basys 3 designs in this course follow those rules, and their skew is small enough to ignore.

What this topic asks you to keep is the idea. The clock does not arrive everywhere at once, the difference can break a design in two distinct ways, and one of those ways cannot be cured by slowing down.

## Key Takeaways

Clock skew is the difference between the times a clock edge reaches two flip-flops, measured from the launch flip-flop to the capture flip-flop, and its simplest cause is clock wires of different lengths. When the launch clock is late, the data sets out late and loses slack nanosecond for nanosecond, so the setup requirement becomes $T - d \ge t_{co} + t_{pd} + t_{su}$; enough skew produces a setup violation, and a longer clock period cures it. When the capture clock is late, the capturing flip-flop's decision window slides toward the launch flip-flop's next change. On a short path that change can land inside the window, a hold violation with an unpredictable result, or arrive before the window opens, which is race-through: the new value is captured a clock early and the bit skips a flip-flop. The hold requirement $t_{co} \ge t_h + t_{skew}$ does not contain the clock period, so slowing the clock cannot fix it. Real designs keep skew small with dedicated clock networks, and the design tools check setup and hold on every path.

## Review Questions

**1. What is clock skew?**

A. The time a flip-flop takes to change its output after the clock edge\
B. The difference between the times the same clock edge arrives at two flip-flops\
C. The time the logic between two flip-flops takes to settle\
D. The difference between the clock period and the total delay of a path

**2. A path has $t_{co} = 1$ ns, $t_{pd} = 5$ ns and $t_{su} = 1$ ns, and the clock period is 10 ns. The launch flip-flop's clock arrives 2 ns late and the capture flip-flop's clock is on time. What is the setup slack?**

A. 5 ns\
B. 3 ns\
C. 1 ns\
D. −1 ns

**3. On the same path, the launch clock is now 4 ns late. What is the shortest clock period at which the setup time is still met?**

A. 7 ns\
B. 10 ns\
C. 11 ns\
D. 14 ns

**4. Two flip-flops are connected directly, Q1 to D2, with $t_{co} = 1$ ns, $t_{su} = 1$ ns and $t_h = 0.5$ ns. The capture flip-flop's clock arrives 1.5 ns late. What happens at the capture flip-flop?**

A. It captures the old Q1, as it should\
B. Q1 changes inside its decision window, so the result is not guaranteed\
C. It cleanly captures the new Q1, one clock early\
D. Nothing is captured until the next clock edge

**5. A shift register has a hold violation caused by clock skew. Why does lengthening the clock period not fix it?**

A. A longer period makes the decision window wider\
B. The hold requirement compares delays around a single clock edge, so the period is not part of it\
C. A longer period increases the clock-to-output delay\
D. Lengthening the period increases the skew by the same amount

**6. A three-stage shift register holds 0 0 0. A single 1 is shifted in. The middle flip-flop's clock is late enough to cause race-through, and the other two clocks are on time. What does the register hold, as Q1 Q2 Q3, after the first clock?**

A. 1 0 0\
B. 0 1 0\
C. 1 1 0\
D. 1 1 1

## Answer Explanations

**1. B.** Skew is about when the clock edge arrives, compared between two flip-flops. Choice A is the clock-to-output delay, C is the logic propagation delay, and D describes slack.

**2. C.** A launch clock that is 2 ns late leaves the path $10 - 2 = 8$ ns. The three delays need $1 + 5 + 1 = 7$ ns, so the slack is $8 - 7 = 1$ ns. Without skew it would have been 3 ns; the skew took 2 ns of it.

**3. C.** The requirement is $T - d \ge 7$ ns with $d = 4$ ns, so $T \ge 11$ ns. The 7 ns answer forgets the skew, and 10 ns leaves the slack at −1 ns.

**4. B.** Take the launch edge as time 0. Q1 changes at $t_{co} = 1$ ns. The capture edge is at 1.5 ns, so its window runs from $1.5 - 1 = 0.5$ ns to $1.5 + 0.5 = 2$ ns. The change at 1 ns falls inside it. Checking the inequality gives the same verdict: $t_{co} \ge t_h + t_{skew}$ would need $1 \ge 0.5 + 1.5$, which is false. A clean capture of the new value, choice C, needs the window to open after Q1 has changed, which takes a skew of 2 ns or more.

**5. B.** The hold requirement is $t_{co} \ge t_h + t_{skew}$. Every term in it is measured from one clock edge as it arrives at the two flip-flops, and $T$ does not appear. Changing the period moves the next edge and leaves this one where it was.

**6. C.** FF1 captures the 1 from the input. FF2 clocks late, after Q1 has already become 1, so it captures the 1 as well. FF3's clock is on time and Q2 was still 0 at that moment, so FF3 captures 0. The correct register would hold 1 0 0.
