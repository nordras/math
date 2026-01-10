[🇧🇷 Português](README.pt-BR.md) | 🇺🇸 **English**

# 📚 Math Exercise Generator

An educational tool for creating personalized math exercises with and without AI-generated contexts.

**🌐 Live Demo:** [https://math-rust-tau.vercel.app/](https://math-rust-tau.vercel.app/)

> ⚠️ **Note:** The hosted version on Vercel does **not** include AI-powered features. To use AI-generated narrative contexts, you must run the project locally with your own Gemini API key.

<img width="727" height="1108" alt="image" src="https://github.com/user-attachments/assets/449b6c03-1ed2-48c7-9234-5b7e91c1930f" />

## ✨ Features

- 🎯 Generate addition, subtraction, multiplication, and division exercises
- 🤖 AI-powered narrative contexts using Google Gemini
- 👦 Dynamic character names in multiple languages
- 📊 Multiple output formats (compact or detailed)
- 📝 Customizable difficulty and number of exercises
- ✅ Optional answer key

## 🚀 Quick Start

### Option 1: Try Online (without AI)

Visit [https://math-rust-tau.vercel.app/](https://math-rust-tau.vercel.app/) to generate basic exercises without AI-powered contexts.

### Option 2: Run Locally (with AI) ⭐

**To use AI-generated narrative contexts, follow these steps:**

```bash
# Clone the repository
git clone https://github.com/igorferreira007/math.git
cd math

# Install dependencies
npm install

# Configure environment with your Gemini API key
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Run development server
npm run dev
```

Access at [http://localhost:3000](http://localhost:3000)

**Get your free Gemini API key at:** [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🛠️ Tech Stack

- **Next.js 16** (App Router + Turbopack)
- **TypeScript** + **JavaScript**
- **Google Gemini API**
- **Tailwind CSS** + **DaisyUI**
- **Jest** for testing

## 📝 Configuration

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Get your API key at: [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📁 Project Structure

```
math/
├── app/                    # Next.js pages and routes
├── components/             # React components
├── lib/
│   ├── constants/         # Name pool and constants
│   ├── generators/        # Exercise generators
│   ├── services/          # Business logic services
│   └── utils/             # Utility functions
├── __tests__/             # Test files
└── public/                # Static assets
```

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## 📦 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Serve production build
npm test         # Run tests
npm run lint     # Run linter
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Igor Paiva Ferreira**

- 📧 Email: igorkmail@gmail.com
- 💼 LinkedIn: [igor-paiva-ferreira](https://www.linkedin.com/in/igor-paiva-ferreira)

---

Made with ❤️  for Cecília education
