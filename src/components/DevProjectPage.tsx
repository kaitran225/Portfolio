import React, { useState } from 'react';
import styled from 'styled-components';

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
    <ProjectContainer>
      {/* Header */}
      <ProjectHeader>
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
      <TabNavigation>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </Tab>
        <Tab 
          active={activeTab === 'code'} 
          onClick={() => setActiveTab('code')}
        >
          💻 Code Preview
        </Tab>
        <Tab 
          active={activeTab === 'readme'} 
          onClick={() => setActiveTab('readme')}
        >
          📖 Documentation
        </Tab>
        <Tab 
          active={activeTab === 'demo'} 
          onClick={() => setActiveTab('demo')}
        >
          🎥 Demo
        </Tab>
      </TabNavigation>

      {/* Content Sections */}
      <ContentContainer>
        {activeTab === 'overview' && (
          <OverviewSection>
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
                    active={index === selectedImage}
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
                    <FeatureItem key={index}>✅ {feature}</FeatureItem>
                  ))}
                </FeatureList>
              </FeatureColumn>
              <FeatureColumn>
                <SectionTitle>Technical Challenges</SectionTitle>
                <FeatureList>
                  {projectData.challenges.map((challenge, index) => (
                    <FeatureItem key={index}>🔧 {challenge}</FeatureItem>
                  ))}
                </FeatureList>
              </FeatureColumn>
            </FeaturesGrid>
          </OverviewSection>
        )}

        {activeTab === 'code' && (
          <CodeSection>
            <SectionTitle>Code Samples</SectionTitle>
            {projectData.codePreview.map((sample, index) => (
              <CodeBlock key={index}>
                <CodeHeader>
                  <FileName>{sample.fileName}</FileName>
                  <Language>{sample.language}</Language>
                </CodeHeader>
                <CodeContent>
                  <pre><code>{sample.code}</code></pre>
                </CodeContent>
              </CodeBlock>
            ))}
          </CodeSection>
        )}

        {activeTab === 'readme' && (
          <ReadmeSection>
            <SectionTitle>Project Documentation</SectionTitle>
            <ReadmeContent>
              <pre>{projectData.readme}</pre>
            </ReadmeContent>
          </ReadmeSection>
        )}

        {activeTab === 'demo' && (
          <DemoSection>
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
      </ContentContainer>
    </ProjectContainer>
  );
};

// Styled Components
const ProjectContainer = styled.div`
  min-height: 100vh;
  background: var(--color-black-primary);
  color: var(--color-text-primary);
`;

const ProjectHeader = styled.header`
  padding: 40px 20px;
  background: linear-gradient(135deg, var(--color-black-primary) 0%, var(--color-black-secondary) 50%, var(--color-purple-primary) 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, var(--color-purple-primary)25, transparent 50%),
                radial-gradient(circle at 70% 30%, var(--color-green-primary)20, transparent 40%);
    opacity: 0.15;
    z-index: 1;
  }
`;

const BackButton = styled.button`
  background: var(--color-black-secondary);
  color: var(--color-text-primary);
  border: 2px solid var(--color-purple-primary);
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
  z-index: 2;
  
  &:hover {
    background: var(--color-purple-primary);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px var(--color-purple-primary)30;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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
  
  @media (max-width: 768px) {
    font-size: 2rem;
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
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const ProjectLink = styled.a`
  background: var(--color-black-secondary);
  color: var(--color-text-primary);
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 25px;
  border: 2px solid var(--color-purple-primary);
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    background: var(--color-purple-primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 15px var(--color-purple-primary)40;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const TechTag = styled.span`
  background: var(--color-purple-secondary);
  color: var(--color-text-primary);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid var(--color-purple-primary);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-purple-primary);
    transform: translateY(-1px);
  }
`;

const TabNavigation = styled.nav`
  background: rgba(0, 0, 0, 0.2);
  padding: 0 20px;
  display: flex;
  justify-content: center;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'var(--color-purple-primary)' : 'transparent'};
  color: var(--color-text-primary);
  border: none;
  padding: 15px 30px;
  cursor: pointer;
  font-weight: 600;
  border-bottom: 3px solid ${props => props.active ? 'var(--color-green-primary)' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--color-purple-primary)' : 'var(--color-purple-secondary)'};
    border-bottom-color: ${props => props.active ? 'var(--color-green-primary)' : 'var(--color-green-secondary)'};
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const OverviewSection = styled.div``;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: white;
`;

const LongDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-line;
`;

const ImageGallery = styled.div`
  margin-bottom: 60px;
`;

const MainImage = styled.div`
  margin-bottom: 20px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
`;

const ImageThumbnails = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
`;

const Thumbnail = styled.div<{ active: boolean }>`
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid ${props => props.active ? 'white' : 'transparent'};
  transition: all 0.3s ease;
  
  img {
    width: 80px;
    height: 60px;
    object-fit: cover;
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
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

const FeatureColumn = styled.div``;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
  font-size: 1rem;
  line-height: 1.5;
`;

const CodeSection = styled.div``;

const CodeBlock = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  margin-bottom: 30px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CodeHeader = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const FileName = styled.span`
  font-weight: 600;
  color: white;
`;

const Language = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: white;
`;

const CodeContent = styled.div`
  padding: 20px;
  overflow-x: auto;
  
  pre {
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const ReadmeSection = styled.div``;

const ReadmeContent = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  pre {
    white-space: pre-wrap;
    color: rgba(255, 255, 255, 0.9);
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
  }
`;

const DemoSection = styled.div``;

const VideoDemo = styled.div`
  margin-bottom: 40px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  video {
    border-radius: 15px;
  }
`;

const DemoLinks = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

export default DevProjectPage;
