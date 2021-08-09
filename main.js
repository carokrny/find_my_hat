const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this.field = field;
    }

    print() {
        this.field.forEach(element => {
            console.log(element.join(' '));
        });
    }

    markPath(pos) {
        this.field[pos.y][pos.x] = pathCharacter;
    }

    getMarker(pos) {
        return this.field[pos.y][pos.x];
    }

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
        arr[0][0] = pathCharacter;

        // randomly assign the hat to a location
        const holeRow = Math.floor(Math.random()*height);
        const holeCol = Math.floor(Math.random()*width);
        arr[holeRow][holeCol] = hat;

        return new Field(arr);
    }
    
}

class Position {
    constructor (x, y){
        this.x = x;
        this.y = y;
    }

    onField(myField) {
        return (this.x > -1) && (this.y > -1) && (this.y < myField.field.length) && (this.x < myField.field[0].length);
    }
}


// Helper function to mark positions traveled on field. 
function getMove(pos) {
     // User input from terminal to make a move
    let validMove = false; 
    while (!validMove) {
        let move = prompt('Make a move (U, D, L, or R): ');
        move = move.toUpperCase();
        switch(move) {
            // Determine move and change position accordingly.
            case 'U':
                pos.y -=1;
                validMove = true;
                break;
            case 'D':
                pos.y +=1;
                validMove = true;
                break;
            case 'L':
                pos.x -=1;
                validMove = true;
                break;
            case 'R':
                pos.x +=1;
                validMove = true;
                break;
            // Repeat loop if input invalid. 
            default:
                console.log ('Invalid entry. Please try again.');
        }
    }
}


// Run through the game 
function game(field) {
    // Set up game pieces
    field.print();
    let pos = new Position(0, 0);
    let hatFound = false;

    // Loop through game
    while(!hatFound) {
        // Have user make a move on the field 
        getMove(pos);

        // Determine if move is off board 
        if(!pos.onField(field)) {
            console.log('Moved off field. You lose.');
            break;
        }

        // Determine what marker was stepped on 
        let marker = field.getMarker(pos);
        if (marker === hole) {
            console.log('Stepped in a hole. You lose.');
            break;
        } else if (marker === hat) {
            hatFound = true;
        }
        field.markPath(pos);
        console.log(); // add blank line to visually break up moves
        field.print();
    }
    if(hatFound) {
        console.log('Found the hat! You win!');
    }
}

// Run game on repeat until user exits. 
function play() {
    console.log('\nWelcome to Find My Hat!');
    console.log('I\'ve lost my hat and need help finding it. It looks like this: ^');
    console.log('You are the * symbol. Use the keys to navigate to get my hat.');
    console.log('But don\'t fall down a hole (O) or off the field!\n');
    console.log('Press ctrl + c to quit at any time.')

    let playing = true; 
    while(playing) {
        const randField = Field.generateField(15, 10, 25);
        game(randField);

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
 

//Test code 
play();