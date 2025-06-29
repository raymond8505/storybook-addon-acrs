import { Select } from "antd";
import axe from "axe-core";
import React from "react";

export interface TagSElectProps {
  onChange?: (value: string[]) => void;
  extraOptions?: { label: string; value: string }[] | string[];
  defaultValue?: string[];
}
export function TagSelect({
  onChange,
  extraOptions = [],
  defaultValue = [],
}: TagSElectProps) {
  const extraOptionsObjects =
    typeof extraOptions[0] === "string"
      ? extraOptions.map((tag) => ({
          label: tag as string,
          value: tag as string,
        }))
      : (extraOptions as { label: string; value: string }[]);
  return (
    <Select
      defaultValue={defaultValue}
      options={axe
        .getRules()
        .flatMap((rule) => rule.tags)
        .filter((tag, index, self) => self.indexOf(tag) === index)

        .map((tag) => ({
          label: tag,
          value: tag,
        }))
        .concat(extraOptionsObjects)}
      placeholder="Select Tags"
      mode="tags"
      onChange={onChange}
      allowClear={true}
    />
  );
}
