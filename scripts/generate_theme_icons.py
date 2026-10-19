from PIL import Image, ImageDraw

def create_grass_block():
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    # Dirt base
    dirt_colors = [
        (134, 96, 67, 255), (115, 81, 56, 255), (96, 67, 47, 255), (145, 105, 73, 255)
    ]
    for y in range(4, 16):
        for x in range(16):
            c = dirt_colors[(x * 7 + y * 13) % len(dirt_colors)]
            im.putpixel((x, y), c)
    # Grass top
    grass_top = [(92, 160, 46, 255), (78, 140, 38, 255), (110, 185, 55, 255)]
    for y in range(4):
        for x in range(16):
            c = grass_top[(x * 3 + y * 5) % len(grass_top)]
            im.putpixel((x, y), c)
    # Grass hanging down
    drips = [1, 2, 0, 3, 1, 2, 0, 1, 3, 2, 1, 0, 2, 3, 1, 2]
    for x in range(16):
        for dy in range(drips[x]):
            c = grass_top[(x * 2 + dy) % len(grass_top)]
            im.putpixel((x, 4 + dy), c)
    return im.resize((128, 128), Image.Resampling.NEAREST)

def create_magma_block():
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    # Obsidian/Netherrack rock with glowing orange lava veins
    rock_dark = (35, 20, 20, 255)
    rock_mid = (50, 28, 28, 255)
    lava_hot = (255, 200, 50, 255)
    lava_mid = (255, 100, 20, 255)
    lava_deep = (180, 40, 10, 255)

    for y in range(16):
        for x in range(16):
            im.putpixel((x, y), rock_mid if (x + y) % 3 == 0 else rock_dark)

    # Lava cracks
    cracks = [
        (2,2),(3,2),(4,3),(5,4),(6,4),(7,5),(8,5),(9,6),(10,7),(11,8),(12,8),(13,9),
        (3,10),(4,11),(5,11),(6,12),(7,12),(8,11),(9,11),(10,12),(11,13),(12,14),
        (7,2),(7,3),(7,4),(4,6),(5,6),(6,6),(11,4),(12,4),(13,5)
    ]
    for (x, y) in cracks:
        if 0 <= x < 16 and 0 <= y < 16:
            im.putpixel((x, y), lava_mid)
            if (x + y) % 2 == 0:
                im.putpixel((x, y), lava_hot)

    return im.resize((128, 128), Image.Resampling.NEAREST)

def create_end_crystal():
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    # Bedrock base
    for x in range(2, 14):
        for y in range(13, 16):
            im.putpixel((x, y), (40, 40, 45, 255) if (x+y)%2 == 0 else (25, 25, 30, 255))
    # Crystal frame (glass)
    glass_c = (200, 220, 255, 160)
    for x in range(3, 13):
        im.putpixel((x, 3), glass_c)
        im.putpixel((x, 12), glass_c)
    for y in range(3, 13):
        im.putpixel((3, y), glass_c)
        im.putpixel((12, y), glass_c)
    # Inner purple ender core
    purple_core = [
        (190, 80, 255, 255), (140, 40, 220, 255), (230, 150, 255, 255), (80, 20, 160, 255)
    ]
    for y in range(5, 11):
        for x in range(5, 11):
            c = purple_core[(x*2 + y*3) % len(purple_core)]
            im.putpixel((x, y), c)
    im.putpixel((7, 7), (255, 240, 255, 255))
    im.putpixel((8, 7), (255, 220, 255, 255))

    return im.resize((128, 128), Image.Resampling.NEAREST)

if __name__ == '__main__':
    create_grass_block().save("public/assets/items/grass_block.png")
    create_magma_block().save("public/assets/items/magma_block.png")
    create_end_crystal().save("public/assets/items/end_crystal.png")
    print("Theme icons created successfully.")
