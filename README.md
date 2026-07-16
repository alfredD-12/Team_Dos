# Team Dos Image Upload

A simple Next.js page that uploads one image to Gyazo and displays the uploaded image.

## Setup

Create a `.env.local` file in the project root:

```env
GYAZO_ACCESS_TOKEN=your_gyazo_access_token_here
```

Then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The token is used only by the server route at `POST /api/upload`. Never commit `.env.local` or place the token in frontend code.

Regenerate the token shown in the reference screenshot before using this project because it is publicly visible.
