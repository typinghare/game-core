import { CallbackQueue, Game } from '../src'

const game = new Game(() => {
})
const loopManager = game.getContext().loopManager
const fn0 = () => loopManager.getRegistrar().onceMethodical(1, 5, function(frame) {
    console.log(frame)
})
const fn1 = () => loopManager.getRegistrar().delayMethodical(3000)
const fn2 = () => {
    console.log('After 3 seconds delay.')
}

CallbackQueue.start([fn0, fn1, fn2])

game.run()
console.log("Game run")