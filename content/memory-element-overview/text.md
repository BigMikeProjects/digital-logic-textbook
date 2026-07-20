# Memory Element Overview

Everything we have built so far has been **combinational**: the output is a pure function of the
current inputs, and the instant the inputs change, the output follows. Nothing is remembered. To
design **sequential** circuits — anything that has state, counts, sequences, or responds to a clock
— we need a new ingredient: a circuit that can **remember**. That circuit is a **memory element**,
and this topic is the map of the whole section that builds one up.

## What a memory element does

A memory element stores a single bit — a **0 or a 1**. Two behaviors define it:

- **Set** it to `1` with a control signal, then **remove that signal**, and the `1` *stays*.
- Later, **reset** it back to `0` with another signal.

That ability to *hold a value after the input is taken away* is exactly what combinational logic
cannot do, and it is the entire point of a memory element. One bit of storage, set and reset on
command, holding in between.

## The path through the section

There is a lot of detail coming — gate-level constructions, truth tables, timing — so it helps to
carry the **big picture** first. The section is built as a chain, where each element is a refinement
of the one before it:

### 1. SR latch — the starting point

The most basic memory element is the **SR latch**. It provides **bistable storage**: driven by its
allowed inputs, it settles into one of **two stable states** — a `1` or a `0`. (That is what the
"bi" in *bistable* means: two.) The SR latch is where storage begins, and everything after it is a
variation on this idea.

### 2. S′-R′ latch — the same idea, built from NAND

The next step is an intermediate one. The same set/reset behavior can be built from **cross-coupled
NAND gates**, which is the traditional, historical way to construct a latch. The result is the
**S′-R′ latch**: it does the same job as the SR latch, but its set and reset are initiated by
**active-low** signals (you assert them by pulling them *low*). It is a natural stepping stone on the
way to the next element.

### 3. D (data) latch — trade set/reset for data + enable

With the **D (data) latch**, we **drop the notions of set and reset entirely**. Instead of two
controls that force the output high or low, we provide a single **data** input `D` — the value we
want to store — and capture it at an **enable** time. The messy "which control do I assert?"
question is cast away in favor of "here is the bit, store it when enabled."

### 4. Flip-flop — from level-dependent to edge-triggered

The D latch, though, is **imperfect**: it is **level-dependent**. While its enable is active, the
stored value can change at *any* time — the output tracks the data throughout that whole window.
What we really want is for the value to change **only on a clock edge**, at one crisp instant, and
to stay put through the rest of the clock cycle. Modifying the latch to be **edge-triggered** gives
us the **flip-flop** — and the flip-flop turns out to be the **basic memory element used for most
digital-systems design.**

## The one thing to carry forward

Read as one line, the section is:

$$\text{SR latch} \;\rightarrow\; \text{S′-R′ latch (NAND)} \;\rightarrow\; \text{D latch} \;\rightarrow\; \text{flip-flop}$$

Every element does the same fundamental job — **hold one bit** — and each step refines *how you
control the write*: from raw set/reset, to the NAND-native form, to a single data input gated by an
enable, and finally to a value that latches cleanly on a **clock edge**. The flip-flop is the
destination; the latches are the story of how we get there. Keep that arc in mind as the detailed
topics fill it in.

## Key Takeaways

A **memory element** stores one bit and, crucially, **holds it after the setting signal is
removed** — the capability combinational logic lacks and the foundation of all sequential design.
The section builds the idea in four steps: the **SR latch** (bistable storage, two stable states) →
the **S′-R′ latch** built from **cross-coupled NAND gates** with active-low controls (the same
behavior in its traditional form) → the **D (data) latch**, which discards set/reset in favor of a
**data input captured at an enable** → the **flip-flop**, which fixes the D latch's **level-dependent**
behavior by making it **edge-triggered**, changing state only on a **clock edge**. The flip-flop is
the basic memory element used throughout digital-systems design; the latches are the stepping stones
that explain why it is built the way it is.

## Review Questions

**1. What distinguishes a memory element from a combinational circuit?**
A. It uses fewer gates
B. It can hold a stored value after the setting input is removed
C. Its output always equals its current inputs
D. It has no inputs

**2. "Bistable," as used to describe the SR latch, means the circuit:**
A. Has two inputs
B. Runs on two power supplies
C. Settles into one of two stable states (0 or 1)
D. Changes state twice per clock

**3. The S′-R′ latch is traditionally built from which cross-coupled gates?**
A. NAND gates
B. XOR gates
C. AND gates
D. Buffers

**4. What does the D (data) latch replace the set/reset controls with?**
A. A clock only
B. A single data input captured at an enable time
C. Two enables
D. Nothing — it keeps set and reset

**5. In what sense is the D latch "imperfect," motivating the flip-flop?**
A. It cannot store a 1
B. It is level-dependent — it can change any time its enable is active
C. It needs three gates
D. It has no data input

**6. What is the defining improvement of a flip-flop over a latch?**
A. It stores more bits
B. It is edge-triggered — it changes state only on a clock edge
C. It removes the need for a data input
D. It is purely combinational

## Answer Explanations

**1. B.** A memory element stores a bit and *holds* it once the setting signal is removed; that
persistence is exactly what combinational logic (whose output always tracks its current inputs,
option C) cannot provide.

**2. C.** *Bistable* means two stable states — the latch rests in either the `0` or the `1` state
until an allowed input tells it to change. The "bi" is *two*, not two inputs or two supplies.

**3. A.** The S′-R′ latch is the cross-coupled **NAND** form — the traditional, historical way to
build a latch — with active-low set/reset controls.

**4. B.** The D latch drops set/reset and instead takes a single **data** input `D`, storing its
value at an **enable** time. "Here is the bit, capture it when enabled."

**5. B.** The D latch is **level-dependent**: while its enable is active, the output can change at
any moment during that window. That looseness is the flaw the flip-flop fixes.

**6. B.** A flip-flop is **edge-triggered** — it samples and updates its stored value only at a
**clock edge**, staying put the rest of the cycle. That clean, one-instant capture is why flip-flops
are the workhorse memory element of digital-systems design.
