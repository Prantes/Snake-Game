const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i")



let gameOver = false;
let foodX, foodY;
let snakeX = 5 , snakeY =10;
let snakeBody = [];
let velocityX  = 0, velocityY = 0;
let setIntervalId;
let score = 0;
//Pega a pontuação mais alta armazenada no Local Storage
let highScore = localStorage. getItem("high-score") || 0 ;
highScoreElement.innerText = `High Score: ${highScore}`;


const changeFoodPosition = () =>{

    foodX = Math.floor(Math.random()* 30) + 1;
    foodY = Math.floor(Math.random()* 30) + 1;
}

const handleGameOver = () =>{
    // Limpa o Timer e recarrega a página de Game Over
    clearInterval(setIntervalId);
    alert("Fim de Jogo ! Aperte Ok para reiniciar...");
    location.reload();

}



// Muda o valor da velocidade baseado nas teclas precionadas 
const changeDirection = (e) => {
    if(e.key === "ArrowUp" && velocityY != 1 ){
        velocityX =0;
        velocityY =-1;
    }else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX =0;
        velocityY =1;
    }else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX =-1;
        velocityY =0;
    }else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX =1;
        velocityY =0;
    }
}

controls.forEach(key =>{

    //muda a direção clicando nos controles setados 
    key.addEventListener("click",()=> changeDirection({key:key.dataset.key }));
});


const initGame = () =>{
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`;
    
    //Verificar se a cobra acertou a comida 
    if(snakeX===  foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // Pega a posição da comida e transfere para o corpo da cobra 
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1 ; i > 0; i--) {

        //avançando os valores dos elementos de dentro do corpo da cobra em um 
        snakeBody[i] = snakeBody [i - 1  ];
    }

    snakeBody[0]= [snakeX, snakeY]; //fixa o primeiro elemento do corpo da cobra para a atual posição

    // Atualizar a velocidade de cobra baseado em sua velocidade
    snakeX+=velocityX;
    snakeY+=velocityY;


    //Checa se a cabeça da cobra foi para fora das paredes, caso sim gameOver se torna = TRUE
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    
    for (let i = 0; i < snakeBody.length; i++) {

        //adiciona uma div para a comida   ao corpo da cobra 
        htmlMarkup += `<div class="head" style="grid-area:${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
        // Confere se a cabeça da cobra tocou no corpo, se tocou será declarado Game Over
        if(i !== 0 && snakeBody[0][1]=== snakeBody[i][1] && snakeBody[0][0]=== snakeBody[i][0]){
            gameOver = true;
        }
    }
            


    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();

setIntervalId = setInterval (initGame, 125);

document.addEventListener("keydown", changeDirection);