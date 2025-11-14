export const CACHE_TIME = 1000 * 60 * 60 * 24;
export const STALE_TIME = 1000 * 60 * 5;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    CONNECTION_TIMED_OUT: 599,
    SUCCESS: 200,
} as const;

export const HTTP_METHODS = {
    POST: "POST",
    GET: "GET",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
} as const;
