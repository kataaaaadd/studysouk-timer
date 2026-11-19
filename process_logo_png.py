import os
from PIL import Image, ImageDraw

SOURCE_IMG = r"C:\Users\PC\.gemini\antigravity\brain\66e66f56-a1fb-4b19-bf17-34da3aaf4365\studysouk_masterpiece_crest_moroccan_royal_1795124409197.jpg"
TIMER_ASSETS = r"c:\Users\PC\Pictures\studysouk-timer\assets"
BOT_ASSETS = r"c:\Users\PC\Documents\studysouk-bot\assets"

im = Image.open(SOURCE_IMG).convert("RGBA")
width, height = im.size

SCALE = 4
mask = Image.new("L", (width * SCALE, height * SCALE), 0)
draw = ImageDraw.Draw(mask)
center_x = (width * SCALE) / 2
center_y = (height * SCALE) / 2
radius = (462 * SCALE)

draw.ellipse(
    (center_x - radius, center_y - radius, center_x + radius, center_y + radius),
    fill=255
)

mask = mask.resize((width, height), Image.Resampling.LANCZOS)
im_circle = im.copy()
im_circle.putalpha(mask)

# Save timer assets
im_circle.save(os.path.join(TIMER_ASSETS, "logo.png"), format="PNG", optimize=True)
im.save(os.path.join(TIMER_ASSETS, "discord_app_icon.png"), format="PNG", optimize=True)
im.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(TIMER_ASSETS, "discord_app_icon_512.png"), format="PNG", optimize=True)

# Save bot assets
if os.path.exists(BOT_ASSETS):
    im_circle.save(os.path.join(BOT_ASSETS, "logo_studysouk_crest.png"), format="PNG", optimize=True)
    im_circle.save(os.path.join(BOT_ASSETS, "logo_studysouk_elite.png"), format="PNG", optimize=True)

print("Logo PNG files updated successfully!")
