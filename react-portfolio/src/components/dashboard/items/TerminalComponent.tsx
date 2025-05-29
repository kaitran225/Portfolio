import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const TerminalComponent: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    'Welcome to KaiTran\'s Portfolio Terminal',
    'Type "help" to see available commands',
    '',
  ]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(inputValue);
      setInputValue('');
    }
  };

  const processCommand = (command: string) => {
    const commandLower = command.toLowerCase().trim();
    
    // Add command to history
    setHistory(prev => [...prev, `> ${command}`, '']);
    
    // Process command
    if (commandLower === 'help') {
      setHistory(prev => [
        ...prev,
        'Available commands:',
        '  help - Show this help message',
        '  about - About me',
        '  skills - My technical skills',
        '  projects - View my projects',
        '  clear - Clear the terminal',
        '  contact - Contact information',
        '',
      ]);
    } else if (commandLower === 'about') {
      setHistory(prev => [
        ...prev,
        'I am a passionate developer with expertise in web development,',
        'creative coding, and interactive experiences.',
        '',
      ]);
    } else if (commandLower === 'skills') {
      setHistory(prev => [
        ...prev,
        'Technical Skills:',
        '• Frontend: React, Vue, Three.js, WebGL',
        '• Backend: Node.js, Express, Python',
        '• Other: Creative Coding, UI/UX Design',
        '',
      ]);
    } else if (commandLower === 'projects') {
      setHistory(prev => [
        ...prev,
        'Projects:',
        '• Project 1 - Interactive 3D visualization',
        '• Project 2 - Responsive web application',
        '• Project 3 - Creative coding experiments',
        '',
        'For more details, check the Projects section.',
        '',
      ]);
    } else if (commandLower === 'clear') {
      setHistory(['Terminal cleared', '']);
    } else if (commandLower === 'contact') {
      setHistory(prev => [
        ...prev,
        'Contact Information:',
        '• Email: your.email@example.com',
        '• GitHub: github.com/yourusername',
        '• LinkedIn: linkedin.com/in/yourprofile',
        '',
      ]);
    } else if (commandLower === '') {
      // Do nothing for empty command
    } else {
      setHistory(prev => [
        ...prev,
        `Command not found: ${command}`,
        'Type "help" to see available commands',
        '',
      ]);
    }
  };

  return (
    <TerminalContainer onClick={() => inputRef.current?.focus()}>
      <TerminalOutput ref={outputRef}>
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </TerminalOutput>
      <TerminalInputLine>
        <TerminalPrompt>$&gt;</TerminalPrompt>
        <TerminalInput
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
      </TerminalInputLine>
    </TerminalContainer>
  );
};

const TerminalContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #1e1e1e;
  color: #f8f8f8;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TerminalOutput = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  white-space: pre-wrap;
  line-height: 1.4;
`;

const TerminalInputLine = styled.div`
  display: flex;
  padding: 8px;
  border-top: 1px solid #333;
`;

const TerminalPrompt = styled.div`
  color: #0f0;
  margin-right: 8px;
`;

const TerminalInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #f8f8f8;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  margin: 0;
  outline: none;
`;

export default TerminalComponent; 