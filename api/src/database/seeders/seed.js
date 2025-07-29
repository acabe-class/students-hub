import { Cohort } from "../models/cohort.model.js";
import { Track } from "../models/track.model.js";
import { sequelize } from "../config/database.js";
import { User } from "../models/User.model.js";

const data = {
  cohorts: [
    {
      name: ' "Cohort 1',
      start_date: "2025-07-29",
      end_date: "2025-09-30",
    },
  ],
  tracks: [
    {
      name: "Frontend Development",
      description: "Software development with HTML, CSS3, JavaSript and React",
    },
    {
      name: "Backend Development",
      description: "Software development with Node.js, Express, and JavaScript",
    },
    {
      name: "Cyber Security",
      description:
        "Ethical Hacking, Penetration Testing, and Digital Forensics",
    },
    {
      name: "Data Analysis",
      description: "Data analysis with Python, SQL, and Tableau",
    },
    {
      name: "UI/UX Design",
      description:
        "Designing user-friendly interfaces and experiences with Figma, Sketch, and Adobe XD",
    },
    {
      name: "Personal Branding",
      description:
        "Building a strong personal brand through social media, content creation, and networking",
    },
  ],
  admins: [
    {
      name: "Kingdom Ogbonnaya",
      email: "kingdomchikasiemobi@gmail.com",
      password: "seriously_$ecuR3",
      role: "admin",
    },
  ],
};

const seed = async () => {
  console.info(" 🌱 Starting database seeding operations...");

  try {
    await sequelize.authenticate();
    console.info(" 🔑 Database connection successful");
    await sequelize.sync({ alter: true });
    console.info(" 🔑 Database synchronization successful");

    await sequelize.transaction(async (transaction) => {
      await Cohort.bulkCreate(data.cohorts, { transaction });
      await Track.bulkCreate(data.tracks, { transaction });
      await User.bulkCreate(data.admins, { transaction });
    });
    console.info(" 🌱 Database seeding operations completed successfully");
    process.exit(0);
  } catch (error) {
    console.error(" 🚨 Database seeding operations failed:", error);
    process.exit(1);
  }
};

seed();
