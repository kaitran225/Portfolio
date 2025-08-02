import { PortfolioData, Project, PersonalInfo, Skills, SimpleProjectCategory } from '../../types/portfolioTypes';
import portfolioDataJson from '../../../data/portfolioData.json';

// Enhanced project interface for new features
export interface EnhancedProject extends Project {
  longDescription?: string;
  demoUrl?: string;
  status?: 'Live' | 'In Development' | 'Completed';
  metrics?: {
    stars?: number;
    commits?: number;
    contributors?: number;
  };
  highlights?: string[];
  imageUrl?: string;
}

class PortfolioDataService {
  private data: PortfolioData;

  constructor() {
    this.data = portfolioDataJson as PortfolioData;
  }

  // Personal Information
  getPersonalInfo(): PersonalInfo {
    return this.data.personalInfo;
  }

  // Hero Section Data
  getHeroSectionData() {
    return this.data.heroSection;
  }

  // Contact Section Data
  getContactSectionData() {
    return this.data.contactSection;
  }

  // Skills
  getSkills(): Skills {
    return this.data.skills;
  }

  getTechnicalSkills() {
    return this.data.skills.technical;
  }

  getDesignSkills() {
    return this.data.skills.design;
  }

  getDetailedSkills() {
    return this.data.skills.detailed;
  }

  getCalendarData() {
    return this.data.calendar;
  }

  getAvailableSlots() {
    return this.data.calendar.availableSlots;
  }

  getScheduleOptions() {
    return this.data.calendar.scheduleOptions;
  }

  getCalendlyUrl() {
    return this.data.calendar.calendlyUrl;
  }

  // Projects
  getAllProjects(): Project[] {
    return [...this.data.projects.development, ...this.data.projects.design];
  }

  getDevelopmentProjects(): Project[] {
    return this.data.projects.development;
  }

  getDesignProjects(): Project[] {
    return this.data.projects.design;
  }

  getFeaturedProjects(): Project[] {
    return this.getAllProjects().filter(project => project.featured);
  }

  // Enhanced Projects with live demos and detailed information
  getEnhancedProjects(): EnhancedProject[] {
    return [
      {
        id: 'calantha-platform',
        title: 'Calantha Interactive Media Platform',
        description: 'Modern React 19 application with interactive media features and real-time capabilities.',
        longDescription: 'A comprehensive media platform built with React 19, featuring advanced WebRTC integration, real-time video processing, and interactive 3D elements. The application demonstrates modern web development practices with TypeScript, styled-components, and performance optimization.',
        category: 'development',
        technologies: ['React 19', 'TypeScript', 'WebRTC', 'Three.js', 'Styled Components', 'Vanta.js'],
        imageUrl: '/assets/projects/calantha-preview.svg',
        thumbnail: '/assets/projects/calantha-preview.svg',
        tags: ['React', 'TypeScript', 'WebRTC', 'Interactive'],
        demoUrl: 'https://kaitran225.github.io/calantha/',
        githubUrl: 'https://github.com/kaitran225/calantha',
        status: 'Live',
        featured: true,
        metrics: {
          stars: 12,
          commits: 45,
          contributors: 1
        },
        highlights: [
          'React 19 with latest features and performance optimizations',
          'WebRTC integration for real-time video processing',
          'Interactive 3D elements using Three.js and Vanta.js',
          'Responsive design with mobile-first approach',
          'TypeScript for type safety and better development experience'
        ]
      },
      {
        id: 'mental-health-backend',
        title: 'Mental Health Care API',
        description: 'Enterprise-grade Spring Boot backend with JWT authentication and production deployment.',
        longDescription: 'A comprehensive backend system for mental health care management, featuring secure authentication, role-based access control, and RESTful API design. Currently serving real users in production with 99.9% uptime.',
        category: 'development',
        technologies: ['Spring Boot', 'Java', 'MySQL', 'JWT', 'OpenAPI', 'Docker', 'Render.com'],
        imageUrl: '/assets/projects/backend-api-preview.svg',
        thumbnail: '/assets/projects/backend-api-preview.svg',
        tags: ['Backend', 'API', 'Java', 'Production'],
        demoUrl: 'https://api.cybriadev.com/swagger-ui/index.html',
        githubUrl: 'https://github.com/kaitran225/BackEnd',
        status: 'Live',
        featured: true,
        metrics: {
          stars: 8,
          commits: 667,
          contributors: 3
        },
        highlights: [
          'Production deployment with real users',
          'JWT-based authentication and role management',
          'Comprehensive API documentation with Swagger',
          'Cloud-hosted MySQL database with proper migrations',
          'Docker containerization for consistent deployment'
        ]
      },
      {
        id: 'cybria-ai-assistant',
        title: 'Cybria AI Assistant',
        description: 'Advanced AI integration with Ollama models, 3D avatar system, and multiple personas.',
        longDescription: 'An innovative AI assistant featuring local Ollama model integration, 3D character visualization, and advanced conversation management. The system includes multiple operational personas and real-time emotional expression rendering.',
        category: 'development',
        technologies: ['FastAPI', 'Python', 'Ollama', 'React Three Fiber', 'WebSocket', 'Docker'],
        imageUrl: '/assets/projects/cybria-ai-preview.svg',
        thumbnail: '/assets/projects/cybria-ai-preview.svg',
        tags: ['AI', 'Python', '3D', 'Innovation'],
        githubUrl: 'https://github.com/kaitran225/project_cybria',
        status: 'In Development',
        featured: true,
        metrics: {
          stars: 15,
          commits: 11,
          contributors: 1
        },
        highlights: [
          'Local AI model integration with Ollama',
          '3D avatar system with emotional expressions',
          'Multiple AI personas for different use cases',
          'WebSocket communication for real-time interaction',
          'Docker deployment for easy setup and scaling'
        ]
      },
      {
        id: 'notification-microservice',
        title: 'Ultra-Optimized Notification Service',
        description: 'Production microservice optimized for 2MB RAM usage with JWT security.',
        longDescription: 'A highly optimized microservice designed for minimal resource consumption while maintaining enterprise-grade security and functionality. Features role-based notification filtering and efficient database operations.',
        category: 'development',
        technologies: ['Node.js', 'Express', 'MySQL', 'JWT', 'Docker'],
        imageUrl: '/assets/projects/notification-service-preview.svg',
        thumbnail: '/assets/projects/notification-service-preview.svg',
        tags: ['Microservice', 'Node.js', 'Optimization', 'Production'],
        githubUrl: 'https://github.com/kaitran225/NotiService',
        status: 'Completed',
        featured: false,
        metrics: {
          stars: 5,
          commits: 13,
          contributors: 1
        },
        highlights: [
          'Ultra-optimized for 2MB RAM usage',
          'JWT security with role-based access control',
          'Efficient database connection pooling',
          'Docker containerization ready',
          'Production-ready with health monitoring'
        ]
      }
    ];
  }

