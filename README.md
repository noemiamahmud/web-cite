Web-Cite Backend API — README

This backend powers Web-Cite, an application that allows users to search PubMed, select an article, and generate an interactive “citation web” that visualizes related publications using embedding-based similarity.


npm install in both frontend/backend folders

npm run dev in frontend









Frontend teammates can use this document to understand:

how to authenticate users
how to search PubMed
how to request graph generation
how to retrieve and manage citation webs
which API endpoints are available
how responses are structured
what data you can expect to receive to render the UI

No backend setup steps are included here — this README is designed specifically for frontend development.

🔐 Authentication Overview

The system uses JWT (JSON Web Token) authentication.

A user must first sign up and then log in.
After logging in, the backend returns a JWT token.
All protected routes require this header:

Authorization: Bearer <token>

Endpoints
Method	Route	Description
POST	/api/auth/signup	Create a new user account
POST	/api/auth/login	Log in and receive JWT
Responses

Signup:
Returns { userId, email }

Login:
Returns { token }
→ Store this token in the frontend (e.g., localStorage).

🔍 PubMed Search & Article Retrieval

The backend provides two helper endpoints for fetching PubMed data.
These allow the frontend to implement the landing-page search experience.

Endpoints
Method	Route	Description
GET	/api/pubmed/search?q=...	Returns top PubMed matches for a query string
GET	/api/pubmed/:pmid	Returns full metadata for a PubMed article
Search Endpoint Behavior

/api/pubmed/search?q=depression returns:

pmid
title
authors
journal
publication year

Use this to populate search result lists.

Single Article Endpoint
/api/pubmed/:pmid returns:
pmid
title
abstract
keywords
MeSH terms
journal
year

When the user clicks a search result, you may optionally load additional details using this endpoint.

🧠 Graph Generation (Core Feature)

This is the core of the application — generating a “citation web” for a selected PubMed article.

The backend:

Fetches the root article metadata from PubMed
Extracts title + abstract + keywords + MeSH terms
Computes a local embedding vector from this text
Searches PubMed for semantically related articles
Computes embeddings for each candidate
Calculates cosine similarity between root and candidates
Picks the top 3–4 most similar
Builds a structured graph
Stores everything in MongoDB
Returns the complete graph to the frontend
This is all done automatically behind the scenes.

Create Web
Method	Route	Protected?	Description
POST	/api/webs	Yes	Generate a new citation graph
Request Body
{
  "rootPmid": "35216520",
  "title": "Major Depression and Recurrence",
  "description": "Testing graph creation using embeddings."
}

Response

Returns a complete graph containing:

root article
3–4 similar articles
nodes array
edges array
metadata for rendering

The frontend will use:

nodes → to draw graph nodes
edges → to draw connections
rootArticle → summary panel
title / description → page header

Each node contains an article ID; articles can be populated if needed.

🌐 Web Management Endpoints

These allow the user to manage their citation webs.

Method	Route	Protected?	    Description
GET	   /api/webs	Yes	         List all webs owned by the user
GET	   /api/webs/:id  Yes	     Load a specific citation web
PATCH	/api/webs/:id	Yes	     Update title/description
DELETE	/api/webs/:id	 Yes	 Delete a citation web

Web Object Structure

Every Web has:

_id
owner
title
description
rootArticle
nodes: [
  {
    article: <articleId>,
    position: { x, y }, // editable by frontend
    type: "publication"
  }
]
edges: [
  {
    from: <articleId>,
    to: <articleId>,
    relation: "keyword-similarity"
  }
]
createdAt
updatedAt

Articles

The Article model includes:

pmid
title
abstract
journal
year
keywords
meshTerms
embedding (vector)

If the frontend needs full article data for each node, the backend already supports population.

📘 How the Frontend Should Use the Backend
1. Landing Page

Call: /api/pubmed/search?q=query

Render results list

User selects one → navigate to “Create Web” page

2. Create a Web

POST /api/webs with rootPmid + title

Backend returns a full graph

Frontend redirects to graph viewer

3. Graph Viewer

Use the returned:

nodes → for graph layout

edges → for links

Each node’s article data → for article preview cards

rootArticle → highlight central node

4. User Dashboard

GET /api/webs
→ List all saved citation webs

Provide delete + edit options

5. View Web

GET /api/webs/:id
→ Render saved graphs exactly like newly created ones

📡 Authentication Requirements

All /api/webs routes require:

Authorization: Bearer <token>


PubMed routes are public and need no token.

🧩 Frontend Implementation Notes

Graph layout is entirely a frontend responsibility

Node position fields default to {0,0} and can be updated later

You may use libraries such as React Flow, Cytoscape.js, or D3.js

Article details are provided, so you can build detailed side-panels

The backend has no opinion on how the web is visually displayed

🧪 Recommended Frontend Components

SearchBar → calls PubMed /search

SearchResults → renders query results

WebCreator → posts to /api/webs

GraphView → renders nodes/edges

WebCard → used in dashboard

Dashboard → lists user’s saved webs

Auth pages → login/signup using /auth/* routes

🚀 Deployment Notes

Backend uses MongoDB

Requires environment variables (already handled in the backend repo)

Frontend only needs to know the public backend base URL

CORS is already enabled

JWT is required for all user-level operations
