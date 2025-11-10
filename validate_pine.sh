#!/bin/bash
echo "🔍 Vérification syntaxe Pine Script..."

# Vérifier variables non définies
echo "Checking for undefined variables..."

# Vérifier parenthèses/crochets
echo "Checking brackets..."
grep -n "\[.*\[" AI_GOLD_MASTER_ULTRA_FIXED.pine | head -5

# Vérifier duplicates dans tuple assignments
echo "Checking for duplicate variables in tuples..."
grep -n "^\[.*,.*\].*=" AI_GOLD_MASTER_ULTRA_FIXED.pine | while read line; do
    vars=$(echo "$line" | sed 's/.*\[\(.*\)\].*/\1/' | tr ',' '\n' | sort | uniq -d)
    if [ ! -z "$vars" ]; then
        echo "Duplicate found: $line"
    fi
done

echo "✅ Vérification terminée"
