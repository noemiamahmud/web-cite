const API_URL = import.meta.env.VITE_API_URL; //loads backend URL from environment vars

//for endpoints without login requirement  
export async function publicFetch(path: string, options: RequestInit = {}) {
    try {
        const res = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        // Check if the response is JSON
        try {
            return await res.json();
        } catch (jsonError) {
            throw new Error('Failed to parse JSON response');
        }
    } catch (error) {
        console.error("API request failed:", error);
        console.log("THIS IS THE URL: ", API_URL);
        throw error; // Re-throw the error to be handled at the calling point
    }
}


//for requests that require authentication 
export async function authFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}${path}`, {
        ...options, 
        headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });
    return res.json(); 
}