import { float, int } from '../types'
import { FrameUpdatable } from '../game'

/**
 * A frame-based loop that triggers a callback at specified intervals.
 */
export class FrameBasedLoop implements FrameUpdatable {
    /**
     * Time in milliseconds for one frame.
     * @private
     */
    private readonly msPerFrame: float

    /**
     * Time elapsed.
     * @private
     */
    private elapsedMs: int = 0

    /**
     * Current frame index.
     * @private
     */
    private currentFrame: int = -1

    /**
     * Whether this loop is paused
     * @private
     */
    private paused: boolean = false

    /**
     * Creates a loop.
     * @param framesPerSecond Frames per second.
     * @param framesPerPeriod Frames per period.
     * @param callback Frames per second and frames per period.
     */
    public constructor(
        framesPerSecond: float,
        private readonly framesPerPeriod: int,
        private readonly callback: FrameBasedLoopCallback,
    ) {
        this.msPerFrame = 1000 / framesPerSecond
    }

    /**
     * Update the frame-based loop. The callback is triggered at each frame.
     * @param deltaTime The time elapsed since the last update.
     */
    public update(deltaTime: float) {
        if (this.paused) {
            return
        }

        this.elapsedMs += deltaTime
        if (this.elapsedMs < (1 + this.currentFrame) * this.msPerFrame) {
            return
        }

        this.currentFrame++
        if (this.currentFrame >= this.framesPerPeriod) {
            this.reset()
        }

        this.callback(this.currentFrame)
    }

    /**
     * Resets this loop.
     */
    public reset() {
        this.elapsedMs = 0
        this.currentFrame = 0
    }
}

export type FrameBasedLoopCallback = (frame: int) => void