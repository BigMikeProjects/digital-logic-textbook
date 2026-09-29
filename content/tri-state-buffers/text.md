# Tri-State Buffers

Every block in this section so far has computed something. A multiplexer selects, a decoder names an output, a comparator decides which number is larger. The **tri-state buffer** is the odd one out: it computes nothing at all. Its job is to decide **who is allowed to drive a wire**.

That makes it an unusual part to find deep inside a modern digital design, but an important one at the edges, on the **input/output pins** where a design meets the outside world. It is also the one place in a first course where a circuit's output can be something other than a 0 or a 1.

We will work through it using the section's **four-beat cadence** — functionality, hardware, applications and Verilog — first with one buffer, then with three of them sharing a single wire.

## Beat 1: Functionality

A tri-state buffer has a data input $A$, an **enable** input $EN$, and an output $Y$. When the enable is on, it is an ordinary buffer: $Y$ follows $A$, passing the signal through unchanged. When the enable is off, it does something no gate so far has done. It lets go of the wire. The output is **electrically disconnected**, as if the buffer had been unplugged from the circuit.

That disconnected condition is the third state the name refers to. It is called **high impedance** and written **$Z$**, because in circuits $Z$ is the usual letter for impedance, and a disconnected output presents a very high impedance to whatever it is attached to.

| $EN$ | $A$ | $Y$ |
|:-:|:-:|:-:|
| 0 | × | $Z$ — disconnected |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

The first row reads like the enable row of a decoder, where the × means the data input was never consulted. The difference is in the output column. A disabled decoder drives its outputs to a hard **0**, which is still a logic value, actively held. A disabled tri-state buffer drives **nothing**.

### Z is not a logic value

This is the idea to hold on to. **$Z$ is not a third logic value alongside 0 and 1; it is the absence of one.** You cannot compute with $Z$, and nothing downstream can read it as a bit. A tri-state output is in $Z$ precisely so that *some other* output can drive the same wire. The whole point of the part is to let several outputs **share one wire by taking turns**.

Two things are easy to confuse with it. A **floating input**, one that nothing is driving, is a fault: the input reads whatever noise happens to couple onto it. $Z$ on an *output* is deliberate; $Z$ arriving at an *input* means nobody is driving, and the value is undefined.

### Enable polarity

The symbol is the familiar buffer triangle with the enable entering from the side. Real parts very often use an **active-low** enable instead, drawn with a bubble where the enable meets the triangle and labelled $\overline{EN}$. That buffer drives when its enable is 0 and releases the wire when it is 1. The polarity is a classic source of bugs: an active-low enable tied to ground, perhaps to "leave it alone," is not disabled. It is **enabled forever**.

## Beat 2: Inside the Buffer and on the Bus

### A driver and a transmission gate

Open up the buffer and there are two pieces: an ordinary **driver** that produces a solid 0 or 1 from $A$, followed by a **transmission gate** that either connects that value to $Y$ or cuts it off.

A transmission gate is a switch built from two transistors, one **NMOS** and one **PMOS**, connected side by side between the driver and $Y$. These are the same two transistor types used in the CMOS inverter, just wired differently. An NMOS conducts when its gate is high; a PMOS, drawn with a bubble on its gate, conducts when its gate is low. So the NMOS gets $EN$ and the PMOS gets $\overline{EN}$, produced by an inverter off the enable, and the two turn on and off together:

| $EN$ | NMOS | PMOS | switch | $Y$ |
|:-:|:-:|:-:|:-:|:-:|
| 1 | on | on | closed | $A$ |
| 0 | off | off | open | $Z$ |

**Why it takes two.** A single NMOS passes a strong 0 but only a weak 1: when it tries to pass a 1, its output stops about one threshold voltage short of $V_{DD}$. A PMOS is the mirror image, passing a strong 1 but a weak 0. Put them in parallel and, whichever value is being passed, one of the pair passes it at full strength. When the enable is on, the value gets through on both the upper and lower paths. When it is off, both transistors are cut off, a high impedance sits between the driver and $Y$, and $Y$ is disconnected.

**The switch does not drive.** A transmission gate only connects or disconnects. It restores nothing, and it conducts in both directions. The driver in front supplies the 0 or the 1; the transmission gate decides whether that value reaches $Y$.

### Three buffers on one bus

A single tri-state buffer is almost trivial. The part exists for what happens when several of them share a wire, called a **bus**. Wire the outputs of three buffers to one net, each with its own data input and its own enable. What the bus carries depends on how many of them are enabled:

| drivers enabled | bus | what it means |
|---|:-:|---|
| exactly one | 0 or 1 | correct operation — the bus carries that driver's data |
| none | $Z$ | floating — the value is undefined, and nothing may read it |
| two or more, agreeing | 0 or 1 | works, but by luck — still a design error |
| two or more, disagreeing | $X$ | **bus contention** |

