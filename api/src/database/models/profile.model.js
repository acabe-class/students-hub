import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";
import { Track } from "./track.model.js";

export const Profile = sequelize.define('Profile', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id"
        }
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    picture_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    track_id: {
        type: DataTypes.UUID,
        references: {
            model: Track,
            key: "id"
        }
    }
});