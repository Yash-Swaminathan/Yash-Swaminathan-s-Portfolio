const pool = require('../config/database');

const buttonController = {
  // Increment button click count
  async incrementClick(req, res) {
    try {
      const { buttonName } = req.body;

      if (!buttonName) {
        return res.status(400).json({
          success: false,
          message: 'Button name is required'
        });
      }

      // Use the stored function from our database
      const result = await pool.query(
        'SELECT increment_button_click($1) as new_count',
        [buttonName]
      );

      const newCount = result.rows[0].new_count;

      res.json({
        success: true,
        buttonName,
        clickCount: newCount,
        message: `Button '${buttonName}' clicked successfully`
      });

    } catch (error) {
      console.error('Error incrementing button click:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get all button click statistics
  async getClickStats(req, res) {
    try {
      const result = await pool.query('SELECT * FROM button_click_stats');

      res.json({
        success: true,
        data: result.rows
      });

    } catch (error) {
      console.error('Error fetching click stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get specific button stats
  async getButtonStats(req, res) {
    try {
      const { buttonName } = req.params;

      const result = await pool.query(
        'SELECT * FROM button_clicks WHERE button_name = $1',
        [buttonName]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Button not found'
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Error fetching button stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = buttonController;