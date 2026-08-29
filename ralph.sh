#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "$0")" && pwd)"
MAX_ITERS="${MAX_ITERS:-10}"
MODEL="${RALPH_MODEL:-Gemini 3.1 Pro (High)}"

PROMPT="The project directory is: $REPO.
All file reads, file writes, and git commits MUST happen inside that exact directory.
Read PRD.md and progress.txt first.
Pick EXACTLY ONE incomplete task from PRD.md.
Implement the code changes, run 'npm run typecheck' or verification commands, append progress to progress.txt, and make a git commit.
If all tasks in PRD.md are completed, output 'ALL_TASKS_COMPLETED'."

echo "=========================================="
echo "Starting Ralph Loop for Antigravity"
echo "Project Dir: $REPO"
echo "Max Iters: $MAX_ITERS"
echo "Model: $MODEL"
echo "=========================================="

for i in $(seq 1 "$MAX_ITERS"); do
  echo "--- Iteration $i / $MAX_ITERS ---"
  
  before_commit=$(git -C "$REPO" rev-parse HEAD 2>/dev/null || echo "none")

  output=$(agy -p "$PROMPT" --model "$MODEL" --add-dir "$REPO" \
      --mode accept-edits --dangerously-skip-permissions --print-timeout 15m 2>&1 || true)
  
  echo "$output"

  if echo "$output" | grep -q "ALL_TASKS_COMPLETED"; then
    echo "🎉 All tasks completed successfully!"
    exit 0
  fi

  after_commit=$(git -C "$REPO" rev-parse HEAD 2>/dev/null || echo "none")
  if [ "$before_commit" = "$after_commit" ]; then
    echo "⚠️ Warning: No git commit made in iteration $i."
  fi

  sleep 2
done

echo "Reached maximum iteration limit ($MAX_ITERS)."
