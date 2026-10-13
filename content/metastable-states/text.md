A flip-flop is supposed to hold a 0 or a 1. Under the wrong conditions it can, for a short time, hold neither. Its output sits near the halfway level, undecided, and then settles to 0 or to 1 after a wait that cannot be predicted. That undecided condition is called a **metastable state**.

Practical Considerations Overview introduced the idea in one sentence: when D changes inside the decision window, the flip-flop may capture the new value, may keep the old one, or may go metastable. This topic explains what that third outcome is, what causes it, and how long it lasts. It matters because it is the reason the next topic, Synchronizers, exists.

## A Ball and a Hill

A useful picture of a flip-flop's storage element is a ball in a landscape with two valleys and a hill between them. One valley is $Q = 0$ and the other is $Q = 1$. The picture is a model, not an exact account of the physics inside the device, but it predicts the right behavior.

A ball resting in either valley stays there indefinitely. That is what it means for a flip-flop to store a bit: both values are stable. Storing a new value means pushing the ball over the hill into the other valley. Three kinds of push are worth telling apart.

- A **weak push** sends the ball part of the way up the hill, and it rolls back to where it started. The stored value does not change.
- A **strong push** sends the ball cleanly over the top and down into the other valley. The stored value changes.
- A **marginal push** is one that might or might not be enough. The ball can arrive at the top of the hill with almost no speed left, and balance there.

A ball balanced on a hilltop is not stable. The slightest disturbance sends it down one side or the other. But until that happens it is in neither valley, and nothing about the push tells you which way it will finally go or how long it will take. That is the metastable state.

On a real flip-flop the valleys are the two valid output levels and the hilltop is a voltage about halfway between them. While the ball is on the hilltop, Q hovers near the halfway level, wobbling slightly, and is neither a valid 0 nor a valid 1. Then it settles to one of them.

The contrast in timing is the important thing. A weak push and a strong push are both over quickly, and their results are known. A marginal push is the only one whose result has to be waited for.

## What Makes the Push Marginal

In the model, something has to decide how hard the push is. In the flip-flop, it is **when the D input changes relative to the clock edge**.

Recall that a flip-flop needs D to hold still for a short **decision window** around the clock edge, from the setup time $t_{su}$ before the edge to the hold time $t_h$ after it. With the round numbers used throughout this section, $t_{su} = 1$ ns and $t_h = 0.5$ ns, so the window is 1.5 ns wide.

**D changes before the window.** The setup time is met. The flip-flop sees a steady new value for the whole window, and that is a strong push. Q takes the new value, one clock-to-output delay $t_{co}$ after the edge. This is the normal, reliable case.

**D changes after the window.** The hold time is met. As far as this clock edge is concerned, D never changed. There is no push at all, Q keeps the old value, and the change is picked up at the next edge.

**D changes inside the window.** Now the flip-flop sees the old value for part of the window and the new value for the rest. One way to think of it is that less energy goes into the decision. The later the change falls, the weaker the push, fading from nearly strong at the start of the window to nearly nothing at the end. Somewhere in between is a push that is exactly marginal.

What happens inside the window is not the same every time. Run the same capture again, with D changing at the same instant, and the result can differ. Three outcomes are possible:

- Q takes the new value, as if the push had been strong.
- Q keeps the old value. The ball starts up the hill and falls back.
- The ball stalls on the hilltop. Q is metastable for a while and then settles to one value or the other.

The table shows how the chances shift as D's change moves across the window, in the interactive graphic that accompanies this topic.

| D changes at, relative to the clock edge | Takes the new value | Keeps the old value | Stalls first |
|:-:|:-:|:-:|:-:|
| −0.9 ns (just inside the window) | 94% | 4% | 2% |
| −0.4 ns | 62% | 16% | 22% |
| −0.2 ns | 20% | 20% | 60% |
| 0.0 ns | 16% | 62% | 22% |
| +0.4 ns (almost out the other side) | 4% | 94% | 2% |

**These numbers are for illustration only.** They were chosen so that every outcome turns up within a few tries. In a real flip-flop the band of timings that produces a stall is far narrower than this, and a stall is far rarer. Three things in the table are true of real devices, though. A change that only just violates the setup time usually works anyway. No position inside the window is guaranteed. And there is always some timing for which the push is marginal.

That last point is why the specification is a window and not a single instant. The exact timing that balances the ball shifts with temperature, supply voltage and noise, so a manufacturer cannot name it. What can be guaranteed is that outside the window the outcome is certain.

## How Long It Takes to Settle

A flip-flop that takes the old value when it should have taken the new one has made an error of one clock period, and the change is caught at the next edge. That is the milder problem. The stall is the more serious one, because for as long as it lasts Q is not a valid logic level, and whatever is connected to Q is being fed a signal that is neither 0 nor 1.

So the practical question is how long a stall lasts. For any single stall there is no way to say. Over many, there is a clear pattern: **most settle almost at once, a few take longer, and long waits become rapidly rarer.**

In the graphic's model, out of 200 stalled captures, 75 were still unsettled 2 ns after the clock edge. After 4 ns, 6 were. After 6 ns, 1 was. Each additional stretch of waiting cuts the number remaining by a large factor. As before, the specific values are illustrative, and the shape is the real thing.

What matters to the rest of the circuit is whether Q has settled by the time something reads it. Q feeds the D input of another flip-flop, directly or through logic, and that flip-flop needs a steady input from the moment its own decision window opens. With a clock period $T$, that moment is $T - t_{su}$ after the edge that caused the stall. That is the deadline.

With the 10 ns period used in this section, the next window opens at 9 ns, and every one of those stalled captures settled long before it. Now make the clock faster. A shorter period brings the next decision window closer, and the same captures have less time.

