// utils.js

export function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function checkCollision(obj1, obj2) {
    return distanceBetweenPoints(obj1.x, obj1.y, obj2.x, obj2.y) < obj1.radius + obj2.radius;
}