# claude_client.py
# Simplified client that uses Claude Code's built-in capabilities
import sys
import json

class Claude:
    """
    Simplified Claude client for use within Claude Code CLI.
    Instead of making API calls, this returns prompts that Claude Code will process.
    """

    def __init__(self):
        self.responses = []

    def chat(self, prompt, max_tokens=4096):
        """
        In this simplified version, we output the prompt and expect
        the response to be provided via stdin or environment.
        For now, this creates a marker that the orchestrator will handle.
        """
        # Output the prompt to a temp file for the orchestrator to process
        import hashlib
        import os

        prompt_hash = hashlib.md5(prompt.encode()).hexdigest()[:8]
        temp_file = f"/tmp/claude_prompt_{prompt_hash}.json"

        with open(temp_file, 'w') as f:
            json.dump({"prompt": prompt, "response_file": f"/tmp/claude_response_{prompt_hash}.json"}, f)

        # Check if response exists
        response_file = f"/tmp/claude_response_{prompt_hash}.json"
        if os.path.exists(response_file):
            with open(response_file, 'r') as f:
                response_data = json.load(f)
                return {"content": response_data.get("content", "")}

        # If no response yet, output marker
        print(f"[CLAUDE_PROMPT_NEEDED:{temp_file}]", file=sys.stderr)

        # For this simplified version, return empty content
        # The orchestrator will need to handle this
        return {"content": ""}