| Clock period $T$ | Next window opens | Still unsettled, of 2,000 stalled captures |
|:-:|:-:|:-:|
| 10 ns | 9 ns | 0 |
| 8 ns | 7 ns | 1 |
| 7 ns | 6 ns | 6 |
| 6 ns | 5 ns | 16 |
| 5 ns | 4 ns | 59 |
| 4 ns | 3 ns | 222 |

At the slower clock the long waits are harmless. As the clock speeds up, a few of them reach the next decision window, and then more. When that happens the undecided value is handed to the next flip-flop, which now has a changing input inside its own window. The trouble has lasted more than one clock period and has started to spread, and the circuit is no longer reliable.

## Why It Cannot Be Designed Away

It is natural to ask for a flip-flop that simply does not do this. There is no such device. Anything that stores a bit has two stable states, and between any two stable states there is a balance point. A better flip-flop has a narrower window and settles faster, which makes a stall rarer and shorter, but the hilltop is always there.

Two things can be done, and they are the two halves of reliable design.

The first is to keep D from changing inside the window. For signals that come from other flip-flops on the same clock, this is entirely achievable: it is the timing requirement from Practical Considerations Overview, with the allowance for skew from Clock Skew. Meet it, and every push is a strong one.

The second applies to inputs that cannot be controlled, such as a push button or a signal from another system. Those will land inside the window sooner or later, and nothing can prevent it. What can be done is to **give the flip-flop time to settle** before anything else looks at its output. Since each bit of extra waiting makes an unsettled output much less likely, a modest amount of time reduces the risk to a negligible level. A circuit that provides that time is called a synchronizer, and it is the subject of Synchronizers.

## Key Takeaways

A metastable state is a condition in which a flip-flop's output is balanced between 0 and 1, hovering near the halfway level, before settling to one of them. A ball on a hill between two valleys is a good model: a strong push stores the new value, a weak push leaves the old one, and a marginal push can leave the ball balanced on top. In a flip-flop the strength of the push is set by when D changes relative to the clock. Before the decision window the push is strong and the result is reliable, after the window there is no push, and inside the window the push fades and the result is not guaranteed: the flip-flop may take the new value, keep the old one, or stall. How long a stall lasts cannot be predicted for any single case, but most are over almost immediately and long ones are rapidly rarer. The deadline that matters is the opening of the next decision window, $T - t_{su}$ after the clock edge, and a faster clock leaves less time to meet it. Metastability cannot be designed out of a storage element, so reliable circuits keep D out of the window where they can and allow settling time where they cannot.

## Review Questions

**1. In the ball-and-hill model, what does the ball balanced on top of the hill represent?**

A. A flip-flop storing a 1\
B. A flip-flop whose output is between 0 and 1 and has not yet settled\
C. A flip-flop that has lost power\
D. A flip-flop whose clock has stopped

**2. What determines whether a flip-flop receives a strong, marginal or weak push?**

A. How long the clock stays high\
B. Whether the new value of D is a 0 or a 1\
C. When D changes relative to the clock edge\
D. How many gates are connected to Q

**3. D changes inside the decision window on one clock edge. Which statement is correct?**

A. The flip-flop always enters a metastable state\
B. The flip-flop always keeps the old value\
C. The flip-flop takes the new value, since D changed before the edge\
D. The flip-flop may take the new value, keep the old value, or go metastable

**4. Many captures stall in a metastable state. What is true of the time they take to settle?**

A. Every stall lasts exactly one clock period\
B. Most settle very quickly, and longer waits are increasingly rare\
C. Every stall lasts until the flip-flop is reset\
D. The settling time is the same for every stall

**5. A flip-flop's output goes metastable. Why does a faster clock make this more likely to cause a failure?**

A. A faster clock makes the decision window wider\
B. A faster clock makes each stall last longer\
C. The next decision window opens sooner, leaving less time to settle\
D. A faster clock raises the setup time of the next flip-flop

**6. Why can metastability not be eliminated by using a better flip-flop?**

A. Any element with two stable states has a balance point between them\
B. Better flip-flops have wider decision windows\
C. Flip-flops are built from gates that are too slow\
D. The clock edge is never perfectly vertical

## Answer Explanations

**1. B.** The two valleys are the stable values 0 and 1. The hilltop between them is the balance point, and a ball there is in neither valley: the output is at an in-between level and has not yet resolved. The flip-flop is powered and clocked normally throughout (C, D).

**2. C.** The push is set by timing. If D changes before the decision window, the flip-flop sees a steady new value and the push is strong. If it changes inside the window, the flip-flop sees the old value for part of the window, and the later the change, the weaker the push. Which value D changes to (B) makes no difference; the same thing happens going from 1 to 0.

**3. D.** Inside the window the outcome is not guaranteed, and all three results are possible. A stall is only one of them, so A overstates it. Answer C is the tempting one: the change did come before the edge, but the requirement is that it come before the window, which opens a setup time earlier.

**4. B.** No single stall can be predicted, but over many the pattern is consistent. Most resolve almost immediately, and each additional stretch of waiting leaves far fewer still unsettled. That is the fact the synchronizer relies on.

**5. C.** The output has to be a valid level by the time the next flip-flop's decision window opens, which is $T - t_{su}$ after the edge. Shortening $T$ moves that deadline earlier. The stalls themselves are no longer than before (B), and the window is no wider (A); there is simply less time before something reads the result.

**6. A.** Storing a bit requires two stable states, and between any two stable states lies a point where the element is balanced. A better flip-flop narrows the range of timings that reach that point and leaves it faster, which makes trouble rarer, but the point itself cannot be removed.
