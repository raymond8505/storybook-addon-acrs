import { ArrowDownIcon } from "@storybook/icons";
import React, { FC, Fragment, useState } from "react";
import { styled } from "storybook/internal/theming";

type Item = {
  title: string;
  description: string;
};

interface ListItemProps {
  item: Item;
}

interface ListProps {
  items: Item[];
}

const ListWrapper = styled.ul({
  listStyle: "none",
  fontSize: 14,
  padding: 0,
  margin: 0,
});

const Wrapper = styled.div(({ theme }) => ({
  display: "flex",
  width: "100%",
  borderBottom: `1px solid ${theme.appBorderColor}`,
  "&:hover": {
    background: theme.background.hoverable,
  },
}));

const Icon = styled(ArrowDownIcon)(({ theme }) => ({
  height: 10,
  width: 10,
  minWidth: 10,
  color: theme.color.mediumdark,
  marginRight: 10,
  transition: "transform 0.1s ease-in-out",
  alignSelf: "center",
  display: "inline-flex",
}));

const HeaderBar = styled.div(({ theme }) => ({
  padding: theme.layoutMargin,
  paddingLeft: theme.layoutMargin - 3,
  background: "none",
  color: "inherit",
  textAlign: "left",
  cursor: "pointer",
  borderLeft: "3px solid transparent",
  width: "100%",

  "&:focus": {
    outline: "0 none",
    borderLeft: `3px solid ${theme.color.secondary}`,
  },
}));

const Description = styled.div(({ theme }) => ({
  padding: theme.layoutMargin,
  background: theme.background.content,
  fontFamily: theme.typography.fonts.mono,
  whiteSpace: "pre-wrap",
  textAlign: "left",
}));

export const ListItem: FC<ListItemProps> = ({ item }) => {
  const [open, onToggle] = useState(false);

  return (
    <Fragment>
      <Wrapper>
        <HeaderBar onClick={() => onToggle(!open)} role="button">
          <Icon
            style={{
              transform: `rotate(${open ? 0 : -90}deg)`,
            }}
          />
          {item.title}
        </HeaderBar>
      </Wrapper>
      {open ? <Description>{item.description}</Description> : null}
    </Fragment>
  );
};

export const List: FC<ListProps> = ({ items }) => (
  <ListWrapper>
    {items.map((item, idx) => (
      <ListItem key={idx} item={item}></ListItem>
    ))}
  </ListWrapper>
);
