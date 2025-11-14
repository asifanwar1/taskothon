import { useSyncExternalStore } from "react";
import { dexieAuthService } from "@/lib/dexie/auth.service";
import type { DexieUser } from "@/lib/dexie/types";

type AuthState = {
    user: DexieUser | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
};

const INITIAL_AUTH_STATE: AuthState = {
    user: null,
    isAuthenticated: false,
    isInitialized: false,
};

let authState: AuthState = INITIAL_AUTH_STATE;

let authListeners = new Set<() => void>();

const notifyListeners = (): void => {
    authListeners.forEach((listener) => listener());
};

const subscribeToAuth = (callback: () => void): (() => void) => {
    authListeners.add(callback);

    if (!authState.isInitialized) {
        const currentUser = dexieAuthService.getCurrentUser();
        authState = {
            user: currentUser,
            isAuthenticated: currentUser !== null,
            isInitialized: true,
        };
        notifyListeners();
    }

    const unsubscribe = dexieAuthService.onAuthStateChanged((user) => {
        const prev = authState;
        const next: AuthState = {
            user,
            isAuthenticated: user !== null,
            isInitialized: true,
        };

        const changed =
            prev.isInitialized !== next.isInitialized ||
            prev.isAuthenticated !== next.isAuthenticated ||
            (prev.user?.userId ?? null) !== (next.user?.userId ?? null);

        authState = next;

        if (changed) {
            notifyListeners();
        }
    });

    return () => {
        unsubscribe();
        authListeners.delete(callback);
    };
};

const getAuthSnapshot = (): AuthState => {
    if (!authState.isInitialized) {
        const currentUser = dexieAuthService.getCurrentUser();
        authState = {
            user: currentUser,
            isAuthenticated: currentUser !== null,
            isInitialized: true,
        };
    }
    return authState;
};

const getServerSnapshot = (): AuthState => {
    return INITIAL_AUTH_STATE;
};

export const useAuth = () => {
    const state = useSyncExternalStore(
        subscribeToAuth,
        getAuthSnapshot,
        getServerSnapshot
    );

    return {
        user: state.user,
        isAuthenticated: state.isAuthenticated && state.isInitialized,
        isInitialized: state.isInitialized,
        isLoading: !state.isInitialized,
    };
};
