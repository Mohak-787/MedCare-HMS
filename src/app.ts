import express, { Request, Response, Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import apiRoutes from "./routes/index.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.middleware";

const app: Application = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is healthy.");
});

app.use("/api", apiRoutes);

app.use(globalErrorHandler);

export default app;