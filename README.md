#  InterviewAI - Smart Technical Interview Platform

A modern, AI-powered technical interview platform built with React, TypeScript, and Tailwind CSS. This application provides an end-to-end interview experience for both candidates and interviewers with intelligent question generation and automated scoring.

![InterviewAI Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4)

##  Features

###  **For Candidates**
- **Resume Upload**: Intelligent parsing of PDF and DOCX files
- **Personalized Questions**: AI-generated questions based on resume content
- **Timed Responses**: Progressive difficulty with appropriate time limits
- **Real-time Feedback**: Instant scoring and performance insights
- **Session Management**: Auto-save progress and resume capability

###  **For Interviewers**
- **Candidate Dashboard**: Comprehensive overview of all interviews
- **Detailed Analytics**: Performance metrics and AI assessments
- **Search & Filter**: Advanced candidate filtering and sorting
- **Interview History**: Complete chat logs and response analysis

###  **Modern UI/UX**
- **Professional Design**: Clean, modern interface with smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Dark Mode Ready**: Extensible design system for theme variations

##  Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Document Processing**: PDF.js, Mammoth.js
- **Development**: ESLint, PostCSS

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/interview-ai.git
   cd interview-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

##  Project Structure

```
src/
├── components/
│   ├── Dashboard/          # Interviewer dashboard components
│   │   ├── CandidateList.tsx
│   │   ├── CandidateDetail.tsx
│   │   ├── EmptyState.tsx
│   │   └── InterviewerTab.tsx
│   ├── Interview/          # Interview flow components
│   │   ├── IntervieweeTab.tsx
│   │   ├── ResumeUpload.tsx
│   │   ├── CandidateInfoForm.tsx
│   │   ├── InterviewChat.tsx
│   │   └── QuestionScore.tsx
│   └── Layout/             # Layout components
│       └── TabLayout.tsx
├── store/                  # Redux store and slices
│   ├── index.ts
│   └── slices/
│       ├── candidatesSlice.ts
│       └── interviewSlice.ts
├── utils/                  # Utility functions
│   ├── resumeParser.ts
│   └── answerScoring.ts
├── hooks/                  # Custom React hooks
│   └── useTypedSelector.ts
└── styles/
    └── index.css          # Global styles and Tailwind imports
```

##  Design System

The application uses a comprehensive design system built on Tailwind CSS:

- **Colors**: Primary (blue), Secondary (gray), Success, Warning, Danger
- **Typography**: Inter font family with consistent sizing
- **Components**: Reusable button, input, card, and badge styles
- **Animations**: Smooth transitions and micro-interactions
- **Shadows**: Layered depth system for visual hierarchy

##  Configuration

### Tailwind CSS
The design system is configured in `tailwind.config.js` with:
- Custom color palettes
- Extended animations
- Professional shadow systems
- Custom component classes

### TypeScript
Type-safe development with strict TypeScript configuration for:
- Component props
- Redux state
- API responses
- Utility functions

##  Features in Detail

### Resume Processing
- Supports PDF and DOCX formats
- Extracts contact information automatically
- Parses content for question personalization
- Error handling for corrupted files

### Interview Flow
1. **Upload Phase**: Resume upload with drag-and-drop
2. **Info Phase**: Contact information verification
3. **Interview Phase**: Progressive difficulty questions
4. **Results Phase**: AI-generated assessment and scoring

### Scoring Algorithm
- Time-based performance metrics
- Content quality analysis
- Difficulty-adjusted scoring
- Comprehensive feedback generation

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Lucide](https://lucide.dev/) - Icon library
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF processing
- [Mammoth.js](https://www.npmjs.com/package/mammoth) - DOCX processing

##  Support

If you have any questions or need help, please open an issue or contact [your-email@example.com](mailto:your-email@example.com).

---

**Made with  by [Tarak Reddy Kothabalireddygari](https://github.com/tarak510605)**
