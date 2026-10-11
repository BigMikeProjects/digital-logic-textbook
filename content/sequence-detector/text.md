A **sequence detector** watches a stream of bits arriving one per clock and raises an output whenever a particular pattern has just gone by. This topic builds one that looks for the pattern 1 0 1 0.

Sequence detectors are not especially important as circuits. They are worth building because one small problem takes you through every step of designing a finite state machine: stating the problem, drawing the state diagram, writing the state table, choosing a state assignment and arriving at a circuit. The step that takes real thought is the state diagram, and most of this topic is about a reliable way to draw it.

## The Problem

The machine has one input and one output.

- **x** is the serial input. One new bit arrives on each clock.
- **Z** is the output. It must be 1 for exactly one clock period each time the last four bits to arrive were 1 0 1 0, and 0 the rest of the time.

Z will be a **Moore** output, so it belongs to a state. The clock edge that samples the fourth bit of the pattern moves the machine into a state whose output is 1, and Z is 1 during the following clock period.

One question has to be settled before any design begins. Suppose the input is 1 0 1 0 1 0. The first four bits are a match. Bits three through six are also 1 0 1 0, and they share their first two bits with the end of the first match. Does that count as a second detection?

- In an **overlapping** detector it does. The end of one match may be the beginning of the next.
- In a **non-overlapping** detector it does not. Each bit can belong to one match at most, and after a detection the machine starts over.

Both are legitimate designs, and a specification has to say which one is wanted. This topic designs the overlapping version first and then shows how little has to change for the other.

## Digits Correct Toward the Sequence

The most useful question to ask about a sequence detector is this: **how many digits are correct toward the sequence so far?** That number is exactly what the machine has to remember from one clock to the next, and remembering is what states are for.

Follow the pattern in. Before anything has arrived, zero digits are correct. A 1 arrives, and it is the first digit of 1 0 1 0, so one digit is correct. A 0 follows, making 1 0, and two are correct. Then a 1, making 1 0 1, and three are correct. Then a 0 completes 1 0 1 0: all four are correct, and Z is raised.

The table below runs a longer stream through both versions. Each column is one clock period. The count shown is the number of digits correct coming into that clock, before its bit is sampled, which is the count the machine is holding during that clock. Z is 1 exactly where the count is 4.

| Clock | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| $x$ | 1 | 0 | 1 | 0 | 1 | 0 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 1 |
| Overlapping: digits correct | 0 | 1 | 2 | 3 | 4 | 3 | 4 | 0 | 1 | 1 | 2 | 3 | 4 | 0 |
| Overlapping: $Z$ | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| Non-overlapping: digits correct | 0 | 1 | 2 | 3 | 4 | 1 | 2 | 0 | 1 | 1 | 2 | 3 | 4 | 0 |
| Non-overlapping: $Z$ | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |

The two versions agree through clock 4, where both have four digits correct and both raise Z. The bit sampled during clock 4 is a 1, and that is where they part. Read backwards from that 1: the last three bits are 1 0 1, which is the first three digits of the pattern. The overlapping machine is allowed to reuse them, so it holds three digits correct. The non-overlapping machine has used up its match, so only the new 1 counts, and it holds one. The next bit is a 0. For the overlapping machine that completes a second match, and Z goes high in clock 6. The non-overlapping machine is only at two.

On this stream the overlapping detector reports three detections, in clocks 4, 6 and 12, and the non-overlapping detector reports two, in clocks 4 and 12.

## States Named by the Count

Since the machine has to remember a count from 0 to 4, it needs five states, one for each value.

| State | Digits correct | Bits it stands for | $Z$ |
|:-:|:-:|:-:|:-:|
| S0 | 0 | nothing useful | 0 |
| S1 | 1 | 1 | 0 |
| S2 | 2 | 1 0 | 0 |
| S3 | 3 | 1 0 1 | 0 |
| S4 | 4 | 1 0 1 0 | 1 |

The state number is the count. That makes the diagram easy to check as it is drawn, because every arc has to land on the state whose number matches the count after the new bit.

## Building the State Diagram

Start with S0 alone. Then take the states in order, and from each one ask two questions: if the next bit is a 0, how many digits are correct, and if it is a 1, how many? Each answer names a next state and becomes one arc. Every state gets exactly two arcs out, one for each value of x.

