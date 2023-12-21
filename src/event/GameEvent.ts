/**
 * Game event.
 */
export abstract class GameEvent<D extends GameEventData = {}> {
    /**
     * Creates a game event.
     * @param eventData Game event data to bind.
     */
    public constructor(
        private readonly eventData: Partial<D> = {},
    ) {
    }

    /**
     * Gets the value of an event data entry.
     * @param key The key of the event data entry to get.
     * @throws GameEventDataIsNullException if the game event data is null.
     * @throws GameEventKeyNotExistException if the key does not exist.
     */
    public getValue<K extends keyof D>(key: K): D[K] {
        if (this.eventData == null) {
            throw new GameEventDataIsNullException(this.getType())
        }

        if (!(key in this.eventData)) {
            throw new GameEventKeyNotExistException(key.toString())
        }

        return this.eventData[key]!
    }

    /**
     * Checks if this is an instance of a given game event class.
     * @param cls A subclass of the game event class.
     */
    public is(cls: GameEventClass): boolean {
        return this instanceof cls
    }

    /**
     * Returns the type of this game event.
     */
    public getType(): GameEventClass<D, this> {
        return Object.getPrototypeOf(this).constructor
    }
}

/**
 * Game event data is some extra data that comes along with a game event.
 */
export type GameEventData = {
    readonly [key: string]: unknown
}

/**
 * A game event class or subclass.
 */
export type GameEventClass<
    D extends GameEventData = any,
    T extends GameEvent<D> = GameEvent<D>
> = new (eventData: Partial<D>) => T

/**
 * Thrown when user wants to get a value from the game event data when it is null.
 */
export class GameEventDataIsNullException extends Error {
    public constructor(gameEventType: GameEventClass) {
        super(`The game event data is null in: ${gameEventType.name}`)
    }
}

/**
 * Thrown when user wants to get a value but the key associated does not exist.
 */
export class GameEventKeyNotExistException extends Error {
    public constructor(key: string) {
        super(`The key does not exist in the game event data: ${key}`)
    }
}