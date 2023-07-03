import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get("user-agent") || "";

    res.on("finish", () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length");

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} — ${userAgent} ${ip}`
      );

      if (method !== "GET") {
        this.logger.debug(
          `Request body — ${JSON.stringify(req.body, null, 2)}`
        );
      }
    });

    next();
  }
}
