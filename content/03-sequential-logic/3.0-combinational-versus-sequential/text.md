## Combinational versus Sequential: Why Circuits Need Memory

### Learning Objectives

By the end of this section, you should be able to:

- Distinguish between combinational and sequential circuits based on whether outputs depend on history.
- Explain why combinational logic alone cannot solve problems that require memory or sequencing.
- Identify real-world systems that require sequential behavior.
- Describe the role of feedback and state in transforming a combinational circuit into a sequential one.

---

## Everything So Far Has Been Timeless

Every circuit we have studied to this point shares a single defining property: **the output depends only on the current inputs.** Change the inputs, and the output changes immediately (after a small propagation delay). Remove the inputs, and the output has no reason to hold any particular value. There is no history, no memory, no sense of "what happened before."

These are combinational circuits. An AND gate, a multiplexer, a full adder, a ripple carry adder — each one computes a function of its inputs and nothing else. If you know the inputs right now, you know the output right now. The past is irrelevant.

This property is powerful. It makes combinational circuits easy to analyze, easy to test, and easy to compose. You can chain them together and predict the result by tracing signals from input to output. Truth tables capture their behavior completely. Boolean algebra gives you tools to simplify and optimize them.

But this property is also a limitation.

---

## The Problem That Combinational Logic Cannot Solve

Consider a simple scenario: you want a circuit that counts how many times a button has been pressed.

With combinational logic, you cannot build this. A combinational circuit has no way to remember that the button was pressed before. Every time you release the button, the circuit's only input returns to 0, and all evidence of the previous press vanishes. The circuit has no concept of "three presses ago" because it has no concept of "ago" at all.

Or consider a traffic light controller. The light must cycle through red, green, and yellow in a fixed sequence, holding each state for a defined period. The next state depends on the current state — green follows red, yellow follows green. A combinational circuit cannot express this because it has no notion of a current state. It cannot answer the question "what color am I showing right now?"

These are not exotic requirements. Nearly every useful digital system needs to:

- **Remember** a value after the input that produced it is gone
- **Count** events that occur over time
- **Sequence** through a series of steps in order
- **Decide** based on what has already happened, not just what is happening now

Combinational logic gives us computation. But computation without memory is like arithmetic without paper — you can add two numbers, but you cannot carry a running total.

---

## What Makes a Circuit Sequential

A sequential circuit is one whose output depends on both its current inputs **and** its internal state. That state represents a summary of the circuit's history — not a complete recording of everything that has happened, but enough information to determine what the circuit should do next.

The essential mechanism is **feedback**: routing an output back to serve as an input. When a circuit's output feeds back into itself, the circuit can sustain a value even after the original cause of that value is removed. This is the origin of memory in digital systems.

Consider the simplest possible example. Take two NOR gates and cross-couple them — connect the output of each gate to an input of the other. This creates a circuit with two stable states. Once it settles into one state, it remains there until an external input forces it to switch. The circuit remembers which state it was placed in. This is the S-R latch, which we will study in detail in the next section.

The critical insight is that **feedback turns a combinational circuit into a sequential one.** Without feedback, outputs are functions of inputs. With feedback, outputs are functions of inputs *and previous outputs*. Time enters the picture.

![A calculator computes its output from the numbers you enter right now — pure combinational logic. A scoreboard adds new points to a running total stored in memory, making it a sequential system where the output depends on both the current input and the previous state.](./images/combinational-vs-sequential-comparison.png)

A calculator illustrates the combinational side: enter 5 and 7, and the output is 12. It does not matter what you calculated before. A scoreboard illustrates the sequential side: when a team scores 3 points, the board does not just display 3 — it adds 3 to the previous score of 52 and displays 55. The new score depends on both the current input (points scored) and the stored state (previous score). Remove the input and the score remains. That persistence is what memory provides.

---

## State: The Circuit's Memory of What Matters

Sequential circuits maintain **state** — stored information that persists across changes in input. The number of bits of state determines how many distinct configurations the circuit can remember.

A single bit of state (one latch or flip-flop) can remember one of two conditions: on or off, locked or unlocked, high or low. Two bits of state can remember one of four conditions. Three bits can distinguish eight. In general, $n$ bits of state allow $2^n$ possible stored configurations.

This is exactly how we build systems that sequence, count, and control:

- A **2-bit counter** has 4 states (00, 01, 10, 11) and cycles through them in order.
- A **traffic light controller** might use 2 bits to encode its states (red, green, yellow, and perhaps a turning arrow).
- A **processor** uses many bits of state to track which instruction it is executing, what values are in its registers, and what condition codes have been set.

State is what transforms a circuit from a passive function into an active system — something that evolves over time and responds to sequences of events, not just individual snapshots.

---

## Two Worlds, One System

Combinational and sequential logic are not competing approaches. They are complementary, and virtually every real digital system uses both.

In a typical sequential system:

- **Combinational logic** computes what should happen next, based on the current inputs and the current state.
- **Sequential elements** (latches, flip-flops) store the result, holding it as the new state until the next update.

This cycle — compute, store, compute, store — is the heartbeat of synchronous digital design. A clock signal coordinates the rhythm, ensuring that state updates happen in an orderly, predictable fashion.

