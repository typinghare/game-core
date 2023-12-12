import { float } from './types'

export class Game {
    public constructor() {
    }
}

export interface FrameUpdatable {
    update(deltaTime: float): void
}