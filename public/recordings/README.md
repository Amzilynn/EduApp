# Recordings for Enhanced TTS Quality

This folder contains high-quality pre-recorded audio files for the TTS system.
These recordings take priority over the XTTS-v2 backend synthesis.

## Folder Structure

```
public/recordings/
├── manifest.json          # List of available recordings
├── fr/
│   ├── girl/              # French female child voice
│   │   ├── bonjour.mp3
│   │   ├── la_mere.mp3
│   │   └── ...
│   └── boy/              # French male child voice
│       ├── bonjour.mp3
│       ├── le_pere.mp3
│       └── ...
└── ar/
    ├── girl/              # Arabic female child voice
    │   ├── _al_ah.mp3
    │   └── ...
    └── boy/              # Arabic male child voice
        ├── _al_ah.mp3
        └── ...
```

## File Naming Convention

Files should be named based on the exact text they contain:
- Lowercase
- Spaces and special characters replaced with underscores
- Maximum 50 characters
- Use `.mp3` format

Example conversions:
- "Bonjour les enfants !" → `bonjour_les_enfants_.mp3`
- "La mère" → `la_mere.mp3`
- "الأم" → `_alah_.mp3`

## Priority System

The TTS engine checks for recordings in this order:
1. Local recording (fastest, highest quality)
2. XTTS-v2 backend API
3. Web Speech API (fallback)

## Recommended Recordings to Add

### French - Girl
- bonjour_les_enfants.mp3
- bien_sur.mp3
- tres_bien.mp3
- la_mere.mp3
- le_pere.mp3
- le_frere.mp3
- la_soeur.mp3
- la_grand_mere.mp3
- le_grand_pere.mp3
- rouge.mp3
- bleu.mp3
- jaune.mp3
- vert.mp3
- noir.mp3
- blanc.mp3
- cercle.mp3
- carre.mp3
- triangle.mp3
- rectangle.mp3

### French - Boy
- (same words as above)

### Arabic - Girl
- marhaba_alaikum.mp3
- ayna_al_daira_hamra.mp3 (أين الدائرة الحمراء)
- _alah_.mp3 (الأم)
- _al_abi.mp3 (الأب)
- _al_akh.mp3 (الأخ)
- _al_akht.mp3 (الأخت)
- jaddt.mp3 (جدة)
- jidd.mp3 (جد)

### Arabic - Boy
- (same words as above)

## How to Add Recordings

1. Record your audio using a child voice (3-5 years old)
2. Save as MP3 format with these settings:
   - Bitrate: 128-192 kbps
   - Sample rate: 44100 Hz
   - Channels: Mono
3. Name the file according to the convention above
4. Place in the appropriate folder
5. The TTS engine will automatically use it

## Tips for Best Quality

- Use consistent recording conditions
- Record with a child voice actor
- Keep files short (under 5 seconds ideal)
- Normalize audio levels
- Remove background noise
