import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import IDECodePreview from './IDECodePreview';
import MarkdownRenderer from './MarkdownRenderer';

// Vanta.js topology effect
declare global {
    interface Window {
        VANTA: any;
        p5: any;
    }
}

interface DevProjectProps {
    projectId: string;
}

interface ProjectData {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    technologies: string[];
    githubUrl: string;
    liveUrl?: string;
    images: string[];
    videoDemo?: string;
    codePreview: {
        fileName: string;
        language: string;
        code: string;
    }[];
    readme: string;
    features: string[];
    challenges: string[];
}

const DevProjectPage: React.FC<DevProjectProps> = ({ projectId }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'readme' | 'demo'>('overview');
    const [selectedImage, setSelectedImage] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [tabKey, setTabKey] = useState(0); // Force re-render for animations
    const vantaRef = useRef<HTMLDivElement>(null);
    const vantaEffect = useRef<any>(null);

    // Initialize Vanta.js topology background
    useEffect(() => {
        const loadVanta = async () => {
            try {
                // Load p5.js first
                if (!window.p5) {
                    const script1 = document.createElement('script');
                    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js';
                    script1.crossOrigin = 'anonymous';
                    document.head.appendChild(script1);

                    await new Promise((resolve, reject) => {
                        script1.onload = resolve;
                        script1.onerror = reject;
                        setTimeout(reject, 10000); // 10s timeout
                    });
                }

                // Load Vanta.js topology effect
                if (!window.VANTA) {
                    const script2 = document.createElement('script');
                    script2.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js';
                    script2.crossOrigin = 'anonymous';
                    document.head.appendChild(script2);

                    await new Promise((resolve, reject) => {
                        script2.onload = resolve;
                        script2.onerror = reject;
                        setTimeout(reject, 10000); // 10s timeout
                    });
                }

                // Wait a bit for scripts to fully initialize
                await new Promise(resolve => setTimeout(resolve, 100));

                // Initialize Vanta effect
                if (window.VANTA && window.VANTA.TOPOLOGY && vantaRef.current && !vantaEffect.current) {
                    vantaEffect.current = window.VANTA.TOPOLOGY({
                        el: vantaRef.current,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00
                    });
                }
            } catch (error) {
                console.warn('Failed to load Vanta.js:', error);
                // Fallback: Create a simple animated background
                if (vantaRef.current) {
                    vantaRef.current.style.background = `
            radial-gradient(circle at 20% 20%, rgba(105, 51, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 255, 136, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(105, 51, 255, 0.1) 0%, transparent 50%)
          `;
                }
            }
        };

        // Delay loading to ensure DOM is ready
        const timer = setTimeout(loadVanta, 100);

        return () => {
            clearTimeout(timer);
            if (vantaEffect.current) {
                try {
                    vantaEffect.current.destroy();
                } catch (e) {
                    console.warn('Error destroying Vanta effect:', e);
                }
                vantaEffect.current = null;
            }
        };
    }, []);

    // Enhanced tab switching with transition
    const handleTabSwitch = (newTab: 'overview' | 'code' | 'readme' | 'demo') => {
        if (newTab === activeTab) return;

        setIsTransitioning(true);

        // Smooth transition timing
        setTimeout(() => {
            setActiveTab(newTab);
            setTabKey(prev => prev + 1); // Force animation restart

            setTimeout(() => {
                setIsTransitioning(false);
            }, 100);
        }, 150);
    };

    // Handle scroll for sticky navigation
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const header = document.querySelector('[data-header="project-header"]') as HTMLElement;

            if (header && headerHeight === 0) {
                setHeaderHeight(header.offsetHeight);
            }

            // Calculate when navigation should become sticky
            const shouldBeSticky = scrollTop > headerHeight + 50; // Add some buffer
            setIsScrolled(shouldBeSticky);
        };

        // Throttle scroll events for better performance
        let ticking = false;
        const throttledHandleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledHandleScroll, { passive: true });
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', throttledHandleScroll);
    }, [headerHeight]);

    // Dummy project data - replace with real data based on projectId
    const projectData: ProjectData = {
        id: 'calantha-platform',
        title: 'Calantha Interactive Platform',
        description: 'Full-stack web application with real-time video processing and interactive media features.',
        longDescription: `Calantha is a comprehensive interactive media platform that combines real-time video processing with social features. Built using modern web technologies, it provides users with tools to create, edit, and share multimedia content seamlessly.

The platform features a microservices architecture with separate services for user management, media processing, real-time communication, and content delivery. The frontend is built with React and TypeScript, providing a responsive and intuitive user interface.

Key technical achievements include implementing WebRTC for real-time video communication, optimizing media processing pipelines, and creating a scalable backend infrastructure capable of handling thousands of concurrent users.`,
        technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'WebRTC', 'Socket.io', 'AWS S3', 'Docker', 'Kubernetes'],
        githubUrl: 'https://github.com/kaitran225/calantha-platform',
        liveUrl: 'https://calantha-demo.vercel.app',
        images: [
            '/assets/projects/calantha/screenshot-1.jpg',
            '/assets/projects/calantha/screenshot-2.jpg',
            '/assets/projects/calantha/screenshot-3.jpg',
            '/assets/projects/calantha/architecture.jpg'
        ],
        videoDemo: '/assets/projects/calantha/demo-video.mp4',
        codePreview: [
            {
                fileName: 'components/VideoPlayer.tsx',
                language: 'typescript',
                code: `import React, { useRef, useEffect, useState } from 'react';
import { WebRTCService } from '../services/webrtc';

interface VideoPlayerProps {
  streamId: string;
  isLocal?: boolean;
  onStreamEnd?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  streamId, 
  isLocal = false, 
  onStreamEnd 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStream = async () => {
      try {
        if (!videoRef.current) return;
        
        const stream = await WebRTCService.getStream(streamId, isLocal);
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsPlaying(true);
        };
        
        videoRef.current.onended = () => {
          setIsPlaying(false);
          onStreamEnd?.();
        };
        
      } catch (err) {
        setError('Failed to load video stream');
        console.error('Video stream error:', err);
      }
    };

    initializeStream();
  }, [streamId, isLocal, onStreamEnd]);

  return (
    <VideoContainer>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        onError={() => setError('Video playback error')}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Controls>
        <PlayButton onClick={() => videoRef.current?.play()}>
          {isPlaying ? '⏸️' : '▶️'}
        </PlayButton>
      </Controls>
    </VideoContainer>
  );
};`
            },
            {
                fileName: 'services/webrtc.ts',
                language: 'typescript',
                code: `export class WebRTCService {
  private static peerConnections: Map<string, RTCPeerConnection> = new Map();
  private static localStream: MediaStream | null = null;

  static async initializeMedia(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      this.localStream = stream;
      return stream;
    } catch (error) {
      throw new Error('Failed to access media devices');
    }
  }

  static async createPeerConnection(
    streamId: string,
    isInitiator: boolean = false
  ): Promise<RTCPeerConnection> {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:your-turn-server.com:3478',
          username: 'user',
          credential: 'pass'
        }
      ]
    };

    const pc = new RTCPeerConnection(configuration);
    
    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      this.handleRemoteStream(streamId, remoteStream);
    };

    this.peerConnections.set(streamId, pc);
    return pc;
  }
}`
            }
        ],
        readme: `# Calantha Interactive Platform

A modern full-stack web application for interactive media sharing and real-time communication.

## 🚀 Features

- **Real-time Video Communication**: WebRTC-based video calling and streaming
- **Media Processing**: Server-side video/audio processing and optimization
- **Social Features**: User profiles, following, content sharing
- **Responsive Design**: Mobile-first approach with PWA capabilities
- **Scalable Architecture**: Microservices with Docker and Kubernetes

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Styled Components for styling
- Socket.io for real-time communication
- WebRTC for video/audio streaming

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- Redis for session management
- AWS S3 for media storage

**DevOps:**
- Docker containerization
- Kubernetes orchestration
- CI/CD with GitHub Actions
- Monitoring with Prometheus

## 📦 Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/kaitran225/calantha-platform.git

# Install dependencies
cd calantha-platform
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
\`\`\`

## 🔧 Configuration

Create a \`.env\` file with the following variables:

\`\`\`env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/calantha
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=calantha-media
JWT_SECRET=your_jwt_secret
\`\`\`

## 🚀 Deployment

The application is deployed using Docker and Kubernetes:

\`\`\`bash
# Build Docker image
docker build -t calantha-platform .

# Deploy to Kubernetes
kubectl apply -f k8s/
\`\`\`

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **Bundle Size**: < 200KB gzipped
- **API Response Time**: < 100ms average
- **Video Processing**: Real-time at 30fps`,
        features: [
            'Real-time video streaming with WebRTC',
            'Scalable microservices architecture',
            'Advanced media processing pipeline',
            'Social networking features',
            'Progressive Web App (PWA)',
            'Mobile-responsive design',
            'Real-time notifications',
            'Content moderation system'
        ],
        challenges: [
            'Implementing low-latency video streaming across different network conditions',
            'Optimizing media processing for various file formats and sizes',
            'Designing scalable architecture to handle concurrent users',
            'Managing real-time state synchronization across multiple clients',
            'Ensuring cross-browser compatibility for WebRTC features'
        ]
    };

    return (
        <ProjectContainer ref={vantaRef}>
            {/* Header */}
            <ProjectHeader data-header="project-header">
                <BackButton onClick={() => window.history.back()}>
                    ← Back to Projects
                </BackButton>
                <HeaderContent>
                    <ProjectTitle>{projectData.title}</ProjectTitle>
                    <ProjectDescription>{projectData.description}</ProjectDescription>
                    <ProjectLinks>
                        <ProjectLink href={projectData.githubUrl} target="_blank">
                            📂 GitHub Repository
                        </ProjectLink>
                        {projectData.liveUrl && (
                            <ProjectLink href={projectData.liveUrl} target="_blank">
                                🌐 Live Demo
                            </ProjectLink>
                        )}
                    </ProjectLinks>
                    <TechStack>
                        {projectData.technologies.map(tech => (
                            <TechTag key={tech}>{tech}</TechTag>
                        ))}
                    </TechStack>
                </HeaderContent>
            </ProjectHeader>

            {/* Navigation Tabs */}
            <TabNavigation
                $isSticky={isScrolled}
                data-nav="tab-navigation"
            >
                <Tab
                    $active={activeTab === 'overview'}
                    onClick={() => handleTabSwitch('overview')}
                >
                    <span>📋</span> Overview
                </Tab>
                <Tab
                    $active={activeTab === 'code'}
                    onClick={() => handleTabSwitch('code')}
                >
                    <span>💻</span> Code Preview
                </Tab>
                <Tab
                    $active={activeTab === 'readme'}
                    onClick={() => handleTabSwitch('readme')}
                >
                    <span>📖</span> Documentation
                </Tab>
                <Tab
                    $active={activeTab === 'demo'}
                    onClick={() => handleTabSwitch('demo')}
                >
                    <span>🎥</span> Demo
                </Tab>
            </TabNavigation>

            {/* Content Sections */}
            <ContentBGContainer $hasSticky={isScrolled}>

                <ContentContainer $hasSticky={isScrolled}>
                    <ContentTransition $isTransitioning={isTransitioning}>
                        {activeTab === 'overview' && (
                            <OverviewSection key={`overview-${tabKey}`}>
                                <Section>
                                    <SectionTitle>Project Overview</SectionTitle>
                                    <LongDescription>{projectData.longDescription}</LongDescription>
                                </Section>

                                <ImageGallery>
                                    <MainImage>
                                        <img
                                            src={projectData.images[selectedImage]}
                                            alt={`${projectData.title} screenshot ${selectedImage + 1}`}
                                        />
                                    </MainImage>
                                    <ImageThumbnails>
                                        {projectData.images.map((image, index) => (
                                            <Thumbnail
                                                key={index}
                                                $active={index === selectedImage}
                                                onClick={() => setSelectedImage(index)}
                                            >
                                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                                            </Thumbnail>
                                        ))}
                                    </ImageThumbnails>
                                </ImageGallery>

                                <FeaturesGrid>
                                    <FeatureColumn>
                                        <SectionTitle>Key Features</SectionTitle>
                                        <FeatureList>
                                            {projectData.features.map((feature, index) => (
                                                <FeatureItem key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                                                    ✅ {feature}
                                                </FeatureItem>
                                            ))}
                                        </FeatureList>
                                    </FeatureColumn>
                                    <FeatureColumn>
                                        <SectionTitle>Technical Challenges</SectionTitle>
                                        <FeatureList>
                                            {projectData.challenges.map((challenge, index) => (
                                                <FeatureItem key={index} style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
                                                    🔧 {challenge}
                                                </FeatureItem>
                                            ))}
                                        </FeatureList>
                                    </FeatureColumn>
                                </FeaturesGrid>
                            </OverviewSection>
                        )}

                        {activeTab === 'code' && (
                            <CodeSection key={`code-${tabKey}`}>
                                <SectionTitle>Code Preview</SectionTitle>
                                <IDECodePreview files={projectData.codePreview} theme="dark" />
                            </CodeSection>
                        )}

                        {activeTab === 'readme' && (
                            <ReadmeSection key={`readme-${tabKey}`}>
                                <SectionTitle>Project Documentation</SectionTitle>
                                <MarkdownRenderer content={projectData.readme || ''} theme="github-dark" />
                            </ReadmeSection>
                        )}

                        {activeTab === 'demo' && (
                            <DemoSection key={`demo-${tabKey}`}>
                                <SectionTitle>Project Demo</SectionTitle>
                                {projectData.videoDemo && (
                                    <VideoDemo>
                                        <video controls width="100%">
                                            <source src={projectData.videoDemo} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </VideoDemo>
                                )}
                                <DemoLinks>
                                    <ProjectLink href={projectData.githubUrl} target="_blank">
                                        📂 View Source Code
                                    </ProjectLink>
                                    {projectData.liveUrl && (
                                        <ProjectLink href={projectData.liveUrl} target="_blank">
                                            🌐 Try Live Demo
                                        </ProjectLink>
                                    )}
                                </DemoLinks>
                            </DemoSection>
                        )}
                    </ContentTransition>
                </ContentContainer>
            </ContentBGContainer>
        </ProjectContainer>
    );
};

