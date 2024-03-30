import { ApiResponse } from "@nestjs/swagger";
import { responseError } from "../global/globalClass";

export const tokenErrorResponse = ApiResponse({
    status: 401, description: 'Invalid token or expired', schema: {
        example: new responseError(403, 'Invalid token or expired')
    }
});

export const serverErrorResponse = ApiResponse({
    status: 500, description: 'Internal server error', schema: {
        example: new responseError(500, 'Internal server error')
    }
});

export const permissionErrorResponse = ApiResponse({
    status: 403, description: 'Permission denied', schema: {
        example: new responseError(403, 'Permission denied')
    }
});

export const invalidIdResponse = ApiResponse({
    status: 400, description: 'Invalid id', schema: {
        example: new responseError(400, 'Invalid id')
    }
});