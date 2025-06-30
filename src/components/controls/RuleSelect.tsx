import { Select } from "antd";
import axe from "axe-core";
import React from "react";

export function RuleSelect({
  onChange,
  defaultValue = [],
}: {
  onChange: (value: string[]) => void;
  defaultValue?: string[];
}) {
  return (
    <Select
      defaultValue={defaultValue}
      options={axe
        .getRules()
        .map((rule) => ({ label: rule.ruleId, value: rule.ruleId }))}
      placeholder="Select Rules"
      mode="tags"
      onChange={onChange}
      allowClear={true}
    />
  );
}
