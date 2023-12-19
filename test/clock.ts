import { float, Game } from '../src/'

let frames = 0
let elapsedTime = 0
new Game(function(deltaTime: float) {
    elapsedTime += deltaTime
    console.log(`Elapsed time: ${elapsedTime}`)
    console.log(`Frames: ${++frames}`)
}).run()