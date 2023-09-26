import React, { InputHTMLAttributes } from "react";
import { RegisterReturn } from "../../../hooks/useDataset/useDataset.types";
import { DatasetInput } from "../InputWrapper/DatasetInput";

export type DatasetRangeInputProps = RegisterReturn<number, string> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
    label: string;
    onChange: (value: number) => void;
  };

export const DatasetRangeInput: React.FC<DatasetRangeInputProps> = ({
  label,
  onChange,
  value,
  ...rest
}) => {
  return (
    <DatasetInput label={label}>
      <div className="flex flex-row gap-4">
        <input
          type="range"
          onChange={(e) => onChange(Number(e.target.value))}
          value={value}
          {...rest}
          className="w-full"
        />
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          {...rest}
        />
      </div>
    </DatasetInput>
  );
};
