// collision.js
// Collision detection logic with detailed logging

export function collision(a, b) {
    const a_pos = a.getPosition();
    const b_pos = b.getPosition();

    const sq = (x) => Math.pow(x, 2);

    const distance = Math.sqrt(sq(a_pos[0] - b_pos[0]) + sq(a_pos[1] - b_pos[1]));
    const sumOfRadii = a.getRadius() + b.getRadius();

    console.log('Collision check:', {
        object1: a.constructor.name,
        object2: b.constructor.name,
        a_position: a_pos,
        b_position: b_pos,
        a_radius: a.getRadius(),
        b_radius: b.getRadius(),
        distance: distance,
        sumOfRadii: sumOfRadii,
        collisionDetected: distance <= sumOfRadii
    });

    return distance <= sumOfRadii;
}