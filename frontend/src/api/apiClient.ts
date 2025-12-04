const API_URL = import.meta.env.VITE_API_URL; //loads backend URL from environment vars

//for endpoints without login requirement  
export async function publicFetch(path: string, options: RequestInit = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options, 
        headers: {
            "Content-Type": "application/json", 
            ...(options.headers || {}),
        },
    });
    return res.json();
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