## Analog to Digital Conversion

### Learning Objectives

By the end of this section, you should be able to:

- Explain why digital systems require analog-to-digital conversion to interact with the physical world.
- Describe the two fundamental steps of A/D conversion: sampling and quantization.
- Calculate the number of quantization levels and the step size from a given bit depth and range.
- Explain how quantization introduces noise and why more bits reduce this noise.
- Explain why the sampling rate must be matched to how fast the signal changes.
- Trace the complete pipeline from continuous waveform to binary digit stream.

These objectives address one of the most fundamental questions in digital systems: **how does a computer—which only understands 1s and 0s—capture and process signals from the real world?**

---

## The Analog World Meets Digital Machines

In the physical world, almost everything we interact with is analog. Sound waves in air, light hitting a camera sensor, temperature changes, muscle signals in the body, voltages in a microphone, vibrations in a machine—all of these are continuous signals that vary smoothly over time.

But computers are fundamentally digital machines. As we've established, they store and process information using discrete states that we call bits. A computer cannot directly "understand" a continuously varying voltage any more than it can understand spoken language. It needs information in a very specific form: sequences of binary digits.

This creates a fundamental engineering problem:

> Anytime we want a computer to measure, analyze, store, or communicate something from the physical world, we must convert that analog signal into digital information.

This conversion is not a minor technical detail. It is the bridge between the continuous physical world and the discrete computational world. Every digital audio recording, every digital photograph, every sensor reading in a modern car or medical device depends on this conversion working correctly.

Notice that the problem has two separate faces. A continuous signal is continuous in *two* ways at once: it exists at every instant of time, and at each instant it can take any value whatsoever. Digitizing it therefore requires taming both kinds of continuity, and that is exactly why the conversion has two steps.

---

## The Two Steps: Sampling and Quantization

Analog-to-digital conversion involves two distinct operations, each addressing a different aspect of the analog signal:

1. **Sampling** discretizes time
2. **Quantization** discretizes amplitude

Understanding both is essential because they introduce different kinds of limitations—and both affect the fidelity of the digital representation.

### Sampling: Capturing Moments in Time

An analog signal is continuous. At every instant—not just every second, but every microsecond, every nanosecond—the signal has a value. A digital system cannot store infinitely many values. Instead, it captures the signal at regular intervals.

This process is called **sampling**. A sample-and-hold circuit measures the signal's amplitude at specific moments, creating a sequence of discrete measurements.

Consider a sinusoidal waveform representing sound from a microphone. The continuous wave rises and falls smoothly. When we sample it, we capture only the amplitude at specific sample times—represented visually as vertical lines through the waveform. The blue dots at the intersections show the actual measured values.

How often must we sample? Intuitively, fast enough that the signal cannot do anything interesting *between* the samples. This intuition has a precise form: to faithfully capture a signal, you must sample at **more than twice the highest frequency present in it**—a threshold known as the Nyquist rate. Human hearing tops out near 20,000 cycles per second, which is exactly why audio CDs sample at 44,100 samples per second: comfortably more than twice 20,000. Professional audio might use 96,000 or 192,000. The principle is the same: we trade continuous time for discrete measurements, taken often enough that nothing audible slips between them.

Sampling *too slowly* does something worse than merely blurring the signal—it fabricates. When a signal changes faster than the sampler can follow, the samples still form a smooth pattern, but the pattern belongs to a *different, slower* signal that happens to pass through the same points. This effect is called **aliasing**, and you have seen it: a wheel in a video that appears to spin slowly backward is a fast rotation being sampled too slowly by the camera's frame rate. The samples are all genuine measurements; the story they tell is false. Real converters guard against this by filtering out frequencies too fast to capture before sampling ever happens.

### Quantization: Mapping to Discrete Levels

Sampling addresses time, but there is another dimension to consider: amplitude. An analog signal can take on any value within its range—not just whole numbers, but any real number. A voltage might be 2.347891... volts, with infinite precision.

Digital systems cannot represent infinite precision. Instead, they map each sampled amplitude to the nearest available **quantization level**. If a system has 8 levels (numbered 0 through 7), every possible amplitude must be rounded to one of those 8 values.

This mapping process is called **quantization**. The quantized values are what actually get stored and transmitted—not the original continuous amplitudes.

---

## Bit Depth and Quantization Levels

The number of quantization levels depends on how many bits we use to represent each sample. This is called the **bit depth** or **resolution** of the converter.

The relationship is exponential:

| Bit Depth | Quantization Levels | Formula |
|-----------|---------------------|---------|
| 1 bit | 2 | 2¹ |
| 2 bits | 4 | 2² |
| 3 bits | 8 | 2³ |
| 8 bits | 256 | 2⁸ |
| 16 bits | 65,536 | 2¹⁶ |
| 24 bits | 16,777,216 | 2²⁴ |

