import { ReactNode } from 'react';
import { Truck, Plane, Package, ArrowRight } from 'lucide-react';

interface UserTypeCardProps {
  type: 'pro' | 'citizen-transport' | 'citizen-sender';
  title: string;
  description: string;
  badge: string;
  onClick: () => void;
}

export function UserTypeCard({ type, title, description, badge, onClick }: UserTypeCardProps) {
  const getIcon = (): ReactNode => {
    switch (type) {
      case 'pro':
        return <Truck className="h-12 w-12 md:h-14 md:w-14" />;
      case 'citizen-transport':
        return <Plane className="h-12 w-12 md:h-14 md:w-14" />;
      case 'citizen-sender':
        return <Package className="h-12 w-12 md:h-14 md:w-14" />;
    }
  };

  const getIconClass = (): string => {
    switch (type) {
      case 'pro':
        return 'icon-circle-primary';
      case 'citizen-transport':
        return 'icon-circle-accent';
      case 'citizen-sender':
        return 'icon-circle-sky';
    }
  };

  return (
    <div 
      className="card-interactive text-center group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-pale to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      
      {/* Icon */}
      <div className={`${getIconClass()} mx-auto mb-6 relative z-10 group-hover:scale-110 group-hover:rotate-[360deg] transition-transform duration-700`}>
        {getIcon()}
      </div>
      
      {/* Content */}
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 relative z-10">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm md:text-base mb-5 relative z-10 leading-relaxed">
        {description}
      </p>
      
      {/* Badge */}
      <span className="badge-orange relative z-10">
        {badge}
      </span>
      
      {/* Arrow indicator */}
      <div className="mt-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 relative z-10">
        <ArrowRight className="h-5 w-5 text-primary mx-auto" />
      </div>
    </div>
  );
}
