import React from "react";

import { H2 } from "storybook/internal/components";

import { styled } from "storybook/internal/theming";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
`;
export function ScanSettings() {
  return (
    <Wrapper>
      <H2>Scan Settings</H2>
      <p>Configure your scan settings here.</p>
    </Wrapper>
  );
}
