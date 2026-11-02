**Synchronizers** make a metastable failure rare, not impossible. This topic puts a number on how rare. Failures happen at random, so the useful measure is the average time between them, the **mean time between failures** (MTBF):

$$\text{MTBF} = \frac{e^{\,t_r/\tau}}{T_0 \cdot f_{\mathrm{clk}} \cdot f_{\mathrm{data}}}$$

The bottom of the fraction counts how often a flip-flop is caught: the input changes $f_{\mathrm{data}}$ times a second, the clock samples $f_{\mathrm{clk}}$ times a second, and a change lands inside the small window $T_0$ around an edge. The top is how unlikely a caught flip-flop is to still be undecided after the settling time $t_r$; $\tau$ is the flip-flop's settling time constant, and faster flip-flops have a smaller $\tau$. Because $t_r$ sits in an exponent, a few nanoseconds of settling time turn milliseconds into centuries.

The interactive above has four parts: how a flip-flop gets caught and hovers, the exponent on a log-scale meter, one flip-flop compared with a synchronizer, and what makes MTBF worse. Step through each one before class.

*The full write-up for this topic is coming soon.*