The processor in your computer works exactly this way. Combinational logic performs arithmetic, compares values, and selects data paths. Flip-flops store register values, program counters, and status flags. The clock ticks, and the state advances. Every instruction, every calculation, every decision is the product of combinational logic acting on sequential state.

---

## What Comes Next

The chapters that follow introduce the building blocks of sequential logic, starting from the simplest memory elements and building toward complete state machines.

We begin with **latches** — circuits that store a single bit using cross-coupled gates. Latches are transparent, meaning they can change state whenever their inputs change. This makes them simple but sometimes difficult to control in complex systems.

From latches, we develop **flip-flops** — edge-triggered storage elements that update only on clock transitions. Flip-flops give designers precise control over when state changes occur, making it possible to build reliable systems with predictable timing.

With flip-flops in hand, we construct **registers** (groups of flip-flops that store multi-bit values), **counters** (registers that cycle through sequences), and ultimately **finite state machines** — circuits that implement defined behaviors by transitioning between named states according to rules.

Each of these builds on the distinction introduced here: combinational circuits compute, sequential circuits remember. Together, they make digital systems capable of executing algorithms, controlling processes, and responding to the world over time.

---

## Review Questions

**1. What is the defining characteristic that distinguishes a sequential circuit from a combinational circuit?**

- A) Sequential circuits use NOR gates while combinational circuits use AND gates
- B) Sequential circuits are faster because they store intermediate results
- C) Sequential circuits have outputs that depend on both current inputs and stored internal state
- D) Sequential circuits require a power supply while combinational circuits do not

**2. Why can't a combinational circuit count the number of times a button is pressed?**

- A) Combinational circuits cannot process digital inputs from buttons
- B) Combinational circuits have no mechanism to retain information after an input changes
- C) Combinational circuits can only handle one input at a time
- D) Button presses generate analog signals that combinational circuits cannot interpret

**3. What mechanism transforms a combinational circuit into a sequential one?**

- A) Adding more logic gates to increase computational complexity
- B) Connecting a clock signal to synchronize the inputs
- C) Feedback — routing an output back to serve as an input
- D) Increasing the supply voltage to enable higher-speed operation

**4. A circuit has 4 bits of state. How many distinct configurations can it remember?**

- A) 4
- B) 8
- C) 16
- D) 32

**5. In a typical synchronous digital system, what are the respective roles of combinational logic and sequential elements?**

- A) Combinational logic stores data; sequential elements perform calculations
- B) Combinational logic computes the next state and outputs; sequential elements store the current state
- C) Combinational logic handles input; sequential elements handle output
- D) Combinational logic operates during clock high; sequential elements operate during clock low

---

## Answer Explanations

**1. Answer: C) Sequential circuits have outputs that depend on both current inputs and stored internal state**

The defining distinction is memory. A combinational circuit's output is determined entirely by its present inputs. A sequential circuit's output also depends on its internal state — information retained from previous inputs.

- *NOR vs AND gates* (A) is about gate types, not circuit classification. Both types of circuits can use any gate.
- *Speed* (B) is not the distinguishing factor. Sequential circuits are not inherently faster; the key difference is state, not speed.
- *Power supply* (D) is required by all active digital circuits, combinational and sequential alike.

**2. Answer: B) Combinational circuits have no mechanism to retain information after an input changes**

When the button is released, the input returns to 0 and all information about the previous press is lost. A combinational circuit computes a function of its current inputs only — it cannot accumulate a count because it cannot remember past events.

- *Cannot process digital inputs* (A) is incorrect — buttons produce digital signals that combinational circuits handle routinely.
- *One input at a time* (C) is incorrect — combinational circuits like adders handle many inputs simultaneously.
- *Analog signals* (D) is incorrect — buttons with proper debouncing produce clean digital signals.

**3. Answer: C) Feedback — routing an output back to serve as an input**

Feedback is the essential mechanism. When an output is connected back to an input, the circuit can sustain a value even after the original stimulus is removed. This self-reinforcing loop is what creates memory.

- *More gates* (A) adds computational complexity but does not create memory without feedback.
- *Clock signal* (B) is important for synchronizing sequential circuits, but feedback is what creates the memory. A clock without feedback does not produce state.
- *Supply voltage* (D) affects electrical characteristics but does not change the circuit's logical architecture.

**4. Answer: C) 16**

With $n$ bits of state, a circuit can distinguish $2^n$ configurations. For 4 bits: $2^4 = 16$ distinct states.

- *4* (A) confuses the number of bits with the number of states.
- *8* (B) would be $2^3$, which is 3 bits of state.
- *32* (D) would be $2^5$, which is 5 bits of state.

**5. Answer: B) Combinational logic computes the next state and outputs; sequential elements store the current state**

This is the standard model of synchronous design. Combinational logic takes the current state and inputs, computes what should happen next, and sequential elements (flip-flops) capture and hold that result as the new state.

- *Reversed roles* (A) gets it backwards — combinational logic computes, sequential elements store.
- *Input/output split* (C) is not how the division works. Both combinational and sequential elements can be involved in processing inputs and producing outputs.
- *Clock phase split* (D) describes a specific implementation technique (two-phase clocking) rather than the fundamental role distinction.
