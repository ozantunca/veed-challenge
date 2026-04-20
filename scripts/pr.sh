#!/usr/bin/env bash
set -e

TITLE="$1"
BODY="$2"
BRANCH="$3"

if [ -z "$BRANCH" ]; then
  echo "Branch name required"
  exit 1
fi

# create or switch to branch
if git show-ref --verify --quiet refs/heads/$BRANCH; then
  git checkout $BRANCH
else
  git checkout -b $BRANCH
fi

git add -A

# skip empty commits
if git diff --cached --quiet; then
  echo "No changes to commit"
  exit 0
fi

git commit -m "$TITLE"
git push -u origin $BRANCH

# check if PR already exists
if gh pr view $BRANCH >/dev/null 2>&1; then
  echo "PR already exists → updated via push"
else
  gh pr create \
    --title "$TITLE" \
    --body "$BODY" \
    --head $BRANCH \
    --fill
fi
