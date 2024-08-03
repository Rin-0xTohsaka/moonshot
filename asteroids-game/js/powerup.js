// powerups.js file

export class PowerUp {
    constructor(canvas) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 10;
        this.type = ['shield', 'rapidFire', 'extraLife', 'bulletRange', 'spreadShot'][Math.floor(Math.random() * 5)];
        this.color = {
            shield: 'cyan',
            rapidFire: 'yellow',
            extraLife: 'green',
            bulletRange: 'magenta',
            spreadShot: 'orange'
        }[this.type];
        this.duration = 10000; // 10 seconds
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}