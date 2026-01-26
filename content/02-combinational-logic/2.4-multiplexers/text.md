# Multiplexers: Data Selection Circuits

A **multiplexer** (or MUX) is a combinational circuit that selects one of several input signals and forwards it to a single output. Think of it as a digitally-controlled switch.

## What You'll Learn

In this section, we'll explore:

1. **2-to-1 Multiplexer** — The simplest MUX with one select line
2. **4-to-1 Multiplexer** — Expanding to two select lines
3. **Larger Multiplexers** — 8-to-1, 16-to-1, and building hierarchies
4. **MUX Applications** — Data routing, function implementation, and more

## Why Multiplexers Matter

Multiplexers are everywhere in digital systems:

- **Data routing** in buses and memory systems
- **Function generators** — any Boolean function can be implemented with a MUX
- **Time-division multiplexing** in communications
- **Resource sharing** in processors

## Basic Concept

A multiplexer with $n$ select lines can choose from $2^n$ inputs:

| MUX Type | Select Lines | Data Inputs |
|----------|--------------|-------------|
| 2-to-1   | 1            | 2           |
| 4-to-1   | 2            | 4           |
| 8-to-1   | 3            | 8           |
| 16-to-1  | 4            | 16          |

## Coming Soon

This section is under development. Topics will include:

- MUX truth tables and Boolean expressions
- Gate-level implementations
- Cascading multiplexers
- Demultiplexers (the reverse operation)
- Verilog implementations

Click **Next** to continue, or check back later for updates to this section.
