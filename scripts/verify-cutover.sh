#!/usr/bin/env bash
set -euo pipefail

test_dns() {
  local host="$1"
  echo "DNS $host:"
  for resolver in 1.1.1.1 8.8.8.8; do
    if command -v getent >/dev/null 2>&1; then
      getent hosts "$host" || true
    fi
    dig +short "$host" @"$resolver" || true
  done
  echo
}

heady() {
  local url="$1"
  echo -e "\n$url"
  curl -s -I "$url" | sed -n '1p;/^Location:/p;/^Strict-Transport-Security:/p'
}

for host in clockworkvenue.com www.clockworkvenue.com console.clockworkvenue.com stageflowlive.com www.stageflowlive.com; do
  test_dns "$host"
done

heady "http://clockworkvenue.com/test?x=1"
heady "https://clockworkvenue.com/test?x=1"
heady "https://www.clockworkvenue.com/test?x=1"
heady "https://console.clockworkvenue.com/"
heady "https://stageflowlive.com/"
heady "https://www.stageflowlive.com/"

echo "Done."
