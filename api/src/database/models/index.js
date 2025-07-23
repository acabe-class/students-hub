"use strict";
import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import process from "process";
import config from "../../lib/config.lib.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

const basename = path.basename(__filename);
const env = config.getEnvironment();
const db = {};

let sequelize;
if (env === "production") {
  sequelize = new Sequelize(config.getOrThrow("DATABASE_URL"));
} else if (env === "development") {
  sequelize = new Sequelize(config.getOrThrow("DEV_DATABASE_URL"));
} else if (env === "test") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database/database.sqlite",
  });
} else {
  throw new Error(`Invalid environment: ${env}`);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const connectToDatabase = async () =>
{
  try {
    await sequelize.authenticate();
    await sequelize.sync( { alter: true } );
    console.log( "Connection has been established successfully." );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export { db, connectToDatabase };
