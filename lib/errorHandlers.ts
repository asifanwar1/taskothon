import { showToast } from "./toast";
import { HTTP_STATUS } from "../constants/Api";
import { APP_ROUTES } from "../constants/Routes";
import { dexieAuthService } from "./dexie/auth.service";
import {
    GENERIC_ERROR_MESSAGE,
    NETWORK_ERROR_MESSAGE,
    UNAUTHORIZED_ERROR_MESSAGE,
} from "../constants/ValidationMessages";

const networkRequestErrorHandler = (
    error: unknown,
    fallbackMessage = GENERIC_ERROR_MESSAGE
): void => {
    let status: number | undefined;
    let errorMessage = fallbackMessage;

    if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
            response?: {
                status: number;
                data: { Message?: string; error?: Record<string, string> };
            };
            Message: string;
        };
        status = axiosError.response?.status;
        errorMessage = axiosError.response?.data?.Message || fallbackMessage;

        if (status === HTTP_STATUS.UNAUTHORIZED) {
            void dexieAuthService.signOut();
            if (window.location.pathname !== APP_ROUTES.SIGNIN) {
                window.location.href = APP_ROUTES.SIGNIN;
            }
            showToast.error(UNAUTHORIZED_ERROR_MESSAGE);
            return;
        }
        showToast.error(errorMessage);
    } else if (
        typeof error === "object" &&
        error !== null &&
        "request" in error
    ) {
        showToast.error(NETWORK_ERROR_MESSAGE);
    } else if (error instanceof Error) {
        showToast.error(error.message);
    } else {
        showToast.error(fallbackMessage);
    }
};
export { networkRequestErrorHandler };
