
import subprocess
import os

def run_script(name):
    print(f"\n\n🚀 STARTING {name}...\n")
    result = subprocess.run(["python", name], capture_output=False)
    if result.returncode == 0:
        print(f"\n✅ {name} FINISHED SUCCESSFULLY.")
    else:
        print(f"\n❌ {name} FAILED with code {result.returncode}.")

if __name__ == "__main__":
    run_script("REGEN_AR_GIRL_PERFECTION.py")
    run_script("REGEN_AR_BOY_PERFECTION.py")
    print("\n\n🎉 ALL ARABIC REGENERATIONS COMPLETE!")