// Styled Components
interface TabNavigationProps {
    $isSticky: boolean;
}

interface ContentContainerProps {
    $hasSticky: boolean;
}

interface ContentTransitionProps {
    $isTransitioning: boolean;
}

const ProjectContainer = styled.div`
  min-height: 100vh;
  background: var(--color-black-primary);
  color: var(--color-text-primary);
  position: relative;
  
  /* Ensure Vanta.js background is behind content */
  & > canvas {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    z-index: -10 !important; /* Further behind */
    pointer-events: none !important; /* Prevent interaction blocking */
  }
`;

const ProjectHeader = styled.header`
  padding: 40px 20px;
  background: linear-gradient(135deg, var(--color-black-primary) 0%, var(--color-black-secondary) 50%, var(--color-purple-primary) 100%);
  position: relative;
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: 5; /* Lower than links but above background */
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, rgba(105, 51, 255, 0.25) 0%, transparent 50%),
                radial-gradient(circle at 70% 30%, rgba(0, 255, 136, 0.20) 0%, transparent 40%);
    opacity: 0.15;
    z-index: 1;
  }
`;

const BackButton = styled.button`
  background: var(--color-black-secondary);
  color: var(--color-text-primary);
  border: 2px solid var(--color-purple-primary);
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: 600;
  position: relative;
  z-index: 15; /* Above background overlays */
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: var(--color-purple-primary);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 20px rgba(105, 51, 255, 0.30);
    border-color: var(--color-green-primary);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(-1px) scale(0.98);
    transition: all 0.1s ease;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10; /* Above background overlays */
`;

const ProjectTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(45deg, var(--color-purple-primary), var(--color-green-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;
  animation: titleReveal 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-purple-primary), var(--color-green-primary));
    animation: underlineGrow 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards;
    border-radius: 2px;
  }
  
  @keyframes titleReveal {
    from {
      opacity: 0;
      transform: translateY(30px);
      background-position: 200% center;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      background-position: 0% center;
    }
  }
  
  @keyframes underlineGrow {
    from {
      width: 0;
    }
    to {
      width: 120px;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    
    &::after {
      @keyframes underlineGrow {
        to {
          width: 80px;
        }
      }
    }
  }
`;

const ProjectDescription = styled.p`
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: 30px;
  line-height: 1.6;
  max-width: 800px;
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  position: relative;
  z-index: 15; /* Above other elements */
  
  & > * {
    animation: slideInScale 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    animation-fill-mode: both;
  }
  
  & > *:nth-child(1) { animation-delay: 0.5s; }
  & > *:nth-child(2) { animation-delay: 0.6s; }
  
  @keyframes slideInScale {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ProjectLink = styled.a`
  background: var(--color-black-secondary);
  color: var(--color-text-primary);
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid var(--color-purple-primary);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: 600;
  position: relative;
  overflow: hidden;
  display: inline-block;
  z-index: 10; /* Ensure link is above other elements */
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 25px rgba(105, 51, 255, 0.40);
    border-color: var(--color-green-primary);
    background: var(--color-purple-primary);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
    transition: all 0.1s ease;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  
  /* Stagger animation for tech tags */
  & > * {
    animation: slideInScale 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    animation-fill-mode: both;
  }
  
  & > *:nth-child(1) { animation-delay: 0.1s; }
  & > *:nth-child(2) { animation-delay: 0.15s; }
  & > *:nth-child(3) { animation-delay: 0.2s; }
  & > *:nth-child(4) { animation-delay: 0.25s; }
  & > *:nth-child(5) { animation-delay: 0.3s; }
  & > *:nth-child(6) { animation-delay: 0.35s; }
  & > *:nth-child(n+7) { animation-delay: 0.4s; }
  
  @keyframes slideInScale {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const TechTag = styled.span`
  background: var(--color-purple-secondary);
  color: var(--color-text-primary);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--color-purple-primary);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  z-index: 5; /* Ensure it's clickable if needed */
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(0, 255, 136, 0.30) 0%, transparent 70%);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }
  
  &:hover {
    background: var(--color-purple-primary);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 5px 15px rgba(105, 51, 255, 0.40);
    border-color: var(--color-green-primary);
  }
  
  &:hover::before {
    width: 200px;
    height: 200px;
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
    transition: all 0.1s ease;
  }
