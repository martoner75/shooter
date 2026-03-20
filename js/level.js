export class Level {
    constructor(levelNumber, enemies) {
        this.levelNumber = levelNumber;
        this.waves = this.getWavesForLevel(levelNumber);
        this.currentWaveIndex = 0;
        this.currentWave = null;
        this.spawnIndex = 0;
        this.spawnTimer = 0;
        this.spawnRate = 0.5; // seconds between spawns
        this.state = 'WAITING'; // WAITING, SPAWNING, WAITING_FOR_CLEAR
        this.enemies = enemies;
        this.nextWave();
    }

    getWavesForLevel(n) {
        // Level progression with scaling for 6+
        if (n === 1) {
            return [
                [{ type: 'grunt', count: 4 }, { type: 'grunt', count: 4 }],
                [{ type: 'grunt', count: 8 }]
            ];
        } else if (n === 2) {
            return [
                [{ type: 'grunt', count: 5 }, { type: 'fast', count: 3 }],
                [{ type: 'grunt', count: 4 }, { type: 'fast', count: 4 }],
                [{ type: 'fast', count: 6 }]
            ];
        } else if (n === 3) {
            return [
                [{ type: 'grunt', count: 4 }, { type: 'fast', count: 3 }, { type: 'tank', count: 1 }],
                [{ type: 'grunt', count: 3 }, { type: 'tank', count: 2 }],
                [{ type: 'fast', count: 5 }, { type: 'tank', count: 1 }]
            ];
        } else if (n === 4) {
            return [
                [{ type: 'grunt', count: 4 }, { type: 'shooter', count: 2 }],
                [{ type: 'fast', count: 4 }, { type: 'shooter', count: 2 }],
                [{ type: 'tank', count: 2 }, { type: 'shooter', count: 1 }],
                [{ type: 'grunt', count: 3 }, { type: 'fast', count: 3 }, { type: 'shooter', count: 1 }]
            ];
        } else if (n === 5) {
            return [
                [{ type: 'grunt', count: 4 }, { type: 'rusher', count: 1 }],
                [{ type: 'fast', count: 4 }, { type: 'rusher', count: 2 }],
                [{ type: 'tank', count: 2 }, { type: 'rusher', count: 1 }],
                [{ type: 'shooter', count: 3 }, { type: 'rusher', count: 1 }],
                [{ type: 'grunt', count: 2 }, { type: 'fast', count: 2 }, { type: 'tank', count: 1 }, { type: 'rusher', count: 2 }]
            ];
        } else {
            // Level 6+: scale based on (n-5)*0.3 multiplier
            const scaleFactor = 1 + (n - 5) * 0.3;
            const waveCount = 5;
            const waves = [];

            for (let i = 0; i < waveCount; i++) {
                const wave = [];
                const types = ['grunt', 'fast', 'tank', 'shooter', 'rusher'];

                for (const type of types) {
                    let baseCount = 0;
                    if (type === 'grunt') baseCount = Math.ceil(4 * scaleFactor);
                    else if (type === 'fast') baseCount = Math.ceil(3 * scaleFactor);
                    else if (type === 'tank') baseCount = Math.ceil(1 * scaleFactor);
                    else if (type === 'shooter') baseCount = Math.ceil(2 * scaleFactor);
                    else if (type === 'rusher') baseCount = Math.ceil(1 * scaleFactor);

                    if (baseCount > 0) {
                        wave.push({ type, count: baseCount });
                    }
                }

                waves.push(wave);
            }

            return waves;
        }
    }

    nextWave() {
        if (this.currentWaveIndex >= this.waves.length) {
            this.state = 'DONE';
            return;
        }

        const waveGroups = this.waves[this.currentWaveIndex];
        this.currentWave = [];

        // Flatten wave groups into individual spawn tasks
        for (const group of waveGroups) {
            for (let i = 0; i < group.count; i++) {
                this.currentWave.push(group.type);
            }
        }

        this.spawnIndex = 0;
        this.spawnTimer = 0;
        this.state = 'SPAWNING';
        this.currentWaveIndex++;
    }

    update(dt) {
        if (this.state === 'SPAWNING') {
            this.spawnTimer += dt;
            if (this.spawnTimer >= this.spawnRate && this.spawnIndex < this.currentWave.length) {
                this.spawnTimer = 0;
                this.spawnEnemy(this.currentWave[this.spawnIndex]);
                this.spawnIndex++;
            }

            if (this.spawnIndex >= this.currentWave.length) {
                this.state = 'WAITING_FOR_CLEAR';
            }
        } else if (this.state === 'WAITING_FOR_CLEAR') {
            // Check if all enemies are cleared
            if (this.enemies.length === 0) {
                this.nextWave();
            }
        }
    }

    spawnEnemy(type) {
        const { x, y } = this.getSpawnPosition(800, 600);

        this.enemies.push({
            type,
            x,
            y,
            active: true
        });
    }

    getSpawnPosition(w, h) {
        const edge = Math.floor(Math.random() * 4);
        const padding = 50;

        if (edge === 0) {
            // Top
            return { x: Math.random() * w, y: -padding };
        } else if (edge === 1) {
            // Bottom
            return { x: Math.random() * w, y: h + padding };
        } else if (edge === 2) {
            // Left
            return { x: -padding, y: Math.random() * h };
        } else {
            // Right
            return { x: w + padding, y: Math.random() * h };
        }
    }

    isComplete() {
        return this.state === 'DONE' && this.enemies.length === 0;
    }
}
