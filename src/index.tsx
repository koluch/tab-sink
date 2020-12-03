import { h, render } from 'preact';
import { TabItem } from './types';
import App from './components/App';

const rootEl = document.getElementById('app');

if (rootEl == null) {
  throw new Error(`Unable to find app mounting point`);
}

render(<App />, rootEl);
