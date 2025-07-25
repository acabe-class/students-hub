"use strict";
import fs from "fs";
import path from "path";
import process from "process";
import { sequelize } from "../config/database.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

const basename = path.basename(__filename);
const db = {};

// Initialize models
const initializeModels = async () => {
  const modelFiles = fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".js" &&
        file.indexOf(".test.js") === -1
      );
    });

  for (const file of modelFiles) {
    const filePath = new URL(file, import.meta.url).href;
    const modelModule = await import(filePath);
    const model = modelModule.default || modelModule;
    // Get the model name from the export (e.g., User, Profile, etc.)
    const modelName = Object.keys(modelModule).find(key => 
      modelModule[key] && typeof modelModule[key] === 'object' && modelModule[key].name
    );
    if (modelName) {
      db[modelName] = modelModule[modelName];
    }
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = sequelize.constructor;
};

const connectToDatabase = async () => {
  try {
    await initializeModels();
    await sequelize.authenticate();
    await sequelize.sync( { alter: true } );
    console.log( "Connection has been established successfully." );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export { db, connectToDatabase };