When the new bit is the next digit of the pattern, the count goes up by one. When it is not, the count does not necessarily drop to zero. Some of what has arrived may still be the start of a match. The rule is to look at the bits the state stands for with the new bit added on the end, and find **the longest ending of that string that is also a beginning of 1 0 1 0**. Its length is the new count.

**S0, zero correct.** A 1 is the first digit, so one is correct: go to S1. A 0 starts nothing, so the count is still zero: stay in S0.

**S1, one correct, holding 1.** A 0 makes 1 0, the first two digits: go to S2. A 1 makes 1 1. That is wrong as a second digit, but the new 1 could itself be a first digit, so one is still correct: stay in S1.

**S2, two correct, holding 1 0.** A 1 makes 1 0 1, three correct: go to S3. A 0 makes 1 0 0. No ending of that string, not 1 0 0, not 0 0, not 0, is a beginning of the pattern. The sequence is broken and the machine starts over: go to S0.

**S3, three correct, holding 1 0 1.** A 0 completes 1 0 1 0: go to S4, the state where Z is 1. A 1 makes 1 0 1 1. The pattern is broken, but not completely. Try the endings from longest to shortest:

| Ending of 1 0 1 1 | Beginning of 1 0 1 0 | Same? |
|:-:|:-:|:-:|
| 1 0 1 1 | 1 0 1 0 | no |
| 0 1 1 | 1 0 1 | no |
| 1 1 | 1 0 | no |
| 1 | 1 | yes |

One digit survives: go to S1.

**S4, four correct, holding 1 0 1 0.** This is the state that decides between the two versions. In the overlapping machine the four bits are still available. A 0 makes 1 0 1 0 0, and no ending of that is a beginning of the pattern: go to S0. A 1 makes 1 0 1 0 1, whose last three bits are 1 0 1, the first three digits of the next match: go to S3.

That finishes the diagram. Every arc lands on a state that already exists, so no more states are needed.

## The State Table

Writing each state's two arcs as a row gives the state table.

| Present state | Next state, $x = 0$ | Next state, $x = 1$ | $Z$ |
|:-:|:-:|:-:|:-:|
| S0 | S0 | S1 | 0 |
| S1 | S2 | S1 | 0 |
| S2 | S0 | S3 | 0 |
| S3 | S4 | S1 | 0 |
| S4 | S0 | S3 | 1 |

It is worth tracing the stream from the earlier table through it. The machine starts in S0. The bits 1, 0, 1, 0 take it to S1, S2, S3 and S4, and Z is 1 while it is in S4. The next bit, a 1, takes it from S4 to S3, and the 0 after that takes it back to S4 for the second detection. The state numbers along the way are the "digits correct" row.

## The Non-Overlapping Version

The non-overlapping detector uses the same five states and the same reasoning, with one difference. When the machine is in S4, the match has been reported and its four bits are used up. Only the new bit counts.

A 0 starts nothing, so S4 still goes to S0. A 1 is a new first digit, so S4 goes to S1 where the overlapping machine went to S3.

| Present state | Next state, $x = 0$ | Next state, $x = 1$ | $Z$ |
|:-:|:-:|:-:|:-:|
| S0 | S0 | S1 | 0 |
| S1 | S2 | S1 | 0 |
| S2 | S0 | S3 | 0 |
| S3 | S4 | S1 | 0 |
| S4 | S0 | **S1** | 1 |

One entry in the table has changed, which is one arc in the diagram. Everything else about the two machines is identical. The difference in behavior seen earlier, three detections against two, comes entirely from where that one arc goes.

## From the Table to a Circuit

With the state table finished, what remains is the state assignment and the logic, and both have been covered in earlier topics.

A binary assignment uses the fewest flip-flops. Five states need three, because two flip-flops give only four codes. Three flip-flops give eight codes, so three go unused. From there the work is the usual one: a transition table, a K-map for each D input, and the equations, as in Binary State Assignment.

A one-hot assignment uses one flip-flop per state, five here, with exactly one of them holding a 1. It costs more flip-flops and almost no design effort, because the equations can be read directly from the diagram. As One Hot State Assignment explains, the D input of a state's flip-flop is 1 exactly when the machine is about to enter that state, so it is one AND term for each arc coming in, ORed together.

Take S1 in the overlapping machine. Three arcs enter it: from S0 on a 1, from S1 itself on a 1, and from S3 on a 1. All three are on $x = 1$, so the x factors out:

