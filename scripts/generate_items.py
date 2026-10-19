import os
from PIL import Image

os.makedirs('public/assets/items', exist_ok=True)

def make_item(grid, palette, filename, scale=8):
    h = len(grid)
    w = len(grid[0])
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    for y in range(h):
        for x in range(w):
            char = grid[y][x]
            if char in palette:
                img.putpixel((x, y), palette[char])
    scaled = img.resize((w * scale, h * scale), Image.Resampling.NEAREST)
    scaled.save(os.path.join('public', 'assets', 'items', filename))
    print(f'Saved {filename} ({w*scale}x{h*scale})')

# 1. DIAMOND
diamond_grid = [
    '................',
    '.....XXXXX......',
    '....XABBBAX.....',
    '...XABBCCDDAX...',
    '..XABCCCCDDEAX..',
    '..XACCCCCDDEAX..',
    '..XACCCCDDEEAX..',
    '...XACCDDEEAX...',
    '...XABCDDEEAX...',
    '....XACDEEAX....',
    '....XABDEEAX....',
    '.....XADEAX.....',
    '.....XABDAX.....',
    '......XAAX......',
    '.......XX.......',
    '................'
]
diamond_palette = {
    'X': (24, 76, 88, 255),
    'A': (44, 134, 153, 255),
    'B': (222, 255, 255, 255),
    'C': (92, 219, 213, 255),
    'D': (44, 163, 173, 255),
    'E': (27, 107, 122, 255),
}
make_item(diamond_grid, diamond_palette, 'diamond.png')

# 2. EMERALD
emerald_grid = [
    '................',
    '.....XXXXXX.....',
    '....XAABBBAX....',
    '...XAACCCCCAX...',
    '..XABCCCCCDDAX..',
    '..XACCCCCCCDDAX.',
    '..XACCCCCCCDDAX.',
    '..XACCCCCCCDDAX.',
    '..XACCCCCCCDDAX.',
    '..XAACCCCCDDAX..',
    '...XACCCCCDDAX..',
    '....XAACCDDAX...',
    '.....XACDDAX....',
    '......XAADAX....',
    '.......XXXX.....',
    '................'
]
emerald_palette = {
    'X': (17, 61, 23, 255),
    'A': (39, 133, 50, 255),
    'B': (190, 255, 190, 255),
    'C': (78, 222, 98, 255),
    'D': (28, 110, 42, 255),
}
make_item(emerald_grid, emerald_palette, 'emerald.png')

# 3. GOLDEN APPLE
gapple_grid = [
    '.......XX.......',
    '......XAAX......',
    '.....XABBAX.....',
    '..XXXXACCCXXXX..',
    '.XDDDDACCCEEEEAX',
    'XDDFFFCCCCEEEGAA',
    'XDFFFFFFCCEEGGAA',
    'XDFFFFFFCCEEGGAA',
    'XDFFFFFFCCEEGGAA',
    'XDFFFFFFCCEEGGAA',
    'XDFFFFFFCCEEGGAA',
    '.XDFFFFCCCEEGGAX',
    '..XDDFFCCEEEAAX.',
    '...XXDCCCCEEXX..',
    '.....XXXXXXX....',
    '................'
]
gapple_palette = {
    'X': (74, 52, 10, 255),
    'A': (138, 92, 18, 255),
    'B': (85, 140, 30, 255),
    'C': (255, 235, 75, 255),
    'D': (255, 255, 180, 255),
    'E': (230, 160, 20, 255),
    'F': (255, 245, 120, 255),
    'G': (170, 105, 10, 255),
}
make_item(gapple_grid, gapple_palette, 'golden_apple.png')

# 4. ENDER EYE
ender_grid = [
    '.....XXXXXX.....',
    '...XXAAAAAAXX...',
    '..XABCCCCBBAAX..',
    '.XABCCCDDCCCBAX.',
    '.XACCCDEEDCCCAX.',
    'XABCCDEEEDDCCBAX',
    'XACCDDEEEDDDCCAX',
    'XACCDDEEEDDDCCAX',
    'XACCDDEEEDDDCCAX',
    'XABCCDEEEDDCCBAX',
    '.XACCCDEEDCCCAX.',
    '.XABCCCDDCCCBAX.',
    '..XABCCCCBBAAX..',
    '...XXAAAAAAXX...',
    '.....XXXXXX.....',
    '................'
]
ender_palette = {
    'X': (10, 36, 30, 255),
    'A': (20, 75, 60, 255),
    'B': (50, 150, 125, 255),
    'C': (35, 115, 95, 255),
    'D': (150, 40, 20, 255),
    'E': (240, 180, 40, 255),
}
make_item(ender_grid, ender_palette, 'ender_eye.png')

