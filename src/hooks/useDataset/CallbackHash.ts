import { v4 as uuid } from "uuid";

export type Callback<T> = (value: T) => void;

export class CallbackHash<T> {
  listeners: Map<string, Callback<T>>;

  constructor() {
    this.listeners = new Map();
  }
  addListener(listener: (value: T) => void) {
    let key = uuid();
    while (this.listeners.has(key)) {
      key = uuid();
    }

    this.listeners.set(key, listener);
    return key;
  }
  removeListener(key: string) {
    this.listeners.delete(key);
  }
  callListeners(value: T) {
    this.listeners.forEach((listener) => listener(value));
  }
}