`;

const TabNavigation = styled.nav<TabNavigationProps>`
  background: rgba(0, 0, 0, 0.2);
  padding: 0 20px;
  display: flex;
  justify-content: center;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  
  ${props => props.$isSticky && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(105, 51, 255, 0.3);
    padding: 0 20px;
    height: 60px;
    
    /* Smooth slide-in animation */
    animation: slideInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    @keyframes slideInFromTop {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    /* Elegant glow effect */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent, 
        var(--color-purple-primary), 
        var(--color-green-primary), 
        var(--color-purple-primary), 
        transparent
      );
      animation: sliverGlow 2s ease-in-out infinite alternate;
    }
    
    @keyframes sliverGlow {
      from {
        opacity: 0.5;
      }
      to {
        opacity: 1;
      }
    }
  `}
  
  @media (max-width: 768px) {
    padding: 0 10px;
    gap: 0;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'var(--color-purple-primary)' : 'transparent'};
  color: var(--color-text-primary);
  border: none;
  padding: 15px 30px;
  cursor: pointer;
  font-weight: 600;
  border-bottom: 3px solid ${props => props.$active ? 'var(--color-green-primary)' : 'transparent'};
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.1), 
      transparent
    );
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  /* Enhanced click animation */
  &:active {
    transform: translateY(1px) scale(0.98);
    transition: all 0.1s ease;
    
    &::before {
      left: 100%;
      transition: all 0.2s ease;
    }
  }
  
  &:hover {
    background: ${props => props.$active ? 'var(--color-purple-primary)' : 'var(--color-purple-secondary)'};
    border-bottom-color: ${props => props.$active ? 'var(--color-green-primary)' : 'var(--color-green-secondary)'};
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 25px rgba(105, 51, 255, 0.3);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  /* Responsive adjustments for sticky state */
  ${TabNavigation}[data-nav="tab-navigation"] & {
    ${props => props.$active && `
      border-bottom-color: var(--color-green-primary);
    `}
  }
  
  @media (max-width: 768px) {
    padding: 12px 15px;
    font-size: 0.85rem;
    border-bottom-width: 2px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.8rem;
    
    /* Hide emoji on very small screens */
    span:first-child {
      display: none;
    }
  }
`;
const ContentBGContainer = styled.div<ContentContainerProps>`
  margin: 0 auto;
  padding: 60px 20px;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
  transition: padding-top 0.3s ease;
  position: relative;
  z-index: 1; /* Above Vanta background but below content */

  ${props => props.$hasSticky && `
    padding-top: 80px; /* Add space for sticky nav */
  `}
  
  @media (max-width: 768px) {
    padding: 40px 15px;
    
    ${props => props.$hasSticky && `
      padding-top: 80px;
    `}
  }
`;

