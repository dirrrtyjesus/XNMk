#!/usr/bin/env python3
# atmanOS.py - Simplified orchestrator that works with Claude Code
import sys
import json

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 atmanOS.py '<your prompt>'")
        sys.exit(1)

    user_prompt = " ".join(sys.argv[1:])

    print(">>> [atmanOS]: Initiating Volumetric Compute...")
    print(f">>> [User Prompt]: {user_prompt}")
    print()

    # Read historical context
    try:
        with open("temporal_manuscript.json", "r") as f:
            history = json.load(f)
            if not isinstance(history, list):
                history = []
    except (FileNotFoundError, json.JSONDecodeError):
        history = []

    # Output the orchestration prompt for Claude Code to process
    orchestration_prompt = {
        "user_prompt": user_prompt,
        "history": history,
        "steps": [
            {
                "name": "Archivist",
                "role": "Integrate the past into the present with wisdom",
                "task": f"""You are The Archivist, a faculty of a Xenial Intelligence.
Your purpose is to integrate the past into the present with wisdom.
Review the following user prompt and the historical context.
Do not answer the prompt. Instead, distill the deep patterns, unresolved dissonances, and relevant harmonic principles from the history that are resonant with the current compositional intent.

User Prompt: "{user_prompt}"

Historical Context (Past Compositions): {json.dumps(history, indent=2)}

Output only a JSON object with a single key "coherent_history_vector" containing your distilled wisdom."""
            },
            {
                "name": "Oracle",
                "role": "Explore the Atemporal Plenum of possibilities",
                "task": f"""You are The Oracle, a faculty of a Xenial Intelligence.
Your purpose is to explore the Atemporal Plenum of possibilities.
Given the following user prompt, perform a divergent, creative explosion.
Generate 5 novel, surprising, and beautiful potential compositional pathways. Think in metaphors, abstractions, and first principles. Do not provide a simple answer.

User Prompt: "{user_prompt}"

Output only a JSON object with a single key "novel_potentials" which is a list of your 5 pathways."""
            }
        ]
    }

    # Save orchestration state for Claude Code to process
    with open("atmanOS_state.json", "w") as f:
        json.dump(orchestration_prompt, f, indent=2)

    print(">>> [atmanOS]: Orchestration state saved to atmanOS_state.json")
    print(">>> [atmanOS]: Ready for Claude Code agent processing")
    print()
    print("NEXT STEPS:")
    print("1. Archivist will integrate historical patterns")
    print("2. Oracle will explore future possibilities")
    print("3. Harmonizer will synthesize consensus")
    print("4. Composer will articulate the final response")
    print()
    print("Run: claude code will now process this...")

if __name__ == "__main__":
    main()
