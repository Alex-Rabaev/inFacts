import { Injectable } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";
import { CoreModule } from "./core.module";
import { PrismaService } from "./prisma.service";

@Injectable()
class ConsumerA {
  constructor(public readonly prisma: PrismaService) {}
}

@Injectable()
class ConsumerB {
  constructor(public readonly prisma: PrismaService) {}
}

describe("CoreModule / PrismaService", () => {
  it("provides a single shared PrismaService instance (AD-3)", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [ConsumerA, ConsumerB],
    }).compile();

    const a = moduleRef.get(ConsumerA);
    const b = moduleRef.get(ConsumerB);

    // PrismaClient instances are Proxies: avoid instanceof / assertion
    // serialization and compare identity directly.
    expect(typeof a.prisma.$disconnect).toBe("function");
    expect(Object.is(a.prisma, b.prisma)).toBe(true);
    expect(Object.is(a.prisma, moduleRef.get(PrismaService))).toBe(true);
  });

  it("exposes the User and RefreshToken model delegates", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    const prisma = moduleRef.get(PrismaService);
    expect(prisma.user).toBeDefined();
    expect(prisma.refreshToken).toBeDefined();
  });
});
