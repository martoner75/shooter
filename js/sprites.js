// Sprite drawing utility and definitions
export function drawPixelArt(ctx, pixelMap, x, y, scale, palette) {
    const prevFillStyle = ctx.fillStyle;

    for (let row = 0; row < pixelMap.length; row++) {
        for (let col = 0; col < pixelMap[row].length; col++) {
            const colorIndex = pixelMap[row][col];
            if (colorIndex === null) continue; // Transparent pixel

            ctx.fillStyle = palette[colorIndex];
            ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
        }
    }

    ctx.fillStyle = prevFillStyle;
}

// Player sprite frames (4-direction walk animation)
const PLAYER_PALETTE = ['#1e90ff', '#0056b3', '#ffcc00', '#ffffff'];

export const PLAYER_SPRITES = {
    down: [
        // Frame 0
        [
            [null, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 0, 1, 1, null],
            [null, null, 0, null, 0, null, null]
        ],
        // Frame 1 (walking right leg forward)
        [
            [null, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 0, 0, 1, null],
            [null, null, 0, null, null, 0, null]
        ],
        // Frame 2 (same as frame 0)
        [
            [null, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 0, 1, 1, null],
            [null, null, 0, null, 0, null, null]
        ],
        // Frame 3 (walking left leg forward)
        [
            [null, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 0, 0, 1, 1, null],
            [null, 0, null, null, 0, null, null]
        ]
    ],
    right: [
        [
            [null, null, 1, 1, 1, 1, null],
            [null, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 1, 1, 1],
            [1, 1, 2, 2, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, 1],
            [null, null, 1, 0, 1, 0, null],
            [null, null, null, 0, null, 0, null]
        ],
        [
            [null, null, 1, 1, 1, 1, null],
            [null, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 1, 1, 1],
            [1, 1, 2, 2, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, 1],
            [null, null, 1, 0, 0, 1, null],
            [null, null, null, 0, null, 0, null]
        ],
        [
            [null, null, 1, 1, 1, 1, null],
            [null, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 1, 1, 1],
            [1, 1, 2, 2, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, 1],
            [null, null, 1, 0, 1, 0, null],
            [null, null, null, 0, null, 0, null]
        ],
        [
            [null, null, 1, 1, 1, 1, null],
            [null, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 1, 1, 1],
            [1, 1, 2, 2, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, 1],
            [null, 1, 0, 0, 1, null, null],
            [null, 0, null, 0, null, null, null]
        ]
    ],
    up: [
        [
            [null, null, 0, null, 0, null, null],
            [null, 1, 1, 0, 1, 1, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, null]
        ],
        [
            [null, null, 0, null, null, 0, null],
            [null, 1, 1, 0, 0, 1, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, null]
        ],
        [
            [null, null, 0, null, 0, null, null],
            [null, 1, 1, 0, 1, 1, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, null]
        ],
        [
            [null, 0, null, null, 0, null, null],
            [null, 1, 0, 0, 1, 1, null],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 2, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [null, 1, 1, 1, 1, 1, null]
        ]
    ],
    left: [
        [
            [null, 1, 1, 1, 1, null, null],
            [1, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, null],
            [null, 0, 1, 0, 1, null, null],
            [null, 0, null, 0, null, null, null]
        ],
        [
            [null, 1, 1, 1, 1, null, null],
            [1, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, null],
            [null, 1, 0, 0, 1, null, null],
            [null, 0, null, 0, null, null, null]
        ],
        [
            [null, 1, 1, 1, 1, null, null],
            [1, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, null],
            [null, 0, 1, 0, 1, null, null],
            [null, 0, null, 0, null, null, null]
        ],
        [
            [null, 1, 1, 1, 1, null, null],
            [1, 1, 1, 1, 1, 1, null],
            [1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 2, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, null],
            [null, null, 1, 0, 0, 1, null],
            [null, null, null, 0, null, 0, null]
        ]
    ]
};

// Enemy sprites - simplified pixel art for different types
const GRUNT_PALETTE = ['#e74c3c', '#c0392b', '#ffffff'];
export const GRUNT_SPRITE = [
    [null, 1, 1, 1, null],
    [1, 1, 1, 1, 1],
    [1, 1, 2, 1, 1],
    [1, 1, 1, 1, 1],
    [null, 0, null, 0, null]
];

const FAST_PALETTE = ['#e67e22', '#d35400', '#ffffff'];
export const FAST_SPRITE = [
    [null, null, 1, 1, 1, null, null],
    [null, 1, 1, 1, 1, 1, null],
    [1, 1, 1, 2, 1, 1, 1],
    [null, 1, 1, 1, 1, 1, null],
    [null, null, 0, null, 0, null, null]
];

const TANK_PALETTE = ['#8e44ad', '#6c3483', '#ffffff'];
export const TANK_SPRITE = [
    [null, 1, 1, 1, 1, 1, null],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 2, 2, 1, 1],
    [1, 1, 2, 2, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [null, 0, 0, 0, 0, 0, null]
];

const SHOOTER_PALETTE = ['#2980b9', '#1a5276', '#ffcc00'];
export const SHOOTER_SPRITE = [
    [null, 1, 1, 1, 1, null],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 2, 2, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [null, 0, null, 0, null, null],
    [null, null, 2, null, null, null]
];

const RUSHER_PALETTE = ['#f39c12', '#d68910', '#ffffff'];
export const RUSHER_SPRITE = [
    [null, null, 1, 1, null, null],
    [null, 1, 1, 1, 1, null],
    [1, 1, 1, 2, 1, 1],
    [null, 1, 1, 1, 1, null],
    [null, 0, null, null, 0, null]
];

// Explosion animation frames
const EXPLOSION_PALETTE = ['#ff6b35', '#ffb347', '#ffd700', '#ffffff'];
export const EXPLOSION_FRAMES = [
    [
        [null, null, null, null, null],
        [null, null, 1, null, null],
        [null, 1, 2, 1, null],
        [null, null, 1, null, null],
        [null, null, null, null, null]
    ],
    [
        [null, null, 2, null, null],
        [null, 1, 2, 1, null],
        [2, 2, 3, 2, 2],
        [null, 1, 2, 1, null],
        [null, null, 2, null, null]
    ],
    [
        [null, 1, 2, 1, null],
        [1, 2, 3, 2, 1],
        [2, 3, 3, 3, 2],
        [1, 2, 3, 2, 1],
        [null, 1, 2, 1, null]
    ],
    [
        [null, null, 2, null, null],
        [null, 1, 2, 1, null],
        [2, 2, 3, 2, 2],
        [null, 1, 2, 1, null],
        [null, null, 2, null, null]
    ],
    [
        [null, null, 1, null, null],
        [null, 1, 2, 1, null],
        [null, 2, 2, 2, null],
        [null, 1, 2, 1, null],
        [null, null, 1, null, null]
    ]
];

export const SPRITE_CONFIGS = {
    grunt: { sprite: GRUNT_SPRITE, palette: GRUNT_PALETTE, scale: 3 },
    fast: { sprite: FAST_SPRITE, palette: FAST_PALETTE, scale: 3 },
    tank: { sprite: TANK_SPRITE, palette: TANK_PALETTE, scale: 4 },
    shooter: { sprite: SHOOTER_SPRITE, palette: SHOOTER_PALETTE, scale: 3 },
    rusher: { sprite: RUSHER_SPRITE, palette: RUSHER_PALETTE, scale: 3 }
};

export const PLAYER_PALETTE_OBJ = PLAYER_PALETTE;
export const EXPLOSION_PALETTE_OBJ = EXPLOSION_PALETTE;
