# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**Run the game locally:**
```bash
python3 -m http.server 8000
# Open http://localhost:8000 in a browser
```

No build step required. The project uses vanilla JavaScript ES6 modules loaded directly by the browser.

## Architecture Overview

This is a **retro-style top-down 2D shooter** that runs entirely in the browser using Canvas 2D API. All sprites are drawn programmatically (no image assets).

### High-Level Flow

```
main.js
  ├─> InputHandler (keyboard + mouse tracking)
  └─> Game
       ├─> State Machine: MENU → PLAYING → LEVEL_COMPLETE → PLAYING... or GAME_OVER
       ├─> Player (movement, aiming, shooting)
       ├─> Level (wave spawning, progression)
       ├─> Enemies (pathfinding toward player, shooting)
       ├─> Bullets (movement, collision)
       ├─> Explosions (animation)
       └─> Renderer (HUD, menus, screen drawing)
```

### Canvas Setup
- **Size**: 800×600 logical pixels
- **Scaling**: CSS fills viewport; `image-rendering: pixelated` maintains pixel-art aesthetic
- **Update Loop**: 60 FPS via `requestAnimationFrame`, capped at 0.05s per frame

## Key Modules

### `game.js` — Main Game Loop & State Machine
- **Responsible for**: Game state transitions, collision detection, orchestrating updates/draws
- **States**: `'MENU'`, `'PLAYING'`, `'LEVEL_COMPLETE'`, `'GAME_OVER'`
- **Key Methods**:
  - `loop(timestamp)` — Main loop, calls `update()` then `draw()`
  - `checkCollisions()` — Circle-circle collision detection (no sqrt, uses squared distances)
  - `updatePlaying(dt)` — Handles player/enemy/bullet updates during gameplay
- **Collision Targets**:
  - Player bullets → enemies (deal damage, spawn explosions)
  - Enemies → player (contact damage with iframes)
  - Enemy bullets → player (damage with iframes)

### `player.js` — Player Class
- **Movement**: `speed: 160 px/s`, arrow keys/WASD, clamped to bounds
- **Animation**: 4-direction sprites with 4-frame walk cycle; idle when stationary
- **Gun**: Rotates toward mouse cursor via `atan2(mouse.y - y, mouse.x - x)`
- **Shooting**: Click fires bullets at `gunAngle`; `shootRate: 0.25s` cooldown
- **Iframes**: `invincibilityDuration: 0.3s` after taking damage (flickering visual)
- **Health**: `100 HP` max; contact damage is `damage * dt` per frame

### `enemy.js` — Enemy Class & Configuration
- **ENEMY_CONFIGS Map**: Defines 5 types with `speed`, `health`, `damage`, `score`, `shootInterval`
  - `grunt`: 80 px/s, 30 HP, 10 points
  - `fast`: 140 px/s, 15 HP, 20 points
  - `tank`: 45 px/s, 120 HP, 50 points
  - `shooter`: 60 px/s, 40 HP, shoots every 2.5s, 30 points
  - `rusher`: 200 px/s, 20 HP, 40 points
- **Behavior**: Moves toward player, animates, shoots (if configured)
- **Health Bar**: Rendered above enemy when damaged

### `level.js` — Level & Wave Management
- **State Machine**: `WAITING → SPAWNING → WAITING_FOR_CLEAR → repeat or done`
- **Wave Data**: `getWavesForLevel(n)` returns spawn tasks:
  - **Levels 1–5**: Hardcoded wave definitions with specific enemy types/counts
  - **Levels 6+**: Scaled dynamically using factor `1 + (n-5)*0.3`
- **Spawning**: Enemies spawn from random screen edges, queued at `0.5s` intervals
- **Completion**: `isComplete()` checks if all waves done AND no active enemies

### `sprites.js` — Sprite Data & Drawing
- **Core Function**: `drawPixelArt(ctx, pixelMap, x, y, scale, palette)`
  - `pixelMap`: 2D array of color indices (or `null` for transparency)
  - `palette`: Array of color strings
  - Renders scaled pixel blocks on canvas
- **Sprite Data**:
  - `PLAYER_SPRITES[direction]`: 4-frame walk animation per direction
  - `ENEMY_SPRITES`: Hardcoded pixel grids for each type
  - `EXPLOSION_FRAMES`: 5-frame explosion animation
- **Note**: Set `ctx.imageSmoothingEnabled = false` globally for crisp pixels

### `input.js` — Input Handler
- **Keyboard**: Tracks `Set` of held keys; supports arrow keys and WASD aliases
- **Mouse**: Translates client coords to canvas-space via `getBoundingClientRect()` and scale ratio
- **State**:
  - `mouse.justClicked`: Fires once per click; **must be flushed** via `flush()` each frame
  - `isDown(key)`: Returns true if key currently held
