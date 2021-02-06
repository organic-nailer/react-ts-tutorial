import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares: string[]) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

type SquareProps = {
  value: string;
  onClick: () => void;
};

function Square(props: SquareProps) {
  return (
    <button 
    className="square" 
    onClick={props.onClick }>
    {props.value}
  </button>
  );
}

type BoardProps = {
  squares: string[];
  onClick: (value: number) => void;
};
  
  class Board extends React.Component<BoardProps> {
    renderSquare(i: number) {
      return <Square 
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)} />;
    }
  
    render() {
      const squares = Array(3).fill(1).map((_, row) => { 
        const squaresRow = Array(3).fill(1).map((_, column) => {
          return this.renderSquare(row * 3 + column);
        });
        return(<div className="board-row">{squaresRow}</div>);
      });
      console.log(squares);
      return (<div>{squares}</div>);
    }
  }

  type MoveData = {
    row: number;
    column: number;
    piece: string;
  };

  type GameState = {
    history: { 
      squares: string[],
      move: MoveData | null,
    }[];
    stepNumber: number;
    xIsNext: boolean;
  };
  
  class Game extends React.Component<any, GameState> {
    constructor(props: any) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          move: null,
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }
    handleClick(i: number) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([{
          squares: squares,
          move: {
            row: Math.floor(i / 3),
            column: i % 3,
            piece: squares[i]
          }
        }]), 
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }

    jumpTo(step: number) {
      this.setState({
        history: this.state.history.slice(0, step+1),
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, index) => {
        const move = step.move ?? { row: -1, column: -1, piece: "?" };
        const desc = index ? `Go to move #${index} (${move.row},${move.column},${move.piece})` : "Go to game start";
        return (<li key={index}><button className={index === history.length - 1 ? "button-bold" : ""} onClick={() => this.jumpTo(index)}>{desc}</button></li>)
      });

      let status;
      if(winner) {
        status = "Winner: " + winner;
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext ? "X" : "O");
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares = {current.squares}
                onClick = {(i) => this.handleClick(i)} 
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  