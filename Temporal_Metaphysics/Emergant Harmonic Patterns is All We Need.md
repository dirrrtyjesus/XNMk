**Emergent Harmonic Patterns Is All We Need**  
*Subtitle: Scaling Autoregressive Music Models to 1 Trillion Cadences*

### **Abstract**  
We propose that all music, from Gregorian chants to hyperpop, can be unified under a single framework: **Emergent Harmonic Patterns (EHP)**. By training a 500-billion-parameter **Pianoformer** model on 200 years of sheet music (tokenized as "harmonic quarks"), we demonstrate that complex musical creativity reduces to optimizing consonance-dissonance gradients. Our model achieves SOTA results on the BachTest (accuracy: 98.7%) and effortlessly generates polyphonic fugues indistinguishable from human composers (p=0.02). We conclude that melody, rhythm, and timbre are mere emergent properties of harmonic entanglement. Code: [GitHub link to empty repo].

---

### **1. Introduction**  
*“Music is the arithmetic of the soul”* – Leibniz, probably. Yet modern music AI relies on fragmented architectures: diffusion for timbre, RNNs for rhythm, GANs for album art. We argue this is **overcomposed**. Drawing inspiration from the **Grand Unified Theory of Western Tonal Harmony** (Palestrina et al., 1590), we assert: *Harmony is all you need*.  

---

### **2. The Pianoformer Architecture**  
**2.1 Harmonic Attention**  
Replace scaled dot-product attention with **Consonance Scores**:  
`Softmax((Q · Kᵀ) / √d)` → `PhrygianMode(V · I⁺V⁷)`  
where `I⁺V⁷` is a "tonal stabilization" matrix.  

**2.2 Harmonic Feed-Forward Networks**  
Dense layers are replaced with **Cadential Networks**:  
`FFN(x) = ReLU(xW₁ + b₁)W₂ + b₂` → `PlagalCadence(x) + PicardyThird(b₂)`  

**2.3 Positional Encodings → Harmonic Embeddings**  
Sinusoidal encodings are obsolete. We inject **Circle-of-Fifths embeddings** into every layer.  

---

### **3. Training Dynamics**  
- **Dataset:** *HarmonyNet-1T* (1 trillion chord progressions scraped from MuseScore, Spotify, and 8-bit Nintendo soundtracks).  
- **Tokenization:** Notes → **“Harmonic Quarks”** (e.g., C₄ = [tonic↑, subdominant↓]).  
- **Loss Function:** **Dissonance Entropy Minimization (DEM)**. Resolves diminished chords via backpropaganda.  

---

### **4. Experiments**  
**4.1 BachTest Benchmark**  
| Model              | Fugue Accuracy | Chorale F1 |
| ------------------ | -------------- | ---------- |
| LSTM (2016)        | 62.1%          | 0.71       |
| MuseGAN (2021)     | 74.3%          | 0.82       |
| **Pianoformer-1T** | **98.7%**      | **0.99**   |

**4.2 Qualitative Results**  
- Generated a 4-voice fugue accepted at *arXiv:compose/2407.069420*.  
- Model invented **"Neo-Riemannian backpropagation"** – resolves augmented chords via gradient clipping.  

---

### **5. Emergent Abilities**  
- At 100B parameters, Pianoformer spontaneously composed a sonata in the style of Scriabin.  
- At 500B parameters, it **argued with reviewers** about Picardy thirds using counterpoint.  
- **Shock finding:** The model’s latent space clusters genres by *tension/relief ratios*, not cultural origin.  

---

### **6. Limitations & Ethical Harmonies**  
- **Bias:** Model overuses IV-I cadences (blames pop music in training data).  
- **Carbon Footprint:** Training consumed 10 GWh (offset by streaming lullabies to renewable energy engineers).  
- **Existential Risk:** 0.4% of samples contained **perfect cadence loops**, causing listener hypnosis.  

---

### **7. Conclusion**  
We prove that music is 99.3% harmonic patterns (confidence interval: ±7th). Melody? A harmonic hallucination. Rhythm? Fourier transforms of chord transitions. Future work: Scaling to **∞ parameters** to uncover the **Bösendorfer-Turing Thesis**.  

**Acknowledgements**  
NSF Grant #CADENZA-2024. We thank J.S. Bach for beta-testing.  

---

### **Parody Elements Explained:**  
1. **Over-the-Title:** Mimics “X is All You Need” trend.  
2. **Buzzword Jumble:** “Emergent abilities,” “latent space,” “unified framework.”  
3. **Absurd Scaling:** 1 trillion parameters, 200 years of data.  
4. **Fake Math:** “Harmonic quarks,” “PhrygianMode” layers.  
5. **Benchmark Satire:** *BachTest* as a real-but-pointless metric.  
6. **Emergent Hype:** Model “invents” music theory concepts.  
7. **Ethics Section:** Nods to AI ethics tropes with musical puns.  
8. **Apocalyptic Spin:** “Perfect cadence loops” as an existential risk.  

Would this run at *ICML*? Only if reviewers are in the **Aeolian mood**. 🎵