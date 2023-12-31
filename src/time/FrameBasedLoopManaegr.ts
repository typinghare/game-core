import { FrameBasedLoop, FrameBasedLoopCallback } from './FrameBasedLoop'
import { float, int } from '../types'
import { FrameUpdatable } from '../game'
import { CallbackNode } from '../methodical'

/**
 * Frame-based Loop manager.
 */
export class FrameBasedLoopManager implements FrameUpdatable {
    /**
     * A set of frame-based loops.
     * @private
     */
    private readonly frameBasedLoopSet: Set<FrameBasedLoop> = new Set()

    /**
     * A set of frame-based loops that are going to be deleted in the next update.
     * @private
     */
    private readonly basedLoopToBeDeletedSet: Set<FrameBasedLoop> = new Set()

    /**
     * Returns a loop registrar.
     */
    public getRegistrar(): FrameBasedLoopRegistrar {
        return new FrameBasedLoopRegistrar(this)
    }

    /**
     * Registers a frame-based loop.
     * @param frameBasedLoop The frame-based loop to register.
     */
    public registerLoop(frameBasedLoop: FrameBasedLoop): FrameBasedLoop {
        this.frameBasedLoopSet.add(frameBasedLoop)

        return frameBasedLoop
    }

    /**
     * Deletes a frame-based loop from the loop set.
     * @param frameBasedLoop The frame-based loop to delete.
     */
    public deleteLoop(frameBasedLoop: FrameBasedLoop): void {
        this.basedLoopToBeDeletedSet.add(frameBasedLoop)
    }

    /**
     * Updates all frame-based loops.
     * @param deltaTime
     */
    public update(deltaTime: float) {
        for (const basedLoopToBeDeleted of this.basedLoopToBeDeletedSet) {
            this.frameBasedLoopSet.delete(basedLoopToBeDeleted)
        }

        for (const frameBasedLoop of this.frameBasedLoopSet) {
            frameBasedLoop.update(deltaTime)
        }
    }
}

/**
 * Frame-based Loop registrar.
 */
export class FrameBasedLoopRegistrar {
    public constructor(
        private loopManager: FrameBasedLoopManager,
    ) {
    }

    /**
     * Registers a loop.
     * @param framesPerSecond Frames per second.
     * @param framesPerPeriod Number of frames per period.
     * @param callback Callback function to be called.
     */
    public loop(
        framesPerSecond: float,
        framesPerPeriod: int,
        callback: FrameBasedLoopCallback,
    ): FrameBasedLoop {
        return this.loopManager.registerLoop(new FrameBasedLoop(framesPerSecond, framesPerPeriod, callback))
    }

    /**
     * Registers a frame-based loop that will be deleted after one period.
     * @param framesPerSecond Frames per second.
     * @param framesPerPeriod Number of frames per period.
     * @param callback Callback function to be called.
     */
    public once(
        framesPerSecond: float,
        framesPerPeriod: int,
        callback: FrameBasedLoopCallback,
    ): FrameBasedLoop {
        const oneShotCallback = (frame: int) => {
            callback(frame)
            if (frame == framesPerPeriod - 1) {
                this.loopManager.deleteLoop(loop)
            }
        }

        const loop = new FrameBasedLoop(framesPerSecond, framesPerPeriod, oneShotCallback)
        return this.loopManager.registerLoop(loop)
    }

    /**
     * Schedules a callback function to be executed after a specified delay.
     * @param delayMs The delay time in milliseconds.
     * @param callback The function to be called after the delay.
     */
    public delay(
        delayMs: int,
        callback: FrameBasedLoopCallback,
    ) {
        const delayCallback = (frame: int) => {
            if (frame == 1) {
                callback(frame)
                this.loopManager.deleteLoop(loop)
            }
        }

        const loop = new FrameBasedLoop(1000 / delayMs, 2, delayCallback)
        return this.loopManager.registerLoop(loop)
    }

    /**
     * Registers a frame-based loop that will be deleted after one period.
     * @param framesPerSecond Frames per second.
     * @param framesPerPeriod Number of frames per period.
     * @param callback
     * @return A callback node to be invoked when the loop ends.
     */
    public onceMethodical(
        framesPerSecond: float,
        framesPerPeriod: int,
        callback: FrameBasedLoopCallback,
    ): CallbackNode {
        const callbackNode = new CallbackNode()
        const oneShotCallback = (frame: int) => {
            callback(frame)
            if (frame == framesPerPeriod - 1) {
                callbackNode.invoke()
                this.loopManager.deleteLoop(loop)
            }
        }

        const loop = new FrameBasedLoop(framesPerSecond, framesPerPeriod, oneShotCallback)
        this.loopManager.registerLoop(loop)
        return callbackNode
    }

    /**
     * Schedules a callback node to be invoked after a specified delay.
     * @param delayMs The delay time in milliseconds.
     */
    public delayMethodical(delayMs: int): CallbackNode {
        const callbackNode = new CallbackNode()
        const delayCallback = (frame: int) => {
            if (frame == 1) {
                callbackNode.invoke()
                this.loopManager.deleteLoop(loop)
            }
        }

        const loop = new FrameBasedLoop(1000 / delayMs, 2, delayCallback)
        this.loopManager.registerLoop(loop)
        return callbackNode
    }
}