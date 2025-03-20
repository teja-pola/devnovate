import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react'; // Ensure you have these icons available

const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const currentTheme = 'dark'; // Set default theme to dark

        setIsDarkMode(currentTheme === 'dark');
        document.body.classList.toggle('dark', currentTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark', !isDarkMode);
        localStorage.setItem('theme', newTheme);
        console.log('Theme toggled to:', newTheme); // Log the new theme
    };

    return (
        <button onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};

export default ThemeToggle; // Ensure this is a default export
