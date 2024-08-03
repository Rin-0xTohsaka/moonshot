// main.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gameOver = false;
    let score = 0;

    const ship = new Ship();
    let asteroids = [];
    let powerUps = [];

    createAsteroids(5);
    gameLoop();

    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        if (e.key === 'ArrowLeft') ship.rotation = 0.1;
        if (e.key === 'ArrowRight') ship.rotation = -0.1;
        if (e.key === 'ArrowUp') ship.thrusting = true;
        if (e.key === ' ') ship.shoot();
    });

    document.addEventListener('keyup', (e) => {
        if (gameOver) return;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') ship.rotation = 0;
        if (e.key === 'ArrowUp') ship.thrusting = false;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
