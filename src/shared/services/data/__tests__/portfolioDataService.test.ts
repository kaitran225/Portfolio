import portfolioDataService from '../portfolioDataService';

describe('portfolioDataService', () => {
  describe('getPersonalInfo', () => {
    it('returns personal information object', () => {
      const personalInfo = portfolioDataService.getPersonalInfo();
      
      expect(personalInfo).toHaveProperty('name');
      expect(personalInfo).toHaveProperty('title');
      expect(personalInfo).toHaveProperty('subtitle');
      expect(personalInfo).toHaveProperty('description');
      expect(personalInfo).toHaveProperty('contact');
      
      expect(typeof personalInfo.name).toBe('string');
      expect(typeof personalInfo.title).toBe('string');
      expect(typeof personalInfo.subtitle).toBe('string');
      expect(personalInfo.contact).toHaveProperty('email');
      expect(personalInfo.contact).toHaveProperty('github');
      expect(personalInfo.contact).toHaveProperty('instagram');
    });

    it('contains valid contact information', () => {
      const personalInfo = portfolioDataService.getPersonalInfo();
      
      expect(personalInfo.name.length).toBeGreaterThan(0);
      expect(personalInfo.title.length).toBeGreaterThan(0);
      expect(personalInfo.subtitle.length).toBeGreaterThan(0);
      expect(personalInfo.contact.email.length).toBeGreaterThan(0);
    });
  });

  describe('getAllProjects', () => {
    it('returns an array of projects', () => {
      const projects = portfolioDataService.getAllProjects();
      
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it('each project has required properties', () => {
      const projects = portfolioDataService.getAllProjects();
      
      projects.forEach(project => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('title');
        expect(project).toHaveProperty('description');
        expect(project).toHaveProperty('category');
        
        expect(typeof project.id).toBe('string');
        expect(typeof project.title).toBe('string');
        expect(typeof project.description).toBe('string');
        expect(['development', 'design'].includes(project.category)).toBe(true);
      });
    });

    it('projects have unique IDs', () => {
      const projects = portfolioDataService.getAllProjects();
      const ids = projects.map(project => project.id);
      const uniqueIds = [...new Set(ids)];
      
      expect(ids.length).toBe(uniqueIds.length);
    });
  });

  describe('getProjectById', () => {
    it('returns a project when valid ID is provided', () => {
      const projects = portfolioDataService.getAllProjects();
      const firstProject = projects[0];
      
      const foundProject = portfolioDataService.getProjectById(firstProject.id);
      
      expect(foundProject).toEqual(firstProject);
    });

    it('returns undefined when invalid ID is provided', () => {
      const foundProject = portfolioDataService.getProjectById('invalid-id');
      
      expect(foundProject).toBeUndefined();
    });
  });

  describe('getSkills', () => {
    it('returns skills object with technical and design categories', () => {
      const skills = portfolioDataService.getSkills();
      
      expect(skills).toHaveProperty('technical');
      expect(skills).toHaveProperty('design');
      expect(skills).toHaveProperty('detailed');
      expect(typeof skills.technical).toBe('object');
      expect(typeof skills.design).toBe('object');
      expect(Array.isArray(skills.detailed)).toBe(true);
    });

    it('technical skills have required properties', () => {
      const skills = portfolioDataService.getTechnicalSkills();
      
      expect(skills).toHaveProperty('frontend');
      expect(skills).toHaveProperty('backend');
      expect(skills).toHaveProperty('devops');
      expect(skills).toHaveProperty('tools');
      
      expect(Array.isArray(skills.frontend)).toBe(true);
      expect(Array.isArray(skills.backend)).toBe(true);
      expect(Array.isArray(skills.devops)).toBe(true);
      expect(Array.isArray(skills.tools)).toBe(true);
      
      expect(skills.frontend.length).toBeGreaterThan(0);
      expect(skills.backend.length).toBeGreaterThan(0);
    });

    it('design skills have required properties', () => {
      const skills = portfolioDataService.getDesignSkills();
      
      expect(skills).toHaveProperty('visual');
      expect(skills).toHaveProperty('uiux');
      expect(skills).toHaveProperty('motion');
      expect(skills).toHaveProperty('threed');
      
      expect(Array.isArray(skills.visual)).toBe(true);
      expect(Array.isArray(skills.uiux)).toBe(true);
      expect(Array.isArray(skills.motion)).toBe(true);
      expect(Array.isArray(skills.threed)).toBe(true);
      
      expect(skills.visual.length).toBeGreaterThan(0);
      expect(skills.uiux.length).toBeGreaterThan(0);
    });
  });

  describe('getDevelopmentProjects', () => {
    it('returns only development projects', () => {
      const devProjects = portfolioDataService.getDevelopmentProjects();
      
      expect(Array.isArray(devProjects)).toBe(true);
      devProjects.forEach(project => {
        expect(project.category).toBe('development');
      });
    });
  });

  describe('getDesignProjects', () => {
    it('returns only design projects', () => {
      const designProjects = portfolioDataService.getDesignProjects();
      
      expect(Array.isArray(designProjects)).toBe(true);
      designProjects.forEach(project => {
        expect(project.category).toBe('design');
      });
    });
  });

  describe('getFeaturedProjects', () => {
    it('returns only featured projects', () => {
      const featuredProjects = portfolioDataService.getFeaturedProjects();
      
      expect(Array.isArray(featuredProjects)).toBe(true);
      featuredProjects.forEach(project => {
        expect(project.featured).toBe(true);
      });
    });
  });

  describe('getProjectsByCategory', () => {
    it('filters projects by development category', () => {
      const developmentProjects = portfolioDataService.getProjectsByCategory('development');
      
      expect(Array.isArray(developmentProjects)).toBe(true);
      developmentProjects.forEach(project => {
        expect(project.category).toBe('development');
      });
    });

    it('filters projects by design category', () => {
      const designProjects = portfolioDataService.getProjectsByCategory('design');
      
      expect(Array.isArray(designProjects)).toBe(true);
      designProjects.forEach(project => {
        expect(project.category).toBe('design');
      });
    });
  });

  describe('getEnhancedProjects', () => {
    it('returns enhanced projects with additional metadata', () => {
      const enhancedProjects = portfolioDataService.getEnhancedProjects();
      
      expect(Array.isArray(enhancedProjects)).toBe(true);
      expect(enhancedProjects.length).toBeGreaterThan(0);
      
      enhancedProjects.forEach(project => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('title');
        expect(project).toHaveProperty('description');
        expect(project).toHaveProperty('longDescription');
        expect(project).toHaveProperty('technologies');
        expect(project).toHaveProperty('status');
        expect(project).toHaveProperty('highlights');
        
        expect(typeof project.id).toBe('string');
        expect(typeof project.title).toBe('string');
        expect(typeof project.description).toBe('string');
        expect(typeof project.longDescription).toBe('string');
        expect(Array.isArray(project.technologies)).toBe(true);
        expect(['Live', 'In Development', 'Completed'].includes(project.status!)).toBe(true);
        expect(Array.isArray(project.highlights)).toBe(true);
      });
    });
  });

  describe('error handling', () => {
    it('handles missing data gracefully', () => {
      expect(() => {
        portfolioDataService.getPersonalInfo();
        portfolioDataService.getAllProjects();
        portfolioDataService.getSkills();
      }).not.toThrow();
    });
  });
});
