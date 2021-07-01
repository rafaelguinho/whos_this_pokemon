export default class Level {

    constructor(level) {

        if (isNaN(level) || level < 1 || level > 4) {
            throw "Level must be between 1 and 4";
        }

        const levelsGenerations = [{ level: 1, generations: [1] },
        { level: 2, generations: [1, 2] },
        { level: 3, generations: [1, 2, 3, 4] },
        { level: 4, generations: [1, 2, 3, 4, 5, 6, 7] }];

        const rangeGenerations = [{ generation: 1, init: 1, end: 151 },
        { generation: 2, init: 152, end: 251 },
        { generation: 3, init: 252, end: 386 },
        { generation: 4, init: 385, end: 493 },
        { generation: 5, init: 492, end: 649 },
        { generation: 6, init: 648, end: 721 },
        { generation: 7, init: 720, end: 809 }];

        let generationsCurrentLevel = levelsGenerations.find(x => x.level == level);

        this.currentGenerations = rangeGenerations.filter(x => generationsCurrentLevel.generations.includes(x.generation));
    }
}