"use client";

import { type ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import apiService from "@/lib/api/core";
import { persistor, store } from "@/lib/redux/store";

function syncApiAuthFromStore() {
  apiService.setAuthToken(store.getState().auth.token);
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={syncApiAuthFromStore}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
