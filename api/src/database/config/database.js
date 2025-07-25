import Sequelize from "sequelize";
import config from "../../lib/config.lib.js";

const env = config.getEnvironment();

let sequelize;
if (env === "production") {
  sequelize = new Sequelize(config.getOrThrow("DATABASE_URL"));
} else if (env === "development") {
  // For development, use SQLite as fallback if DEV_DATABASE_URL is not set
  try {
    sequelize = new Sequelize(config.getOrThrow("DEV_DATABASE_URL"));
  } catch (error) {
    console.log("DEV_DATABASE_URL not found, using SQLite for development");
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "./database.sqlite",
    });
  }
} else if (env === "test") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database/database.sqlite",
  });
} else {
  throw new Error(`Invalid environment: ${env}`);
}

export { sequelize }; 