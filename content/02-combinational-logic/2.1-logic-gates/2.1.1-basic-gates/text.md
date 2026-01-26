# Basic Logic Gates

Logic gates are the fundamental building blocks of digital circuits. Each gate performs a specific Boolean operation.

## The Three Primary Gates

### AND Gate

Outputs 1 only when **all** inputs are 1.

| A | B | A AND B |
|---|---|---------|
| 0 | 0 | 0       |
| 0 | 1 | 0       |
| 1 | 0 | 0       |
| 1 | 1 | 1       |

**Symbol**: Flat back, curved front
**Expression**: Y = A · B

### OR Gate

Outputs 1 when **any** input is 1.

| A | B | A OR B |
|---|---|--------|
| 0 | 0 | 0      |
| 0 | 1 | 1      |
| 1 | 0 | 1      |
| 1 | 1 | 1      |

**Symbol**: Curved back, pointed front
**Expression**: Y = A + B

### NOT Gate (Inverter)

Outputs the **opposite** of the input.

| A | NOT A |
|---|-------|
| 0 | 1     |
| 1 | 0     |

**Symbol**: Triangle with bubble
**Expression**: Y = A̅ or Y = ¬A

## Verilog Implementation

```verilog
module basic_gates (
    input  wire a,
    input  wire b,
    output wire and_out,
    output wire or_out,
    output wire not_out
);

    assign and_out = a & b;   // AND
    assign or_out  = a | b;   // OR
    assign not_out = ~a;      // NOT

endmodule
```

## Universal Gates

**NAND** and **NOR** gates are called "universal" because any other gate can be built from them alone.

### NAND Gate (NOT-AND)

| A | B | A NAND B |
|---|---|----------|
| 0 | 0 | 1        |
| 0 | 1 | 1        |
| 1 | 0 | 1        |
| 1 | 1 | 0        |

### NOR Gate (NOT-OR)

| A | B | A NOR B |
|---|---|---------|
| 0 | 0 | 1       |
| 0 | 1 | 0       |
| 1 | 0 | 0       |
| 1 | 1 | 0       |

## XOR and XNOR

### XOR (Exclusive OR)

Outputs 1 when inputs are **different**.

| A | B | A XOR B |
|---|---|---------|
| 0 | 0 | 0       |
| 0 | 1 | 1       |
| 1 | 0 | 1       |
| 1 | 1 | 0       |

### XNOR (Exclusive NOR)

Outputs 1 when inputs are the **same**.

| A | B | A XNOR B |
|---|---|----------|
| 0 | 0 | 1        |
| 0 | 1 | 0        |
| 1 | 0 | 0        |
| 1 | 1 | 1        |
