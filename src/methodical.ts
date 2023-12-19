import { Queue } from '@typinghare/stack-queue'

export class CallbackNode {
    private callback?: WaitingFunction

    /**
     * Sets a callback function.
     * @param callback The callback function to set.
     */
    public set(callback: WaitingFunction): void {
        this.callback = callback
    }

    /**
     * Invokes the callback function.
     */
    public invoke(): void {
        if (this.callback) {
            this.callback()
        }
    }

    /**
     * Resets the callback function.
     */
    public reset(): void {
        this.callback = undefined
    }
}

export class CallbackQueue {
    /**
     * Creates a callback queue and starts immediately.
     * @param waitingFunctionIterable A sequence of waiting functions to call.
     */
    public static start(waitingFunctionIterable?: Iterable<WaitingFunction>): void {
        new CallbackQueue(waitingFunctionIterable).start()
    }

    /**
     * A queue of waiting functions.
     * @private
     */
    private readonly waitingFunctionQueue: Queue<WaitingFunction> = new Queue()

    /**
     * A set of affected callback nodes.
     * @private
     */
    private readonly callbackNodeSet: Set<CallbackNode> = new Set()

    /**
     * Creates a callback queue.
     * @param waitingFunctionIterable some waiting functions.
     */
    public constructor(waitingFunctionIterable?: Iterable<WaitingFunction>) {
        if (waitingFunctionIterable) {
            this.appendAll(waitingFunctionIterable)
        }
    }

    /**
     * The callback function to set for callback nodes.
     * @private
     */
    private readonly callback = () => {
        this.invokeNext()
    }

    /**
     * Appends a waiting function.
     * @param waitingFunction The waiting function to append.
     */
    public append(waitingFunction: WaitingFunction): void {
        this.waitingFunctionQueue.enqueue(waitingFunction)
    }

    /**
     * Appends a sequence of waiting functions.
     * @param waitingFunctionIterable A sequence of waiting functions to append.
     */
    public appendAll(waitingFunctionIterable: Iterable<WaitingFunction>): void {
        for (const waitingFunction of waitingFunctionIterable) {
            this.append(waitingFunction)
        }
    }

    /**
     * An alias of invokeNext().
     */
    public start(): void {
        this.invokeNext()
    }

    /**
     * Invokes next waiting function, and binds a callback function for the returned callback node.
     */
    public invokeNext(): void {
        const waitingFunction: WaitingFunction | null = this.waitingFunctionQueue.poll()
        if (waitingFunction == null) {
            for (const callbackNode of this.callbackNodeSet) {
                callbackNode.reset()
            }
            return
        }

        const callbackNode: CallbackNode | void = waitingFunction()
        if (callbackNode) {
            this.callbackNodeSet.add(callbackNode)
            callbackNode.set(this.callback)
        } else {
            this.invokeNext()
        }
    }
}

export type WaitingFunction = () => CallbackNode | void