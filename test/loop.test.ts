import { Game } from '../src'

describe('Loop test suite', function() {
    it('Basic loop', function() {
        const game = new Game(() => {
        })
        const loopManager = game.getContext().loopManager
        loopManager.getRegistrar().loop(1, 5, function(index) {
            console.log(index)
        })
    })
})