The last row is the one that matters most. If one enabled buffer drives a 1 and another drives a 0, there is now a direct path from one driver's pull-up to the other's pull-down, through the two closed transmission gates and the bus. In simulation the bus shows $X$, meaning the value is unknown. In hardware, large currents flow, the voltage lands somewhere in the forbidden band between a valid 0 and a valid 1, and the parts get hot and can be damaged. This is one of the few places in the course where a logic mistake has a physical consequence.

The design rule follows directly: **at most one driver enabled at any time.** The standard way to guarantee it is to let a **decoder** drive the enables. A decoder's outputs are one-hot, so exactly one buffer is ever enabled and contention becomes structurally impossible. The Decoders topic introduced one-hot outputs as the way to choose a memory chip; this is the same job.

One more practical note: a bus that anything might read should not be left floating. Real designs add a **pull-up** or **pull-down** resistor so that an idle bus rests at a defined level instead of picking up noise.

## Beat 3: Applications

**Shared data buses.** This is the historical core use. Memory chips and peripherals all hang off one bus, and during a read a decoder enables exactly one of them to drive it. Everything else sits in $Z$.

**Bidirectional I/O pins.** One physical pin can serve as an output some of the time and an input the rest of the time. When the chip wants to send, it enables a tri-state buffer onto the pin; when it wants to listen, it releases the pin to $Z$ and reads whatever the outside world is driving. Nearly every microcontroller's general-purpose I/O pins work this way, and this is the use of tri-state that is still everywhere.

**Bus transceivers.** Parts such as the 74HC245 package a whole byte of tri-state buffers with one shared direction control, so a system can switch between transmitting onto a bus and receiving from it. The details are beyond an introductory course, but it is worth knowing the part exists.

**What replaced it on-chip.** Inside a modern chip, tri-state buses have largely given way to **multiplexers**. A mux selects among several drivers without any shared wire, so there is no risk of contention and the timing is easier to analyze. So the fair summary is that tri-state is still essential where wires leave the chip, at I/O pads, off-chip buses and anything bidirectional, and mostly retired inside it. That neatly closes the section: the block that opened it, the multiplexer, is the one that replaced this one.

## Beat 4: Tri-State in Verilog

This block has a Verilog idiom that appears nowhere else in the course: **assigning `1'bz`**.

```verilog
module tri_buf (input a, input en, output y);
  assign y = en ? a : 1'bz;        // disabled => release the wire
endmodule
```

The assignment reads like a 2-to-1 multiplexer, a conditional on `en`, except that the second choice is not another signal. It is `1'bz`, a one-bit high impedance: Verilog's way of saying "disconnect `y`."

Several of these can drive the same net. Ordinarily, two drivers on one wire is an error, but here it is the point, and Verilog resolves the net the way the hardware would:

```verilog
wire bus;                          // one net, three drivers
tri_buf d0 (.a(a0), .en(e0), .y(bus));
tri_buf d1 (.a(a1), .en(e1), .y(bus));
tri_buf d2 (.a(a2), .en(e2), .y(bus));
```

Simulating one buffer, and then the three-driver bus in each of the four situations from the table, in Icarus Verilog:

```
en a | y
 0 0 | z
 0 1 | z
 1 0 | 0
 1 1 | 1

 e2e1e0 a2a1a0 | bus
 010  010  |  1
 001  110  |  0
 000  101  |  z
 011  011  |  1
 101  001  |  x
```

With only `d1` enabled the bus carries its 1, and with only `d0` enabled it carries its 0, even though the disabled buffers hold 1s on their inputs. With nothing enabled the bus is `z`. With `d0` and `d1` both driving 1 the bus reads 1, which is the "works by luck" row. With `d0` driving 1 and `d2` driving 0 the bus is `x`: contention.

Keep those two letters distinct, because students merge them constantly. **`z` means nobody is driving. `x` means the drivers disagree, or the value is unknown.**

A bidirectional pin uses the one port direction that may be both driven and read, **`inout`**:

```verilog
module io_pad (inout pin, input dout, input oe, output din);
  assign pin = oe ? dout : 1'bz;   // drive only when output-enabled
  assign din = pin;                // always able to read
endmodule
```

With `oe = 1` the module drives `dout` onto the pin. With `oe = 0` it releases the pin, and `din` reads whatever the outside world is driving. The tri-state pattern is still required: a plain `assign pin = dout;` would make the pin an output forever, and anything driving it from outside would be in contention with it.

Three practical cautions go with the idiom:

- **Synthesis can only build `1'bz` where real tri-state hardware exists**, which in practice means I/O pads and dedicated bus structures. Write it in ordinary internal logic and the tool will either reject it or quietly build a multiplexer instead.
- **Comparing against `z` or `x` needs `===`, not `==`.** The ordinary equality operator returns `x` whenever either side contains `x` or `z`, so `if (bus == 1'bz)` never succeeds; `bus === 1'bz` does.
- **Recognize the pattern.** Tri-state is not something you will write often in this course, but when you see a `z` being assigned, that is the signal that some condition disconnects the part from the circuit.

