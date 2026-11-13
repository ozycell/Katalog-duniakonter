import { cn } from '@/lib/utils';

interface HtmlContentProps {
  html: string;
  className?: string;
  variant?: 'default' | 'faq' | 'legal';
}

/**
 * HtmlContent - Render HTML content with inline CSS styling
 * 
 * Sama seperti InformationDetailPage, pakai inline CSS untuk styling
 * agar konsisten dengan konten dari rich text editor dashboard
 */
export function HtmlContent({ html, className, variant = 'default' }: HtmlContentProps) {
  if (!html) return null;

  const baseClass = variant === 'faq' ? 'faq-content' : variant === 'legal' ? 'legal-content' : 'html-content';

  return (
    <>
      <div 
        className={cn(baseClass, className)}
        dangerouslySetInnerHTML={{ __html: html }} 
      />
      <style>{`
        /* Base styling - 14px body text seperti InformationDetailPage */
        .html-content,
        .faq-content,
        .legal-content {
          font-size: 0.875rem;
          line-height: 1.7;
          color: hsl(var(--foreground));
        }
        
        /* Headings */
        .html-content h1,
        .html-content h2,
        .html-content h3,
        .html-content h4,
        .html-content h5,
        .html-content h6,
        .faq-content h1,
        .faq-content h2,
        .faq-content h3,
        .faq-content h4,
        .faq-content h5,
        .faq-content h6,
        .legal-content h1,
        .legal-content h2,
        .legal-content h3,
        .legal-content h4,
        .legal-content h5,
        .legal-content h6 {
          font-weight: 600;
          line-height: 1.3;
          color: hsl(var(--foreground));
        }
        
        /* H1 - Page title */
        .html-content h1,
        .faq-content h1,
        .legal-content h1 {
          font-size: 1.5rem;
          margin-top: 0;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid hsl(var(--border));
        }
        
        /* H2 - Section title / Pertanyaan FAQ */
        .html-content h2 {
          font-size: 1.25rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: hsl(var(--primary));
        }
        
        .faq-content h2,
        .legal-content h2 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid hsl(var(--border) / 0.3);
          color: hsl(var(--foreground));
        }
        
        /* H2 pertama tanpa border-top */
        .faq-content h2:first-of-type,
        .legal-content h2:first-of-type {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }
        
        /* FAQ & Legal Paragraphs - 14px */
        .faq-content p,
        .legal-content p {
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }
        
        /* H3 */
        .html-content h3,
        .faq-content h3,
        .legal-content h3 {
          font-size: 1.125rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        /* H4-H6 */
        .html-content h4,
        .faq-content h4,
        .legal-content h4 {
          font-size: 1rem;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        
        .html-content h5,
        .html-content h6,
        .faq-content h5,
        .faq-content h6,
        .legal-content h5,
        .legal-content h6 {
          font-size: 0.875rem;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        /* Paragraphs */
        .html-content p,
        .faq-content p,
        .legal-content p {
          margin-bottom: 1rem;
          margin-top: 0;
        }
        
        .html-content p:last-child,
        .faq-content p:last-child,
        .legal-content p:last-child {
          margin-bottom: 0;
        }
        
        /* Hide empty paragraphs */
        .html-content p:empty,
        .faq-content p:empty,
        .legal-content p:empty {
          display: none;
        }
        
        /* Lists */
        .html-content ul,
        .html-content ol,
        .faq-content ul,
        .faq-content ol,
        .legal-content ul,
        .legal-content ol {
          margin-bottom: 1rem;
          margin-top: 0;
          padding-left: 1.5rem;
        }
        
        .html-content ul,
        .faq-content ul,
        .legal-content ul {
          list-style-type: disc;
        }
        
        .html-content ol,
        .faq-content ol,
        .legal-content ol {
          list-style-type: decimal;
        }
        
        .html-content li,
        .faq-content li,
        .legal-content li {
          margin-bottom: 0.5rem;
        }
        
        .html-content li:last-child,
        .faq-content li:last-child,
        .legal-content li:last-child {
          margin-bottom: 0;
        }
        
        /* Nested lists */
        .html-content ul ul,
        .html-content ol ol,
        .html-content ul ol,
        .html-content ol ul,
        .faq-content ul ul,
        .faq-content ol ol,
        .faq-content ul ol,
        .faq-content ol ul,
        .legal-content ul ul,
        .legal-content ol ol,
        .legal-content ul ol,
        .legal-content ol ul {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        /* Links */
        .html-content a,
        .faq-content a,
        .legal-content a {
          color: hsl(var(--primary));
          text-decoration: underline;
          word-break: break-all;
        }
        
        .html-content a:hover,
        .faq-content a:hover,
        .legal-content a:hover {
          color: hsl(var(--primary-hover));
        }
        
        /* Bold & Italic */
        .html-content strong,
        .html-content b,
        .faq-content strong,
        .faq-content b,
        .legal-content strong,
        .legal-content b {
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        
        .html-content em,
        .html-content i,
        .faq-content em,
        .faq-content i,
        .legal-content em,
        .legal-content i {
          font-style: italic;
        }
        
        .html-content u,
        .faq-content u,
        .legal-content u {
          text-decoration: underline;
        }
        
        .html-content s,
        .html-content strike,
        .html-content del,
        .faq-content s,
        .faq-content strike,
        .faq-content del,
        .legal-content s,
        .legal-content strike,
        .legal-content del {
          text-decoration: line-through;
          color: hsl(var(--muted-foreground));
        }
        
        /* Blockquote */
        .html-content blockquote,
        .faq-content blockquote,
        .legal-content blockquote {
          border-left: 4px solid hsl(var(--primary) / 0.3);
          padding: 0.75rem 1rem;
          margin: 1rem 0;
          background: hsl(var(--muted) / 0.5);
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        .html-content blockquote p:last-child,
        .faq-content blockquote p:last-child,
        .legal-content blockquote p:last-child {
          margin-bottom: 0;
        }
        
        /* Code */
        .html-content code,
        .faq-content code,
        .legal-content code {
          background: hsl(var(--muted));
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        
        .html-content pre,
        .faq-content pre,
        .legal-content pre {
          background: hsl(var(--muted));
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .html-content pre code,
        .faq-content pre code,
        .legal-content pre code {
          background: none;
          padding: 0;
        }
        
        /* Tables */
        .html-content table,
        .faq-content table,
        .legal-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        
        .html-content th,
        .html-content td,
        .faq-content th,
        .faq-content td,
        .legal-content th,
        .legal-content td {
          border: 1px solid hsl(var(--border));
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        
        .html-content th,
        .faq-content th,
        .legal-content th {
          background: hsl(var(--muted));
          font-weight: 600;
        }
        
        /* Images */
        .html-content img,
        .faq-content img,
        .legal-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        
        /* Horizontal rule */
        .html-content hr,
        .faq-content hr,
        .legal-content hr {
          border: none;
          border-top: 1px solid hsl(var(--border));
          margin: 1.5rem 0;
        }
        
        /* Div containers */
        .html-content div,
        .faq-content div,
        .legal-content div {
          margin-bottom: 1rem;
        }
        
        .html-content div:last-child,
        .faq-content div:last-child,
        .legal-content div:last-child {
          margin-bottom: 0;
        }
        
        /* Description lists */
        .html-content dt,
        .faq-content dt,
        .legal-content dt {
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }
        
        .html-content dd,
        .faq-content dd,
        .legal-content dd {
          margin-left: 1rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </>
  );
}

export default HtmlContent;
