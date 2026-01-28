import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { Vehicle } from '@/types';

export default function EditVehiclePage() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const { vehicles, updateVehicle, currentUser } = useApp();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (vehicleId) {
      const found = vehicles.find(v => v.id === vehicleId);
      if (found) {
        setVehicle(found);
      } else {
        toast({ title: 'Erreur', description: 'Véhicule introuvable', variant: 'destructive' });
        navigate('/dashboard-pro');
      }
    }
  }, [vehicleId, vehicles, navigate, toast]);

  const handleUpdateVehicle = (formData: any) => {
    if (!vehicleId) return;

    try {
      updateVehicle(vehicleId, {
        ...formData,
      });
      toast({ title: '✅ Véhicule mis à jour', description: 'Vos modifications ont été sauvegardées' });
      navigate('/vehicles');
    } catch (error) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    }
  };

  if (!vehicle) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Button variant="ghost" onClick={() => navigate('/vehicles')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la gestion
        </Button>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle>Modifier le véhicule</CardTitle>
            <CardDescription>
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VehicleForm
              initialData={vehicle}
              onSubmit={handleUpdateVehicle}
              onCancel={() => navigate('/vehicles')}
              transporterId={vehicle.transporterId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
