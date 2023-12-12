import { GameEvent, GameEventClass, GameEventData } from './GameEvent'
import { Queue } from '@typinghare/stack-queue'

/**
 * Event manager.
 */
export class GameEventManager {
    /**
     * A queue of emitted game events.
     * @private
     */
    private readonly eventQueue: Queue<GameEvent<any>> = new Queue()

    /**
     * A map from game event types to handler lists.
     * @private
     */
    private readonly handlerListMap: Map<GameEventClass<any>, GameEventHandler<any>[]> = new Map()

    /**
     * Checks if there are events in the queue.
     */
    public hasNext(): boolean {
        return !this.eventQueue.empty()
    }

    /**
     * Returns the next game event.
     */
    public getNext<E extends GameEvent = GameEvent>(): E {
        return this.eventQueue.dequeue() as unknown as E
    }

    /**
     * Dequeues the next event and handle it.
     */
    public handleNext(): boolean {
        if (!this.hasNext()) {
            return false
        }

        this.handle(this.getNext())

        return true
    }

    public handle<D extends GameEventData = any>(gameEvent: GameEvent<D>): void {
        const handlerList: GameEventHandler<any>[] = this.getHandlerList(gameEvent.getType())
        for (const handler of handlerList) {
            handler(gameEvent)
        }
    }

    /**
     * Triggers a game event.
     * @param gameEvent The game event to trigger.
     */
    public trigger<D extends GameEventData>(gameEvent: GameEvent<D>): void {
        this.eventQueue.enqueue(gameEvent)
    }

    /**
     * Adds a new event handler for a specific game event type.
     * @param gameEventType The type of the game event for which the handler is being added.
     * @param handler The event handler function to be invoked when the specified game event occurs.
     */
    public addHandler<D extends GameEventData>(
        gameEventType: GameEventClass<D>,
        handler: GameEventHandler<D>,
    ): void {
        const handlerList: GameEventHandler<D>[] = this.getHandlerList(gameEventType)
        if (!this.handlerListMap.has(gameEventType)) {
            this.handlerListMap.set(gameEventType, handlerList)
        }

        handlerList.push(handler)
    }

    /**
     * Gets the handler list of a specific game event.
     * @param gameEventType The type of the game event.
     */
    public getHandlerList<D extends GameEventData>(gameEventType: GameEventClass<D>): GameEventHandler<D>[] {
        return this.handlerListMap.get(gameEventType) || []
    }
}

/**
 * Game event handler.
 */
export type GameEventHandler<D extends GameEventData> = (gameEvent: GameEvent<D>) => void