import React from 'react';

// Define types for the component's props
interface QuestionContentProps {
  content: string;
}

const SanitizedHTML: React.FC<QuestionContentProps> = ({ content }) => {
  // Sanitize the HTML content before rendering
  

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: content, // Use sanitized HTML
      }}
    />
  );
};

export default SanitizedHTML;
