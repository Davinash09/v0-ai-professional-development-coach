#!/usr/bin/env python3
"""
Package PD resources into a simple delivery plan.

Usage:
  python scripts/package_resources.py resources.json

- resources.json should be a JSON array of objects with fields:
  [{ "title": "...", "url": "...", "type": "workshop|tool|best-practice" }]

The script will print a markdown delivery plan to stdout that can be saved or shared.
"""

import json
import sys
from typing import List, Dict

def load_resources(path: str) -> List[Dict]:
  with open(path, "r", encoding="utf-8") as f:
    return json.load(f)

def group_by_type(resources: List[Dict]) -> Dict[str, List[Dict]]:
  grouped: Dict[str, List[Dict]] = {}
  for r in resources:
    t = r.get("type", "other")
    grouped.setdefault(t, []).append(r)
  return grouped

def make_plan(resources: List[Dict]) -> str:
  grouped = group_by_type(resources)
  lines = []
  lines.append("# Professional Development Delivery Plan\n")
  lines.append("## Overview\n")
  lines.append(f"- Total items: {len(resources)}")
  lines.append("- Time Window: 4 weeks (suggested)\n")

  if grouped.get("workshop"):
    lines.append("## Workshops\n")
    for i, r in enumerate(grouped["workshop"], 1):
      lines.append(f"{i}. [{r.get('title')}]({r.get('url')})")

  if grouped.get("tool"):
    lines.append("\n## Tools\n")
    for i, r in enumerate(grouped["tool"], 1):
      lines.append(f"{i}. [{r.get('title')}]({r.get('url')})")

  if grouped.get("best-practice"):
    lines.append("\n## Best Practices\n")
    for i, r in enumerate(grouped["best-practice"], 1):
      lines.append(f"{i}. [{r.get('title')}]({r.get('url')})")

  lines.append("\n## Suggested 4-Week Rollout\n")
  lines.append("Week 1: Pick one workshop and one tool. Pilot in one lesson.\n")
  lines.append("Week 2: Add one best practice and collect formative evidence.\n")
  lines.append("Week 3: Iterate tool use with a different activity or group structure.\n")
  lines.append("Week 4: Share outcomes with colleagues; refine plan.\n")

  return "\n".join(lines) + "\n"

def main():
  if len(sys.argv) != 2:
    print("Usage: python scripts/package_resources.py resources.json", file=sys.stderr)
    sys.exit(1)
  path = sys.argv[1]
  try:
    resources = load_resources(path)
  except Exception as e:
    print(f"Failed to load resources: {e}", file=sys.stderr)
    sys.exit(1)

  plan = make_plan(resources)
  print(plan)

if __name__ == "__main__":
  main()
