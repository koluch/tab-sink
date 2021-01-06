import { h, render } from 'preact';

import './index.scss';

import App from './components/App/App';

const rootEl = document.getElementById('app');

if (rootEl == null) {
  throw new Error(`Unable to find app mounting point`);
}

render(<App />, rootEl);
