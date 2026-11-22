#!/bin/sh
set -e

# KiraKira Nihongo Cloud Run + Litestream Entrypoint
echo "=== KiraKira Nihongo Cloud Run Bootstrapping ==="

mkdir -p /app/data

# 1. Restore SQLite database from GCS replica if available
if [ -n "$LITESTREAM_REPLICA_URL" ] || [ -f /etc/litestream.yml ]; then
  echo "=> Checking GCS replica for SQLite restoration..."
  litestream restore -if-replica-exists -config /etc/litestream.yml /app/data/kirakira.db || echo "=> No existing replica found or restoration skipped; will initialize fresh database."
fi

# 2. Run Litestream live replication in tandem with Node.js
echo "=> Starting Litestream replication alongside Node.js server..."
exec litestream replicate -config /etc/litestream.yml -exec "node server.js"
