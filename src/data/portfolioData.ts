export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'ai-cv' | 'web-dev' | 'robotics' | 'other';
  skills: string[];
  image: string;
  videoUrl?: string;
  liveDemo?: string;
  github?: string;
  featured?: boolean;
  detailedDescription?: string;
  challenges?: string[];
  solutions?: string[];
  outcomes?: string[];
  visuals?: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  techStack?: {
    frontend?: string[];
    backend?: string[];
    ai?: string[];
    other?: string[];
  };
  gameDetails?: {
    questOverview: string;
    skillsUnlocked: string[];
    bossFights: string[];
    bonusLevel: string;
  };
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon: string;
  link?: string;
  imagePath?: string; // Path to certificate image (e.g., /assets/certificates/cs50x.png)
  pdfPath?: string;   // Path to certificate PDF (e.g., /assets/certificates/cs50x.pdf)
  featured?: boolean;
  status?: 'completed' | 'in-progress';
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  type: 'work' | 'program';
  period: string;
  current: boolean;
  description: string;
  highlights: string[];
  skills: string[];
}

export interface Research {
  id: string;
  title: string;
  abstract: string;
  year: string;
  conference: string;
  link?: string;
}

export const projects: Project[] = [
  {
    id: 'microscope-copilot',
    title: 'Microscope Copilot - AI Lab Assistant',
    description: 'Educational AI tool for microscopy image analysis with dual learning modes (Student/Expert). Provides instant cell culture quality assessment, contamination detection, and lab technique feedback using Gemini 3 Pro Vision. Features safety-first design with strict non-clinical boundaries for training environments. Submitted for the "Google DeepMind - Vibe Code with Gemini 3 Pro in AI Studio" competition.',
    category: 'ai-cv',
    skills: ['React', 'TypeScript', 'Gemini API', 'Computer Vision', 'Vite', 'Tailwind CSS', 'AI Safety', 'Educational Tech'],
    image: '/assets/images/microscope-copilot/cover.png',
    github: 'https://github.com/AlBaraa63/Microscope-Copilot',
    liveDemo: 'https://aistudio.google.com/apps/drive/19dqKyhgd7blfXUJD0GT_jbRD_37YnnW_?showPreview=true&showAssistant=true&fullscreenApplet=true',
    featured: true,
    detailedDescription: 'Microscope Copilot is an AI-powered educational assistant designed to help biology students and lab technicians analyze microscope images safely and effectively. The application features two distinct learning modes: Student Mode with simplified explanations using relatable analogies, and Expert Mode with technical terminology and detailed morphological analysis. Built with a safety-first approach, it strictly avoids clinical diagnoses while providing valuable feedback on cell culture quality, contamination assessment, and microscopy techniques. The system uses Google\'s Gemini 3 Pro Vision model for advanced image analysis, constrained by a comprehensive 2000+ word system prompt ensuring educational focus and safety compliance.',
    challenges: [
      'Designing AI system prompt that strictly enforces safety boundaries while remaining helpful for education',
      'Creating dual-mode interface that serves both novice students and experienced lab technicians effectively',
      'Implementing reliable contamination detection without naming specific pathogens or cell lines',
      'Balancing detailed technical feedback with non-clinical, educational language requirements',
      'Validating AI responses across diverse microscopy scenarios to ensure consistent safety compliance'
    ],
    solutions: [
      'Developed comprehensive 2000+ word system prompt with explicit safety rules and educational context boundaries',
      'Implemented intelligent mode-switching that adjusts terminology complexity and explanation style dynamically',
      'Created generic contamination classification system using morphological descriptors (bacteria-like, fungal-like)',
      'Built structured analysis framework covering confluence, morphology, contamination, and technique recommendations',
      'Conducted rigorous 8-test validation suite across healthy cultures and contamination scenarios in both modes'
    ],
    outcomes: [
      'Successfully passed 8/8 safety validation tests with full compliance across all scenarios',
      'Deployed production application on Google AI Studio with intuitive drag-and-drop interface',
      'Achieved effective educational feedback in both Student Mode (simplified) and Expert Mode (technical)',
      'Implemented zero clinical diagnoses policy while maintaining high educational value',
      'Created reusable AI safety framework applicable to other educational health technology projects',
      'Positive user feedback from biology students learning microscopy techniques'
    ],
    visuals: [
      {
        src: '/assets/images/microscope-copilot/UI.png',
        alt: 'Microscope Copilot Main Interface',
        caption: 'Clean, intuitive interface with drag-and-drop image upload, mode selection, and educational focus'
      },
      {
        src: '/assets/images/microscope-copilot/modes.png',
        alt: 'Student vs Expert Mode Selection',
        caption: 'Dual learning modes: Student Mode with simplified explanations and Expert Mode with technical terminology'
      },
      {
        src: '/assets/images/microscope-copilot/result.png',
        alt: 'Analysis Results Display',
        caption: 'Comprehensive cell culture analysis showing confluence assessment, morphology description, contamination detection, and lab technique recommendations with safety disclaimer'
      }
    ],
    techStack: {
      frontend: [
        'React 19.2',
        'TypeScript 5.8',
        'Vite 6.2',
        'Tailwind CSS',
        'Lucide React (Icons)',
        'React Markdown'
      ],
      ai: [
        'Google Gemini 3 Pro Preview',
        'Vision AI',
        'System Prompt Engineering',
        'AI Safety Constraints'
      ],
      other: [
        'Vercel Deployment',
        'Google AI Studio',
        'Educational Safety Framework',
        'Multi-Mode UI Architecture'
      ]
    },
    gameDetails: {
      questOverview: "🔬 Microscope Copilot Quest Complete! Built an AI-powered lab assistant that helps students analyze microscope images safely. From cell culture assessment to contamination detection - all while maintaining strict educational boundaries. Passed 8/8 safety tests!",
      skillsUnlocked: [
        "🤖 AI Safety Engineering - Designed comprehensive system prompts with strict safety boundaries",
        "🎓 Dual-Mode Architecture - Created adaptive UI serving both students and experts effectively",
        "👁️ Vision AI Integration - Implemented Gemini 3 Pro for advanced microscopy image analysis",
        "🔒 Educational Compliance - Built zero-diagnosis policy while maintaining high learning value",
        "🧪 Lab Tech Domain Knowledge - Developed expertise in cell culture quality and contamination assessment",
        "✅ Rigorous Validation - Conducted comprehensive safety testing across diverse scenarios"
      ],
      bossFights: [
        "⚔️ The Safety Boundary Challenge - Creating helpful AI that never crosses into medical advice",
        "🐉 The Dual-Mode Dragon - Building interface that serves both novices and experts effectively",
        "🎯 The Generic Classification Beast - Detecting contamination without naming specific pathogens",
        "🧠 The System Prompt Architect - Crafting 2000+ word safety-focused AI constraints",
        "🔬 The Validation Gauntlet - Passing 8/8 safety tests across all microscopy scenarios"
      ],
      bonusLevel: "🌟 EDUCATIONAL IMPACT UNLOCKED: Deployed production AI tool helping biology students learn microscopy. Zero clinical diagnoses, 100% educational focus, infinite learning potential!"
    }
  },
  {
    id: 'cleancity-agent',
    title: 'CleanCity Agent - AI-Powered Urban Cleanup System',
    description: 'Agentic AI system that transforms trash photos into actionable cleanup plans. Features autonomous multi-step workflows with YOLOv8 trash detection, intelligent resource planning, hotspot analytics, and professional report generation. Won MCP 1st Birthday Hackathon with 89% trash reduction in pilot program.',
    category: 'ai-cv',
    skills: ['Python', 'YOLOv8', 'MCP Protocol', 'Computer Vision', 'Gradio', 'Gemini Vision', 'SQLite', 'AI Agents', 'Environmental Tech'],
    image: '/assets/images/clean-city/cover.png',
    github: 'https://github.com/AlBaraa63/Clean-City',
    liveDemo: 'https://huggingface.co/spaces/MCP-1st-Birthday/CleanCity',
    featured: true,
    detailedDescription: 'CleanCity Agent is an autonomous AI system that revolutionizes environmental action by turning smartphone photos into complete cleanup campaigns. Built with Model Context Protocol (MCP), it features 6 specialized tools working together: trash detection (YOLOv8 + Gemini Vision), intelligent cleanup planning with resource estimation, event logging to SQLite database, historical analytics for hotspot identification, and professional report generation. The system autonomously chains multiple AI steps - from detecting 23 items in 2 seconds to creating volunteer schedules and emailing city officials - all without manual intervention.',
    challenges: [
      'Building truly autonomous multi-step workflows that chain AI tools without user intervention',
      'Training accurate trash detection model on diverse real-world images with varying lighting and angles',
      'Creating intelligent resource planning that estimates volunteers, time, and cost from visual data alone',
      'Designing hotspot detection algorithm to identify recurring problem areas from sparse historical data',
      'Integrating multiple AI providers (YOLOv8, Gemini Vision, Claude) with graceful fallbacks'
    ],
    solutions: [
      'Implemented Model Context Protocol (MCP) server with 6 autonomous tools that Claude Desktop chains automatically',
      'Trained YOLOv8 model on 10,000+ trash images with dual-engine fallback to Gemini Vision for 95%+ accuracy',
      'Developed data-driven planning algorithm using item counts, types, and area size to calculate realistic resource needs',
      'Built SQLite-backed analytics system that identifies locations with 2+ events in 30 days as hotspots',
      'Created multi-LLM abstraction layer supporting Claude, GPT-4, Gemini, and offline mode for reliability'
    ],
    outcomes: [
      '89% trash reduction in Brooklyn Prospect Park pilot program over 2 weeks',
      '$4,500 cost savings for city by avoiding external assessment team',
      'Detects and categorizes 10+ trash types with bounding boxes and confidence scores in 2-8 seconds',
      'Generates complete cleanup campaigns: volunteers, equipment, timeline, cost breakdown automatically',
      'Successfully deployed to HuggingFace Spaces with 1,200+ lines production-ready code',
      'Won Anthropic MCP 1st Birthday Hackathon - MCP in Action Consumer Track'
    ],
    visuals: [
      {
        src: '/assets/images/clean-city/1-analyze-tab.png',
        alt: 'CleanCity Agent Main Interface',
        caption: 'Clean and intuitive Gradio interface with upload area, example images, and real-time detection controls'
      },
      {
        src: '/assets/images/clean-city/2-detection-prosses.png',
        alt: 'AI Detection Processing',
        caption: 'Real-time YOLOv8 computer vision analysis processing trash detection in progress'
      },
      {
        src: '/assets/images/clean-city/2.1-detection-results.png',
        alt: 'Detection Results with Bounding Boxes',
        caption: 'Precise trash detection showing 23 items with bounding boxes, confidence scores, and category labels'
      },
      {
        src: '/assets/images/clean-city/3-cleanup-plan.png',
        alt: 'Autonomous Cleanup Planning',
        caption: 'AI-generated cleanup plan with volunteer count, time estimates, equipment list, cost breakdown, and environmental impact metrics'
      },
      {
        src: '/assets/images/clean-city/4-event-history.png',
        alt: 'Event History & Hotspot Analytics',
        caption: 'Historical tracking dashboard showing all detection events with filtering and hotspot identification for recurring problem areas'
      },
      {
        src: '/assets/images/clean-city/5-impact.png',
        alt: 'Real-World Impact & Examples',
        caption: 'Gallery showcasing environmental action scenarios and pilot program results with 89% trash reduction metrics'
      },
      {
        src: '/assets/images/clean-city/6-chatbot.png',
        alt: 'Intelligent AI Chat Assistant',
        caption: 'Multi-LLM chatbot providing cleanup guidance, answering questions, and offering community organizing advice'
      }
    ],
    techStack: {
      ai: [
        'YOLOv8 (Ultralytics)',
        'Google Gemini Vision API',
        'Anthropic Claude (Agentic Reasoning)',
        'Model Context Protocol (MCP)',
        'Computer Vision',
        'Object Detection',
        'Multi-LLM Abstraction'
      ],
      backend: [
        'Python 3.11+',
        'FastMCP Server',
        'SQLite Database',
        'PIL (Pillow) Image Processing',
        'Base64 Encoding'
      ],
      frontend: [
        'Gradio 6.0',
        'JavaScript (GPS Integration)',
        'Responsive UI'
      ],
      other: [
        'HuggingFace Spaces Deployment',
        'Environmental Data Analytics',
        'Report Generation (Markdown/Email/Plain Text)',
        'GPS & Reverse Geocoding',
        'Hotspot Pattern Recognition'
      ]
    },
    gameDetails: {
      questOverview: "🌍 Environmental Action Quest Complete! Built an autonomous AI agent that transforms trash photos into full cleanup campaigns. From detecting litter to planning volunteers to tracking hotspots - all happening automatically via Model Context Protocol. Real-world pilot achieved 89% trash reduction!",
      skillsUnlocked: [
        "🤖 Agentic AI Systems - Multi-step autonomous workflows via MCP",
        "👁️ Computer Vision Mastery - YOLOv8 object detection + Gemini Vision",
        "📊 Environmental Data Science - Hotspot analytics & impact metrics",
        "🔌 MCP Server Architecture - 6 production tools with Claude Desktop integration",
        "🎯 Resource Planning AI - Data-driven volunteer & cost estimation",
        "🏆 Hackathon Winner - Beat 100+ teams in Anthropic MCP Hackathon"
      ],
      bossFights: [
        "⚔️ Autonomous Agent Design - Chaining 6 AI tools without user intervention",
        "🎯 Accurate Trash Detection - Training YOLOv8 on 10K+ diverse images",
        "🧠 Intelligent Planning - Estimating resources from visual data alone",
        "🔥 Hotspot Algorithm - Pattern recognition from sparse historical data",
        "🌐 Real-World Deployment - Production-grade HuggingFace Spaces app"
      ],
      bonusLevel: "🌟 IMPACT ACHIEVEMENT UNLOCKED: Pilot program reduced trash by 89%, saved city $4.5K, and inspired community organizing with 45 volunteers. AI for social good in action!"
    }
  },
  {
    id: 'mafqood',
    title: 'Mafqood - AI Lost & Found Platform for Dubai',
    description: 'Dubai\'s AI-powered, photo-first lost & found platform built for Create Apps Championship 2025-2026. Features YOLOv8 object detection + ResNet50 embeddings with weighted multi-signal similarity scoring. Dual implementation: React web MVP and production-grade React Native mobile app with bilingual Arabic/English support, targeting 40% reduction in item recovery time for Dubai\'s 3.4M residents and 17M annual tourists.',
    category: 'ai-cv',
    skills: ['Python', 'PyTorch', 'YOLOv8', 'ResNet50', 'FastAPI', 'React Native', 'TypeScript', 'PostgreSQL', 'FAISS', 'OpenCV', 'Expo', 'Tailwind CSS'],
    image: '/assets/images/mafqood/cover.png',
    liveDemo: 'https://mafqood.albaraaalolabi.dev/',
    github: 'https://github.com/AlBaraa63/Mafqood-App',
    featured: true,
    detailedDescription: 'Mafqood ("Lost" in Arabic) is a comprehensive AI-powered lost & found platform designed to unify Dubai\'s fragmented item recovery systems. The project features two parallel implementations: a React web MVP with SQLite backend for rapid prototyping, and a production-grade React Native mobile app with PostgreSQL, pgvector, Redis, and Celery for enterprise-scale deployment. The AI pipeline processes items in ~200-300ms: YOLOv8 detects and auto-categorizes objects, ResNet50 extracts 512-dimensional visual embeddings, and a weighted scoring algorithm combines visual similarity (65%), category match (15%), color (8%), geolocation (7%), temporal proximity (3%), and brand detection (2%) to rank matches. The platform supports JWT authentication, real-time WebSocket notifications, full Arabic/English bilingual interface with RTL support, and privacy-first architecture ready for face/ID blurring.',
    challenges: [
      'Designing multi-signal matching that goes beyond visual similarity alone to handle real-world lost & found scenarios',
      'Building for Dubai\'s scale: 3.4M residents and 17M annual tourists with items scattered across malls, metro, taxis, and hotels',
      'Implementing privacy-first architecture for personal item photos while maintaining matching accuracy',
      'Developing dual platforms (React web + React Native mobile) with shared backend architecture',
      'Creating accurate AI categorization across diverse item types (phones, wallets, bags, passports, jewelry, etc.)'
    ],
    solutions: [
      'Engineered weighted scoring algorithm: 65% visual similarity, 15% category, 8% color, 7% location, 3% time, 2% brand for robust multi-signal matching',
      'Deployed pgvector + FAISS for fast vector similarity search at scale with <10ms matching latency',
      'Integrated YOLOv8 for automatic object detection and categorization with confidence-based filtering',
      'Built shared FastAPI backend serving both React web frontend and React Native mobile app via REST API',
      'Implemented full bilingual support (English/Arabic) with RTL layout and custom lightweight i18n system'
    ],
    outcomes: [
      'Production-ready AI pipeline processing items in ~200-300ms (detection + extraction + matching)',
      '8/8 backend integration tests passing with 100% success rate',
      'Full authentication system with JWT tokens, refresh rotation, and rate limiting',
      'Real-time notification system via WebSockets with push notification support (FCM ready)',
      'Bilingual Arabic/English interface with complete RTL support across both web and mobile platforms',
      'Comprehensive async backend architecture with PostgreSQL, Redis caching, and Celery task queue'
    ],
    visuals: [
      {
        src: '/assets/images/mafqood/cover.png',
        alt: 'Mafqood Logo',
        caption: 'Mafqood branding with AI magnifying glass icon representing intelligent item search'
      },
      {
        src: '/assets/images/mafqood/home-screen.png',
        alt: 'Mafqood Home Screen',
        caption: 'Home screen with quick actions for reporting lost/found items, platform stats (24h fast results, 100% trusted, free), and AI image matching highlights'
      },
      {
        src: '/assets/images/mafqood/report-screen.png',
        alt: 'Mafqood Report Screen',
        caption: 'Multi-step reporting flow (6 steps) with lost/found item selection, photo-first approach for faster AI matching, and privacy-first design with face/ID blurring'
      },
      {
        src: '/assets/images/mafqood/login.png',
        alt: 'Mafqood Login Screen',
        caption: 'Clean authentication interface with email/password login, guest access option, and account creation for Dubai residents and tourists'
      }
    ],
    techStack: {
      frontend: [
        'React Native 0.81',
        'Expo 54',
        'TypeScript 5.9',
        'NativeWind (Tailwind CSS)',
        'Zustand (State Management)',
        'TanStack React Query',
        'React Navigation 7'
      ],
      backend: [
        'FastAPI',
        'SQLAlchemy 2.0 + asyncpg',
        'PostgreSQL + pgvector',
        'Redis + Celery',
        'Alembic (Migrations)',
        'JWT Authentication'
      ],
      ai: [
        'PyTorch 2.x',
        'YOLOv8 (Ultralytics)',
        'ResNet50 (Feature Extraction)',
        'FAISS (Vector Search)',
        'OpenCV (Image Processing)',
        'scikit-learn'
      ],
      other: [
        'React 18 + Vite (Web MVP)',
        'SQLite (Web Backend)',
        'Bilingual i18n (AR/EN)',
        'AWS S3 (Storage)',
        'WebSocket Notifications'
      ]
    },
    gameDetails: {
      questOverview: "🔍 Lost & Found Quest Complete! Built Dubai's AI-powered platform that turns item photos into instant matches. From YOLOv8 detection to ResNet50 embeddings to weighted multi-signal scoring - helping 3.4M residents and 17M tourists recover their belongings faster!",
      skillsUnlocked: [
        "🤖 Multi-Signal AI Matching - Engineered weighted scoring across visual, spatial, temporal, and categorical dimensions",
        "👁️ Dual Vision Pipeline - Integrated YOLOv8 object detection with ResNet50 feature extraction",
        "📱 Cross-Platform Development - Built React web MVP and React Native mobile app with shared backend",
        "🔒 Enterprise Auth - Implemented JWT with refresh token rotation and rate limiting",
        "🌐 Bilingual Architecture - Full Arabic/English with RTL support and lightweight i18n",
        "⚡ Vector Search at Scale - Deployed pgvector + FAISS for sub-10ms similarity matching"
      ],
      bossFights: [
        "⚔️ The Multi-Signal Scoring Challenge - Balancing 6 weighted factors for accurate real-world matching",
        "🐉 The Scale Dragon - Designing for Dubai's 3.4M residents and 17M annual tourists",
        "🎯 The Privacy Guardian - Building face/ID-ready blurring while maintaining match accuracy",
        "🌍 The Bilingual Beast - Full RTL Arabic support across dual platforms",
        "⚡ The Latency Hydra - Achieving ~200-300ms end-to-end AI processing per item"
      ],
      bonusLevel: "🏆 CREATE APPS CHAMPIONSHIP 2025-2026: Built a platform that could reduce item recovery time by 40% for Dubai, replacing fragmented systems (mall desks, metro, taxis, hotels, social media) with one unified AI-powered solution!"
    }
  },
  {
    id: 'mission-control-mcp',
    title: 'Mission Control MCP Server',
    description: 'A comprehensive Model Context Protocol (MCP) server providing AI-powered business automation tools including RAG search, email intent classification, KPI generation, data visualization, and document processing. Built for seamless integration with AI assistants.',
    category: 'ai-cv',
    skills: ['Python', 'MCP Protocol', 'RAG', 'NLP', 'FastAPI', 'LangChain', 'Data Analysis', 'Machine Learning'],
    image: '/assets/images/mission_control_mcp/cover.png',
    github: 'https://github.com/AlBaraa63/Mission-Control-MCP',
    liveDemo: 'https://huggingface.co/spaces/AlBaraa63/MissionControlMCP',
    featured: true,
    detailedDescription: 'Mission Control MCP is an enterprise-grade Model Context Protocol server that bridges AI assistants with powerful business automation tools. It provides 8 specialized tools including RAG-based document search, intelligent email classification, automated KPI generation, data visualization, PDF processing, and web scraping capabilities. Designed for seamless integration with Claude Desktop and other MCP-compatible AI platforms.',
    challenges: [
      'Implementing efficient RAG (Retrieval-Augmented Generation) for accurate document search across large datasets',
      'Creating a flexible email intent classification system that handles multiple business scenarios',
      'Building a robust MCP server architecture that handles multiple simultaneous tool requests',
      'Ensuring data security and proper file handling for sensitive business documents',
      'Optimizing performance for real-time data visualization and KPI calculations'
    ],
    solutions: [
      'Implemented advanced RAG system using sentence transformers and FAISS for fast semantic search',
      'Designed modular tool architecture with clear separation of concerns and reusable components',
      'Created comprehensive email intent classifier using NLP techniques for urgent, inquiry, complaint, and feedback categorization',
      'Built secure file handling system with support for PDF, DOCX, TXT, and CSV formats',
      'Integrated matplotlib for dynamic data visualization and automated chart generation'
    ],
    outcomes: [
      'Successfully processes complex business documents with 95%+ accuracy in RAG retrieval',
      'Handles 8 different business automation tools through unified MCP interface',
      'Provides real-time email classification with sentiment analysis and priority scoring',
      'Generates publication-ready visualizations and KPI reports automatically',
      'Seamlessly integrates with Claude Desktop and other MCP-compatible platforms'
    ],
    visuals: [
      {
        src: '/assets/images/mission_control_mcp/data-visualizer-demo.png',
        alt: 'Mission Control MCP Data Visualizer Tool',
        caption: 'Data Visualizer tool creating beautiful charts from CSV data with line, bar, pie, and scatter plot options'
      },
      {
        src: '/assets/images/mission_control_mcp/pdf-reader-demo.png',
        alt: 'Mission Control MCP PDF Reader Interface',
        caption: 'PDF Reader tool extracting text and metadata from documents instantly'
      }
    ],
    techStack: {
      backend: ['Python', 'FastAPI', 'MCP Protocol', 'File System Management'],
      ai: [
        'LangChain',
        'Sentence Transformers',
        'FAISS Vector Store',
        'NLP (Natural Language Processing)',
        'RAG (Retrieval-Augmented Generation)',
        'Intent Classification'
      ],
      other: [
        'PDF Processing (PyPDF2)',
        'Document Parsing (python-docx)',
        'Data Visualization (matplotlib, seaborn)',
        'Web Scraping (BeautifulSoup)',
        'CSV Analysis (pandas)',
        'Text Extraction'
      ]
    },
    gameDetails: {
      questOverview: "🎮 Mission Control Quest Complete! Built an enterprise-grade MCP server with 8 powerful AI tools for business automation, from RAG search to email classification and data visualization.",
      skillsUnlocked: [
        "🔌 MCP Protocol Mastery - Implemented Model Context Protocol for AI assistant integration",
        "🧠 RAG Engineering - Built semantic search system using transformers and FAISS",
        "📧 Intent Classification - Created intelligent email categorization with NLP",
        "📊 Data Automation - Developed automated KPI generation and visualization pipeline",
        "🛠️ Tool Architecture - Designed modular, scalable tool system with 8 specialized components",
        "🔒 Secure Processing - Implemented safe file handling for sensitive business documents"
      ],
      bossFights: [
        "⚔️ The RAG Indexing Challenge - Built efficient semantic search across thousands of documents",
        "🐉 The Multi-Tool Integration Dragon - Created unified interface handling 8 different tools simultaneously",
        "👾 The Performance Beast - Optimized real-time processing for large datasets and visualizations"
      ],
      bonusLevel: "🏆 MCP Hackathon Achievement Unlocked! Competed in MCP's 1st Birthday Hackathon, showcasing enterprise AI automation capabilities"
    }
  },
  {
    id: 'face-recognition',
    title: 'Real-Time Face Recognition System',
    description: 'Built a real-time face recognition system using face_recognition library with strategic frame resizing (0.25x) for optimized performance. Processes live webcam feeds for instant identity verification with color-coded visual feedback (green for recognized, red for unknown).',
    category: 'ai-cv',
    skills: ['Python', 'OpenCV', 'face_recognition', 'NumPy', 'Computer Vision'],
    image: '/assets/images/face-recognition/cover.png',
    github: 'https://github.com/AlBaraa63/Computer-Vision/tree/main/Face_Recognition',
    detailedDescription: 'A real-time face recognition system that identifies known faces from live webcam feeds. Implements strategic frame resizing optimization and face encoding comparison algorithms for efficient processing. Features automated face registration system and visual feedback with bounding boxes and name labels.',
    challenges: [
      'Optimizing real-time performance while maintaining recognition accuracy',
      'Handling varying lighting conditions and face orientations in live video',
      'Implementing efficient face encoding comparison for multiple known faces',
      'Creating intuitive visual feedback system for recognition states'
    ],
    solutions: [
      'Implemented strategic 0.25x frame resizing to optimize processing speed',
      'Integrated face_recognition library for robust face detection and encoding',
      'Built automated face registration system with file-based storage',
      'Created color-coded visual feedback: green boxes for recognized faces, red for unknown'
    ],
    outcomes: [
      'Successfully processes live webcam feeds with real-time recognition',
      'Efficient frame resizing enables smooth performance on standard hardware',
      'Visual feedback system with bounding boxes and name labels',
      'Automated face registration supporting multiple image formats'
    ],
    techStack: {
      frontend: ['OpenCV GUI', 'Live Video Display'],
      backend: ['Python', 'File-based Image Storage'],
      ai: ['face_recognition', 'dlib', 'OpenCV', 'NumPy'],
      other: ['Pickle Encoding Storage', 'Multi-format Image Support']
    },
    gameDetails: {
      questOverview: "🎯 Recognition Quest Complete! Built a real-time facial recognition system that identifies known faces from live video feeds with color-coded visual feedback and automated registration.",
      skillsUnlocked: [
        "👁️ Face Recognition Engineering - Mastered face_recognition library for detection and encoding",
        "🎨 Visual Feedback Design - Created intuitive color-coded recognition system with name labels",
        "⚡ Performance Optimization - Implemented strategic frame resizing for smooth real-time processing",
        "🔧 File System Integration - Built automated face registration with pickle encoding storage"
      ],
      bossFights: [
        "📷 Real-Time Processing Challenge - Solved performance optimization with strategic 0.25x frame resizing",
        "💡 Lighting Variation Challenge - Overcame inconsistent lighting using robust face detection algorithms",
        "🎯 Multi-Face Comparison Challenge - Efficiently compared detected faces against multiple known encodings"
      ],
      bonusLevel: "🏆 Extensible Architecture: System supports Gradio web interface integration for remote deployment, enabling cloud-based access control and distributed recognition applications."
    }
  },
  {
    id: 'ai-text-summarizer',
    title: 'AI Text Summarizer',
    description: 'Developed a command-line application to summarize text and PDF files using Hugging Face\'s BART model, allowing users to specify desired summary styles (briefly, in detail, bullet points). Engineered robust error handling and ensured reliability through comprehensive pytest unit testing.',
    category: 'ai-cv',
    skills: ['Python', 'Hugging Face BART', 'NLP', 'PDFPlumber', 'Pytest'],
    image: '/assets/images/ai-text-summarizer/cover.png',
    github: 'https://github.com/AlBaraa63/Computer-Vision/tree/main/Text_Summarizer',
    detailedDescription: 'A professional-grade text summarization tool leveraging Hugging Face\'s BART transformer model for advanced Natural Language Processing. Demonstrates proficiency in NLP and API integration through efficient and customizable text summarization with comprehensive error handling and testing.',
    challenges: [
      'Integrating Hugging Face BART model with proper API authentication',
      'Processing multiple file formats (text and PDF) with different parsing requirements',
      'Implementing three distinct summary styles with consistent quality',
      'Ensuring graceful error handling for missing files and API tokens',
      'Building comprehensive test coverage with API call mocks'
    ],
    solutions: [
      'Leveraged Hugging Face API with secure token management for BART model access',
      'Utilized PDFPlumber library for reliable PDF text extraction',
      'Engineered prompt templates for brief, detailed, and bullet point summaries',
      'Implemented robust error handling system with user-friendly messaging',
      'Developed comprehensive pytest suite including API call mocking'
    ],
    outcomes: [
      'Successfully processes both .txt and .pdf files with customizable output',
      'Supports 3 summary styles: briefly (concise), in detail (comprehensive), bullet points',
      'Graceful error handling for missing files or API tokens',
      'Comprehensive unit testing with pytest (including API call mocks)',
      'Demonstrated proficiency in NLP and AI model integration'
    ],
    techStack: {
      frontend: ['Command-Line Interface', 'Interactive Prompts'],
      backend: ['Python', 'File I/O Processing'],
      ai: ['Hugging Face BART', 'Transformer Models', 'NLP Pipeline'],
      other: ['PDFPlumber', 'Requests Library', 'Environment Variables', 'Pytest Testing']
    },
    gameDetails: {
      questOverview: "📚 Technical Achievement: Built an intelligent document summarization system leveraging Hugging Face BART transformers for high-quality text processing. Demonstrates proficiency in NLP and API integration.",
      skillsUnlocked: [
        "🤖 NLP Model Integration - Implemented BART transformer for advanced text summarization",
        "📄 Document Processing - Engineered robust PDF parsing with PDFPlumber",
        "🔧 API Architecture - Developed secure Hugging Face API integration with authentication",
        "🧪 Test Engineering - Established comprehensive pytest framework with mock testing"
      ],
      bossFights: [
        "🔐 API Security Challenge - Implemented secure token management and error handling",
        "📖 Document Structure Challenge - Solved PDF parsing for text and PDF files",
        "🎯 Prompt Engineering Challenge - Optimized transformer prompts for three summary styles",
        "🧪 Testing Coverage Challenge - Achieved comprehensive test coverage with mocking"
      ],
      bonusLevel: "🏆 Academic Recognition: Project earned perfect evaluation in Harvard CS50P, demonstrating production-ready Python architecture including API design, file processing, automated testing, and CLI development."
    }
  },
  {
    id: 'athkar-website',
    title: 'Responsive Athkar Website',
    description: 'Designed and built a fully responsive website with strong focus on clean user interface (UI) and positive user experience (UX). Implemented key features with vanilla JavaScript, including dark mode toggle for improved readability.',
    category: 'web-dev',
    skills: ['HTML', 'CSS', 'Vanilla JavaScript', 'Responsive Design', 'UI/UX'],
    image: '/assets/images/athkar-website/cover.png',
    github: 'https://github.com/AlBaraa63/Athkar-Application',
    liveDemo: 'https://albaraa63.github.io/Athkar-Application/',
    featured: true,
    detailedDescription: 'A fully responsive Islamic remembrance web application demonstrating proficiency in front-end development fundamentals. Features clean UI/UX design with vanilla JavaScript implementations including dark mode functionality for enhanced user experience.',
    challenges: [
      'Creating responsive design that works across all device sizes',
      'Implementing dark mode toggle without framework dependencies',
      'Ensuring clean UI/UX with intuitive navigation',
      'Building with vanilla JavaScript for optimal performance',
      'Designing culturally appropriate and accessible interface'
    ],
    solutions: [
      'Designed mobile-first responsive layout using CSS media queries',
      'Implemented dark mode toggle with vanilla JavaScript and local storage',
      'Created clean, minimalist UI focusing on readability and user experience',
      'Utilized semantic HTML and modern CSS for accessibility',
      'Optimized performance by avoiding external framework overhead'
    ],
    outcomes: [
      'Fully responsive design working seamlessly across desktop, tablet, and mobile',
      'Dark mode toggle improving readability and user preference',
      'Clean, intuitive interface with positive user experience',
      'Fast loading performance using vanilla JavaScript',
      'Demonstrated strong foundation in HTML, CSS, and JavaScript fundamentals'
    ],
    gameDetails: {
      questOverview: "🕌 Web Development Achievement: Built a fully responsive Islamic Athkar application demonstrating strong UI/UX design principles and vanilla JavaScript proficiency. Features dark mode toggle and clean interface design.",
      skillsUnlocked: [
        "📱 Responsive Web Design - Implemented mobile-first responsive layouts",
        "🎨 UI/UX Design - Created clean interface with strong focus on user experience",
        "⚡ Vanilla JavaScript - Built features without framework dependencies",
        "🔧 Dark Mode Implementation - Engineered theme toggle with local storage persistence"
      ],
      bossFights: [
        "📱 Cross-Device Compatibility - Solved responsive design across all screen sizes",
        "🔧 Dark Mode Challenge - Implemented theme switching with vanilla JavaScript",
        "🎨 UX Optimization - Created intuitive navigation and clean interface design"
      ],
      bonusLevel: "✨ Advanced Feature: Includes local storage for user preferences and optimized Arabic typography for enhanced readability."
    }
  },
  {
    id: 'color-detection',
    title: 'Real-Time Color Detection',
    description: 'Engineered a real-time color detection system that identifies and tracks yellow objects in live webcam feeds using HSV color space conversion. Features dual display with original frame and binary mask, bounding box visualization, and modular architecture for easy color customization.',
    category: 'ai-cv',
    skills: ['Python', 'OpenCV', 'NumPy', 'HSV Color Space', 'Computer Vision'],
    image: '/assets/images/color-detection/cover.png',
    github: 'https://github.com/AlBaraa63/Computer-Vision/tree/main/Color-Detection',
    liveDemo: 'https://huggingface.co/spaces/AlBaraa63/yellow_color_detection',
    detailedDescription: 'A real-time color detection system leveraging HSV color space for robust color tracking under varying lighting conditions. Processes live webcam feeds to detect specific colors, displays binary masks, and draws bounding boxes around detected regions. Built with modular utility functions for easy color switching.',
    challenges: [
      'Achieving robust color detection under varying lighting conditions',
      'Converting between BGR and HSV color spaces efficiently',
      'Implementing real-time frame processing for smooth video output',
      'Creating modular architecture for easy color customization',
      'Displaying both original frames and detection masks simultaneously'
    ],
    solutions: [
      'Utilized HSV color space for lighting-invariant color detection',
      'Implemented utility function to calculate dynamic upper/lower HSV limits',
      'Applied median blur and morphological operations to reduce noise',
      'Built modular get_limits() function enabling instant color switching',
      'Created dual-window display showing frame and mask side-by-side'
    ],
    outcomes: [
      'Real-time color tracking in live webcam feeds with smooth performance',
      'Dual display system: original frame with bounding boxes and binary mask',
      'Modular architecture supporting any color by changing BGR values',
      'Robust detection using HSV color space for varying lighting',
      'Clean, documented code with reusable utility functions'
    ],
    techStack: {
      frontend: ['OpenCV GUI', 'Real-time Video Display'],
      backend: ['Python', 'Utility Functions'],
      ai: ['OpenCV Computer Vision', 'HSV Color Processing', 'Contour Detection'],
      other: ['NumPy Arrays', 'Pillow Image Processing', 'Webcam Integration']
    },
    gameDetails: {
      questOverview: "🌈 Chromatic Vision Quest Complete! Built a real-time color tracking system that hunts specific hues through live video streams, displaying dynamic masks and bounding boxes with smooth performance.",
      skillsUnlocked: [
        "🎨 HSV Color Mastery - Mastered color space conversions for robust detection",
        "📹 Real-Time Vision Processing - Built efficient webcam stream processing pipeline",
        "📦 Bounding Box Detection - Implemented accurate region detection with contours",
        "🔧 Modular Architecture - Created reusable utility functions for color switching"
      ],
      bossFights: [
        "🌈 The Color Space Dragon - Conquered BGR to HSV conversion complexities",
        "⚡ The Real-Time Hydra - Optimized frame processing for smooth video output",
        "👻 The Lighting Phantom - Defeated varying illumination using HSV color space"
      ],
      bonusLevel: "🎨 Hidden Feature: The modular design allows instant color switching by simply modifying BGR values - perfect for creating rainbow trackers, gesture controls, or interactive art installations!"
    }
  },
  {
    id: 'teaching-my-computer-to-see',
    title: 'Teaching My Computer to See',
    description: 'Progressive computer vision learning repository with 12 self-contained Python scripts covering fundamental OpenCV concepts from basic I/O to face detection. Each module demonstrates one concept with hands-on examples for building CV foundations.',
    category: 'ai-cv',
    skills: ['Python', 'OpenCV', 'NumPy', 'Image Processing', 'Computer Vision Fundamentals'],
    image: '/assets/images/teaching-my-computer-to-see/cover.png',
    github: 'https://github.com/AlBaraa63/CV-Baby-Steps',
    detailedDescription: 'A structured "baby steps" learning repository containing 12 independent OpenCV modules covering image/video I/O, webcam streaming, cropping, resizing, color space conversions, blurring, thresholding, edge detection, drawing utilities, contours, and face detection. Designed for beginners to build hands-on experience with computer vision fundamentals.',
    challenges: [
      'Creating a clear learning progression accessible for absolute beginners',
      'Making each module independent while building on previous concepts',
      'Demonstrating both inputs and outputs for effective learning',
      'Organizing reusable assets for consistent experimentation'
    ],
    solutions: [
      'Structured repository with 12 numbered scripts introducing one concept at a time',
      'Created dedicated assets directory with sample images and videos',
      'Implemented side-by-side displays to show original and processed results',
      'Wrote clean, documented code with modular functions and clear examples'
    ],
    outcomes: [
      '12 complete learning modules: I/O (image, video, webcam), cropping, resizing, color spaces, blurring, thresholding, edge detection, drawing, contours, and face detection',
      'Hands-on examples for each fundamental computer vision technique',
      'Reusable code templates for future OpenCV projects',
      'Progressive difficulty curve from basic I/O to advanced face detection'
    ],
    techStack: {
      frontend: ['OpenCV HighGUI Windows', 'Interactive Display'],
      backend: ['Python', 'File I/O Utilities'],
      ai: ['OpenCV', 'NumPy', 'Image Processing Algorithms', 'Haar Cascades'],
      other: ['Video Capture', 'Image Formats', 'Real-Time Processing']
    },
    gameDetails: {
      questOverview: "👶 Vision Fundamentals Quest! Built a 12-module training ground teaching computer vision essentials from basic I/O operations to face detection—a hands-on journey through OpenCV foundations.",
      skillsUnlocked: [
        '📸 Vision I/O Mastery - Learned image, video, and webcam input/output workflows',
        '🎯 Image Manipulation - Practiced cropping, resizing, and transformation operations',
        '🎨 Color Space Conversion - Explored BGR, HSV, LAB, and grayscale conversions',
        '⚡ Real-Time Processing - Built responsive scripts handling live camera feeds',
        '🔍 Advanced Techniques - Implemented contour detection and face recognition'
      ],
      bossFights: [
        '📹 The Performance Challenge - Optimized real-time webcam processing loops',
        '🌗 The Lighting Beast - Mastered adaptive thresholding for varying conditions',
        '🧩 The Progression Dragon - Maintained consistent structure across 12 learning modules'
      ],
      bonusLevel: '🧪 Learning Playground: All 12 modules use shared assets directory—perfect for experimenting with your own images, videos, and parameters to deepen computer vision understanding!'
    }
  },
  {
    id: 'faceguard',
    title: 'Ai-Powered FaceGuard',
    description: 'AI-powered face anonymization tool built with MediaPipe and OpenCV. Automatically detects and blurs faces in images, videos, and real-time webcam feeds to protect privacy.',
    category: 'ai-cv',
    skills: ['Python', 'OpenCV', 'MediaPipe', 'Image Processing', 'Computer Vision'],
    image: '/assets/images/faceguard/cover.png',
    github: 'https://github.com/AlBaraa63/Computer-Vision/tree/main/Face-Anonymizer',
    detailedDescription: 'FaceGuard is a comprehensive tool for face detection and anonymization, supporting images, video files, and live webcam feeds. It uses MediaPipe for robust face detection and OpenCV for fast, customizable blurring, providing an easy-to-use command-line interface with automatic input/output management.',
    challenges: [
      'Ensuring real-time performance for video and webcam processing while maintaining accurate detection',
      'Managing multiple input types (images, videos, live webcam) in a single, cohesive tool',
      'Allowing adjustable blur intensity while keeping the interface simple and intuitive',
      'Organizing input/output directories for smooth user experience and reproducibility'
    ],
    solutions: [
      'Integrated MediaPipe for accurate face detection and OpenCV for efficient blurring',
      'Built a flexible CLI to support image, video, and webcam modes',
      'Implemented configurable blur intensity as a command-line argument',
      'Structured input/output directories automatically for user-friendly workflow'
    ],
    outcomes: [
      'A ready-to-use face anonymization tool suitable for privacy protection and research',
      'Supports images, videos, and real-time webcam streams with adjustable blur levels',
      'Clean, modular, and well-documented code for easy adaptation and future extensions',
      'Portfolio-ready project showcasing computer vision and AI implementation skills'
    ],
    techStack: {
      frontend: ['OpenCV HighGUI Windows', 'Interactive CLI'],
      backend: ['Python', 'File I/O Utilities'],
      ai: ['OpenCV', 'MediaPipe', 'NumPy', 'Image Processing Algorithms'],
      other: ['Command-Line Tooling', 'Automated Input/Output Management']
    },
    gameDetails: {
      questOverview: "🛡️ Embarked on the FaceGuard quest to build an AI tool capable of detecting and blurring faces across multiple media types, ensuring privacy and GDPR compliance.",
      skillsUnlocked: [
        '📸 Real-Time Face Detection - Mastered MediaPipe integration for images, videos, and webcam',
        '🎯 Image & Video Manipulation - Practiced region extraction and pixel-level blurring',
        '⚡ CLI Design & Automation - Built user-friendly, flexible command-line interface',
        '🧩 Modular Workflow - Developed reusable, structured Python scripts for future CV projects'
      ],
      bossFights: [
        '📹 The Frame Rate Nemesis - Optimized video and webcam loops for smooth performance',
        '🌗 The Lighting Phantom - Tuned detection under varied lighting conditions',
        '🧩 The Input Hydra - Handled multiple input types consistently and reliably'
      ],
      bonusLevel: '🧪 Bonus Level: Easily extendable for pixelation, masking, or integrating new CV models for advanced anonymization.'
    }
  },
  {
    id: 'ocr-text-detection',
    title: 'Intelligent OCR Text Detection System',
    description: 'OCR application featuring dual interfaces (Streamlit web app & CLI) for extracting text from images. Implements advanced preprocessing pipeline with 4 specialized modes using CLAHE enhancement, bilateral filtering, adaptive thresholding, and strategic upscaling for optimal results.',
    category: 'ai-cv',
    skills: ['Python', 'OpenCV', 'Tesseract OCR', 'Streamlit', 'Image Processing', 'Computer Vision'],
    image: '/assets/images/ocr-text-detection/cover.png',
    github: 'https://github.com/AlBaraa63/Text-Detection',
    liveDemo: 'https://huggingface.co/spaces/AlBaraa63/text_detection',
    featured: true,
    detailedDescription: 'An Optical Character Recognition system combining advanced computer vision preprocessing techniques with Tesseract OCR engine. Features dual interfaces: an interactive Streamlit web application with real-time text analytics (word/character/line counts) and a command-line tool for automation. Implements intelligent preprocessing with 8+ enhancement functions organized into 4 specialized modes.',
    challenges: [
      'Handling varying image qualities and lighting conditions effectively',
      'Designing adaptive preprocessing pipeline with multiple enhancement techniques',
      'Building intuitive dual interface (web + CLI) for different user needs',
      'Optimizing preprocessing for better OCR text extraction',
      'Implementing visual feedback system with text analytics dashboard'
    ],
    solutions: [
      'Engineered 4 preprocessing modes (Default, Aggressive, Light, Upscale) with specialized pipelines',
      'Integrated 8+ advanced techniques: CLAHE contrast enhancement, bilateral filtering, Otsu\'s thresholding, morphological operations',
      'Built Streamlit web interface with drag-and-drop upload and real-time statistics',
      'Implemented strategic 2.5x upscaling for better text recognition',
      'Created modular preprocessing.py with reusable functions and CLI automation support'
    ],
    outcomes: [
      'Dual interface system: Interactive Streamlit web app and automation-ready CLI tool',
      '4 preprocessing modes with 8+ image enhancement algorithms',
      'Real-time text analytics: word count, character count, line count display',
      'Modular preprocessing.py with functions for grayscale, thresholding, noise removal, contrast enhancement, dilation, erosion, inversion, and resizing',
      'Production-ready features: text analytics dashboard, download functionality, automated file organization'
    ],
    techStack: {
      frontend: ['Streamlit', 'Interactive Web UI', 'Real-time Analytics Dashboard'],
      backend: ['Python', 'File I/O Processing', 'Text Export System'],
      ai: ['Tesseract OCR Engine', 'OpenCV Computer Vision', 'Pytesseract', 'NumPy'],
      other: ['CLAHE Enhancement', 'Adaptive Thresholding', 'Bilateral Filtering', 'Morphological Operations']
    },
    gameDetails: {
      questOverview: "📝 Document Intelligence Quest Complete! Built a dual-powered OCR system that transforms images into searchable text using advanced computer vision preprocessing and Tesseract OCR. Features both an elegant Streamlit web portal and a command-line tool for automation.",
      skillsUnlocked: [
        "🔬 Advanced Preprocessing Mastery - Engineered 8+ enhancement functions including CLAHE, bilateral filtering, and Otsu's thresholding",
        "🎨 Dual Interface Architecture - Created Streamlit web app and CLI tool for versatile deployment",
        "🧠 OCR Integration - Integrated Tesseract OCR with custom preprocessing pipeline",
        "📊 Analytics Engineering - Built real-time statistics dashboard with word/character/line counting",
        "⚙️ Pipeline Design - Organized 8+ functions into 4 specialized preprocessing modes"
      ],
      bossFights: [
        "🌗 The Illumination Demon - Conquered varying lighting with adaptive preprocessing and CLAHE enhancement",
        "📄 The Quality Hydra - Defeated low-resolution challenges with strategic 2.5x upscaling and noise reduction",
        "🎯 The Interface Chimera - Built seamless dual interface balancing simplicity with advanced features",
        "🔧 The Modularity Dragon - Organized preprocessing functions into clean, reusable architecture"
      ],
      bonusLevel: "🏆 Production Features: Streamlit web interface with professional UI, comprehensive documentation, and modular preprocessing.py. Supports multiple image formats, instant text export, and automated output organization. Ready for document digitization workflows!"
    }
  },
  {
    id: 'car-image-classification',
    title: 'Car Image Classification with SVM',
    description: 'Machine learning image classifier achieving 99.92% accuracy in distinguishing cars from non-cars using Support Vector Machines. Implements GridSearchCV for automatic hyperparameter optimization and processes images efficiently with anti-aliasing and feature extraction.',
    category: 'ai-cv',
    skills: ['Python', 'scikit-learn', 'Machine Learning', 'SVM', 'OpenCV', 'Image Processing'],
    image: '/assets/images/car-image-classification/cover.png',
    github: 'https://github.com/AlBaraa63/Computer-Vision/tree/main/image_classification',
    detailedDescription: 'A production-ready machine learning classifier using Support Vector Machines (SVM) with RBF kernel to distinguish between car and non-car images. Implements automated hyperparameter tuning through GridSearchCV, testing multiple C and gamma values with 5-fold cross-validation. Features efficient image preprocessing with 15x15 pixel resizing and anti-aliasing, achieving near-perfect classification performance.',
    challenges: [
      'Achieving high accuracy while maintaining fast training times',
      'Optimizing hyperparameters for best model performance',
      'Preprocessing images of varying sizes and qualities consistently',
      'Balancing model complexity with computational efficiency',
      'Ensuring robust performance across different image conditions'
    ],
    solutions: [
      'Implemented GridSearchCV with 5-fold cross-validation for automatic hyperparameter optimization',
      'Tested C values [1, 10, 100, 1000] and gamma values [0.001, 0.0001] systematically',
      'Resized all images to 15x15 pixels with anti-aliasing for consistency',
      'Used RBF kernel SVM for handling non-linear decision boundaries',
      'Applied 80/20 train-test split for reliable performance evaluation'
    ],
    outcomes: [
      'Achieved 99.92% accuracy on test dataset with 1217 samples',
      'Perfect precision (1.00) and recall (1.00) for both classes',
      'Optimal hyperparameters found: C=1000, gamma=0.001',
      'Confusion matrix shows only 1 misclassification out of 1217 samples',
      'Fast training with parallel processing and efficient feature extraction'
    ],
    techStack: {
      frontend: ['Result Visualization', 'Confusion Matrix Display'],
      backend: ['Python', 'File I/O Management'],
      ai: ['scikit-learn SVM', 'GridSearchCV', 'RBF Kernel', 'Cross-Validation'],
      other: ['scikit-image', 'NumPy Arrays', 'Anti-aliasing', 'Feature Extraction']
    },
    gameDetails: {
      questOverview: "🚗 Classification Quest Complete! Built a high-accuracy machine learning classifier using Support Vector Machines to distinguish cars from non-cars, achieving 99.92% accuracy through automated hyperparameter optimization.",
      skillsUnlocked: [
        "🤖 SVM Mastery - Implemented Support Vector Machine with RBF kernel for image classification",
        "🔧 Hyperparameter Tuning - Mastered GridSearchCV for automatic model optimization",
        "📊 ML Evaluation - Built comprehensive evaluation pipeline with confusion matrix and metrics",
        "🖼️ Image Preprocessing - Engineered consistent image resizing with anti-aliasing",
        "⚡ Model Optimization - Achieved near-perfect accuracy with efficient training"
      ],
      bossFights: [
        "🎯 The Accuracy Dragon - Conquered classification challenge with 99.92% accuracy",
        "⚙️ The Hyperparameter Beast - Optimized C and gamma values through systematic grid search",
        "🖼️ The Image Variance Hydra - Handled diverse image sizes and qualities with consistent preprocessing",
        "⚡ The Performance Demon - Balanced accuracy with fast training using efficient feature extraction"
      ],
      bonusLevel: "🏆 Machine Learning Excellence: Achieved perfect precision and recall (1.00) for both classes with only 1 misclassification in 1217 test samples. Demonstrates strong foundation in supervised learning, model evaluation, and real-world ML deployment!"
    }
  },
  {
    id: 'teeth-classification',
    title: 'Teeth Classification with Deep Learning',
    description: 'Custom CNN with residual connections achieving 97.67% accuracy classifying dental images into 7 oral health conditions (Calculus, Caries, Gum Disease, Mouth Cancer, Oral Candidiasis, Oral Lichen Planus, Oral Trauma). Built from scratch using PyTorch with ResNet-inspired architecture, trained on 5,143 dental images during internship at Cellula Technologies.',
    category: 'ai-cv',
    skills: ['Python', 'PyTorch', 'Deep Learning', 'CNN', 'Computer Vision', 'ResNet', 'Image Classification', 'Medical Imaging'],
    image: '/assets/images/teeth-classification/cover.png',
    github: 'https://github.com/AlBaraa63/teeth-classification',
    detailedDescription: 'A deep learning computer vision project that classifies dental images into 7 distinct oral health conditions using a custom Convolutional Neural Network built from scratch with PyTorch. The model incorporates architectural concepts from landmark papers (AlexNet and ResNet), featuring residual blocks with skip connections for improved gradient flow and deeper learning. With ~2.7 million parameters (much smaller than ResNet-18), the model achieves 97.67% validation accuracy across 7 dental condition classes. Developed during an internship at Cellula Technologies.',
    challenges: [
      'Designing a custom CNN architecture from scratch that balances accuracy with model size',
      'Implementing residual connections to enable effective gradient flow in deeper networks',
      'Handling medical image classification with limited dataset of 5,143 dental images',
      'Achieving high per-class accuracy across 7 visually similar dental conditions',
      'Applying appropriate data augmentation without distorting diagnostically relevant features'
    ],
    solutions: [
      'Built ResNet-inspired architecture with 4 stages of residual blocks and progressive channel expansion (32→64→128→256→512)',
      'Implemented skip connections with proper downsampling for dimension matching between layers',
      'Applied medical-conscious data augmentation: limited rotation (±15°), color jitter, random affine transforms',
      'Used global average pooling to dramatically reduce parameters while maintaining spatial information',
      'Employed Kaiming initialization, batch normalization, and dropout (0.5) for stable and regularized training'
    ],
    outcomes: [
      'Achieved 97.67% validation accuracy and 97%+ test accuracy across 7 dental conditions',
      'Per-class accuracy ranging from 92.6% to 100% demonstrating balanced performance',
      'Model contains only ~2.7 million parameters — significantly smaller than standard ResNet-18',
      'Successfully classifies: Calculus, Caries, Gum Disease, Mouth Cancer, Oral Candidiasis, Oral Lichen Planus, and Oral Trauma',
      'Training converged in ~45 epochs with early stopping and learning rate scheduling'
    ],
    visuals: [
      {
        src: '/assets/images/teeth-classification/cover.png',
        alt: 'Sample Images from Each Dental Class',
        caption: 'Sample images from all 7 dental condition classes (CaS, CoS, Gum, MC, OC, OLP, OT) at 256x256 resolution used for training'
      },
      {
        src: '/assets/images/teeth-classification/confusion_matrix.png',
        alt: 'Confusion Matrix for Teeth Classification',
        caption: 'Confusion matrix showing model performance across all 7 dental condition classes with 97%+ accuracy'
      },
      {
        src: '/assets/images/teeth-classification/training_history.png',
        alt: 'Training History',
        caption: 'Training and validation accuracy/loss curves showing model convergence over ~45 epochs with early stopping'
      },
      {
        src: '/assets/images/teeth-classification/per_class_accuracy.png',
        alt: 'Per-Class Accuracy',
        caption: 'Per-class accuracy breakdown ranging from 92.6% to 100% across all 7 dental conditions'
      },
      {
        src: '/assets/images/teeth-classification/sample_predictions.png',
        alt: 'Sample Predictions',
        caption: 'Sample predictions showing the model correctly identifying various dental conditions from test images'
      },
      {
        src: '/assets/images/teeth-classification/class_distribution.png',
        alt: 'Class Distribution in Training Set',
        caption: 'Dataset distribution across 7 classes: MC and OLP highest (540 each), OC lowest (324), totaling 3,087 training images'
      },
      {
        src: '/assets/images/teeth-classification/augmentation_comparison.png',
        alt: 'Data Augmentation Visualization',
        caption: 'Medical-conscious augmentation pipeline showing original vs 5 augmented variants (rotation, color jitter, affine transforms) compared to validation transform (no augmentation)'
      },
      {
        src: '/assets/images/teeth-classification/normalization_explained.png',
        alt: 'Understanding Normalization Pipeline',
        caption: 'Three-stage normalization visualization: ToTensor (0-1 range), ImageNet Normalize (centered around 0), and Denormalize (back to 0-1) with pixel value histograms'
      },
      {
        src: '/assets/images/teeth-classification/feature_maps.png',
        alt: 'CNN Feature Maps at Each Layer',
        caption: 'What the model sees: mean activations and Channel 0 feature maps across all 4 residual blocks (32ch 112x112 to 256ch 14x14) showing progressive abstraction'
      }
    ],
    techStack: {
      ai: [
        'PyTorch 2.2',
        'Custom CNN with Residual Blocks',
        'torchvision',
        'Kaiming Initialization',
        'Batch Normalization',
        'Global Average Pooling'
      ],
      backend: [
        'Python 3.12',
        'NumPy',
        'Matplotlib',
        'Pillow (PIL)',
        'tqdm'
      ],
      other: [
        'Adam Optimizer',
        'ReduceLROnPlateau Scheduler',
        'Early Stopping',
        'Cross-Entropy Loss',
        'Data Augmentation Pipeline',
        'ImageNet Normalization'
      ]
    },
    gameDetails: {
      questOverview: "🦷 Dental AI Quest Complete! Built a custom CNN from scratch with residual connections to classify 7 oral health conditions with 97.67% accuracy. From Calculus to Mouth Cancer detection — trained on 5,143 dental images during internship at Cellula Technologies!",
      skillsUnlocked: [
        "🧠 Custom CNN Architecture - Designed ResNet-inspired model with residual blocks from scratch",
        "🔗 Residual Connections - Implemented skip connections for effective gradient flow in deeper networks",
        "🦷 Medical Image Classification - Classified 7 dental conditions with per-class accuracy up to 100%",
        "⚡ Training Optimization - Mastered learning rate scheduling, early stopping, and Kaiming initialization",
        "📊 Data Pipeline Engineering - Built medical-conscious augmentation preserving diagnostic features",
        "🏗️ Efficient Architecture - Achieved 97.67% accuracy with only ~2.7M parameters"
      ],
      bossFights: [
        "⚔️ The Architecture Design Challenge - Building effective CNN from scratch without pretrained models",
        "🐉 The Residual Connection Dragon - Implementing skip connections with proper dimension matching",
        "🎯 The Medical Accuracy Beast - Achieving 97%+ accuracy across 7 visually similar dental conditions",
        "🧪 The Small Dataset Challenge - Training effectively on only 5,143 dental images with smart augmentation"
      ],
      bonusLevel: "🌟 MEDICAL AI IMPACT: Built a foundation for automated dental condition screening that could serve as diagnostic support for dental professionals, educational resource for dental students, or basis for mobile/web deployment!"
    }
  },
  {
    id: 'tomato-care',
    title: 'TomatoCare – Offline Bilingual Disease Detection App',
    description: 'Capstone project: fully offline, bilingual (EN/AR) Android app that diagnoses tomato leaf diseases in the field using a 3-stage MobileNetV3 TFLite cascade — leaf gate → tomato gate → 11-class classifier — at 9.87 MB and 12–20 ms on-device inference.',
    category: 'ai-cv',
    skills: ['Python', 'TFLite', 'MobileNetV3', 'Kotlin', 'Jetpack Compose', 'CameraX', 'ONNX', 'Edge AI', 'Android', 'Model Quantization'],
    image: '/assets/images/tomato-care/cover.png',
    github: 'https://github.com/AlBaraa63/TomatoCare',
    featured: false,
    detailedDescription: 'TomatoCare is a capstone Android application for on-device tomato disease diagnosis — built to work fully offline in UAE agricultural fields. The AI pipeline uses a 3-stage MobileNetV3 TFLite cascade: a leaf-presence gate eliminates non-plant images, a tomato-specific gate filters other crops, then an 11-class disease classifier runs in under 20 ms. The app is bilingual (English/Arabic with RTL support), shows severity badges, filters treatment recommendations for UAE growing conditions, and includes an on-device feedback flywheel for continuous retraining. Shipped with 48 JVM unit tests, Compose UI tests, GitHub Actions CI, and Docker reproducible builds.',
    challenges: [
      'Achieving field-accurate inference (77.2%) under real outdoor conditions vs 97.59% lab accuracy with a single tiny model',
      'Building a fully offline app that still delivers rich UI/UX — no internet, no cloud API',
      'Supporting bilingual RTL Arabic layout without layout breakage across all Android screen sizes',
      'Keeping the total model footprint under 10 MB while maintaining high accuracy across 11 classes',
    ],
    solutions: [
      'Designed a 3-stage cascade (leaf gate → tomato gate → disease classifier) to progressively filter invalid inputs before the expensive classifier runs',
      'Quantized MobileNetV3 to TFLite INT8 format, achieving 9.87 MB total size with 12–20 ms end-to-end inference on mid-range devices',
      'Used Jetpack Compose with built-in RTL/LTR layout switching and Arabic typography tuning',
      'Implemented on-device feedback flywheel to collect and store misclassified images for periodic model retraining',
    ],
    outcomes: [
      '97.59% lab accuracy, 77.2% field accuracy across 11 tomato disease classes',
      '9.87 MB total model footprint, 12–20 ms end-to-end on-device inference',
      'Fully offline — zero network calls required after app installation',
      'Bilingual EN/AR support with RTL layout throughout',
      '48 JVM unit tests + Compose UI tests, GitHub Actions CI, Docker reproducible builds',
    ],
    techStack: {
      frontend: ['Kotlin', 'Jetpack Compose', 'CameraX', 'Android', 'RTL/LTR Layouts'],
      backend: ['Python', 'TFLite Runtime', 'ONNX Export'],
      ai: ['MobileNetV3', 'TensorFlow Lite', 'INT8 Quantization', 'Model Cascade', 'Transfer Learning'],
      other: ['GitHub Actions CI', 'Docker', 'JVM Unit Tests', 'Compose UI Tests', 'Edge Deployment'],
    },
    gameDetails: {
      questOverview: '🍅 Edge AI Quest Complete! Shipped a fully offline Android app that runs a 3-stage MobileNetV3 cascade to diagnose tomato diseases in under 20 ms — no internet, no cloud, just on-device intelligence.',
      skillsUnlocked: [
        '📱 Android Development — Kotlin + Jetpack Compose + CameraX end-to-end',
        '⚡ Edge AI Deployment — TFLite INT8 quantization for sub-10 MB, sub-20 ms inference',
        '🌳 Model Cascade Design — 3-stage progressive filtering to maximize accuracy at scale',
        '🌍 Bilingual RTL Architecture — Full Arabic/English support with layout engine integration',
        '🧪 Production-grade CI — 48 unit tests, Compose UI tests, GitHub Actions, Docker builds',
      ],
      bossFights: [
        '🌾 The Field Accuracy Gap — bridging 97.59% lab vs 77.2% real-world performance',
        '📦 The 10 MB Wall — fitting 11-class accuracy into a sub-10 MB TFLite model',
        '🔤 The RTL Dragon — full Arabic RTL layout without breaking Compose structure',
      ],
      bonusLevel: '🏆 Capstone Achievement: Deployed a production-ready offline disease detection tool for UAE farmers — real-world impact with zero cloud dependency.',
    },
  },
  {
    id: 'f-unet',
    title: 'F-UNet – Flexible U-Net for Medical Image Segmentation',
    description: 'Research framework for multi-modal medical image segmentation. Modular plug-and-play encoder–decoder with 8 YAML-controlled ablation configurations (A0–A7), unifying 2D/3D pipelines across 5 imaging domains. Cuts model size by 82% (5.39M params) vs standard U-Net while outperforming baselines. Accepted as poster at SRC2026.',
    category: 'ai-cv',
    skills: ['PyTorch', 'U-Net', 'Medical Imaging', 'Attention Gates', 'Involution', 'YAML Config', 'Ablation Study', 'Mixed Precision', 'Research'],
    image: '/assets/images/f-unet/cover.png',
    github: 'https://github.com/AlBaraa63/F-UNet',
    featured: false,
    detailedDescription: 'F-UNet is a modular segmentation research framework that lets researchers mix-and-match three architectural components — Encoder (E), Dense Bottleneck (B), Attention Gates (A) — via a single YAML config file. This yields 8 combinatorial ablation configurations (A0–A7), from a vanilla U-Net baseline (A0) to the full F-UNet (A7). The encoder block uses Residual Involution + SE Attention instead of standard double-conv; the bottleneck uses dense residual involution; and skip connections use attention gates instead of plain concatenation. The framework supports 2D and 3D pipelines across 5 medical imaging datasets (Chest X-Ray, BUSI, GlaS, CVC-ClinicDB, and a 3D modality). Supervised by Dr. Armagan Elibol at Al Ain University. Accepted as a poster at SRC2026.',
    challenges: [
      'Designing a single codebase that handles 8 ablation configurations without code duplication or brittle conditionals',
      'Unifying 2D and 3D segmentation pipelines under the same architecture and training loop',
      'Implementing Involution layers (parameter-efficient, input-adaptive convolution) efficiently in PyTorch',
      'Running full ablation studies across 5 datasets with automatic crash recovery and results tracking',
    ],
    solutions: [
      'YAML-driven architecture: each boolean flag (E, B, A) toggles a module at runtime — no code changes needed per experiment',
      'Shared encoder/decoder abstractions with optional residual paths, making 2D→3D transition a config-level change',
      'Custom PyTorch Involution layer with channel-grouped kernels and SE attention for spatial adaptivity',
      'Batch ablation runner with automatic result caching — skips completed runs on crash recovery',
    ],
    outcomes: [
      '8 ablation configurations from a single codebase, fully YAML-controlled',
      '82% model size reduction (5.39M parameters vs standard ResNet-UNet baselines)',
      'Unified 2D/3D pipeline across Chest X-Ray, BUSI, GlaS, CVC-ClinicDB, and 3D imaging datasets',
      'Accepted as poster at SRC2026 — 17th Student Research Conference on Applied Computing',
      'Foundation model zero-shot benchmarking (SAM) included for comparison',
    ],
    techStack: {
      ai: ['PyTorch', 'U-Net Architecture', 'Involution Layers', 'Attention Gates', 'SE Attention', 'Dense Connections', 'Mixed Precision (AMP)'],
      backend: ['Python 3.10+', 'YAML Config System', 'Ablation Runner', 'Result Caching'],
      other: ['Medical Image Datasets (BUSI, GlaS, CVC-ClinicDB, Chest X-Ray)', 'SAM Zero-Shot Benchmarking', 'Dice Loss / Tversky Loss'],
    },
    gameDetails: {
      questOverview: '🔬 Research Quest: Designed a modular U-Net framework with 8 YAML-controlled ablation configs, unifying 2D/3D medical segmentation across 5 datasets. 82% smaller than baselines. Accepted at SRC2026.',
      skillsUnlocked: [
        '🏗️ Modular Architecture Design — YAML-driven plug-and-play components without code duplication',
        '🧬 Medical Image Segmentation — Chest X-Ray, BUSI, GlaS, CVC-ClinicDB pipelines',
        '⚡ Involution Layers — Parameter-efficient spatial-adaptive convolution in PyTorch',
        '📐 Attention Gates — Gated skip connections for focused feature selection',
        '🔬 Ablation Methodology — 8-config systematic study with automatic crash recovery',
      ],
      bossFights: [
        '🧩 The Unification Challenge — one codebase, 8 configs, 5 datasets, 2D + 3D pipelines',
        '📦 The Parameter Budget — 82% size reduction without accuracy degradation',
        '🔁 The Ablation Marathon — full grid search with crash recovery across all configs × datasets',
      ],
      bonusLevel: '🏆 SRC2026 Accepted: Research-grade framework supervised by Dr. Armagan Elibol — a direct foundation for publication and further architectural innovation in medical AI.',
    },
  },
  {
    id: 'shoplifting-detection',
    title: 'Real-Time Shoplifting Detection System',
    description: 'Led a 5-member team at Cellula Technologies building a real-time retail security system using a 7-model bake-off strategy (VideoMAE, MoViNet, TimeSformer, YOLO+LRCN). MVC architecture: FastAPI controller, Streamlit dashboard, PostgreSQL incident logging, Docker deployment.',
    category: 'ai-cv',
    skills: ['VideoMAE', 'MoViNet', 'TimeSformer', 'YOLOv8', 'FastAPI', 'Streamlit', 'PostgreSQL', 'Docker', 'Python', 'Team Leadership'],
    image: '/assets/images/shoplifting-detection/cover.png',
    featured: false,
    detailedDescription: 'A real-time shoplifting detection system built during internship at Cellula Technologies, leading a 5-member engineering team. The system uses a model bake-off strategy where each team member implements a different SOTA video understanding approach (VideoMAE, MoViNet, TimeSformer, YOLO+LRCN, X3D/I3D) to find the best speed/accuracy tradeoff for edge retail deployment. Architecture follows MVC: a sliding-window FastAPI controller feeds 24-frame buffers to the selected model, triggers PostgreSQL incident logging on detection, and surfaces everything through a real-time Streamlit dashboard. Containerized with Docker for reproducible deployment.',
    challenges: [
      'Coordinating a 5-member team across 5 different model implementations without merge conflicts',
      'Designing a model-agnostic controller layer that swaps video understanding backends without code changes',
      'Processing 24-frame sliding windows in real time for smooth security monitoring performance',
      'Handling class imbalance between normal and shoplifting behaviors in training data',
    ],
    solutions: [
      'Defined strict MVC separation: each member owns one directory (models/, views/, controllers/) with a shared interface',
      'Built a model-agnostic FastAPI controller that accepts any model via a unified predict(frames) → score interface',
      'Implemented sliding window buffer with configurable stride for real-time frame throughput',
      'Applied Focal Loss and class weighting to address 218 duplicate removal and behavioral class imbalance',
    ],
    outcomes: [
      '7-model bake-off completed — MoViNet selected as primary for edge-optimized real-time performance',
      'Real-time dashboard showing live probability scores, incident timeline, and camera feeds',
      'PostgreSQL-backed incident logging with timestamp, confidence score, and camera ID',
      'Dockerized deployment for reproducible retail environment setup',
      'Hands-on team leadership experience managing deliverables across 5 engineers',
    ],
    techStack: {
      ai: ['VideoMAE', 'MoViNet', 'TimeSformer', 'YOLO + LRCN', 'X3D / I3D', 'Video Action Recognition', 'Focal Loss'],
      backend: ['Python', 'FastAPI', 'PostgreSQL', 'Sliding Window Buffer', 'Docker'],
      frontend: ['Streamlit', 'Real-time Video Dashboard', 'Incident Timeline'],
      other: ['MVC Architecture', 'Team Leadership (5 members)', 'Git Workflow Design'],
    },
    gameDetails: {
      questOverview: '🛡️ Security AI Quest: Led a 5-member team through a 7-model bake-off to build a real-time shoplifting detection system — from VideoMAE research to Streamlit dashboard to PostgreSQL incident logs.',
      skillsUnlocked: [
        '👥 Technical Team Leadership — managed 5 engineers across parallel model tracks',
        '🎬 Video Action Recognition — VideoMAE, MoViNet, TimeSformer, YOLO+LRCN evaluation',
        '🏗️ MVC System Design — model-agnostic controller enabling backend swap without code changes',
        '🗄️ Real-time Pipeline — 24-frame sliding window processing with live dashboard',
      ],
      bossFights: [
        '🐉 The Merge Conflict Dragon — 5 engineers, 5 model branches, one clean main',
        '⚡ The Latency Hydra — real-time 24-frame window processing without dropped frames',
        '⚖️ The Class Imbalance Beast — rare shoplifting events in a sea of normal behavior',
      ],
      bonusLevel: '🏆 Production Leadership: First experience owning a multi-engineer project from architecture design to deployment — MVC structure, Docker containerization, and shared interface design.',
    },
  },
  {
    id: 'defect-detection',
    title: 'AI Defect Detection System – Camera to Arduino',
    description: 'End-to-end hardware-integrated AI pipeline: webcam captures mechanical parts on a conveyor belt, a CNN classifies defective vs OK in real time, and Python sends the result via Serial to an Arduino that triggers an actuator to eject the defective part.',
    category: 'ai-cv',
    skills: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'PySerial', 'Arduino', 'Real-time Inference', 'Hardware Integration', 'Edge AI'],
    image: '/assets/images/defect-detection/cover.png',
    featured: false,
    detailedDescription: 'A complete embedded AI pipeline built from scratch: a camera feed captures mechanical components (nuts, bolts, pipe fittings) moving along a simulated conveyor belt → a TensorFlow/Keras CNN classifies each frame as defective (1) or OK (0) in real time → Python sends the binary result over USB Serial to an Arduino → the Arduino drives an actuator to physically eject the defective part. The system demonstrates full-stack AI integration from data collection and model training through real-time deployment to physical actuation.',
    challenges: [
      'Achieving reliable serial communication timing between Python inference and Arduino actuation without dropped signals',
      'Building a training dataset from scratch — capturing, labeling, and augmenting real mechanical part images',
      'Keeping inference latency low enough for conveyor-belt real-time operation on standard hardware',
      'Handling lighting variation and camera angle inconsistency in an uncontrolled industrial-like environment',
    ],
    solutions: [
      'Designed a lightweight Keras CNN optimized for binary classification at low latency on CPU',
      'Built a PySerial communication layer with signal confirmation handshake to prevent missed actuator triggers',
      'Applied data augmentation (rotation, brightness, flip) to handle real-world image variation',
      'Used OpenCV for real-time preprocessing (resize, normalize) before model inference',
    ],
    outcomes: [
      'Complete camera → inference → serial → actuation pipeline running in real time',
      'Binary classification (defective/OK) with reliable Arduino actuator triggering via PySerial',
      'Demonstrates end-to-end embedded AI from model training to physical hardware control',
      'Modular codebase: camera.py, predict.py, arduino.py, main.py — each independently testable',
    ],
    techStack: {
      ai: ['TensorFlow 2', 'Keras CNN', 'OpenCV', 'Real-time Inference', 'Binary Classification'],
      backend: ['Python 3.10+', 'PySerial', 'NumPy', 'File I/O'],
      other: ['Arduino (C)', 'USB Serial Communication', 'Hardware Actuation', 'Conveyor Belt Simulation'],
    },
    gameDetails: {
      questOverview: '🔩 Hardware AI Quest: Built a full camera→CNN→Arduino pipeline that physically ejects defective parts on a conveyor belt using real-time computer vision and serial communication.',
      skillsUnlocked: [
        '🤖 Embedded AI Integration — end-to-end from camera capture to physical actuation',
        '📡 Serial Communication — PySerial handshake protocol for reliable Arduino triggering',
        '⚡ Real-time CNN Inference — lightweight Keras model optimized for CPU-speed production',
        '🔧 Hardware-Software Bridge — Python controlling physical hardware via USB Serial',
      ],
      bossFights: [
        '📡 The Timing Dragon — synchronizing Python inference speed with Arduino actuation window',
        '🌗 The Lighting Phantom — robust CNN under uncontrolled industrial lighting conditions',
        '📦 The Dataset Challenge — building training data from scratch for mechanical part defects',
      ],
      bonusLevel: '🏆 Real-World Impact: Demonstrates the complete AI deployment loop — data → model → inference → hardware — making abstract deep learning tangible with physical actuator control.',
    },
  },
  {
    id: 'minecraft-cv',
    title: 'Minecraft CV Automation',
    description: 'Side project: real-time screen capture CV system that detects inventory items in Minecraft using template matching and HSV color detection, then automates AFK farming with global hotkeys and CPU-optimized processing.',
    category: 'other',
    skills: ['Python', 'OpenCV', 'mss', 'PyAutoGUI', 'pynput', 'Template Matching', 'HSV Detection', 'Real-time Processing'],
    image: '/assets/images/minecraft-cv/cover.png',
    github: 'https://github.com/AlBaraa63/minecraft-cv',
    featured: false,
    detailedDescription: 'A fun creative project applying computer vision to automate Minecraft AFK mob grinding. The script captures the primary monitor in real time using mss (screen capture), detects the inventory GUI opening, finds diamond items using a combination of template matching and HSV color range detection, and automates mouse clicks via PyAutoGUI. Features global keyboard shortcuts (F6/F7/F8) that work even while Minecraft has window focus, CPU-optimized frame processing (20–40% CPU vs naive 60–80%), real-time CPU monitoring with color-coded terminal display, and pause/resume functionality.',
    challenges: [
      'Making global keyboard shortcuts work while a fullscreen game has focus — standard keyboard listeners are blocked',
      'Reducing CPU usage from 60–80% (naive loop) to 20–40% without introducing detection latency',
      'Reliable template matching across different Minecraft texture packs and window scales',
    ],
    solutions: [
      'Used pynput for low-level global keyboard hook that intercepts keystrokes before the OS passes them to Minecraft',
      'Implemented frame skipping, ROI cropping (only scan inventory area), and sleep-based throttling for CPU optimization',
      'Dual detection strategy: template matching for GUI detection + HSV color range for item identification',
    ],
    outcomes: [
      'Fully automated AFK farming loop with global pause/resume hotkeys',
      'CPU usage reduced from ~70% to 20–40% with frame-skip optimization',
      'Real-time monitoring display with CPU usage color-coding (green/yellow/red)',
      'Demonstrates creative application of OpenCV concepts from the CV Baby Steps project',
    ],
    techStack: {
      ai: ['OpenCV Template Matching', 'HSV Color Detection', 'Contour Detection'],
      backend: ['Python', 'mss (Screen Capture)', 'pynput (Global Hotkeys)'],
      other: ['PyAutoGUI (Mouse Automation)', 'psutil (CPU Monitoring)', 'Real-time Processing'],
    },
    gameDetails: {
      questOverview: '🎮 Easter Egg Unlocked: Applied real computer vision — template matching, HSV detection, global hooks — to automate a video game. Because the best way to practice CV is to make it do something ridiculous.',
      skillsUnlocked: [
        '🖥️ Screen Capture CV — mss for real-time monitor frame grabbing at low latency',
        '🎯 Template Matching — GUI and item detection under scale and texture variation',
        '⌨️ Global Hotkeys — pynput low-level keyboard hooks bypassing fullscreen focus',
        '⚡ CPU Optimization — frame skipping + ROI cropping for 50% CPU reduction',
      ],
      bossFights: [
        '🎮 The Focus Lock — global hotkeys that work while a fullscreen game owns the keyboard',
        '⚡ The CPU Hog — cutting naive 70% CPU usage in half without sacrificing detection',
        '🎨 The Texture Pack Chaos — template matching across different visual themes',
      ],
      bonusLevel: '🥚 Secret Achievement: Shipped a "useless" project that is actually a comprehensive demonstration of real-time screen CV, global OS hooking, and performance optimization. Recruiters love this.',
    },
  },
  {
    id: 'clean-eye',
    title: 'CleanEye - Real-Time Garbage Detection System',
    description: 'Real-time waste detection system built for ADIPEC 2025 using YOLOv8 to identify and classify garbage in live video feeds. Features an interactive Streamlit dashboard with detection heatmaps, location mapping via Folium, and live analytics for environmental monitoring.',
    category: 'ai-cv',
    skills: ['Python', 'YOLOv8', 'Streamlit', 'OpenCV', 'Folium', 'Computer Vision', 'Environmental Tech'],
    image: '/assets/images/clean-eye/cover.svg',
    github: 'https://github.com/AlBaraa63/Clean-Eye',
    detailedDescription: 'CleanEye is a real-time garbage detection and monitoring system developed for ADIPEC 2025. It uses a fine-tuned YOLOv8 model to detect and classify waste in live video streams, webcam feeds, and uploaded images. The Streamlit-based dashboard provides live detection analytics, hotspot heatmaps powered by Folium, confidence score tracking, and exportable reports — enabling municipalities and organizations to monitor cleanliness in real time.',
    challenges: [
      'Achieving high detection accuracy across diverse waste types and real-world lighting conditions',
      'Rendering interactive geographic heatmaps in a Streamlit environment without performance degradation',
      'Designing a dashboard that balances real-time performance with rich analytics and visualization',
    ],
    solutions: [
      'Fine-tuned YOLOv8 on a curated waste detection dataset with augmentation for varied lighting and angles',
      'Integrated Folium for interactive map rendering with detection location overlays',
      'Structured Streamlit layout with cached inference pipeline for smooth real-time throughput',
    ],
    outcomes: [
      'Deployed real-time detection pipeline handling webcam and video stream inputs at smooth frame rates',
      'Interactive Folium heatmap visualizing waste hotspots geographically',
      'Analytics dashboard with per-class detection counts, confidence distributions, and exportable session logs',
      'Demonstrated at ADIPEC 2025 as part of an environmental monitoring showcase',
    ],
    techStack: {
      frontend: ['Streamlit', 'Folium (Interactive Maps)', 'Plotly Charts'],
      backend: ['Python', 'OpenCV', 'File I/O'],
      ai: ['YOLOv8 (Ultralytics)', 'Object Detection', 'Computer Vision'],
      other: ['GPS Coordinate Mapping', 'Session State Management', 'CSV Export'],
    },
    gameDetails: {
      questOverview: '🗑️ Environmental Vision Quest! Built a real-time garbage detection system for ADIPEC 2025 — fine-tuned YOLOv8 to spot waste in live feeds and turned raw detections into geographic heatmaps and actionable analytics.',
      skillsUnlocked: [
        '👁️ Real-Time Object Detection — YOLOv8 inference on live webcam and video streams',
        '🗺️ Geographic Visualization — Folium heatmaps showing waste hotspot locations',
        '📊 Analytics Dashboard — Per-class counts, confidence distributions, exportable reports',
        '⚡ Streamlit Performance — Cached inference pipeline for smooth real-time throughput',
      ],
      bossFights: [
        '🌗 The Lighting Phantom — Robust detection under diverse real-world illumination',
        '🗺️ The Map Render Beast — Interactive Folium maps inside a Streamlit app without slowdown',
        '⚡ The Real-Time Hydra — Balancing frame rate with analytics computation',
      ],
      bonusLevel: '🏆 ADIPEC 2025 Showcase: Demonstrated live waste detection to industry professionals as part of an environmental technology exhibition — bridging AI and sustainability.',
    },
  },
  {
    id: 'weather-recognition',
    title: 'Weather Recognition with Random Forest',
    description: 'Machine learning weather classifier using Random Forest algorithm to categorize weather conditions (cloudy, rainy, shine, sunrise) from images. Features comprehensive data preprocessing, model persistence with joblib, and detailed performance metrics visualization.',
    category: 'ai-cv',
    skills: ['Python', 'scikit-learn', 'Random Forest', 'Machine Learning', 'OpenCV', 'Data Visualization'],
    image: '/assets/images/weather-recognition/samples.png',
    github: 'https://github.com/AlBaraa63/Computer-Vision/tree/main/Weather_Recognition',
    detailedDescription: 'A comprehensive weather classification system using Random Forest machine learning algorithm to identify four weather conditions: cloudy, rainy, shine, and sunrise. Implements robust image preprocessing pipeline with resizing and flattening, organized train/validation data structure, and model persistence using joblib for deployment. Features detailed performance analysis with accuracy metrics and prediction capabilities.',
    challenges: [
      'Classifying weather conditions from diverse image datasets',
      'Handling multi-class classification with balanced accuracy',
      'Preprocessing images of varying sizes and qualities for consistent feature extraction',
      'Implementing model persistence for production deployment',
      'Creating organized data structure for training and validation'
    ],
    solutions: [
      'Utilized Random Forest classifier for robust multi-class weather prediction',
      'Implemented systematic image preprocessing: resizing to fixed dimensions and array flattening',
      'Organized dataset into train/val splits with separate folders for each weather class',
      'Applied joblib for efficient model serialization and loading',
      'Built comprehensive testing script for model validation and prediction'
    ],
    outcomes: [
      'Successfully classifies 4 weather conditions: cloudy, rainy, shine, and sunrise',
      'Organized data structure with training and validation splits',
      'Model persistence with joblib enabling easy deployment and reuse',
      'Comprehensive test script for model evaluation and predictions',
      'Production-ready weather classification system with detailed metrics'
    ],
    visuals: [
      {
        src: '/assets/images/weather-recognition/statstics.png',
        alt: 'Weather Recognition Model Performance Dashboard',
        caption: 'Comprehensive performance metrics including confusion matrix, accuracy by category (96.6% cloudy, 92.5% rainy, 89.4% shine, 100% sunrise), prediction confidence distribution, and dataset distribution across train/validation splits. Overall model accuracy: 95.4%'
      },
      {
        src: '/assets/images/weather-recognition/samples.png',
        alt: 'Weather Classification Sample Images',
        caption: 'Sample weather images from the dataset showing the four classification categories'
      },
      {
        src: '/assets/images/weather-recognition/sample-cloudy.jpg',
        alt: 'Cloudy Weather Sample',
        caption: 'Example of cloudy weather condition from the training dataset'
      }
    ],
    techStack: {
      frontend: ['Matplotlib Visualization', 'Performance Metrics Display'],
      backend: ['Python', 'Joblib Model Persistence', 'File I/O Management'],
      ai: ['scikit-learn Random Forest', 'OpenCV', 'NumPy', 'Image Classification'],
      other: ['Data Organization', 'Train/Val Split', 'Model Serialization']
    },
    gameDetails: {
      questOverview: "🌦️ Weather Prediction Quest Complete! Built an intelligent weather classification system using Random Forest to identify cloudy, rainy, sunny, and sunrise conditions from images with robust preprocessing and model deployment.",
      skillsUnlocked: [
        "🌲 Random Forest Mastery - Implemented ensemble learning for multi-class weather classification",
        "🖼️ Image Preprocessing Pipeline - Engineered systematic resizing and feature extraction workflow",
        "📊 Data Organization - Structured train/validation datasets for effective model training",
        "💾 Model Deployment - Mastered joblib for model persistence and production deployment",
        "🧪 Performance Analysis - Built comprehensive testing framework with detailed metrics"
      ],
      bossFights: [
        "🌈 The Multi-Class Challenge - Conquered 4-way weather classification with balanced accuracy",
        "🖼️ The Image Variance Dragon - Handled diverse weather images with consistent preprocessing",
        "⚖️ The Data Balance Beast - Organized training data for effective model learning",
        "💾 The Deployment Hydra - Implemented model persistence for production readiness"
      ],
      bonusLevel: "🏆 Production Excellence: Complete weather recognition system with organized data structure, model persistence, comprehensive testing, and ready-to-deploy architecture. Perfect for real-world applications like automated weather monitoring and photo organization!"
    }
  }
];

