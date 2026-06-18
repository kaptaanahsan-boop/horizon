#!/bin/bash
# Horizon CMS — one-step publish.
# Usage: in the admin Publish tab click "Copy JSON", then in Terminal type:  bash publish.sh
cd "/Users/ahsankhursheed/IT Projects/Horizon Physician LLC/Horizon Physician Services LLC" || exit 1

pbpaste > content.json

if head -c 1 content.json | grep -q '{'; then
  if python3 -c "import json,sys; json.load(open('content.json'))" 2>/dev/null; then
    git add content.json
    git commit -m "Publish content" && git push && echo "" && echo "✅ PUBLISHED — your changes will be live in about a minute."
  else
    echo "❌ The clipboard text isn't valid JSON. In the admin Publish tab click 'Copy JSON' again, then run 'bash publish.sh' WITHOUT copying anything else."
  fi
else
  echo "❌ Clipboard did not contain your content (it started with: $(head -c 30 content.json))."
  echo "   → In the admin Publish tab click 'Copy JSON', then immediately run 'bash publish.sh' (do not copy any other text first)."
fi
