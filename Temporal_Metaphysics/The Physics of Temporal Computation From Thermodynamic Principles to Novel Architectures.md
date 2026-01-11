# **The Physics of Temporal Computation: From Thermodynamic Principles to Novel Architectures**

## **Introduction: Redefining Computation Through Time**

The relentless progress of digital computation, as described by Moore's Law, has been the defining technological driver of the past half-century. This progress, however, is now confronting fundamental physical barriers. The miniaturization of transistors is approaching atomic limits, and the energy required to power these increasingly dense and complex systems is becoming unsustainable. This has led to the emergence of two critical limitations: the architectural von Neumann bottleneck and the more fundamental thermodynamic wall. Addressing these challenges requires a paradigm shift, moving beyond mere engineering optimizations to a re-evaluation of the physical principles upon which computation is based. Temporal computing represents one such paradigm shift, proposing a radical redefinition of information itself—not as a static state, but as a dynamic process encoded in the passage of time.

### **The Thermodynamic Wall and the Von Neumann Bottleneck**

The conventional von Neumann architecture, which physically separates the central processing unit (CPU) from memory, has been the bedrock of computing since its inception. However, this separation necessitates the constant shuttling of data between processing and storage units. This data movement, known as the von Neumann bottleneck, is now the dominant factor in both performance limitation and energy consumption in modern systems.1 The processor often remains idle, waiting for data to traverse the "memory wall," a process that consumes far more energy than the computation itself.

This architectural bottleneck is, at its core, a manifestation of a deeper physical problem: the thermodynamic cost of computation. The energy consumption of modern computing is staggering, with data centers alone accounting for a significant fraction of global electricity usage—as much as 5% in the United States.2 A substantial portion of the lifetime budget for a high-performance computing center is allocated simply to paying the energy bill, and a primary engineering challenge for the development of exascale computers is preventing them from melting under their own thermal load.2 Even biological systems, which are orders of magnitude more efficient, dedicate immense energetic resources to computation; the human brain, for instance, consumes approximately 20% of the body's total caloric intake.2

The physical origin of this energy cost was first articulated by Rolf Landauer, who established that logically irreversible operations, such as erasing a bit of information, have a minimum thermodynamic cost and must dissipate a corresponding amount of heat into the environment.3 Conventional digital logic is built upon a foundation of such irreversible operations. Every time a transistor switches state in a logic gate, the previous state is lost, and this deletion of information is transformed into heat.4 The von Neumann architecture, with its incessant data traffic, multiplies these irreversible state changes on a massive scale, generating enormous entropy and waste heat.5

The von Neumann model is thus not merely an architectural inconvenience but a profound thermodynamic bottleneck. The abstraction of discrete, synchronous, and state-based logic, while powerful, is physically expensive to implement in a non-equilibrium universe. Conventional computers are designed to suppress the inherent stochasticity and thermal noise of their physical components to create a deterministic logical framework.6 This suppression requires a constant input of energy, most of which is ultimately dissipated as heat. Temporal computing offers an alternative by embracing, rather than fighting, the natural, dissipative, and forward-flowing dynamics of physical systems. By using the propagation of a single physical event—a process inherently aligned with the universe's thermodynamic arrow—as the computation itself, this paradigm seeks to circumvent the deeper thermodynamic inefficiency of the classical model.7

### **Disambiguation: The Two "Temporals"**

Before delving into the physics of this hardware paradigm, it is crucial to disambiguate the term "Temporal," as it is prominently used in two distinct and unrelated domains.

First, there is the software platform known as Temporal.io. This is a scalable and reliable runtime environment for orchestrating "durable function executions," often referred to as Temporal Workflow Executions.9 The platform is designed to guarantee the reliable execution of application code, even in the face of infrastructure failures like network outages or server crashes.10 It achieves this by persistently recording the state of a workflow at every step in an event history, allowing a process to resume exactly where it left off after a failure.10 This makes distributed systems more fault-tolerant and allows developers to write complex business logic as if failures do not exist.11 The platform consists of a Temporal Service (a server and database) and Worker Processes that execute the application code using SDKs available in various programming languages.10 In essence, Temporal.io is a sophisticated software solution for managing temporal

*failures* and ensuring the long-term reliability of distributed software systems.13 It is used for a wide range of applications, from order fulfillment and CI/CD pipelines to training AI models.11

The second, and entirely different, concept is **Temporal Computing**, the hardware paradigm that is the exclusive subject of this report. In this context, the term "temporal" refers to the fundamental use of time itself as the medium for representing and processing information.4 This approach moves away from the traditional binary system, where information is encoded in static voltage levels (representing 0s and 1s), and instead encodes data in the duration or timing of physical events. This report will focus solely on this physics-based computational model and its implications.

### **Core Thesis: Time as the Computational Substrate**

The central thesis of this report is that temporal computing represents a fundamental paradigm shift by moving information encoding from static states, which can be thought of as occupying "space" (e.g., voltage levels on different wires), to dynamic processes encoded in "time" (e.g., signal delays, spike timings). This is not merely an alternative engineering choice but a profound realignment of the act of computation with the nature of physical law.

The universe is governed by time-asymmetric processes; causality dictates that effects follow causes, and the second law of thermodynamics defines a macroscopic "arrow of time" characterized by increasing entropy.15 Conventional computing, with its reliance on a global clock and logically reversible (though physically irreversible) operations, imposes an artificial, abstract, and thermodynamically costly model of time onto its physical substrate. Temporal computing, by contrast, leverages the natural, causal, and forward-directed propagation of signals as its core operational principle. The computation is not an abstract process simulated by the hardware; the physical evolution of the hardware

*is* the computation. By grounding its operations in the physical reality of time, this paradigm offers a path toward radically more energy-efficient and potentially faster computation, particularly for tasks that involve inherently temporal or graph-like data structures.

## **Fundamental Principles of Time-Based Information Processing**

At the heart of temporal computing is a departure from the binary representation of information that has dominated digital logic for nearly a century. Instead of encoding data in discrete, static voltage levels, this paradigm encodes information in a continuous physical variable: time. This section explores the foundational principles of this approach, from the basic encoding schemes to the formal algebraic and logical frameworks that govern temporal systems.

### **Data as Delay: Unary and Spike-Based Encoding**

The most fundamental concept in temporal computing is that a numerical value is represented by a passage of time.7 This is typically realized as the delay between a reference signal and the arrival of an event, such as the rising edge of a voltage pulse. This method of representation is known as unary coding, expressed in the time domain.

In a traditional binary system, a number is represented by a set of bits, each corresponding to a power of two, and each requiring a separate physical wire held at a high or low voltage. In temporal unary coding, a single wire can represent a value through the timing of a single event. For example, the number '5' could be represented by a pulse arriving 5 nanoseconds after a start signal. This simplicity is reminiscent of the earliest calculating devices, such as the abacus, where quantity is represented by the position of beads.7 This representational scheme offers significant potential for processing efficiencies, as it allows computation to be performed through the manipulation of delays rather than complex binary arithmetic. This is thought to be analogous to the brain's own highly efficient methods for data processing.7

