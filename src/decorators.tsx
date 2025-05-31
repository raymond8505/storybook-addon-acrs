
import React from "react"

export function exposeParameters(Story,{parameters}) {
  window.storyParameters = parameters
  
  return <>
    <script type="application/json" id="storybook-parameters">{JSON.stringify(parameters)}</script>
    <Story />
  </>
  }