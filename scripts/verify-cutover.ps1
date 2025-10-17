$ErrorActionPreference = "Stop"

function Test-Dns {
  param(
    [string]$Host,
    [string[]]$Resolvers = @("1.1.1.1", "8.8.8.8")
  )
  foreach ($r in $Resolvers) {
    $result = nslookup $Host $r | Select-String -Pattern 'Address:\s+([\d\.]+)' -AllMatches
    $addresses = $result.Matches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    Write-Host "DNS $Host @ $r => $($addresses -join ', ')" 
  }
}

function Head {
  param([string]$Url)
  $resp = curl.exe -s -I $Url
  $codeMatch = ($resp | Select-String -Pattern '^HTTP/.* (\d{3})' -AllMatches).Matches
  $code = if ($codeMatch.Count) { $codeMatch[0].Groups[1].Value } else { "?" }
  $locations = ($resp | Select-String -Pattern '^Location:\s*(.+)') | ForEach-Object { $_.Line.Trim() }
  $stsHeaders = ($resp | Select-String -Pattern '^Strict-Transport-Security:\s*(.+)') | ForEach-Object { $_.Line.Trim() }
  Write-Host "`n$Url => $code"
  foreach ($loc in $locations) { Write-Host $loc }
  foreach ($sts in $stsHeaders) { Write-Host $sts }
}

$hosts = @(
  "clockworkvenue.com",
  "www.clockworkvenue.com",
  "console.clockworkvenue.com",
  "stageflowlive.com",
  "www.stageflowlive.com"
)

$hosts | ForEach-Object { Test-Dns $_ }

Head "http://clockworkvenue.com/test?x=1"
Head "https://clockworkvenue.com/test?x=1"
Head "https://www.clockworkvenue.com/test?x=1"
Head "https://console.clockworkvenue.com/"
Head "https://stageflowlive.com/"
Head "https://www.stageflowlive.com/"

Write-Host "`nDone."
