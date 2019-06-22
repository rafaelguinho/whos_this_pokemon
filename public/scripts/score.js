class Score {

    constructor(maxScoreLevel) {
        this.current = 1;
        this.maxScoreLevel = maxScoreLevel;
    }

    increaseCurrentScore() {
        this.current++;
    }
}