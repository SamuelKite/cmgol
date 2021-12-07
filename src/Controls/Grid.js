import React, { useEffect, useRef } from "react";
import reactDom from "react-dom";
import Sketch from "react-p5";
import "./Grid.css";

const Canvas = props => {
    const { init, draw, rows, next, dim, ...rest } = props

    let setup = (p5, canvasParentRef) => {
        let drawTarget = p5.createCanvas(canvasParentRef.offsetWidth, canvasParentRef.offsetWidth).parent(canvasParentRef);
        init(p5);
    }

    return <Sketch setup={setup} draw={draw} {...rest} />
}

export class GridCell {
    constructor(R = 0, G = 0, B = 0, steps = 1) {
        this.R = R
        this.G = G
        this.B = B
        this.steps = steps
    }
}

export class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dim: 16,
            cells: [],
            next: [],
            p5: null,
            paused: false
        };

        this.draw = this.draw.bind(this);
        this.init = this.init.bind(this);
        this.generate = this.generate.bind(this);
        this.pause = this.pause.bind(this);
        this.colorInCells = this.colorInCells.bind(this);
    }

    componentDidMount() {
    }

    //componentDidUpdate

    init(p5) {
        if (this.state.p5 != null) {
            p5 = this.state.p5;
        }
        let rows = Math.floor(p5.height / this.state.dim);
        let cols = Math.floor(p5.width / this.state.dim);
        let newCells = Array.from(Array(rows), () => new Array(cols));
        let newNext = Array.from(Array(rows), () => new Array(cols));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (i == 0 || j == 0 || i == rows - 1 || j == cols - 1) {
                    newCells[i][j] = new GridCell();
                }
                else {
                    newCells[i][j] = new GridCell(Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 2), 1);
                }
                newNext[i][j] = new GridCell();
            }
        }

        this.setState({ cells: newCells, next: newNext, p5: p5 });

        p5.background(255);
        this.generate(p5);
        this.colorInCells(p5);
    }

    generate(p5) {
        if (this.state.cells.length > 0) {
            for (let y = 1; y < this.state.cells.length - 1; y++) {
                for (let x = 1; x < this.state.cells[y].length - 1; x++) {
                    // count neighbors
                    let neighbors = new GridCell;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            ["R", "G", "B"].forEach(element => {
                                neighbors[element] += this.state.cells[y + i][x + j][element]
                            });
                        }
                    }
                    // remove self from neighbor count
                    ["R", "G", "B"].forEach(element => {
                        neighbors[element] -= this.state.cells[y][x][element]
                    });
                    // Conflict step--R+B = G, G=R||B
                    if (this.state.cells[y][x].R == this.state.cells[y][x].B && this.state.cells[y][x].R == 1) {
                        this.state.cells[y][x].G = 1;
                    } else if (this.state.cells[y][x].G == 1 && this.state.cells[y][x].R == 0 && this.state.cells[y][x].B == 0) {
                        if (Math.random() > .5) {
                            this.state.cells[y][x].B = 1;
                        } else {
                            this.state.cells[y][x].R = 1;
                        }
                        // Optional Remove Green step
                        //this.state.cells[y][x].G = 0;
                    }
                    // Game of Life rules
                    ["R", "G", "B"].forEach(element => {
                        if ((this.state.cells[y][x][element] == 1) && (neighbors[element] < 2)) this.state.next[y][x][element] = 0;
                        else if ((this.state.cells[y][x][element] == 1) && neighbors[element] > 3) this.state.next[y][x][element] = 0;
                        else if ((this.state.cells[y][x][element] == 0) && neighbors[element] == 3) this.state.next[y][x][element] = 1;
                        else this.state.next[y][x][element] = this.state.cells[y][x][element];
                    });
                }
            }

            let temp = this.state.cells;
            this.state.cells = this.state.next;
            this.state.next = temp;
        }
    }

    draw(p5) {
        if (this.state.paused) return;

        if (this.state.cells?.length > 0) {
            p5.background(255);
            this.generate(p5);
            this.colorInCells(p5);
        }
    }

    colorInCells(p5) {
        for (let i = 0; i < this.state.cells.length; i++) {
            for (let j = 0; j < this.state.cells[i].length; j++) {
                let c = this.state.cells[i][j];
                
                if ((/* c.R + c.B +  */c.G) > 0) {
                    p5.fill(c.R * 255, c.G * 255, c.B * 255)
                } else {
                    p5.fill(0)
                }
                p5.stroke(0);
                p5.rect(i * this.state.dim, j * this.state.dim, this.state.dim - 1, this.state.dim - 1);
            }
        }
    }

    pause() {
        this.setState({ paused: !this.state.paused })
    }

    /* static getDerivedStateFromProps(props, state) {
        return { ce: props.GridValues };
    }
    style={{ display: 'inline-block', float: 'right' }}
    */
    render() {
        const { paused } = this.state
        return (
            <div className="Grid">
                <div className="GridBtns">
                    <button onClick={this.init}>Init</button>
                    <button onClick={this.pause}>{paused ? "unpause" : "pause"}</button>
                </div>

                <Canvas init={this.init} dim={this.state.dim} rows={this.state.cells} next={this.state.next} draw={this.draw} />
            </div>
        )
    }
}

export default Grid;