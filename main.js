const prompt = require('prompt-sync')({sigint: true});
const chalk = require('chalk');

const hat = chalk.bgYellowBright(chalk.magentaBright('^'));
const hole = 'O';
const fieldCharacter = chalk.whiteBright('░');
const pathCharacter = chalk.magentaBright('*');
const pathCharacterCurrent = chalk.bgMagentaBright(chalk.white(('*')));

class Field {
    // Field contructor 
    constructor(field) {
        // assign field property to input 2D array
        this.field = field;
        // assign user starting position to x=0, y=0 (top left)
        this.x = 0;
        this.y = 0;
    }

    // Generates a random field 
    static generateField(width, height, percentage) {
        const arr = [];
        // randomly fill the field with holes that show up percentage of the time
        for (let i = 0; i < height; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
                if (Math.random()*100 < percentage) {
                    row.push(hole);
                } else {
                    row.push(fieldCharacter);
                }
            }
            arr.push(row);
        }
        
        // assign the path character to the top left corner
        arr[0][0] = pathCharacterCurrent;

        // randomly assign the hat to a location
        const holeRow = Math.floor(Math.random()*height);
        const holeCol = Math.floor(Math.random()*width);
        arr[holeRow][holeCol] = hat;

        return new Field(arr);
    }

    // print out the field 
    print() {
        this.field.forEach(element => {
            console.log(chalk.bgGreenBright(element.join(' ')));
        });
    }

    // mark where the user has moved
    markPath() {
        this.field[this.y][this.x] = pathCharacter;
    }

    // mark where the user currently is 
    markPathCurrent() {
        this.field[this.y][this.x] = pathCharacterCurrent;
    }

    // get the marker that the move just landed on 
    getMarker() {
        return this.field[this.y][this.x];
    }

    // determine if move is on the field
    onField() {
        return (this.x > -1) && (this.y > -1) && (this.y < this.field.length) && (this.x < this.field[0].length);
    }

    // determine if move is on a hole
    onHole() {
        return this.getMarker() === hole;
    }

    // determine if move is on the hat
    onHat() {
        return this.getMarker() === hat;
    }

    // getMove() retrieves a move from the user via the terminal 
    getMove() {
        // mark previous move to normal path character;
        this.markPath();
        
        // receive user input from terminal 
        // prompt will loop until a valid move is made by the user.
        let validMove = false; 
        while (!validMove) {
            let move = prompt('Make a move (U, D, L, or R): ');
            move = move.toUpperCase();
            switch(move) {
                // Determine move and change position accordingly.
                case 'U':
                    this.y -=1;
                    validMove = true;
                    break;
                case 'D':
                    this.y +=1;
                    validMove = true;
                    break;
                case 'L':
                    this.x -=1;
                    validMove = true;
                    break;
                case 'R':
                    this.x +=1;
                    validMove = true;
                    break;
                // Repeat loop if input invalid. 
                default:
                    console.log ('Invalid entry. Please try again.');
            }
        }
    }

    // game() runs through one game of Find My Hat
    game() {
        // Set up game
        let playGame = true;

        // Loop through game
        while(playGame) {
            this.print();
            this.getMove();
            console.log(); // add blank line to visually break up moves
            if(!this.onField()) { // Determine if move is off board 
                console.log('Moved off field. You lose.');
                playGame = false;
            } else if (this.onHole()) {
                console.log('Stepped in a hole. You lose.');
                playGame = false;
            } else if (this.onHat()) {
                console.log('Found the hat! You win!');
                playGame = false;
            }
            this.markPathCurrent();
        }
    }

    // play() loops explains rules and loops through games until user quits
    static play() {
        // explain game rules 
        console.log('\nWelcome to Find My Hat!');
        console.log('I\'ve lost my hat and need help finding it. It looks like this: ' + hat);
        console.log('You are the ' + pathCharacter + ' symbol. Use the keys to navigate to get my hat.');
        console.log('But don\'t fall down a hole' + hole + 'or off the field!\n');
        console.log('Press ctrl + c to quit at any time.')

        // loop through playing games until user quits
        let playing = true; 
        while(playing) {
            const randField = Field.generateField(15, 10, 25);
            randField.game();

            let again = prompt('End of game. Play again? (Y/N): ');
            again = again.toUpperCase();
            if (again === 'Y') {
                console.log('\nCreating a new board!\n')
            } else {
                playing = false;
                console.log('\nBye!\n');
            }
        }
    }
}

 // Play in terminal 
Field.play();