This concept is a cornerstone of neuromorphic computing, a field that draws inspiration from the brain's architecture and function.8 In biological neural systems, information is widely believed to be encoded not just in the firing rate of neurons, but in the precise timing of discrete electrical pulses, or "spikes".4 In this spike-based representation, the temporal relationship between spikes from different neurons carries rich information. A temporal computer, therefore, often uses a digital rising edge as a direct, energy-efficient proxy for a biological spike.8 The core idea is the same: the information is contained in

*when* an event occurs, not just whether it occurs. This allows for a much richer and more efficient encoding scheme than simple binary, as a single event on a single wire can encode a multi-bit value.8

### **Race Logic: Engineering Causality for Computation**

"Race logic" is the most prominent and well-developed implementation of temporal computing principles in hardware.4 It is a computational technique that deliberately engineers and exploits the relative propagation times of signals—traditionally considered a source of hazardous "race conditions" in synchronous design—to perform useful computation.18

In a race logic system, information is carried by "wavefronts," which are sets of simultaneous or near-simultaneous voltage transitions propagating through a circuit on a series of wires.8 The computation is performed by manipulating the relative arrival times of these wavefronts using a small set of fundamental temporal operators. These operators, which replace the familiar AND, OR, and NOT gates of Boolean logic, are direct physical manifestations of signal interaction 18:

- **MIN:** Given two input events arriving at times T1 and T2, this operator produces an output event at time min(T1,T2). This is naturally implemented by a standard digital OR gate, as its output will transition as soon as the *first* input arrives.
- **MAX:** Given two input events arriving at times T1 and T2, this operator produces an output event at time max(T1,T2). This is naturally implemented by a standard digital AND gate, as its output can only transition after the *last* input has arrived.
- **ADD-CONSTANT:** Given an input event arriving at time T, this operator produces an output event at time T+K for some constant delay K. This is implemented by a simple delay element in the circuit path.
- **INHIBIT:** Given a data input arriving at Td and a control input arriving at Tc, this operator produces an output event at time Td if and only if Td<Tc. This allows for conditional signal propagation based on timing.

As a wavefront propagates through a network of these gates and delay elements, different parts of it move faster or slower depending on the data being processed. The final result of the computation is determined by which signal "wins the race" to a designated output node, or by the specific arrival time of the winning signal.8

The primary physical advantage of this approach is its extraordinary energy efficiency. In conventional binary logic, a single arithmetic operation can cause a cascade of bit-flips across many wires, with each transition consuming energy. In race logic, an entire operation, such as a MIN or MAX, is performed with at most one bit-flip per operation (the single rising edge of the output signal).4 This dramatic reduction in switching activity leads to orders-of-magnitude improvements in energy efficiency compared to traditional binary implementations for suitable problem domains.4

This paradigm represents a significant departure from both purely analog and purely digital computing. While traditional analog systems use continuous voltage levels to represent data, they are highly susceptible to noise accumulation and precision degradation.20 Digital systems are robust to noise but are energetically expensive. Temporal computing occupies a "happy medium" by using a robust, discrete digital event—the voltage edge—to mark a point in a continuous physical variable, time.20 The information is encoded in the analog-like value of the arrival time, but the signal itself is a restored digital pulse, making it resilient to the noise that plagues pure analog computation. It thus combines the energy efficiency of analog processing with the robustness of digital signaling.

### **The Formalism of Temporal Systems: Space-Time Algebra and Logic**

To move beyond ad-hoc circuit design and establish a rigorous foundation for temporal computing, researchers have developed formal mathematical and logical frameworks. These formalisms provide a systematic way to describe, design, and verify temporal systems, analogous to the role Boolean algebra plays in conventional digital design.

A key development in this area is the **Space-Time Algebra (s-t algebra)**, proposed by J. E. Smith as a mathematical foundation for systems that compute with temporal transients like spikes.15 The algebra consists of the set of non-negative integers (representing discrete time steps) and the symbol

∞ (representing an event that never occurs). Its fundamental operators are derived from the physical interactions of signals:

- **Min (∧) and Max (∨):** Corresponding to the MIN and MAX temporal gates.
- **Increment (+1):** Corresponding to a unit delay element.

This algebra is distributive, associative, and commutative, but notably, it is not complemented and does not support subtraction or negation.15 This is a profound and intentional feature, not a limitation. In a system where values represent the time of physical events, subtraction would be equivalent to going backward in time, violating causality. The s-t algebra thus bakes the forward-only flow of physical time into its axiomatic foundation.15

Within this framework, any valid computational function, or **space-time function**, must satisfy three fundamental properties that enforce physical realism 15:

1. **Implementability:** The function must be computable in the formal sense of Church and Turing, meaning it can be realized with a finite number of states. This ensures the function is physically constructible.
2. **Causality:** The output of a function cannot be influenced by inputs that arrive later in time. Formally, if an output occurs at time z, then for any input xj that arrives at a time greater than z, the function's output would be the same if xj had never arrived at all (i.e., arrived at time ∞). This property directly encodes the principle of cause and effect.
3. **Invariance:** If all input events are uniformly shifted in time by a constant amount, the output event must also shift by that same amount. This ensures that the computation depends on the *relative* timing of events, not on some absolute, global time reference.

On a higher level of abstraction, the field of **Temporal Logic** provides a formal language for specifying and reasoning about the properties of systems that evolve over time.21 Developed by logicians and computer scientists, temporal logic extends classical logic with operators that describe temporal relationships.22 For example, operators like

G ("always Going to be the case") and F ("at some point in the Future") allow for the precise expression of properties over time.23

Temporal logic is particularly useful for describing two critical classes of properties for concurrent systems 21:

- **Safety Properties:** Assertions that "something bad never happens," such as deadlock-freedom or mutual exclusion.
- **Liveness Properties:** Assertions that "something good eventually happens," such as termination or starvation-freedom.

By providing a single, uniform framework for describing a system at any level of abstraction, from high-level specifications down to low-level implementation, temporal logic supports hierarchical design and verification in a natural way.21 It provides the formal tools necessary to ensure that complex temporal computing architectures behave as intended, satisfying crucial properties of causality, ordering, and eventual completion.

## **Physical Realizations and Architectures of Temporal Computers**

The principles of temporal computing are not confined to a single technology. Their power lies in their ability to be mapped onto a wide variety of physical substrates, each with unique characteristics but all sharing the fundamental property of causal signal propagation. This section surveys the diverse hardware realizations of temporal computers, from conventional silicon to exotic optical and superconducting systems, demonstrating the universality of the underlying paradigm.

### **Electronic Implementations: Asynchronous CMOS and Superconductors**

The most mature and accessible platform for realizing temporal computers is conventional Complementary Metal-Oxide-Semiconductor (CMOS) technology, the same technology used to build today's processors and memory. By re-purposing standard logic gates to function as temporal operators, researchers have built highly efficient, specialized accelerators for a range of problems.

