import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { Send, Linkedin, Github, Mail, Terminal, Wifi } from 'lucide-react';
import HudFrame from '@/components/ui/HudFrame';
import CyberButton from '@/components/ui/CyberButton';
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
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'idle' | 'busy'>('online');
  const [commandCount, setCommandCount] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> System initialized...',
    '> Secure connection established',
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
      setTimeout(() => window.open('https://github.com/AlBaraa63', '_blank'), 500);
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
    <section id="contact" ref={sectionRef} className="h-full w-full p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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
            className={`text-base sm:text-lg ${smoothTransition} ${descriptionEntrance}`}
            style={{
              color: 'var(--text-secondary)',
              transitionDelay: showElements.title ? '140ms' : '0ms'
            }}
          >
            <span style={{ color: 'var(--accent)' }}>∞</span> Ideas Welcome
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 relative items-stretch">

          {/* Terminal Interface */}
          <HudFrame
            title="TERMINAL_ACCESS"
            className={`${smoothTransition} ${terminalEntrance} ${!showMessageForm ? 'lg:col-span-2 lg:max-w-3xl lg:mx-auto w-full' : 'lg:max-w-full'}`}
          >
            <div className="flex flex-col min-h-[600px]">
              {/* Terminal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-accent/20">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-accent" />
                  <span className="text-sm font-mono text-text-secondary">interactive_terminal.sh</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs font-mono text-accent uppercase">{connectionStatus}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => handleCommand('linkedin')}
                  className="p-3 border border-white/10 hover:border-[#0077B5]/50 bg-white/5 hover:bg-[#0077B5]/10 rounded flex flex-col items-center gap-2 transition-all group"
                >
                  <Linkedin size={20} className="text-[#0077B5] group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-text-secondary">LinkedIn</span>
                </button>
                <button
                  onClick={() => handleCommand('github')}
                  className="p-3 border border-white/10 hover:border-[#6e5494]/50 bg-white/5 hover:bg-[#6e5494]/10 rounded flex flex-col items-center gap-2 transition-all group"
                >
                  <Github size={20} className="text-[#6e5494] group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-text-secondary">GitHub</span>
                </button>
                <button
                  onClick={() => handleCommand('email')}
                  className="p-3 border border-white/10 hover:border-[#EA4335]/50 bg-white/5 hover:bg-[#EA4335]/10 rounded flex flex-col items-center gap-2 transition-all group"
                >
                  <Mail size={20} className="text-[#EA4335] group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-text-secondary">Email</span>
                </button>
                <button
                  onClick={() => handleCommand(showMessageForm ? 'close' : 'message')}
                  className="p-3 border border-accent/20 hover:border-accent bg-accent/5 hover:bg-accent/10 rounded flex flex-col items-center gap-2 transition-all group"
                >
                  <Send size={20} className="text-accent group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-accent font-bold">{showMessageForm ? 'Close' : 'Message'}</span>
                </button>
              </div>

              {/* Terminal Output Area */}
              <div className="flex-1 bg-black/40 rounded border border-white/10 p-4 font-mono text-sm overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-accent/20">
                  {terminalOutput.map((line, i) => (
                    <div key={i} className={`${line.startsWith('>') ? 'text-accent' : 'text-text-secondary'}`}>
                      {line}
                    </div>
                  ))}
                </div>
                {/* Command Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('command') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleCommand(input.value);
                      input.value = '';
                    }
                  }}
                  className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2"
                >
                  <span className="text-accent animate-pulse">{'>'}</span>
                  <input
                    type="text"
                    name="command"
                    autoComplete="off"
                    className="flex-1 bg-transparent border-none outline-none text-text-primary font-mono placeholder-white/20"
                    placeholder="Enter command..."
                    autoFocus
                  />
                </form>
              </div>
            </div>
          </HudFrame>

          {/* Contact Form */}
          {showMessageForm && (
            <HudFrame
              title="COMM_LINK"
              className={`${smoothTransition} ${formEntrance} border-accent/50 shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]`}
            >
              <div className="flex flex-col h-full justify-center">
                <div className="text-center mb-8">
                  <Wifi className="w-8 h-8 mx-auto text-accent mb-2 animate-pulse" />
                  <h3 className="text-xl font-bold text-white">ESTABLISH UPLINK</h3>
                  <p className="text-xs text-text-secondary font-mono">ENCRYPTED CONNECTION SECURE</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-accent">USER_ID (Name)</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full bg-black/50 border ${errors.name ? 'border-red-500' : 'border-accent/30'} focus:border-accent text-white px-4 py-3 rounded font-mono outline-none transition-colors`}
                      placeholder="Enter your name"
                    />
                    {errors.name && <span className="text-red-500 text-xs font-mono">{errors.name}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-accent">RETURN_ADDRESS (Email)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-black/50 border ${errors.email ? 'border-red-500' : 'border-accent/30'} focus:border-accent text-white px-4 py-3 rounded font-mono outline-none transition-colors`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <span className="text-red-500 text-xs font-mono">{errors.email}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-accent">DATA_PACKET (Message)</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full bg-black/50 border ${errors.message ? 'border-red-500' : 'border-accent/30'} focus:border-accent text-white px-4 py-3 rounded font-mono outline-none transition-colors resize-none`}
                      placeholder="Enter transmission..."
                    />
                    {errors.message && <span className="text-red-500 text-xs font-mono">{errors.message}</span>}
                  </div>

                  <CyberButton
                    type="submit"
                    className="w-full justify-center"
                    disabled={isSubmitting}
                    variant="primary"
                  >
                    {isSubmitting ? 'TRANSMITTING...' : 'INITIATE UPLOAD'}
                  </CyberButton>
                </form>
              </div>
            </HudFrame>
          )}

        </div>
      </div>
    </section>
  );
};

export default Contact;
