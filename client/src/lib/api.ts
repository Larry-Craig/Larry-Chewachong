// Helper function to normalize the base URL and guarantee the /api path
const getBaseUrl = () => {
  // 1. Fallback default
  let rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // 2. Remove any surrounding quotes, whitespace, or leading slashes
  rawUrl = rawUrl.replace(/['"]+/g, "").trim().replace(/^\/+/, "");

  // 3. Guarantee proper protocol (prevents Next.js relative routing errors)
  if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
    rawUrl = `https://${rawUrl}`;
  }

  // 4. Safely construct the absolute URL
  try {
    const parsedUrl = new URL(rawUrl);
    let pathname = parsedUrl.pathname.replace(/\/+$/, "");

    if (!pathname.endsWith("/api")) {
      pathname = `${pathname}/api`;
    }

    return `${parsedUrl.origin}${pathname}`;
  } catch (error) {
    // Hardcoded fallback safety net
    return "https://larry-chewachong.onrender.com/api";
  }
};

const API_URL = getBaseUrl();

export async function fetchHealthCheck() {
  try {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error("Failed health check");
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function fetchSkills() {
  try {
    const res = await fetch(`${API_URL}/skills`);
    if (!res.ok) throw new Error("Failed fetching skills");
    return await res.json();
  } catch (error) {
    console.error("Skills API Error:", error);
    return { success: false, data: [] };
  }
}

export async function fetchProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error("Failed fetching projects");
    return await res.json();
  } catch (error) {
    console.error("Projects API Error:", error);
    return { success: false, data: [] };
  }
}

export async function sendContactMessage(data: { name: string; email: string; message: string }) {
  try {
    const url = `${API_URL}/contact`;
    console.log(`Sending to: ${url}`);
    
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log(`Response status: ${res.status} ${res.statusText}`);
    
    const contentType = res.headers.get("content-type");
    console.log(`Content-Type: ${contentType}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error Response: ${errorText.substring(0, 200)}...`);
      
      return { 
        success: false, 
        error: `Server responded with status ${res.status}`,
        details: errorText.substring(0, 100)
      };
    }

    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      const text = await res.text();
      console.error(`Expected JSON but got: ${text.substring(0, 100)}...`);
      return { 
        success: false, 
        error: "Server returned non-JSON response" 
      };
    }
  } catch (error) {
    console.error("Contact API Error:", error);
    return { success: false, error: "Failed to connect to backend server." };
  }
}