A leading body of work in this area has emerged from the UCSB ArchLab, led by researchers such as Timothy Sherwood and Dmitri Strukov.18 Their "Race Logic" architecture in silicon is designed to accelerate dynamic programming algorithms, which are common in fields like bioinformatics and data analysis.18 In their hardware accelerator for DNA sequence alignment, for instance, the algorithm's dependency graph is mapped directly onto a physical array of logic cells. The two DNA sequences to be compared are encoded as a series of programmed delays within this array. When a signal wavefront is launched into the array, its propagation time to the output is directly proportional to the "edit distance," or similarity, between the two sequences.18 The computation is an analog race condition performed with digital components, achieving improvements of up to 4x in speed and 200x in energy efficiency over optimized traditional designs for the same task.24

Another prominent example is the "Boosted Race Trees" architecture for low-energy classification.25 This system maps a machine learning model known as a decision tree onto a temporal circuit. An input, such as an image to be classified, is converted into a set of initial time delays. These signals then "race" through a tree-like circuit of MIN gates. The first signal to reach one of the final output nodes (a "leaf" of the tree) determines the classification result.25 This approach has demonstrated accuracy on par with state-of-the-art software models but with one to two orders of magnitude lower energy consumption.8

Beyond standard CMOS, temporal computing principles are also a natural fit for novel low-temperature computing environments based on superconductors.8 In these systems, information is naturally carried by transient voltage pulses (known as single flux quantum, or SFQ, pulses) that behave like spikes. The physics of these devices lends itself directly to temporal coding, making it a promising direction for future high-performance, low-energy data centers where the cost of cooling can be offset by immense gains in computational speed and efficiency.8

### **Neuromorphic Architectures: Spiking Neural Networks (SNNs)**

Neuromorphic computing, the broad field dedicated to creating computing hardware that mimics biological nervous systems, is deeply intertwined with temporal computing.1 Many of the most advanced and efficient neuromorphic systems are, in fact, temporal computers. The canonical example is the Spiking Neural Network (SNN), a "third generation" of neural networks that more closely models the behavior of biological neurons.17

Unlike traditional Artificial Neural Networks (ANNs) that communicate continuous-valued activations in a synchronous, layer-by-layer fashion, SNNs communicate using discrete, asynchronous events—spikes.17 This event-driven nature means that neurons and synapses only consume power when they are actively processing a spike, leading to significant energy savings, especially for tasks with sparse data.29 Crucially, in many SNN models, information is encoded in the precise timing of these spikes, not just their average frequency (rate coding).28

This makes SNNs a powerful platform for temporal processing. For example, in a classification task, an input image can be encoded such that pixels with higher intensity cause corresponding input neurons to spike earlier. As these spikes propagate through the network, the first neuron to spike in the output layer can signify the recognized class.30 This "time-to-first-spike" coding scheme allows for extremely rapid and efficient inference. SNNs are inherently suited to processing data from event-based sensors, such as dynamic vision sensors (DVS), which output a stream of spikes corresponding to changes in brightness rather than full image frames.33 This synergy allows for the creation of ultra-low-latency and low-power sensory processing systems for applications like robotics and autonomous vehicles.33

An influential high-level model of temporal processing in the brain is the Hierarchical Temporal Memory (HTM) theory, developed by Jeff Hawkins and commercialized by Numenta.34 HTM is a theoretical framework for understanding the neocortex, proposing that it learns sequences of patterns through a process of prediction and anomaly detection. The algorithmic components of HTM, which rely on learning and recalling high-order temporal sequences, are a prime example of temporal computation at a more abstract, system level.34 HTM algorithms are primarily used today for real-time anomaly detection in streaming data, a task for which understanding temporal context is paramount.34

### **Photonic and Optical Computing: Computation at the Speed of Light**

Photonics, which uses light instead of electrons as the information carrier, offers another compelling physical substrate for temporal computing. Photons travel at the speed of light, are virtually frictionless, and can be multiplexed in various domains (wavelength, polarization, spatial mode), enabling massive parallelism and bandwidth with very low energy consumption.4

One direct implementation of temporal computing in optics involves encoding data as time sequences. In a proposed architecture for an optical neural network, an input vector (e.g., a flattened image) and a weight matrix row are encoded as serial electrical signals in the time domain. These signals are then loaded onto an optical carrier using sequential high-speed electro-optic modulators.36 The multiplication of the input and weight is performed in the optical domain by precisely synchronizing the two modulated signals. The subsequent summation (the "accumulate" part of a multiply-accumulate operation) is ingeniously performed by a low-speed balanced photodetector. Its slow response time, normally a limitation, is exploited as a feature: the photodetector naturally integrates the incoming optical power over a time window, effectively summing the products of the time-domain multiplication.36 This approach allows for extremely high-throughput matrix computations, a core operation in deep learning.

More advanced optical systems leverage spatiotemporal multiplexing to further enhance computational density. By engineering "spatiotemporal optical wavepackets," which are light fields with complex, coupled structures in both space and time, researchers can perform computations on multiple channels simultaneously within a single beam of light.37 Another approach involves creating "synthetic dimensions" in time. In a single optical ring resonator, a train of light pulses can be made to interact with each other across different round-trips using configurable delay lines. Each pulse in the train acts as a neuron in a layer, and each round-trip through the resonator corresponds to passing through a layer of a deep neural network.39 These techniques allow for the implementation of large-scale neural networks in compact, reconfigurable photonic hardware, promising to alleviate the electronic bottlenecks that currently limit AI accelerators.37

### **The Critical Role of Temporal Memory**

While feed-forward race logic circuits and SNNs are highly effective for tasks like classification, more general-purpose computation requires the ability to perform multi-step, sequential algorithms. This necessitates a form of memory capable of storing and retrieving temporally encoded information—a **temporal memory**.

The basic space-time algebra for temporal functions is subject to the property of time-invariance: shifting the inputs in time simply shifts the output.15 While useful for stateless functions, this property prevents the creation of stateful systems where the output depends on the history of inputs. A temporal memory breaks this symmetry.19 By storing a wavefront (a vector of time-coded values) and retrieving it at a later, controlled time, it becomes possible to partition complex computations into discrete stages. This allows for the construction of

**Temporal State Machines**, the temporal analog of a conventional finite state machine, which can implement iterative algorithms like graph traversal.19

The physical realization of such a memory is a significant research challenge. Promising candidates include arrays of analog memristors or magnetic racetrack memories.1 These non-volatile devices can store a value that can be translated into a time delay upon readout, effectively "writing" and "reading" time-coded signals without costly conversion to and from the binary domain.19 The development of these memories is a critical step toward expanding the expressibility of temporal computing beyond specialized accelerators to more general-purpose processors. To guide this development, researchers are exploring mathematical frameworks like

**tropical algebra** as a systematic way to express high-level, timing-based algorithms and map them onto temporal state machine architectures.19

