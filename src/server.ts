import app from "./app";
import { Logger } from "./utils/chalk";
import env from "./constants/env.constant";
import ServerDataSource from "./configs/db.config";

const PORT = env.PORT || 3001;

ServerDataSource.initialize()
  .then(() => {
    Logger.success(`Database connected successfully`);

    app.listen(PORT, () => {
      Logger.success(`Server is running at PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    Logger.error(`Error while connecting database: ${error}`);
  });

