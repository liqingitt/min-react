import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function Child() {
	return <span>lallalalal</span>;
}

function App() {
	const [num, setNumber] = useState(100);
	window.setNumber = setNumber;
	return <div>{num === 3 ? <Child /> : <div>{num}</div>}</div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
