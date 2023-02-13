import deepEqual = require("deep-equal");
import { GameOptions } from "./game";
import { Direction, oppositeDirection, Position, relativePosition } from "./util";

export class Snake {
    gameOptions: GameOptions
    position: Position = new Position(0, 0)
    parts: SnakePart[] = []
    direction: Direction = Direction.Up
    lastDirection: Direction = Direction.Up

    constructor(options: GameOptions) {
        this.gameOptions = options;
    }

    /**
     * Moves the snake by tile in the directions its facing.
     * Returns if the snake died in this move.
     */
    move(grow: boolean): boolean {
        let oldPosition = this.position;

        const relPosition = relativePosition(this.direction);
        const newPosition = new Position(oldPosition.x + relPosition.x, oldPosition.y + relPosition.y);
        if (newPosition.x < 0 || newPosition.x >= this.gameOptions.gridWidth) {
            return true;
        }
        if (newPosition.y < 0 || newPosition.y >= this.gameOptions.gridHeight) {
            return true;
        }
        this.position = newPosition;
        this.lastDirection = this.direction;
        
        for (let i = 0; i < this.parts.length; i++) {
            const part = this.parts[i];
            oldPosition = part.swapPosition(oldPosition);
            if (deepEqual(oldPosition, newPosition)) {
                return true;
            }
        }
        
        if (grow) {
            const newPart = new SnakePart(oldPosition);
            this.parts.push(newPart);
        }
        return false;
    }
    setNewDirection(direction: Direction) {
        if (direction == oppositeDirection(this.lastDirection)) {
            return;
        }
        this.direction = direction;
    }

    containsPart(position: Position): boolean {
        if (this.position.isEqualTo(position)) {
            return true;
        }
        for (let i = 0; i < this.parts.length; i++) {
            const part = this.parts[i];
            if(part.position.isEqualTo(position)) {
                return true;
            }
        }
        return false;
    }

    render(ctx: CanvasRenderingContext2D) {
        this.renderSnakePart(ctx, this.position);
        this.parts.forEach(part => {
            this.renderSnakePart(ctx, part.position);
        })
    }
    private renderSnakePart(ctx: CanvasRenderingContext2D, position: Position) {
        const options = this.gameOptions;

        ctx.fillStyle = "#0096FF";
        ctx.fillRect(position.x * options.tileWidth, position.y * options.tileHeight, options.tileWidth, options.tileHeight);
    }
}
export class SnakePart {
    position: Position

    constructor(position: Position) {
        this.position = position;
    }

    swapPosition(newPosition: Position): Position {
        const oldPosition = this.position;
        this.position = newPosition;
        return oldPosition;
    }
}