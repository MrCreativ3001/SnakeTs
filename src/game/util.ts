import deepEqual = require("deep-equal");
import { GameOptions } from "./game";

export enum Direction {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right",
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


// Note that up and down are inverted because the canvas is inverted
export function relativePosition(direction: Direction): Position {
    switch (direction) {
        case Direction.Up:
            return new Position(0, -1);
        case Direction.Down:
            return new Position(0, 1);
        case Direction.Left:
            return new Position(-1, 0);
        case Direction.Right:
            return new Position(1, 0);
    }
}


export class Position {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    isEqualTo(other: Position): boolean {
        return deepEqual(this, other);
    }
}

/**
 * Generates a random position in the grid bounds.
 */
export function generateRandomPosition(gameOptions: GameOptions): Position {
    return new Position(
        generateRandomIntegerBetween(0, gameOptions.gridWidth),
        generateRandomIntegerBetween(0, gameOptions.gridHeight)
    )
}
function generateRandomIntegerBetween(min: number, max: number): number {
    const diff = max - min;
    return Math.floor(min + (Math.random() * diff));
}