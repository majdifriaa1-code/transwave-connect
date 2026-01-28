import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import VehicleForm from '@/components/vehicles/VehicleForm';

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const { addVehicle, currentUser } = useApp();
  const { toast } = useToast();

  if (!currentUser?.id) {
    return <div className="min-h-screen flex items-center justify-center">Non authentifié</div>;
  }

  const handleAddVehicle = (formData: any) => {
    try {
      addVehicle(formData);
      toast({ title: '✅ Véhicule ajouté', description: 'Votre véhicule a été ajouté avec succès' });
      navigate('/vehicles');
    } catch (error) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    }
  };

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
            <CardTitle>Ajouter un véhicule</CardTitle>
            <CardDescription>
              Ajoutez un nouveau véhicule à votre flotte de transport
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VehicleForm 
              onSubmit={handleAddVehicle}
              onCancel={() => navigate('/vehicles')}
              transporterId={currentUser.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
