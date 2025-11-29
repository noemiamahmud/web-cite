Web-Cite is a full-stack web app for searching PubMed articles, generating research "webs" (node graphs of related papers), and saving them to a user account.

- `backend/` – Node.js + Express + MongoDB API (auth, PubMed search, webs)
- `frontend/` – Front-end client (React or other) built by the UI team

The backend exposes REST API endpoints under `/api/*` for the frontend team.