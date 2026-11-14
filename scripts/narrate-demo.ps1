param([string]$CapturePath = 'data/video/capture.json', [string]$OutputDirectory = 'data/video/audio', [string]$VoiceName = 'Microsoft Hazel Desktop')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$capture = Get-Content -LiteralPath $CapturePath -Raw | ConvertFrom-Json
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $voice.SelectVoice($VoiceName)
  $voice.Rate = 2
  $voice.Volume = 100
  foreach ($scene in $capture.scenes) {
    $file = Join-Path (Resolve-Path $OutputDirectory).ProviderPath ($scene.id + '.wav')
    $voice.SetOutputToWaveFile($file)
    $voice.Speak($scene.narration)
    $voice.SetOutputToNull()
    Write-Output ('Narrated: ' + $scene.id)
  }
} finally { $voice.Dispose() }
