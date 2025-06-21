import { styled } from "storybook/internal/theming";
import { Button } from "storybook/internal/components";

export const TabWrapper = styled.div(({ theme }) => ({
  background: theme.background.content,
  padding: "2rem 0 0",
  minWidth: "100%",
  boxSizing: "border-box",
  height: "100%",
  overflow: "hidden",
}));

export const TabInner = styled.div({
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "none",
  padding: "0 0 0 10vmin",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "stretch",
});

export const Sidebar = styled.div({
  width: "15%",
  height: "100%",
});

export const Reports = styled.div({
  width: "85%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "stretch",
});

export const View = styled.div({
  display: "flex",
  flexDirection: "row",
  height: "100%",
  width: "100%",
  overflow: "hidden",
  boxSizing: "border-box",
  position: "relative",
  gap: "10px",
});

export const ReportTypeTabs = styled.div({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  marginBottom: "10px",
  justifyContent: "flex-start",
  gap: "2px",
  justifySelf: "flex-start",
});

export const TabButton = styled(Button)<{ active?: boolean }>(({ active }) => ({
  flexGrow: 0,
  textAlign: "center",
  fontWeight: active ? "bold" : "normal",
  backgroundColor: active ? "#e0e0e0" : "transparent",
  borderBottom: active ? "2px solid #007bff" : "none",
  color: active ? "#007bff" : "#000",
  cursor: "pointer",
  padding: "10px",
  marginRight: "5px",
  "&:last-child": {
    marginRight: "0",
  },
}));

export const ReportsList = styled.ul({
  listStyle: "none",
  padding: 0,
  margin: "10px 0 0",
  overflowY: "auto",
  height: "calc(100% - 50px)",
  li: {
    marginBottom: "5px",
    "&:last-child": {
      marginBottom: "0",
    },
  },
});
export const ReportButton = styled.button<{ active?: boolean }>(
  ({ active }) => ({
    width: "100%",
    textAlign: "left",
    backgroundColor: active ? "#e0e0e0" : "transparent",
    color: active ? "#007bff" : "#000",
    padding: "5px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: active ? "#d0d0d0" : "#f0f0f0",
    },
    fontSize: "13px",
    border: "none",
    borderBottom: "1px solid #dedede",
    marginBottom: "5px",
  }),
);