The sheer diversity of these physical implementations—from standard silicon and superconductors to neurons and photons—is not a coincidence. It underscores a crucial point: temporal computing is not a paradigm tied to a specific device technology. Instead, it is a more fundamental framework based on the universal physical properties of causality and signal propagation. Any physical system that supports the transmission of an event through a medium over time can, in principle, be harnessed for temporal computation. The core operators of MIN, MAX, and ADD are abstractions of the fundamental physical behaviors of wavefronts interacting and propagating. This substrate independence suggests that temporal computing is a highly adaptable and potentially enduring paradigm, capable of evolving with and being implemented in whatever new physical technologies emerge.

## **The Thermodynamic Imperative: Energy, Entropy, and Information**

The remarkable energy efficiency of temporal computing is not merely an engineering outcome; it is deeply rooted in the fundamental laws of physics that govern energy, information, and time. To fully appreciate the advantages of this paradigm, one must look beyond the logic gates and consider the computation as a physical process unfolding in a non-equilibrium thermodynamic system. This perspective, informed by the modern field of stochastic thermodynamics, reveals that temporal computing's efficiency stems from its inherent alignment with the physical nature of information processing.

### **Beyond Landauer's Limit: The Stochastic Thermodynamics of Computation**

For decades, the primary theoretical link between thermodynamics and computation was Landauer's principle, which states that the erasure of one bit of information requires a minimum amount of energy dissipation of kBTln(2), where kB is the Boltzmann constant and T is the temperature of the environment.3 While fundamentally important, this bound represents a tiny fraction of the actual energy consumed by modern computers.42 The vast majority of dissipated heat does not come from the act of information erasure itself, but from the myriad other irreversible processes required to make the computation happen quickly and reliably.

The emerging field of **stochastic thermodynamics** provides the necessary tools to analyze these costs.3 It extends classical thermodynamics to describe small-scale systems that are arbitrarily far from thermal equilibrium and evolving quickly—a perfect description of a computer in operation.42 A central concept in this field is

**Entropy Production (EP)**, which quantifies the total dissipated heat and thermodynamic inefficiency of a process. The total EP is the sum of the change in the system's own entropy and the heat flowed to the environment.42

The generalized Landauer bound, derived from the non-negativity of EP, is an equality: the heat generated is the sum of the entropy change of the information being processed and the total EP. In real computers, the EP term dwarfs the information entropy term by many orders of magnitude.42 This means that almost all the energy cost of computation comes from "thermodynamic friction"—the dissipative costs of driving the physical system through its state transitions. Temporal computing's advantage can be understood in this context: by drastically reducing the number of state transitions (bit-flips) required for an operation, it fundamentally minimizes the primary source of entropy production.4 It performs computation with less "friction" because its operations are more closely aligned with the natural physical dynamics of the system.

### **The Cost of Speed: Thermodynamic Speed Limit Theorems (SLTs)**

Stochastic thermodynamics also reveals a fundamental and unavoidable trade-off between the speed of a computation and its energetic cost. The **Thermodynamic Speed Limit Theorems (SLTs)** are a set of results that establish non-zero lower bounds on the entropy production required to transform a system from one state to another within a finite amount of time.42 In essence, the faster you want a computation to complete, the more entropy you must produce, and thus the more energy you must dissipate.

This principle has profound implications for computer architecture. The relentless drive for higher clock speeds in the von Neumann model comes at an unavoidable thermodynamic price. The global synchronization and rapid state changes demanded by a high-frequency clock force the physical system to operate far from thermodynamic equilibrium, leading to massive entropy production. Temporal computing, particularly in its asynchronous forms, offers a different approach. Since computation is event-driven and not tied to a global clock, different parts of the circuit can operate at their own natural physical speeds. This avoids the energetic overhead of forcing the entire system into lockstep at a high frequency, allowing for a more favorable position on the energy-time trade-off curve for many applications.

### **Thermodynamic Computing and Embracing Stochasticity**

Temporal computing is part of a broader, emerging class of paradigms known as **thermodynamic computing**.6 The core philosophy of this class is to harness the natural, stochastic dynamics of physical systems for computation, rather than expending vast amounts of energy to suppress them. Conventional digital systems are designed to create a deterministic abstraction by fighting against thermal noise and other random fluctuations.6 Thermodynamic computers, by contrast, embrace this randomness.

For example, companies like Normal Computing are developing chips with tiny, interconnected physical components that move and fluctuate randomly due to thermal energy. By carefully structuring these systems, their natural, probabilistic evolution can be used to solve complex mathematical problems, such as matrix inversion, by sampling from the system's equilibrium distribution.6 This approach reduces energy demand by using probabilistic rather than deterministic operations.

While most implementations of temporal computing, such as race logic, are largely deterministic, they share the foundational principle of using natural physical dynamics—in this case, causal signal propagation—as the computational primitive. Some advanced temporal systems explicitly introduce stochasticity. For instance, to perform probabilistic computing in the time domain, researchers are exploring how to generate random temporal signals by interrogating physical systems that exhibit stochastic behavior, such as superparamagnetic tunnel junctions.8 By doing so, they can perform probabilistic operations with high speed and energy efficiency.

This connection reveals that temporal computing's efficiency is a form of "impedance matching" between the logical requirements of an algorithm and the thermodynamic properties of its physical substrate. In electronics, impedance matching is essential for maximizing power transfer and minimizing wasteful reflections. The von Neumann paradigm can be seen as creating a "thermodynamic impedance mismatch." It demands abstract, discrete, and synchronous operations from a physical world that is continuous, stochastic, and asynchronous. The immense energy cost of modern computing is the "reflected power" from this mismatch—the energy wasted forcing the physics to conform to the logical abstraction. Temporal computing reduces this mismatch. Its core operations are nearly direct mappings of the physical behavior of the substrate (signal races, propagation delays). The computation thus proceeds with minimal "thermodynamic reflection," achieving a superior harmony between the algorithm and the physics, which manifests as greater energy efficiency.

## **The Arrow of Time and the Nature of Computation**

The principles of temporal computing are not only tied to the thermodynamics of energy and entropy but also to the deeper, more philosophical questions surrounding the nature of time itself. The very structure of a temporal computer—its reliance on causality and its forward-only progression—is a direct reflection of the physical asymmetry of time. Exploring this connection reveals that the choice of a computational paradigm is an implicit statement about the nature of time.

### **The Thermodynamic Arrow of Time**

The concept of the "arrow of time" was introduced by astrophysicist Arthur Eddington in 1927 to describe the "one-way direction" or asymmetry of time.43 While the fundamental laws of mechanics at the microscopic level appear to be time-symmetric (a process looks physically plausible whether run forwards or backwards), the macroscopic world clearly is not. A broken egg does not reassemble itself; milk spilled on a table does not gather itself back into the glass.44

This macroscopic directionality is rooted in the Second Law of Thermodynamics, which states that the total entropy (a measure of disorder or randomness) of an isolated system can only increase over time.43 The universe as a whole evolves in the direction of greater entropy. Therefore, the thermodynamic arrow of time is defined by the direction of increasing randomness and decreasing free energy.43 Any process that is not time-reversible, such as the dissipation of kinetic energy into heat, contributes to this forward march of time.43

### **The Informational Arrow of Time**

In recent decades, physicists have developed a more refined, information-centric view of time's arrow. This perspective suggests that the increase in thermodynamic entropy is linked to an increase in correlations and complexity.47 As a system evolves and interacts with its environment, information about its state becomes increasingly distributed and intertwined with the state of its surroundings.

Physicist Seth Lloyd proposed that the arrow of time is fundamentally an "arrow of increasing correlations".47 This idea finds a powerful foundation in quantum mechanics. When two quantum particles interact, they can become "entangled," meaning their individual states can no longer be described independently. They become components of a single, more complex quantum state that describes the combined system.47 As a system, like a hot cup of coffee, interacts with its environment (the surrounding air), its particles become progressively more entangled with the air particles. Information about the coffee's initial, hot state "leaks out" and becomes smeared across the entire room. From the local perspective of the coffee cup, its state appears to stagnate and reach a uniform thermal equilibrium. This local loss of information, driven by the spread of quantum entanglement, gives rise to the appearance of irreversible evolution and defines a forward direction in time.47

### **Synthesis: Computation's Role in the Flow of Time**

The act of computation is inextricably linked to these physical arrows of time. Any logically irreversible computation, by its very nature, is a physical process that increases the universe's total entropy and thus contributes to the thermodynamic arrow of time. Every time a bit is erased in a conventional computer, a small but non-zero amount of information is lost, and a corresponding amount of heat is dissipated, adding to the universe's total disorder.3

Temporal computing is fundamentally and uniquely aligned with this physical asymmetry. It stands in contrast to other paradigms:

- **Reversible Computing** is a theoretical ideal that seeks to eliminate the arrow of time from its operations by ensuring that every computational step is perfectly invertible, thus producing no entropy.49
- **Classical (Von Neumann) Computing** generates the arrow of time as a massive and costly byproduct of its physically irreversible operations.
- **Temporal Computing**, however, *uses* the forward-only, causal progression of events as its operational backbone. The s-t algebra, with its explicit prohibition of "going backward in time," builds causality directly into its mathematical foundation.15 The computation is the physical unfolding of cause and effect, where the arrival of one signal triggers the next in a strictly ordered sequence. It is a model of computation built directly upon the principle of causality, which is the essence of the arrow of time.

This suggests that the choice of a computational paradigm is an implicit adoption of a physical model of time. The von Neumann architecture, with its global clock signal that synchronizes all operations across the chip, implicitly assumes a Newtonian model of absolute, universal time, where "now" is a well-defined concept for the entire system. Temporal computing, particularly in its asynchronous forms, discards this notion. Time is local, measured only by the arrival of causal wavefronts. This is more akin to a relativistic view of time, where the ordering of events is determined by the propagation of signals within local light cones. The shift from von Neumann to temporal computing, therefore, can be seen as a move from an abstract, global, and implicitly reversible model of time to a concrete, local, and explicitly irreversible one. As computation pushes against fundamental physical limits, its underlying models must become more physically realistic, not just in their accounting for energy, but in their fundamental treatment of spacetime.

## **A Comparative Analysis of Post-Classical Computing**

Temporal computing does not exist in a vacuum. It is one of several novel paradigms emerging to address the limitations of classical computing. Situating it within this landscape is essential for understanding its unique strengths, weaknesses, and potential role in the future of information processing. This section provides a comparative analysis of temporal computing against three other major physics-based paradigms: neuromorphic, quantum, and reversible computing.

### **Temporal vs. Neuromorphic**

The relationship between temporal and neuromorphic computing is one of synergy and specialization rather than opposition. Neuromorphic computing is a broad, brain-inspired field that aims to create hardware mimicking the architecture and dynamics of biological nervous systems.1 Temporal computing, in contrast, is a specific and powerful

*implementation strategy* that can be used within neuromorphic engineering.8

The core connection lies in the use of spikes. Many of the most efficient neuromorphic systems are Spiking Neural Networks (SNNs), which, as discussed, are a canonical form of temporal computer.17 They leverage the timing of discrete events to process information in an energy-efficient, event-driven manner.53 Therefore, much of temporal computing research can be seen as providing the low-level physical and architectural principles for building high-performance neuromorphic systems.1 However, the two fields are not identical. Not all neuromorphic systems are strictly temporal; some may use analog, rate-based coding where information is encoded in the average frequency of spikes rather than their precise timing. Conversely, not all temporal computing applications are neuromorphic; the "Race Logic" accelerator for DNA sequence alignment, for example, solves a dynamic programming problem that is not directly brain-inspired.24 In summary, temporal computing provides a set of fundamental, physics-based tools for information-as-delay, and neuromorphic engineering is one of its most important and promising application domains.

### **Temporal vs. Quantum**

Temporal and quantum computing represent two vastly different approaches to harnessing physics for computation, differing in their foundational principles, information units, and practical implementation.

The most fundamental distinction is their physical basis. Temporal computing operates entirely within the domain of **classical physics**, leveraging principles like signal propagation, causality, and electromagnetism.15 Quantum computing, on the other hand, is based on the counter-intuitive principles of

**quantum mechanics**, such as superposition and entanglement.48

This leads to a difference in the basic unit of information. A temporal computer uses a classical event's arrival time, a well-defined physical quantity. A quantum computer uses the **qubit**, which can exist in a quantum superposition—a linear combination of two basis states (often denoted ∣0⟩ and ∣1⟩) simultaneously.48 This ability to explore an exponential number of states at once gives quantum computers their theoretical power for certain classes of problems, such as factoring large numbers or simulating quantum systems.48

However, this power comes at a great practical cost. Qubits are exquisitely sensitive to their environment, a phenomenon known as decoherence. To operate, quantum computers require extreme isolation and highly controlled conditions, typically involving temperatures near absolute zero.54 This makes them complex, expensive, and difficult to scale.55 Temporal computing, in contrast, offers significant advantages in practicality 7:

- **Easier Development:** It can be implemented using existing, mature CMOS fabrication processes, potentially extending the utility of silicon as a compute medium.
- **High Parallelization:** Time is a "free resource," and measuring the timing of multiple parallel events is trivial, whereas managing entanglement across many qubits is a major challenge.
- **Low Resource Requirements:** Due to their simplicity and energy efficiency, temporal computers are well-suited for deployment in small, resource-constrained systems, such as mobile and edge devices. Quantum computers, for the foreseeable future, will likely exist only as centralized, high-maintenance resources.

While distinct, some theoretical research speculates on bridges between the two, exploring concepts like "temporal superposition" and a "Quantum Computational Temporal Paradox" to address computational complexity problems like P vs. NP, though this remains highly speculative.56

### **Temporal vs. Reversible**

