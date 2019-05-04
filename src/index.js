import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={"square "+ (props.isWinningSquare ? "highlight": "")} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i, col, row) {
    return (<Square key={"col"+i} isWinningSquare={this.props.winningSquares.includes(i)} value={this.props.squares[i]} onClick={() => this.props.onClick(i, col, row)}/>);
  }

  createSquares() {
    let rows = [], colIndex = 0, cols, row, col;
    for( row = 0; row < 3; row++){
      cols = [];
      for( col = 0; col < 3; col++){
        cols.push(this.renderSquare( colIndex, col+1, row ));
        colIndex++;
      }
      rows.push(<div key={"row"+row} className="board-row">{cols}</div>);
    }
    return rows;
  }

  render() {
    return ( <div> { this.createSquares() } </div> );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      isDesc: true,
      xIsNext: true,
      stepNumber: 0
    };
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " ("+step.col+", "+step.row+")":
        'Go to game start';
      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? "bold" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status, winningSquares = [];
    if( winner ){
      status = ('Winner: ' + winner.player);
      winningSquares = winner.squares;
    }
    else if( !current.squares.includes(null) ){
      status = "Match is draw!";
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winningSquares={winningSquares} onClick={(i, col, row) => this.handleClick(i, col, row)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{ this.state.isDesc ? moves : moves.reverse()}</ol>
          <button onClick={() => this.sortHistory()}> Sort by: {this.state.isDesc ? "Descending" : "Asending"} </button>
        </div>
      </div>
    );
  }

  sortHistory() {
    this.setState({
      isDesc: !this.state.isDesc
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i, col, row) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);

    if ( winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        col, row
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
}

ReactDOM.render( <Game />, document.getElementById('root') );

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {player: squares[a], squares: lines[i]};
    }
  }
  return null;
}