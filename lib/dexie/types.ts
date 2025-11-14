export interface AuthUserType {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
    isActive: boolean;
    createdAt: string;
}

export interface AuthStateType {
    user?: AuthUserType;
    isAuthenticated?: boolean;
    token?: string;
    forgetVerificationToken?: string;
    notificationCount?: {
        total: number;
    };
    refreshToken?: string;
}

export const initialAuthState: AuthStateType = {
    user: undefined,
    token: "",
    isAuthenticated: false,
    forgetVerificationToken: "",
};

export interface Task {
    id?: string;
    title: string;
    description?: string;
    date: string;
    time: string;
    jiraLink?: string;
    status: "Todo" | "In Progress" | "Done";
    category?: string;
}

export type DexieUser = {
    userId: string;
    email: string;
    name: string;
    picture?: string;
    created?: Date;
};
