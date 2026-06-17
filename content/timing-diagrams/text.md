# Timing Diagrams

So far we have studied what a logic circuit *does*: given a set of inputs, we find the outputs using Boolean algebra, a truth table, or a gate-level schematic. That is a **static** view — a single snapshot. But it leaves out a question that matters enormously in real hardware: *when* do things happen? In a real digital system the inputs do not all change at the same instant, a signal is a voltage level that does not switch perfectly cleanly, gates take real time to respond, and a clock coordinates activity across the whole system. To reason about behavior over time, we need more than a snapshot of output values. That is what a **timing diagram** gives us.

## What a Timing Diagram Shows

A timing diagram plots each signal's logic value against a shared horizontal **time axis**. Time runs left to right; each signal is drawn as a waveform that is high when the value is `1` and low when it is `0`, with vertical edges marking transitions. Reading down a single vertical slice tells you the state of every signal at that instant; reading across a signal shows how it evolves. Where a truth table answers "what is the output for these inputs," a timing diagram answers "how do the signals move as the inputs change over time."

## An Idealized Example

The cleanest way to start is with an **idealized** timing diagram — one that ignores gate delay, so every response appears to happen instantaneously. This lets us focus purely on the *sequence* of behavior. (We will add realistic delays later.)

Consider a simple two-gate circuit over inputs $A$, $B$, and $C$: an AND gate feeds an OR gate, computing

$$Y = (A \cdot B) + C$$

Call the AND-gate output the **product term** $P = A \cdot B$; the final output is $Y = P + C$. We march time forward one input transition at a time and recompute $P$ and $Y$ after each change:

| Step | Event | $A$ | $B$ | $C$ | $P = A\cdot B$ | $Y = P + C$ | Output changed? |
|------|-------|-----|-----|-----|----------------|-------------|-----------------|
| 0 | initial | 0 | 0 | 0 | 0 | 0 | — |
| 1 | $A$: 0→1 | 1 | 0 | 0 | 0 | 0 | no |
| 2 | $B$: 0→1 | 1 | 1 | 0 | 1 | 1 | **yes ↑** |
| 3 | $A$: 1→0 | 0 | 1 | 0 | 0 | 0 | **yes ↓** |
| 4 | $C$: 0→1 | 0 | 1 | 1 | 0 | 1 | **yes ↑** |
| 5 | $A$: 0→1 | 1 | 1 | 1 | 1 | 1 | no |
| 6 | $C$: 1→0 | 1 | 1 | 0 | 1 | 1 | no |

Drawn as waveforms, the same story looks like this:

```
        step:  0   1   2   3   4   5   6
              ___     ___________     _______
   A      ___|   |___|           |___|        
                  _______________________________
   B      _______|                                
                              ___________________
   C      ___________________|           |_______
                  ___     ___________________
   P      _______|   |___|                   ...   (P = A·B)
                  _______     ___________________
   Y      _______|       |___|                     (Y = P + C)
```

Several lessons fall out of the walkthrough:

- **An input can change without the output changing.** At step 1, $A$ rises while $B$ is still `0`. The product term is $1 \cdot 0 = 0$, so $Y$ stays `0`. The diagram records that $A$ moved, even though nothing downstream did.
- **An input change can propagate to the output.** At step 2, $B$ rises while $A = 1$, so $P$ becomes `1`; ORed with $C$, the output goes high. Here the input change *did* cause an output change.
- **An OR input can dominate.** At step 4, driving $C$ high forces $Y$ high regardless of the product term — for an OR, any `1` input is enough.
- **An internal change can be invisible at the output.** At step 5, $A$ rises so $P$ becomes `1`, but $Y$ was *already* `1` (because $C = 1$), so the output does not visibly change.

The exact bit sequence is not the point; the point is the **method**. You can step through the input transitions and build a diagram that captures how the circuit behaves over time for a given set of input conditions.

## Idealized vs. Real Timing

Because this diagram is idealized, every response is drawn as immediate — the output edge lines up exactly with the input edge that caused it. A real circuit does not behave that way. Gates take time to switch, so a change **cascades** with delay: when $B$ transitions, the product term $P$ transitions a little later, and only after a further delay does the OR output $Y$ transition. Each gate the signal passes through adds its own propagation delay.

