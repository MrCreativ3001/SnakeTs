import { GameOptions } from "./game";

export class Position {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export enum Direction {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right",
}

export function oppositeDirection(direction: Direction): Direction {
    switch (direction) {
        case Direction.Up:
            return Direction.Down;
        case Direction.Down:
            return Direction.Up;
        case Direction.Left:
            return Direction.Right;
        case Direction.Right:
            return Direction.Left;
    }
}

export function relativePosition(direction: Direction): Position {
    switch (direction) {
        case Direction.Up:
            return { x: 0, y: 1 };
        case Direction.Down:
            return { x: 0, y: -1 };
        case Direction.Left:
            return { x: -1, y: 0 };
        case Direction.Right:
            return { x: 1, y: 0 };
    }
}

/**
 * Generates a random position in the grid bounds.
 */
export function generateRandomPosition(gameOptions: GameOptions): Position {
    return {
        x: generateRandomIntegerBetween(0, gameOptions.gridWidth),
        y: generateRandomIntegerBetween(0, gameOptions.gridHeight)
    }
}
function generateRandomIntegerBetween(min: number, max: number): number {
    const diff = max - min;
    return Math.floor(min + (Math.random() * diff));
}