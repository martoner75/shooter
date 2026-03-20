export class Renderer {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.ctx.imageSmoothingEnabled = false;
    }

    clear() {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.w, this.h);

        // Subtle grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.w; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.h);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.h; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.w, y);
            this.ctx.stroke();
        }
    }

    drawHUD(player, level, score) {
        // Score (top-left)
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`SCORE: ${score}`, 20, 30);

        // Level (top-center)
        this.ctx.fillStyle = '#ffff00';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`LEVEL ${level.levelNumber}`, this.w / 2, 30);

        // Health bar (top-right)
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillText('HP', this.w - 120, 30);

        const barWidth = 100;
        const barHeight = 14;
        const barX = this.w - 110;
        const barY = 16;

        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        const healthPercent = player.health / player.maxHealth;
        const healthColor = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        this.ctx.fillStyle = healthColor;
        this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    drawMenu(pulseValue) {
        this.clear();

        // Title with scanline effect
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.font = 'bold 48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('RETRO SHOOTER', this.w / 2, 120);

        // Scanline effect
        this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
        this.ctx.lineWidth = 2;
        for (let y = 100; y < 160; y += 4) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.w / 2 - 200, y);
            this.ctx.lineTo(this.w / 2 + 200, y);
            this.ctx.stroke();
        }

        // Subtitle
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = '16px monospace';
        this.ctx.fillText('A Game of Tactical Survival', this.w / 2, 180);

        // Instructions
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px monospace';
        this.ctx.fillText('Arrow Keys or WASD - Move', this.w / 2, 250);
        this.ctx.fillText('Mouse - Aim', this.w / 2, 270);
        this.ctx.fillText('Click - Shoot', this.w / 2, 290);

        // Pulsing start button
        const alpha = 0.5 + pulseValue * 0.5;
        this.ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
        this.ctx.font = 'bold 24px monospace';
        this.ctx.fillText('CLICK TO START', this.w / 2, 400);

        // Return button rect for hit testing
        return {
            x: this.w / 2 - 120,
            y: 370,
            width: 240,
            height: 60
        };
    }

    drawLevelComplete(level, pulseValue) {
        this.clear();

        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = 'bold 36px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`LEVEL ${level.levelNumber} COMPLETE`, this.w / 2, 150);

        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '20px monospace';
        this.ctx.fillText(`Advancing to Level ${level.levelNumber + 1}...`, this.w / 2, 250);

        // Pulsing continue text
        const alpha = 0.5 + pulseValue * 0.5;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.font = '16px monospace';
        this.ctx.fillText('CLICK TO CONTINUE', this.w / 2, 400);

        return {
            x: this.w / 2 - 120,
            y: 370,
            width: 240,
            height: 60
        };
    }

    drawGameOver(player, score, pulseValue) {
        this.clear();

        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = 'bold 48px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.w / 2, 150);

        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = '20px monospace';
        this.ctx.fillText(`FINAL SCORE: ${score}`, this.w / 2, 250);
        this.ctx.fillText(`HEALTH: ${player.health}/${player.maxHealth}`, this.w / 2, 290);

        // Pulsing restart text
        const alpha = 0.5 + pulseValue * 0.5;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.font = '16px monospace';
        this.ctx.fillText('CLICK TO RESTART', this.w / 2, 400);

        return {
            x: this.w / 2 - 120,
            y: 370,
            width: 240,
            height: 60
        };
    }
}
