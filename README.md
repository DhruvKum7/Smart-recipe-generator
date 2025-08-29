# 🍳 Smart Recipe Generator  

A **MERN stack web application** powered by **Google Gemini API** that suggests personalized recipes based on ingredients (text input or uploaded images). The app helps users discover new dishes, manage dietary preferences, and improve their cooking experience with ease.  

---

## 🚀 Features  
- Enter ingredients via text or select from a list  
- Upload ingredient photos → AI-powered recognition (Google Gemini Vision API)  
- AI-generated recipes with instructions & nutritional info  
- Multiple suggestions per input  
- Filter recipes by cooking time, difficulty, or dietary restrictions  
- Adjust serving sizes  
- Preloaded with 20+ curated recipes including nutritional breakdown  
- Save and rate recipes with personalized suggestions  
- Clean, mobile-responsive interface  
- Loading & error states for smooth interaction  
- Hosted on **[Netlify / Vercel / Heroku]**  

---

## 🛠 Tech Stack  
- **Frontend**: React + TailwindCSS  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB (Atlas)  
- **AI/ML**: Google Gemini API (Text + Vision)  
- **Hosting**: Netlify (frontend), Render/Heroku (backend)  

---

## ⚙️ Installation & Setup  

```bash
git clone https://github.com/yourusername/smart-recipe-generator.git
cd smart-recipe-generator

# Install dependencies
cd client && npm install  
cd ../server && npm install  

# Setup environment variables inside server/.env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000

# Start backend
cd server
npm run dev

# Start frontend
cd client
npm start
