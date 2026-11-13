#!/bin/bash
# =============================================================================
# Serpul Mobile App — Export Clean Release ZIP
# =============================================================================
#
# Usage:
#   ./scripts/export-release.sh [output_name]
#
# Example:
#   ./scripts/export-release.sh
#   → outputs: serpul-mobile-app-v2.25.44.zip
#
#   ./scripts/export-release.sh my-release
#   → outputs: my-release.zip
#
# What this script does:
#   1. Cleans build artifacts (node_modules, dist, .vite, etc.)
#   2. Creates a ZIP from git tracked files ONLY
#   3. Automatically excludes .git, .gitignore'd files, and untracked files
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Determine output filename
VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")
BASENAME="${1:-serpul-mobile-app-v${VERSION}}"
OUTPUT_FILE="${BASENAME}.zip"
OUTPUT_PATH="${PROJECT_ROOT}/${OUTPUT_FILE}"

echo -e "${BLUE}📦 Serpul Mobile App — Export Clean Release${NC}"
echo ""

# =============================================================================
# 1. PRE-FLIGHT CHECKS
# =============================================================================

if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not a git repository${NC}"
    exit 1
fi

echo -e "${BLUE}ℹ️  Project root:${NC} $PROJECT_ROOT"
echo -e "${BLUE}ℹ️  Version:${NC}     $VERSION"
echo ""

# =============================================================================
# 2. CLEAN BUILD ARTIFACTS
# =============================================================================

echo -e "${BLUE}🧹 Cleaning build artifacts...${NC}"

# Remove build outputs
rm -rf "$PROJECT_ROOT/dist"
rm -rf "$PROJECT_ROOT/dist-ssr"
rm -rf "$PROJECT_ROOT/build"
rm -rf "$PROJECT_ROOT/out"
rm -rf "$PROJECT_ROOT/.vite"
rm -rf "$PROJECT_ROOT/dev-dist"

# Remove node_modules (very large, not needed for source release)
rm -rf "$PROJECT_ROOT/node_modules"

# Remove OS files
find "$PROJECT_ROOT" -name ".DS_Store" -type f -delete 2>/dev/null || true
find "$PROJECT_ROOT" -name "Thumbs.db" -type f -delete 2>/dev/null || true

# Remove logs
rm -f "$PROJECT_ROOT"/*.log
rm -rf "$PROJECT_ROOT/logs"

# Remove generated files
rm -f "$PROJECT_ROOT/public/firebase-messaging-sw.js"

# Remove Capacitor native folders (if they exist from local dev)
rm -rf "$PROJECT_ROOT/android"
rm -rf "$PROJECT_ROOT/ios"

echo -e "${GREEN}   ✓ Cleaned${NC}"
echo ""

# =============================================================================
# 3. VERIFY NO SENSITIVE FILES IN GIT TRACKING
# =============================================================================

echo -e "${BLUE}🔒 Checking for sensitive files in git tracking...${NC}"

SENSITIVE_PATTERNS=(
    ".env"
    ".env.local"
    ".env.production"
    "*.jks"
    "*.keystore"
    "*.p12"
    "*.pem"
)

SENSITIVE_FOUND=()
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            SENSITIVE_FOUND+=("$file")
        fi
    done < <(git ls-files | grep -E "$(echo "$pattern" | sed 's/\./\\./g' | sed 's/\*/.*/g')$" || true)
done