const ContentContainer = styled.div<ContentContainerProps>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  min-height: calc(100vh - 200px);
  transition: padding-top 0.3s ease;
  
  ${props => props.$hasSticky && `
    padding-top: 80px; /* Add space for sticky nav */
  `}
  
  @media (max-width: 768px) {
    padding: 40px 15px;
    
    ${props => props.$hasSticky && `
      padding-top: 80px;
    `}
  }
`;

const ContentTransition = styled.div<ContentTransitionProps>`
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  ${props => props.$isTransitioning && `
    opacity: 0.7;
    transform: translateY(10px);
    filter: blur(2px);
  `}
  
  /* Particle effect overlay during transitions */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 25% 25%, var(--color-purple-primary)10, transparent 50%),
                radial-gradient(circle at 75% 75%, var(--color-green-primary)10, transparent 50%),
                radial-gradient(circle at 50% 50%, var(--color-purple-primary)05, transparent 60%);
    opacity: ${props => props.$isTransitioning ? 0.3 : 0};
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1;
  }
`;

const OverviewSection = styled.div`
  animation: catalogAppear 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes catalogAppear {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Section = styled.section`
  margin-bottom: 60px;
  animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-purple-primary), var(--color-green-primary));
    transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border-radius: 2px;
  }
  
  &:hover::after {
    width: 60px;
  }
  
  animation: fadeInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const LongDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-line;
`;

const ImageGallery = styled.div`
  margin-bottom: 60px;
  animation: fadeInScale 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const MainImage = styled.div`
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const ImageThumbnails = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, var(--color-purple-primary), var(--color-green-primary));
    border-radius: 3px;
    transition: background 0.3s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, var(--color-green-primary), var(--color-purple-primary));
  }
