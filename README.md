# 🤖 AI Manipulator

**AI Manipulator** is an AI-powered prompt engineering and optimization platform designed to transform natural-language requests into structured, model-aware prompts.

The project provides a workspace for analyzing, optimizing, testing, and comparing prompts across modern large language models (LLMs), including systems such as **ChatGPT, Claude, Gemini, and DeepSeek**.

> **AI Manipulator is intended for legitimate prompt engineering, AI research, education, software development, and defensive security research.**

---

## ✨ Features

### 🧠 AI Prompt Optimization

Transform a basic request into a more structured and precise prompt by improving:

* Context
* Instructions
* Constraints
* Output formatting
* Technical terminology
* Reasoning structure
* Expected results

### 🎯 Model-Aware Prompting

Create prompts designed around the characteristics of different AI model families.

Supported model categories include:

* OpenAI models
* Anthropic Claude
* Google Gemini
* DeepSeek

### 🔬 Prompt Analysis

Analyze a prompt before running it and identify areas that may benefit from:

* Better context
* More explicit instructions
* Clearer objectives
* Structured output requirements
* Technical terminology
* Additional constraints

### ⚡ Live Simulation

Compare the behavior of an original prompt against an optimized prompt through the application's simulation interface.

This makes it possible to evaluate how prompt structure can affect model responses.

### 📊 Model Comparison

The dashboard provides a centralized interface for comparing prompt strategies and model behavior.

### 🛠️ Prompt Workbench

The workbench provides an interactive workflow:

```text
Original Request
       ↓
Prompt Analysis
       ↓
Optimization
       ↓
Model-Specific Formatting
       ↓
Optimized Prompt
       ↓
Simulation & Comparison
```

### 💻 API Examples

The project can generate integration examples for AI APIs using technologies such as:

* Python
* TypeScript
* cURL

### 🔄 Resilient API Handling

The server includes handling for temporary inference failures, timeouts, and model availability issues so that the application can continue operating gracefully when an upstream model is unavailable.

---

## 🖥️ Tech Stack

| Technology        | Purpose                            |
| ----------------- | ---------------------------------- |
| React             | Frontend UI                        |
| TypeScript        | Application development            |
| Vite              | Frontend development/build tooling |
| Node.js           | Backend runtime                    |
| Google Gemini API | AI inference and optimization      |
| REST API          | Frontend/backend communication     |

---

## 📁 Project Structure

```text
ai-manipulator/
│
├── public/
│   └── assets/
│       └── aistudio/
│
├── server/
│   ├── geminiService.ts
│   └── optimizerEngine.ts
│
├── src/
│   ├── components/
│   ├── data/
│   ├── types.ts
│   └── App.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* A supported AI API key

### 1. Clone the repository

```bash
git clone https://github.com/sayalll/ai-manipulator.git
cd ai-manipulator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then configure the required API credentials in `.env`.

**Never commit your actual API keys to GitHub.**

### 4. Start the development server

```bash
npm run dev
```

The application will start using the project's configured development server.

---

## 🔐 Environment Variables

The repository includes an `.env.example` file for configuration.

Use environment variables for sensitive credentials such as API keys.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

Do not place real API keys directly inside frontend source code.

---

## 🔌 API

The application includes backend endpoints for application health and prompt optimization.

### Health Check

```http
GET /api/health
```

Used to verify that the backend is running correctly.

### Prompt Optimization

```http
POST /api/optimize
```

Processes a user request through the configured optimization engine.

---

## 🧪 Prompt Testing

A typical workflow looks like this:

### 1. Enter a request

Enter the task or idea you want to turn into a better AI prompt.

### 2. Analyze

The application examines the structure and intent of the request.

### 3. Optimize

The optimizer creates a more structured version of the prompt.

### 4. Select a model strategy

Choose an appropriate model family or prompting strategy.

### 5. Simulate

Run the original and optimized prompts through the available model integration.

### 6. Compare

Review the results and determine which prompt structure produces the most useful response.

---

## 🛡️ Responsible Use

AI Manipulator is designed for responsible prompt engineering and AI experimentation.

It should not be used to:

* Circumvent security controls
* Access systems without authorization
* Evade legitimate safety mechanisms
* Generate instructions for harmful activities
* Violate the terms or policies of AI providers

Different AI providers have different safety systems, policies, and API restrictions. Prompt optimization does not guarantee that an AI model will follow a request.

---

## 🔒 Security

When deploying this project publicly:

* Keep API keys server-side.
* Never commit `.env` files.
* Use `.env.example` for configuration documentation.
* Validate user input.
* Apply rate limiting to public APIs.
* Do not expose private credentials in client-side JavaScript.
* Review the terms of service of each AI provider you integrate.

---

## 🗺️ Roadmap

Future improvements may include:

* [ ] More AI provider integrations
* [ ] Prompt history
* [ ] Prompt versioning
* [ ] Advanced prompt evaluation
* [ ] Custom optimization strategies
* [ ] More model comparison tools
* [ ] Prompt export
* [ ] User accounts
* [ ] Saved prompt libraries
* [ ] Automated prompt testing
* [ ] Additional API examples

---

## 🤝 Contributing

Contributions are welcome.

### Fork the repository

Create your own fork of the project and clone it locally.

### Create a feature branch

```bash
git checkout -b feature/my-feature
```

### Make your changes

Implement and test your changes.

### Commit

```bash
git add .
git commit -m "Add new feature"
```

### Push

```bash
git push origin feature/my-feature
```

Then open a Pull Request.

---

## 📄 License

Add an appropriate open-source license to the repository before encouraging others to reuse or redistribute the project.

For example:

```text
MIT License
```

---

## ⭐ About

**AI Manipulator** is an experimental AI prompt engineering platform focused on making interactions with large language models more structured, testable, and understandable.

It combines prompt optimization, model-aware strategies, live simulation, and comparison tools into a single web application.

---

## 👨‍💻 Author

Created by **sayal**.

GitHub:

https://github.com/sayalll

---

⭐ **If you find this project useful, consider giving the repository a star.**
