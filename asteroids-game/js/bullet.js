// bullet.js file

export class Bullet {
    constructor(x, y, angle, speed, range, powerUpType) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dx = Math.cos(angle) * speed;
        this.dy = -Math.sin(angle) * speed;
        this.lifespan = 50 * range;
        
        switch(powerUpType) {
            case 'rapidFire':
                this.radius = 1.5;
                this.color = 'yellow';
                break;
            case 'bulletRange':
                this.radius = 2;
                this.color = 'magenta';
                break;
            case 'spreadShot':
                this.radius = 2.5;
                this.color = 'orange';
                break;
            default:
                this.radius = 2;
                this.color = 'white';
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update(canvas) {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.lifespan--;
    }

    isActive() {
        return this.lifespan > 0;
    }
}