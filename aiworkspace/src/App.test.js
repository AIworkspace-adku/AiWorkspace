import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { act } from 'react';

test('renders learn react link', () => {
	act(() => {
		render(
			<BrowserRouter>
				<App />
			</BrowserRouter>
		);
	});
});
