import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function Child() {
	return <span>lallalalal</span>;
}

function App() {
	const [num, setNumber] = useState(0);

	return (
		<div onClick={() => setNumber(num + 1)}>
			{num % 2 === 0 ? <Child /> : <div>{num}</div>}
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