- **Flush Behavior**: Called at end of each game loop to reset `justClicked`

### `renderer.js` — Screen Drawing
- **HUD**: Score (top-left), level (top-center), health bar (top-right)
- **Screens**: `drawMenu()`, `drawLevelComplete()`, `drawGameOver()` — all return button rects for hit-testing
- **Pulse Effect**: Pulsing text via `Math.sin(pulseTimer * Math.PI * 2)`
- **Grid Background**: Subtle grid overlay at 40px intervals

## Collision System

All collisions use **circle-circle detection** without sqrt (for performance):
```javascript
circleCollide(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distSq = dx * dx + dy * dy;
    return distSq <= (r1 + r2) * (r1 + r2);
}
```

**Radii**:
- Player: 12 px
- Enemy: 14 px
- Bullet: 4 px

## Data Flow

### Game State During PLAYING
- **Per frame**:
  1. Player calls `update(dt, input)` → reads input, computes gun angle, queues shoots
  2. Level calls `update(dt)` → spawns enemies if needed
  3. Enemies call `update(dt, playerX, playerY, bullets)` → pathfind toward player, shoot if applicable
  4. Bullets advance position; off-screen bullets marked inactive
  5. `checkCollisions()` processes all impacts, removes dead entities, spawns explosions
  6. All active entities drawn to canvas

### Bullet Creation
- **Player bullets**: Created in `player.shoot()`, pushed to shared `this.bullets` array
- **Enemy bullets**: Created in `enemy.shoot()`, pushed to shared `this.bullets` array
- **Plain Objects**: Bullets are plain `{x, y, vx, vy, radius, damage, isPlayerBullet, active}` objects, not class instances

### Enemy Lifecycle
1. Level spawns spawn-task `{type, x, y}` into `this.enemies`
2. During update, `Enemy` instance created on-demand via `_instance` property
3. On death: removed from level array, score added, explosion spawned
4. If all enemies dead AND no more waves: `level.isComplete()` → true

## Development Workflow

### Making Changes
1. **Edit files** in `/js/` or `index.html`
2. **Test in browser** — reload page to see changes (no build step)
3. **Commit locally**: Clear, descriptive message
4. **Push to GitHub**: `git push origin main`

### Commit Message Style
Use conventional format:
```
feat: Add [feature name] - brief description
fix: Fix [issue] - what was broken, what's fixed
refactor: Rename [thing] - why
```

Example:
```
feat: Add new enemy type 'Exploder' - spawns projectiles in burst pattern
fix: Correct bullet collision radius from 5 to 4 pixels
refactor: Extract sprite drawing logic into separate function
```

## Common Development Tasks

### Add a New Enemy Type
1. Add entry to `ENEMY_CONFIGS` in `enemy.js` (define speed, health, damage, score, shootInterval)
2. Create pixel sprite in `sprites.js` (7×7 or 8×8 grid) + palette
3. Add to `SPRITE_CONFIGS` in `sprites.js`
4. Update level wave definitions in `level.js:getWavesForLevel()` to include new type
5. Test by spawning enemy in a level

### Add a New Level
1. Update `level.js:getWavesForLevel(n)` to add case for new level number
2. Define wave groups with enemy types/counts
3. Difficulty scales automatically for levels 6+

### Adjust Game Difficulty
- **Player**: Modify `speed`, `health`, `shootRate` in `player.js`
- **Enemies**: Edit `ENEMY_CONFIGS` values
- **Scaling formula** (levels 6+): Change multiplier `1 + (n-5)*0.3` in `level.js`

### Add UI Element (HUD or Screen)
1. Add rendering code to `renderer.js`
2. If clickable button: return rect `{x, y, width, height}` from draw method
3. In `game.js`, store rect on instance and check `input.mouse` during update phase

### Debug Collision Issues
- Add visual debug circles around entities in `game.js:drawPlaying()`
- Check radii in respective class constructors
- Verify `circleCollide()` math if collisions feel off

## Notes for Future Development

- **No external dependencies**: Vanilla JS only. Any new features should avoid npm packages.
- **Sprite drawing**: All pixel art is procedural. To add visual variety, create new `PLAYER_SPRITES` or `ENEMY_SPRITES` arrays.
- **Performance**: Currently no major bottlenecks. Collision detection is O(n²) per frame; optimize only if spawning 1000+ entities.
- **Mobile support**: Untested. Touch input would require extending `InputHandler` to map touch events to movement/aiming.
