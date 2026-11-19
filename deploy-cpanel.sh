#!/bin/bash
set -euo pipefail

CURRENT_USER="$(id -un 2>/dev/null || echo '')"
PASSWD_HOME=""
if [ -n "$CURRENT_USER" ] && command -v getent >/dev/null 2>&1; then
  PASSWD_HOME="$(getent passwd "$CURRENT_USER" | cut -d: -f6 || true)"
fi
USER_HOME="${HOME:-$PASSWD_HOME}"
if [ -n "$USER_HOME" ]; then
  export HOME="$USER_HOME"
fi

REPO_REAL="$(pwd -P)"

# Default deploy target: explicit arg -> $USER_HOME/n.orsit.xyz -> current repo dir
DEPLOYPATH="${1:-}"
if [ -z "$DEPLOYPATH" ] || [ "$DEPLOYPATH" = "/n.orsit.xyz/" ]; then
  if [ -n "$USER_HOME" ] && [ -d "$USER_HOME/n.orsit.xyz" ]; then
    DEPLOYPATH="$USER_HOME/n.orsit.xyz"
  else
    DEPLOYPATH="$REPO_REAL"
  fi
fi

/bin/mkdir -p "$DEPLOYPATH"
DEPLOY_REAL="$(cd "$DEPLOYPATH" && pwd -P)"

# Optional fallback build ONLY when explicitly opted in (prevents CloudLinux LVE hangs during cPanel deploy)
if [ "${ALLOW_CPANEL_BUILD:-0}" = "1" ] && { [ ! -f "dist/index.html" ] || [ "${FORCE_CPANEL_BUILD:-0}" = "1" ]; }; then
  export RAYON_NUM_THREADS=1
  export TOKIO_WORKER_THREADS=1
  export UV_THREADPOOL_SIZE=1
  export npm_config_maxsockets=2

  for dir in \
    "${USER_HOME:-}"/nodevenv/*/*/bin \
    "${USER_HOME:-}"/.nvm/versions/node/*/bin \
    /opt/alt/alt-nodejs*/root/usr/bin \
    /opt/cpanel/ea-nodejs*/bin \
    /usr/local/bin \
    /usr/bin; do
    if [ -n "$dir" ] && [ -d "$dir" ]; then
      PATH="$dir:$PATH"
    fi
  done
  export PATH

  if command -v npm >/dev/null 2>&1 && [ -f "package.json" ]; then
    export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1024}"
    if [ ! -d "node_modules" ] || [ ! -d "node_modules/vite" ]; then
      npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline
    fi
    npm run build
  fi
fi

if [ ! -f "dist/index.html" ]; then
  echo "Error: prebuilt dist/index.html is missing. Wait ~30s for GitHub Actions to commit dist/, then run Update from Remote."
  exit 1
fi

/bin/chmod -R a+rX dist 2>/dev/null || true

if [ "$REPO_REAL" = "$DEPLOY_REAL" ]; then
  # Repo root is the subdomain document root; root .htaccess serves dist/ directly.
  echo "Verified prebuilt dist/ in $DEPLOY_REAL (served via root .htaccess)."
else
  /bin/cp -Rf dist/. "$DEPLOY_REAL/"
  echo "Deployed dist/ to $DEPLOY_REAL."
fi
