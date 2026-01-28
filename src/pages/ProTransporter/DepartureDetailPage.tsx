import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Trash2, Edit2, Calendar, MapPin, Truck } from 'lucide-react';
import { DepartureOffer } from '@/types';

export default function DepartureDetailPage() {
  const navigate = useNavigate();
  const { departureId } = useParams();
  const { departureOffers, updateDepartureOffer, deleteDepartureOffer } = useApp();
  const { toast } = useToast();
  const [departure, setDeparture] = useState<DepartureOffer | null>(null);

  useEffect(() => {
    if (departureId) {
      const found = departureOffers.find(d => d.id === departureId);
      if (found) {
        setDeparture(found);
      } else {
        toast({ title: 'Erreur', description: 'Départ introuvable', variant: 'destructive' });
        navigate('/dashboard-pro');
      }
    }
  }, [departureId, departureOffers, navigate, toast]);

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce départ ?')) {
      if (departureId) {
        deleteDepartureOffer(departureId);
        toast({ title: '✅ Supprimé', description: 'Le départ a été supprimé' });
        navigate('/dashboard-pro');
      }
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'published': 'Publié',
      'in_progress': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'published': 'bg-blue-100 text-blue-700',
      'in_progress': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (!departure) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Button variant="ghost" onClick={() => navigate('/dashboard-pro')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux départs
        </Button>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{departure.origin} → {departure.destination}</CardTitle>
                <CardDescription>Publié le {new Date(departure.publishDate).toLocaleDateString('fr-FR')}</CardDescription>
              </div>
              <Badge className={getStatusColor(departure.status)}>
                {getStatusLabel(departure.status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Route & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Route
                </h3>
                <p className="text-sm text-muted-foreground">Départ: {departure.origin}</p>
                <p className="text-sm text-muted-foreground">Destination: {departure.destination}</p>
              </div>

              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Dates
                </h3>
                <p className="text-sm text-muted-foreground">
                  Départ: {new Date(departure.departureDate).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Limite: {new Date(departure.pickupDeadline).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <Separator />

            {/* Vehicles */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Truck className="h-4 w-4 text-primary" />
                Véhicules ({departure.vehicles.length})
              </h3>
              <div className="space-y-2">
                {departure.vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="p-3 border rounded-lg bg-accent/5">
                    <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-sm text-muted-foreground">
                      Capacité: {vehicle.capacityKg}kg | Charge actuelle: {vehicle.currentLoadKg || 0}kg
                    </p>
                    {vehicle.features && vehicle.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {vehicle.features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Prix de base</p>
                <p className="text-2xl font-bold text-primary">
                  {departure.basePricePerKg}€/kg
                </p>
              </div>

              {departure.specializedPricing && departure.specializedPricing.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Tarifs spécialisés</p>
                  <div className="space-y-1">
                    {departure.specializedPricing.map((pricing) => (
                      <p key={pricing.type} className="text-sm">
                        {pricing.type}: +{pricing.additionalPricePerKg}€/kg
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Pickup Type */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Type de point de départ</p>
              <Badge variant="outline">
                {departure.pickupType === 'both' ? 'À domicile ou sur site' : 
                 departure.pickupType === 'fixed' ? 'Sur site uniquement' :
                 'À domicile uniquement'}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/pro-transporter/edit-departure/${departure.id}`)}
                className="flex-1"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
