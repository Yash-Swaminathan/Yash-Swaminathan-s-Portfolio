const API_BASE_URL = 'http://localhost:3001/api/buttons';

export interface ButtonStats {
  id: string;
  button_name: string;
  click_count: number;
  last_clicked: string;
  created_at: string;
  updated_at: string;
}

export interface ClickResponse {
  success: boolean;
  buttonName: string;
  clickCount: number;
  message: string;
}

export interface StatsResponse {
  success: boolean;
  data: ButtonStats;
}

export class ButtonService {
  static async incrementClick(buttonName: string): Promise<ClickResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buttonName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error incrementing click:', error);
      throw error;
    }
  }

  static async getButtonStats(buttonName: string): Promise<StatsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/${buttonName}/stats`);

      if (!response.ok) {
        if (response.status === 404) {
          // Button doesn't exist yet
          return {
            success: false,
            data: {
              id: '',
              button_name: buttonName,
              click_count: 0,
              last_clicked: '',
              created_at: '',
              updated_at: ''
            }
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching button stats:', error);
      throw error;
    }
  }
}