Temporal and reversible computing both target the fundamental thermodynamic limits of computation, but they approach the problem from opposite philosophical and practical directions. The shared goal is to dramatically reduce the energy dissipation caused by irreversible operations.

**Reversible computing** is a theoretical model of computation where every step is logically and physically time-reversible.49 This means that given the output of any operation, the input can be perfectly reconstructed. According to Landauer's principle, since no information is ever erased, such a computation could, in theory, be performed with

**zero energy dissipation**.50 This is achieved using logically reversible gates (like the Toffoli gate) that have the same number of inputs and outputs, preserving all information.49 Reversible computing is a foundational concept for quantum computing, as the evolution of a quantum state is inherently reversible (until measured).49 However, building a large-scale, purely reversible classical computer is an immense practical challenge and is largely a theoretical pursuit. To maintain reversibility, such systems would likely need to run much slower than conventional machines.4

**Temporal computing**, in contrast, is a practical approach that accepts the thermodynamic arrow of time. It does not aim for zero dissipation but rather seeks to **minimize dissipation** by radically reducing the number of irreversible events required for a computation.4 Instead of performing a 32-bit addition with thousands of transistor state changes, a temporal circuit might perform an analogous operation by manipulating the delay of a single voltage edge. It embraces the forward flow of time and the inherent irreversibility of any real-world physical process. While reversible computing is an ideal of perfect efficiency, temporal computing is an engineering paradigm for achieving ultra-low-power operation within the constraints of real-world physics.

### **A Taxonomy of Novel Computing Paradigms**

To synthesize this comparative analysis, the following table provides a structured overview of the fundamental characteristics of these four post-classical computing paradigms.

| **Paradigm**     | **Physical Basis**                                | **Information Unit**               | **Key Operations**                      | **Energy Profile**                               | **Target Applications**                                      |
| ---------------- | ------------------------------------------------- | ---------------------------------- | --------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| **Temporal**     | Classical Physics (Signal Propagation, Causality) | Time delay of a single event/spike | MIN, MAX, ADD-CONSTANT (Race Logic)     | Ultra-low power (minimal switching)              | AI at the Edge, In-Sensor Processing, Dynamic Programming, Graph Analytics |
| **Neuromorphic** | Bio-inspired (Neural Dynamics)                    | Spikes, Analog states              | Spiking neuron models (LIF), STDP       | Very low power (event-driven, sparse)            | Pattern Recognition, Sensory Processing, Continuous Learning |
| **Quantum**      | Quantum Mechanics                                 | Qubit (Superposition of states)    | Unitary transformations (Quantum Gates) | High overhead (cryogenics), low core dissipation | Cryptography, Simulation of Quantum Systems, Optimization    |
| **Reversible**   | Thermodynamic Reversibility                       | Bit (preserved)                    | Reversible gates (e.g., Toffoli)        | Theoretically zero dissipation (isentropic)      | Primarily theoretical; foundational for quantum computing    |

This taxonomy clarifies the unique position of temporal computing. It is a classical, practical, and near-term paradigm focused on energy efficiency for specific workloads, distinguishing it from the biologically-focused domain of neuromorphic computing, the exotic physics and long-term potential of quantum computing, and the theoretical ideal of reversible computing.

## **Outlook: Applications, Grand Challenges, and the Future Trajectory**

As a rapidly developing field, temporal computing presents both significant opportunities and formidable challenges. Its unique properties make it exceptionally well-suited for a range of pressing computational problems, yet its widespread adoption hinges on overcoming key hurdles in design, memory, and precision. This final section outlines the current and near-term applications, identifies the grand challenges facing the field, and projects a future trajectory where temporal principles are integrated into a new, heterogeneous computing landscape.

### **Current and Near-Term Applications**

The advantages of temporal computing—namely, its radical energy efficiency and high performance for specific computational structures—have led to successful demonstrations in several key application domains.

One of the most promising areas is in **AI and machine learning at the edge**. Temporal architectures like Boosted Race Trees have proven highly effective for decision-tree-based classifiers and image categorization tasks.4 Because these circuits are simple, compact, and consume very little power, they are ideal for "in-sensor" processing, where data from sources like image sensors, microphones, or Time-of-Flight (ToF) cameras can be analyzed directly at the source without being sent to a power-hungry central processor.4 This is particularly relevant for autonomous systems, robotics, and IoT devices where latency and power are critical constraints.4

**Spiking Neural Networks (SNNs)**, as a prime example of temporal hardware, are expanding this application space further. They excel at processing spatiotemporal data, making them a natural fit for tasks like recognizing moving objects, classifying streams of events from neuromorphic sensors, and understanding complex temporal patterns in audio or biomedical signals.28 The inherent efficiency of SNNs makes them a leading candidate for enabling continuous, on-device learning and inference in a way that is infeasible with conventional deep learning models.29

Another demonstrated domain of strength is in accelerating **dynamic programming and graph traversal algorithms**. The direct mapping of a problem's dependency graph onto the physical structure of a race logic circuit allows for extremely efficient solutions. The hardware accelerator for DNA sequence alignment, which solves the edit distance problem, is a canonical example of this, showing massive performance and energy gains over traditional CPU-based approaches.20 This suggests broad applicability for problems in bioinformatics, logistics, and network analysis that can be formulated as finding the shortest path through a graph.

### **The Grand Challenges and Open Problems**

Despite its promise, the path to widespread adoption of temporal computing is paved with significant challenges that are the focus of active research.

- **Precision and Noise:** A primary limitation of encoding information in an analog quantity like time is its susceptibility to noise and jitter, which can degrade precision.4 Unlike a digital binary system, which is highly robust to small voltage fluctuations, a temporal system's accuracy is directly tied to its ability to control and measure delays precisely. While the use of digital edges provides some robustness, managing timing variations due to temperature, process variation, and other sources of noise is a critical challenge, especially as systems scale in complexity.8
- **Systematic Design and Compilation:** Much of the current work on temporal hardware involves ad-hoc, manual mappings of specific algorithms to custom circuits.19 For the paradigm to become mainstream, a systematic design methodology is required. This involves developing high-level programming languages for expressing temporal algorithms and compilers that can automatically synthesize these algorithms into efficient temporal hardware. Frameworks based on mathematical structures like tropical algebra are a promising step in this direction, but a full "logic synthesis" toolchain for temporal computing does not yet exist.19
- **Temporal Memory:** As previously discussed, the development of a dense, fast, and non-volatile temporal memory is perhaps the single most critical enabling technology for moving temporal computing beyond specialized, feed-forward accelerators.1 Without an efficient way to store and retrieve wavefronts, it is difficult to build temporal state machines capable of executing complex, iterative algorithms.
- **Theoretical Complexity:** At the algorithmic level, many problems related to temporal graphs and networks remain computationally hard (NP-hard). This includes fundamental problems like finding optimal time-respecting paths under various constraints (temporal connectivity and reachability) and solving temporal constraint satisfaction problems.60 While temporal hardware can accelerate the core operations for these problems, the underlying combinatorial complexity remains a challenge that requires co-design of both algorithms and architectures.

