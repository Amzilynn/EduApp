import os
from pathlib import Path
from TTS.api import TTS

# 1. Setup paths
output_dir = Path("/mnt/EDUAPP/public/recordings/fr/girl")
output_dir.mkdir(parents=True, exist_ok=True)
ref_voice = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchgirl/girl-voice-fr.mp3"

# 2. Define the targeted tasks
# We use clear phonetic strings for letters to ensure the AI says the name correctly.
tasks = {
    # Family & Words
    "le_p_re": "Le père",
    "la_m_re": "La mère",
    "le_fr_re": "Le frère",
    "rectangle": "Rectangle",
    "gar_on": "Garçon", 
    
    # Instructions & Questions
    "r_ponds_aux_questions_suivantes": "Réponds aux questions suivantes",
    "o_est_le_triangle_jaune": "Où est le triangle jaune ?",
    "o_est_le_carr_bleu": "Où est le carré bleu ?",
    "o_est_le_rectangle_vert": "Où est le rectangle vert ?",
    
    # Letters
    "r": "C'est la lettre ère",
    "m": "C'est la lettre ème",
    "p": "C'est la lettre P",
    "o": "C'est la lettre O",
    "i": "C'est la lettre i circonflexe",  # I chapeau
    "e": "C'est la lettre é",             # E accent
}

# 3. Run Synthesis
print("Initializing XTTS model...")
# The model path is standard for Coqui TTS
model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

for key, text in tasks.items():
    file_path = output_dir / f"{key}.wav"
    print(f"\n>>> Synthesizing {key}: '{text}'")
    try:
        model.tts_to_file(
            text=text, 
            file_path=str(file_path), 
            speaker_wav=ref_voice, 
            language="fr"
        )
    except Exception as e:
        print(f"Error generating {key}: {e}")

print("\nAll targeted fixes for French Girl are complete!")
