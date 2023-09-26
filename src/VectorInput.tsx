import React from "react";
import { useDataset } from "./hooks/useDataset/useDataset";

export type VectorInputProps = {
  onChange: (value: { x: number; y: number }) => void;
  value: { x: number; y: number };
};

export const VectorInput: React.FC<VectorInputProps> = ({
  onChange,
  value,
}) => {
  const { register } = useDataset<{ x: number; y: number }>({
    initialValue: {
      x: 0,
      y: 0,
    },
    onChange: (dataset) => {
      console.log("vinput", dataset);
      onChange(dataset);
    },
  });

  return (
    <>
      <input
        type="number"
        {...register(
          "x",
          (e) => Number(e.target.value),
          () => String(value.x)
        )}
      />
      <input
        type="number"
        {...register(
          "y",
          (e) => Number(e.target.value),
          () => String(value.y)
        )}
      />
    </>
  );
};
