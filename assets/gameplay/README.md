# Gameplay Assets

`assets/gameplay/placeholder-*.mp4` files are synthetic demo loops for testing the pipeline.

They are not real Subway Surfers, Minecraft parkour, GTA parkour, or other production gameplay footage.

Put real gameplay clips under `assets/gameplay/real/` and point jobs at those files.

Example Windows flow:

```powershell
.\scripts\import-gameplay.ps1 -Source C:\clips\subway-surfers.mp4 -Preset subway-surfers
.\scripts\import-gameplay.ps1 -Source C:\clips\minecraft-parkour.mp4 -Preset minecraft-parkour
.\scripts\import-gameplay.ps1 -Source C:\clips\gta-parkour.mp4 -Preset gta-parkour
.\scripts\run-job.ps1 -Config .\examples\jobs\full-gameplay.json -GameplayPreset subway-surfers -OutputDir .\output\subway-surfers-real
```
