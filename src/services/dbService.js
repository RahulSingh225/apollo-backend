const { Pool } = require('pg');

class DbService {
  constructor() {
    this.pool = new Pool({
      user: 'apollodbadmin', // Replace with your PostgreSQL user
      host: '35.207.195.181', // Replace with your PostgreSQL host
      database: 'apollo', // Replace with your database name
      password: 'Test@123', // Replace with your PostgreSQL password
      port: 5432, // Replace with your PostgreSQL port, if different
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  async executeQuery(queryText, params = []) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(queryText, params);
      return res.rows;
    } catch (err) {
      console.error('Database query error:', err.stack);
      throw err;
    } finally {
      client.release();
    }
  }

  async executeTransaction(queries) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      for (const { queryText, params } of queries) {
        await client.query(queryText, params);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', err.stack);
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = new DbService();
