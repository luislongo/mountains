import { useEffect, useRef, useState } from "react";
import { Callback, CallbackHash } from "./CallbackHash";

type UseDatasetParams<T> = {
  initialValue: T;
  onChange?: (dataset: T) => void;
};

type Dataset = Record<string, unknown>;

type RegisterReturn<D, K extends keyof D, I = D[K], V = string> = {
  onChange: (value: I) => void;
  value: V;
};

type CallbackMap<D> = { [K in keyof D]: CallbackHash<D[K]> };

export const useDataset = <D extends Dataset>({
  initialValue,
  onChange,
}: UseDatasetParams<D>) => {
  const [dataset, setDataset] = useState<D>(initialValue);
  const listeners = useRef<CallbackMap<D>>({} as CallbackMap<D>);

  useEffect(() => {
    onChange?.(dataset);
  }, [dataset]);

  const useOnValueChange = <K extends keyof D>(
    key: K,
    callback: Callback<D[K]>
  ) => {
    useEffect(() => {
      if (!listeners.current?.[key]) {
        listeners.current[key] = new CallbackHash();
      }

      const uuid = listeners.current?.[key].addListener(callback);

      return () => {
        listeners.current?.[key].removeListener(uuid);
      };
    });
  };

  const register = <K extends keyof D, I = D[K], V = string>(
    key: K,
    parser: (value: I) => D[K] = (value) => value as D[K],
    valueParser: ((value: D[K]) => V) | undefined = undefined
  ): RegisterReturn<D, K, I, V> => {
    const onChange = (value: I) => {
      setDataset((prev: D) => {
        const parsedValue = parser(value);
        if (parsedValue === prev[key]) return prev;

        listeners.current?.[key]?.callListeners(parsedValue);
        return {
          ...prev,
          [key]: parsedValue,
        };
      });
    };

    if (!valueParser)
      return {
        onChange,
        value: dataset[key] as unknown as V,
      };

    return {
      onChange,
      value: valueParser(dataset[key]),
    };
  };

  return {
    register,
    useOnValueChange,
  };
};
