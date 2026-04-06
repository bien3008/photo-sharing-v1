const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function fetchModel(url) {
  try {
    const fullUrl = `${API_BASE_URL}${url}`;
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching model:", error);
    return null;
  }
}

export default fetchModel;
