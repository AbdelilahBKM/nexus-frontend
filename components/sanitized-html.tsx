import React from 'react';
import DOMPurify from 'dompurify';

// Define types for the component's props
interface QuestionContentProps {
  content: string;
}

const SanitizedHTML: React.FC<QuestionContentProps> = ({ content }) => {
  // Sanitize the HTML content before rendering
  console.log(content);
  DOMPurify.setConfig({
    IN_PLACE: true,
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe'
    ],
  })
  const sanitizedContent = DOMPurify.sanitize(content, {
    
  });

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizedContent, // Use sanitized HTML
      }}
    />
  );
};

export default SanitizedHTML;
