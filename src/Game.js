/*
 * A Game of Rock, Paper, Scissors 
 * React Component
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React, { Component, PropTypes } from 'react';
import 'animate.css/source/_base.css';
import 'animate.css/source/attention_seekers/bounce.css';
import 'animate.css/source/fading_entrances/fadeIn.css';

const
  propTypes = {
  	//
  	// Array of playable elements
  	// You must provide CSS classes named like lowercase elements 
  	// prefixed with 'icon-' i.e. 'icon-rock'
		elements: PropTypes.array,
		//
		// function that compares player moves
		// it should return -1 in case of a draw
		// 0 if the first player won
		// 1 if the second player won
		compare: PropTypes.func,
		//
		// function that translates the results from the compare function 
		// into readable strings
		translateResult: PropTypes.func,
  },
  DRAW = -1, WIN = 0, LOSS = 1, // Human player is 0, Computer is 1
  defaultProps = {
		elements: ['Rock', 'Paper', 'Scissors'], 
		compare: (elements, x, y) => {
			// Generalized solution to the Rock, Paper, Scissors, ... problem
			// Adopted from http://jsfiddle.net/QHzk3/2/
			x = elements.indexOf(x);
			y = elements.indexOf(y);
			if ( x === y )
				return DRAW;			
			const c = (x - y) % elements.length, mod = c < 0 ? c + elements.length : c;
			return mod < elements.length / 2 ? WIN : LOSS;
		},		
		translateResult: result => result === DRAW ? 'Draw' : result === LOSS ? 'You lost' : 'You won',	
  };

class Game extends Component {	
	
	constructor() {
		super();		
		this.state = { rounds: [], isAnimationPlaying: false };
		// binding event handlers to this
		this.onClick = this.handleClick.bind(this);
		this.onReset = this.handleReset.bind(this);
		this.onSimulate = this.handleSimulate.bind(this);
	}

	//returns random playable element
	simulateMove() {
		return this.props.elements[Math.floor(Math.random()*this.props.elements.length)];
	}

	play(...moves) {	
		if (this.state.isAnimationPlaying) 
			return;
		const result = this.props.compare(this.props.elements, ...moves );
		this.setState({ isAnimationPlaying: true });		
		setTimeout( () => this.setState({ isAnimationPlaying: false, rounds: [{ result, moves }, ...this.state.rounds] }), 1000 );
	}

	//data-id is used to avoid creating functional objects on every render
	handleClick({ currentTarget }) {
		this.play(currentTarget.getAttribute('data-id'), this.simulateMove());
	}

	handleReset() {
		if (this.state.isAnimationPlaying) 
			return;
		this.setState({ rounds: [] });
	}

	handleSimulate() {
		this.play(this.simulateMove(), this.simulateMove());
	}

	displayHistory() {
		return (
			<div>
				<div className="row">
					<button 
      			onClick={this.onReset} 
      			type="button" 
      			className={`btn btn-outline-danger${ !this.state.isAnimationPlaying && this.state.rounds.length ? '' : ' disabled' }`}
      		>
      			Reset Game
      		</button>
				</div>
				<br/>
				<div className="row">
					<ul className="list-group text-xs-left">
						{this.state.isAnimationPlaying? <li className="list-group-item active">Playing</li> : void 0 }
						{this.state.rounds.map( (round, index) => 
							<li className={`list-group-item ${ !index && !this.state.isAnimationPlaying ? 'active':'hidden-xs-down'}`} key={index}>
								{this.props.translateResult(round.result)} ( {round.moves[0]} - {round.moves[1]} ) 
							</li> 
						)}
					</ul>
				</div>
			</div>
		);
	}

	displayMove(index) {		
  	const score = this.state.rounds.reduce( (score, { result }) => score + ( result === index ? 1 : 0 ), 0);
		return (
			<div className="row">			
				<div key={this.state.rounds.length} className={ `animated ${this.state.isAnimationPlaying ? 'bounce' : 'fadeIn' }` }>
					<i 
						style={{ fontSize: '9em' }} 
						className={ this.state.isAnimationPlaying || !this.state.rounds.length ? 'icon-rock' : `icon-${this.state.rounds[0].moves[index].toLowerCase()}` }
					>
					</i>				
				</div>
				<h3>Score: {score}</h3>
      </div>
		);
	}

	displayPlayerUI() {
		return(
			<div className="row">
			  {this.props.elements.map( el => 			   	
      		<button 
      			key={el}
      			data-id={el}
      			onClick={this.onClick} 
      			type="button" 
      			className={`btn btn-outline-primary${ this.state.isAnimationPlaying ? ' disabled' : '' }`}
      		>
      			<i className={`icon-${el.toLowerCase()}`}></i> {el}
      		</button>      			
			  )}
      </div>
    );
  }

	displaySimulationButton() {
		return(	
  		<div className="row">
      	<button 
      		onClick={this.onSimulate} 
      		type="button"
      		className={`btn btn-outline-warning${ this.state.isAnimationPlaying ? ' disabled' : '' }`}      					
      	>
      		Simulate My Move
      	</button>
      </div>
    );
  }

	render() {
    return(
    	<div className="container">
			  <div className="row">
			    <div className="col-sm-4">
			    	<h2>You</h2>
			    	{this.displayPlayerUI()}
      			{this.displayMove(0)}
			    </div>
			    <div className="col-sm-4">
    			  <h2>{this.state.rounds.length} round{this.state.rounds.length === 1 ? '':'s'} played</h2>
			      {this.displayHistory()}
			    </div>
			    <div className="col-sm-4">
			    	<h2>Computer</h2>
			    	{this.displaySimulationButton()}
      			{this.displayMove(1)}
			    </div>
			  </div>
			</div>
    );
  }
}

Game.propTypes = propTypes;
Game.defaultProps = defaultProps;
export default Game;