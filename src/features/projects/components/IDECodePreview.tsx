import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePreviewProps {
  files: Array<{
    fileName: string;
    language: string;
    filePath: string;
  }>;
  height?: string;
  theme?: 'vs-dark' | 'light' | 'dark';
}

interface TabProps {
  $active: boolean;
}

// Helper function to get file icons
const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const iconMap: { [key: string]: string } = {
    'tsx': '⚛️',
    'ts': '🔷',
    'jsx': '⚛️',
    'js': '📄',
    'json': '📋',
    'css': '🎨',
    'scss': '🎨',
    'html': '🌐',
    'md': '📝',
    'py': '🐍',
    'java': '☕',
    'cpp': '⚙️',
    'c': '⚙️',
    'php': '🐘',
    'sql': '🗃️',
    'xml': '📄',
    'yaml': '📄',
    'yml': '📄',
    'dockerfile': '🐋',
    'gitignore': '📁',
  };
  
  return iconMap[extension || ''] || '📄';
};

const IDECodePreview: React.FC<CodePreviewProps> = ({ files, height = "800px", theme: initialTheme = 'vs-dark' }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>(
    initialTheme === 'dark' ? 'vs-dark' : initialTheme === 'light' ? 'light' : 'vs-dark'
  );
  const [fileContent, setFileContent] = useState<string>('');

  const currentFile = files[activeTab];
  const isMarkdownFile = currentFile?.fileName.endsWith('.md');
  const isReadmeFile = currentFile?.fileName.toLowerCase().includes('readme');

  // Load file contents dynamically
  useEffect(() => {
    if (currentFile) {
      fetch(currentFile.filePath)
        .then((res) => res.text())
        .then((text) => setFileContent(text))
        .catch(() => setFileContent('// Error loading file'));
    }
  }, [currentFile]);

  // Monaco Editor options for VS Code-like experience
  const editorOptions = {
    readOnly: true,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontFamily: 'Fira Code, Consolas, Monaco, monospace',
    fontSize: 14,
    lineHeight: 1.5,
    automaticLayout: true,
    wordWrap: 'on' as const,
    renderLineHighlight: 'all' as const,
    cursorBlinking: 'smooth' as const,
    folding: true,
    renderWhitespace: 'selection' as const,
    showFoldingControls: 'always' as const,
    bracketPairColorization: { enabled: true },
  };

  // Custom markdown components for better rendering
  const markdownComponents = {
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
    h1: ({ children }: any) => <MarkdownH1>{children}</MarkdownH1>,
    h2: ({ children }: any) => <MarkdownH2>{children}</MarkdownH2>,
    h3: ({ children }: any) => <MarkdownH3>{children}</MarkdownH3>,
    p: ({ children }: any) => <MarkdownP>{children}</MarkdownP>,
    ul: ({ children }: any) => <MarkdownUL>{children}</MarkdownUL>,
    ol: ({ children }: any) => <MarkdownOL>{children}</MarkdownOL>,
    li: ({ children }: any) => <MarkdownLI>{children}</MarkdownLI>,
    blockquote: ({ children }: any) => <MarkdownBlockquote>{children}</MarkdownBlockquote>,
    a: ({ href, children }: any) => (
      <MarkdownLink href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </MarkdownLink>
    ),
  };

  return (
    <IDEContainer>
      {/* IDE-style Tab Bar */}
      <TabBar>
        <TabsList>
          {files.map((file, index) => (
            <Tab
              key={index}
              $active={index === activeTab}
              onClick={() => setActiveTab(index)}
            >
              <FileIcon>
                {getFileIcon(file.fileName)}
              </FileIcon>
              <FileName>{file.fileName}</FileName>
              {index === activeTab && <ActiveIndicator />}
            </Tab>
          ))}
        </TabsList>
        
        <IDEControls>
          <ThemeToggle onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}>
            {theme === 'vs-dark' ? '☀️' : '🌙'}
          </ThemeToggle>
        </IDEControls>
      </TabBar>

      {/* Content Area */}
      <ContentArea>
        {currentFile && (
          <>
            {isMarkdownFile || isReadmeFile ? (
              // Render Markdown in preview mode
              <MarkdownPreview>
                <MarkdownHeader>
                  <PreviewLabel>📄 Markdown Preview</PreviewLabel>
                </MarkdownHeader>
                <MarkdownContent>
                  <ReactMarkdown components={markdownComponents}>
                    {fileContent}
                  </ReactMarkdown>
                </MarkdownContent>
              </MarkdownPreview>
            ) : (
              // Render code with Monaco Editor
              <EditorContainer>
                <Editor
                  height={height}
                  defaultLanguage={currentFile.language}
                  value={fileContent}
                  theme={theme}
                  options={editorOptions}
                  loading={<LoadingSpinner>Loading Monaco Editor...</LoadingSpinner>}
                />
              </EditorContainer>
            )}
          </>
        )}
      </ContentArea>
    </IDEContainer>
  );
};

