import React from 'react';

interface ComputerLogoProps {
  className?: string;
  size?: number;
}

export const ComputerLogo: React.FC<ComputerLogoProps> = ({ 
  className = "w-10 h-10", 
  size 
}) => {
  return (
    <img
      src="/logo.svg"
      alt="โลโก้ภาควิชาเทคโนโลยีการศึกษา"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      loading="eager"
    />
  );
};

export default ComputerLogo;