# 5. REDSTONE DUST
redstone_grid = [
    '................',
    '.....XX...XX....',
    '....XAAX.XAAX...',
    '...XABBBAABBAX..',
    '..XABCCCCCCCBAX.',
    '..XACCCCCDCCCAX.',
    '.XABCCCCDDDCCBAX',
    '.XACCCCDDDDCCCAX',
    '.XACCCCDDDDDCCAX',
    '.XABCCCCDDDCCBAX',
    '..XACCCCCDCCCAX.',
    '..XABCCCCCCCBAX.',
    '...XABBBAABBAX..',
    '....XAAX.XAAX...',
    '.....XX...XX....',
    '................'
]
redstone_palette = {
    'X': (80, 10, 10, 255),
    'A': (150, 20, 20, 255),
    'B': (255, 120, 120, 255),
    'C': (235, 30, 30, 255),
    'D': (180, 15, 15, 255),
}
make_item(redstone_grid, redstone_palette, 'redstone.png')

# 6. BOOK AND QUILL
book_grid = [
    '...........XXXX.',
    '..........XAAABX',
    '.........XAACCBX',
    '........XAACCBX.',
    '.......XAACCBX..',
    '..XXXXXAACCBX...',
    '.XDDDDXAACBX....',
    'XDEEEEDXABX.....',
    'XDEFFFEEDXX.....',
    'XDEFFFFEEDX.....',
    'XDEFFFFFFEDX....',
    'XDEEEEEEEEDX....',
    'XDDDDDDDDDDX....',
    '.XXXXXXXXXX.....',
    '................',
    '................'
]
book_palette = {
    'X': (40, 25, 15, 255),
    'A': (240, 240, 240, 255),
    'B': (180, 180, 180, 255),
    'C': (200, 200, 200, 255),
    'D': (120, 40, 20, 255),
    'E': (230, 215, 175, 255),
    'F': (60, 40, 30, 255),
}
make_item(book_grid, book_palette, 'book_quill.png')

# 7. COMPASS
compass_grid = [
    '.....XXXXXX.....',
    '...XXAAAAAAXX...',
    '..XABCCCCBBAAX..',
    '.XABCCDDECCCBAX.',
    '.XACCDDEEECCCAX.',
    'XACCDDEEEEFFCCAX',
    'XACCDDEEEEFFCCAX',
    'XACDDEEEEEFFCCAX',
    'XACDDEEEEEFFCCAX',
    'XACCDDEEEEFFCCAX',
    '.XACCCDEEECCCAX.',
    '.XABCCCFFECCBAX.',
    '..XABCCCCBBAAX..',
    '...XXAAAAAAXX...',
    '.....XXXXXX.....',
    '................'
]
compass_palette = {
    'X': (50, 50, 50, 255),
    'A': (130, 130, 130, 255),
    'B': (200, 200, 200, 255),
    'C': (40, 40, 40, 255),
    'D': (235, 45, 45, 255),
    'E': (255, 255, 255, 255),
    'F': (160, 160, 170, 255),
}
make_item(compass_grid, compass_palette, 'compass.png')

# 8. CLOCK
clock_grid = [
    '.....XXXXXX.....',
    '...XXAAAAAAXX...',
    '..XABCCCCBBAAX..',
    '.XABCCDDDCCCBAX.',
    '.XACCDDEEECCCAX.',
    'XACCDDEEEEFFCCAX',
    'XACCDDEEEEFFCCAX',
    'XACDDEEEEEFFCCAX',
    'XACCDDEEEEFFCCAX',
    'XACCDDEEEEFFCCAX',
    '.XACCCDEEECCCAX.',
    '.XABCCCDDDCCBAX.',
    '..XABCCCCBBAAX..',
    '...XXAAAAAAXX...',
    '.....XXXXXX.....',
    '................'
]
clock_palette = {
    'X': (80, 60, 20, 255),
    'A': (200, 160, 40, 255),
    'B': (255, 220, 90, 255),
    'C': (45, 40, 30, 255),
    'D': (50, 120, 220, 255),
    'E': (250, 220, 30, 255),
    'F': (20, 20, 45, 255),
}
make_item(clock_grid, clock_palette, 'clock.png')

