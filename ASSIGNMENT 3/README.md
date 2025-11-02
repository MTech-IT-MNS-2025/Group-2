# Chat App (Next.js)

A real-time chat application built using **Next.js**, **Node.js**, **MongoDB**, and **WebSockets**.

## 🚀 Features

* User Authentication (JWT / NextAuth)
* Real-time chat using WebSockets / Socket.io
* Secure login & signup
* Responsive UI
* Persistent chat storage (MongoDB / Firebase)

## 📦 Tech Stack

| Frontend | Backend | Database | Auth           | WebSockets |
| -------- | ------- | -------- | -------------- | ---------- |
| Next.js  | Node.js | MongoDB  | JWT / NextAuth | Socket.io  |

## 📁 Folder Structure

```
project/
│-- src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── login/route.js
│   │   └── (UI pages)
│   ├── components/
│   └── lib/
│-- public/
│-- package.json
│-- README.md
```

## ⚙️ Installation

### 📌 Clone the repo

```bash
git clone <repo-url>
cd project
```

### 📌 Install dependencies

```bash
npm install
# or
yarn install
```

### 📌 Environment Variables

Create `.env.local` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

## ▶️ Run the project

```bash
npm run dev
```

App will run at: **[http://localhost:3000](http://localhost:3000)**

## ✅ Commands for Git Setup

If project not initialized:

```bash
git init
```

Add files & commit:

```bash
git add .
git commit -m "Initial commit"
```

Add remote & push:

```bash
git remote add origin <repo-url>
git branch -M main
git push -u origin main
```

## 🛠️ Fix for Login API Error

**Ensure you return a Response in route.js**

```js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validate user logic

    return NextResponse.json({ success: true, message: "Login successful" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
```

## 🙌 Contribution

Pull requests are welcome! Feel free to suggest improvements.

## 📄 License

This project is released under the **MIT License**.

---

### ⭐ If this helped, don’t forget to star the repo!
