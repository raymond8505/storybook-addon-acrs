
import React from "react"

export function exposeParameters(Story,opts) {
  const parameters = {
    ...opts.parameters,
    hasPlay: !!opts.playFunction
  }
  window.storyParameters = parameters
  window.playFunction = opts.playFunction
  
  return <>
    <script type="application/json" id="storybook-parameters">{JSON.stringify(parameters)}</script>
    <Story />
  </>
  }