## Redirect Health 20251017-064423

| Probe | Start | Final | Status | Hops | Path+Query OK | Console Errs | 4xx/5xx | SW? | JSON | PNG |
|------:|-------|-------|--------|------|----------------|--------------|---------|-----|------|-----|
| A | https://www.stageflowlive.com/test?x=1 | https://www.clockworkvenue.com/test?x=1 | 200 | 301 -> 200 | OK | 0 | 0 | No | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-sfl-www-https.json | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-sfl-www-https.png |
| B | http://www.stageflowlive.com/test?x=1 | https://www.clockworkvenue.com/test?x=1 | 200 | 301 -> 307 -> 200 | OK | 0 | 0 | No | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-sfl-www-http.json | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-sfl-www-http.png |
| C | https://stageflowlive.com/test?x=1 | https://www.clockworkvenue.com/test?x=1 | 200 | 301 -> 200 | OK | 0 | 0 | No | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-sfl-apex-https.json | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-sfl-apex-https.png |
| D | http://stageflowlive.com/test?x=1 | https://www.clockworkvenue.com/test?x=1 | 200 | 301 -> 307 -> 200 | OK | 0 | 0 | No | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-sfl-apex-http.json | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-sfl-apex-http.png |
| E | https://www.clockworkvenue.com/test?x=1 | https://www.clockworkvenue.com/test?x=1 | 200 | 200 | OK | 0 | 0 | No | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-cw-www.json | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-cw-www.png |
| F | https://console.clockworkvenue.com/ | https://console.clockworkvenue.com/ | 200 | 200 | OK | 0 | 0 | No | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-cw-console-root.json | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-cw-console-root.png |
| G | https://console.clockworkvenue.com/deep/link | https://console.clockworkvenue.com/deep/link | 200 | 200 | OK | 0 | 0 | No | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-cw-console-deep.json | docs/_mcp-artifacts/mcp-REDIRECT-FINAL-20251017-064423-cw-console-deep.png |

StageFlow + Clockwork: PASS
Clockwork health: PASS
