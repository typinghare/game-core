import { Context, ContextData, Game, GameBeginEvent } from '../src'

describe('Context test suite', function() {
    interface MyContextData extends ContextData {
        onSite: boolean
        salary: number
    }

    const callback = () => {
    }

    it('Context data', function() {
        const game = new Game(callback)
        const context = game.getContext()
        context.be<MyContextData>().setValue('salary', 5000)
        expect(context.be<MyContextData>().getValue('salary')).toBe(5000)

        context.be<MyContextData>().setValue('onSite', true)
        context.be<MyContextData>().setValue('onSite', false)
        expect(context.be<MyContextData>().getValue('onSite')).toBe(false)
    })

    it('Game event', function() {
        const game = new Game(callback)
        const context: Context<MyContextData> = game.getContext()
        context.setValue('onSite', true)
        context.setValue('salary', 5000)

        const eventManager = context.eventManager
        eventManager.addHandler<any, MyContextData>(GameBeginEvent, function() {
            this.setValue('onSite', false)
            this.setValue('salary', 6000)
        })

        eventManager.trigger(new GameBeginEvent())
        game.executeFrame(0)

        expect(context.getValue('onSite')).toBe(false)
        expect(context.getValue('salary')).toBe(6000)
    })
})