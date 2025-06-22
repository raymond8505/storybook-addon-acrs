import { ReactRenderer } from "@storybook/react/*";
import React from "react";
import { DecoratorFunction, PlayFunction } from "storybook/internal/types";

declare global {
  interface Window {
    storyParameters: Record<string, unknown>;
    playFunction?: ({
      canvasElement,
    }: {
      canvasElement: HTMLElement;
    }) => Promise<void>;
  }
}
export const exposeParameters: DecoratorFunction = (Story, opts) => {
  const parameters = {
    ...opts.parameters,
    hasPlay: !!opts.playFunction,
  };
  window.storyParameters = parameters;
  window.playFunction = opts.playFunction;

  return (
    <>
      <script type="application/json" id="storybook-parameters">
        {JSON.stringify(parameters)}
      </script>
      {Story() as React.ReactElement}
    </>
  );
};

export const instantTransitions: DecoratorFunction = (Story) => {
  return (
    <>
      <style type="text/css">{`
        * {
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        -webkit-transition-duration: 0s !important;
        -webkit-transition-delay: 0s !important;
        -moz-transition-duration: 0s !important;
        -moz-transition-delay: 0s !important;
        -o-transition-duration: 0s !important;
        -o-transition-delay: 0s !important;
        -ms-transition-duration: 0s !important;
        -ms-transition-delay: 0s !important;

        animation-duration: 0s !important;
        animation-delay: 0s !important;
        -webkit-animation-duration: 0s !important;
        -webkit-animation-delay: 0s !important;
        -moz-animation-duration: 0s !important;
        -moz-animation-delay: 0s !important;
        -o-animation-duration: 0s !important;
        -o-animation-delay: 0s !important;
        -ms-animation-duration: 0s !important;
        -ms-animation-delay: 0s !important; 
        }
      `}</style>
      {Story() as React.ReactElement}
    </>
  );
};
