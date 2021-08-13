const prompt = require('prompt-sync')({sigint: true});
const chalk = require('chalk');

const hat = chalk.bgYellowBright(chalk.magentaBright('^'));
const hole = chalk.black('O');
const fieldCharacter = chalk.whiteBright('░');
const pathCharacter = chalk.magentaBright(('*'));
const pathCharacterCurrent = chalk.bgMagentaBright(chalk.blueBright(('*')));

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

        // randomly assign the hat to a location in bottom right quarter of field
        const halfHeight = Math.floor(height/2);
        const halfWidth = Math.floor(width/2);
        const hatRow = Math.floor(Math.random()*halfHeight) + halfHeight;
        const hatCol = Math.floor(Math.random()*halfWidth) + halfWidth;
        arr[hatRow][hatCol] = hat;

        return new Field(arr, height, width);
    }

    // determine if a field is solvable
    // i.e., that user can navigate to the hat from the starting point
    isSolvable() {
        // make a copy of the field to make calls easier
        const maze = this.field.slice();
        // save height and width of field for bounds in maze solver
        const height = maze.length;
        const width = maze[0].length;

        // initialize an array of places that were tested and set them all to false
        const wasHere = [];
        for (let i = 0; i < height; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
                row.push(false);
            }
            wasHere.push(row);
        }

        // recursive function to find a path to the hat 
        function findPath(x, y) {
            // determine if found hat
            if(maze[y][x] === hat) {
                return true;
            } else if (maze[y][x] === hole || wasHere[y][x]) {
                return false;
            } else {
                wasHere[y][x] = true;
                // recursively call findPath(x, y) until reach the end of all paths 
                if (x != 0) {
                    if (findPath(x-1, y)) {
                        return true;
                    }
                }
                if (y != 0) {
                    if (findPath(x, y-1)) {
                        return true;
                    }
                }
                if (x != width-1) {
                    if (findPath(x+1, y)) {
                        return true;
                    }
                }
                if (y != height-1) {
                    if (findPath(x, y+1)) {
                        return true;
                    }
                }
                return false;
            }
        }
        return findPath(this.x, this.y);
    }

    // print out the field 
    printField() {
        this.field.forEach(element => {
            console.log(chalk.bgGreenBright(element.join(' ')));
        });
    }

    // print out the game rules 
    printRules() {
        console.log('\nWelcome to Find My Hat!\n');
        console.log('I\'ve lost my hat and need help finding it. It looks like this: ' + hat);
        console.log('You are the ' + pathCharacterCurrent + ' symbol. Use the keys to navigate to get my hat.');
        console.log('But don\'t fall down a hole' + hole + 'or off the field!');
        console.log('\nCommands are case-insensitive. Press ctrl + c to quit at any time.\n')
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
            console.clear();    // clear last move to keep console neat
            this.printRules()   // print rules
            this.printField();  // print the field
            this.markPath();    // mark previous move to normal path character;
            this.getMove();
            console.log();      // add blank line to visually break up moves
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
        // loop through playing games until user quits
        let playing = true; 
        while(playing) {
            let randField; 
            let solvable = false;
            while (!solvable) {
                randField = Field.generateField(15, 10, 35);
                solvable = randField.isSolvable();
            }

            randField.game();

            let again = prompt('End of game. Play again? (Y/N): ');
            again = again.toUpperCase();
            if (again !== 'Y') {
                playing = false;
                console.log('\nBye!\n');
            }
        }
    }
}

 // Play in terminal 
Field.play();