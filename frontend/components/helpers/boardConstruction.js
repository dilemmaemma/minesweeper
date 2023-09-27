// Generates random bomb positions for game
function generateRandomBombPositions(sweeperBoard) {
    const bombPositions = [];
  
    while (bombPositions.length < sweeperBoard.bombs) {
        const x = Math.floor(
            Math.random() * 
            sweeperBoard.width
        );
        const y = Math.floor(
            Math.random() * 
            sweeperBoard.height
        );
        const position = `${x}-${y}`;
      
        // Ensure there are no duplicates
        if (!bombPositions.includes(position)) {
            bombPositions.push(position);
        }
    }
      
    return bombPositions;
}

// Creates the entire game board
export function createGameBoard(sweeperBoard) {
    const bombPositions = generateRandomBombPositions(sweeperBoard);
    const newGame = [];
      
    for (let i = 0; i < sweeperBoard.height; i++) {
        const row = [];
      
        for (let j = 0; j < sweeperBoard.width; j++) {
            const isBomb = bombPositions.includes(`${j}-${i}`);
            row.push(isBomb ? 'X' : 'O');
        }
      
        newGame.push(row);
    }
      
    return newGame;
}