# Ripple Carry Adder

A **ripple carry adder** chains multiple full adders together to add multi-bit binary numbers.

## Concept

To add two 4-bit numbers:
1. Connect 4 full adders in series
2. The carry output of each adder connects to the carry input of the next
3. The carry "ripples" through the chain

## 4-Bit Ripple Carry Adder

```
    A3 B3      A2 B2      A1 B1      A0 B0
     │  │       │  │       │  │       │  │
     ▼  ▼       ▼  ▼       ▼  ▼       ▼  ▼
   ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
   │ FA  │◄───│ FA  │◄───│ FA  │◄───│ FA  │◄── 0 (Cin)
   └──┬──┘    └──┬──┘    └──┬──┘    └──┬──┘
      │          │          │          │
      ▼          ▼          ▼          ▼
    Cout        S3         S2         S1         S0
```

## Verilog Implementation

```verilog
module ripple_carry_adder_4bit (
    input  wire [3:0] a,
    input  wire [3:0] b,
    input  wire       cin,
    output wire [3:0] sum,
    output wire       cout
);

    wire c1, c2, c3;

    full_adder fa0 (.a(a[0]), .b(b[0]), .cin(cin), .sum(sum[0]), .cout(c1));
    full_adder fa1 (.a(a[1]), .b(b[1]), .cin(c1),  .sum(sum[1]), .cout(c2));
    full_adder fa2 (.a(a[2]), .b(b[2]), .cin(c2),  .sum(sum[2]), .cout(c3));
    full_adder fa3 (.a(a[3]), .b(b[3]), .cin(c3),  .sum(sum[3]), .cout(cout));

endmodule
```

## Example: Adding 5 + 3

```
    0101  (5)
  + 0011  (3)
  ──────
    1000  (8)
```

| Bit | A | B | Cin | Sum | Cout |
|-----|---|---|-----|-----|------|
| 0   | 1 | 1 | 0   | 0   | 1    |
| 1   | 0 | 1 | 1   | 0   | 1    |
| 2   | 1 | 0 | 1   | 0   | 1    |
| 3   | 0 | 0 | 1   | 1   | 0    |

## Propagation Delay

The main disadvantage of ripple carry adders is **propagation delay**:

- Each full adder must wait for the carry from the previous stage
- Total delay = n × (delay per full adder)
- For large bit widths, this becomes slow

## Delay Analysis

If each full adder has a carry delay of Δt:
- 4-bit adder: 4Δt
- 8-bit adder: 8Δt
- 32-bit adder: 32Δt
- 64-bit adder: 64Δt

## Alternatives

For faster addition, consider:
- **Carry Lookahead Adder**: Calculates carries in parallel
- **Carry Select Adder**: Pre-computes results for both carry cases
- **Carry Skip Adder**: Bypasses chains of propagating carries

## When to Use Ripple Carry

✅ Good for:
- Small bit widths (4-8 bits)
- Low-power designs
- Learning and prototyping

❌ Avoid for:
- High-speed applications
- Large bit widths (32+ bits)
- Critical timing paths
