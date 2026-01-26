# Half Adder Basics

A **half adder** is one of the most fundamental building blocks in digital logic design. It performs the addition of two single binary digits.

## Truth Table

| A | B | Sum | Carry |
|---|---|-----|-------|
| 0 | 0 | 0   | 0     |
| 0 | 1 | 1   | 0     |
| 1 | 0 | 1   | 0     |
| 1 | 1 | 0   | 1     |

## Boolean Expressions

The half adder implements two key functions:

- **Sum** = A ⊕ B (XOR operation)
- **Carry** = A · B (AND operation)

## Verilog Implementation

```verilog
module half_adder (
    input  wire a,
    input  wire b,
    output wire sum,
    output wire carry
);

    assign sum   = a ^ b;  // XOR for sum
    assign carry = a & b;  // AND for carry

endmodule
```

## Key Concepts

1. **XOR Gate**: Produces a 1 when inputs differ
2. **AND Gate**: Produces a 1 only when both inputs are 1
3. **No Carry Input**: Unlike a full adder, a half adder has no carry input

## Limitations

The half adder cannot handle a carry input from a previous addition. This is why it's called a "half" adder—it only does half the job needed for multi-bit addition. For complete addition chains, we need a **full adder**, which we'll cover in the next section.

## Applications

Half adders are used as:
- Building blocks for full adders
- Simple 1-bit addition circuits
- Part of increment/decrement circuits
