import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get("DATABASE_URL"),
        },
      },
    });
    this.configService = configService;
  }

  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }

  async cleanDatabase() {
    if (this.configService.get("NODE_ENV") === "prod") {
      return;
    }
    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === "string" && /^[a-z]+$/.test(key)
    );
    return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }
}
