// boss.js
// Handles the boss battles and associated mechanics

export function createBoss(game, bossConfig) {
    const boss = {
        position: [game.playfield.width / 2, game.playfield.height / 4],
        health: bossConfig.health,
        sprite: new Image(),
        entitySprite: new Image(),
        minions: [],
        getRadius: () => bossConfig.size / 2,
        getPosition: () => boss.position,
        shieldActive: bossConfig.shieldActive || false,
        minionSpawnRate: bossConfig.minionSpawnRate || 2000, // ms
        lastMinionSpawnTime: 0,
        shieldRotation: 0,
        shieldRotationSpeed: bossConfig.shieldRotationSpeed || 0.05,
        imageLoaded: false,
        entityImageLoaded: false
    };

    boss.sprite.src = bossConfig.spritePath;
    boss.sprite.onload = () => {
        game.log.debug('Boss image loaded');
        boss.imageLoaded = true;
    };
    boss.sprite.onerror = () => {
        game.log.error('Failed to load boss image');
        boss.imageLoaded = false;
    };

    boss.entitySprite.src = bossConfig.entityPath;
    boss.entitySprite.onload = () => {
        game.log.debug('Boss entity image loaded');
        boss.entityImageLoaded = true;
    };
    boss.entitySprite.onerror = () => {
        game.log.error('Failed to load boss entity image');
        boss.entityImageLoaded = false;
    };

    function draw(ctx) {
        ctx.save();
        ctx.translate(boss.position[0], boss.position[1]);

        if (boss.imageLoaded) {
            ctx.drawImage(boss.sprite, -bossConfig.size / 2, -bossConfig.size / 2, bossConfig.size, bossConfig.size);
        } else {
            // Fallback drawing if image fails to load
            ctx.fillStyle = 'red';
            ctx.fillRect(-bossConfig.size / 2, -bossConfig.size / 2, bossConfig.size, bossConfig.size);
        }

        if (boss.entityImageLoaded) {
            ctx.drawImage(boss.entitySprite, -bossConfig.size / 4, -bossConfig.size / 4, bossConfig.size / 2, bossConfig.size / 2);
        }

        ctx.restore();

        // Draw minions
        boss.minions.forEach(minion => minion.draw(ctx));
    }

    function move() {
        // Boss movement logic (if any)
        if (bossConfig.movementPattern) {
            bossConfig.movementPattern(boss);
        }
    }

    function spawnMinions(timestamp) {
        if (timestamp - boss.lastMinionSpawnTime > boss.minionSpawnRate) {
            if (boss.minions.length < bossConfig.maxMinions) {
                const minion = createMinion(game, boss.position, bossConfig.minionConfig);
                boss.minions.push(minion);
                game.log.debug('Minion spawned');
            }
            boss.lastMinionSpawnTime = timestamp;
        }
    }

    function update(timestamp) {
        move();
        spawnMinions(timestamp);

        // Update all minions
        boss.minions.forEach(minion => minion.update(boss.position));

        // Filter out defeated minions
        boss.minions = boss.minions.filter(minion => minion.getHealth() > 0);
    }

    function takeDamage(amount) {
        if (boss.shieldActive) {
            game.log.debug('Boss shield is active, no damage taken');
            return;
        }

        boss.health -= amount;
        game.log.debug(`Boss took ${amount} damage. Health is now ${boss.health}`);
        if (boss.health <= 0) {
            game.log.debug('Boss defeated!');
        }
    }

    return {
        draw,
        update,
        takeDamage,
        getPosition: () => boss.position,
        getHealth: () => boss.health,
        minions: boss.minions,
        getRadius: boss.getRadius,
        //getRadius: () => bossConfig.size / 2,
    };
}

function createMinion(game, bossPosition, minionConfig) {
    const minion = {
        position: [
            bossPosition[0] + Math.random() * 100 - 50,
            bossPosition[1] + Math.random() * 100 - 50
        ],
        health: minionConfig.health,
        sprite: new Image(),
        entitySprite: new Image(),
        speed: minionConfig.speed,
        imageLoaded: false,
        getRadius: () => minionConfig.size / 2,
        getPosition: () => minion.position,
        entityImageLoaded: false,
        angle: Math.random() * Math.PI * 2, // Random starting angle
        orbitRadius: Math.random() * 50 + 50, // Random orbit radius between 50 and 100
        orbitSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? 1 : -1), // Random orbit speed and direction
    };

    minion.sprite.src = minionConfig.spritePath;
    minion.sprite.onload = () => {
        game.log.debug('Minion image loaded');
        minion.imageLoaded = true;
    };
    minion.sprite.onerror = () => {
        game.log.error('Failed to load minion image');
        minion.imageLoaded = false;
    };

    minion.entitySprite.src = minionConfig.entityPath;
    minion.entitySprite.onload = () => {
        game.log.debug('Minion entity image loaded');
        minion.entityImageLoaded = true;
    };
    minion.entitySprite.onerror = () => {
        game.log.error('Failed to load minion entity image');
        minion.entityImageLoaded = false;
    };

    function draw(ctx) {
        if (minion.imageLoaded) {
            ctx.drawImage(minion.sprite, minion.position[0], minion.position[1], minionConfig.size, minionConfig.size);
        } else {
            // Fallback drawing if image fails to load
            ctx.fillStyle = 'blue';
            ctx.fillRect(minion.position[0], minion.position[1], minionConfig.size, minionConfig.size);
        }

        if (minion.entityImageLoaded) {
            ctx.drawImage(minion.entitySprite, minion.position[0] + minionConfig.size / 4, minion.position[1] + minionConfig.size / 4, minionConfig.size / 2, minionConfig.size / 2);
        }
    }

    function move(bossPosition) {
        // Update the angle
        minion.angle += minion.orbitSpeed;

        // Calculate new position based on boss position and orbit
        minion.position[0] = bossPosition[0] + Math.cos(minion.angle) * minion.orbitRadius;
        minion.position[1] = bossPosition[1] + Math.sin(minion.angle) * minion.orbitRadius;
    }

    function update(bossPosition) {
        move(bossPosition);
    }

    function takeDamage(amount) {
        minion.health -= amount;
        game.log.debug(`Minion took ${amount} damage. Health is now ${minion.health}`);
        if (minion.health <= 0) {
            game.log.debug('Minion defeated!');
        }
    }

    return {
        draw,
        update,
        takeDamage,
        getPosition: () => minion.position,
        getHealth: () => minion.health,
        //getRadius: () => minionConfig.size / 2,
        getRadius: minion.getRadius,

    };
}
