
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, image }) => {
  useEffect(() => {
    document.title = `${title} | ZapGroups Pro`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // OG Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    if (image) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', image);
    }
  }, [title, description, image]);

  return null;
};

export default SEO;
