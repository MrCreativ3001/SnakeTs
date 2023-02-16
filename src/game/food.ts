import { getAsset } from "./assets";
import { GameOptions } from "./game";
import { Position, generateRandomPosition } from "./util";

export class Food {
    gameOptions: GameOptions
    position: Position

    /**
     * Creates new food at a random position in the bounds of the grid.
     */
    constructor(options: GameOptions) {
        this.gameOptions = options;
        this.generateNewPosition(() => true);
    }

    generateNewPosition(isValidPosition: (position: Position) => boolean) {
        while (!isValidPosition(this.position = generateRandomPosition(this.gameOptions))) { }
    }

    render(ctx: CanvasRenderingContext2D) {
        const options = this.gameOptions;

        const image = getAsset("food.png");
        ctx.drawImage(image, this.position.x * options.tileWidth, this.position.y * options.tileHeight, options.tileWidth, options.tileHeight);
    }

}