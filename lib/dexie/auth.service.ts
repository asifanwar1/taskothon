import { db } from "./dexie.db";
import type { AuthUserType, DexieUser } from "./types";

const mapUserLoginToDexieUser = (
    userId: string | null,
    userLogin: unknown
): DexieUser | null => {
    if (!userId) {
        return null;
    }

    if (typeof userLogin !== "object" || userLogin === null) {
        return {
            userId,
            email: "",
            name: "",
            picture: undefined,
            created: undefined,
        };
    }

    const maybe = userLogin as { email?: unknown; name?: unknown };
    const email = typeof maybe.email === "string" ? maybe.email.trim() : "";
    const name = typeof maybe.name === "string" ? maybe.name.trim() : "";

    return {
        userId,
        email: email || "",
        name: name || email.split("@")[0] || "",
        picture: undefined,
        created: undefined,
    };
};

export const dexieAuthService = {
    initiateLogin: async (): Promise<void> => {
        try {
            await db.cloud.sync();
        } catch (error) {
            console.error("Sync error:", error);
            throw error;
        }
    },

    handleUserInteraction: async (
        params: Record<string, string>
    ): Promise<void> => {
        const ui = db.cloud.userInteraction.value;
        if (ui && ui.onSubmit) {
            await ui.onSubmit(params);
        }
    },

    signOut: async (): Promise<void> => {
        try {
            await db.cloud.logout();
        } catch (error) {
            console.error("Sign out error:", error);
            throw error;
        }
    },

    getCurrentUser: (): DexieUser | null => {
        const currentUserId = db.cloud.currentUserId;

        if (!currentUserId || currentUserId === "unauthorized") {
            return null;
        }

        const userLogin = db.cloud.currentUser?.value;

        if (typeof userLogin !== "object" || userLogin === null) {
            return {
                userId: currentUserId,
                email: "",
                name: "",
                picture: undefined,
                created: undefined,
            };
        }

        return mapUserLoginToDexieUser(currentUserId, userLogin);
    },

    onAuthStateChanged: (
        callback: (user: DexieUser | null) => void
    ): (() => void) => {
        const subscription = db.cloud.currentUser.subscribe((userLogin) => {
            const userId = db.cloud.currentUserId;
            const user =
                userId && userId !== "unauthorized"
                    ? mapUserLoginToDexieUser(userId, userLogin)
                    : null;
            callback(user);
        });

        const currentUserId = db.cloud.currentUserId;
        const userLogin = db.cloud.currentUser?.value;
        const user =
            currentUserId && currentUserId !== "unauthorized"
                ? mapUserLoginToDexieUser(currentUserId, userLogin)
                : null;
        callback(user);

        return () => {
            subscription.unsubscribe();
        };
    },

    mapUserToAuthUser: (user: DexieUser | null): AuthUserType | null => {
        if (!user) {
            return null;
        }

        return {
            id: user.userId,
            email: user.email,
            name: user.name || user.email.split("@")[0],
            avatar: user.picture || null,
            isActive: true,
            createdAt: user.created?.toISOString() || new Date().toISOString(),
        };
    },
};
