# 📚 AI-Powered Math Exercise Generator

Intelligent system for generating personalized math exercises with AI-created narrative contexts.

<img width="727" height="1108" alt="image" src="https://github.com/user-attachments/assets/449b6c03-1ed2-48c7-9234-5b7e91c1930f" />

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment settings
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Run in development mode
npm run dev

# Compile for production
npm run build
npm start
```

Access: http://localhost:3000

## ✨ Features

- 🎯 **Smart Generation**: Addition, subtraction, multiplication, and division exercises
- 🤖 **Contextual AI**: Google Gemini creates unique narrative problems
- 👦 **Dynamic Names**: Pool of 18 multilingual names (PT/EN)
- 📊 **Multiple Formats**: Compact note or contextualized problems
- 📝 **Configurable**: Control of digits, operations, and difficulty
- ✅ **Optional Template**: Versions with and without answers

## 📁 Project Structure

```
mathematics/
├── app/ # Next.js App Router (pages and routes)
├── components/ # React Components
│ └── GeneratorForm.tsx # Main form
├──lib/
│ ├── constants/
│ │ └── namePool.ts/js # Multilingual name pool (18 names)
│ ├── generators/
│ │ ├── mathGenerator.js # Math problem generator
│ │ ├── aiEnhancer.js # Gemini API integration
│ │ └── templateLibrary.js # Fallback templates
│ ├── services/
│ │ ├── MathGeneratorService.ts # Generation service
│ │ ├── AIEnhancerService.js # AI service
│ │ └── HTMLFormatterService.js # HTML Formatting
│ └── utils/ # Utility functions
├── public/ # Static assets
├── __tests__/ # Playful tests
├── ativos/ # SVGs and resources
└── próto-math/ # ⚠️ DEPRECATED - Do not use
└── DEPRECATED.md # Deprecation warning
```

## 🎨 Name Pool

System of Abstract multilingual names for maximum variability:

**Women**: Luna, Maya, Nina, Mia, Jade, Lara, Sofia, Ana, Emma
**Men**: Leo, Noah, Davi, Kai, Lucas, Theo, Samuel, Enzo, Miguel

## 🎯 How to Use This Material

## 📖 Multiplication

### Suggested Study Order

1. **[Basic Concepts](multiplication/01-basic-concepts.md)** - What is multiplication? Groups and repeated addition
2. **[Multiplication Table of 0 and 1](multiplication/02-multiplication-table-0-and-1.md)** - Special cases
3. **[Multiplication Table of 2](multiplication/03-multiplication-table-of-2.md)** - Learning to double
4. **[Multiplication Table of 5 and 10](multiplication/04-multiplication-table-5-and-10.md)** - Discovering patterns
5. **[Arrays and Commutative Property](multiplication/05-arrays-and-commutative-property.md)** - Rows and columns
6. **[Multiplication Table of 3 and 4](multiplication/06-multiplication-table-3-and-4.md)** - Practicing more
7. **[Multiplication Table of 6 and 1] 9](multiplication/07-multiplication-table-6-and-9.md)** - Interesting Tricks
8. **[Multiplication Table of 7 and 8](multiplication/08-multiplication-table-7-and-8.md)** - The Final Challenges
9. **[Mixed Review and Practice](multiplication/09-review-and-mixed-practice.md)** - Putting it all together
10. **[Challenges and Applications](multiplication/10-challenges-and-applications.md)** - Creative Problems

## 🎨 Study Tips

- ✏️ Use paper and pencil to draw the problems
- 🧮 Count on your fingers when needed
- 🎲 Use real objects (toys, fruits) to form groups
- 📝 Redo difficult exercises another day
- 🌟 Celebrate each achievement!

## 📅 ​​Suggested Schedule

- **Weeks 1-2**: Lessons 1-2 (concepts and special cases)
- **Weeks 3-4**: Lessons 3-4 (simple multiplication tables: 2, 5, 10)
- **Week 5**: Lesson 5 (matrices and commutative property)
- **Weeks 6-7**: Lessons 6-7 (exciting multiplication tables: 3, 4, 6, 9)
- **Week 8**: Lesson 8 (multiplication tables questions: 7, 8)
- **Weeks 9-10**: Lessons 9-10 (review and challenges)

**Important**: This schedule is just a suggestion. Adjust it according to your learning pace.

## 🛠️ Technologies

- **Next.js 16** (Application Router + Turbopack)
- **TypeScript** + **JavaScript**
- **Google Gemini API** (generative-ai)
- **Tailwind CSS** + **DaisyUI**

- **Jest** for testing

## 📝 Configuration

Create `.env.local` with:

```env.GEMINI_API_KEY=your_key_here

```

## 🧪 Tests

```bash.npm test # Run all tests.npm run test:watch # Watch mode
```

## 📦 Available Scripts

```bash.npm run dev # Development
npm run build # Production build
npm start # Serve production
npm test # tests
npm execute lint#Linter
```

## Sources
- https://storyset.com
- https://www.education.com/resources/grade-2/worksheets/english-language-arts/
- https://www.education.com/worksheet/article/2-math-minut