import { User } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useReducer } from "react";

const USER_STORAGE_KEY = "@drksde_user";
const TOKEN_STORAGE_KEY = "@drksde_token";

type UserState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
};

type UserAction =
  | { type: "LOGIN"; user: User; token: string }
  | { type: "LOGOUT" }
  | { type: "HYDRATE"; user: User | null; token: string | null };

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

const initialState: UserState = {
  user: null,
  token: null,
  hydrated: false,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "HYDRATE":
      return {
        user: action.user,
        token: action.token,
        hydrated: true,
      };

    case "LOGIN":
      return {
        user: action.user,
        token: action.token,
        hydrated: true,
      };

    case "LOGOUT":
      return {
        user: null,
        token: null,
        hydrated: true,
      };

    default:
      return state;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  /* ---------------- LOAD USER ON APP START ---------------- */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const [userJson, token] = await Promise.all([
          AsyncStorage.getItem(USER_STORAGE_KEY),
          AsyncStorage.getItem(TOKEN_STORAGE_KEY),
        ]);

        dispatch({
          type: "HYDRATE",
          user: userJson ? JSON.parse(userJson) : null,
          token,
        });
      } catch (err) {
        console.error("LOAD USER ERROR:", err);
        dispatch({ type: "HYDRATE", user: null, token: null });
      }
    };

    loadUser();
  }, []);

  /* ---------------- SAVE USER ON CHANGE ---------------- */
  useEffect(() => {
    if (!state.hydrated) return;

    const persist = async () => {
      try {
        if (state.user && state.token) {
          await AsyncStorage.multiSet([
            [USER_STORAGE_KEY, JSON.stringify(state.user)],
            [TOKEN_STORAGE_KEY, state.token],
          ]);
        } else {
          await AsyncStorage.multiRemove([USER_STORAGE_KEY, TOKEN_STORAGE_KEY]);
        }
      } catch (err) {
        console.error("SAVE USER ERROR:", err);
      }
    };

    persist();
  }, [state.user, state.token, state.hydrated]);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
