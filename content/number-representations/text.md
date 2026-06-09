## Number Representations

Before we build circuits that compute, we need a way to **represent information as bits**. A digital
system only ever stores and moves 1s and 0s, so every number, character, and signal we care about has
to be encoded into those two symbols. This section is about *how* — the conventions that let a string
of bits stand for a number, and the trade-offs each convention makes. Think of it as the map for the
topics that follow.

### Why representation comes first

A bit pattern like `1011` has no meaning on its own. It's only a number once we agree on a
**representation** — a rule for turning bits into values and back. Different rules serve different
goals: some make values easy for humans to read, some make arithmetic cheap for hardware, and some let
us represent negative numbers at all. Choosing a representation is a real engineering decision, and
the rest of this section works through the most important ones.

### What we'll accomplish

By the end of this section you'll be able to move fluently between representations and understand why
each exists:

- **Positional number systems and bases** — how the same idea behind decimal (place values, powers of
  the base) extends to **binary** (base 2) and **hexadecimal** (base 16), and why binary is the
  natural language of hardware.
- **Conversions** — converting **binary ↔ decimal** and **decimal ↔ hexadecimal**, including the
  divide-by-two method, so you can read a bit pattern as a value and express a value as bits.
- **Hexadecimal as shorthand** — using hex to write long binary patterns compactly (one hex digit per
  four bits) without changing what's stored.
- **Signed numbers** — how to represent **negative** values, working up from sign-magnitude to
  **two's complement**, the scheme real hardware uses because it builds subtraction into addition.
  We'll also see the **number wheel** as a mental model and the **two methods** for taking a two's
  complement, plus **overflow/underflow**.
- **Encoding non-numeric information** — representing text and other data with codes like **ASCII**,
  **Unicode**, and **Gray codes**, since "information" is more than just numbers.

### How it fits together

Each later topic is one piece of this map: a base, a conversion, or a signed-number scheme. Keeping
the big picture in mind — *bits are meaningless until a representation gives them meaning, and we pick
the representation to fit the job* — will make the individual techniques feel like variations on a
single theme rather than a list of unrelated rules.