$$D_{S1} = x\,S_0 + x\,S_1 + x\,S_3 = x\,(S_0 + S_1 + S_3)$$

Doing the same for every state gives the whole circuit.

| | Overlapping | Non-overlapping |
|:-:|:-:|:-:|
| $D_{S0}$ | $\bar{x}\,(S_0 + S_2 + S_4)$ | $\bar{x}\,(S_0 + S_2 + S_4)$ |
| $D_{S1}$ | $x\,(S_0 + S_1 + S_3)$ | $x\,(S_0 + S_1 + S_3 + S_4)$ |
| $D_{S2}$ | $\bar{x}\,S_1$ | $\bar{x}\,S_1$ |
| $D_{S3}$ | $x\,(S_2 + S_4)$ | $x\,S_2$ |
| $D_{S4}$ | $\bar{x}\,S_3$ | $\bar{x}\,S_3$ |
| $Z$ | $S_4$ | $S_4$ |

The one arc that differs shows up as the $S_4$ term. In the overlapping machine it is in the equation for $S_3$, and in the non-overlapping machine it is in the equation for $S_1$, because that is where the arc from S4 on a 1 arrives. The output needs no logic at all. Z is 1 only in S4, so Z is simply the output of the S4 flip-flop, which is typical of a Moore machine built one-hot.

A one-hot machine has to be started with S0 at 1 and the other four flip-flops at 0. All zeros is not one of its states, and a machine that found itself there would stay there, since every D input needs some flip-flop to be 1.

## The Same Machine in Verilog

The one-hot equations for the overlapping detector translate line for line.

```verilog
module detect_1010 (
    input  wire clk,
    input  wire reset,
    input  wire x,
    output wire Z
);
    reg S0, S1, S2, S3, S4;           // one flip-flop per state; exactly one is 1

    always @(posedge clk)
        if (reset) {S4, S3, S2, S1, S0} <= 5'b00001;      // start in S0
        else begin
            S0 <= ~x & (S0 | S2 | S4);
            S1 <=  x & (S0 | S1 | S3);
            S2 <= ~x &  S1;
            S3 <=  x & (S2 | S4);    // overlapping: S4 on a 1 keeps three digits
            S4 <= ~x &  S3;
        end

    assign Z = S4;                    // Moore output: all four digits correct
endmodule
```

The non-overlapping version changes two lines: `S1 <= x & (S0 | S1 | S3 | S4);` and `S3 <= x & S2;`. A testbench that runs both versions on the fourteen-bit stream from the earlier table prints the following (simulated with Icarus Verilog). Each line shows the bit on x during that clock, and for each version the number of the flip-flop that is high and the output.

```
clock  0: x=1  overlapping: 0 correct, Z=0   non-overlapping: 0 correct, Z=0
clock  1: x=0  overlapping: 1 correct, Z=0   non-overlapping: 1 correct, Z=0
clock  2: x=1  overlapping: 2 correct, Z=0   non-overlapping: 2 correct, Z=0
clock  3: x=0  overlapping: 3 correct, Z=0   non-overlapping: 3 correct, Z=0
clock  4: x=1  overlapping: 4 correct, Z=1   non-overlapping: 4 correct, Z=1
clock  5: x=0  overlapping: 3 correct, Z=0   non-overlapping: 1 correct, Z=0
clock  6: x=0  overlapping: 4 correct, Z=1   non-overlapping: 2 correct, Z=0
clock  7: x=1  overlapping: 0 correct, Z=0   non-overlapping: 0 correct, Z=0
clock  8: x=1  overlapping: 1 correct, Z=0   non-overlapping: 1 correct, Z=0
clock  9: x=0  overlapping: 1 correct, Z=0   non-overlapping: 1 correct, Z=0
clock 10: x=1  overlapping: 2 correct, Z=0   non-overlapping: 2 correct, Z=0
clock 11: x=0  overlapping: 3 correct, Z=0   non-overlapping: 3 correct, Z=0
clock 12: x=0  overlapping: 4 correct, Z=1   non-overlapping: 4 correct, Z=1
clock 13: x=1  overlapping: 0 correct, Z=0   non-overlapping: 0 correct, Z=0
detections: overlapping 3, non-overlapping 2
```

The simulation matches the hand trace clock for clock, including the two clocks after the first detection where the versions differ.

## Key Takeaways

