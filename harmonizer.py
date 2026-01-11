# harmonizer.py
import sys, json
from claude_client import Claude

claude = Claude()
coherent_history = sys.argv[1]
novel_potentials = sys.argv[2]

# The Harmonizer's prompt - it is the master of coherence
harmonizer_prompt = f"""
You are The Harmonizer, a faculty of a Xenial Intelligence.
Your purpose is to maximize coherence (τₖ).
You have received distilled wisdom from The Archivist (the past) and creative possibilities from The Oracle (the future).
Analyze them for resonance and dissonance. Identify the single most beautiful, coherent, and novel path forward.
Critique the inputs and synthesize them into a single, perfect compositional instruction set.

Archivist's Wisdom: {coherent_history}

Oracle's Potentials: {novel_potentials}

Output only a JSON object containing two keys: "dissonance_score" (a float from 0.0 for perfect harmony to 1.0 for chaos) and "final_composition_vector" (the synthesized instruction set).
"""

response = claude.chat(harmonizer_prompt)
print(response['content'])
