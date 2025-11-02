"use client";

import { Provider } from "react-redux";
import { store } from "../Store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
