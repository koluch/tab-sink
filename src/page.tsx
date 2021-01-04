import { h, render } from 'preact';

import App from './components/App/App';

import './index.scss';

const rootEl = document.getElementById('app');

if (rootEl == null) {
  throw new Error(`Unable to find app mounting point`);
}

render(<App />, rootEl);
