import { PLAYER_SPRITES, PLAYER_PALETTE_OBJ, drawPixelArt } from './sprites.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 12;
        this.speed = 160; // px/s
        this.health = 100;
        this.maxHealth = 100;
        this.vx = 0;
        this.vy = 0;

        // Gun/shooting
        this.gunAngle = 0;
        this.shootRate = 0.25; // seconds between shots
        this.shootCooldown = 0;

        // Animation
        this.direction = 'down'; // down, up, left, right
        this.frameIndex = 0;
        this.animationSpeed = 0.15; // seconds per frame
        this.animationTimer = 0;

        // Invincibility
        this.invincibleTimer = 0;
        this.invincibilityDuration = 0.3;

        this.active = true;
    }

    update(dt, input, w, h, bullets) {
        if (!this.active) return;

        // Movement input
        this.vx = 0;
        this.vy = 0;

        if (input.isDown('ArrowUp')) this.vy = -this.speed;
        if (input.isDown('ArrowDown')) this.vy = this.speed;
        if (input.isDown('ArrowLeft')) this.vx = -this.speed;
        if (input.isDown('ArrowRight')) this.vx = this.speed;

        // Normalize diagonal movement
        if (this.vx !== 0 && this.vy !== 0) {
            const len = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            this.vx = (this.vx / len) * this.speed;
            this.vy = (this.vy / len) * this.speed;
        }

        // Update position
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Clamp to bounds
        this.x = Math.max(this.radius, Math.min(w - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(h - this.radius, this.y));

        // Update direction for animation
        if (this.vx > 0) this.direction = 'right';
        else if (this.vx < 0) this.direction = 'left';
        else if (this.vy > 0) this.direction = 'down';
        else if (this.vy < 0) this.direction = 'up';

        // Animation
        if (this.vx !== 0 || this.vy !== 0) {
            this.animationTimer += dt;
            if (this.animationTimer >= this.animationSpeed) {
                this.animationTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % 4;
            }
        } else {
            this.frameIndex = 0;
            this.animationTimer = 0;
        }

        // Gun angle toward mouse
        const dx = input.mouse.x - this.x;
        const dy = input.mouse.y - this.y;
        this.gunAngle = Math.atan2(dy, dx);

        // Shooting
        this.shootCooldown = Math.max(0, this.shootCooldown - dt);
        if (input.mouse.justClicked && this.shootCooldown <= 0) {
            this.shoot(bullets);
            this.shootCooldown = this.shootRate;
        }

        // Invincibility timer
        this.invincibleTimer = Math.max(0, this.invincibleTimer - dt);
    }

    shoot(bullets) {
        const speed = 480;
        const vx = Math.cos(this.gunAngle) * speed;
        const vy = Math.sin(this.gunAngle) * speed;

        // Spawn bullet slightly ahead of player in gun direction
        const offsetDist = 20;
        const bx = this.x + Math.cos(this.gunAngle) * offsetDist;
        const by = this.y + Math.sin(this.gunAngle) * offsetDist;

        const bullet = {
            x: bx,
            y: by,
            vx: vx,
            vy: vy,
            radius: 4,
            damage: 25,
            isPlayerBullet: true,
            active: true
        };

        bullets.push(bullet);
    }

    takeDamage(damage) {
        if (this.invincibleTimer > 0) return; // Invincible

        this.health = Math.max(0, this.health - damage);
        this.invincibleTimer = this.invincibilityDuration;

        if (this.health <= 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        const spriteFrames = PLAYER_SPRITES[this.direction];
        const sprite = spriteFrames[this.frameIndex];
        const scale = 3;

        // Draw player body
        drawPixelArt(
            ctx,
            sprite,
            this.x - (sprite[0].length * scale) / 2,
            this.y - (sprite.length * scale) / 2,
            scale,
            PLAYER_PALETTE_OBJ
        );

        // Draw gun (yellow rectangle)
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.gunAngle);
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(8, -2, 12, 4);
        ctx.restore();

        // Draw invincibility flash
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer * 10) % 2 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
