import { MatchedOffer } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar } from 'lucide-react';

interface SimulatedOffersPanelProps {
  offers: MatchedOffer[];
  onSelectOffer?: (offer: MatchedOffer) => void;
}

export default function SimulatedOffersPanel({ offers, onSelectOffer }: SimulatedOffersPanelProps) {
  if (offers.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune offre disponible ne correspond à votre colis.
        </CardContent>
      </Card>
    );
  }

  const topOffers = offers.slice(0, 5);
  const avgPrice =
    offers.length > 0 ? (offers.reduce((sum, o) => sum + o.estimatedPrice, 0) / offers.length).toFixed(2) : '0';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total d'offres</p>
              <p className="text-2xl font-bold">{offers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Prix moyen</p>
              <p className="text-2xl font-bold">{avgPrice}€</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Meilleure offre</p>
              <p className="text-2xl font-bold">{topOffers[0]?.estimatedPrice.toFixed(2)}€</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Top Offres</h3>
        {topOffers.map((offer, index) => (
          <Card key={`${offer.offer.id}-${index}`} className="hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{offer.transporterName}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{offer.transporterRating}/5</span>
                    </div>
                  </div>
                  <Badge variant="default">{offer.matchScore} pts</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Route</p>
                      <p className="font-medium">
                        {offer.offer.origin} → {offer.offer.destination}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Départ</p>
                      <p className="font-medium">
                        {new Date(offer.offer.departureDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {offer.offer.basePricePerKg}€/kg • {offer.offer.pickupType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{offer.estimatedPrice.toFixed(2)}€</p>
                  </div>
                </div>

                {onSelectOffer && (
                  <Button onClick={() => onSelectOffer(offer)} className="w-full">
                    Choisir cette offre
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {offers.length > 5 && (
        <p className="text-center text-sm text-muted-foreground">
          +{offers.length - 5} autres offres disponibles
        </p>
      )}
    </div>
  );
}
