// asteroid.js file

export class Asteroid {
    constructor(x, y, radius, canvasWidth, canvasHeight, level) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.speed = (Math.random() * 2 + 1) * (1 + level * 0.1); // Increase speed with level
        this.angle = Math.random() * Math.PI * 2;
        this.vertices = Math.floor(Math.random() * 7) + 8;
        this.offsets = [];
        for (let i = 0; i < this.vertices; i++) {
            this.offsets.push(Math.random() * 0.4 + 0.8);
        }
    }

    draw(ctx) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < this.vertices; i++) {
            const angle = (i / this.vertices) * Math.PI * 2;
            const x = this.x + this.radius * this.offsets[i] * Math.cos(angle);
            const y = this.y + this.radius * this.offsets[i] * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0 - this.radius) this.x = this.canvasWidth + this.radius;
        if (this.x > this.canvasWidth + this.radius) this.x = 0 - this.radius;
        if (this.y < 0 - this.radius) this.y = this.canvasHeight + this.radius;
        if (this.y > this.canvasHeight + this.radius) this.y = 0 - this.radius;
    }
}