# 9. TOTEM
totem_grid = [
    '.....XXXXXX.....',
    '....XAAAAAAX....',
    '...XABBBBBAAX...',
    '..XABCCDDEEBAX..',
    '..XABCCDDEEBAX..',
    '..XABBBFFBBBAX..',
    '...XABBFBBBAX...',
    '....XABBBBAX....',
    '...XXABFFBAXX...',
    '..XCCABFFBACXX..',
    '.XCCCABFFBACCCX.',
    '..XCCABFFBACXX..',
    '...XXABFFBAXX...',
    '....XABFFBAX....',
    '....XAAAAAAX....',
    '.....XXXXXX.....'
]
totem_palette = {
    'X': (65, 45, 10, 255),
    'A': (160, 115, 20, 255),
    'B': (240, 195, 40, 255),
    'C': (80, 210, 100, 255),
    'D': (40, 150, 70, 255),
    'E': (220, 255, 230, 255),
    'F': (200, 140, 20, 255),
}
make_item(totem_grid, totem_palette, 'totem.png')

# 10. IRON PICKAXE
pickaxe_grid = [
    '......XXXXXX....',
    '....XXAAAAAAXX..',
    '...XABBBBBBAAAX.',
    '..XACCCCCCCAAAAX',
    '..XACD.......AAX',
    '...XD.EE......XX',
    '.....XFFEEX.....',
    '......XFFEEX....',
    '.......XFFEEX...',
    '........XFFEEX..',
    '.........XFFEEX.',
    '..........XFFEEX',
    '...........XFFE.',
    '............XFFX',
    '.............XX.',
    '................'
]
pickaxe_palette = {
    'X': (30, 30, 30, 255),
    'A': (180, 180, 180, 255),
    'B': (240, 240, 240, 255),
    'C': (140, 140, 140, 255),
    'D': (90, 90, 90, 255),
    'E': (140, 95, 45, 255),
    'F': (90, 55, 25, 255),
}
make_item(pickaxe_grid, pickaxe_palette, 'iron_pickaxe.png')

# 11. WALL TORCH
torch_grid = [
    '.......XX.......',
    '......XAAX......',
    '.....XABBAX.....',
    '.....XABBAX.....',
    '......XAAX......',
    '......XCCX......',
    '......XCCX......',
    '......XDDX......',
    '......XDDX......',
    '......XDDX......',
    '......XDDX......',
    '......XDDX......',
    '......XDDX......',
    '.......XX.......',
    '................',
    '................'
]
torch_palette = {
    'X': (40, 20, 10, 255),
    'A': (255, 150, 0, 255),
    'B': (255, 240, 100, 255),
    'C': (70, 50, 30, 255),
    'D': (150, 105, 55, 255),
}
make_item(torch_grid, torch_palette, 'torch.png')

# 12. CHEST
chest_grid = [
    '................',
    '...XXXXXXXXXX...',
    '..XAAAAAAAAAAX..',
    '.XABBBBBBBBBBAX.',
    '.XACCCCCCCCCCAX.',
    '.XACCDDDDDDCCAX.',
    '.XACCDDEEDDCCAX.',
    '.XACCDDEEDDCCAX.',
    '.XACCDDDDDDCCAX.',
    '.XACCCCCCCCCCAX.',
    '.XACCCCCCCCCCAX.',
    '.XACCCCCCCCCCAX.',
    '.XAAAAAAAAAAAX..',
    '..XXXXXXXXXXX...',
    '................',
    '................'
]
chest_palette = {
    'X': (45, 30, 15, 255),
    'A': (90, 60, 25, 255),
    'B': (180, 130, 65, 255),
    'C': (140, 95, 45, 255),
    'D': (30, 30, 30, 255),
    'E': (220, 220, 220, 255),
}
make_item(chest_grid, chest_palette, 'chest.png')

# 13. OAK SIGN TEXTURE
sign_img = Image.new('RGBA', (48, 48), (188, 152, 98, 255))
import random
random.seed(42)
for y in range(48):
    for x in range(48):
        v = random.randint(-12, 12)
        r = min(255, max(0, 188 + v))
        g = min(255, max(0, 152 + v))
        b = min(255, max(0, 98 + v - 4))
        sign_img.putpixel((x, y), (r, g, b, 255))
sign_img.save('public/assets/items/oak_sign.png')
print('Saved oak_sign.png')

print('ALL MINECRAFT PIXEL ART ITEMS SUCCESSFULLY GENERATED!')
