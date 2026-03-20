import { Player } from './player.js';
import { Enemy, ENEMY_CONFIGS } from './enemy.js';
import { Level } from './level.js';
import { Renderer } from './renderer.js';
import { EXPLOSION_FRAMES, EXPLOSION_PALETTE_OBJ, drawPixelArt } from './sprites.js';

export class Game {
    constructor(canvas, input) {
        this.canvas = canvas;
        this.input = input;
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width;
        this.h = canvas.height;
        this.renderer = new Renderer(this.ctx, this.w, this.h);

        this.state = 'MENU'; // MENU, PLAYING, LEVEL_COMPLETE, GAME_OVER
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.explosions = [];
        this.level = null;
        this.score = 0;
        this.pulseTimer = 0;

        // Button rects for hit testing
        this.startButtonRect = null;
        this.nextLevelButtonRect = null;
        this.restartButtonRect = null;

        this.lastTime = null;
    }

    loop(timestamp) {
        if (this.lastTime === null) {
            this.lastTime = timestamp;
        }

        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        // Update
        this.update(dt);

        // Draw
        this.draw();

        // Flush input (clear justClicked flag)
        this.input.flush();

        requestAnimationFrame((ts) => this.loop(ts));
    }

    update(dt) {
        this.pulseTimer += dt;

        switch (this.state) {
            case 'MENU':
                this.updateMenu();
                break;
            case 'PLAYING':
                this.updatePlaying(dt);
                break;
            case 'LEVEL_COMPLETE':
                this.updateLevelComplete();
                break;
            case 'GAME_OVER':
                this.updateGameOver();
                break;
        }
    }

    updateMenu() {
        if (this.input.mouse.justClicked) {
            this.startGame();
        }
    }

    startGame() {
        this.state = 'PLAYING';
        this.player = new Player(this.w / 2, this.h / 2);
        this.enemies = [];
        this.bullets = [];
        this.explosions = [];
        this.score = 0;
        this.level = new Level(1, this.enemies);
    }

    updatePlaying(dt) {
        // Update player
        this.player.update(dt, this.input, this.w, this.h, this.bullets);

        // Update level spawning
        this.level.update(dt);

        // Create enemy instances and update
        const enemiesToUpdate = [];
        for (const enemyData of this.enemies) {
            if (!enemyData._instance) {
                enemyData._instance = new Enemy(enemyData.type, enemyData.x, enemyData.y);
            }
            const instance = enemyData._instance;
            instance.update(dt, this.player.x, this.player.y, this.bullets);
            enemiesToUpdate.push(instance);
        }

        // Update bullets
        for (const bullet of this.bullets) {
            if (!bullet.active) continue;
            bullet.x += bullet.vx * dt;
            bullet.y += bullet.vy * dt;
            if (bullet.x < -50 || bullet.x > this.w + 50 ||
                bullet.y < -50 || bullet.y > this.h + 50) {
                bullet.active = false;
            }
        }

        // Update explosions
        for (const explosion of this.explosions) {
            explosion.timer += dt;
            if (explosion.timer >= explosion.frameDuration * explosion.frames.length) {
                explosion.active = false;
            }
        }

        // Collision detection
        this.checkCollisions();

        // Check level complete
        if (this.level.isComplete()) {
            this.state = 'LEVEL_COMPLETE';
        }

        // Check game over
        if (!this.player.active) {
            this.state = 'GAME_OVER';
        }
    }

