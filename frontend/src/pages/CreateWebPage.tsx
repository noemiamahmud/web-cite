import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createWeb } from "../api/webs";

export default function CreateWebPage() {
  const { pmid } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  async function handleCreate() {
    const result = await createWeb(pmid!, title, description);
    navigate(`/web/${result.web._id}`);
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Web for PMID: {pmid}</h2>

      <input
        placeholder="Web title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleCreate}>Create Web</button>
    </div>
  );
}
