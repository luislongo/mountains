import React from "react";
import { useDataset } from "./hooks/useDataset/useDataset";

export type DatasetListProps<T> = {
  values: T[];
  onChange: (data: T) => void;
};

export const DatasetList = <T,>({ values }: DatasetListProps<T>) => {
  useDataset({
    initialValue: {
      nrOfLayers: "10",
    },
  });

  return (
    <div>
      {values.map((_, id) => (
        <button key={id}>id</button>
      ))}
    </div>
  );
};
