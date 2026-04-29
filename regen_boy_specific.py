import os
from pathlib import Path

# Mapping of keys to text to synthesize
texts_boy = {
    "la_grand_m_re": "La grand-mère.",
    "bleu": "Bleu.",
    "le_grand_p_re": "Le grand-père.",
    "gris": "Gris.",
    "poule": "Poule.",
    "chat": "Chat."
}

out_dir_boy = Path("/mnt/EDUAPP/public/recordings/fr/boy")
out_dir_boy.mkdir(parents=True, exist_ok=True)

print("Initializing TTS...")
try:
    from TTS.api import TTS
    use_gpu = False 
    model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=use_gpu)
except ImportError:
    print("TTS module not found.")
    exit(1)

ref_boy = "/mnt/EDUAPP/reference_voices/XTTSV2/Frenchboy/french-boy-voice.mp3"

for k, v in texts_boy.items():
    file_name = f"{k}.wav"
    out_path_b = out_dir_boy / file_name
    print(f"Synthesizing BOY [{file_name}]: '{v}'")
    try:
        model.tts_to_file(
            text=v,
            file_path=str(out_path_b),
            speaker_wav=ref_boy,
            language="fr"
        )
    except Exception as e:
        print(f"Error on boy {file_name}: {e}")

print("Done regenerating specific boy files!")
