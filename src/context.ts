import { Game } from './game'
import { GameEventManager } from './event/GameEventManager'
import { FrameBasedLoopManager } from './time/FrameBasedLoopManaegr'

/**
 * Game context.
 */
export class Context<D extends ContextData = {}> {
    /**
     * Context data.
     * @private
     */
    private readonly data: D = {} as D

    /**
     * Whether the game is running.
     */
    public isRunning: boolean = false

    /**
     * Game event manager.
     * @private
     */
    public readonly eventManager = new GameEventManager()

    /**
     * Frame based Loop manager.
     * @private
     */
    public readonly loopManager = new FrameBasedLoopManager()

    /**
     * Creates a game context.
     * @param game The game.
     */
    public constructor(public readonly game: Game) {
    }

    /**
     * Returns this, but changes the context data type.
     */
    public be<CD extends ContextData>(): Context<CD> {
        return this as unknown as Context<CD>
    }

    /**
     * Gets a value of a specific key.
     * @param key THe key associated with the value.
     */
    public getValue<K extends keyof D>(key: K): D[K] {
        return this.data[key]
    }

    /**
     * Sets a value for a specific key.
     * @param key The key associated with the value.
     * @param value The new value to set.
     */
    public setValue<K extends keyof D>(key: K, value: D[K]): void {
        this.data[key] = value
    }
}

/**
 * Game context data.
 */
export type ContextData = {
    [key: string]: unknown
}