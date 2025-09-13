// Simple test to verify database connection without external dependencies
const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });

async function testButtonClick() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: 'localhost', // Connect to localhost instead of container name
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Test incrementing a button click
    const result = await client.query(
      'SELECT increment_button_click($1) as new_count',
      ['download_resume']
    );

    console.log(`🎯 Button click result: ${result.rows[0].new_count}`);

    // Get all stats
    const stats = await client.query('SELECT * FROM button_click_stats');
    console.log('📊 Current button stats:');
    stats.rows.forEach(row => {
      console.log(`   ${row.button_name}: ${row.click_count} clicks (${row.recency})`);
    });

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.end();
  }
}

testButtonClick();