    checkCollisions() {
        const enemiesToUpdate = this.enemies
            .filter((e) => e._instance)
            .map((e) => e._instance);

        // Player bullets vs enemies
        for (const bullet of this.bullets) {
            if (!bullet.active || bullet.isPlayerBullet !== true) continue;

            for (let i = enemiesToUpdate.length - 1; i >= 0; i--) {
                const enemy = enemiesToUpdate[i];
                if (!enemy.active) continue;

                if (this.circleCollide(bullet.x, bullet.y, bullet.radius, enemy.x, enemy.y, enemy.radius)) {
                    enemy.takeDamage(bullet.damage);
                    bullet.active = false;

                    if (!enemy.active) {
                        // Remove dead enemy from level tracking
                        this.enemies = this.enemies.filter((e) => e._instance !== enemy);
                        this.score += enemy.score;
                        this.spawnExplosion(enemy.x, enemy.y);
                    }
                    break;
                }
            }
        }

        // Enemies vs player contact damage
        for (const enemy of enemiesToUpdate) {
            if (!enemy.active) continue;

            if (this.circleCollide(this.player.x, this.player.y, this.player.radius, enemy.x, enemy.y, enemy.radius)) {
                const dmgPerFrame = (enemy.damage * 0.016); // Approximate 60 FPS frame
                this.player.takeDamage(dmgPerFrame);
            }
        }

        // Enemy bullets vs player
        for (const bullet of this.bullets) {
            if (!bullet.active || bullet.isPlayerBullet !== false) continue;

            if (this.circleCollide(bullet.x, bullet.y, bullet.radius, this.player.x, this.player.y, this.player.radius)) {
                if (this.player.invincibleTimer <= 0) {
                    this.player.takeDamage(bullet.damage);
                    bullet.active = false;
                }
            }
        }

        // Clean up
        this.bullets = this.bullets.filter((b) => b.active);
        this.explosions = this.explosions.filter((e) => e.active);
    }

    circleCollide(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distSq = dx * dx + dy * dy;
        const radiusSumSq = (r1 + r2) * (r1 + r2);
        return distSq <= radiusSumSq;
    }

    spawnExplosion(x, y) {
        this.explosions.push({
            x: x,
            y: y,
            frames: [0, 1, 2, 3, 4],
            frameDuration: 0.1,
            timer: 0,
            active: true
        });
    }

    updateLevelComplete() {
        if (this.input.mouse.justClicked) {
            this.state = 'PLAYING';
            this.player = new Player(this.w / 2, this.h / 2);
            this.enemies = [];
            this.bullets = [];
            this.explosions = [];
            const nextLevel = this.level.levelNumber + 1;
            this.level = new Level(nextLevel, this.enemies);
        }
    }

    updateGameOver() {
        if (this.input.mouse.justClicked) {
            this.state = 'MENU';
        }
    }

    draw() {
        switch (this.state) {
            case 'MENU':
                this.drawMenu();
                break;
            case 'PLAYING':
                this.drawPlaying();
                break;
            case 'LEVEL_COMPLETE':
                this.drawLevelComplete();
                break;
            case 'GAME_OVER':
                this.drawGameOver();
                break;
        }
    }

    drawMenu() {
        this.renderer.clear();
        const pulseValue = Math.sin(this.pulseTimer * Math.PI * 2) * 0.5 + 0.5;
        this.startButtonRect = this.renderer.drawMenu(pulseValue);
    }

    drawPlaying() {
        this.renderer.clear();

        // Draw enemies
        const enemiesToDraw = this.enemies
            .filter((e) => e._instance)
            .map((e) => e._instance);
        for (const enemy of enemiesToDraw) {
            enemy.draw(this.ctx);
        }

        // Draw player
        this.player.draw(this.ctx);

        // Draw bullets
        for (const bullet of this.bullets) {
            if (!bullet.active) continue;
            this.ctx.fillStyle = bullet.isPlayerBullet ? '#ffff00' : '#ff0000';
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Draw explosions
        for (const explosion of this.explosions) {
            const frameIndex = Math.floor((explosion.timer / (explosion.frameDuration * explosion.frames.length)) * explosion.frames.length);
            if (frameIndex < EXPLOSION_FRAMES.length) {
                const frame = EXPLOSION_FRAMES[frameIndex];
                const scale = 3;
                drawPixelArt(
                    this.ctx,
                    frame,
                    explosion.x - (frame[0].length * scale) / 2,
                    explosion.y - (frame.length * scale) / 2,
                    scale,
                    EXPLOSION_PALETTE_OBJ
                );
            }
        }

        // Draw HUD
        this.renderer.drawHUD(this.player, this.level, this.score);
    }

    drawLevelComplete() {
        this.renderer.clear();
        const pulseValue = Math.sin(this.pulseTimer * Math.PI * 2) * 0.5 + 0.5;
        this.nextLevelButtonRect = this.renderer.drawLevelComplete(this.level, pulseValue);
    }

    drawGameOver() {
        this.renderer.clear();
        const pulseValue = Math.sin(this.pulseTimer * Math.PI * 2) * 0.5 + 0.5;
        this.restartButtonRect = this.renderer.drawGameOver(this.player, this.score, pulseValue);
    }
}
