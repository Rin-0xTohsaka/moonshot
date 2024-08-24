export const levelEntityMapping = [
    { boss: "blue_boss.png", entity: "entity_1.png", minion: "blue_minion.png" },
    { boss: "green_boss.png", entity: "entity_2.png", minion: "green_minion.png" },
    { boss: "red_boss.png", entity: "entity_3.png", minion: "red_minion.png" },
    { boss: "yellow_boss.png", entity: "entity_1.png", minion: "yellow_minion.png" },
    { boss: "blue_boss.png", entity: "entity_2.png", minion: "blue_minion.png" },
    { boss: "green_boss.png", entity: "entity_3.png", minion: "green_minion.png" },
    { boss: "red_boss.png", entity: "entity_1.png", minion: "red_minion.png" },
    { boss: "yellow_boss.png", entity: "entity_2.png", minion: "yellow_minion.png" },
    { boss: "blue_boss.png", entity: "entity_3.png", minion: "blue_minion.png" }
];

export function getAssetsForLevel(levelIndex) {
    return levelEntityMapping[levelIndex % levelEntityMapping.length];
}