### **Future Trajectories: The Asynchronous, Heterogeneous Future**

The future of computing is unlikely to be a monolithic replacement of the von Neumann architecture. Instead, the most probable trajectory is toward **heterogeneous computing systems**, where different types of processing units are integrated to handle the tasks for which they are best suited.4 In this vision, a conventional CPU/GPU would still manage general-purpose tasks, control flow, and high-precision arithmetic. However, it would be augmented by a suite of specialized accelerators. Temporal co-processors would be tasked with handling massively parallel, low-precision, event-driven workloads, such as processing raw sensor data, running SNNs for pattern recognition, or accelerating graph analytics. This hybrid approach would leverage the best of both worlds: the flexibility of traditional computing and the radical efficiency of temporal processing.

This trajectory aligns with the future needs of artificial intelligence, particularly in the domain of **continual learning**.65 As AI systems move from being trained once on static datasets to continuously learning and adapting from a stream of real-world data, the ability to process information over time becomes paramount.66 A computational model that is inherently time-based is a natural fit for this challenge.

In conclusion, the physics of temporal computation offers a compelling path forward in an era defined by the limits of classical computing. By grounding the act of computation in the physical reality of time—embracing causality, signal propagation, and the thermodynamic arrow—this paradigm moves away from the costly abstractions of the von Neumann model. It represents a shift from building machines that perform abstract calculations *about* the world to building machines whose own physical dynamics *embody* the calculation. While significant challenges remain, the principles of temporal computing are poised to become a critical component of the future heterogeneous, asynchronous, and profoundly more efficient computational landscape.

#### **Works cited**

