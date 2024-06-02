import express, { Request, Response } from "express";
import winston from "winston";
import { createUserEndpoint, loginEndpoint, verifyEmailEndpoint } from "./userEndpoints";
import { useAlreadyVerified } from "./middlewares/alreadyVerified";

const app = express();
const port = process.env.PORT || 3000;
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  // Use timestamp and printf to create a standard log format
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info: any) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
  // Log to the console and a file
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "express!" });
});

app.get("/user.verify", useAlreadyVerified, verifyEmailEndpoint);

app.post("/user.register", createUserEndpoint);

app.post("/user.token", loginEndpoint);

app.listen(port, () => {
  logger.log("info", `server running at http://localhost:`, port);
});
