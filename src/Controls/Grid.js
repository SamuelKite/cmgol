import React, { useEffect, useRef } from "react";
import reactDom from "react-dom";
import Sketch from "react-p5";
import "./Grid.css";

const Canvas = props => {
    const { init, draw, rows, next, dim, ...rest } = props

    let setup = (p5, canvasParentRef) => {
        let drawTarget = p5.createCanvas(canvasParentRef.parentNode.clientWidth, canvasParentRef.parentNode.clientHeight).parent(canvasParentRef);
        init(p5);
    }

    let windowResized = function(p5, event){
            p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
            init(p5);
    }

    return <Sketch setup={setup} draw={draw} windowResized={windowResized} {...rest} />
}

export class GridCell {
    constructor(R = 0, G = 0, B = 0, steps = 1) {
        this.R = R
        this.G = G
        this.B = B
        this.steps = steps
    }

    increment(color) {
        if (this.hasOwnProperty(color) && this[color] < this.steps) {
            this[color] += 1;
        }
    }

    decrement(color) {
        if (this.hasOwnProperty(color) && this[color] > 0) {
            this[color] -= 1;
        }
    }
}

export class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dim: 28,
            cells: [],
            next: [],
            p5: null,
            paused: false,
            coloringFunction: this.colorInCells,
            filterName: "All",
            steps: 1,
            gDecay: true,
        };

        this.draw = this.draw.bind(this);
        this.doDrawing = this.doDrawing.bind(this);
        this.init = this.init.bind(this);
        this.generate = this.generate.bind(this);
        this.pause = this.pause.bind(this);
        this.swapFilter = this.swapFilter.bind(this);
        this.toggleCellSize = this.toggleCellSize.bind(this);
        this.toggleSteps = this.toggleSteps.bind(this);
        this.toggleGDecay = this.toggleGDecay.bind(this);

        this.colorInCells = this.colorInCells.bind(this);
        this.colorInGreen = this.colorInGreen.bind(this);
        this.colorInBlue = this.colorInBlue.bind(this);
        this.colorInRed = this.colorInRed.bind(this);
        this.colorInWhite = this.colorInWhite.bind(this);

        this.state.coloringFunction = this.state.coloringFunction.bind(this);

    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.dim !== this.state.dim) {
            this.init(this.state.p5);
            this.doDrawing(this.state.p5, this.state.coloringFunction);
        } else if (prevState.coloringFunction !== this.state.coloringFunction) {
            this.doDrawing(this.state.p5, this.state.coloringFunction);
        }
    }

    toggleCellSize() {
        const sizes = { 16: 20, 20: 24, 24: 28, 28: 4, 4: 8, 8: 12, 12: 16 }
        this.setState({ dim: sizes[this.state.dim] ?? 28 });
    }

    toggleSteps() {
        const totalIncrements = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 1 }
        this.setState({ steps: totalIncrements[this.state.steps] ?? 1 });
    }

    init(p5) {
        if (this.state.p5 != null) {
            p5 = this.state.p5;
        }
        let rows = Math.floor(p5.height / this.state.dim);
        let cols = Math.floor(p5.width / this.state.dim);
        let newCells = Array.from(Array(cols), () => new Array(rows));
        let newNext = Array.from(Array(cols), () => new Array(rows));
        for (let i = 0; i <cols ; i++) {
            for (let j = 0; j < rows; j++) {
                if (i == 0 || j == 0 || i == rows - 1 || j == cols - 1) {
                    newCells[i][j] = new GridCell(0, 0, 0, this.state.steps);
                }
                else {
                    newCells[i][j] = new GridCell(Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 2), this.state.steps);
                }
                newNext[i][j] = new GridCell(0, 0, 0, this.state.steps);
            }
        }

        this.setState({ cells: newCells, next: newNext, p5: p5 });

        p5.background(255);
        this.generate(p5);
        this.doDrawing(p5, this.state.coloringFunction);
    }

    // evaluateCell(GridCell: cell)
    evaluateCell(cell)
    {
        if (cell.B > 0 && cell.R > 0) {
            cell.increment("G");
        } else if (cell.G > 0 &&
            cell.R < cell.G &&
            cell.B < cell.G) {
            if (Math.random() > .5) {
                cell.increment("B");
            } else {
                cell.increment("R");
            }
            // Optional Remove Green step
            if (this.state.gDecay === true) {
                cell.decrement("G");
            }
        }
    }

    generate(p5) {
        if (this.state.cells.length > 0) {
            for (let y = 1; y < this.state.cells.length - 1; y++) {
                for (let x = 1; x < this.state.cells[y].length - 1; x++) {
                    let cell = this.state.cells[y][x];
                    // count neighbors
                    let neighbors = { R: 0, G: 0, B: 0 };
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            let neighborCell = this.state.cells[y + i][x + j];
                            if (cell === neighborCell) {
                                continue;
                            }

                            ["R", "G", "B"].forEach(element => {
                                neighbors[element] += neighborCell[element] > 0 ? 1 : 0;
                            });
                        }
                    }
                    // Conflict step--R+B = G, G=R||B
                    evaluateCell(cell);
                    // Game of Life rules
                    let nextCell = this.state.next[y][x];
                    ["R", "G", "B"].forEach(element => {
                        if ((cell[element] > 0) && (neighbors[element] < 2)) nextCell.decrement(element);
                        else if ((cell[element] > 0) && neighbors[element] > 3) nextCell.decrement(element);
                        else if ((cell[element] == 0) && neighbors[element] == 3) nextCell.increment(element);
                        else nextCell[element] = cell[element];
                    });
                }
            }

            let current = this.state.cells;
            this.state.cells = this.state.next;
            this.state.next = current;
        }
    }

    draw(p5) {
        if (this.state.paused) return;
        this.doDrawing(p5, this.state.coloringFunction);
    }

    doDrawing(p5, coloringFunction) {
        if (p5) {
            if (this.state.cells?.length > 0) {
                p5.background(255);
                this.generate(p5);
                coloringFunction(p5);
            }
        }
    }

    colorAnyCell(p5, fillFunc) {
        for (let i = 0; i < this.state.cells.length; i++) {
            for (let j = 0; j < this.state.cells[i].length; j++) {
                let c = this.state.cells[i][j];
                fillFunc(c);
                p5.stroke(0);
                p5.rect(i * this.state.dim, j * this.state.dim, this.state.dim - 1, this.state.dim - 1);
            }
        }
    }

    colorInCells(p5) {
        this.colorAnyCell(p5, (c) => {
            p5.fill(c.R / c.steps * 255, c.G / c.steps * 255, c.B / c.steps * 255);
        })
    }

    colorInGreen(p5) {
        this.colorAnyCell(p5, (c) => {
            if ((/* c.R + c.B +  */c.G) > 0) {
                p5.fill(c.R / c.steps * 255, c.G / c.steps * 255, c.B / c.steps * 255);
            } else {
                p5.fill(c.R-c.G, (c.R+c.B)*.5, c.B-c.G);
            }
        })
    }
    colorInRed(p5) {
        this.colorAnyCell(p5, (c) => {
            if ((c.R) > 0) {
                p5.fill(c.R * 255, c.G * 255, c.B * 255);
            } else {
                p5.fill(0);
            }
        })
    }
    colorInBlue(p5) {
        this.colorAnyCell(p5, (c) => {
            if ((c.B) > 0) {
                p5.fill(c.R * 255, c.G * 255, c.B * 255);
            } else {
                p5.fill(0);
            }
        })
    }
    colorInWhite(p5) {
        this.colorAnyCell(p5, (c) => {
            if (Math.abs(c.R - c.G) < 2 && c.R == c.B && c.R !== 0) {
                p5.fill(c.R * 255, c.G * 255, c.B * 255);
            } else {
                p5.fill(0);
            }
        });
    }

    pause() {
        this.setState({ paused: !this.state.paused })
    }

    toggleGDecay() {
        this.setState({ gDecay: !this.state.gDecay });
    }

    swapFilter(clickArgs) {
        var newLabel = this.state.filterName;
        var newColoringFunction = this.state.coloringFunction;
        if (this.state.filterName === "All") {
            newColoringFunction = this.colorInBlue;
            newLabel = "Blue";
        } else if (this.state.filterName === "Blue") {
            newColoringFunction = this.colorInRed;
            newLabel = "Red";
        } else if (this.state.filterName === "Red") {
            newColoringFunction = this.colorInGreen;
            newLabel = "Green";
        } else if (this.state.filterName === "Green") {
            newColoringFunction = this.colorInWhite;
            newLabel = "Gray";
        }
        else {
            newColoringFunction = this.colorInCells;
            newLabel = "All";
        }

        this.setState({ coloringFunction: newColoringFunction, filterName: newLabel });
    }

    render() {
        const { paused, filterName, dim, steps, p5, next, coloringFunction, cells, gDecay } = this.state
        return (
            <div className="Grid">
                <div className="GridBtns">
                    <button onClick={this.init}>Init</button>
                    <button onClick={this.pause}>{paused ? "unpause" : "pause"}</button>
                    <button onClick={this.swapFilter}>{filterName}</button>
                    <button onClick={this.toggleCellSize}>cell size: {dim}</button>
                    <button onClick={this.toggleSteps}>steps: {steps}</button>
                    <button onClick={() => this.doDrawing(p5, coloringFunction)}>Increment</button>
                    <button onClick={this.toggleGDecay}>{gDecay ? "G Decays" : "G Remains"}</button>
                </div>

                <Canvas init={this.init} dim={dim} rows={cells} next={next} draw={this.draw} />
            </div>
        )
    }
}

export default Grid;