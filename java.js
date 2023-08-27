const canvas = document.querySelector('canvas');

const score = document.querySelector('.score--value');
const finalScore = document.querySelector('.final-score > span');
const menu = document.querySelector('.menu--screan');
const buttonPlay = document.querySelector('.btn-play');


const ctx = canvas.getContext('2d')

const audio = new Audio('audio.mp3')

const initialPosition = {x:270 , y:240}

const size = 30;

let  sanake = [initialPosition]

const incrementScore = () => {
    score.innerText = parseInt(score.innerText) + 1
}

const randonNumber = (min , max) =>{
    return Math.round (Math.random() * (max - min) + min)
}

const randonPosition = () =>{
    const number = randonNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randonNumber (0 , 255)
    const green = randonNumber (0 , 30)
    const blue = randonNumber (0 , 245)

    return`rgb(${red}, ${green}, ${blue})`

}



const food = {
    x:randonPosition(),
    y:randonPosition(),
    color: randomColor()
}






let direction

let loopId



const drawFood = () => {

    const{ x, y, color} = food


    ctx.shadowColor = color
    ctx.shadowBlur = 12
    ctx.fillStyle = color
    ctx.fillRect (x, y, size, size);
    ctx.shadowBlur = 0
}

const drawSnake = ()  => {
    ctx.fillStyle = "#ddd";



    sanake.forEach((position , index) =>{

        if(index == sanake.length -1 ){
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x , position.y , size , size)
    })
    
}

const movesnake = () => {

    if(!direction) return
    const head = sanake[sanake.length -1]

    if (direction == "right"){
        sanake.push({x:head.x + size, y:head.y })

    }


    if (direction == "left"){
        sanake.push({x:head.x - size, y:head.y })

    }

    if (direction == "down"){
        sanake.push({x:head.x, y:head.y + size })

    }

    if (direction == "up"){
        sanake.push({x:head.x, y:head.y - size })

    }











    sanake.shift()
}

const drawGrid = () =>{
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"


    for (let i = 30; i < canvas.width; i +=30) {

        ctx.beginPath()
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke()


        ctx.beginPath()
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke()

    } 
}

const cheakEat = () =>{
    const head = sanake[sanake.length -1]

    if (head.x == food.x && head.y == food.y){
        incrementScore()
        sanake.push(head)
        audio.play()


        let x = randonPosition()
        let y = randonPosition()
        

        while (sanake.find((position) => position.x == x && position.y == y )){

               x = randonPosition()
               y = randonPosition()
        

        }

        food.x = x
        food.y = y
        food.color = randomColor()

    }



}

const cheakCollision = () => {
    const head = sanake[sanake.length -1]
    const canvasLimit = canvas.width - size

    const neckIndex = sanake.length -2



    const wallCollision = head.x < 0 || head.x > 570 || head.y < 0 || head.y > 570

    const selfCollision = sanake.find((position , index) =>{
        return index < neckIndex && position.x == head.x && position.y == head.y

    })

    if (wallCollision || selfCollision){
       gameOver()
    }



}

const gameOver = () =>{
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(7px)"

}

const gameLoop = () =>{

    clearInterval(loopId);
    
    ctx.clearRect(0,0,600,600);
    drawFood()
    drawGrid()
    movesnake()
    drawSnake()
    cheakEat()
    cheakCollision()


        loopId = setTimeout(() =>{
         gameLoop()

    },200);

}

gameLoop()


document.addEventListener("keydown", ({key})  => {

    if (key == "ArrowRight"  && direction != "left") {
        direction = "right"
    }


    if (key == "ArrowLeft"  && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown"  && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp"  && direction != "down") {
        direction = "up"
    }


    
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    sanake = [initialPosition]



})





