const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
const START_POS = {x: 90, y: 90};
let SNAKE_LENGTH = 0;

const snake = document.querySelector('#snake');
const score = document.querySelector('#score');

let curDir = LEFT_KEY;
let disabledDir = [LEFT_KEY, RIGHT_KEY];

let gameState = "end";
let gameStart;
let scorePoint = 0;

const elmPos = [
    {
        x: 90,
        y: 90,
    },
]

function disabledDirection () {
    if(curDir === LEFT_KEY) {
        return [LEFT_KEY, RIGHT_KEY];
    }

    if(curDir === RIGHT_KEY) {
        return [LEFT_KEY, RIGHT_KEY];
    }

    if(curDir === UP_KEY) {
        return [UP_KEY, DOWN_KEY]
    }

    if(curDir === DOWN_KEY) {
        return [UP_KEY, DOWN_KEY]
    }
}

function goRight (x,y) { 
 snake.style.transform = `translate(${x + 10}px, ${y}px)`
 
 return {x: x + 10, y}
}

function goLeft (x,y) {
  snake.style.transform = `translate(${x - 10}px, ${y}px)`;
   return {x: x - 10, y}
}

function goUp (x, y) {
  snake.style.transform = `translate(${x}px, ${y - 10}px)`;
   return {x, y: y - 10}
}

function goDown (x, y) {
  snake.style.transform = `translate(${x}px, ${y + 10}px)`;
   return {x, y: y + 10}
}

let foodPos = null;
let lastElmPos;

function getFood() {

    if(foodPos !== null) {
        return;
    }

    const random = Math.floor(Math.random() * 18) * 10;

    const food = document.createElement('div');
    food.id = "food";
    food.style.cssText += `
        width: 10px;
        height: 10px;
        background-color: #000;
        position: absolute;
        border: 0.5px solid #fff;
        transform: translate(${random}px, ${random}px);
    `

    board.appendChild(food);
    foodPos = {x: random, y: random};
}

function afterFoodEaten() {

    const food = document.getElementById('food');

    if(!food) {
        return;
    }

    food.remove();

    attachTail(lastElmPos.x, lastElmPos.y, elmPos.length);

    scorePoint += 1;
    score.innerHTML = scorePoint;
    foodPos = null;

}

document.addEventListener('keydown', (e) => {
    lastElmPos = elmPos[elmPos.length - 1];
    if(e.key === "S" || e.key === "s") {
        elmPos[0] = START_POS;
        gameState = "start";
        startGame();
    }

    if(e.key === "P" || e.key === "p") {
        if(gameState === "start") {
            gameState = "pause";
            clearInterval(gameStart);
            return;
        }

        if(gameState === "pause") {
            gameState = "start";
            startGame();
            return;
        }

    }

    if(gameState !== "start" || disabledDir.includes(e.key)) {
        return;
    }

    snakeMovement(e.key);
  
})

function followHead(tail, tailPos) {
    tail.style.transform = `translate(${tailPos.x}px, ${tailPos.y}px)`;
}

function updatePosition (n) {
    if(n === 0) {
        return;
    }

    let firstPos = elmPos[0];
    let secondPos;

    for(i = 0; i < n; i++) {
        
        secondPos = elmPos[i+1];
        elmPos[i + 1] = firstPos;
        firstPos = secondPos;
    }
}


function updateTailPosInUI(n) {
    if(n === 0) {
        return;
    }

    for(i = 0; i < n; i++) {
        const tail = document.getElementById(`tail${i + 1}`);
        followHead(tail, elmPos[i + 1]);
    }
}

function attachTail(x, y, n) {
    const tail = document.createElement('div');
        tail.id = "tail" + n;
        tail.style.cssText += `
            width: 10px;
            height: 10px;
            background-color: #000;
            position: absolute;
            border: 0.5px solid #fff;
            transform: translate(${x}px, ${y}px);
        `

    board.appendChild(tail);
    elmPos.push({x,y});
    SNAKE_LENGTH += 1;
}




function startGame() {
    gameStart = setInterval(() => {
        lastElmPos = elmPos[elmPos.length - 1];
        getFood();
        snakeMovement(curDir);
    }, 1000);    
}

function gameOver() {
    clearInterval(gameStart);
    alert('Game is Over')
}

function snakeMovement(event) {

    switch(event) {
        case LEFT_KEY: {
            if(elmPos[0].x === 0) {
                gameOver();
                return;
              }
        
              updatePosition(SNAKE_LENGTH)
              elmPos[0] = goLeft(elmPos[0].x, elmPos[0].y);
              updateTailPosInUI(SNAKE_LENGTH)
            curDir = LEFT_KEY;
            disabledDir = disabledDirection(LEFT_KEY);
            if(elmPos[0]?.x === foodPos?.x && elmPos[0]?.y === foodPos?.y) {
                afterFoodEaten();
            }
            return;
          }
        case RIGHT_KEY : {
            if(elmPos[0].x === 180) {
              gameOver();
             return ;
           }
           
           updatePosition(SNAKE_LENGTH)
           elmPos[0] = goRight(elmPos[0].x, elmPos[0].y);
           updateTailPosInUI(SNAKE_LENGTH)
            curDir = RIGHT_KEY;
            disabledDir = disabledDirection(RIGHT_KEY);
            if(elmPos[0]?.x === foodPos?.x && elmPos[0]?.y === foodPos?.y) {
                afterFoodEaten();
            }
            return;
        
        }
          
        case UP_KEY: {
              if(elmPos[0].y === 0) {
                gameOver();
                return;
              }
              
              updatePosition(SNAKE_LENGTH)
              elmPos[0] = goUp(elmPos[0].x, elmPos[0].y);
              updateTailPosInUI(SNAKE_LENGTH)
              curDir = UP_KEY;
              disabledDir = disabledDirection(UP_KEY);
              if(elmPos[0]?.x === foodPos?.x && elmPos[0]?.y === foodPos?.y) {
                afterFoodEaten();
              }
              return;
          }
          
          
         case DOWN_KEY : {
             if(elmPos[0].y === 180) {
                gameOver();
               return ;
             }
             
             updatePosition(SNAKE_LENGTH)
             elmPos[0] = goDown(elmPos[0].x, elmPos[0].y);
             updateTailPosInUI(SNAKE_LENGTH)
             curDir = DOWN_KEY;
             disabledDir = disabledDirection(DOWN_KEY);
             if(elmPos[0]?.x === foodPos?.x && elmPos[0]?.y === foodPos?.y) {
                afterFoodEaten();
            }
             return;
          }

        default:
            return;
          
    }

}