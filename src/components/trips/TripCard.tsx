import { Trip } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plane, Ship, Truck, Calendar, Package, ArrowDown, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TripCardProps {
  trip: Trip;
  onContact?: () => void;
  onViewProfile?: () => void;
  onBook?: () => void;
  showBookButton?: boolean;
}

export function TripCard({ trip, onContact, onViewProfile, onBook, showBookButton = true }: TripCardProps) {
  const getTransportIcon = () => {
    switch (trip.transportType) {
      case 'plane':
        return <Plane className="h-5 w-5" />;
      case 'boat':
        return <Ship className="h-5 w-5" />;
      case 'road':
        return <Truck className="h-5 w-5" />;
    }
  };

  const getTransportClass = () => {
    switch (trip.transportType) {
      case 'plane':
        return 'transport-plane';
      case 'boat':
        return 'transport-boat';
      case 'road':
        return 'transport-road';
    }
  };

  const getTransportLabel = () => {
    switch (trip.transportType) {
      case 'plane':
        return 'Avion';
      case 'boat':
        return 'Bateau';
      case 'road':
        return 'Route';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const capacityPercentage = ((trip.totalCapacityKg - trip.availableCapacityKg) / trip.totalCapacityKg) * 100;

  return (
    <Card className="card-offer group">
      {trip.isPro && <div className="badge-pro">Pro</div>}
      
      <CardContent className="p-6">
        {/* Route Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <p className="text-lg font-bold text-foreground">{trip.origin}</p>
            <div className="flex items-center text-accent my-1">
              <ArrowDown className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-foreground">{trip.destination}</p>
          </div>
          <div className={getTransportClass()}>
            {getTransportIcon()}
          </div>
        </div>

        {/* Transport Details */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{formatDate(trip.departureDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{trip.availableCapacityKg} kg dispo</span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Capacité utilisée</span>
            <span>{Math.round(capacityPercentage)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${capacityPercentage}%`,
                background: capacityPercentage > 80 ? 'hsl(var(--accent))' : 'var(--gradient-primary)'
              }}
            />
          </div>
        </div>

        {/* Transporter Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={trip.transporterAvatar} />
            <AvatarFallback className="bg-primary text-white">
              {trip.transporterName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{trip.transporterName}</p>
            <p className="text-xs text-muted-foreground">{getTransportLabel()}</p>
          </div>
          {trip.flightNumber && (
            <Badge variant="secondary" className="text-xs">
              {trip.flightNumber}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between gap-4 flex-wrap border-t border-secondary mt-0 pt-5">
        <div className="price-display">
          {trip.pricePerKg} {trip.currency}/kg
        </div>
        <div className="flex gap-2 flex-wrap">
          {onViewProfile && (
            <Button variant="outline-primary" size="sm" onClick={onViewProfile}>
              <User className="h-4 w-4 mr-1" />
              Profil
            </Button>
          )}
          {onContact && (
            <Button variant="default" size="sm" onClick={onContact}>
              Contacter
            </Button>
          )}
          {showBookButton && onBook && (
            <Button variant="accent" size="sm" onClick={onBook}>
              Réserver
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
