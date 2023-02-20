class BoggleGame {
    constructor(boardId, time = 60) {
    this.time = time;
    this.showTimer();
    this.score = 0;
    this.words = new Set();
    this.board = $("#" + boardId);
    this.timer = setInterval(this.tick.bind(this), 1000);
    
    $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    showWord(word) {
        $(".words", this.board).append($("<li>", { text: word }));
    }

    showScore() {
        $(".score", this.board).text(this.score);
    }

    showMessage(msg, cls) {
        $(".msg", this.board)
          .text(msg)
          .removeClass()
          .addClass(`msg ${cls}`);
    }

    async handleSubmit(evt) {
        evt.preventDefault();
        const $word = $(".word", this.board);
        let word = $word.val();
        if (!word) return;

        if (this.words.has(word)) {
        this.showMessage(`${word} has already been found!`, "err");
        return;
        }

        const res = await axios.get("/check-word", { params: { word: word }});
        if (res.data.result === "not-word") {
            this.showMessage(`Try Again`, "err");
        } else if (res.data.result === "not-on-board") {
            this.showMessage(`Try Again`, "err");
        } else {
            this.showWord(word);
            this.score += word.length;
            this.showScore();
            this.words.add(word);
            this.showMessage(`Added: ${word}`, "acc");
        }
    }
    showTimer() {
        $(".timer", this.board).text(this.time);
    }
    async tick() {
        this.time -= 1;
        this.showTimer();
        if (this.time === 0) {
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }
    async scoreGame() {
        $(".add-word", this.board).hide();
        const res = await axios.post("/post-score", { score: this.score });
    if (res.data.newHighScore) {
        this.showMessage(`New High Score: ${this.score}`, "acc");
    }   
    else {
        this.showMessage(`Final Score: ${this.score}`, "acc");
    }
    }
}