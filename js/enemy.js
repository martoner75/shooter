import { SPRITE_CONFIGS, drawPixelArt } from './sprites.js';

export const ENEMY_CONFIGS = {
    grunt: {
        speed: 80,
        health: 30,
        damage: 20,
        score: 10,
        sprite: 'grunt',
        shootInterval: null
    },
    fast: {
        speed: 140,
        health: 15,
        damage: 15,
        score: 20,
        sprite: 'fast',
        shootInterval: null
    },
    tank: {
        speed: 45,
        health: 120,
        damage: 35,
        score: 50,
        sprite: 'tank',
        shootInterval: null
    },
    shooter: {
        speed: 60,
        health: 40,
        damage: 10,
        score: 30,
        sprite: 'shooter',
        shootInterval: 2.5
    },
    rusher: {
        speed: 200,
        health: 20,
        damage: 40,
        score: 40,
        sprite: 'rusher',
        shootInterval: null
    }
};

export class Enemy {
    constructor(type, x, y) {
        const config = ENEMY_CONFIGS[type];
        this.type = type;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.speed = config.speed;
        this.health = config.health;
        this.maxHealth = config.health;
        this.damage = config.damage;
        this.score = config.score;
        this.sprite = config.sprite;
        this.shootInterval = config.shootInterval;
        this.shootTimer = 0;

        this.radius = 14;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.active = true;
    }

    update(dt, playerX, playerY, bullets) {
        if (!this.active) return;

        // Move toward player
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            this.vx = (dx / dist) * this.speed;
            this.vy = (dy / dist) * this.speed;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Animation
        this.animationTimer += dt;
        if (this.animationTimer >= 0.2) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 2;
        }

        // Shooter enemies fire bullets
        if (this.shootInterval !== null) {
            this.shootTimer += dt;
            if (this.shootTimer >= this.shootInterval) {
                this.shootTimer = 0;
                this.shoot(playerX, playerY, bullets);
            }
        }
    }

    shoot(playerX, playerY, bullets) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            const speed = 220;
            const vx = (dx / dist) * speed;
            const vy = (dy / dist) * speed;

            const bullet = {
                x: this.x,
                y: this.y,
                vx: vx,
                vy: vy,
                radius: 4,
                damage: 20,
                isPlayerBullet: false,
                active: true
            };

            bullets.push(bullet);
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        const config = SPRITE_CONFIGS[this.sprite];
        if (!config) return;

        const { sprite, palette, scale } = config;
        drawPixelArt(
            ctx,
            sprite,
            this.x - (sprite[0].length * scale) / 2,
            this.y - (sprite.length * scale) / 2,
            scale,
            palette
        );

        // Health bar
        if (this.health < this.maxHealth) {
            const barWidth = 24;
            const barHeight = 4;
            const barX = this.x - barWidth / 2;
            const barY = this.y - 20;

            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            const healthPercent = this.health / this.maxHealth;
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
    }
}