export const certifications: Certification[] = [
  {
    id: 'snams2025',
    title: 'SNAMS2025 Conference - Paper Presentation',
    issuer: 'IEEE - 12th International Conference',
    date: '2025',
    description: 'Presented research paper on "The Impact of Artificial Intelligence in Education on Student Learning Outcomes and Teaching Methods"',
    icon: '📜',
    imagePath: '/assets/certificates/snams2025-preview.jpg',
    pdfPath: '/assets/certificates/snams2025-preview.pdf',
    link: '#',
    featured: true
  },
  {
    id: 'cs50x',
    title: 'CS50x: Introduction to Computer Science',
    issuer: 'Harvard University',
    date: '2024',
    description: 'Comprehensive introduction to computer science and programming',
    icon: '🎓',
    imagePath: '/assets/certificates/cs50x-preview.jpg',
    pdfPath: '/assets/certificates/CS50x.pdf',
    link: 'https://drive.google.com/file/d/1Zt7eW_svaZ7Z-8kulvW4DFfonvnhtioF/view?usp=sharing',
    featured: true
  },
  {
    id: 'cs50p',
    title: 'CS50P: Introduction to Programming with Python',
    issuer: 'Harvard University',
    date: '2025',
    description: 'Advanced Python programming concepts and applications',
    icon: '🐍',
    imagePath: '/assets/certificates/cs50p-preview.jpg',
    pdfPath: '/assets/certificates/CS50P.pdf',
    link: 'https://drive.google.com/file/d/1xibJ02x-gbo93fApiQqpZKWukALjh-Oh/view?usp=sharing',
    featured: true
  },
  {
    id: 'cs50ai',
    title: 'CS50AI: Introduction to Artificial Intelligence with Python',
    issuer: 'Harvard University',
    date: 'In Progress',
    description: 'Artificial intelligence concepts using Python - graph search, optimization, machine learning, neural networks',
    icon: '🧠',
    featured: true,
    status: 'in-progress'
  },
  {
    id: 'samsung-innovation',
    title: 'Samsung Innovation Campus AI Course',
    issuer: 'Samsung',
    date: 'Dec 2025',
    description: 'Artificial Intelligence and Machine Learning fundamentals program',
    icon: '🏫',
    link: '#',
    featured: true,
    status: 'completed'
  },
  {
    id: 'intro-ai-2023',
    title: 'Introduction to Artificial Intelligence (2023)',
    issuer: 'LinkedIn Learning',
    date: '2023',
    description: 'Comprehensive introduction to AI concepts and applications',
    icon: '🎯',
    imagePath: '/assets/certificates/intro-ai-2023-preview.jpg',
    pdfPath: '/assets/certificates/CertificateOfCompletion_Introduction to Artificial Intelligence 2023 (1).pdf',
    link: '#'
  },
  {
    id: 'ai-thinking-machines',
    title: 'AI Foundations: Thinking Machines',
    issuer: 'LinkedIn Learning',
    date: '2023',
    description: 'Foundational concepts in artificial intelligence and machine learning',
    icon: '🧠',
    imagePath: '/assets/certificates/ai-thinking-machines-preview.jpg',
    pdfPath: '/assets/certificates/CertificateOfCompletion_Artificial Intelligence Foundations Thinking Machines.pdf',
    link: '#'
  },
  {
    id: 'generative-ai',
    title: 'What is Generative AI?',
    issuer: 'LinkedIn Learning',
    date: '2024',
    description: 'Understanding generative artificial intelligence technologies',
    icon: '⚡',
    imagePath: '/assets/certificates/generative-ai-preview.jpg',
    pdfPath: '/assets/certificates/CertificateOfCompletion_What Is Generative AI.pdf',
    link: '#'
  },
  {
    id: 'ai-machine-learning',
    title: 'AI Foundations: Machine Learning',
    issuer: 'LinkedIn Learning',
    date: '2023',
    description: 'Machine learning algorithms and practical applications',
    icon: '🔬',
    imagePath: '/assets/certificates/ai-machine-learning-preview.jpg',
    pdfPath: '/assets/certificates/CertificateOfCompletion_Artificial Intelligence Foundations Machine Learning.pdf',
    link: '#'
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering with ChatGPT!',
    issuer: 'LinkedIn Learning',
    date: '2024',
    description: 'Advanced techniques for effective AI prompt design and optimization',
    icon: '💡',
    imagePath: '/assets/certificates/prompt-engineering-preview.jpg',
    pdfPath: '/assets/certificates/CertificateOfCompletion_Prompt Engineering with ChatGPT.pdf',
    link: '#'
  },
  {
    id: 'git-github',
    title: 'Learning Git and GitHub',
    issuer: 'LinkedIn Learning',
    date: '2024',
    description: 'Version control and collaborative development with Git and GitHub',
    icon: '🔧',
    imagePath: '/assets/certificates/git-github-preview.jpg',
    pdfPath: '/assets/certificates/CertificateOfCompletion_Learning Git and GitHub.pdf',
    link: '#'
  },
  {
    id: 'say-no-guilt',
    title: 'How to Say No Without Guilt',
    issuer: 'LinkedIn Learning',
    date: '2024',
    description: 'Professional communication and boundary setting skills',
    icon: '💬',
    imagePath: '/assets/certificates/say-no-guilt-preview.jpg',
    pdfPath: '/assets/certificates/CertificateOfCompletion_How to Say No without Guilt.pdf',
    link: '#'
  },
  {
    id: 'creative-thinking',
    title: 'Solve Problems with Creative & Critical Thinking',
    issuer: 'edX',
    date: '2024',
    description: 'Problem-solving methodologies and critical thinking skills',
    icon: '🧠',
    imagePath: '/assets/certificates/creative-thinking-preview.jpg',
    pdfPath: '/assets/certificates/IBM SN0131EN Certificate _ edX.pdf',
    link: '#'
  },
  {
    id: 'sql-data-science',
    title: 'SQL for Data Science',
    issuer: 'Coursera',
    date: '2024',
    description: 'Database management and SQL query fundamentals',
    icon: '🗄️',
    imagePath: '/assets/certificates/sql-data-science-preview.jpg',
    pdfPath: '/assets/certificates/certificate_of_completion_sql.pdf',
    link: '#'
  },
  {
    id: 'amideast-soft-skills',
    title: 'Campus To Career: Power of Soft Skills',
    issuer: 'Amideast UAE',
    date: 'June 8, 2023',
    description: 'Certificate of attendance for professional soft skills development session',
    icon: '🎓',
    imagePath: '/assets/certificates/amideast-soft-skills-preview.jpg',
    pdfPath: '/assets/certificates/amideast-soft-skills-preview.jpg',
    link: '#'
  },
  {
    id: 'google-digital-garage',
    title: 'The Fundamentals of Digital Marketing',
    issuer: 'Google Digital Garage',
    date: 'March 8, 2021',
    description: 'Digital marketing fundamentals certification by Google and IAB Europe',
    icon: '📱',
    imagePath: '/assets/certificates/google-digital-garage-preview.jpg',
    pdfPath: '/assets/certificates/google-digital-garage.pdf',
    link: '#'
  }
];

