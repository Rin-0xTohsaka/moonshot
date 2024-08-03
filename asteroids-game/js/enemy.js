// enemy.js file

export class EnemyShip {
    constructor(x, y, canvasWidth, canvasHeight, level) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.speed = (Math.random() * 2 + 1) * (1 + level * 0.1);
        this.angle = Math.random() * Math.PI * 2;
        this.health = 5 + level; // Increase health with level
    }

    draw(ctx) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.radius, this.y);
        ctx.lineTo(this.x - this.radius, this.y - this.radius / 2);
        ctx.lineTo(this.x - this.radius, this.y + this.radius / 2);
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
