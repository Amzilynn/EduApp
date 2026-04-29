import os
import json
import subprocess
from pathlib import Path

# ─── 1. Target files with exact Diacritics ─────────────────────────────────────────
# Keys correspond to the desired filename.
# Values are the fully diacritized Arabic strings to ensure the TTS pronounces them correctly.

targets = {
    "أعد_مرة_أخرى": "أَعِدْ مَرَّةً أُخْرَى",              # repeat again
    "أين_المربع_الأزرق؟": "أَيْنَ الْمُرَبَّعُ الْأَزْرَقُ؟",      # where is the bleu square
    "أين_المستطيل_الأخضر؟": "أَيْنَ الْمُسْتَطِيلُ الْأَخْضَرُ؟",   # where is the green rectangle
    "أحسنت": "أَحْسَنْتَ",                             # bravo
    "أحمر": "أَحْمَر",                                # rouge
    "أصفر": "أَصْفَر",                                # jaune
    "أخضر": "أَخْضَر",                                # green
    "وردي": "وَرْدِيّ",                               # pink
    "بني": "بُنِّيّ",                                  # marron
    "بنفسجي": "بَنَفْسَجِيّ",                           # purple
    "مستطيل": "مُسْتَطِيل",                             # rectangle
    "مثلث": "مُثَلَّث",                                # triangle
    "امزج_الألوان_لتجد_النتيجة_الصحيحة": "اِمْزَجِ الْأَلْوَانَ لِتَجِدَ النَّتِيجَةَ الصَّحِيحَةَ", # melange les couleurs
}

# ─── 2. Prepare reference voice ───────────────────────────────────────────────
REF_SOURCE = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb.mp4"
REF_WAV    = "/mnt/EDUAPP/reference_voices/XTTSV2/Arabicgirl/girlarb_ref.wav"

print("=" * 60)
print("Step 1: Extracting & normalizing girlarb.mp4 → girlarb_ref.wav")
print("=" * 60)

if not os.path.exists(REF_WAV):
    result = subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", REF_SOURCE,
            "-vn",                                    # strip video
            "-ac", "1",                               # mono
            "-ar", "22050",                           # XTTS required sample rate
            "-af", "loudnorm=I=-16:TP=-3:LRA=11",    # EBU R128 loudness normalize
            REF_WAV
        ],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"ERROR: ffmpeg failed:\n{result.stderr}")
        exit(1)
    print(f"  -> Reference WAV ready: {REF_WAV}\n")
else:
    print(f"  -> Reference WAV already exists: {REF_WAV}\n")

# ─── 3. Load XTTS model ───────────────────────────────────────────────────────
print("=" * 60)
print("Step 2: Loading XTTS-v2 model...")
print("=" * 60)
try:
    from TTS.api import TTS
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
except ImportError as e:
    print(f"ERROR: TTS module not found: {e}")
    exit(1)
print("  -> Model loaded.\n")

# ─── 4. Generate recordings ───────────────────────────────────────────────────
OUTPUT_DIR = Path("/mnt/EDUAPP/public/recordings/ar/girl")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

total     = len(targets)
generated = 0
errors    = 0

print("=" * 60)
print(f"Step 3: Synthesizing {total} specific recordings → {OUTPUT_DIR}")
print("=" * 60)

for i, (key, text) in enumerate(targets.items(), 1):
    file_name = f"{key}.wav"
    out_path = OUTPUT_DIR / file_name

    print(f"[{i:3}/{total}] Synthesizing: {file_name}  →  '{text}'")
    try:
        model.tts_to_file(
            text=text,
            file_path=str(out_path),
            speaker_wav=REF_WAV,
            language="ar"
        )
        generated += 1
        print(f"         ✓ Saved: {out_path}")
    except Exception as e:
        errors += 1
        print(f"         ✗ ERROR: {e}")

# ─── 5. Summary ───────────────────────────────────────────────────────────────
print()
print("=" * 60)
print(f"DONE — Specific Arabic girl voice generation complete!")
print(f"  Generated : {generated}")
print(f"  Errors    : {errors}")
print(f"  Output    : {OUTPUT_DIR}")
print("=" * 60)
