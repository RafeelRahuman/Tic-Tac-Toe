//Game Board creation

const gameBoard = (()=> {
    let boardArray = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => [...boardArray];

    const placeMark = (index,mark) => {
        boardArray[index] = mark;
    };

    const resetBoard = () => {
        boardArray = ["","","","","","","","",""];
    };

    return{
        getBoard,
        placeMark,
        resetBoard
    };
})();

//Score Increases with player

function createPlayer(name,point){
    
    let score = 0;
    
    const increasePoint = () => {
        score++
    };
    const getScore = () => score;
    return {name,point,increasePoint,getScore};
}

//Player Creation

const gameController = (() => {

    // const player1 = createPlayer("AA","X");
    // const player2 = createPlayer("BB","O");

    let player1;
    let player2;
    let currentPlayer

    let gameOver = false;

    const startGame = (name1, name2) => {
        player1 = createPlayer(name1 || "Player 1","X")
        player2 = createPlayer(name2 || "Player 2","O")

        currentPlayer = player1;
        gameOver = false;
        gameBoard.resetBoard();
    }

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1
    }

//Winning Combos

    const checkWin = () => {
        const board = gameBoard.getBoard();
       const marker = currentPlayer.point;

    const winningCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    return winningCombos.some(combo => {
        return combo.every(index => board[index] === marker);
    });
};

// Playing 5 Rounds

    const playRound = (index)=> {
        if(gameOver) return;

        const board = gameBoard.getBoard();
        if (board[index] !== "") return;

        gameBoard.placeMark(index,currentPlayer.point);

         if (checkWin()) {
        gameOver = true;
        currentPlayer.increasePoint();

        if ( currentPlayer.getScore() === 5){

            //alert(`${currentPlayer.name} reached 5 points Start a New Game`);

            const winnerName = currentPlayer.name;

            setTimeout(() => {
            player1 = createPlayer(player1.name,"X");
            player2 = createPlayer(player2.name,"O");

            currentPlayer = player1;
            gameOver = false;
            gameBoard.resetBoard();
            updateBoard();
            updateInfo("New match started");
        },2000);
        return `${winnerName} wins the Match !`;
    }
}
    const newBoard = gameBoard.getBoard();
       if (newBoard.every(cell => cell !== "")) {
        gameOver = true;
        return "Tie!";
    }
    
    switchPlayer();
    };

const getCurrentPlayer = () => {
    return currentPlayer? currentPlayer.name : "";
};

//Display Scores

const getScores = () => {

    if(!player1 || !player2){
return {
    
    player1Name: "",
    player2Name: "",
    player1Score: 0,
    player2Score: 0
    };
}
return {
    player1Name : player1.name,
    player2Name : player2.name,
    player1Score : player1.getScore(),
    player2Score : player2.getScore(),
};
};

//Restart game 
const restartGame = () => {
    gameBoard.resetBoard();
    gameOver = false;
    currentPlayer = player1;
};

    return {
    startGame,
    playRound,
    getCurrentPlayer,
    getScores,
    restartGame
    }
}) ();


const displayController = (() =>{

    let gameStarted = false;
  
    const startBtn = document.getElementById("startGame");
    const name1Input = document.getElementById("player1name");
    const name2Input = document.getElementById("player2name");
    const setupDiv = document.querySelector(".setup");
    const boardDiv = document.querySelector(".board");
    const statusDiv = document.querySelector(".status");
    const scoreDiv = document.querySelector(".score");
    const restartBtn = document.getElementById("restart");
    const changePlayerBtn = document.getElementById("change_players");

    startBtn.addEventListener("click" , () =>{
    const name1 = name1Input.value;
    const name2 = name2Input.value;

    gameController.startGame(name1,name2);

    setupDiv.style.display = "none";
    gameBoard.resetBoard();
    updateBoard();
    updateInfo();
    gameStarted = true;
});



    //Create 9 cells
    const createBoard = () => {
        boardDiv.innerHTML = "";

        for(let i =0 ; i<9 ; i++){

            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;
            boardDiv.appendChild(cell);
        }
    };

    //Update Board Display

    const updateBoard = () => {
        const board = gameBoard.getBoard();
        const cells = document.querySelectorAll(".cell");


        cells.forEach((cell,index) =>{
            cell.textContent = board[index];
        });
    };

//Update Status and Scores

    const updateInfo = (message) => {
        statusDiv.textContent = message || `Current Player: ${gameController.getCurrentPlayer()}`;

        const score = gameController.getScores();
        scoreDiv.textContent = 
        `${score.player1Name} : ${score.player1Score} | ${score.player2Name} : ${score.player2Score}`;
        };

        
//Handle Click

    const handleClick = (e) => {

        if (!gameStarted) return;
        if(!e.target.classList.contains("cell")) return;

        const index = e.target.dataset.index;
        const result = gameController.playRound(index);

        updateBoard();
        updateInfo(result);
        console.log("clicked");
    };


//Restart Button

    restartBtn.addEventListener("click" ,() => {
        gameController.restartGame();
        updateBoard();
        updateInfo();
    });



// Initialize  
    boardDiv.addEventListener("click", handleClick);
    createBoard();
    updateInfo();


//Change the Players for New Game

    changePlayerBtn.addEventListener("click", () =>{
        gameStarted = false;

        setupDiv.style.display = "block";

        gameController.resetGame();
        updateBoard();

        statusDiv.textContent = "";
        scoreDiv.textContent = "";
    });

})();