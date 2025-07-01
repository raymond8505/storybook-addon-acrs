import axe from "axe-core";
import { StoryEntry } from "storybook/internal/manager-api";

export interface Result {
  divs: DOMRect[];
  styled: DOMRect[];
}

export type AxeTableResult = axe.Result & {
  story?: StoryEntry;
  key: string;
  type: "Violation" | "Incomplete";
};
declare global {
  namespace React {
    // This makes React types (like JSX.Element) available globally
    namespace JSX {
      interface Element extends React.ReactElement<any, any> {}
      interface ElementClass extends React.Component<any> {}
    }
  }
}
