import deepEqual = require("deep-equal");
import { GameOptions } from "./game";
import { Direction, oppositeDirection, Position, relativePosition } from "./util";
import { getAsset } from "./assets";

export class Snake {
    gameOptions: GameOptions
    body: SnakeBodyPart[]
    nextDirection: Direction = Direction.Down
    lastDirection: Direction = Direction.Down

    constructor(options: GameOptions) {
        this.gameOptions = options;
        this.reset();
    }

    reset() {
        this.body = [
            {
                position: new Position(0, 1),
                direction: Direction.Down
            },
            {
                position: new Position(0, 0),
                direction: Direction.Down
            }
        ];
    }

    /**
     * Moves the snake by tile in the directions its facing.
     * Returns if the snake died in this move.
     */
    move(grow: boolean): boolean {

        const head = this.body[0];

        // Calculate new position
        const relPosition = relativePosition(this.nextDirection);
        const newPosition = new Position(head.position.x + relPosition.x, head.position.y + relPosition.y);

        // Death checking
        if (newPosition.x < 0 || newPosition.x >= this.gameOptions.gridWidth) {
            return true;
        }
        if (newPosition.y < 0 || newPosition.y >= this.gameOptions.gridHeight) {
            return true;
        }

        // New Head part
        let newPart = {
            position: newPosition,
            direction: this.nextDirection
        }
        // update direction
        this.lastDirection = this.nextDirection;

        for (let i = 0; i < this.body.length; i++) {
            const part = this.body[i];
            if (deepEqual(part.position, newPosition)) {
                return true;
            }
            this.body[i] = newPart;
            newPart = part;
        }

        if (grow) {
            this.body.push(newPart);
        }
        return false;
    }
    setNewDirection(direction: Direction) {
        if (direction == oppositeDirection(this.lastDirection)) {
            return;
        }
        this.nextDirection = direction;
    }

    containsPart(position: Position): boolean {
        for (let i = 0; i < this.body.length; i++) {
            const part = this.body[i];
            if (part.position.isEqualTo(position)) {
                return true;
            }
        }
        return false;
    }

    render(ctx: CanvasRenderingContext2D) {
        const head = this.body[0];
        this.renderSnakeSimple(ctx, `head_${head.direction}.png`, head.position);
        const tail = this.body[this.body.length - 1];
        const beforeTail = this.body[this.body.length - 2];
        this.renderSnakeSimple(ctx, `tail_${oppositeDirection(beforeTail.direction)}.png`, tail.position);

        for (let i = 1; i < this.body.length - 1; i++) {
            const prevPart = this.body[i - 1];
            const part = this.body[i];
            this.renderSnakeBody(ctx, part, prevPart);
        }
    }
    private renderSnakeSimple(ctx: CanvasRenderingContext2D, imagePath: string, position: Position) {
        const options = this.gameOptions;

        const image = getAsset(imagePath);
        ctx.drawImage(image, position.x * options.tileWidth, position.y * options.tileHeight, options.tileWidth, options.tileHeight);
    }
    private renderSnakeBody(ctx: CanvasRenderingContext2D, part: SnakeBodyPart, prevPart: SnakeBodyPart) {
        this.renderSnakeSimple(ctx, `body_${prevPart.direction}_${oppositeDirection(part.direction)}.png`, part.position);
    }
}
type SnakeBodyPart = {
    position: Position,
    direction: Direction
}