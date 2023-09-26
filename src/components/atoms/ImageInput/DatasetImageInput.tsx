import React from "react";
import { RegisterReturn } from "../../../hooks/useDataset/useDataset.types";
import { DatasetInput } from "../InputWrapper/DatasetInput";

export type DatasetImageInputProps = RegisterReturn<
  File | undefined,
  File | undefined
> & {
  label: string;
};

export const DatasetImageInput: React.FC<DatasetImageInputProps> = ({
  onChange,
  value,
  label,
}) => {
  return (
    <DatasetInput label={label}>
      <input
        type="file"
        accept="image/png"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
      {value && <img src={URL.createObjectURL(value)} />}
    </DatasetInput>
  );
};
