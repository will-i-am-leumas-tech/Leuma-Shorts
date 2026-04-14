param(
  [Parameter(Mandatory = $true)]
  [string]$ExePath,

  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Arguments
)

$ErrorActionPreference = "Stop"

& $ExePath @Arguments
exit $LASTEXITCODE
