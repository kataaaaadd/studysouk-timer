import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_app_icon(output_path="assets/studysouk_icon_1024.png", size=1024):
    img = Image.new("RGBA", (size, size), (7, 7, 9, 255))
    draw = ImageDraw.Draw(img)

    center = size // 2
    
    # 1. Background radial Dark Cherry gradient
    bg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg)
    max_radius = int(size * 0.65)
    for r in range(max_radius, 0, -4):
        alpha = int(180 * (1 - (r / max_radius) ** 1.5))
        # Gradient from Cherry (#7A0E27) to Dark Obsidian
        red = int(7 + (122 - 7) * (1 - r / max_radius))
        green = int(7 + (14 - 7) * (1 - r / max_radius))
        blue = int(9 + (39 - 9) * (1 - r / max_radius))
        bg_draw.ellipse(
            [center - r, center - r, center + r, center + r],
            fill=(red, green, blue, alpha)
        )
    img = Image.alpha_composite(img, bg)
    draw = ImageDraw.Draw(img)

    # 2. Outer Luxury Bezel Ring (Platinum / Chrome with Cherry tint)
    r_outer = int(size * 0.42)
    r_inner = int(size * 0.39)
    draw.ellipse([center - r_outer - 4, center - r_outer - 4, center + r_outer + 4, center + r_outer + 4], outline=(226, 232, 240, 40), width=3)
    draw.ellipse([center - r_outer, center - r_outer, center + r_outer, center + r_outer], outline=(158, 24, 56, 220), width=10)
    draw.ellipse([center - r_inner, center - r_inner, center + r_inner, center + r_inner], outline=(245, 158, 11, 180), width=4)

    # 3. Tachymeter Dial Tick Marks
    for i in range(60):
        angle = i * (2 * math.pi / 60) - math.pi / 2
        is_major = (i % 5 == 0)
        is_quarter = (i % 15 == 0)
        
        tick_len = 28 if is_quarter else (18 if is_major else 8)
        tick_width = 5 if is_quarter else (3 if is_major else 2)
        color = (255, 255, 255, 255) if is_quarter else ((245, 158, 11, 230) if is_major else (148, 163, 184, 140))
        
        r1 = r_inner - 10
        r2 = r1 - tick_len
        
        x1 = center + int(r1 * math.cos(angle))
        y1 = center + int(r1 * math.sin(angle))
        x2 = center + int(r2 * math.cos(angle))
        y2 = center + int(r2 * math.sin(angle))
        
        draw.line([x1, y1, x2, y2], fill=color, width=tick_width)

    # 4. Inner Dial Core
    r_core = int(size * 0.28)
    draw.ellipse([center - r_core, center - r_core, center + r_core, center + r_core], fill=(12, 10, 16, 230), outline=(122, 14, 39, 200), width=6)

    # 5. Academic Moroccan Emblem & Stopwatch Hand
    # Elegant Stopwatch Hand pointing to 10:10 (Classic Swiss Chronometer angle)
    hand_angle = -math.pi / 3  # roughly 10 o'clock
    hand_len = int(r_core * 0.85)
    hx = center + int(hand_len * math.cos(hand_angle))
    hy = center + int(hand_len * math.sin(hand_angle))
    
    # Hand line with glow
    draw.line([center, center, hx, hy], fill=(245, 158, 11, 255), width=8)
    # Hand counter-weight
    cx = center - int(30 * math.cos(hand_angle))
    cy = center - int(30 * math.sin(hand_angle))
    draw.line([center, center, cx, cy], fill=(158, 24, 56, 255), width=10)
    
    # Hand tip arrowhead
    draw.ellipse([hx - 8, hy - 8, hx + 8, hy + 8], fill=(255, 255, 255, 255))

    # Center Pivot Jewel
    draw.ellipse([center - 22, center - 22, center + 22, center + 22], fill=(158, 24, 56, 255), outline=(245, 158, 11, 255), width=5)
    draw.ellipse([center - 8, center - 8, center + 8, center + 8], fill=(255, 255, 255, 255))

    # 6. Moroccan Star & Laurel Symbol at bottom inside core
    star_y = center + int(r_core * 0.45)
    draw.ellipse([center - 16, star_y - 16, center + 16, star_y + 16], fill=(245, 158, 11, 220))
    draw.ellipse([center - 8, star_y - 8, center + 8, star_y + 8], fill=(122, 14, 39, 255))

    img.save(output_path, "PNG")
    print(f"Created app icon: {output_path} ({size}x{size})")


