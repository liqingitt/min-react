import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function Child() {
	const [num, setNumber] = useState(100);
	window.setNumber = setNumber;
	return <span>{num}</span>;
}

function App() {
	return (
		<div>
			<Child />
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
