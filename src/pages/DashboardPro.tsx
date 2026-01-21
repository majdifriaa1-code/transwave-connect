import { useApp } from '@/context/AppContext';
import { TripCard } from '@/components/trips/TripCard';
import { ShipmentCard } from '@/components/shipments/ShipmentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, User, Package, ArrowLeft, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPro() {
  const { currentUser, shipments, trips } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get available shipment requests
  const availableShipments = shipments.filter(s => s.status === 'published');

  const handleAcceptShipment = (shipmentId: string) => {
    toast({
      title: '✅ Demande acceptée !',
      description: 'Le client va être notifié. Consultez vos messages.',
    });
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
                  Gérez vos trajets et trouvez des opportunités de transport
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/messages">
                <Button variant="icon" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  <span className="notification-dot">3</span>
                </Button>
              </Link>
              <Button variant="icon" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Badge className="badge-orange">Transporteur Pro</Badge>
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

      {/* Available Shipment Requests */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Package className="h-6 w-6 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold text-primary">
            Offres d'Expédition Disponibles
          </h2>
        </div>

        {availableShipments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableShipments.map(shipment => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onAccept={() => handleAcceptShipment(shipment.id)}
                onViewDetails={() => navigate(`/shipment/${shipment.id}`)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Truck className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">
              Aucune demande d'expédition disponible pour le moment.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Revenez plus tard pour découvrir de nouvelles opportunités !
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
