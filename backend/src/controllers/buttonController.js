const supabase = require('../config/supabase');

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

      // Use the stored function from Supabase
      const { data, error } = await supabase.rpc('increment_button_click', {
        button_name_param: buttonName
      });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      res.json({
        success: true,
        buttonName,
        clickCount: data,
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
      const { data, error } = await supabase
        .from('button_click_stats')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      res.json({
        success: true,
        data: data
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

      const { data, error } = await supabase
        .from('button_clicks')
        .select('*')
        .eq('button_name', buttonName)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            message: 'Button not found'
          });
        }
        console.error('Supabase error:', error);
        throw error;
      }

      res.json({
        success: true,
        data: data
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