// Styled Components
const IDEContainer = styled.div`
  background: var(--color-black-primary);
  border: 1px solid var(--color-purple-secondary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 35px rgba(105, 51, 255, 0.2);
  }
`;

const TabBar = styled.div`
  background: var(--color-black-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`;

const TabsList = styled.div`
  display: flex;
  overflow-x: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-purple-primary);
    border-radius: 3px;
  }
`;

const Tab = styled.button<TabProps>`
  background: ${props => props.$active ? 'var(--color-black-primary)' : 'transparent'};
  color: ${props => props.$active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'};
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 0px;
  cursor: pointer;
  font-size: 13px;
  position: relative;
  transition: all 0.2s ease;  
  &:hover {
    background: ${props => props.$active ? 'var(--color-black-primary)' : 'var(--color-purple-secondary)'};
    color: var(--color-text-primary);
  }
`;

const FileIcon = styled.span`
  font-size: 14px;
`;

const FileName = styled.span`
  font-weight: 500;
`;

const ActiveIndicator = styled.div`
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
`;

const IDEControls = styled.div`
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ThemeToggle = styled.button`
  background: transparent;
  border: 1px solid var(--color-purple-secondary);
  color: var(--color-text-primary);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-purple-secondary);
  }
`;

const ContentArea = styled.div`
  position: relative;
`;

const EditorContainer = styled.div`
  background: #1e1e1e;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: var(--color-text-secondary);
  font-size: 14px;
`;

// Markdown Preview Styles
const MarkdownPreview = styled.div`
  background: var(--color-black-primary);
  color: var(--color-text-primary);
  min-height: 400px;
`;

const MarkdownHeader = styled.div`
  background: var(--color-black-secondary);
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-purple-secondary);
  display: flex;
  align-items: center;
`;

const PreviewLabel = styled.span`
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
`;

const MarkdownContent = styled.div`
  padding: 24px;
  line-height: 1.6;
  max-width: none;
  
  * {
    max-width: 100%;
  }
`;

const MarkdownH1 = styled.h1`
  color: var(--color-purple-primary);
  border-bottom: 2px solid var(--color-purple-secondary);
  padding-bottom: 8px;
  margin: 0 0 16px 0;
  font-size: 2rem;
`;

const MarkdownH2 = styled.h2`
  color: var(--color-green-primary);
  border-bottom: 1px solid var(--color-green-secondary);
  padding-bottom: 4px;
  margin: 24px 0 12px 0;
  font-size: 1.5rem;
`;

const MarkdownH3 = styled.h3`
  color: var(--color-text-primary);
  margin: 20px 0 8px 0;
  font-size: 1.25rem;
`;

const MarkdownP = styled.p`
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.7;
`;

const MarkdownUL = styled.ul`
  margin: 0 0 16px 0;
  padding-left: 24px;
`;

const MarkdownOL = styled.ol`
  margin: 0 0 16px 0;
  padding-left: 24px;
`;

const MarkdownLI = styled.li`
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  line-height: 1.6;
`;

const MarkdownBlockquote = styled.blockquote`
  border-left: 4px solid var(--color-purple-primary);
  background: var(--color-black-secondary);
  margin: 16px 0;
  padding: 12px 16px;
  font-style: italic;
  color: var(--color-text-secondary);
`;

const MarkdownLink = styled.a`
  color: var(--color-purple-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    border-bottom-color: var(--color-purple-primary);
    color: var(--color-green-primary);
  }
`;

const InlineCode = styled.code`
  background: var(--color-black-secondary);
  color: var(--color-green-primary);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', Consolas, Monaco, monospace;
  font-size: 0.9em;
`;

export default IDECodePreview;
