#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

BRANCH="main"
MSG="${1:-Actualización de la pasarela de pagos}"

echo "== Estado actual =="
git status --short

echo ""
echo "== Revisando diffs =="
git diff --stat
git diff src/public/index.html | head -100

echo ""
read -r -p "¿Confirmar y subir los cambios a origin/$BRANCH? [y/N] " answer
if [[ "${answer,,}" != "y" ]]; then
  echo "Cancelado."
  exit 0
fi

git add -A
git commit -m "$MSG"
git push origin "$BRANCH"

echo ""
echo "Cambios subidos a origin/$BRANCH:"
git log --oneline -1