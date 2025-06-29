import { Select } from "antd";
import axe from "axe-core";

export function RuleSelect({}) {
  return (
    <Select
      options={axe
        .getRules()
        .map((rule) => ({ label: rule.ruleId, value: rule.ruleId }))}
      placeholder="Select Rules"
      mode="tags"
      onChange={(value) => {
        setRuleFilters(value);
      }}
      allowClear={true}
    />
  );
}