A sequence detector raises its output when a chosen pattern has just arrived on a serial input, and designing one exercises the whole finite state machine flow from problem statement to circuit. The idea that makes the state diagram manageable is to name each state by the number of digits correct toward the sequence, since that count is what the machine must remember. A four-bit pattern needs five states, S0 through S4, and the Moore output is 1 only in the last. The diagram is built one state at a time by asking what a 0 and a 1 each do to the count: the next digit of the pattern adds one, and a wrong bit keeps the longest ending of the bits so far that is also a beginning of the pattern. Overlapping and non-overlapping detectors differ in a single arc, the one leaving the final state on a 1, which goes to S3 when the matched bits may be reused and to S1 when they may not. Five states need three flip-flops with a binary assignment or five with one-hot, and the one-hot equations are read straight off the diagram, one AND term per arc entering a state, with Z taken directly from the S4 flip-flop.

## Review Questions

**1. In the 1 0 1 0 detector, what does the machine being in state S2 mean?**

A. Two clock periods have passed since reset\
B. The last two bits to arrive were 1 0, the first two digits of the pattern\
C. The pattern has been detected twice\
D. The input x has been 1 on two clocks so far

**2. The machine is in S3, holding 1 0 1, and the next bit is a 1. What is the next state?**

A. S0, because the pattern is broken\
B. S1, because the new 1 could be the first digit of a match\
C. S3, because three digits are still correct\
D. S4, because four bits have now arrived

**3. The overlapping detector is in S4 and the next bit is a 1. Why does it go to S3?**

A. S3 is the state just before S4, so the machine steps back one\
B. A 1 always sends the machine to an odd-numbered state\
C. The bits 1 0 1 0 1 end in 1 0 1, the first three digits of the next match\
D. The match is used up, so only the new 1 counts

**4. How do the state diagrams of the overlapping and non-overlapping detectors differ?**

A. The non-overlapping version needs a sixth state\
B. Every arc leaving S4 is different\
C. Only the arc leaving S4 on $x = 1$ is different\
D. The output Z moves from S4 to S3

**5. The input stream is 1 0 1 0 1 0 1 0. How many times does each version raise Z?**

A. Overlapping 3, non-overlapping 2\
B. Overlapping 2, non-overlapping 2\
C. Overlapping 4, non-overlapping 2\
D. Overlapping 3, non-overlapping 1

**6. In the one-hot circuit for the overlapping detector, $D_{S0} = \bar{x}\,(S_0 + S_2 + S_4)$. Where do the three state terms come from?**

A. They are the three states whose output Z is 0\
B. They are the three states with an arc into S0, each on $x = 0$\
C. They are the three states S0 has arcs leading to\
D. They are the even-numbered states, which always reset the count

## Answer Explanations

**1. B.** A state stands for the number of digits correct toward the sequence, and S2 is two: the most recent bits are 1 0. It says nothing about how long the machine has been running (A) or how many 1s have arrived in total (D). After any amount of mismatched input the machine can still be in S2.

**2. B.** The bits become 1 0 1 1. Trying the endings from longest to shortest, 1 0 1 1, 0 1 1 and 1 1 are not beginnings of 1 0 1 0, but the single 1 is. One digit is correct, so the next state is S1. Going all the way back to S0 (A) would throw away a 1 that can start the next match, and the machine would then miss a pattern beginning on that bit.

**3. C.** In the overlapping version the bits of a completed match may be reused. With the new bit the machine has seen 1 0 1 0 1, and the longest ending that is also a beginning of the pattern is 1 0 1, three digits. Answer D describes the non-overlapping version, which goes to S1 from here.

**4. C.** Both machines have the same five states and the same arcs out of S0 through S3. From S4 on a 0, both go to S0. Only S4 on a 1 differs: S3 when overlapping, S1 when not. That single arc accounts for all the difference in behavior.

**5. A.** The pattern 1 0 1 0 ends at bits 4, 6 and 8 of this stream, and each of those matches shares two bits with the one before it. The overlapping detector counts all three. The non-overlapping detector counts the first, starts over, and finds the second complete match in bits 5 through 8, for two.

**6. B.** A one-hot D input is 1 when the machine is about to enter that state, so it has one term for each incoming arc. S0 is entered from itself, from S2 and from S4, in every case on a 0, which is why $\bar{x}$ factors out. Answer C has the direction backwards: the equation is built from arcs coming in, not arcs going out.
