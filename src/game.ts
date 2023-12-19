import { float } from './types'
import { Clock } from './time/Clock'
import { Context, ContextData } from './context'

export class Game {
    /**
     * Game context.
     * @private
     */
    private readonly context: Context = new Context(this)

    /**
     * Creates a game.
     * @param gameLoopCallback
     */
    public constructor(
        private readonly gameLoopCallback: gameLoopCallback,
    ) {
    }

    /**
     * Runs the game.
     */
    public run(fps: float = 30) {
        new Clock((fps: float) => {
            this.executeFrame(fps)
        }, fps).run()
    }

    /**
     * Executes one frame.
     * @param deltaTime The delta time of the current frame.
     */
    public executeFrame(deltaTime: float) {
        // Dealing with events
        while (this.context.eventManager.handleNext(this.context)) {
        }

        // Update the loop manager
        this.context.loopManager.update(deltaTime)

        // Invoke the game loop callback
        this.gameLoopCallback(deltaTime)
    }

    /**
     * Returns the game context.
     */
    public getContext<D extends ContextData = {}>(): Context<D> {
        return this.context.be<D>()
    }
}

export type gameLoopCallback = (fps: float) => float | void

/**
 * Classes implementing this will be updated in every frame.
 */
export interface FrameUpdatable {
    update(deltaTime: float): void
}