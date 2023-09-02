import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function Child() {
	return <li key={'1'}>1</li>;
}

function App() {
	const [num, setNumber] = useState(0);

	const arr =
		num % 2 === 0
			? [<Child key={'1'} />, <li key={'2'}>2</li>, <li key={'3'}>3</li>]
			: [<li key={'3'}>3</li>, <li key={'2'}>2</li>, <Child key={'1'} />];

	return (
		<ul
			onClick={(e) => {
				console.log(e);

				setNumber(num + 1);
			}}
		>
			{arr}
		</ul>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
