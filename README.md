# 🍳 Smart Recipe Generator

An intelligent recipe management and discovery app built with **React + Vite + TailwindCSS**, powered by a **Node.js/Express backend** with **MongoDB** for data storage.  
It allows users to create, save, and explore recipes with filtering, categories, difficulty levels, and more.  

---

## ✨ Features

- 🔐 **Authentication & Authorization** – Secure login/signup with protected routes  
- 📝 **Create Recipes** – Add ingredients, portion size, category, and difficulty  
- 💾 **Save Recipes** – Bookmark your favorite recipes for quick access  
- 🥗 **Smart Filtering & Search** – Search by title, category, or ingredient  
- 📱 **Responsive UI** – Mobile-friendly modern design with TailwindCSS  
- ⚡ **Fast & Optimized** – Built with Vite for blazing-fast development  
- 🎨 **Attractive UI** – Modern cards, gradients, and interactive components  

---

## 🚀 Tech Stack

**Frontend**  
- React 18  
- Vite  
- TailwindCSS  
- Lucide-React Icons  

**Backend**  
- Node.js  
- Express.js  
- MongoDB (with Mongoose)  

**Other**  
- Axios for API calls  
- Zustand for state management  
- JWT authentication  

---

## 📂 Folder Structure

frontend/
├── src/
│ ├── components/ # Reusable UI components (Navbar, Footer, Cards)
│ ├── pages/ # Page components (Dashboard, CreateRecipe, SavedRecipe, etc.)
│ ├── store/ # Zustand store for auth
│ └── api/ # Axios API helpers
└── ...
backend/
├── models/ # MongoDB models
├── routes/ # Express routes
├── controllers/ # Business logic
└── ...

yaml
Copy code

---

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/your-username/smart-recipe-generator.git
cd smart-recipe-generator
🔧 Backend
bash
Copy code
cd backend
npm install
npm run dev
🎨 Frontend
bash
Copy code
cd frontend
npm install
npm run dev
🔑 Environment Variables
Create .env files in both backend and frontend directories.

Backend (/backend/.env):

ini
Copy code
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
PORT=5000
Frontend (/frontend/.env):

ini
Copy code
VITE_BACKEND_URL=http://localhost:5000
