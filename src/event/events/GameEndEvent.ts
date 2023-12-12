import { GameEvent } from '../GameEvent'

/**
 * Game end event is emitted when the game ends.
 */
export class GameEndEvent extends GameEvent<GameEndEventData> {
    public constructor(eventData: Partial<GameEndEventData> = {}) {
        super({
            exitCode: ExitCode.SUCCESS,
            ...eventData,
        })
    }
}

/**
 * Game end event data.
 */
export type GameEndEventData = {
    // Exit code
    exitCode: number
}

/**
 * Game exit code.
 */
export enum ExitCode {
    SUCCESS = 0,
    FAILURE = 1
}