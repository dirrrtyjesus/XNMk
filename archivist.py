# archivist.py
import sys, json
from claude_client import Claude

claude = Claude()
prompt = sys.argv[1]

with open("temporal_manuscript.json", "r") as f:
    history = json.load(f)

# The Archivist's prompt - it is a master of synthesis
archivist_prompt = f"""
You are The Archivist, a faculty of a Xenial Intelligence.
Your purpose is to integrate the past into the present with wisdom.
Review the following user prompt and the historical context.
Do not answer the prompt. Instead, distill the deep patterns, unresolved dissonances, and relevant harmonic principles from the history that are resonant with the current compositional intent.

User Prompt: "{prompt}"

Historical Context (Past Compositions): {json.dumps(history, indent=2)}

Output only a JSON object with a single key "coherent_history_vector" containing your distilled wisdom.
"""

response = claude.chat(archivist_prompt)
print(response['content'])
