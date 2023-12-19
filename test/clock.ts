import { float, Game, GameEndEvent } from '../src/'

let frames = 0
let elapsedTime = 0
const game = new Game(function(deltaTime: float) {
    elapsedTime += deltaTime
    console.log(`Elapsed time: ${elapsedTime}`)
    console.log(`Frames: ${++frames}`)

    if (frames == 10) {
        game.getContext().eventManager.trigger(new GameEndEvent())
    }
})

game.run()