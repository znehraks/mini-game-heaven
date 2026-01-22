#!/bin/bash
# post-task.sh - Notion task status verification hook
# claude-symphony workflow pipeline
#
# This hook runs after task completion to verify that
# the corresponding Notion task status has been updated.
#
# ISSUE-005: Enforce Notion task status updates

set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Parameters
TASK_ID="${1:-}"
EXPECTED_STATUS="${2:-Done}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${CYAN}[Notion Task Verification]${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# If no task ID provided, just remind
if [ -z "$TASK_ID" ]; then
    echo -e "${YELLOW}⚠️  Task ID not provided${NC}"
    echo ""
    echo "Reminder: Task completion requires Notion status update!"
    echo ""
    echo "Required action:"
    echo "  1. Find the task page ID in Notion"
    echo "  2. Run: mcp__notion__notion-update-page"
    echo "     - page_id: [task page ID]"
    echo "     - command: update_properties"
    echo "     - properties: { \"Status\": \"Done\" }"
    echo ""
    echo -e "${YELLOW}Task is NOT complete until Notion is updated!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
fi

# Log the verification attempt
echo "Task ID: $TASK_ID"
echo "Expected Status: $EXPECTED_STATUS"
echo ""

# Since we can't directly call Notion MCP from bash,
# this hook serves as a reminder and documentation
echo -e "${YELLOW}⚠️  Manual Verification Required${NC}"
echo ""
echo "Please verify the following in Notion:"
echo "  1. Task '$TASK_ID' exists"
echo "  2. Status is set to '$EXPECTED_STATUS'"
echo ""
echo "If not updated, run:"
echo "  mcp__notion__notion-update-page"
echo "    - page_id: $TASK_ID"
echo "    - command: update_properties"
echo "    - properties: { \"Status\": \"$EXPECTED_STATUS\" }"
echo ""

# Check for verification flag file (set by MCP integration)
VERIFICATION_FLAG="/tmp/notion_task_${TASK_ID}_verified"
if [ -f "$VERIFICATION_FLAG" ]; then
    echo -e "${GREEN}✓${NC} Task status verified via MCP integration"
    rm -f "$VERIFICATION_FLAG"
else
    echo -e "${YELLOW}⚠️${NC} Waiting for manual verification or MCP update"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
