import React from "react";
import { RegisterReturn } from "../../../hooks/useDataset/useDataset.types";
import { DatasetInput } from "../InputWrapper/DatasetInput";

export type ImageArrayInputProps = RegisterReturn<string, string> & {
  label: string;
  data: string[];
};

export const ImageArrayInput: React.FC<ImageArrayInputProps> = ({
  data,
  label,
  onChange,
  value,
}) => {
  return (
    <DatasetInput label={label}>
      <ul className="flex flex-row gap-1 overflow-x-auto p-2 ">
        {data.map((file, id) => (
          <li key={id}>
            <img
              src={file}
              className={`w-16 h-16 cursor-pointer ${
                file === value && "ring-2"
              }`}
              onClick={() => onChange(file)}
            />
          </li>
        ))}
      </ul>
    </DatasetInput>
  );
};
