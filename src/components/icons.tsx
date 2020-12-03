import { h } from 'preact';

export function CrossIcon(props: { color: string }): preact.JSX.Element {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 5L9.5 0.5M5 5L0.5 0.5M5 5L0.5 9.5M5 5L9.5 9.5"
        stroke={props.color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
