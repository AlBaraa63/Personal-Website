import React, { useEffect, useRef, useState } from 'react';
import { Send, Linkedin, Github, Mail, MapPin, Check, AlertCircle } from 'lucide-react';
import HudFrame from '@/components/ui/HudFrame';
import CyberButton from '@/components/ui/CyberButton';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_7ih1kvr';
const EMAILJS_TEMPLATE_ID = 'template_bwjowpe';
const EMAILJS_PUBLIC_KEY = 'XyP-kutZ_-CJmS3qi';

interface Channel {
    id: string;
    label: string;
    value: string;
    href: string;
    icon: React.ReactNode;
}

const CHANNELS: Channel[] = [
    {
        id: 'email',
        label: 'Email',
        value: '666645@gmail.com',
        href: 'mailto:666645@gmail.com',
        icon: <Mail size={18} />,
    },
    {
        id: 'linkedin',
        label: 'LinkedIn',
        value: '/in/albaraa-alolabi',
        href: 'https://www.linkedin.com/in/albaraa-alolabi-0693b5278',
        icon: <Linkedin size={18} />,
    },
    {
        id: 'github',
        label: 'GitHub',
        value: '@AlBaraa63',
        href: 'https://github.com/AlBaraa63',
        icon: <Github size={18} />,
    },
];

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const initRef = useRef(false);

    useEffect(() => {
        if (!initRef.current) {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            initRef.current = true;
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setStatus('sending');
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
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setErrors({});
            // Auto-reset success banner after a moment so the form is usable again
            setTimeout(() => setStatus('idle'), 6000);
        } catch (err) {
            console.error('Email send failed:', err);
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="h-full w-full p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-mono uppercase mb-3">
                        Let's Connect
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] tracking-widest uppercase">
                        Open uplink · Ideas welcome
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-[280px_1fr] items-start">
                    {/* Channels */}
                    <aside className="space-y-3">
                        <HudFrame title="CHANNELS">
                            <div className="space-y-2">
                                {CHANNELS.map(channel => (
                                    <a
                                        key={channel.id}
                                        href={channel.href}
                                        target={channel.id === 'email' ? undefined : '_blank'}
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-3 py-2.5 border border-[var(--border)] hover:border-accent transition-colors group"
                                    >
                                        <span className="text-[var(--text-muted)] group-hover:text-accent transition-colors">
                                            {channel.icon}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)]">
                                                {channel.label}
                                            </div>
                                            <div className="text-sm text-[var(--text-primary)] truncate">
                                                {channel.value}
                                            </div>
                                        </div>
                                    </a>
                                ))}

                                <div className="flex items-center gap-3 px-3 py-2.5 border border-[var(--border)]">
                                    <MapPin size={18} className="text-[var(--text-muted)]" />
                                    <div>
                                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)]">
                                            Location
                                        </div>
                                        <div className="text-sm text-[var(--text-primary)]">UAE</div>
                                    </div>
                                </div>
                            </div>
                        </HudFrame>
                    </aside>

                    {/* Form */}
                    <HudFrame title="COMM_LINK">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField
                                    id="name"
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    error={errors.name}
                                    placeholder="Your name"
                                />
                                <FormField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={errors.email}
                                    placeholder="you@domain.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)] mb-1.5 block">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    aria-invalid={errors.message ? 'true' : undefined}
                                    placeholder="What's on your mind?"
                                    className={`w-full bg-[var(--surface-inset)] border px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors resize-none placeholder:text-[var(--text-faint)]
                                        ${errors.message ? 'border-red-500/60 focus:border-red-500' : 'border-[var(--border)] focus:border-accent'}
                                    `}
                                />
                                {errors.message && (
                                    <span className="text-red-400 text-xs font-mono mt-1 block">{errors.message}</span>
                                )}
                            </div>

                            {/* Status banner */}
                            {status === 'success' && (
                                <div className="flex items-center gap-2 px-3 py-2.5 border border-accent text-accent text-xs font-mono uppercase tracking-widest">
                                    <Check size={14} />
                                    Message transmitted. I'll get back to you soon.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="flex items-center gap-2 px-3 py-2.5 border border-red-500/60 text-red-400 text-xs font-mono uppercase tracking-widest">
                                    <AlertCircle size={14} />
                                    Failed to send. Try email directly.
                                </div>
                            )}

                            <div className="flex justify-end">
                                <CyberButton type="submit" disabled={status === 'sending'}>
                                    {status === 'sending' ? 'TRANSMITTING…' : 'SEND MESSAGE'}
                                    <Send size={14} className="ml-2" />
                                </CyberButton>
                            </div>
                        </form>
                    </HudFrame>
                </div>
            </div>
        </section>
    );
};

interface FormFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    error?: string;
    placeholder?: string;
    type?: string;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, value, onChange, error, placeholder, type = 'text' }) => (
    <div>
        <label htmlFor={id} className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)] mb-1.5 block">
            {label}
        </label>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            aria-invalid={error ? 'true' : undefined}
            placeholder={placeholder}
            className={`w-full bg-[var(--surface-inset)] border px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-faint)]
                ${error ? 'border-red-500/60 focus:border-red-500' : 'border-[var(--border)] focus:border-accent'}
            `}
        />
        {error && <span className="text-red-400 text-xs font-mono mt-1 block">{error}</span>}
    </div>
);

export default Contact;
