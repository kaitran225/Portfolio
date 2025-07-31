import { PortfolioData, Project, PersonalInfo, Skills, SimpleProjectCategory } from '../types/portfolioTypes';
import portfolioDataJson from '../data/portfolioData.json';

class PortfolioDataService {
  private data: PortfolioData;

  constructor() {
    this.data = portfolioDataJson as PortfolioData;
  }

  // Personal Information
  getPersonalInfo(): PersonalInfo {
    return this.data.personalInfo;
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
