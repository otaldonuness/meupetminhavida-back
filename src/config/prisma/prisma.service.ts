import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === "prod") {
      return;
    }
    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === "string" && /^[a-z]+$/.test(key)
    );
    return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }
}