With 3 bits, we have only 8 possible output values. Each purple horizontal line in the visualization represents one of these levels. The analog signal, which can take any value, must be forced into one of these 8 discrete states.

The levels divide the converter's input range into equal steps, and the **step size** follows directly:

$$\text{step size} = \frac{\text{input range}}{2^{\text{bits}}}$$

Work one conversion completely. Suppose a 3-bit converter accepts voltages from 0 to 8 V. Its 8 levels are spaced $8 \div 2^3 = 1$ V apart, so level 0 covers voltages near 0 V, level 1 near 1 V, and so on up to level 7 near 7 V. Now a sample arrives at **5.7 V**. The nearest level is 6, so the converter outputs level 6—which, as a 3-bit binary code, is `110`. That three-bit pattern is all that survives; the ".7" is gone permanently. Every later stage of the system will believe the sample was 6 V.

With 16 bits over the same 0–8 V range, the story changes dramatically: $8 \div 65{,}536 \approx 0.00012$ V per step. The same 5.7 V sample lands on a level within a ten-thousandth of a volt of the truth. The spacing between adjacent levels becomes so fine that the difference between the original analog value and its quantized representation is nearly imperceptible.

---

## Quantization Noise: The Cost of Discretization

Whenever we quantize a signal, we introduce a discrepancy between the original analog value and the stored digital value. This difference is called **quantization error** or **quantization noise**.

The worked example above shows the pattern:

- Coarse quantization (3 bits, 1 V steps): 5.7 V stored as 6 V — an error of 0.3 V
- Fine quantization (16 bits, 0.12 mV steps): 5.7 V stored within 0.00006 V — an error ten thousand times smaller

Notice that the error can never exceed half a step: the converter always picks the *nearest* level, so the worst case is landing exactly between two of them. That gives quantization noise a hard ceiling—and shrinking the step is the only way to lower it.

This leads to an important principle:

> More bits means more levels, which means smaller steps, which means smaller quantization errors, which means better fidelity to the original signal.

In audio applications, quantization noise is literally audible as a form of distortion or hiss. A 3-bit audio signal would sound harsh and distorted. A 16-bit signal is clean enough for commercial music distribution. A 24-bit signal is used for professional recording and mastering where maximum fidelity is required.

---

## The Complete A/D Pipeline

Putting it all together, analog-to-digital conversion follows a clear pipeline:

1. **Start with a continuous analog waveform** — This might be audio from a microphone, light from a camera sensor, or voltage from a temperature probe.

2. **Sample at regular intervals** — The sample-and-hold circuit captures the instantaneous amplitude at each sample time.

3. **Quantize each sample** — Map the continuous amplitude to the nearest discrete level based on the bit depth.

4. **Encode as binary** — Each quantized level is represented as a binary number. With 3-bit resolution, level 5 becomes `101`. With 8-bit resolution, level 200 becomes `11001000`.

5. **Output a stream of binary digits** — The result is a sequence of bits that can be stored, processed, transmitted, and manipulated by digital systems.

It is worth pausing to appreciate the volume of data this pipeline produces. A stereo audio CD samples two channels at 44,100 samples per second, 16 bits each:

$$44{,}100 \times 16 \times 2 \approx 1.4 \text{ million bits per second}$$

—about 10 megabytes for a single minute of music. Every one of those bits started life as a voltage in a microphone. This pipeline is fundamental to modern technology: every time you record a voice memo, take a digital photograph, or use a fitness tracker that monitors your heart rate, this conversion is happening—often millions of times per second.

---

## Design Tradeoffs

Like all engineering systems, A/D conversion involves tradeoffs:

| Parameter | Increase means... | But also... |
|-----------|-------------------|-------------|
| Sampling rate | Better capture of fast changes | More data to store and process |
| Bit depth | Lower quantization noise | Larger file sizes, more expensive converters |
| Both | Higher overall fidelity | Greater system complexity and cost |

The art of A/D converter design is choosing parameters that provide adequate fidelity for the application while respecting constraints on storage, bandwidth, power, and cost.

A telephone call uses 8-bit samples at 8,000 samples per second—adequate for intelligible speech, because speech remains understandable even with everything above 4,000 cycles per second discarded. A studio recording might use 24-bit samples at 192,000 samples per second—far more data, but capturing every nuance of a musical performance. The two systems differ in data rate by a factor of more than a hundred, yet neither is "wrong." Each represents an appropriate engineering choice for its context, made by asking the questions in the table above.

---

## From Bits to Digital Logic

This section has focused on how continuous signals become sequences of binary numbers. The next logical question is: **what happens to those binary numbers once they exist?**

