import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders learn react link', () => {
	render(
		<BrowserRouter>
			<App />
		</BrowserRouter>
	);
	// You can add assertions here to check if the correct elements are rendered
});
