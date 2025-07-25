import { server } from "./app.setup.js";
import { connectToDatabase } from "./database/models/index.js";
import config from "./lib/config.lib.js";

(async () => {
  try
  {
    const port = parseInt(config.getOrThrow("PORT"));
    await connectToDatabase();
    server.listen(port, () => {
      console.info(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
// 