For now we use idealized diagrams to learn the behavior cleanly. Later topics layer in the realistic detail — accounting for gate **propagation delay**, and using other diagram forms such as multi-bit **bus** signals, where a waveform carries a whole value rather than a single bit. Timing diagrams are a tool we will use throughout the rest of the course, especially once clocks and sequential circuits enter the picture.

## Connection to Simulation

A timing diagram is exactly what a logic simulator produces. If we describe the circuit in Verilog,

```verilog
module and_or (input  A, B, C, output Y);
    assign Y = (A & B) | C;   // product term A·B, ORed with C
endmodule
```

then a testbench that drives $A$, $B$, and $C$ through the transitions above makes the simulator's waveform viewer draw the very same diagram. Reading and sketching timing diagrams by hand builds the intuition for interpreting those simulation waveforms later.

## Key Takeaways

A timing diagram shows *when* signals change, plotting each signal's value against a shared time axis — the dynamic complement to the static view given by Boolean algebra and truth tables. We start with idealized diagrams that ignore gate delay so the sequence of behavior is clear, using a small example, $Y = (A \cdot B) + C$, and stepping through input transitions one at a time while recomputing the internal product term and the output. The walkthrough shows that an input change may or may not reach the output (it depends on the other inputs), that an OR input set to `1` dominates the output, and that a change landing on an already-set output is invisible. Real circuits differ in that changes cascade through gates with propagation delay, which—along with multi-bit bus signals—is added in later topics. A timing diagram is the same picture a logic simulator's waveform viewer draws.

## Review Questions

**1. What does a timing diagram primarily show that a truth table does not?**
A. The number of gates in a circuit
B. How signals change over time
C. The minimal sum-of-products expression
D. The power consumption of the circuit

**2. In an *idealized* timing diagram, how are gate delays treated?**
A. They are exaggerated to make them visible
B. They are measured precisely for each gate
C. They are ignored, so responses appear instantaneous
D. They are replaced by clock edges

**3. For the circuit $Y = (A \cdot B) + C$, input $A$ rises from 0 to 1 while $B = 0$ and $C = 0$. What happens to the output $Y$?**
A. $Y$ rises to 1 immediately
B. $Y$ stays at 0
C. $Y$ briefly glitches then settles at 1
D. $Y$ becomes undefined

**4. Still on $Y = (A \cdot B) + C$, the input $C$ is driven to 1 while the product term $A \cdot B = 0$. What is the output?**
A. 0, because the product term is 0
B. Undefined, because the inputs conflict
C. 1, because an OR with any 1 input is 1
D. It depends on the previous value of $Y$

**5. Why can an input transition sometimes leave the output unchanged?**
A. Timing diagrams cannot represent simultaneous changes
B. The change may not propagate given the other inputs (e.g., ANDed with 0, or the output is already 1)
C. The output only updates on a clock edge
D. Inputs never actually affect the output

**6. In a *real* (non-idealized) circuit, how does a change at input $B$ reach the output of $Y = (A\cdot B)+C$?**
A. Instantaneously, with no delay
B. It cascades with delay: $B$ → product term → OR output
C. Only after the next clock cycle
D. It never reaches the output

## Answer Explanations

**1. B.** A timing diagram plots signals against a time axis to show *when* they change — the dynamic view. A truth table gives the static input-to-output mapping but says nothing about timing. The other options are unrelated to what a timing diagram depicts.

**2. C.** An idealized timing diagram deliberately ignores gate delay so that each output response appears to occur at the same instant as the input that caused it, letting you focus on the sequence of behavior. Realistic delays are introduced later.

**3. B.** The product term is $A \cdot B = 1 \cdot 0 = 0$, and $Y = 0 + 0 = 0$. The input $A$ changed, but because $B$ is 0 the change does not propagate, so $Y$ stays at 0.

**4. C.** $Y$ is an OR of the product term and $C$. Any OR with a `1` input is `1`, so driving $C$ to 1 forces $Y = 1$ regardless of the product term's value.

**5. B.** Whether a transition reaches the output depends on the rest of the circuit's state: a change ANDed with a 0 is blocked, and a change that would set an output already holding `1` produces no visible difference. Options C and D describe different (sequential) or simply incorrect behavior.

**6. B.** In a real circuit each gate adds propagation delay, so the effect of a $B$ transition appears first at the AND (product) term and then, after further delay, at the OR output — the change cascades through the gates rather than appearing instantly.
