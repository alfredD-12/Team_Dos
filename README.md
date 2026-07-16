# Team Dos Directory

A polished, responsive full-stack directory built with Next.js. It includes live search, a create form, validation, loading and empty states, and a lightweight API.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

### Search or list items

```http
GET /api/items
GET /api/items?q=design
```

### Create an item

```http
POST /api/items
Content-Type: application/json

{
  "name": "Project brief",
  "category": "Strategy",
  "description": "Goals, scope, and milestones for the project."
}
```

> This demo stores data in server memory. New records reset whenever the development server restarts or a serverless instance is replaced.
