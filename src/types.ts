export interface Result {
  divs: DOMRect[];
  styled: DOMRect[];
}
declare global {
  namespace React {
    // This makes React types (like JSX.Element) available globally
    namespace JSX {
      interface Element extends React.ReactElement<any, any> {}
      interface ElementClass extends React.Component<any> {}
    }
  }
}
