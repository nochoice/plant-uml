# PlantUML Image Analyzer

A web application that uses AI to analyze images and automatically generate PlantUML diagrams.

## Features

- **Image Upload**: Upload any image file through an intuitive Material UI interface
- **AI Analysis**: Uses OpenAI's GPT-4o vision model to analyze the image
- **PlantUML Generation**: Automatically generates PlantUML code from the image
- **Live Diagram Rendering**: Renders the generated PlantUML code as an SVG diagram
- **Progress Tracking**: Visual stepper showing the analysis progress (Upload → AI Analysis → Diagram Generation)
- **Results Display**: Shows the uploaded image, generated PlantUML code, and rendered diagram side-by-side

## Tech Stack

- **React Router v7** - Modern routing with file-based routing
- **Material UI** - Comprehensive React component library
- **TypeScript** - Type-safe development
- **OpenAI GPT-4o** - Vision model for image analysis
- **PlantUML** - Diagram generation
- **Vite** - Fast build tool

## Setup

### Prerequisites

- Node.js 18+
- OpenAI API Key

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

### Run Development Server

```bash
npm run dev
```

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── ProcessStepper.tsx
│   ├── UploadForm.tsx
│   ├── LoadingIndicator.tsx
│   └── ResultDisplay.tsx
├── domains/            # Business logic by domain
│   ├── openAI/         # OpenAI integration
│   └── plantUml/       # PlantUML encoding
└── routes/             # React Router routes
    └── plant-uml-image.tsx
```

## How It Works

1. **Upload**: User selects and uploads an image
2. **AI Analysis**: Image is sent to OpenAI GPT-4o for analysis
3. **PlantUML Generation**: AI generates PlantUML code describing the diagram in the image
4. **Rendering**: PlantUML code is encoded and rendered as an SVG via plantuml.com
5. **Display**: Shows original image, PlantUML code, and rendered diagram

---

# Original Material UI - React Router example in TypeScript

## How to use

Download the example [or clone the repo](https://github.com/mui/material-ui):

<!-- #target-branch-reference -->

```bash
curl https://codeload.github.com/mui/material-ui/tar.gz/master | tar -xz --strip=2 material-ui-master/examples/material-ui-react-router-ts
cd material-ui-react-router-ts
```

Install it and run:

```bash
npm install
npm run dev
```

or:

<!-- #target-branch-reference -->

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/mui/material-ui/tree/master/examples/material-ui-react-router-ts)

[![Edit on StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/mui/material-ui/tree/master/examples/material-ui-react-router-ts)

## The idea behind the example

<!-- #host-reference -->

This example demonstrates how you can use Material UI with [React Router](https://reactrouter.com/) in [TypeScript](https://github.com/Microsoft/TypeScript).
It includes `@mui/material` and its peer dependencies, including [Emotion](https://emotion.sh/docs/introduction), the default style engine in Material UI.

## What's next?

<!-- #host-reference -->

You now have a working example project.
You can head back to the documentation and continue by browsing the [templates](https://mui.com/material-ui/getting-started/templates/) section.