export const experience: Experience[] = [
  {
    id: 'adssa-it-intern',
    title: 'IT Intern',
    company: 'Abu Dhabi Social Support Authority',
    type: 'work',
    period: 'Jul 2026 - Present',
    current: true,
    description: 'Supporting IT operations and digital services within the authority\'s technology division.',
    highlights: [
      'Supporting IT operations and digital infrastructure for a government social support entity',
    ],
    skills: ['IT Operations', 'Digital Services', 'Government Tech'],
  },
  {
    id: '42-abu-dhabi-piscine',
    title: 'Piscine – Intensive Coding Selection Program',
    company: '42 Abu Dhabi',
    type: 'program',
    period: 'Jun 2026 - Present',
    current: true,
    description: 'Intensive 4-week peer-to-peer coding immersion and selection process at 42 Abu Dhabi — one of the global 42 Network campuses.',
    highlights: [
      'Intensive daily coding challenges covering C programming, Unix, and algorithms entirely through peer-to-peer learning',
      'Selection process for the full 42 curriculum — a tuition-free, project-based software engineering program',
    ],
    skills: ['C', 'Unix', 'Algorithms', 'Peer Learning', 'Problem Solving'],
  },
  {
    id: 'aau-research-assistant',
    title: 'Research Assistant',
    company: 'Al Ain University (Under Dr. Nuha Hamada & Dr. Armagan Elibol)',
    type: 'work',
    period: 'Feb 2025 - Present',
    current: true,
    description: 'Dual research role spanning AI applications research and deep learning architecture design for medical image segmentation.',
    highlights: [
      'Leading a mixed-methods study on ChatGPT\'s impact on self-regulated learning across UAE high school and university students',
      'Developing a novel encoder–decoder segmentation architecture (F-UNet) — accepted as poster at SRC2026',
    ],
    skills: ['PyTorch', 'Medical Imaging', 'Research', 'Deep Learning', 'Academic Writing'],
  },
  {
    id: 'cellula-cv-intern',
    title: 'Computer Vision Research Intern',
    company: 'Cellula Technologies',
    type: 'work',
    period: 'Jan 2026 - Apr 2026',
    current: false,
    description: 'Built and deployed computer vision models for real-world applications including medical image classification, semantic segmentation, and real-time security systems.',
    highlights: [
      'Built a custom ResNet-inspired CNN from scratch for 7-class dental disease classification — 97.67% accuracy',
      'Fine-tuned a pretrained backbone for the same task and deployed an interactive Streamlit diagnostic interface',
      'Developed a semantic segmentation pipeline on satellite imagery to predict flood-affected regions',
      'Led a 5-member team building a real-time shoplifting detection system using VideoMAE, MoViNet, and TimeSformer',
    ],
    skills: ['PyTorch', 'OpenCV', 'YOLOv8', 'Deep Learning', 'Python', 'Streamlit', 'Team Leadership'],
  },
  {
    id: 'samsung-innovation',
    title: 'Selected Participant - AI & ML Program',
    company: 'Samsung Innovation Campus',
    type: 'program',
    period: 'Sep 2025 - Dec 2025',
    current: false,
    description: 'Intensive AI & ML training program with hands-on project development and real-world deployment.',
    highlights: [
      'Built a safety-critical hazard detection module for assistive navigation using Transfer Learning on MobileNetV2',
      'Engineered data pipeline: collected and processed 3,000+ images, achieving 85% classification accuracy',
    ],
    skills: ['Machine Learning', 'Deep Learning', 'MobileNetV2', 'Transfer Learning', 'Python'],
  },
  {
    id: 'ieee-snams-2025',
    title: 'Published Author & Conference Presenter',
    company: 'IEEE SNAMS 2025 — Vienna, Austria',
    type: 'program',
    period: '2025',
    current: false,
    description: 'Sole author and presenter at the 12th IEEE International Conference on Social Networks Analysis, Management and Security.',
    highlights: [
      'Paper: "The Impact of Artificial Intelligence in Education on Student Learning Outcomes and Teaching Methods"',
      'Proposed an adaptive learning framework addressing scalability gaps in existing AIED models',
    ],
    skills: ['Research', 'Academic Writing', 'AI in Education', 'Peer Review'],
  },
];

