import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Truck, AlertCircle, ArrowLeft } from 'lucide-react';

export default function VehicleManagementPage() {
  const navigate = useNavigate();
  const { currentUser, getTransporterVehicles, deleteVehicle } = useApp();
  const { toast } = useToast();
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  if (!currentUser?.id) {
    return <div className="min-h-screen flex items-center justify-center">Non authentifié</div>;
  }

  const transporterVehicles = getTransporterVehicles(currentUser.id);

  const handleDeleteVehicle = () => {
    if (vehicleToDelete) {
      try {
        deleteVehicle(vehicleToDelete);
        toast({
          title: '✅ Véhicule supprimé',
          description: 'Le véhicule a été supprimé avec succès',
        });
        setVehicleToDelete(null);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la suppression',
          variant: 'destructive',
        });
      }
    }
  };

  const getVehicleTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      van: 'Fourgonnette',
      truck: 'Camion',
      trailer: 'Remorque',
      cargo_bike: 'Vélo cargo',
      car: 'Voiture',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'active':
        return 'default';
      case 'maintenance':
        return 'secondary';
      case 'inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      active: 'Actif',
      maintenance: 'Maintenance',
      inactive: 'Inactif',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard-pro')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Tableau de bord
          </Button>
          <h1 className="text-2xl font-bold">Gestion des véhicules</h1>
          <Button onClick={() => navigate('/add-vehicle')} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter véhicule
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {transporterVehicles.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Truck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun véhicule</h3>
              <p className="text-muted-foreground mb-6">
                Commencez par ajouter un véhicule à votre flotte
              </p>
              <Button onClick={() => navigate('/add-vehicle')} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter mon premier véhicule
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">{transporterVehicles.length}</div>
                  <p className="text-sm text-muted-foreground">Véhicules au total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {transporterVehicles.filter(v => v.status === 'active').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Actuellement actifs</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {transporterVehicles.reduce((sum, v) => sum + v.maxCapacityKg, 0).toLocaleString()}
                    kg
                  </div>
                  <p className="text-sm text-muted-foreground">Capacité totale</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">
                    {transporterVehicles.reduce((sum, v) => sum + v.maxVolumeCbm, 0).toFixed(1)}
                    m³
                  </div>
                  <p className="text-sm text-muted-foreground">Volume total</p>
                </CardContent>
              </Card>
            </div>

            {/* Vehicles List */}
            <div className="space-y-4">
              {transporterVehicles.map(vehicle => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Vehicle Info */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.licensePlate.toUpperCase()} • {vehicle.year}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{getVehicleTypeLabel(vehicle.type)}</Badge>
                          <Badge variant={getStatusColor(vehicle.status)}>
                            {getStatusLabel(vehicle.status)}
                          </Badge>
                          {vehicle.color && (
                            <Badge variant="secondary" className="gap-2">
                              <div
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: vehicle.color || '#666' }}
                              />
                              {vehicle.color}
                            </Badge>
                          )}
                        </div>

                        {/* Features */}
                        {vehicle.features && vehicle.features.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">
                              Équipements
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {vehicle.features.map(feature => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature === 'gps' && '📍 GPS'}
                                  {feature === 'refrigerated' && '❄️ Réfrigéré'}
                                  {feature === 'climate_control' && '🌡️ Climatisation'}
                                  {feature === 'tail_lift' && '📦 Hayon'}
                                  {feature === 'pallets' && '🏪 Palettes'}
                                  {feature === 'tracking' && '🔍 Suivi'}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Capacity & Actions */}
                      <div className="space-y-4">
                        {/* Capacity Stats */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground">Capacité poids</p>
                            <p className="text-lg font-bold">{vehicle.maxCapacityKg.toLocaleString()} kg</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Utilisé: {vehicle.currentLoadKg} kg
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Capacité volume</p>
                            <p className="text-lg font-bold">{vehicle.maxVolumeCbm.toFixed(1)} m³</p>
                          </div>
                        </div>

                        {/* Documents Info */}
                        {vehicle.technicalInspection && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                            <p className="font-medium text-blue-900 dark:text-blue-100">
                              Contrôle technique valide jusqu'au {new Date(vehicle.technicalInspection.validUntil).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {vehicle.status !== 'active' && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm flex gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-amber-900 dark:text-amber-100">
                              Ce véhicule n'est pas disponible pour les départs
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/edit-vehicle/${vehicle.id}`)}
                            className="flex-1 gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Éditer
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setVehicleToDelete(vehicle.id)}
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!vehicleToDelete} onOpenChange={open => !open && setVehicleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Supprimer ce véhicule?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le véhicule sera supprimé de votre flotte.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVehicle} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
