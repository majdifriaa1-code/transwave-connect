import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';
import { TripCard } from '@/components/trips/TripCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { MessageSquare, User, Package, ArrowLeft, Plus, AlertTriangle, Plane, Truck, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CUSTOMS_CATEGORIES, isMaghrebDestination, MOCK_TRIPS } from '@/data/mockData';
import { ShipmentType } from '@/types';

export default function DashboardCitizenSender() {
  const { currentUser, trips, addShipment, calculatePricing } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [shipmentForm, setShipmentForm] = useState({
    origin: '',
    destination: '',
    date: '',
    category: '',
    description: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    value: '',
    price: '',
    type: 'standard' as ShipmentType,
  });

  const [showCustomsWarning, setShowCustomsWarning] = useState(false);
  const [customsTaxRate, setCustomsTaxRate] = useState(0);

  // Get available trips
  const availableTrips = trips.filter(t => t.status === 'scheduled' && t.availableCapacityKg > 0);
  const proTrips = availableTrips.filter(t => t.isPro);
  const citizenTrips = availableTrips.filter(t => !t.isPro);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShipmentForm(prev => ({ ...prev, [name]: value }));

    // Check for customs warning when destination changes
    if (name === 'destination') {
      checkCustomsWarning(shipmentForm.category, value);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setShipmentForm(prev => ({ ...prev, category: categoryId }));
    checkCustomsWarning(categoryId, shipmentForm.destination);
  };

  const handleTypeChange = (type: ShipmentType) => {
    setShipmentForm(prev => ({ ...prev, type }));
  };

  const checkCustomsWarning = (categoryId: string, destination: string) => {
    const category = CUSTOMS_CATEGORIES.find(c => c.id === categoryId);
    if (category && category.estimatedTaxRate > 0 && isMaghrebDestination(destination)) {
      setShowCustomsWarning(true);
      setCustomsTaxRate(category.estimatedTaxRate * 100);
    } else {
      setShowCustomsWarning(false);
      setCustomsTaxRate(0);
    }
  };

  const handleSubmitShipment = (e: React.FormEvent) => {
    e.preventDefault();

    addShipment({
      senderId: currentUser?.id || '',
      senderName: currentUser?.fullName,
      origin: shipmentForm.origin,
      destination: shipmentForm.destination,
      itemCategory: shipmentForm.category,
      description: shipmentForm.description,
      weightKg: parseFloat(shipmentForm.weight),
      dimensions: `${shipmentForm.length}x${shipmentForm.width}x${shipmentForm.height}`,
      declaredValue: parseFloat(shipmentForm.value),
      photos: [],
      status: 'published',
      type: shipmentForm.type,
      preferredDate: shipmentForm.date,
      proposedPrice: shipmentForm.type === 'solidarity' ? 0 : parseFloat(shipmentForm.price),
    });

    toast({
      title: '📦 Demande publiée !',
      description: 'Les transporteurs vont maintenant pouvoir voir votre demande.',
    });

    // Reset form
    setShipmentForm({
      origin: '',
      destination: '',
      date: '',
      category: '',
      description: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      value: '',
      price: '',
      type: 'standard',
    });
    setShowCustomsWarning(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Header */}
        <Card className="mb-8 border-2">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-accent">
                  <AvatarImage src={currentUser?.avatarUrl} />
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {currentUser?.fullName?.charAt(0) || 'E'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-primary">
                    Bienvenue, {currentUser?.fullName || 'Expéditeur'} 📦
                  </h1>
                  <p className="text-muted-foreground">
                    Trouvez des transporteurs pour vos colis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link to="/messages">
                  <Button variant="icon" size="icon" className="relative">
                    <MessageSquare className="h-5 w-5" />
                    <span className="notification-dot">1</span>
                  </Button>
                </Link>
                <Button variant="icon" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <Badge variant="secondary">Expéditeur</Badge>
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

        {/* Create Shipment Form */}
        <section className="mb-10">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Package className="h-6 w-6" />
                Créer une Demande d'Expédition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitShipment} className="space-y-6">
                {/* Shipment Type Toggle */}
                <div className="flex gap-4 mb-6">
                  <Button
                    type="button"
                    variant={shipmentForm.type === 'standard' ? 'default' : 'outline'}
                    onClick={() => handleTypeChange('standard')}
                  >
                    Standard
                  </Button>
                  <Button
                    type="button"
                    variant={shipmentForm.type === 'solidarity' ? 'success' : 'outline'}
                    onClick={() => handleTypeChange('solidarity')}
                    className="gap-2"
                  >
                    ❤️ Solidaire (Gratuit)
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="form-label">
                      Ville de Départ <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="origin"
                      placeholder="Ex: Paris"
                      value={shipmentForm.origin}
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
                      value={shipmentForm.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="form-label">
                      Date Souhaitée <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="date"
                      type="date"
                      value={shipmentForm.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="form-label">
                      Type de Colis <span className="text-accent">*</span>
                    </Label>
                    <Select value={shipmentForm.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        {CUSTOMS_CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="form-label">
                      Poids (kg) <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="weight"
                      type="number"
                      placeholder="Ex: 2.5"
                      min="0.1"
                      step="0.1"
                      value={shipmentForm.weight}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="form-label">
                      Valeur Déclarée (€) <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="value"
                      type="number"
                      placeholder="Ex: 150"
                      min="1"
                      value={shipmentForm.value}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Customs Warning */}
                {showCustomsWarning && (
                  <Alert className="border-warning bg-warning/10">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <AlertTitle className="text-warning-foreground font-bold">
                      Attention: Frais de douane estimés
                    </AlertTitle>
                    <AlertDescription>
                      Les frais de douane estimés sont d'environ <strong>{customsTaxRate}%</strong> de la valeur déclarée pour cette catégorie vers le Maghreb.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Dimensions */}
                <div className="space-y-2">
                  <Label className="form-label">
                    Dimensions du Colis (cm) <span className="text-accent">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Input
                        name="length"
                        type="number"
                        placeholder="Longueur"
                        min="1"
                        value={shipmentForm.length}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="text-muted-foreground text-sm">cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        name="width"
                        type="number"
                        placeholder="Largeur"
                        min="1"
                        value={shipmentForm.width}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="text-muted-foreground text-sm">cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        name="height"
                        type="number"
                        placeholder="Hauteur"
                        min="1"
                        value={shipmentForm.height}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="text-muted-foreground text-sm">cm</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="form-label">Description</Label>
                  <Textarea
                    name="description"
                    placeholder="Décrivez votre colis..."
                    value={shipmentForm.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                {/* Photo Upload (visual only) */}
                <div className="space-y-2">
                  <Label className="form-label">
                    Photo de la Marchandise <span className="text-accent">*</span>
                  </Label>
                  <div className="file-upload-zone">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      <strong className="text-primary">Cliquez pour ajouter une photo</strong>
                      <br />
                      <small>Format : JPG, PNG (Max 5MB)</small>
                    </p>
                  </div>
                </div>

                {/* Price (only for standard) */}
                {shipmentForm.type === 'standard' && (
                  <div className="space-y-2">
                    <Label className="form-label">
                      Prix Proposé (€) <span className="text-accent">*</span>
                    </Label>
                    <Input
                      name="price"
                      type="number"
                      placeholder="Ex: 30"
                      min="1"
                      value={shipmentForm.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                <Button type="submit" variant="accent" size="lg" className="w-full md:w-auto">
                  <Plus className="h-5 w-5 mr-2" />
                  Publier la Demande
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Available Pro Transporters */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="h-6 w-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold text-primary">
              Transporteurs Professionnels
            </h2>
          </div>

          {proTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proTrips.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onBook={() => navigate(`/booking/${trip.id}`)}
                  onContact={() => navigate('/messages')}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              Aucun transporteur professionnel disponible actuellement.
            </Card>
          )}
        </section>

        {/* Available Citizen Travelers */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Plane className="h-6 w-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold text-primary">
              Vols de Transporteurs Citoyens
            </h2>
          </div>

          {citizenTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {citizenTrips.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onBook={() => navigate(`/booking/${trip.id}`)}
                  onContact={() => navigate('/messages')}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              Aucun vol disponible pour le moment. Revenez plus tard!
            </Card>
          )}
        </section>
      </div>
    </Layout>
  );
}
