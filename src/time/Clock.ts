import { TimeUtil } from './TimeUtil'
import { float } from '../types'

/**
 * Game clock.
 */
export class Clock {
    /**
     * Start time timestamp.
     */
    private readonly startTime: number

    /**
     * Previous ticking timestamp.
     * @private
     */
    private previousTime: number = 0

    /**
     * Previous delay milliseconds.
     * @private
     */
    private previousDelayMs: number = 0

    /**
     * Timeout handler.
     * @private
     */
    private timeoutHandler?: NodeJS.Timeout

    /**
     * Whether this clock has stopped.
     * @private
     */
    private hasStopped: boolean = false

    /**
     * Creates a clock.
     * @param callback The callback function.
     * @param fps Frame per seconds.
     */
    public constructor(
        private readonly callback: ClockCallback,
        private fps: number = 30,
    ) {
        this.startTime = TimeUtil.now()
    }

    /**
     * Makes this clock run. The callback will be called immediately.
     */
    public run(): void {
        this.previousTime = TimeUtil.now()
        this.autoSetTimeoutHandler()
    }

    /**
     * Stops this clock.
     */
    public stop(): void {
        this.hasStopped = true

        if (this.timeoutHandler) {
            clearInterval(this.timeoutHandler)
        }
    }

    private autoSetTimeoutHandler() {
        if (!this.hasStopped) {
            this.timeoutHandler = this.getTimeout()
        }
    }

    private getTimeout(delayMs: number = 1000 / this.fps): NodeJS.Timeout {
        // Simple frame stabilization algorithm
        const deltaTime: float = TimeUtil.now() - this.previousTime
        const realDelayMs: number = delayMs - (deltaTime - this.previousDelayMs)
        this.previousTime = TimeUtil.now()
        this.previousDelayMs = delayMs

        return setTimeout(() => {
            this.callback(deltaTime)
            this.autoSetTimeoutHandler()
        }, realDelayMs)
    }
}

/**
 * Clock callback.
 */
export type ClockCallback = (deltaTime: float) => void