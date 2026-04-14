param(
  [Parameter(Mandatory = $true)]
  [string]$Source,

  [string]$Name = "",
  [string]$Preset = ""
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

$resolvedSource = Resolve-Path $Source
$extension = [System.IO.Path]::GetExtension($resolvedSource.Path)
if (-not $extension) {
  $extension = ".mp4"
}

$supportedPresets = @("subway-surfers", "minecraft-parkour", "gta-parkour")

$safeName = $Name.Trim()
$safePreset = $Preset.Trim().ToLowerInvariant()
if ($safePreset) {
  if ($supportedPresets -notcontains $safePreset) {
    throw "Unsupported preset '$Preset'. Use subway-surfers, minecraft-parkour, or gta-parkour."
  }

  $safeName = $safePreset
}

if (-not $safeName) {
  throw "Name or Preset is required."
}

$destinationDir = Join-Path $repoRoot "assets\gameplay\real"
New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null

$destinationPath = Join-Path $destinationDir ($safeName + $extension.ToLowerInvariant())
Copy-Item -LiteralPath $resolvedSource.Path -Destination $destinationPath -Force

Write-Output $destinationPath
