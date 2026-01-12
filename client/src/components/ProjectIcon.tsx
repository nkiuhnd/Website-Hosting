import React from 'react';

const colors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];

interface ProjectIconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProjectIcon: React.FC<ProjectIconProps> = ({ name, size = 'md', className = '' }) => {
  // Generate a consistent index based on the name string
  const getIndex = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const colorIndex = getIndex(name) % colors.length;
  const bgColor = colors[colorIndex];
  
  // Get first letter, handle empty or non-string
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${bgColor} text-white rounded-lg flex items-center justify-center font-bold shadow-sm ${className}`}
      aria-label={`Icon for ${name}`}
    >
      {initial}
    </div>
  );
};

export default ProjectIcon;
