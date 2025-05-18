# 🧠 Prompt Validation App

A simple web-based tool to help teams review and validate AI-generated prompts.  
This version integrates **Mistral AI** to improve raw user inputs into structured prompts before being reviewed.

## 🚀 Features
- Safe-lock system to ensure no double validation for prompts
- Integration with [Mistral AI](https://mistral.ai) via API for automatic prompt enhancement
- Feedback system (`good`, `neutral`, `bad`) per prompt
- PostgreSQL as backend database (via Neon or other)
- React frontend with loading feedback during LLM generation

## 🛠 Tech Stack
- **Backend:** Express.js + PostgreSQL (NeonDB)
- **Frontend:** React.js
- **LLM:** Mistral AI (Open Weight API via `mistral-small`)
- **Deployment:** Vercel.

## 📦 Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/sandervenz/prompt-validation.git
cd prompt-validation
npm install
```

### 2. Configure Environment
Create `.env` in the backend directory:

```env
DATABASE_URL=your_neondb_postgresql_connection_string
MISTRAL_API_KEY=your_mistral_api_key
```

### 3. Run Backend
```bash
cd backend
node index.js
```

### 4. Run Frontend
```bash
cd frontend
npm start
```

## 📋 Database Schema

- **prompts**
  - `id` (PK)
  - `text` (original prompt)
  - `reserved_by` (string)

- **user_feedbacks**
  - `id` (PK)
  - `prompt_id` (FK)
  - `username`
  - `llm_prompt` (enhanced version)
  - `prompt_feedback` (`good`, `neutral`, `bad`)

## ✅ How it Works
1. User selects their name
2. System fetches the next unreviewed prompt (locks it for the user)
3. Mistral AI rewrites the raw prompt into a clearer version
4. User gives feedback on the result
5. System saves feedback to the database