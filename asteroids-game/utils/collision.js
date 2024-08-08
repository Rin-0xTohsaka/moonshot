// collision.js
// Collision detection logic

export function collision(a, b) {
    const a_pos = a.getPosition();
    const b_pos = b.getPosition();

    const sq = (x) => Math.pow(x, 2);

    const distance = Math.sqrt(sq(a_pos[0] - b_pos[0]) + sq(a_pos[1] - b_pos[1]));

    return distance <= a.getRadius() + b.getRadius();
}