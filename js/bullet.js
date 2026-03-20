export class Bullet {
    constructor(x, y, vx, vy, damage, isPlayerBullet) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 4;
        this.damage = damage;
        this.isPlayerBullet = isPlayerBullet;
        this.active = true;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    isOffScreen(w, h) {
        return (
            this.x < -50 ||
            this.x > w + 50 ||
            this.y < -50 ||
            this.y > h + 50
        );
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.fillStyle = this.isPlayerBullet ? '#ffff00' : '#ff0000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
