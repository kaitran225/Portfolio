import React from 'react';
import { Helmet } from 'react-helmet-async';

// ============= SEO OPTIMIZATION COMPONENT =============

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'profile' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noindex?: boolean;
}

const defaultMeta = {
  title: 'Trần Nguyên Khánh - Full Stack Developer & Software Engineer',
  description: 'Experienced Full Stack Developer specializing in React, TypeScript, Node.js, and Java. Professional software engineer with 3+ years of project experience and enterprise-level development skills.',
  keywords: [
    'Trần Nguyên Khánh',
    'Full Stack Developer',
    'Software Engineer',
    'React Developer',
    'TypeScript',
    'Node.js',
    'Java Developer',
    'Frontend Developer',
    'Backend Developer',
    'Web Developer',
    'Software Development',
    'Professional Developer',
    'Freelance Developer',
    'Philippines',
    'Computer Science Graduate',
    'JavaScript',
    'HTML',
    'CSS',
    'MySQL',
    'Spring Boot',
    'REST API',
    'Git',
    'Docker',
    'Portfolio',
    'Technical Skills',
    'Programming',
    'Web Applications',
    'Database Design',
    'Software Architecture',
    'Agile Development',
    'Problem Solving',
    'Team Collaboration',
    'Clean Code',
    'Best Practices',
    'Modern Web Technologies',
    'Responsive Design',
    'User Experience',
    'Performance Optimization',
    'Code Quality',
    'Testing',
    'Debugging',
    'Version Control',
    'API Development',
    'Database Management',
    'System Design',
    'Software Testing',
    'Project Management',
    'Technical Documentation',
    'Code Review',
    'Continuous Integration',
    'DevOps',
    'Cloud Computing',
    'Scalable Applications',
    'Cross-platform Development',
    'Mobile-friendly',
    'SEO Optimization',
    'Web Performance',
    'Security Best Practices'
  ],
  image: 'https://cybriadev.com/assets/portfolio-preview.png',
  url: 'https://cybriadev.com',
  author: 'Trần Nguyên Khánh',
  siteName: 'Trần Nguyên Khánh Portfolio',
  locale: 'en_US',
  type: 'profile' as const,
  twitterCard: 'summary_large_image' as const
};

const SEOOptimizer: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  locale,
  siteName,
  twitterCard = 'summary_large_image',
  noindex = false
}) => {
  const seo = {
    title: title || defaultMeta.title,
    description: description || defaultMeta.description,
    keywords: [...defaultMeta.keywords, ...keywords],
    image: image || defaultMeta.image,
    url: url || defaultMeta.url,
    author: author || defaultMeta.author,
    siteName: siteName || defaultMeta.siteName,
    locale: locale || defaultMeta.locale,
    type: type || defaultMeta.type,
    twitterCard: twitterCard || defaultMeta.twitterCard
  };

  // Generate structured data for person/professional
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Trần Nguyên Khánh",
    "jobTitle": "Full Stack Developer",
    "description": "Experienced Full Stack Developer specializing in React, TypeScript, Node.js, and Java",
    "url": seo.url,
    "image": seo.image,
    "sameAs": [
      "https://github.com/kaitran225",
      "https://linkedin.com/in/kaitran225",
      "https://twitter.com/kaitran225"
    ],
    "knowsAbout": [
      "React",
      "TypeScript",
      "Node.js",
      "Java",
      "Spring Boot",
      "MySQL",
      "Full Stack Development",
      "Software Engineering",
      "Web Development",
      "Database Design",
      "API Development",
      "Modern Web Technologies"
    ],
    "alumniOf": "University/College Name",
    "nationality": "Filipino",
    "workLocation": {
      "@type": "Place",
      "name": "Philippines"
    },
    "seeks": {
      "@type": "JobPosting",
      "title": "Software Development Opportunities",
      "description": "Open to full-time, freelance, and contract opportunities in software development",
      "employmentType": ["FULL_TIME", "CONTRACTOR", "FREELANCE"]
    }
  };

  // Generate website structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": seo.siteName,
    "url": seo.url,
    "description": seo.description,
    "author": {
      "@type": "Person",
      "name": seo.author
    },
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${seo.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // Generate professional portfolio structured data
  const portfolioStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Professional Portfolio - Kai  Tran",
    "description": "Portfolio showcasing full stack development projects and technical skills",
    "author": {
      "@type": "Person",
      "name": "Trần Nguyên Khánh"
    },
    "url": seo.url,
    "image": seo.image,
    "dateCreated": "2024-01-01",
    "dateModified": modifiedTime || new Date().toISOString(),
    "inLanguage": "en-US",
    "genre": "Technology Portfolio",
    "keywords": seo.keywords.join(', ')
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <meta name="author" content={seo.author} />
      <link rel="canonical" href={seo.url} />
      
      {/* Robots and Indexing */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="language" content="English" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:alt" content={`${seo.author} - Full Stack Developer Portfolio`} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={seo.type} />
      <meta property="og:site_name" content={seo.siteName} />
      <meta property="og:locale" content={seo.locale} />
      
      {/* Additional Open Graph for Profile */}
      {seo.type === 'profile' && (
        <>
          <meta property="profile:first_name" content="Kai" />
          <meta property="profile:last_name" content="Tran" />
          <meta property="profile:username" content="kaitran225" />
        </>
      )}
      
      {/* Article specific meta tags */}
      {seo.type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:author" content={seo.author} />
          <meta property="article:section" content="Technology" />
          <meta property="article:tag" content="Software Development" />
        </>
      )}
      
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={seo.twitterCard} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:image:alt" content={`${seo.author} - Full Stack Developer Portfolio`} />
      <meta name="twitter:creator" content="@kaitran225" />
      <meta name="twitter:site" content="@kaitran225" />
      
      {/* Additional Meta Tags for Better SEO */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#6933ff" />
      
      {/* Professional/Career specific meta tags */}
      <meta name="classification" content="Professional Portfolio" />
      <meta name="category" content="Technology" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta name="rights" content="© 2025 Trần Nguyên Khánh. All rights reserved." />
      
      {/* Dublin Core Metadata */}
      <meta name="DC.title" content={seo.title} />
      <meta name="DC.description" content={seo.description} />
      <meta name="DC.creator" content={seo.author} />
      <meta name="DC.language" content="en-US" />
      <meta name="DC.type" content="Interactive Resource" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.identifier" content={seo.url} />
      <meta name="DC.rights" content="© 2025 Trần Nguyên Khánh" />
      
      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(personStructuredData)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(portfolioStructuredData)}
      </script>
      
      {/* Additional Link Tags */}
      <link rel="author" href="/humans.txt" />
      <link rel="me" href="https://github.com/kaitran225" />
      <link rel="me" href="https://linkedin.com/in/kaitran225" />
      
      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.github.com" />
      <link rel="dns-prefetch" href="https://github.com" />
      <link rel="dns-prefetch" href="https://linkedin.com" />
    </Helmet>
  );
};

export default SEOOptimizer;
