declare module '*.module.scss' {
  const __map: { [key: string]: string };
  export default __map;
}

declare module '*.svg' {
  export const ReactComponent: () => preact.JSX.Element;
  const __url: string;
  export default __url;
}
