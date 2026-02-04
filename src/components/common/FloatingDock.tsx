import React, { useState, useEffect, useCallback } from 'react';
import { Home, User, Briefcase, FolderGit2, BookOpen, Award, Mail } from 'lucide-react';

interface NavItem {
    id: string;
    icon: React.ReactNode;
    label: string;
}

const navItems: NavItem[] = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'about', icon: <User size={20} />, label: 'About' },
    { id: 'experience', icon: <Briefcase size={20} />, label: 'Experience' },
    { id: 'projects', icon: <FolderGit2 size={20} />, label: 'Projects' },
    { id: 'research', icon: <BookOpen size={20} />, label: 'Research' },
    { id: 'certifications', icon: <Award size={20} />, label: 'Certs' },
    { id: 'contact', icon: <Mail size={20} />, label: 'Contact' },
];

const FloatingDock: React.FC = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    // Handle scroll to detect active section and hide/show dock
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;

        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        setLastScrollY(currentScrollY);

        // Detect active section
        const sections = navItems.map(item => ({
            id: item.id,
            element: document.getElementById(item.id)
        }));

        const viewportMiddle = window.innerHeight / 3;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.element) {
                const rect = section.element.getBoundingClientRect();
                if (rect.top <= viewportMiddle) {
                    setActiveSection(section.id);
                    break;
                }
            }
        }
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Calculate scale based on proximity to hovered item (macOS dock effect)
    const getScale = (index: number) => {
        if (!hoveredItem) return 1;
        const hoveredIndex = navItems.findIndex(item => item.id === hoveredItem);
        const distance = Math.abs(index - hoveredIndex);

        if (distance === 0) return 1.3;
        if (distance === 1) return 1.15;
        if (distance === 2) return 1.05;
        return 1;
    };

    return (
        <nav
            className={`floating-dock transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
                }`}
            role="navigation"
            aria-label="Main navigation"
        >
            {navItems.map((item, index) => (
                <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`dock-item group relative ${activeSection === item.id ? 'active' : ''}`}
                    style={{
                        transform: `scale(${getScale(index)}) ${hoveredItem === item.id ? 'translateY(-8px)' : 'translateY(0)'}`,
                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                    aria-label={item.label}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                >
                    {item.icon}

                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                        {item.label}
                    </span>

                    {/* Active indicator */}
                    {activeSection === item.id && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                    )}
                </button>
            ))}
        </nav>
    );
};

export default FloatingDock;
