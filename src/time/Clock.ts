import { TimeUtil } from './TimeUtil'

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
    private expectedNextTime: number = 0

    /**
     * Timeout handler.
     * @private
     */
    private timeoutHandler?: NodeJS.Timeout

    /**
     * Creates a clock.
     * @param callback The callback function.
     * @param fps Frame per seconds.
     */
    public constructor(
        private readonly callback: () => void,
        private fps: number = 30,
    ) {
        this.startTime = TimeUtil.now()
    }

    /**
     * Makes this clock run. The callback will be called immediately.
     */
    public run(): void {
        this.callback()

        this.expectedNextTime = TimeUtil.now()
        this.autoSetTimeoutHandler()
    }

    private autoSetTimeoutHandler() {
        this.timeoutHandler = this.getTimeout()
    }

    private getTimeout(delayMs: number = 1000 / this.fps): NodeJS.Timeout {
        // Simple frame stabilization algorithm
        const realDelayMs: number = delayMs - (TimeUtil.now() - this.expectedNextTime)
        this.expectedNextTime = TimeUtil.now() + delayMs

        return setTimeout(() => {
            this.callback()
            this.autoSetTimeoutHandler()
        }, realDelayMs)
    }
}