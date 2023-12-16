import { float } from './types'
import { GameEventManager } from './event/GameEventManager'
import { FrameBasedLoopManager } from './time/FrameBasedLoopManaegr'
import { Clock } from './time/Clock'

export class Game {
    /**
     * Game event manager.
     * @private
     */
    private readonly eventManager = new GameEventManager()

    /**
     * Frame based Loop manager.
     * @private
     */
    private readonly loopManager = new FrameBasedLoopManager()

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
        const clockCallback = (deltaTime: float) => {
            // Dealing with events
            while (this.eventManager.handleNext()) {
                this.eventManager.handleNext()
            }

            // Update the loop manager
            this.loopManager.update(deltaTime)
        }
        const clock = new Clock(clockCallback, fps)

        clock.run()
    }
}

export type gameLoopCallback = (fps: float) => float

/**
 * Classes implementing this will be updated in every frame.
 */
export interface FrameUpdatable {
    update(deltaTime: float): void
}