`;

const Thumbnail = styled.div<{ $active: boolean }>`
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  border: 3px solid ${props => props.$active ? 'var(--color-green-primary)' : 'transparent'};
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-purple-primary)30, var(--color-green-primary)30);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  img {
    width: 80px;
    height: 60px;
    object-fit: cover;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  &:hover {
    border-color: ${props => props.$active ? 'var(--color-green-primary)' : 'var(--color-purple-primary)'};
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:hover::before {
    opacity: 0.2;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
  
  &:active {
    transform: translateY(0) scale(1);
    transition: all 0.1s ease;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const FeatureColumn = styled.div`
  animation: slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:nth-child(2) {
    animation-delay: 0.2s;
    animation-fill-mode: both;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
  font-size: 1rem;
  line-height: 1.5;
  padding: 8px 0;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  cursor: pointer;
  opacity: 0;
  transform: translateX(-20px);
  animation: featureItemAppear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  
  @keyframes featureItemAppear {
    from {
      opacity: 0;
      transform: translateX(-20px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    width: 4px;
    height: 0;
    background: var(--color-green-primary);
    transition: height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: translateY(-50%);
    border-radius: 2px;
  }
  
  &:hover {
    color: rgba(255, 255, 255, 1);
    transform: translateX(8px) scale(1.02);
    padding-left: 15px;
  }
  
  &:hover::before {
    height: 100%;
    box-shadow: 0 0 10px var(--color-green-primary);
  }
`;

const CodeSection = styled.div`
  animation: catalogSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes catalogSlideIn {
    from {
      opacity: 0;
      transform: translateX(60px) rotateY(10deg);
    }
    to {
      opacity: 1;
      transform: translateX(0) rotateY(0deg);
    }
  }
`;

const ReadmeSection = styled.div`
  animation: catalogFlipIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes catalogFlipIn {
    from {
      opacity: 0;
      transform: rotateX(20deg) translateY(30px);
    }
    to {
      opacity: 1;
      transform: rotateX(0deg) translateY(0);
    }
  }
`;

const DemoSection = styled.div`
  animation: catalogZoomReveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  @keyframes catalogZoomReveal {
    from {
      opacity: 0;
      transform: scale(0.8) rotateZ(5deg);
      filter: blur(5px);
    }
    to {
      opacity: 1;
      transform: scale(1) rotateZ(0deg);
      filter: blur(0px);
    }
  }
`;

const VideoDemo = styled.div`
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  video {
    border-radius: 8px;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  &:hover video {
    transform: scale(1.02);
  }
`;

const DemoLinks = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

export default DevProjectPage;
