const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:8081/api").trim();

async function fetchModel(url) {
  try {
    const fullUrl = `${API_BASE_URL}${url}`;
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      console.error("JSON Parse Error. The server might be sleeping or returning HTML.", text.substring(0, 200));
      return null;
    }
  } catch (error) {
    console.error("Error fetching model:", error);
    return null;
  }
}

export default fetchModel;
