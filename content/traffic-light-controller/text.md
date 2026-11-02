A traffic light is a finite state machine whose states are the phases of the intersection, but each phase has to last a set number of clocks, and a state diagram has no clock in it. This topic builds a controller for two roads, North–South and East–West, that steps through four phases (North–South green, North–South yellow, East–West green, East–West yellow) and never lets both roads have green. It is worked as an FSMD: one register, $\mathit{TR}$, counts the clocks in each phase, and the datapath is read straight off the FSMD.

The interactive above walks through the design in five steps: the phases and the FSMD, the datapath read off the FSMD, the one-hot controller, a clock-by-clock timing trace, and the Verilog. Step through each one before class.

*The full write-up for this topic is coming soon.*
