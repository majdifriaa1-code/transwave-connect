import { useApp } from '@/context/AppContext';
import SimulatedOffersPanel from '@/components/offers/SimulatedOffersPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, User, ArrowLeft, Truck, Calendar, Package, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPro() {
  const {
    currentUser,
    shipments,
    getTransporterVehicles,
    getTransporterOffers,
    deleteVehicle,
  } = useApp();
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const transporterVehicles = getTransporterVehicles(currentUser?.id || '');
  const transporterOffers = getTransporterOffers(currentUser?.id || '');
  const availableShipments = shipments.filter(s => s.status === 'published');

  const handleAddVehicle = () => {
    navigate('/add-vehicle');
  };

  const handlePublishDeparture = () => {
    if (transporterVehicles.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez d\'abord ajouter un véhicule',
        variant: 'destructive',
      });
      return;
    }
    navigate('/pro-transporter/publish-departure');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Dashboard Header */}
      <Card className="mb-8 border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-accent">
                <AvatarImage src={currentUser?.avatarUrl} />
                <AvatarFallback className="bg-primary text-white text-xl">
                  {currentUser?.fullName?.charAt(0) || 'P'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary">
                  Bienvenue, {currentUser?.fullName || 'Transporteur Pro'} 🚛
                </h1>
                <p className="text-muted-foreground">
                  Gérez votre flotte, vos trajets et trouvez des clients
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/messages">
                <Button variant="outline" size="sm" className="relative">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Messages
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-1" />
                Profil
              </Button>
              <Badge className="bg-orange-500">Transporteur Pro</Badge>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{transporterVehicles.length}</div>
            <p className="text-sm text-muted-foreground">Véhicules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{transporterOffers.length}</div>
            <p className="text-sm text-muted-foreground">Départs actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {transporterOffers.reduce((sum, o) => sum + o.matchedShipments.length, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Colis matchés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">
              {transporterVehicles.reduce((sum, v) => sum + v.maxCapacityKg, 0).toLocaleString()}
              <span className="text-sm ml-1">kg</span>
            </div>
            <p className="text-sm text-muted-foreground">Capacité totale</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
          <TabsTrigger value="departures">Départs</TabsTrigger>
          <TabsTrigger value="offers">Offres</TabsTrigger>
          <TabsTrigger value="shipments">Colis</TabsTrigger>
        </TabsList>

        {/* VEHICLES TAB */}
        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ma Flotte de Véhicules</CardTitle>
                <CardDescription>Gérez vos véhicules et leur capacité</CardDescription>
              </div>
              <Link to="/vehicles">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Gérer véhicules
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {transporterVehicles.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-4">Aucun véhicule</p>
                  <p className="text-muted-foreground mb-6">
                    Commencez par ajouter un véhicule à votre flotte
                  </p>
                  <Button onClick={handleAddVehicle} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter mon premier véhicule
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {transporterVehicles.map(vehicle => (
                    <Card key={vehicle.id} className="overflow-hidden hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">
                              {vehicle.brand} {vehicle.model}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {vehicle.licensePlate.toUpperCase()} • {vehicle.year} • {vehicle.color}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{vehicle.type}</Badge>
                              <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                                {vehicle.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 md:w-auto text-sm">
                            <div>
                              <p className="text-muted-foreground">Capacité</p>
                              <p className="font-bold">{vehicle.maxCapacityKg} kg</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Volume</p>
                              <p className="font-bold">{vehicle.maxVolumeCbm} m³</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/edit-vehicle/${vehicle.id}`)}
                            >
                              Éditer
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteVehicle(vehicle.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full" onClick={handleAddVehicle}>
                    Ajouter un autre véhicule
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEPARTURES TAB */}
        <TabsContent value="departures" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mes Départs Publiés</CardTitle>
                <CardDescription>Trajets disponibles pour vos clients</CardDescription>
              </div>
              <Button onClick={handlePublishDeparture} className="gap-2">
                <Calendar className="h-4 w-4" />
                Publier Départ
              </Button>
            </CardHeader>
            <CardContent>
              {transporterOffers.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucun départ publié</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={handlePublishDeparture}>
                    Publier votre premier départ
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {transporterOffers.map(offer => (
                    <Card key={offer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">
                              {offer.origin} → {offer.destination}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Départ: {new Date(offer.departureDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={offer.status === 'published' ? 'default' : 'secondary'}>
                            {offer.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">Capacité</p>
                            <p className="font-bold">
                              {offer.availableCapacityKg}/{offer.totalCapacityKg}kg
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tarif</p>
                            <p className="font-bold">{offer.basePricePerKg}€/kg</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pickup</p>
                            <p className="font-bold capitalize">{offer.pickupType}</p>
                          </div>
                        </div>
                        {offer.matchedShipments.length > 0 && (
                          <div className="p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-800 dark:text-green-100 mb-3">
                            ✅ {offer.matchedShipments.length} colis matchés
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Voir détails
                          </Button>
                          <Button size="sm" variant="ghost">
                            Modifier
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* OFFERS TAB */}
        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Offres d'Expédition Disponibles</CardTitle>
              <CardDescription>
                Clients en attente de transporteurs pour leurs colis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimulatedOffersPanel />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SHIPMENTS TAB */}
        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Colis à Transporter</CardTitle>
              <CardDescription>
                Vos colis publiés et en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableShipments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableShipments.slice(0, 6).map(shipment => (
                    <Card key={shipment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold">{shipment.origin} → {shipment.destination}</h4>
                          <Badge variant="outline">{shipment.weightKg}kg</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{shipment.description}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Détails
                          </Button>
                          <Button size="sm">Prendre</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucun colis disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
