import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Cohort = sequelize.define("Cohort", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: "cohorts",
    timestamps: true
});