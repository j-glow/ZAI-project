const { Sequelize } = require('sequelize');

const dbUrl = process.env.DATABASE_URL;
const dbSsl = process.env.DB_SSL === 'true';

const options = {
  dialect: 'postgres',
  logging: false,
};

if (dbSsl) {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = new Sequelize(dbUrl, options);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected...');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
