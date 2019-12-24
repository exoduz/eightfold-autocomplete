import React from 'react';
import './App.scss';

import SearchBar from './search-bar';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src="https://eightfold.ai/wp-content/uploads/Eightfold-Mountain-View-California.svg" className="App-logo" alt="Logo" />
			</header>

			<SearchBar />
		</div>
	);
}

export default App;
