// Importing css
import "../index.css";
// Typescript imports
import { Food } from "./food";
import { Snake } from "./snake";
import { Direction } from "./util";
import { loadAssets } from "./assets";

window.onload = () => {
    main();
}

async function main() {
    const canvas = document.getElementById("game_canvas") as HTMLCanvasElement;
    const ctx = getContext(canvas);
    const options = createGameOptions(canvas);

    try {
        await loadAssets();
    } catch (e) {
        throw `Error whilst loading images: ${e}`
    }

    const game = new SnakeGame(ctx, options);

    window.addEventListener("keydown", event => {
        game.onKeyDown(event.key);
    });

    game.run();
}

function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    canvas.setAttribute("width", "1500");
    canvas.setAttribute("height", "1500");

    const ctx = canvas.getContext("2d");
    if (ctx == null) {
        throw "Couldn't get rendering context!";
    }
    // If true drawn images can appear blurred
    ctx.imageSmoothingEnabled = false;
    return ctx;
}

function createGameOptions(canvas: HTMLCanvasElement): GameOptions {
    return {
        width: canvas.width,
        height: canvas.height,
        gridWidth: 10,
        gridHeight: 10,
        tileWidth: canvas.width / 10,
        tileHeight: canvas.height / 10
    };
}

export type GameOptions = {
    // Window
    width: number
    height: number
    // Grid
    gridWidth: number
    gridHeight: number
    // Tile
    tileWidth: number
    tileHeight: number
}

class SnakeGame {
    ctx: CanvasRenderingContext2D
    options: GameOptions
    hasDied: boolean = false
    score: number
    snake: Snake
    food: Food

    constructor(ctx: CanvasRenderingContext2D, options: GameOptions) {
        this.ctx = ctx;
        this.options = options;
        this.snake = new Snake(options);
        this.food = new Food(options);
        this.reset();
    }

    private reset() {
        this.score = 0;
        this.snake.reset();
        this.generateNewFood();
    }

    run() {
        setTimeout(() => {
            this.update();
            this.render();
            this.run();
        }, this.calculateUpdateTimeMs());
    }
    private calculateUpdateTimeMs(): number {
        return Math.max(50, 500 - this.score / 100 * 20);
    }

    private update() {
        if (this.hasDied) {
            return;
        }

        const hasEatenFood = this.food.position.isEqualTo(this.snake.body[0].position);
        if (hasEatenFood) {
            this.generateNewFood();
            this.score += 100;
        }
        this.hasDied = this.snake.move(hasEatenFood);
    }
    private generateNewFood() {
        this.food.generateNewPosition((position) => !this.snake.containsPart(position));
    }

    onKeyDown(key: string) {

        if (this.hasDied) {
            this.hasDied = false;
            this.reset();
        }

        if (key == "ArrowUp") {
            this.snake.setNewDirection(Direction.Up);
        } else if (key == "ArrowDown") {
            this.snake.setNewDirection(Direction.Down);
        } else if (key == "ArrowLeft") {
            this.snake.setNewDirection(Direction.Left);
        } else if (key == "ArrowRight") {
            this.snake.setNewDirection(Direction.Right);
        }
    }

    private render() {
        const ctx = this.ctx;
        const options = this.options;

        this.renderBackground();
        this.snake.render(ctx);

        const isSnakeEatingFood = this.food.position.isEqualTo(this.snake.body[0].position);
        if (!isSnakeEatingFood) {
            this.food.render(ctx);
        }

        if (this.hasDied) {
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.font = "50px arial";
            ctx.fillText("You DIED", options.width / 2, options.height / 2);
        }
    }
    private renderBackground() {
        const ctx = this.ctx;
        const options = this.options;

        for (let x = 0; x < options.gridWidth; x++) {
            for (let y = 0; y < options.gridHeight; y++) {
                let color = "#ffffff";
                if ((x + y) % 2 == 0) {
                    color = "#49be25";
                } else {
                    color = "#07ab46";
                }
                ctx.fillStyle = color;
                ctx.fillRect(x * options.tileWidth, y * options.tileHeight, options.tileWidth, options.tileHeight);
            }
        }
    }
}