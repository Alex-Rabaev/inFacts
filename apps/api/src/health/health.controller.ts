import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { HealthStatus } from "@infacts/shared";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOkResponse({ description: "Service is healthy." })
  check(): HealthStatus {
    return {
      status: "ok",
      service: "infacts-api",
      timestamp: new Date().toISOString(),
    };
  }
}
