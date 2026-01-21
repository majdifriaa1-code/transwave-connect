import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShipmentCard } from '@/components/shipments/ShipmentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageSquare, User, Plane, ArrowLeft, Plus, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CUSTOMS_CATEGORIES, isMaghrebDestination } from '@/data/mockData';
import { TransportType } from '@/types';

export default function DashboardCitizenTransport() {
  const { currentUser, shipments, addTrip, showKycModal, setShowKycModal } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [flightForm, setFlightForm] = useState({
    origin: '',
    destination: '',
    date: '',
    flightNumber: '',
    capacity: '',
    price: '',
  });

  // Get available shipment requests
  const availableShipments = shipments.filter(s => s.status === 'published');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlightForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();

    // Check KYC status
    if (currentUser?.kycStatus !== 'verified') {
      setShowKycModal(true);
      return;
    }

    addTrip({
      transporterId: currentUser?.id || '',
      transporterName: currentUser?.fullName || 'Voyageur',
      transporterAvatar: currentUser?.avatarUrl,
      origin: flightForm.origin,
      destination: flightForm.destination,
      departureDate: new Date(flightForm.date).toISOString(),
      transportType: 'plane' as TransportType,
      totalCapacityKg: parseInt(flightForm.capacity),
      availableCapacityKg: parseInt(flightForm.capacity),
      pricePerKg: parseInt(flightForm.price),
      currency: 'EUR',
      status: 'scheduled',
      flightNumber: flightForm.flightNumber,
      isPro: false,
    });

    toast({
      title: '✈️ Vol ajouté avec succès !',
      description: 'Votre vol est maintenant visible pour les expéditeurs.',
    });

    setFlightForm({
      origin: '',
      destination: '',
      date: '',
      flightNumber: '',
      capacity: '',
      price: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Dashboard Header */}
      <Card className="mb-8 border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-primary">
                <AvatarImage src={currentUser?.avatarUrl} />
                <AvatarFallback className="bg-accent text-white text-xl">
                  {currentUser?.fullName?.charAt(0) || 'V'}
                </AvatarFallback>
              </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-primary">
                    Bienvenue, {currentUser?.fullName || 'Voyageur'} ✈️
                  </h1>
                  <p className="text-muted-foreground">
                    Ajoutez vos vols et consultez les demandes d'expédition
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link to="/messages">
                  <Button variant="icon" size="icon" className="relative">
                    <MessageSquare className="h-5 w-5" />
                    <span className="notification-dot">2</span>
                  </Button>
                </Link>
                <Button variant="icon" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <Badge variant="secondary" className="bg-primary-pale text-primary border-primary/20">
                  Transporteur Citoyen
                </Badge>
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Retour
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Flight Form */}
        <section className="mb-10">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Plane className="h-6 w-6" />
                Ajouter un Vol
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFlight} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="form-label">
                      Ville de Départ <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="origin"
                      placeholder="Ex: Paris"
                      value={flightForm.origin}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="form-label">
                      Ville d'Arrivée <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="destination"
                      placeholder="Ex: Casablanca"
                      value={flightForm.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="form-label">
                      Date du Vol <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="date"
                      type="date"
                      value={flightForm.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="form-label">
                      Numéro de Vol <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="flightNumber"
                      placeholder="Ex: AF1234"
                      value={flightForm.flightNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="form-label">
                      Espace Disponible (kg) <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="capacity"
                      type="number"
                      placeholder="Ex: 15"
                      min="1"
                      value={flightForm.capacity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="form-label">
                      Prix Proposé (€/kg) <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="price"
                      type="number"
                      placeholder="Ex: 12"
                      min="1"
                      value={flightForm.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="accent" size="lg" className="w-full md:w-auto">
                  <Plus className="h-5 w-5 mr-2" />
                  Publier le Vol
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Available Shipment Requests */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Plane className="h-6 w-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold text-primary">
              Demandes d'Expédition
            </h2>
          </div>

          {availableShipments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableShipments.map(shipment => (
                <ShipmentCard
                  key={shipment.id}
                  shipment={shipment}
                  onAccept={() => {
                    toast({
                      title: '✅ Demande acceptée !',
                      description: 'Le client va être notifié.',
                    });
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Plane className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">
                Aucune demande d'expédition pour le moment.
              </p>
            </Card>
          )}
        </section>
      </div>
    );
  }
