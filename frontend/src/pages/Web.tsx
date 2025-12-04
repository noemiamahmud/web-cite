import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authFetch } from "../api/apiClient";

function Web() {
    const { pmid } = useParams();
    const [webData, setWebData] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchWeb() {
            if (!pmid) return;
            try {
                const payload = {
                    rootPmid: pmid, 
                    title: `Web for PMID ${pmid}`, 
                }
                console.log("payload", payload);
                const data = await authFetch("/api/webs", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
                console.log("Fetched web data:", data);
                setWebData(data.web);
            } catch (err) {
                console.error("Error fetching web:", err);
                setError("Failed to fetch web");
            }
        }

        fetchWeb();
    }, [pmid]);

    if (error) return <p>{error}</p>;
    if (!webData) return <p>No data returned</p>;

    return (
    <div>
      <h2>Web Data for PMID: {pmid}</h2>
      <pre>{JSON.stringify(webData, null, 2)}</pre>
    </div>
    );
}

export default Web;