  getFeaturedDevelopmentProjects(): Project[] {
    return this.data.projects.development.filter(project => project.featured);
  }

  getFeaturedDesignProjects(): Project[] {
    return this.data.projects.design.filter(project => project.featured);
  }

  getProjectById(id: string): Project | undefined {
    return this.getAllProjects().find(project => project.id === id);
  }

  getProjectsByCategory(category: 'development' | 'design'): Project[] {
    return this.data.projects[category];
  }

  // Filter projects by tags
  getProjectsByTag(tag: string): Project[] {
    return this.getAllProjects().filter(project => 
      project.tags.some(projectTag => 
        projectTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  }

  // Simple Portfolio Data
  getSimplePortfolioCategories(): SimpleProjectCategory[] {
    return this.data.simplePortfolio.projectCategories;
  }

  // Code Preview
  getCodePreviewForProject(projectId: string) {
    return this.data.codePreview[projectId] || [];
  }

  // Utility methods
  getProjectThumbnails(): { id: string; thumbnail: string; title: string }[] {
    return this.getAllProjects().map(project => ({
      id: project.id,
      thumbnail: project.thumbnail,
      title: project.title
    }));
  }

  searchProjects(query: string): Project[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllProjects().filter(project => 
      project.title.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Filter design projects by sub-category
  filterDesignProjects(category: 'all' | 'branding' | 'ui-ux' | 'print'): Project[] {
    const designProjects = this.getDesignProjects();
    
    if (category === 'all') return designProjects;
    
    return designProjects.filter(project => {
      switch (category) {
        case 'branding':
          return project.tags.some(tag => 
            tag.includes('Brand') || tag.includes('Logo') || tag.includes('Identity')
          );
        case 'ui-ux':
          return project.tags.some(tag => 
            tag.includes('UI') || tag.includes('UX') || tag.includes('Mobile')
          );
        case 'print':
          return project.tags.some(tag => 
            tag.includes('Print') || tag.includes('Package') || tag.includes('Packaging')
          );
        default:
          return true;
      }
    });
  }

  // Get project statistics
  getProjectStats() {
    const allProjects = this.getAllProjects();
    const devProjects = this.getDevelopmentProjects();
    const designProjects = this.getDesignProjects();
    
    return {
      total: allProjects.length,
      development: devProjects.length,
      design: designProjects.length,
      featured: this.getFeaturedProjects().length,
      technologies: this.getUniqueTechnologies(),
      tags: this.getUniqueTags()
    };
  }

  private getUniqueTechnologies(): string[] {
    const technologies = new Set<string>();
    
    this.getDevelopmentProjects().forEach(project => {
      if (project.technologies) {
        project.technologies.forEach(tech => technologies.add(tech));
      }
    });
    
    return Array.from(technologies);
  }

  private getUniqueTags(): string[] {
    const tags = new Set<string>();
    
    this.getAllProjects().forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    
    return Array.from(tags);
  }
}

// Export singleton instance
export const portfolioDataService = new PortfolioDataService();
export default portfolioDataService;
