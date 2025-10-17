$ErrorActionPreference = "Stop"

function Test-Dns {
  param([string]$Domain, [string[]]$Resolvers = @("1.1.1.1","8.8.8.8"))
  foreach ($resolver in $Resolvers) {
    $query = nslookup $Domain $resolver | Select-String -Pattern "Address:\s+([\d\.]+)" -AllMatches
    $addresses = $query.Matches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    if ($addresses.Count -eq 0) {
      Write-Host "DNS $Domain @ $resolver => (no address records returned)"
    } else {
      Write-Host "DNS $Domain @ $resolver => $($addresses -join ', ')"
    }
  }
}

function Head {
  param([string]$Url)
  $resp = curl.exe -s -I $Url
  $codeMatch = ($resp | Select-String -Pattern "^HTTP/.* (\d{3})" -AllMatches).Matches
  $code = if ($codeMatch.Count) { $codeMatch[0].Groups[1].Value } else { "?" }
  $loc  = ($resp | Select-String -Pattern "^Location:\s*(.+)") | ForEach-Object { $_.Line.Trim() }
  $sts  = ($resp | Select-String -Pattern "^Strict-Transport-Security:\s*(.+)") | ForEach-Object { $_.Line.Trim() }
  Write-Host "`n$Url => $code"
  if ($loc) { Write-Host $loc }
  if ($sts) { Write-Host $sts }
}

# DNS checks
@("clockworkvenue.com","www.clockworkvenue.com","console.clockworkvenue.com","stageflowlive.com","www.stageflowlive.com") | ForEach-Object { Test-Dns -Domain $_ }

# HTTP/S redirect & header checks
Head "http://clockworkvenue.com/test?x=1"
Head "https://clockworkvenue.com/test?x=1"
Head "https://www.clockworkvenue.com/test?x=1"
Head "https://console.clockworkvenue.com/"
Head "https://stageflowlive.com/"
Head "https://www.stageflowlive.com/"

Write-Host "`nDone."
