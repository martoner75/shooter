export class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = new Set();
        this.mouse = {
            x: 0,
            y: 0,
            down: false,
            justClicked: false
        };

        // Keyboard listeners
        window.addEventListener('keydown', (e) => {
            const key = this.normalizeKey(e.key);
            this.keys.add(key);
        });

        window.addEventListener('keyup', (e) => {
            const key = this.normalizeKey(e.key);
            this.keys.delete(key);
        });

        // Mouse listeners
        document.addEventListener('mousemove', (e) => {
            this.updateMousePosition(e);
        });

        document.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
            this.mouse.justClicked = true;
            this.updateMousePosition(e);
        });

        document.addEventListener('mouseup', (e) => {
            this.mouse.down = false;
            this.updateMousePosition(e);
        });
    }

    normalizeKey(key) {
        // Support WASD as aliases for arrow keys
        const aliases = {
            'w': 'ArrowUp',
            'a': 'ArrowLeft',
            's': 'ArrowDown',
            'd': 'ArrowRight'
        };
        return aliases[key.toLowerCase()] || key;
    }

    updateMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        this.mouse.x = (e.clientX - rect.left) * scaleX;
        this.mouse.y = (e.clientY - rect.top) * scaleY;
    }

    isDown(key) {
        return this.keys.has(key);
    }

    flush() {
        this.mouse.justClicked = false;
    }
}
