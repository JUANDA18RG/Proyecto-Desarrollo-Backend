const { Client } = require('pg');

class Database {
  constructor() {
    this.client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'BookFinder',
      password: 'Acos306254',
      port: 5432,
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log('Disconnected from the database');
    } catch (error) {
      console.error('Error disconnecting from the database:', error);
    }
  }

  async getBooks() {
    try {
      const queryResult = await this.client.query('SELECT * FROM Books');
      return queryResult.rows;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }
}

module.exports = Database;
