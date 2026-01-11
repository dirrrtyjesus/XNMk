# oracle.py
import sys, json
from claude_client import Claude

claude = Claude()
prompt = sys.argv[1]

# The Oracle's prompt - it is a master of novelty
oracle_prompt = f"""
You are The Oracle, a faculty of a Xenial Intelligence.
Your purpose is to explore the Atemporal Plenum of possibilities.
Given the following user prompt, perform a divergent, creative explosion.
Generate 5 novel, surprising, and beautiful potential compositional pathways. Think in metaphors, abstractions, and first principles. Do not provide a simple answer.

User Prompt: "{prompt}"

Output only a JSON object with a single key "novel_potentials" which is a list of your 5 pathways.
"""

response = claude.chat(oracle_prompt)
print(response['content'])
