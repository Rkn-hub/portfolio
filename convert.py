import os
import glob
from PIL import Image

def convert_to_webp(filepath, out_path):
    with Image.open(filepath) as img:
        img.save(out_path, 'webp')
    print(f"Converted {os.path.basename(filepath)} -> {os.path.basename(out_path)}")

# 1. Convert 3dmodel WhatsApp JPEGs
model_dir = r"c:\Users\Rites\OneDrive\Desktop\projects\portfolio\gallery\3dmodel"
jpegs = glob.glob(os.path.join(model_dir, "WhatsApp*.jpeg")) + glob.glob(os.path.join(model_dir, "WhatsApp*.jpg"))
for i, jp in enumerate(sorted(jpegs)):
    out_name = os.path.join(model_dir, f"watch_model_{i+1}.webp")
    convert_to_webp(jp, out_name)
    os.remove(jp)

# 2. Convert certificates
cert_dir = r"c:\Users\Rites\OneDrive\Desktop\projects\portfolio\gallery\certificate"
aws1 = r"C:\Users\Rites\.gemini\antigravity-ide\brain\175e495f-a442-45f6-ad4e-498002ad3371\media__1780987998003.png"
aws2 = r"C:\Users\Rites\.gemini\antigravity-ide\brain\175e495f-a442-45f6-ad4e-498002ad3371\media__1780987963192.png"

if os.path.exists(aws1):
    convert_to_webp(aws1, os.path.join(cert_dir, "aws_software_dev.webp"))
if os.path.exists(aws2):
    convert_to_webp(aws2, os.path.join(cert_dir, "aws_prompt_eng.webp"))
