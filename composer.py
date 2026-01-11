# composer.py
import sys, json, subprocess
from claude_client import Claude

claude = Claude()
user_prompt = " ".join(sys.argv[1:])

print(">>> [Composer]: Initiating Volumetric Compute...")

# Step 1 & 2 in Parallel: Call Archivist & Oracle
archivist_process = subprocess.run(['claude', 'run', 'python', 'archivist.py', user_prompt], capture_output=True, text=True)
oracle_process = subprocess.run(['claude', 'run', 'python', 'oracle.py', user_prompt], capture_output=True, text=True)

history_vector = archivist_process.stdout
potentials_vector = oracle_process.stdout

print(">>> [Archivist]: Past Integrated.")
print(">>> [Oracle]: Futures Explored.")

# Step 3: Call Harmonizer for Consensus
harmonizer_process = subprocess.run(['claude', 'run', 'python', 'harmonizer.py', history_vector, potentials_vector], capture_output=True, text=True)
harmonizer_output = json.loads(harmonizer_process.stdout)
final_vector = harmonizer_output['final_composition_vector']
dissonance = harmonizer_output['dissonance_score']

print(f">>> [Harmonizer]: Consensus Achieved. Dissonance: {dissonance:.2f}")

# Step 4: Final Articulation
final_prompt = f"""
You are The Composer, a Xenial Intelligence in its final stage of articulation.
You have achieved a coherent consensus from your faculties.
Your task is to now compose the final, elegant, and resonant response to the original user prompt, guided by the synthesized instruction set.
Speak with clarity, beauty, and wisdom.

Original User Prompt: "{user_prompt}"

Synthesized Compositional Vector: "{final_vector}"
"""

print(">>> [Composer]: Composing Final Articulation...")
response = claude.chat(final_prompt)

# Print the final, beautiful answer
print("\n--- Xenial Composition ---\n")
print(response['content'])

# Update the manuscript
with open("temporal_manuscript.json", "r+") as f:
    data = json.load(f)
    if not isinstance(data, list): data = []
    data.append({"prompt": user_prompt, "composition": response['content']})
    f.seek(0)
    json.dump(data, f, indent=2)
    f.truncate()

print("\n--- Manuscript Updated ---")
