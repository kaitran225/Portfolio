import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  theme?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className, theme = 'github-dark' }) => {
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && language ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{
            margin: '1em 0',
            borderRadius: '8px',
            fontSize: '13px',
            background: 'var(--color-black-secondary)',
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <InlineCode {...props}>
          {children}
        </InlineCode>
      );
    },
    h1: ({ children }: any) => <H1>{children}</H1>,
    h2: ({ children }: any) => <H2>{children}</H2>,
    h3: ({ children }: any) => <H3>{children}</H3>,
    h4: ({ children }: any) => <H4>{children}</H4>,
    h5: ({ children }: any) => <H5>{children}</H5>,
    h6: ({ children }: any) => <H6>{children}</H6>,
    p: ({ children }: any) => <Paragraph>{children}</Paragraph>,
    ul: ({ children }: any) => <UnorderedList>{children}</UnorderedList>,
    ol: ({ children }: any) => <OrderedList>{children}</OrderedList>,
    li: ({ children }: any) => <ListItem>{children}</ListItem>,
    blockquote: ({ children }: any) => <Blockquote>{children}</Blockquote>,
    a: ({ href, children }: any) => (
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </Link>
    ),
    table: ({ children }: any) => <Table>{children}</Table>,
    thead: ({ children }: any) => <TableHead>{children}</TableHead>,
    tbody: ({ children }: any) => <TableBody>{children}</TableBody>,
    tr: ({ children }: any) => <TableRow>{children}</TableRow>,
    th: ({ children }: any) => <TableHeader>{children}</TableHeader>,
    td: ({ children }: any) => <TableCell>{children}</TableCell>,
    hr: () => <HorizontalRule />,
    img: ({ src, alt }: any) => <Image src={src} alt={alt} />,
    strong: ({ children }: any) => <Strong>{children}</Strong>,
    em: ({ children }: any) => <Emphasis>{children}</Emphasis>,
  };

  return (
    <MarkdownContainer className={className}>
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </MarkdownContainer>
  );
};

// Styled Components
const MarkdownContainer = styled.div`
  color: var(--color-text-primary);
  line-height: 1.6;
  max-width: 100%;
  
  * {
    max-width: 100%;
  }
`;

const H1 = styled.h1`
  color: var(--color-purple-primary);
  border-bottom: 2px solid var(--color-purple-secondary);
  padding-bottom: 8px;
  margin: 0 0 24px 0;
  font-size: 2.5rem;
  font-weight: 700;
`;

const H2 = styled.h2`
  color: var(--color-green-primary);
  border-bottom: 1px solid var(--color-green-secondary);
  padding-bottom: 6px;
  margin: 32px 0 16px 0;
  font-size: 2rem;
  font-weight: 600;
`;

const H3 = styled.h3`
  color: var(--color-text-primary);
  margin: 24px 0 12px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const H4 = styled.h4`
  color: var(--color-text-primary);
  margin: 20px 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const H5 = styled.h5`
  color: var(--color-text-primary);
  margin: 16px 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const H6 = styled.h6`
  color: var(--color-text-secondary);
  margin: 16px 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Paragraph = styled.p`
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.7;
`;

const UnorderedList = styled.ul`
  margin: 0 0 16px 0;
  padding-left: 24px;
  color: var(--color-text-secondary);
`;

const OrderedList = styled.ol`
  margin: 0 0 16px 0;
  padding-left: 24px;
  color: var(--color-text-secondary);
`;

const ListItem = styled.li`
  margin-bottom: 6px;
  line-height: 1.6;
`;

const Blockquote = styled.blockquote`
  border-left: 4px solid var(--color-purple-primary);
  background: var(--color-black-secondary);
  margin: 16px 0;
  padding: 16px 20px;
  font-style: italic;
  color: var(--color-text-secondary);
  border-radius: 0 8px 8px 0;
  
  p:last-child {
    margin-bottom: 0;
  }
`;

const Link = styled.a`
  color: var(--color-purple-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    border-bottom-color: var(--color-purple-primary);
    color: var(--color-green-primary);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  background: var(--color-black-secondary);
  border-radius: 8px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background: var(--color-purple-secondary);
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-purple-secondary);
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const TableCell = styled.td`
  padding: 12px 16px;
  color: var(--color-text-secondary);
`;

const HorizontalRule = styled.hr`
  border: none;
  border-top: 2px solid var(--color-purple-secondary);
  margin: 24px 0;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Strong = styled.strong`
  color: var(--color-text-primary);
  font-weight: 600;
`;

const Emphasis = styled.em`
  color: var(--color-text-primary);
  font-style: italic;
`;

const InlineCode = styled.code`
  background: var(--color-black-secondary);
  color: var(--color-green-primary);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', Consolas, Monaco, monospace;
  font-size: 0.9em;
`;

export default MarkdownRenderer;