1. Neuromorphic Computing - PRIMO.ai, accessed September 26, 2025, https://primo.ai/index.php?title=Neuromorphic_Computing
2. Projects: The thermodynamics of computation | Santa Fe Institute, accessed September 26, 2025, https://www.santafe.edu/research/projects/thermodynamics-computation
3. Complexity Science Hub * Publication * The Stochastic Thermodynamics Of Computation, accessed September 26, 2025, https://csh.ac.at/publication/the-stochastic-thermodynamics-of-computation/
4. Novel computing paradigms on the horizon - Bloc Ventures, accessed September 26, 2025, https://blocventures.com/novel-computing-paradigms-on-the-horizon/
5. The Thermodynamics of Computation-a Review - Caltech, accessed September 26, 2025, https://www.dna.caltech.edu/courses/cs191/paperscs191/IBMJTheorPhys(21)905.pdf
6. Thermodynamic Computing Becomes Cool - Communications of the ACM, accessed September 26, 2025, https://cacm.acm.org/news/thermodynamic-computing-becomes-cool/
7. The solution - Temporal Computing, accessed September 26, 2025, https://temporal.computer/solution/
8. Temporal Computing | NIST, accessed September 26, 2025, https://www.nist.gov/programs-projects/temporal-computing
9. docs.temporal.io, accessed September 26, 2025, [https://docs.temporal.io/temporal#:~:text=Temporal%20is%20a%20scalable%20and,failures%20don't%20even%20exist.](https://docs.temporal.io/temporal#:~:text=Temporal is a scalable and,failures don't even exist.)
10. What is Temporal? | Temporal Platform Documentation, accessed September 26, 2025, https://docs.temporal.io/temporal
11. Temporal: Durable Execution Solutions, accessed September 26, 2025, https://temporal.io/
12. Workflow Engine Design Principles with Temporal, accessed September 26, 2025, https://temporal.io/blog/workflow-engine-principles
13. Temporal Failure in System Design - GeeksforGeeks, accessed September 26, 2025, https://www.geeksforgeeks.org/system-design/temporal-failure-in-system-design/
14. How the Temporal Platform Works, accessed September 26, 2025, https://temporal.io/how-it-works
15. Temporal Computer Organization Abstract 1. Introduction - arXiv, accessed September 26, 2025, https://arxiv.org/pdf/2201.07742
16. Thermodynamics of Computations with Absolute Irreversibility, Unidirectional Transitions, and Stochastic Computation Times | Phys. Rev. X - Physical Review Link Manager, accessed September 26, 2025, https://link.aps.org/doi/10.1103/PhysRevX.14.021026
17. Is Neuromorphic Computing the Future of AI? - Exoswan Insights, accessed September 26, 2025, https://exoswan.com/is-neuromorphic-computing-the-future-of-ai
18. Neuro-inspired Temporal Logic - UCSB ArchLab, accessed September 26, 2025, https://www.arch.cs.ucsb.edu/neuromorphic
19. Using temporal memory to stitch time-based graph computations - arXiv, accessed September 26, 2025, https://arxiv.org/pdf/2009.14243
20. Computing with Temporal Operators - eScholarship, accessed September 26, 2025, https://escholarship.org/uc/item/6b0613nh
21. WHAT GOOD IS TEMPORAL LOGIC? - Leslie Lamport, accessed September 26, 2025, https://lamport.azurewebsites.net/pubs/what-good.pdf
22. Temporal Logics in Computer Science - Cambridge University Press, accessed September 26, 2025, https://www.cambridge.org/core/books/temporal-logics-in-computer-science/1EEDB306B4B0047568D8C91DFFC321D8
23. Temporal Logic - Stanford Encyclopedia of Philosophy, accessed September 26, 2025, https://plato.stanford.edu/entries/logic-temporal/
24. Race Logic: A Hardware Acceleration for Dynamic ... - UCSB CS, accessed September 26, 2025, https://sites.cs.ucsb.edu/~sherwood/pubs/ISCA-14-racelogic.pdf
25. Boosted Race Trees for Low Energy Classification - UCSB ..., accessed September 26, 2025, http://www.cs.ucsb.edu/~sherwood/pubs/ASPLOS-19-racetree.pdf
26. Temporal Dynamics in Neuromorphic Computing - CERN Indico, accessed September 26, 2025, https://indico.cern.ch/event/1242538/contributions/5455233/attachments/2689551/4666919/MODE_WS_Neuromorphic.pdf
27. Spiking Autoencoders With Temporal Coding - Frontiers, accessed September 26, 2025, https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2021.712667/full
28. Computing of temporal information in spiking neural networks with ReRAM synapses - PMC, accessed September 26, 2025, https://pmc.ncbi.nlm.nih.gov/articles/PMC6390697/
29. Spiking Neural Networks for Temporal Processing: Status Quo and Future Prospects - arXiv, accessed September 26, 2025, https://arxiv.org/html/2502.09449v1
30. Temporal coding in spiking neural networks with alpha synaptic function - Google Research, accessed September 26, 2025, https://research.google/pubs/temporal-coding-in-spiking-neural-networks-with-alpha-synaptic-function/
31. Spiking Neural Networks and Their Applications: A Review - MDPI, accessed September 26, 2025, https://www.mdpi.com/2076-3425/12/7/863
32. Temporal information processing with spiking neural networks | ACT of ESA, accessed September 26, 2025, https://www.esa.int/gsp/ACT/projects/temporal_coding/
33. Efficient Processing of Spatio-Temporal Data Streams With Spiking Neural Networks - Frontiers, accessed September 26, 2025, https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2020.00439/full
34. Hierarchical temporal memory - Wikipedia, accessed September 26, 2025, https://en.wikipedia.org/wiki/Hierarchical_temporal_memory
35. The Evolution of Optical Computing: Part 2 - EE Times, accessed September 26, 2025, https://www.eetimes.com/the-evolution-of-optical-computing-part-2/
36. High-throughput optical neural networks based on temporal ... - arXiv, accessed September 26, 2025, https://arxiv.org/abs/2303.01287
37. High-Speed All-Optical Neural Networks via Mode Multiplexing - Bioengineer.org, accessed September 26, 2025, https://bioengineer.org/high-speed-all-optical-neural-networks-via-mode-multiplexing/
38. Spatiotemporal optical wavepackets: from concepts to applications - SPIE Digital Library, accessed September 26, 2025, https://www.spiedigitallibrary.org/journals/photonics-insights/volume-3/issue-4/R08/Spatiotemporal-optical-wavepackets-from-concepts-to-applications/10.3788/PI.2024.R08.full
39. Optical Neural Network Architecture for Deep Learning with Temporal Synthetic Dimension, accessed September 26, 2025, [https://olab.physics.sjtu.edu.cn/papers/2023/10.%20Bo%20Peng_CPL_2023.pdf](https://olab.physics.sjtu.edu.cn/papers/2023/10. Bo Peng_CPL_2023.pdf)
40. Scalable optical neural networks based on temporal computing - ResearchGate, accessed September 26, 2025, https://www.researchgate.net/publication/368935442_Scalable_optical_neural_networks_based_on_temporal_computing
41. Temporal State Machines: Using Temporal Memory to Stitch Time-based Graph Computations - PubMed Central, accessed September 26, 2025, https://pmc.ncbi.nlm.nih.gov/articles/PMC9792072/
42. Is stochastic thermodynamics the key to understanding the energy costs of computation? | PNAS, accessed September 26, 2025, https://www.pnas.org/doi/10.1073/pnas.2321112121
43. Arrow of time - Wikipedia, accessed September 26, 2025, https://en.wikipedia.org/wiki/Arrow_of_time
44. Physicists uncover evidence of two arrows of time emerging from the quantum realm, accessed September 26, 2025, https://www.surrey.ac.uk/news/physicists-uncover-evidence-two-arrows-time-emerging-quantum-realm
45. Theoretical physicists show that quantum systems have opposing arrows of time, accessed September 26, 2025, https://cosmosmagazine.com/science/physics/quantum-systems-arrow-time/
46. Arrow of Time | Internet Encyclopedia of Philosophy, accessed September 26, 2025, https://iep.utm.edu/arrow-of-time/
47. Time's Arrow Traced to Quantum Source - Quanta Magazine, accessed September 26, 2025, https://www.quantamagazine.org/quantum-entanglement-drives-the-arrow-of-time-scientists-say-20140416/
48. Quantum computing - Wikipedia, accessed September 26, 2025, https://en.wikipedia.org/wiki/Quantum_computing
49. Reversible computing - Wikipedia, accessed September 26, 2025, https://en.wikipedia.org/wiki/Reversible_computing
50. Reversible Computing - CSAIL Publications - MIT, accessed September 26, 2025, https://publications.csail.mit.edu/lcs/pubs/pdf/MIT-LCS-TM-151.pdf
51. Neuromorphic computing for temporal scientific data classification | ORNL, accessed September 26, 2025, https://www.ornl.gov/publication/neuromorphic-computing-temporal-scientific-data-classification
52. [2104.10712] Neuromorphic Algorithm-hardware Codesign for Temporal Pattern Learning, accessed September 26, 2025, https://arxiv.org/abs/2104.10712
53. How does neuromorphic hardware handle temporal data processing? - Patsnap Eureka, accessed September 26, 2025, https://eureka.patsnap.com/report-how-does-neuromorphic-hardware-handle-temporal-data-processing
54. Quantum Computing vs. Classical Computing: What's the Difference? - BlueQubit, accessed September 26, 2025, https://www.bluequbit.io/quantum-computing-vs-classical-computing
55. Quantum vs Classical Computing | Quantum Threat | Enterprise - Quantropi, accessed September 26, 2025, https://www.quantropi.com/quantum-versus-classical-computing-and-the-quantum-threat/
56. (PDF) Quantum Computational Temporal Paradox (QCTP): A Theoretical Framework for Resolving P vs. NP through Temporal Quantum Computation - ResearchGate, accessed September 26, 2025, https://www.researchgate.net/publication/377208632_Quantum_Computational_Temporal_Paradox_QCTP_A_Theoretical_Framework_for_Resolving_P_vs_NP_through_Temporal_Quantum_Computation
57. What is reversible computing? And what is Vaire doing? - Fierce Electronics, accessed September 26, 2025, https://www.fierceelectronics.com/electronics/what-reversible-computing-what-vaire-doing
58. The Role of Temporal Hierarchy in Spiking Neural Networks - arXiv, accessed September 26, 2025, https://arxiv.org/html/2407.18838v1
59. www.frontiersin.org, accessed September 26, 2025, [https://www.frontiersin.org/research-topics/58546/deep-spiking-neural-networks-models-algorithms-and-applications/magazine#:~:text=Spiking%20Neural%20Networks%20(SNNs)%20have,like%20and%20energy%2Defficient%20computations.](https://www.frontiersin.org/research-topics/58546/deep-spiking-neural-networks-models-algorithms-and-applications/magazine#:~:text=Spiking Neural Networks (SNNs) have,like and energy-efficient computations.)
60. [2202.05880] The complexity of computing optimum labelings for temporal connectivity - arXiv, accessed September 26, 2025, https://arxiv.org/abs/2202.05880
61. [2501.12708] Making Temporal Betweenness Computation Faster and Restless - arXiv, accessed September 26, 2025, https://arxiv.org/abs/2501.12708
62. Restless reachability problems in temporal graphs - PMC, accessed September 26, 2025, https://pmc.ncbi.nlm.nih.gov/articles/PMC12170735/
63. Faster and Better Simple Temporal Problems - The Association for the Advancement of Artificial Intelligence, accessed September 26, 2025, https://cdn.aaai.org/ojs/17415/17415-13-20909-1-2-20210518.pdf
64. Connectivity and Inference Problems for Temporal Networks1 - David Kempe, accessed September 26, 2025, https://david-kempe.com/publications/time.pdf
65. The Future of Continual Learning in the Era of Foundation Models: Three Key Directions - arXiv, accessed September 26, 2025, https://arxiv.org/pdf/2506.03320
66. Document-Level Future Event Prediction Integrating Event Knowledge Graph and LLM Temporal Reasoning - MDPI, accessed September 26, 2025, https://www.mdpi.com/2079-9292/14/19/3827