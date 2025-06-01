
import React from "react"
import { DecoratorFunction } from "storybook/internal/types";

declare global {
  interface Window {
    storyParameters: Record<string, any>;
    playFunction?: () => void;
  }
}
export const exposeParameters:DecoratorFunction = (Story,opts) => {
  const parameters = {
    ...opts.parameters,
    hasPlay: !!opts.playFunction
  }
  window.storyParameters = parameters
  window.playFunction = opts.playFunction

  return <>
    <script type="application/json" id="storybook-parameters">{JSON.stringify(parameters)}</script>
    {Story() as React.ReactElement}
  </>
  }