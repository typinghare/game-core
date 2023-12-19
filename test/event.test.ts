import { ExitCode, Game, GameBeginEvent, GameEndEvent, GameEventManager, Context } from '../src'

describe('Game event test suite', function() {
    it('Create game event', function() {
        const gameStartEvent = new GameBeginEvent()
        expect(gameStartEvent.is(GameBeginEvent)).toBe(true)
        expect(gameStartEvent.is(GameEndEvent)).toBe(false)
    })

    it('Test getValue() method', function() {
        const gameEndEvent = new GameEndEvent()
        expect(gameEndEvent.getValue('exitCode')).toBe(ExitCode.SUCCESS)
    })
})

describe('Game event manager test suite', function() {
    const context: Context = new Game(() => {}).getContext()

    it('Test event queue', function() {
        const gameEventManager = new GameEventManager()
        const gameEvent = new GameBeginEvent()
        gameEventManager.trigger(gameEvent)

        const nextGameEvent = gameEventManager.getNext()
        expect(nextGameEvent).toBe(gameEvent)
    })

    it('Test handler list', function() {
        const gameEventManager = new GameEventManager()
        let testNumber = 0
        gameEventManager.addHandler(GameBeginEvent, function() {
            testNumber++
        })

        // Trigger the game begin event
        gameEventManager.trigger(new GameBeginEvent())

        // Handle the next event
        gameEventManager.handleNext(context)

        expect(testNumber).toBe(1)
    })

    it('Test handler list with event data', function() {
        const gameEventManager = new GameEventManager()
        let testExitCode = -1
        gameEventManager.addHandler(GameEndEvent, function(gameEvent) {
            testExitCode = gameEvent.getValue('exitCode')
        })

        gameEventManager.trigger(new GameEndEvent({ exitCode: ExitCode.FAILURE }))
        gameEventManager.handleNext(context)

        expect(testExitCode).toBe(1)
    })
})