function generate(mountainTotal, lakeTotal, boardSize,  moatChance) {
    var board = Array(boardSize).fill().map(() => Array(boardSize).fill('L'));
    // block4 = [  // Tetrominoes
    //     [
    //         [1,0,0],
    //         [1,1,0],
    //         [0,1,0]
    //     ],
    //     [
    //         [1,0,0],
    //         [1,0,0],
    //         [1,1,0]
    //     ],
    //     [
    //         [1,1,0],
    //         [1,1,0],
    //         [0,0,0]
    //     ],
    //     [
    //         [1,0,0],
    //         [1,1,0],
    //         [1,0,0]
    //     ]
    // ];
    // block3 = [
    //     [
    //         [1,1,1],
    //         [0,0,0],
    //         [0,0,0]
    //     ],
    //     [
    //         [0,0,0],
    //         [1,1,1],
    //         [0,0,0]
    //     ],
    //     [
    //         [1,1,0],
    //         [1,0,0],
    //         [0,0,0]
    //     ],
    //     [
    //         [0,1,0],
    //         [1,1,0],
    //         [0,0,0]
    //     ]
    // ];
    for (let terrains = 0; terrains < 2; terrains++){
        let terrainTotal = (terrains == 0) ? lakeTotal : mountainTotal;
        let terrainLetter = (terrains == 0) ? 'W' : 'M';
        for (let i = 0; i < terrainTotal; i++){
            let polynominoType = Math.random() < 0.5 ? 3 : 4;
            block4 = [  // Tetrominoes
                [
                    [1,0,0],
                    [1,1,0],
                    [0,1,0]
                ],
                [
                    [1,0,0],
                    [1,0,0],
                    [1,1,0]
                ],
                [
                    [1,1,0],
                    [1,1,0],
                    [0,0,0]
                ],
                [
                    [1,0,0],
                    [1,1,0],
                    [1,0,0]
                ]
            ];
            block3 = [
                [
                    [1,1,1],
                    [0,0,0],
                    [0,0,0]
                ],
                [
                    [0,0,0],
                    [1,1,1],
                    [0,0,0]
                ],
                [
                    [1,1,0],
                    [1,0,0],
                    [0,0,0]
                ],
                [
                    [0,1,0],
                    [1,1,0],
                    [0,0,0]
                ]
            ];

            let block = [];
            if (polynominoType === 3){
                block = block3[Math.floor(Math.random() * block3.length)];
            } else {
                block = block4[Math.floor(Math.random() * block4.length)];
            }

            for (let j = 0; j < 3; j++){
                for (let k = 0; k < 3; k++){
                    if (block[j][k] == 1){
                        block[j][k] = terrainLetter;
                    }
                }
            }
            let rotationTotal = Math.floor(Math.random() * 4);
            let reflectionTotal = Math.floor(Math.random() * 2);
            for (let j = 0; j < rotationTotal; j++){
                rotate90(block);
            }
            for (let j = 0; j < reflectionTotal; j++){
                reflectX(block);
            }
            let rngSize = (boardSize + 1) / 2 - 2;
            let midR = Math.floor(Math.random() * rngSize) + 1;
            let midC = Math.floor(Math.random() * rngSize) + 1;
            if (i % 2 == 1){
                midC = boardSize - midC - 1;
            }
            if (i % 4 > 1){
                midR = boardSize - midR - 1;
            }
            // for (let r = midR - 1; r <= midR + 1; r++){
            //     for (let c = midC - 1; c <= midC + 1; c++){
            //         if (block[r - midR + 1][c - midR + 1] === terrainLetter){
            //             board[r][c] = block[r - midR + 1][c - midC + 1];
            //         }
            //     }
            // }
            for(let r = 0; r < 3; r++){
                for(let c = 0; c < 3; c++){
                    if(block[r][c] === terrainLetter){
                        board[r + midR - 1][c + midC - 1] = terrainLetter;
                    }
                }
            }
        }
    }
    for (let i = 0; i < 4; i++){
        let r = i % 2 === 0 ? 1 : boardSize - 2;
        let c = i < 2 ? 0 : boardSize - 1;
        board[r][c] = 'L';
        r = i % 2 === 0 ? 0 : boardSize - 1;
        c = i < 2 ? 1 : boardSize - 2;
        board[r][c] = 'L';
        r = i % 2 === 0 ? 0 : boardSize - 1;
        c = i < 2 ? 0 : boardSize - 1;
        board[r][c] = 'L';
    }
    if (Math.random() < moatChance){
        for (let r = (boardSize - 1) / 2 - 1; r <= (boardSize - 1) / 2 + 1; r++){
            for (let c = (boardSize - 1) / 2 - 1; c <= (boardSize - 1) / 2 + 1; c++){
                board[r][c] = 'W';
            }
        }
        board[(boardSize - 1) / 2][(boardSize - 1) / 2] = 'L';
    }
    return board;
}
function rotate90(matrix) {
    let size = matrix.length;
    for (let i = 0; i < Math.floor(size / 2); i++){
        for (let j = i; j < 2; j++){
            let temp1 = matrix[i][j];
            let temp2 = matrix[j][size - i - 1];
            let temp3 = matrix[size - i - 1][size - j - 1];
            matrix[i][j] = matrix[size - j - 1][i];
            matrix[size - j - 1][i] = temp3;
            matrix[size - i - 1][size - j - 1] = temp2;
            matrix[j][size - i - 1] = temp1;
        }
    }
}
function reflectX(matrix){  // For square matrices
    // let size = matrix.length;
    // for (let i = 0; i < Math.floor(size / 2); i++){
    //     for (let j = i; j < size; j++){
    //         let temp = matrix[i][j];
    //         matrix[i][j] = matrix[i][size - i - 1];
    //         matrix[size - i - 1][i] = temp;
    //     }
    // }
    let temp1 = matrix[0][0];
    let temp2 = matrix[0][1];
    let temp3 = matrix[0][2];
    matrix[0][0] = matrix[2][0];
    matrix[0][1] = matrix[2][1];
    matrix[0][2] = matrix[2][2];
    matrix[2][0] = temp1;
    matrix[2][1] = temp2;
    matrix[2][2] = temp3;
}

board = generate(4,4,11,0.5);

/*
print2DArr(board);

function print2DArr(arr){
    for (let r = 0; r < 11; r++){
        for (let c = 0; c < 11; c++){
            process.stdout.write(board[r][c]);
        }
        console.log();
    }
}
*/
module.exports = { generate };
