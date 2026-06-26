import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { ApiErrorBody } from "@infacts/shared";

interface ResponseLike {
  status(code: number): ResponseLike;
  json(body: unknown): void;
}

function codeForStatus(status: number): string {
  return HttpStatus[status] ?? "ERROR";
}

/** Global filter returning the uniform error envelope `{ error: { code, message, details? } }` (AD-5). */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<ResponseLike>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = "Internal server error";
    let details: unknown;

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      if (typeof payload === "string") {
        message = payload;
      } else if (payload && typeof payload === "object") {
        const obj = payload as Record<string, unknown>;
        if (typeof obj.message === "string") {
          message = obj.message;
        } else if (Array.isArray(obj.message)) {
          message = obj.message.join(", ");
          details = obj.message;
        } else {
          message = exception.message;
        }
      }
    }

    const body: ApiErrorBody = {
      error: { code: codeForStatus(status), message, details },
    };
    res.status(status).json(body);
  }
}