def create_activity_banner(output_path="assets/studysouk_banner_1920.png", width=1920, height=1080):
    img = Image.new("RGBA", (width, height), (7, 7, 9, 255))
    draw = ImageDraw.Draw(img)

    # 1. Ambient Background Dark Cherry lighting
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    
    # Two radial glow centers (left-center and right)
    centers = [(int(width * 0.75), int(height * 0.5)), (int(width * 0.25), int(height * 0.3))]
    for cx, cy in centers:
        for r in range(700, 0, -8):
            alpha = int(120 * (1 - (r / 700) ** 1.8))
            red = int(7 + (122 - 7) * (1 - r / 700))
            green = int(7 + (14 - 7) * (1 - r / 700))
            blue = int(9 + (39 - 9) * (1 - r / 700))
            glow_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(red, green, blue, alpha))
            
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # 2. Right side Chronometer Dial Illustration
    dial_cx = int(width * 0.72)
    dial_cy = int(height * 0.5)
    r_dial = int(height * 0.36)
    
    draw.ellipse([dial_cx - r_dial - 6, dial_cy - r_dial - 6, dial_cx + r_dial + 6, dial_cy + r_dial + 6], outline=(226, 232, 240, 50), width=4)
    draw.ellipse([dial_cx - r_dial, dial_cy - r_dial, dial_cx + r_dial, dial_cy + r_dial], outline=(158, 24, 56, 230), width=12)
    draw.ellipse([dial_cx - r_dial + 20, dial_cy - r_dial + 20, dial_cx + r_dial - 20, dial_cy + r_dial - 20], outline=(245, 158, 11, 200), width=5)
    draw.ellipse([dial_cx - r_dial + 40, dial_cy - r_dial + 40, dial_cx + r_dial - 40, dial_cy + r_dial - 40], fill=(12, 10, 16, 240), outline=(122, 14, 39, 180), width=8)

    # Dial ticks
    for i in range(60):
        angle = i * (2 * math.pi / 60) - math.pi / 2
        is_major = (i % 5 == 0)
        is_quarter = (i % 15 == 0)
        t_len = 24 if is_quarter else (16 if is_major else 8)
        color = (255, 255, 255, 255) if is_quarter else ((245, 158, 11, 220) if is_major else (148, 163, 184, 120))
        
        r1 = r_dial - 25
        r2 = r1 - t_len
        x1 = dial_cx + int(r1 * math.cos(angle))
        y1 = dial_cy + int(r1 * math.sin(angle))
        x2 = dial_cx + int(r2 * math.cos(angle))
        y2 = dial_cy + int(r2 * math.sin(angle))
        draw.line([x1, y1, x2, y2], fill=color, width=4 if is_quarter else (3 if is_major else 1))

    # Center Hands
    hand_angle = -math.pi / 4
    hx = dial_cx + int((r_dial - 70) * math.cos(hand_angle))
    hy = dial_cy + int((r_dial - 70) * math.sin(hand_angle))
    draw.line([dial_cx, dial_cy, hx, hy], fill=(245, 158, 11, 255), width=8)
    draw.ellipse([dial_cx - 24, dial_cy - 24, dial_cx + 24, dial_cy + 24], fill=(158, 24, 56, 255), outline=(245, 158, 11, 255), width=5)

    # 3. Geometric Prestige Grid & Laser Lines
    draw.line([0, int(height * 0.88), width, int(height * 0.88)], fill=(122, 14, 39, 120), width=2)
    draw.line([0, int(height * 0.12), width, int(height * 0.12)], fill=(245, 158, 11, 80), width=2)

    # 4. Text and Branding (Left Side)
    # Badge Pill: "DISCORD ACTIVITY OFFICIELLE • CPGE & 2BAC"
    pill_x = int(width * 0.10)
    pill_y = int(height * 0.28)
    draw.rounded_rectangle([pill_x, pill_y, pill_x + 440, pill_y + 44], radius=22, fill=(20, 10, 16, 230), outline=(245, 158, 11, 200), width=2)
    
    # 5. Save banner
    img.save(output_path, "PNG")
    print(f"Created activity banner: {output_path} ({width}x{height})")


def create_compact_banner(output_path="assets/studysouk_banner_compact.png"):
    create_activity_banner(output_path, width=600, height=240)


if __name__ == "__main__":
    create_app_icon("assets/studysouk_icon_1024.png", 1024)
    create_app_icon("assets/studysouk_icon_512.png", 512)
    create_activity_banner("assets/studysouk_banner_1920.png", 1920, 1080)
    create_compact_banner("assets/studysouk_banner_compact.png")
