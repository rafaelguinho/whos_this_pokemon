export default class Score {

    constructor(level) {
        this.current = 1;
        this.maxScoreLevel = level.currentGenerations[level.currentGenerations.length - 1].end;
    }

    increaseCurrentScore() {
        this.current++;
    }
}