That is where digital logic comes in. The circuits we will study throughout this course—gates, adders, multiplexers, flip-flops, state machines—are the building blocks that process, store, and transform digital information.

Every digital system that interacts with the physical world contains analog-to-digital converters at its inputs and often digital-to-analog converters at its outputs, running the same two ideas in reverse. Understanding the conversion process helps explain why digital systems work with bits in the first place, and why the particular characteristics of binary representation matter.

---

## Review Questions

**1. What are the two fundamental steps in analog-to-digital conversion?**

- A) Encoding and decoding
- B) Sampling and quantization
- C) Compression and decompression
- D) Modulation and demodulation

**2. A 4-bit analog-to-digital converter can represent how many distinct quantization levels?**

- A) 4
- B) 8
- C) 16
- D) 32

**3. Quantization noise is caused by:**

- A) Electrical interference in the sampling circuit
- B) The difference between the actual analog value and the nearest discrete level
- C) Errors in the binary encoding process
- D) Degradation of the analog signal before conversion

**4. If you want to reduce quantization noise in an A/D converter, you should:**

- A) Decrease the sampling rate
- B) Increase the bit depth
- C) Use a lower-frequency input signal
- D) Reduce the amplitude of the input signal

**5. Why is sampling necessary in analog-to-digital conversion?**

- A) To amplify weak signals before quantization
- B) To filter out high-frequency noise
- C) To convert continuous time into discrete measurement points
- D) To compress the signal for efficient storage

**6. A 3-bit converter spans an input range of 0 to 8 V. A sample arrives at 3.4 V. What level does the converter store, and what binary code represents it?**

- A) Level 3, code `011`
- B) Level 4, code `100`
- C) Level 3, code `110`
- D) Level 34, code `100010`

---

## Answer Explanations

**1. Answer: B) Sampling and quantization**

Sampling discretizes time by capturing the signal at regular intervals. Quantization discretizes amplitude by mapping continuous values to discrete levels. Together, they transform a continuous analog signal into a sequence of discrete digital values.

- *Encoding and decoding* (A) refer to representing and recovering data, not the conversion process itself.
- *Compression and decompression* (C) reduce and restore data size, which happens after A/D conversion.
- *Modulation and demodulation* (D) are techniques for transmitting signals over channels, not for digitization.

**2. Answer: C) 16**

The number of quantization levels equals 2 raised to the power of the bit depth. For 4 bits: 2⁴ = 16 levels.

- *4* (A) would be correct for 2 bits (2² = 4).
- *8* (B) would be correct for 3 bits (2³ = 8).
- *32* (D) would be correct for 5 bits (2⁵ = 32).

**3. Answer: B) The difference between the actual analog value and the nearest discrete level**

Quantization noise arises because continuous values must be rounded to discrete levels. The error between the original value and the quantized value is inherent to the discretization process—and it can never exceed half a step, since the converter always picks the nearest level.

- *Electrical interference* (A) is a separate issue from quantization—it affects the analog signal before or during sampling.
- *Errors in binary encoding* (C) would be a digital error, not quantization noise.
- *Signal degradation* (D) happens in the analog domain and is distinct from quantization effects.

**4. Answer: B) Increase the bit depth**

More bits means more quantization levels, which means each level represents a smaller range of analog values. This reduces the maximum possible error between the original and quantized values.

- *Decreasing sampling rate* (A) affects time resolution, not amplitude resolution.
- *Lower-frequency signals* (C) don't inherently reduce quantization noise.
- *Reducing amplitude* (D) would make the signal smaller relative to the quantization steps, potentially increasing relative noise.

**5. Answer: C) To convert continuous time into discrete measurement points**

An analog signal exists at every instant in time, but digital systems can only store a finite number of values. Sampling captures the signal at specific moments, creating the discrete time series that digital systems require.

- *Amplifying weak signals* (A) is done by analog amplifiers, not the sampling process.
- *Filtering noise* (B) may be part of the analog front-end but is not the purpose of sampling itself—though a filter *is* used before sampling to prevent aliasing.
- *Compression* (D) happens after digitization and is not related to sampling.

**6. Answer: A) Level 3, code `011`**

With 3 bits over 0–8 V, the step size is 8 ÷ 2³ = 1 V, so levels sit at 0, 1, 2, ... 7 V. The nearest level to 3.4 V is level 3, and 3 in three-bit binary is `011`.

- *Level 4* (B) rounds the wrong way—4 V is 0.6 V away, while 3 V is only 0.4 V away.
- *Code `110`* (C) is binary 6, not 3—the level was right but the encoding wrong.
- *Level 34* (D) treats the voltage's digits as the level; levels are indexes into the step grid, not the voltage with the decimal point dropped.
