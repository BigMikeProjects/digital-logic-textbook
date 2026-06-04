# Full Adder

A **full adder** extends the half adder by including a carry input, making it suitable for multi-bit addition.

## Truth Table

| A | B | Cin | Sum | Cout |
|---|---|-----|-----|------|
| 0 | 0 | 0   | 0   | 0    |
| 0 | 0 | 1   | 1   | 0    |
| 0 | 1 | 0   | 1   | 0    |
| 0 | 1 | 1   | 0   | 1    |
| 1 | 0 | 0   | 1   | 0    |
| 1 | 0 | 1   | 0   | 1    |
| 1 | 1 | 0   | 0   | 1    |
| 1 | 1 | 1   | 1   | 1    |

## Boolean Expressions

- **Sum** = A ⊕ B ⊕ Cin
- **Cout** = (A · B) + (Cin · (A ⊕ B))

## Verilog Implementation

```verilog
module full_adder (
    input  wire a,
    input  wire b,
    input  wire cin,
    output wire sum,
    output wire cout
);

    assign sum  = a ^ b ^ cin;
    assign cout = (a & b) | (cin & (a ^ b));

endmodule
```

## Building from Half Adders

A full adder can be constructed using two half adders:

1. First half adder: adds A and B
2. Second half adder: adds the result to Cin
3. OR gate: combines the two carry outputs

## Applications

Full adders are the building blocks for:
- Ripple carry adders
- Carry lookahead adders
- ALU addition circuits