export const research: Research[] = [
  {
    id: 'snams2025-ai-edu',
    title: 'The Impact of Artificial Intelligence in Education on Student Learning Outcomes and Teaching Methods',
    abstract: 'Artificial Intelligence is transforming education by enabling adaptive learning experiences tailored to individual student needs. This conceptual research explores how AI-powered personalized learning systems can improve learning outcomes by granting students greater autonomy over their learning process. By accommodating diverse learning styles and paces, AI tools demonstrate strong potential to enhance engagement and knowledge retention. Rather than replacing teachers, AI serves as a supportive framework that facilitates student-centered education.',
    year: '2025',
    conference: 'IEEE SNAMS 2025 — Vienna, Austria',
    link: 'https://doi.org/10.1109/SNAMS67467.2025.11391039'
  },
  {
    id: 'src2026-funet',
    title: 'Novel Parameter-Efficient Encoder–Decoder Architecture for Multi-Modal Medical Image Segmentation',
    abstract: 'Designed an encoder–decoder with dense connections and attention gates, unifying 2D/3D pipelines across 5 medical imaging domains. The modular F-UNet framework yields 8 ablation configurations (A0–A7) from a single YAML-controlled codebase, cutting model size by 82% (5.39M parameters) while outperforming U-Net baselines across Chest X-Ray, BUSI, GlaS, and CVC-ClinicDB benchmarks.',
    year: '2026',
    conference: 'SRC2026 — 17th Student Research Conference on Applied Computing (Accepted, Poster)',
  },
];

// Resume Configuration - Update this one place to change resume across the entire site
export const resumeConfig = {
  fileId: '1mPqOImS4Rpy0ZHDU2J6-JyxCnyMZybmF',
  fileName: 'AlBaraa_Alolabi_Resume.pdf',
  // Computed URLs based on fileId
  get previewUrl() {
    return `https://drive.google.com/file/d/${this.fileId}/preview`;
  },
  get downloadUrl() {
    return `https://drive.google.com/uc?export=download&id=${this.fileId}`;
  },
  get viewUrl() {
    return `https://drive.google.com/file/d/${this.fileId}/view?usp=sharing`;
  }
};