import { CallbackHash } from "./CallbackHash";

export type UseDatasetParams<T> = {
  initialValue: T;
  onChange?: (dataset: T) => void;
};

export type Dataset = Record<string, unknown>;

export type RegisterReturn<I, V = string> = {
  onChange: (value: I) => void;
  value: V;
};

export type CallbackMap<D> = { [K in keyof D]: CallbackHash<D[K]> };

export type Callback<T> = (value: T) => void;
