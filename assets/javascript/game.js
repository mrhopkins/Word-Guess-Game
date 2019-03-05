/*
----------------------------------------------------------------
Can You Guess the Horror Villain game
----------------------------------------------------------------
*/

const villainData = {
    "Freddy Kreuger": "A Nightmare on Elm Street (1984)",
    "Pamela Voorhees": "Friday the 13th (1980)",
    "Jason Voorhees": "Friday the 13th Part 2 (1981)",
    "Chucky": "Child's Play (1988)",
    "Samara Morgan": "The Ring (2002)",
    "Michael Myers": "Halloween (1978)",
    "Death": "Final Destination (2000)",
    "Leatherface": "Texas Chain Saw Massacre (1974)",
    "Harry Warden": "My Bloody Valentine (1981)",
    "Angela Baker": "Sleepaway Camp (1983)",
    "Candyman": "Candyman (1992)",
    "Ghostface": "Scream (1996)",
    "Pennywise": "It (2017)",
    "Jack Torrance": "The Shining (1980)",
    "Jigsaw": "Saw (2004)",
    "Norman Bates": "Psycho (1960)",
    "Patrick Bateman": "American Psycho (2000)",
    "Pinhead": "Hellraiser (1987)",
    "Pyramid Head": "Silent Hill (2006)",
    "Damien Thorn": "The Omen (1976)",
    "Creeper": "Jeepers Creepers (2001)",
    "Esther Coleman": "Orphan (2009)",
    "Jennifer Check": "Jennifer's Body (2009)",
    "Djinn": "Wishmaster (1997)",
    "Victor Crowley": "Hatchet (2006)",
    "Billy Chapman": "Silent Night, Deadly Night (1984)",
    "Ricky Caldwell": "Silent Night, Deadly Night Part 2 (1987)",
}

/*
----------------------------------------------------------------
A class for the word guess game
----------------------------------------------------------------
*/
class GameHorror {
    constructor(remainingAttempts = 6) {
        this.started = false; // game state boolean
        this.answer = "";     // an original answer word/string
        this.ansLetters = []; // unique letters of the answer
        this.ansDisplay = []; // "_ _ _ _" on the web page
        this.numWins = 0;     // the number of wins counter  
        this.remaining = remainingAttempts; // remaining attempts counter
    }

    //
    // (re-)start by initializing the variables
    //
    start(remainingGuess = this.remaining) {
        this.remaining = remainingGuess;
        this.answer = this.pickAnswer(villainData);
        this.ansLetters = this.initAnswerLetters(this.answer);
        this.ansDisplay = this.initAnswerDisplay(this.answer);
        this.started = true;
    }

    //
    // Choose string from an array
    //
    pickAnswer(inputData) {
        let arrayData = [];
        for (let name in inputData) {
            arrayData.push(name);
        }
        let ndx = Math.floor(Math.random() * arrayData.length);

        return arrayData[ndx];
    }

    //
    // Initialize unique answer letters in an array, all in lower-case 
    //
    initAnswerLetters(ansStr) {
        let ansLetters = [];
        for (let i = 0; i < ansStr.length; i++) {
            let ansChar = ansStr.charAt(i).toLowerCase();
            if (/^\w$/.test(ansChar)) {
                ansLetters.push(ansChar);
            }
        }

        return new Set(ansLetters);
    }

    //
    // Initialize ansDisplay i.e. "_ _ _ _" for the web page
    // non-alphanumeric characters will be shown
    //
    initAnswerDisplay(ansStr) {
        let ansDisplay = [];
        for (let i = 0; i < ansStr.length; i++) {
            let ansChar = ansStr[i];
            ansDisplay[i] = ansChar;
            if (/\w/.test(ansChar)) {
                ansDisplay[i] = "_";
            }
        }

        return ansDisplay;
    }

    //
    // Update the game data
    // inputChar parameter should be in lower-case
    //  
    updateGameData(inputChar) {
        // Set.delete() returns true if inputChar has been deleted
        if (this.ansLetters.delete(inputChar)) {
            this.updateAnsDisplay(inputChar);
            if (this.userWon()) {
                this.numWins++;
                return true;
            }
        } else {
            this.remaining--;
        }

        return false;
    }

    //
    // Update the word displayed on the page
    //  
    updateAnsDisplay(char) {
        console.log("char: =>" + char + "<- word: " + this.answer);

        for (let i = 0; i < this.answer.length; i++) {
            if (this.answer.charAt(i).toLowerCase() === char) {
                this.ansDisplay[i] = this.answer[i];
                console.log("got " + char + "  word: " + this.ansDisplay);
            }
        }

        return this.ansDisplay;
    }

    //
    // Determine whether the user guessed all letters or not
    //
    userWon() {
        if (this.ansLetters.size == 0) {
            return true;
        }
        return false;
    }

    //
    // Hint for the current answer key
    //
    hint() {
        return villainData[this.answer];
    }
}

/*
----------------------------------------------------------------
  A class for the game web page
----------------------------------------------------------------
*/
class WebElems {
    constructor(game = new GameHorror()) {
        this.startMsg = document.getElementById("start");
        this.numWins = document.getElementById("num-wins");
        this.answer = document.getElementById("question");
        this.remaining = document.getElementById("remaining-guesses");
        this.guessed = document.getElementById("already-guessed");
        this.game = game;
    }

    //
    // Takes user key input and play the game
    //  
    handleKeyInput(userInput) {
        console.log("input: " + userInput);

        if (this.game.started) {
            this.startMsg.style.visibility = "hidden";

            // ignore ctrl, shift, etc. key stroke
            if (/^[\w~!@#$%^&*()_+=,.]$/.test(userInput)) {
                console.log("answer: " + this.game.answer);
                if (this.game.updateGameData(userInput.toLowerCase())) {
                    this.start();
                    userInput = ""; // user won, so reset
                } else {
                    if (this.game.remaining === 0) {
                        userInput = "";
                    }
                }
                this.updatePage(userInput);
            }
        } else {
            // the very initial state or user lost
            if (this.game.remaining === 0) {
                this.startMsg.style.visibility = "hidden";
            }
            this.start();
        }
    }

    //
    // (re-)start the game
    //
    start(remainingGuess = 6) {
        this.game.start(remainingGuess);
        this.guessed.textContent = "";
        this.updatePage("");
        $("#hint").text("");
    }

    //
    // Update the page with the game data
    //  
    updatePage(inputChar) {
        this.numWins.textContent = this.game.numWins;
        this.answer.textContent = this.game.ansDisplay.join("");
        this.remaining.textContent = this.game.remaining;
        this.guessed.textContent += inputChar.toUpperCase();

        if (this.game.remaining === 0) {
            this.showAnswer();
            this.game.started = false;
        }
    }

    //
    // User lost, so show the answer
    //
    showAnswer() {
        this.answer.textContent = this.game.answer;
        this.startMsg.style.visibility = "visible";
    }

    //
    // Hint for the current answer key
    //
    hint() {
        return this.game.hint();
    }
}