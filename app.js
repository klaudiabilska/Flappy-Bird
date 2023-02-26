import { updateBird, setupBird, getBirdRect } from './bird.js'
import { updatePipes, setupPipes, getPassedPipesCount, getPipesRects } from './pipe.js'

document.addEventListener("keypress", handleStart, { once: true})
const title = document.querySelector("[data-title]")
const subtitle = document.querySelector("[data-subtitle]")


let lastTime
function updateLoop(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(updateLoop)
        return
    }
    const delta = time - lastTime
    updateBird(delta)
    updatePipes(delta)
    if (checkLose()) return handleLose()
    lastTime = time
    window.requestAnimationFrame(updateLoop)
    document.getElementById("current-score-value").textContent = getPassedPipesCount()

}

function checkLose() {
    const birdRect = getBirdRect()
    const insidePipe = getPipesRects().some(rect => isCollision(birdRect, rect))
    const outsideWorld = birdRect.top < 0 || birdRect.bottom > window.innerHeight
    return outsideWorld || insidePipe
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )
}

//start game
function handleStart () {
    // ukrywa sie tytuł po keypress
    title.classList.add("hide")
    setupBird()
    setupPipes()
    lastTime = null
    window.requestAnimationFrame(updateLoop)
    const highScore = localStorage.getItem("highScore") || 0;
document.getElementById("high-score-value").textContent = highScore;
    
const birdElem = document.querySelector('[data-bird]')
    birdElem.setAttribute('src', './images/birddown.png')




}




function handleLose() {
    const birdElem = document.querySelector('[data-bird]')
    birdElem.setAttribute('src', './images/birddead.png')
    
    setTimeout(() => {
        title.classList.remove("hide")
        subtitle.classList.remove("hide")
        if (getPassedPipesCount() >= 25) {
            subtitle.textContent = `WOW! TEACH ME MASTER! You passed ${getPassedPipesCount()} pipes`
        } else if (getPassedPipesCount() >= 10) {
            subtitle.textContent = `WOW! Nice! You passed ${getPassedPipesCount()} pipes`
        } else {
            subtitle.textContent = `Do better next time! You passed ${getPassedPipesCount()} pipes`
        };
        
       
        // update high score
        const currentScore = getPassedPipesCount()
        let highScore = localStorage.getItem("highScore")
        if (highScore == null || currentScore > highScore) {
            highScore = currentScore
            localStorage.setItem("highScore", highScore)
            // add new record pop-up
            const newRecordPopup = document.createElement("div")
            newRecordPopup.classList.add("popup")
            newRecordPopup.textContent = "New Record!"
            document.body.appendChild(newRecordPopup)
            setTimeout(() => {
                newRecordPopup.remove()
            }, 2000)
        }
        document.getElementById("high-score-value").textContent = highScore
        
        document.addEventListener("keypress", handleStart, { once: true })
    }, 500)
}



