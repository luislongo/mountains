import React from "react";

export type DatasetItem = {
  label: string;
  children: React.ReactNode;
};

export const DatasetInput: React.FC<DatasetItem> = ({ label, children }) => {
  return (
    <li className="group">
      <label className="block text-sm group-hover:text-purple-400 mb-0.5">
        {label}
      </label>
      {children}
    </li>
  );
};
