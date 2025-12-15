import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { Send, Linkedin, Github, Mail, Terminal } from 'lucide-react';

import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_7ih1kvr';
const EMAILJS_TEMPLATE_ID = 'template_bwjowpe';
const EMAILJS_PUBLIC_KEY = 'XyP-kutZ_-CJmS3qi';

const Contact: React.FC = () => {
  const [showElements, setShowElements] = useState({
    title: false,
    description: false,
    terminal: false,
    form: false
  });
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'idle' | 'busy'>('online');
  const [commandCount, setCommandCount] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> Terminal ready',
    '> Type "help" for available commands'
  ]);
  const sectionRef = useRef<HTMLElement>(null);
  const timelineTimeoutsRef = useRef<number[]>([]);
  const hasTriggeredTimelineRef = useRef(false);

  const clearTimeouts = (timeoutsRef: MutableRefObject<number[]>) => {
    timeoutsRef.current.forEach(timeout => window.clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredTimelineRef.current) {
          hasTriggeredTimelineRef.current = true;
          const timeline = [
            { element: 'title' as const, delay: 100 },
            { element: 'description' as const, delay: 240 },
            { element: 'terminal' as const, delay: 380 },
            { element: 'form' as const, delay: 520 }
          ];

          timeline.forEach(({ element, delay }) => {
            const timeoutId = window.setTimeout(() => {
              setShowElements(prev => ({ ...prev, [element]: true }));
            }, delay);
            timelineTimeoutsRef.current.push(timeoutId);
          });
        }
      },
      { threshold: 0.25, rootMargin: '120px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimeouts(timelineTimeoutsRef);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    const newOutput = [...terminalOutput, `> ${command}`];
    setCommandCount(prev => prev + 1);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 800);

    // Handle clear command first (special case)
    if (cmd === 'clear') {
      setTerminalOutput([
        '> Terminal cleared',
        '> Type "help" for commands'
      ]);
      return;
    }

    // Easter eggs
    if (cmd === 'coffee' || cmd === '☕') {
      newOutput.push('');
      newOutput.push('☕ Coffee Mode Activated!');
      newOutput.push(`Brewing... ${Math.floor(Math.random() * 50) + 20} cups consumed during this build.`);
      newOutput.push('Caffeine level: Optimal for coding ✅');
      newOutput.push('');
      setTerminalOutput(newOutput);
      return;
    }

    if (cmd === 'hello' || cmd === 'hi' || cmd === 'hey') {
      const greetings = [
        'Hey there! 👋 Ready to connect?',
        'Hello! Great to see you here! 🚀',
        'Hi! Thanks for stopping by! ✨',
        'Hey! Let\'s make something awesome together! 🔥'
      ];
      newOutput.push('');
      newOutput.push(greetings[Math.floor(Math.random() * greetings.length)]);
      newOutput.push('Type "help" to see what you can do here.');
      newOutput.push('');
      setTerminalOutput(newOutput);
      return;
    }

    if (cmd === 'joke') {
      const jokes = [
        'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
        'Why did the developer go broke? Because they used up all their cache! 💸',
        'How many programmers does it take to change a light bulb? None, that\'s a hardware problem! 💡',
      ];
      newOutput.push('');
      newOutput.push(jokes[Math.floor(Math.random() * jokes.length)]);
      newOutput.push('');
      setTerminalOutput(newOutput);
      return;
    }

    if (cmd === 'status') {
      newOutput.push('');
      newOutput.push('─'.repeat(40));
      newOutput.push('  SYSTEM STATUS REPORT');
      newOutput.push('─'.repeat(40));
      newOutput.push(`  Connection     : ${connectionStatus.toUpperCase()}`);
      newOutput.push(`  Commands Run   : ${commandCount}`);
      newOutput.push(`  Form Status    : ${showMessageForm ? 'ACTIVE' : 'IDLE'}`);
      newOutput.push(`  Uptime         : ${new Date().toLocaleTimeString()}`);
      newOutput.push('─'.repeat(40));
      newOutput.push('');
      setTerminalOutput(newOutput);
      return;
    }

    if (cmd === 'whoami' || cmd === 'about') {
      newOutput.push('');
      newOutput.push('┌────────────────────────────────────────┐');
      newOutput.push('│  👨‍💻 AlBaraa Alolabi                     │');
      newOutput.push('├────────────────────────────────────────┤');
      newOutput.push('│  🤖 AI Engineer                       │');
      newOutput.push('│  👁️ Computer Vision Specialist        │');
      newOutput.push('│  ✨ Building intelligent systems       │');
      newOutput.push('└────────────────────────────────────────┘');
      newOutput.push('');
      setTerminalOutput(newOutput);
      return;
    }

    // Handle help command
    if (cmd === 'help') {
      newOutput.push('');
      newOutput.push('Commands:');
      newOutput.push('  linkedin, github, email, message');
      newOutput.push('  whoami, status, clear');
      newOutput.push('  coffee, joke, hello');
      newOutput.push('');
      setTerminalOutput(newOutput);
      return;
    }

    // Handle connect commands - simplified
    if (cmd === 'linkedin' || cmd === 'connect --linkedin') {
      newOutput.push('Opening LinkedIn...');
      setTimeout(() => window.open('http://www.linkedin.com/in/albaraa-alolabi-0693b5278', '_blank'), 500);
    }
    else if (cmd === 'github' || cmd === 'connect --github') {
      newOutput.push('Opening GitHub...');
      setTimeout(() => window.open('https://github.com/AlBaraa-1', '_blank'), 500);
    }
    else if (cmd === 'email' || cmd === 'connect --email') {
      newOutput.push('Opening email...');
      setTimeout(() => window.location.href = 'mailto:666645@gmail.com', 500);
    }
    // Handle show-form command
    else if (cmd === 'message' || cmd === 'show-form') {
      newOutput.push('Opening contact form...');
      setShowMessageForm(true);
      setConnectionStatus('busy');
      setTimeout(() => {
        const formElement = document.querySelector('input[name="name"]') as HTMLInputElement;
        if (formElement) {
          formElement.focus();
        }
      }, 500);
    } else if (cmd === 'close' || cmd === 'hide-form') {
      newOutput.push('Contact form closed');
      setShowMessageForm(false);
      setConnectionStatus('idle');
    }
    // Handle unknown commands
    else {
      newOutput.push('');
      newOutput.push(`Unknown command: ${cmd}`);
      newOutput.push('Type "help" for available commands');
      newOutput.push('');
    }

    setTerminalOutput(newOutput);
    
    setTerminalOutput(newOutput);
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const newOutput = [...terminalOutput];
      newOutput.push('> send-message --submit');
      newOutput.push('❌ Form validation failed. Please check your inputs.');
      setTerminalOutput(newOutput);
      return;
    }

    setIsSubmitting(true);
    const newOutput = [...terminalOutput];
    newOutput.push('> send-message --submit');
    newOutput.push('Sending message...');
    
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      
      newOutput.push('Message sent successfully! ✅');
      newOutput.push('Thank you for reaching out. I\'ll get back to you soon!');
      newOutput.push(`Response time: ~12 hours`);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setConnectionStatus('online');
      setShowMessageForm(false);
    } catch (error) {
      console.error('Error sending message:', error);
      newOutput.push('❌ Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
      setTerminalOutput(newOutput);
    }
  };

  const smoothTransition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const titleEntrance = showElements.title ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';
  const descriptionEntrance = showElements.description ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';
  const terminalEntrance = showElements.terminal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';
  const formEntrance = showElements.form ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

  return (
    <section id="contact" ref={sectionRef} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Enhanced */}
        <div className={`text-center mb-16 ${smoothTransition} ${titleEntrance}`}>
          <h2
            className={`text-5xl md:text-6xl font-bold mb-4 ${smoothTransition} ${titleEntrance}`}
            style={{
              transitionDelay: showElements.title ? '90ms' : '0ms',
              color: 'var(--text-primary)',
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Let's Connect
          </h2>
          
          <p 
            className={`text-base sm:text-lg ${smoothTransition}`}
            style={{ 
              color: 'var(--text-secondary)',
              transitionDelay: showElements.title ? '140ms' : '0ms'
            }}
          >
            <span style={{ color: 'var(--accent)' }}>∞</span> Ideas Welcome
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 relative items-stretch">
          {/* Terminal Interface - Now the Main Focus */}
          <div
            className={`code-block ${smoothTransition} ${terminalEntrance} ${!showMessageForm ? 'lg:col-span-2 lg:max-w-3xl lg:mx-auto w-full' : 'lg:max-w-full'} flex flex-col`}
            style={{
              transitionDelay: showElements.terminal ? '220ms' : '0ms',
              background: 'var(--bg-secondary)',
              backdropFilter: 'blur(10px)',
              border: '2px solid var(--border)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: showElements.terminal
                ? '0 18px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 8px 24px rgba(0,0,0,0.18)',
              minHeight: showMessageForm ? '600px' : 'auto'
            }}
          >
            {/* Terminal Header - Enhanced */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6 pb-4 border-b" 
                 style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:brightness-125 transition-all cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-125 transition-all cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-green-500 hover:brightness-125 transition-all cursor-pointer" />
                </div>
                <Terminal className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span className="text-sm font-mono truncate" style={{ color: 'var(--text-secondary)' }}>
                  interactive_terminal.sh
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="hidden sm:inline">session_id:</span>
                <span className="font-mono" style={{ color: 'var(--accent)' }}>{Math.random().toString(36).substring(2, 8)}</span>
              </div>
            </div>

            {/* Quick Action Buttons - Enhanced Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
              <button
                onClick={() => handleCommand('linkedin')}
                className="group relative flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-3 py-3 sm:px-4 sm:py-4 rounded-lg border overflow-hidden"
                style={{ 
                  borderColor: '#0077B5',
                  backgroundColor: 'rgba(0, 119, 181, 0.05)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0077B5]/10 to-transparent opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" style={{ color: '#0077B5', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                <span className="text-[10px] sm:text-xs font-medium relative z-10" style={{ color: '#0077B5' }}>LinkedIn</span>
              </button>
              
              <button
                onClick={() => handleCommand('github')}
                className="group relative flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-3 py-3 sm:px-4 sm:py-4 rounded-lg border overflow-hidden"
                style={{ 
                  borderColor: '#6e5494',
                  backgroundColor: 'rgba(110, 84, 148, 0.05)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6e5494]/10 to-transparent opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                <Github className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" style={{ color: '#6e5494', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                <span className="text-[10px] sm:text-xs font-medium relative z-10" style={{ color: '#6e5494' }}>GitHub</span>
              </button>
              
              <button
                onClick={() => handleCommand('email')}
                className="group relative flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-3 py-3 sm:px-4 sm:py-4 rounded-lg border overflow-hidden"
                style={{ 
                  borderColor: '#EA4335',
                  backgroundColor: 'rgba(234, 67, 53, 0.05)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#EA4335]/10 to-transparent opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" style={{ color: '#EA4335', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                <span className="text-[10px] sm:text-xs font-medium relative z-10" style={{ color: '#EA4335' }}>Email</span>
              </button>
              
              <button
                onClick={() => handleCommand(showMessageForm ? 'close' : 'message')}
                className="group relative flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-3 py-3 sm:px-4 sm:py-4 rounded-lg overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                <Send className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" style={{ color: 'var(--bg-primary)', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                <span className="text-[10px] sm:text-xs font-medium relative z-10" style={{ color: 'var(--bg-primary)' }}>
                  {showMessageForm ? 'Close' : 'Message'}
                </span>
              </button>
            </div>

            {/* Status Indicators - Enhanced */}
            <div className="flex items-center justify-between gap-2 mb-4 p-2 rounded-lg flex-wrap" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md" 
                     style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)', border: '1px solid var(--border)' }}>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full" 
                         style={{ 
                           backgroundColor: connectionStatus === 'online' ? '#10b981' : 
                                          connectionStatus === 'busy' ? '#f59e0b' : '#6b7280'
                         }} />
                    {connectionStatus === 'online' && (
                      <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" 
                           style={{ backgroundColor: '#10b981', opacity: 0.75 }} />
                    )}
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                    {connectionStatus}
                  </span>
                </div>
                
                {isTyping && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md animate-pulse" 
                       style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)', border: '1px solid var(--border)' }}>
                    <div className="flex gap-1">
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent)', animation: 'bounce 1.4s infinite' }} />
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent)', animation: 'bounce 1.4s infinite 0.2s' }} />
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent)', animation: 'bounce 1.4s infinite 0.4s' }} />
                    </div>
                    <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--accent)' }}>processing</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md" 
                   style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.08)' }}>
                <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Commands:</span>
                <span className="text-xs font-bold font-mono" style={{ color: 'var(--accent)' }}>{commandCount}</span>
              </div>
            </div>

            {/* Command Hint - Enhanced */}
            <div className="mb-3 p-3 rounded-lg overflow-x-auto" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.05)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Pro Commands</span>
              </div>
              <div className="text-xs sm:text-sm font-mono flex flex-wrap gap-1 sm:gap-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="whitespace-nowrap">Try:</span>
                <span className="px-2 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.15)', color: 'var(--accent)' }}>help</span>
                <span className="hidden sm:inline">·</span>
                <span className="px-2 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.15)', color: 'var(--accent)' }}>whoami</span>
                <span className="hidden sm:inline">·</span>
                <span className="px-2 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.15)', color: 'var(--accent)' }}>coffee</span>
              </div>
            </div>

            {/* Terminal Output */}
            <div
              className={`rounded-lg p-3 sm:p-4 overflow-y-auto font-mono text-xs sm:text-sm ${smoothTransition} ${
                !showMessageForm ? 'h-[250px] sm:h-[200px]' : 'h-[300px] sm:h-[calc(100vh*0.3)] sm:max-h-[300px] sm:min-h-[200px]'
              }`}
              style={{ 
                transitionDelay: showElements.terminal ? '260ms' : '0ms',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="h-full flex flex-col">
                <div 
                  className="flex-1 overflow-y-auto scroll-smooth"
                  ref={(el) => {
                    // Auto scroll to bottom when content changes
                    if (el) {
                      el.scrollTo({
                        top: el.scrollHeight,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  {terminalOutput.map((line, index) => (
                    <div 
                      key={index} 
                      className="mb-1" 
                      style={{ 
                        color: line.startsWith('> ') && !line.startsWith('> Terminal') && !line.startsWith('> Type') && !line.startsWith('> Ready') 
                          ? 'var(--accent)' 
                          : 'var(--terminal-green)' 
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('command') as HTMLInputElement;
                    const command = input.value.trim();
                    if (command) {
                      handleCommand(command);
                      input.value = '';
                    }
                  }}
                  className="flex items-center mt-3 pt-3 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span className="text-base font-bold" style={{ color: 'var(--accent)' }}>&gt; </span>
                  <input
                    type="text"
                    name="command"
                    className="flex-1 ml-2 px-3 py-2 rounded-md border-none outline-none text-sm sm:text-base font-mono"
                    style={{ 
                      color: 'var(--accent)',
                      backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
                      border: '1px solid rgba(var(--accent-rgb), 0.2)'
                    }}
                    placeholder="Type a command..."
                    autoComplete="off"
                    spellCheck="false"
                  />
                </form>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`code-block ${smoothTransition} ${formEntrance} ${showMessageForm ? 'flex flex-col' : 'hidden'}`}
            style={{
              transitionDelay: showMessageForm ? '260ms' : '0ms',
              background: 'var(--bg-secondary)',
              backdropFilter: 'blur(10px)',
              border: '2px solid var(--border)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: showMessageForm
                ? '0 18px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 8px 24px rgba(0,0,0,0.18)',
              minHeight: '600px'
            }}
          >
            <div className="mb-6 pb-4 border-b" 
                 style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Quick Message
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    I'll get back to you as soon as I can!
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 terminal-prompt" 
                       style={{ color: 'var(--accent)' }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 sm:py-3.5 rounded-lg border bg-transparent text-base ${smoothTransition} focus:outline-none ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  style={{ 
                    borderColor: errors.name ? 'rgb(239, 68, 68)' : 'var(--border)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)'
                  }}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 terminal-prompt" 
                       style={{ color: 'var(--accent)' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 sm:py-3.5 rounded-lg border bg-transparent text-base ${smoothTransition} focus:outline-none ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  style={{ 
                    borderColor: errors.email ? 'rgb(239, 68, 68)' : 'var(--border)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)'
                  }}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium terminal-prompt" 
                         style={{ color: 'var(--accent)' }}>
                    Message
                  </label>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {formData.message.length} characters
                  </span>
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={5}
                  className={`w-full px-4 py-3 sm:py-3.5 rounded-lg border bg-transparent text-base ${smoothTransition} focus:outline-none resize-none ${
                    errors.message ? 'border-red-500' : ''
                  }`}
                  style={{ 
                    borderColor: errors.message ? 'rgb(239, 68, 68)' : 'var(--border)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)'
                  }}
                  placeholder="Enter your message"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium overflow-hidden ${
                  isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                style={{ 
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <Send className={`w-5 h-5 relative z-10 ${
                  isSubmitting ? 'animate-spin' : ''
                }`} style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                <span className="relative z-10 font-semibold" style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  {isSubmitting ? 'Sending Your Message...' : 'Send Message →'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
