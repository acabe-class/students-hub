import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";
import { Track } from "./track.model.js";

export const ScholarshipApplication = sequelize.define("ScholarshipApplication", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id"
    }
  },
  track_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Track,
      key: "id"
    }
  },
  personal_statement: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  academic_background: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  financial_need: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'under_review'),
    defaultValue: 'pending',
    allowNull: false,
  },
  reviewer_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reviewed_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: "id"
    }
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: "scholarship_applications",
  timestamps: true
});
