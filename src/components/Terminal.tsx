import React, { useState, useEffect, useRef } from 'react';
import '../styles/Terminal.css';

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState([
    { text: 'This is just a temporary portfolio website.', type: 'cmd-output-green' },
    { text: 'The official one is still under developing.', type: 'cmd-output-green' },
    { text: 'Thank you for visting our website', type: 'cmd-output-green' },
    { text: 'For further infomation please contact.', type: 'cmd-output-green' },
    { text: 'https://www.instagram.com/kaitran.prt', type: 'link' },
    { text: '', type: 'cmd-output-green' }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(input);
    }
  };

  const processCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    
    // Add the command to output
    const newOutputs = [
      ...outputs,
      { text: `$Project_Cybriaz> ${cmd}`, type: 'cmd-input' }
    ];

    // Process command (can be expanded)
    let response = { text: 'Command not recognized.', type: 'cmd-output-red' };
    if (cmd.toLowerCase() === 'help') {
      response = { text: 'Available commands: help, about, contact', type: 'cmd-output-green' };
    } else if (cmd.toLowerCase() === 'about') {
      response = { text: 'Portfolio website showcasing projects and skills.', type: 'cmd-output-green' };
    } else if (cmd.toLowerCase() === 'contact') {
      response = { text: 'https://www.instagram.com/kaitran.prt', type: 'link' };
    }

    setOutputs([...newOutputs, response, { text: '', type: 'cmd-output-green' }]);
    setInput('');
  };

  return (
    <>
      <div id="commandheader">Command Prompt</div>
      <div id="container">
        <div id="containerPrompt">
          <div id="output">
            {outputs.map((output, index) => (
              output.type === 'link' ? (
                <a href={output.text} key={index}>{output.text}</a>
              ) : (
                <div className={output.type} key={index}>&gt; {output.text}</div>
              )
            ))}
          </div>
          <div id="promptBox">
            <div id="prompt">$Project_Cybriaz&gt;</div>
            <input 
              id="cmdline" 
              ref={inputRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Terminal; 