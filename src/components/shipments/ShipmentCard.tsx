import { Shipment } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Scale, Calendar, Heart, DollarSign } from 'lucide-react';
import { CUSTOMS_CATEGORIES } from '@/data/mockData';

interface ShipmentCardProps {
  shipment: Shipment;
  onAccept?: () => void;
  onViewDetails?: () => void;
}

export function ShipmentCard({ shipment, onAccept, onViewDetails }: ShipmentCardProps) {
  const category = CUSTOMS_CATEGORIES.find(c => c.id === shipment.itemCategory);
  
  const isSolidarity = shipment.type === 'solidarity';

  return (
    <Card className="card-offer group">
      {isSolidarity && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-success/10 text-success">
          <Heart className="h-3.5 w-3.5 fill-current" />
          Solidaire
        </div>
      )}
      
      <CardContent className="p-6">
        {/* Route */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MapPin className="h-4 w-4 text-primary" />
            <span>De</span>
            <span className="font-semibold text-foreground">{shipment.origin}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" />
            <span>Vers</span>
            <span className="font-semibold text-foreground">{shipment.destination}</span>
          </div>
        </div>

        {/* Category Badge */}
        {category && (
          <Badge variant="secondary" className="mb-4">
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </Badge>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {shipment.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Scale className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Poids:</span>
            <span className="font-medium">{shipment.weightKg} kg</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Dim:</span>
            <span className="font-medium">{shipment.dimensions} cm</span>
          </div>
          {shipment.preferredDate && (
            <div className="flex items-center gap-2 text-sm col-span-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Souhaité:</span>
              <span className="font-medium">{shipment.preferredDate}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between gap-4 flex-wrap border-t border-secondary mt-0 pt-5">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-accent" />
          {isSolidarity ? (
            <span className="text-success font-bold">Gratuit</span>
          ) : (
            <span className="price-display">{shipment.proposedPrice} €</span>
          )}
        </div>
        <div className="flex gap-2">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              Détails
            </Button>
          )}
          {onAccept && (
            <Button variant="success" size="sm" onClick={onAccept}>
              Accepter
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
