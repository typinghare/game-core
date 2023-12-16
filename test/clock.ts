import { Clock, float } from '../src/'

let frames = 0
let elapsedTime = 0
const clock = new Clock(function(deltaTime: float) {
    elapsedTime += deltaTime
    console.log(`Elapsed time: ${elapsedTime}`)
    console.log(`Frames: ${++frames}`)
})

clock.run()