## Key Takeaways

A **tri-state buffer** passes its input straight through when its enable is on, and **electrically disconnects** its output when the enable is off. That third output state is **high impedance, $Z$**, and it is not a logic value but the absence of one: the buffer stops driving so that something else can. Inside, the buffer is a driver followed by a **transmission gate**, an NMOS and a PMOS in parallel driven by $EN$ and $\overline{EN}$; it takes both because each transistor passes one logic level strongly and the other weakly. The reason the part exists is the **shared bus**: many outputs on one wire, taking turns. Exactly one enabled driver is correct operation, none leaves the bus floating, and two disagreeing drivers cause **contention**, which shows as $X$ in simulation and as heat and possible damage in hardware. Letting a **decoder** drive the enables makes contention impossible. Inside modern chips, multiplexers have largely replaced tri-state buses, but tri-state remains essential at the boundary: bidirectional I/O pins, off-chip buses and transceivers. In Verilog the idiom is `assign y = en ? a : 1'bz;`, with `inout` for a pin that is both driven and read, and a clear distinction between `z` (nobody driving) and `x` (drivers disagree or unknown).

## Review Questions

**1. What is a tri-state buffer's output when its enable is off?**

A. A logic 0\
B. A logic 1\
C. High impedance — the output is disconnected from the wire\
D. The complement of its input

**2. A disabled decoder output and a disabled tri-state output both carry no data. What is the difference between them?**

A. There is no difference; both are high impedance\
B. The decoder output is actively driven to 0, while the tri-state output is not driven at all\
C. The decoder output is high impedance, while the tri-state output is driven to 0\
D. The decoder output floats, while the tri-state output is driven to 1

**3. Why does a transmission gate use both an NMOS and a PMOS transistor?**

A. One transistor carries the data and the other carries the enable\
B. Each transistor type passes one logic level strongly and the other weakly, so together they pass both levels at full strength\
C. Two transistors in series double the output voltage\
D. The PMOS inverts the signal so the NMOS can restore it

**4. Three tri-state buffers share a bus. Two of them are enabled, one driving 1 and the other driving 0. What happens?**

A. The bus reads 1, because a 1 overrides a 0\
B. The bus floats at $Z$\
C. Bus contention: the value is $X$ in simulation, and in hardware a large current flows between the two drivers\
D. The bus reads 0, because the lower-numbered buffer has priority

**5. What is the standard way to guarantee that at most one buffer drives a shared bus?**

A. Connect all the enables together\
B. Add a pull-up resistor to the bus\
C. Drive the enables from a decoder, whose outputs are one-hot\
D. Use active-low enables on every buffer

**6. In Verilog, what does `assign y = en ? a : 1'bz;` describe?**

A. A 2-to-1 multiplexer between `a` and zero\
B. A latch that holds `a` while `en` is low\
C. A tri-state buffer that drives `a` onto `y` when `en` is 1 and releases `y` when `en` is 0\
D. A buffer whose output is unknown when `en` is 0

## Answer Explanations

**1. C.** With the enable off, the transmission gate inside the buffer opens and the output is cut off from the driver: high impedance, $Z$. It is not a 0 or a 1, and that is the whole point — the buffer has stopped driving so another output can use the wire.

**2. B.** A disabled decoder forces every output to 0, and that 0 is still a logic value, actively held. A disabled tri-state buffer drives nothing at all. That is why tri-state outputs can share a wire and decoder outputs cannot: two decoders on one wire would fight whenever one held a 0 and the other a 1.

**3. B.** An NMOS passes a strong 0 but a weak 1, stopping about a threshold voltage below $V_{DD}$; a PMOS passes a strong 1 but a weak 0. In parallel, whichever value is being passed, one of the two carries it at full strength. They are side by side, not in series, and neither one inverts the signal.

**4. C.** Two enabled drivers disagreeing is bus contention. Neither value wins; in simulation the bus is `x`, and in hardware one driver's pull-up is connected to the other's pull-down through the bus, so a large current flows, the voltage sits in the forbidden band, and the parts can overheat. Option B describes the case where *no* driver is enabled.

**5. C.** A decoder asserts exactly one output at a time, so wiring its outputs to the enables means exactly one buffer can ever drive the bus. A pull-up resistor solves a different problem, giving an idle bus a defined level, and enable polarity has nothing to do with how many are enabled.

**6. C.** When `en` is 1 the conditional selects `a`; when it is 0 it selects `1'bz`, high impedance, which is Verilog's way of disconnecting `y`. It looks like a mux, but the second input is not a value. It is the absence of a driver, and that makes it a tri-state buffer. Unknown would be `x`, not `z`.
