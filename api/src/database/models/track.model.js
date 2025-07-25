import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Track = sequelize.define("Track", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "tracks",
    timestamps: true
});