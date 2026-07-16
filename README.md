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

The Gyazo token is used only by the server route at `POST /api/upload` and is not sent to the browser. Never commit `.env.local` or paste the token into frontend code.

Because the token shown in the reference screenshot is visible, regenerate it in the Gyazo dashboard before using this project.
