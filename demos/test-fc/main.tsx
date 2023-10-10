import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function Child() {
	return <li key={'1'}>1</li>;
}

function App() {
	const [num, setNumber] = useState(0);
	console.log('render');

	return (
		<ul
			onClick={(e) => {
				console.log(e);

				setNumber((num) => num + 1);
				setNumber((num) => num + 1);
				setNumber((num) => num + 1);
			}}
		>
			{num}
		</ul>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
