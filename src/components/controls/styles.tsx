import { styled } from "storybook/internal/theming";

export const Fieldset = styled.fieldset<{ columns: number; sticky?: boolean }>`
  &,
  > * {
    display: grid;
    align-items: center;
  }

  grid-template-columns: repeat(${({ columns }) => columns}, 1fr) auto;
  gap: 10px;

  ${({ sticky }) =>
    // default (undefined) true
    sticky === false
      ? ""
      : `
    position: sticky;
    z-index: 1;
    top: 0;
    background: white;
  `}

  width: 100%;

  > * {
    grid-template-columns: auto 1fr;
  }

  > * > *:first-child {
    margin-right: 5px;
  }
`;
