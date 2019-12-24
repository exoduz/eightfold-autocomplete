import React, { Component } from 'react';
import axios from 'axios';

import closeButton from './close-button.svg';

class SearchBar extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			// The chosen options by the user.
			chosen: [],
			// The results from the search.
			filteredSuggestions: [],
			// Suggestion list is open.
			showSuggestions: false,
			// User has entered...
			userInput: '',
		};

		this.url = 'https://api.themoviedb.org/3/search/movie'; 
		this.key = '6f16fa7cecdc0d6a4284523360f84e44';
	}

	componentDidMount() {
		document.addEventListener( 'mousedown', this.clickOutside, false );
	}

	componentDidUnmount() {
		document.removeEventListener( 'mousedown', this.clickOutside, false );
	}

	clickOutside = event => {
		if ( this.autocompleteNode && this.autocompleteNode.contains( event.target ) ) {
			return;
		}

		this.setState( { showSuggestions: false } )
	}

	onChange = event => {
		const userInput = event.currentTarget.value;
		const userInputCount = userInput.length;

		this.setState( { userInput: event.currentTarget.value } )

		// Make sure user has typed at least 2 characters before performing search.
		if ( userInputCount > 1 ) {
			const searchUrl = `${ this.url }/?api_key=${ this.key }&query=${ userInput }`;

			axios.get( searchUrl )
				.then( response => {
					// Filter our suggestions that don't contain the user's input.
					let filteredSuggestions = response.data.results.map( result => result.title );
					// Also make sure the output does not contain what is currently already chosen.
					filteredSuggestions = filteredSuggestions.filter( item => ! this.state.chosen.includes( item ) );

					this.setState( {
						filteredSuggestions,
						showSuggestions: true,
					} );
				} );
		}
	};

	onClickSuggestion = event => {
		let clickedItem = event.currentTarget.innerText;
		let updatedChosen = this.state.chosen.concat( clickedItem );

		this.setState( {
			chosen: updatedChosen,
			filteredSuggestions: [],
			showSuggestions: false,
			userInput: '',
		} );
	};

	onClickRemove = event => {
		const currentChosenState = this.state.chosen;
		const clickedChosen = event.target.dataset.title;
		// Remove chosen from the list of chosen array.
		let updatedChosen = currentChosenState.filter( item => item !== clickedChosen );
		this.setState( { chosen: updatedChosen } );
	}

	render() {
		const {
			onChange,
			onClickRemove,
			onClickSuggestion,
			onKeyDown,
		} = this;

		const {
			chosen,
			filteredSuggestions,
			showSuggestions,
			userInput
		} = this.state;

		let suggestionsListComponent;

		if ( showSuggestions && userInput ) {
			if ( filteredSuggestions.length ) {
				suggestionsListComponent = (
					<ul className="suggestions" ref={ node => this.autocompleteNode = node }>
						{ filteredSuggestions.map( ( suggestion, index ) => {
							let className;

							return (
								<li key={ `${ index }` } onClick={ onClickSuggestion }>
									{ suggestion }
								</li>
							);
						} ) }
					</ul>
				);
			} else {
				suggestionsListComponent = (
					<div className="no-suggestions">
						<em>No results found!</em>
					</div>
				);
			}
		}

		return (
			<div className="container">
				<div className={ `chosen-container ${ chosen.length === 0 ? 'chosen-empty' : '' }`  }>
					{ chosen.length > 0
						&& chosen.map( ( item, index ) => {
							return <span className="chosen-item" key={ `chosen-${ index }` }>
								{ item }
								<span className="close-button">
									<img src={ closeButton } data-title={ item } alt="Close Button" onClick={ onClickRemove } />
								</span>
							</span>
						} )
					}
				</div>

				{ chosen.length !== 5
					? <span>
						<input
							type="text"
							onChange={ onChange }
							onKeyDown={ onKeyDown }
							value={ userInput }
						/>
						{ suggestionsListComponent }
					</span>
					: <span className="chosen-full"></span>
				}

				{ chosen.length === 5 && <div className="chosen-full-text">You can only choose 5 movies!</div> }
			</div>
		);
	}
}

export default SearchBar;