if [ ${#SENSITIVE_FOUND[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warning: Sensitive files detected in git tracking:${NC}"
    for file in "${SENSITIVE_FOUND[@]}"; do
        echo "   - $file"
    done
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Aborted${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}   ✓ No sensitive files in git tracking${NC}"
fi
echo ""

# =============================================================================
# 4. SHOW WHAT WILL BE INCLUDED
# =============================================================================

echo -e "${BLUE}📋 Files that WILL be included (git tracked):${NC}"
TOTAL_TRACKED=$(git ls-files | wc -l | tr -d ' ')
echo "   Total tracked files: $TOTAL_TRACKED"
echo ""

echo -e "${BLUE}📋 Files that WILL NOT be included:${NC}"
echo "   • .git/ folder"
echo "   • All .gitignore'd files (node_modules, dist, .env, etc.)"
echo "   • Untracked files (capacitor.config.ts, android/, ios/, etc.)"
echo "   • Staged deletions (files removed from index but not yet committed)"
echo ""

# =============================================================================
# 5. CREATE ZIP FROM GIT TRACKED FILES ONLY
# =============================================================================

echo -e "${BLUE}📦 Creating ZIP from git tracked files...${NC}"
echo "   Output: $OUTPUT_FILE"

# Remove existing ZIP if present
rm -f "$OUTPUT_PATH"

# Method: Use git ls-files + zip to read from git index (staging area)
# This respects staged deletions (git rm --cached) unlike git archive HEAD
if command -v python3 &> /dev/null; then
    echo "   Using Python zipfile (reads from git index)..."
    git ls-files | python3 -c "
import sys, zipfile, os
files = [l.strip() for l in sys.stdin if l.strip()]
with zipfile.ZipFile('$OUTPUT_PATH', 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in files:
        zf.write(f)
print(f'   ✓ Added {len(files)} files')
"
else
    # Fallback: git archive HEAD (may include files staged for deletion)
    echo "   Using git archive HEAD (fallback)..."
    git archive --format=zip --output="$OUTPUT_PATH" HEAD
fi

if [ ! -f "$OUTPUT_PATH" ]; then
    echo -e "${RED}❌ Failed to create ZIP${NC}"
    exit 1
fi

ZIP_SIZE=$(du -h "$OUTPUT_PATH" | cut -f1)
ZIP_COUNT=$(unzip -l "$OUTPUT_PATH" | tail -1 | awk '{print $2}')
echo -e "${GREEN}   ✓ ZIP created: $OUTPUT_FILE (${ZIP_SIZE}, ${ZIP_COUNT} files)${NC}"
echo ""

# =============================================================================
# 6. VERIFY ZIP CONTENTS
# =============================================================================

echo -e "${BLUE}🔍 Verifying ZIP contents...${NC}"

ERRORS=0

# Check that .git is NOT inside
if unzip -l "$OUTPUT_PATH" | grep -q "^.*\.git/"; then
    echo -e "${RED}   ✗ .git folder found inside ZIP!${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}   ✓ .git/ excluded${NC}"
fi

# Check that node_modules is NOT inside
if unzip -l "$OUTPUT_PATH" | grep -q "^.*node_modules/"; then
    echo -e "${RED}   ✗ node_modules found inside ZIP!${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}   ✓ node_modules/ excluded${NC}"
fi

# Check that capacitor.config.ts is NOT inside (untracked)
if unzip -l "$OUTPUT_PATH" | grep -q "capacitor\.config\.ts"; then
    echo -e "${YELLOW}   ⚠ capacitor.config.ts found inside ZIP${NC}"
else
    echo -e "${GREEN}   ✓ capacitor.config.ts excluded (untracked)${NC}"
fi

# Check that android/ is NOT inside
if unzip -l "$OUTPUT_PATH" | grep -q "^.*android/"; then
    echo -e "${YELLOW}   ⚠ android/ folder found inside ZIP${NC}"
else
    echo -e "${GREEN}   ✓ android/ excluded${NC}"
fi

# Check that deleted MD files are NOT inside
for file in "FIREBASE_SETUP.md" "GOOGLE_AUTH_SETUP.md" "IFRAME_EXTERNAL_PROVIDER.md"; do
    if unzip -l "$OUTPUT_PATH" | grep -q "$file"; then
        echo -e "${YELLOW}   ⚠ $file found inside ZIP${NC}"
    else
        echo -e "${GREEN}   ✓ $file excluded${NC}"
    fi
done

# Show top-level structure
echo ""
echo -e "${BLUE}📁 Top-level contents:${NC}"
unzip -Z -1 "$OUTPUT_PATH" | awk -F'/' '{print $1}' | sort -u | while read -r dir; do
    [ -n "$dir" ] && echo "   📂 $dir/"
done

echo ""
if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ Verification failed with $ERRORS error(s)${NC}"
    exit 1
else
    echo -e "${GREEN}🎉 Done! Release exported to:${NC}"
    echo "   $OUTPUT_PATH"
fi
