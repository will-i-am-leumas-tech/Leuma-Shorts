param(
  [string]$Config = ".\examples\jobs\full-gameplay.json",
  [string]$OutputDir = "",
  [string]$GameplaySource = "",
  [string]$GameplayPreset = "",
  [string]$MediaSource = "",
  [string]$InputFile = "",
  [string]$Title = "",
  [switch]$SkipDemoAssets
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

if (-not $SkipDemoAssets) {
  & node scripts/bootstrap-demo-assets.js
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}

$arguments = @("cli.js", "generate", "--config", $Config)
if ($OutputDir) {
  $arguments += @("--outputDir", $OutputDir)
}
if ($GameplaySource) {
  $arguments += @("--gameplaySource", $GameplaySource)
}
if ($GameplayPreset) {
  $arguments += @("--gameplayPreset", $GameplayPreset)
}
if ($MediaSource) {
  $arguments += @("--mediaSource", $MediaSource)
}
if ($InputFile) {
  $arguments += @("--inputFile", $InputFile)
}
if ($Title) {
  $arguments += @("--title", $Title)
}

& node @arguments
exit $LASTEXITCODE
