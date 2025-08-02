import React, { useState, useEffect, useRef } from 'react';
// import '../styles/Terminal.css'; // CSS file not found, using styled-components instead

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState([
    { text: 'Welcome to Trần Nguyên Khánh\'s Portfolio Terminal', type: 'cmd-output-blue' },
    { text: 'Type "help" to see available commands', type: 'cmd-output-green' },
    { text: 'Available for freelance and full-time opportunities', type: 'cmd-output-green' },
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
      { text: `$Portfolio> ${cmd}`, type: 'cmd-input' }
    ];

    // Process command
    let response = { text: 'Command not recognized. Type "help" for available commands.', type: 'cmd-output-red' };
    
    const command = cmd.toLowerCase().trim();
    
    if (command === 'help') {
      const helpCommands = [
        'Available commands:',
        '• help - Show this help message',
        '• about - About Trần Nguyên Khánh',
        '• skills - Technical skills',
        '• projects - Featured projects',
        '• contact - Contact information',
        '• education - Educational background',
        '• clear - Clear terminal output'
      ];
      setOutputs([...newOutputs, ...helpCommands.map(cmd => ({ text: cmd, type: 'cmd-output-green' })), { text: '', type: 'cmd-output-green' }]);
      setInput('');
      return;
    } else if (command === 'about') {
      response = { text: 'Full-Stack Developer passionate about modern web technologies. Experienced in React, TypeScript, Node.js, and cloud solutions.', type: 'cmd-output-green' };
    } else if (command === 'skills') {
      const skills = [
        'Technical Skills:',
        '• Frontend: React, TypeScript, Next.js, Three.js',
        '• Backend: Node.js, Python, MongoDB, PostgreSQL',
        '• Cloud: AWS, Docker, Kubernetes, Terraform',
        '• Tools: Git, Webpack, Jest, CI/CD'
      ];
      setOutputs([...newOutputs, ...skills.map(skill => ({ text: skill, type: 'cmd-output-green' })), { text: '', type: 'cmd-output-green' }]);
      setInput('');
      return;
    } else if (command === 'projects') {
      const projects = [
        'Featured Projects:',
        '• Calantha - Interactive Media Platform',
        '• Zena - UI/UX Design System',
        '• Slab - E-commerce Solution',
        '• GateWay - API Gateway Service',
        '• Cloud - Infrastructure Solutions'
      ];
      setOutputs([...newOutputs, ...projects.map(proj => ({ text: proj, type: 'cmd-output-green' })), { text: '', type: 'cmd-output-green' }]);
      setInput('');
      return;
    } else if (command === 'contact') {
      const contacts = [
        'Contact Information:',
        '• GitHub: https://github.com/kaitran225',
        '• Instagram: https://www.instagram.com/kaitran.prt',
        '• Email: Available upon request'
      ];
      setOutputs([...newOutputs, ...contacts.map(contact => ({ text: contact, type: contact.includes('http') ? 'link' : 'cmd-output-green' })), { text: '', type: 'cmd-output-green' }]);
      setInput('');
      return;
    } else if (command === 'education') {
      response = { text: 'Computer Science degree at FPT University - High-ranking institution with strong technical curriculum', type: 'cmd-output-green' };
    } else if (command === 'clear') {
      setOutputs([
        { text: 'Terminal cleared. Type "help" for available commands.', type: 'cmd-output-green' },
        { text: '', type: 'cmd-output-green' }
      ]);
      setInput('');
      return;
    }

    setOutputs([...newOutputs, response, { text: '', type: 'cmd-output-green' }]);
    setInput('');
  };

  return (
    <>
      <div id="commandheader">Portfolio Terminal</div>
      <div id="container">
        <div id="containerPrompt">
          <div id="output">
            {outputs.map((output, index) => (
              output.type === 'link' ? (
                <a href={output.text} key={index} target="_blank" rel="noopener noreferrer">{output.text}</a>
              ) : (
                <div className={output.type} key={index}>&gt; {output.text}</div>
              )
            ))}
          </div>
          <div id="promptBox">
            <div id="prompt">$Portfolio&gt;</div>
            <input 
              id="cmdline" 
              ref={inputRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Terminal;