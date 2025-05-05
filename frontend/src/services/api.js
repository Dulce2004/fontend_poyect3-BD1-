export const fetchReportData = async (endpoint, filters) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:8000${endpoint}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };