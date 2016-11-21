import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import Game from './Game';

const DRAW = -1, WIN = 0, LOSS = 1;

it('renders a initial view', () => {
  const instance = mount(<Game />);
  expect(instance.html()).toMatchSnapshot();
});

it('starts animation', () => {
  const instance = mount(<Game />);
	instance.find('button').first().simulate('click');
	expect(instance.state().isAnimationPlaying).toBe(true);
 	expect(instance.html()).toMatchSnapshot();
});

it('renders results correctly', () => {
  const instance = mount(<Game />);
	instance.setState({rounds: [
		{ result: LOSS, moves: ['Rock', 'Paper'] }, 
		{ result: WIN, moves: ['Scissors', 'Paper'] },
		{ result: WIN, moves: ['Paper', 'Rock'] },
	]});
  expect(instance.html()).toMatchSnapshot();
});

it('compares correctly', () => {
	const { elements, compare } = Game.defaultProps;
	expect(compare(elements,'Rock','Paper')).toBe(LOSS);  
	expect(compare(elements,'Rock','Scissors')).toBe(WIN);  
	expect(compare(elements,'Rock','Rock')).toBe(DRAW);  
	
	expect(compare(elements,'Paper','Paper')).toBe(DRAW);  
	expect(compare(elements,'Paper','Scissors')).toBe(LOSS);  
	expect(compare(elements,'Paper','Rock')).toBe(WIN);  

	expect(compare(elements,'Scissors','Paper')).toBe(WIN);  
	expect(compare(elements,'Scissors','Scissors')).toBe(DRAW);  
	expect(compare(elements,'Scissors','Rock')).toBe(LOSS);  
});

it('translates correctly', () => {
	expect(Game.defaultProps.translateResult(DRAW)).toBe('Draw');  
	expect(Game.defaultProps.translateResult(WIN)).toBe('You won');  
	expect(Game.defaultProps.translateResult(LOSS)).toBe('You lost');  
});
