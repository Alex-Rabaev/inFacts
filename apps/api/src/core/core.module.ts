import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

/** Cross-cutting providers (AD-3): the single PrismaClient instance. */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CoreModule {}
