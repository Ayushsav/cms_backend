import { Sequelize } from "sequelize";
import dotenvconfig from "./dotenvconfig";

// Initialize Sequelize connection
const sequelize = new Sequelize(
  dotenvconfig.DB_NAME,
  dotenvconfig.DB_USER,
  dotenvconfig.DB_PASSWORD,
  {
    host: dotenvconfig.DB_HOST,
    dialect: "mysql",
  }
);

export default sequelize;
