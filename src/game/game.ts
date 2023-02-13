// Importing css
import "../index.css";
// Typescript imports
import { Food } from "./food";
import { Snake } from "./snake";
import { Direction } from "./util";
import deepEqual = require("deep-equal");

window.onload = () => {
    main();
}

function main() {
    const canvas = document.getElementById("game_canvas") as HTMLCanvasElement;
    canvas.setAttribute("width", "1500");
    canvas.setAttribute("height", "1500");

    const ctx = canvas.getContext("2d");
    if (ctx == null) {
        throw "Couldn't get rendering context!";
    }

    let options: GameOptions = {
        width: canvas.width,
        height: canvas.height,
        gridWidth: 10,
        gridHeight: 10,
        tileWidth: canvas.width / 10,
        tileHeight: canvas.height / 10
    }

    const game = new SnakeGame(ctx, options);
    
    window.addEventListener("keydown", event => {
        game.onKeyDown(event.key);
    });

    game.run();
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
        this.reset();
    }

    private reset() {
        this.score = 0;
        this.snake = new Snake(this.options);
        this.food = new Food(this.options);
    }

    run() {
        setTimeout(() => {
            this.update();
            this.render();
            this.run();
        },this.calculateUpdateTimeMs());
    }
    private calculateUpdateTimeMs(): number {
        return Math.max(50, 500 - this.score / 100 * 20);
    }

    private update() {
        if (this.hasDied) {
            return;
        }

        const hasEatenFood = deepEqual(this.food.position, this.snake.position);
        if (hasEatenFood) {
            this.food.generateNewPosition((position) => !this.snake.containsPart(position));
            this.score += 100;
        }
        this.hasDied = this.snake.move(hasEatenFood);
    }

    onKeyDown(key: string) {

        if (this.hasDied) {
            this.hasDied = false;
            this.reset();
        }

        // Up and down need to be switched because the ctx is normally flipped
        if (key == "ArrowUp") {
            this.snake.setNewDirection(Direction.Down);
        } else if(key == "ArrowDown") {
            this.snake.setNewDirection(Direction.Up);
        } else if(key == "ArrowLeft") {
            this.snake.setNewDirection(Direction.Left);
        } else if(key == "ArrowRight") {
            this.snake.setNewDirection(Direction.Right);
        }
    }

    private render() {
        const ctx = this.ctx;
        const options = this.options;

        this.renderGrid();
        this.food.render(ctx);
        this.snake.render(ctx);

        if (this.hasDied) {
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.font = "50px arial";
            ctx.fillText("You DIED", options.width/2, options.height/2);
        }
    }
    private renderGrid() {
        const ctx = this.ctx;
        const options = this.options;

        ctx.fillStyle = "#49be25";
        for (let x = 0; x < options.gridWidth; x++) {
            for (let y = 0; y < options.gridHeight; y++) {
                ctx.fillRect(x * options.tileWidth, y * options.tileHeight, options.tileWidth, options.tileHeight);
            }
        }
    }
}