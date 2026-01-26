# Binary Number Basics

The **binary number system** is the foundation of all digital electronics. It uses only two digits: $0$ and $1$.

## Why Binary?

Digital circuits use binary because transistors naturally operate as switches with two states:
- **OFF** ($0$) - no current flowing
- **ON** ($1$) - current flowing

## Positional Notation

In any base-$b$ system, a number is represented as:

$$N = \sum_{i=0}^{n-1} d_i \cdot b^i$$

where $d_i$ is the digit at position $i$.

For binary ($b = 2$):

$$N_{10} = d_{n-1} \cdot 2^{n-1} + d_{n-2} \cdot 2^{n-2} + \cdots + d_1 \cdot 2^1 + d_0 \cdot 2^0$$

## Binary to Decimal Conversion

To convert $1101_2$ to decimal:

$$1101_2 = 1 \cdot 2^3 + 1 \cdot 2^2 + 0 \cdot 2^1 + 1 \cdot 2^0$$

$$= 1 \cdot 8 + 1 \cdot 4 + 0 \cdot 2 + 1 \cdot 1$$

$$= 8 + 4 + 0 + 1 = 13_{10}$$

## Decimal to Binary Conversion

To convert decimal to binary, repeatedly divide by 2:

| Step | Division | Quotient | Remainder |
|------|----------|----------|-----------|
| 1    | $13 \div 2$ | 6     | 1         |
| 2    | $6 \div 2$  | 3     | 0         |
| 3    | $3 \div 2$  | 1     | 1         |
| 4    | $1 \div 2$  | 0     | 1         |

Reading remainders bottom-up: $13_{10} = 1101_2$

## Place Values (Powers of 2)

| Position ($i$) | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|----------------|---|---|---|---|---|---|---|---|
| Value ($2^i$)  | $2^7$ | $2^6$ | $2^5$ | $2^4$ | $2^3$ | $2^2$ | $2^1$ | $2^0$ |
| Decimal        | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

## Range of $n$-bit Numbers

For an $n$-bit unsigned binary number:
- Minimum value: $0$
- Maximum value: $2^n - 1$

| Bits ($n$) | Range | Max Value |
|------------|-------|-----------|
| 4          | $0$ to $2^4-1$ | 15 |
| 8          | $0$ to $2^8-1$ | 255 |
| 16         | $0$ to $2^{16}-1$ | 65,535 |
| 32         | $0$ to $2^{32}-1$ | 4,294,967,295 |

## Key Terminology

- **Bit**: A single binary digit ($0$ or $1$)
- **Nibble**: 4 bits ($2^4 = 16$ values)
- **Byte**: 8 bits ($2^8 = 256$ values)
- **Word**: Typically 16, 32, or 64 bits (architecture-dependent)

## Hexadecimal Shorthand

Since $16 = 2^4$, each hex digit represents exactly 4 bits:

| Decimal | Binary | Hex |
|---------|--------|-----|
| 0       | $0000$ | 0   |
| 10      | $1010$ | A   |
| 15      | $1111$ | F   |
| 255     | $11111111$ | FF |

The conversion is straightforward:

$$\text{0xA5}_{16} = 1010\,0101_2 = 165_{10}$$
