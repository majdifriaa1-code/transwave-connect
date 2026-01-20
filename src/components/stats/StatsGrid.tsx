import { PlatformStats, CountryStats } from '@/types';
import { Card } from '@/components/ui/card';
import { Package, Truck, Heart, Users, TrendingUp, Clock } from 'lucide-react';

interface StatsGridProps {
  stats: PlatformStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    {
      icon: <Package className="h-8 w-8" />,
      value: stats.totalDeliveries.toLocaleString(),
      label: 'Colis Livrés',
      trend: '+15% ce mois',
      trendIcon: <TrendingUp className="h-4 w-4" />,
    },
    {
      icon: <Truck className="h-8 w-8" />,
      value: stats.activeDeliveries.toLocaleString(),
      label: 'Livraisons en Cours',
      trend: 'Temps réel',
      trendIcon: <Clock className="h-4 w-4" />,
    },
    {
      icon: <Heart className="h-8 w-8" />,
      value: stats.freeDeliveries.toLocaleString(),
      label: 'Transports Bénévoles',
      trend: 'Gratuitement',
      trendIcon: <Heart className="h-4 w-4 fill-current" />,
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: stats.activeUsers.toLocaleString(),
      label: 'Utilisateurs Actifs',
      trend: '+8% ce mois',
      trendIcon: <TrendingUp className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <Card key={index} className="stat-card">
          <div className="text-primary/80 mb-4">{item.icon}</div>
          <div className="stat-number mb-2">{item.value}</div>
          <div className="text-muted-foreground text-sm mb-3">{item.label}</div>
          <div className="stat-trend-up flex items-center justify-center gap-1">
            {item.trendIcon}
            <span>{item.trend}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface CountryStatsProps {
  countries: CountryStats[];
}

export function CountryStatsGrid({ countries }: CountryStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {countries.map((country) => (
        <div
          key={country.code}
          className="bg-card rounded-xl p-4 border-2 border-secondary hover:border-primary transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl">{country.flag}</span>
            <div className="flex-1">
              <p className="font-bold text-foreground">{country.name}</p>
              <p className="text-sm text-muted-foreground">{country.shipments} envois</p>
            </div>
          </div>
          <div className="country-bar">
            <div 
              className="country-bar-fill" 
              style={{ width: `${country.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
