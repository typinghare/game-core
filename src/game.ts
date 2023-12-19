import { float } from './types'
import { Clock } from './time/Clock'
import { Context, ContextData } from './context'
import { GameEndEvent } from './event/events'

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
        // Set isRunning to false when the Game End event is triggered
        this.context.eventManager.addHandler(GameEndEvent, function() {
            this.isRunning = false
        })
    }

    /**
     * Runs the game.
     */
    public run(fps: float = 30) {
        this.context.isRunning = true

        const clock = new Clock((fps: float) => {
            if (!this.context.isRunning) {
                clock.stop()
            } else {
                this.executeFrame(fps)
            }
        }, fps)

        clock.run()
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

/**
 * Game loop callback.
 */
export type gameLoopCallback = (fps: float) => float | void

/**
 * Classes implementing this will be updated in every frame.
 */
export interface FrameUpdatable {
    update(deltaTime: float): void
}