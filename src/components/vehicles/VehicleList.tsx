import { useState } from 'react';
import { Vehicle } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit?: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
  onAdd?: (vehicle: Omit<Vehicle, 'id'>) => void;
  onAddNew?: () => void;
}

export default function VehicleList({ vehicles, onEdit, onDelete, onAdd, onAddNew }: VehicleListProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    type: 'van' as const,
    maxCapacityKg: 1000,
    maxVolumeCbm: 5,
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand || !formData.model || !formData.licensePlate) {
      toast({ title: 'Erreur', description: 'Remplissez tous les champs obligatoires', variant: 'destructive' });
      return;
    }
    
    onAdd?.({
      ...formData,
      features: [],
      status: 'active',
      currentLoadKg: 0,
      createdAt: new Date(),
    });
    
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      type: 'van',
      maxCapacityKg: 1000,
      maxVolumeCbm: 5,
    });
    setShowForm(false);
    toast({ title: '✅ Véhicule ajouté', description: 'Votre véhicule a été ajouté avec succès' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mes Véhicules</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter Véhicule
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-base">Ajouter un nouveau véhicule</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marque *</Label>
                  <Input
                    id="brand"
                    placeholder="Renault"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modèle *</Label>
                  <Input
                    id="model"
                    placeholder="Master"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">Immatriculation *</Label>
                  <Input
                    id="licensePlate"
                    placeholder="AB-123-CD"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCapacityKg">Capacité (kg)</Label>
                  <Input
                    id="maxCapacityKg"
                    type="number"
                    value={formData.maxCapacityKg}
                    onChange={(e) => setFormData({ ...formData, maxCapacityKg: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxVolumeCbm">Volume (m³)</Label>
                  <Input
                    id="maxVolumeCbm"
                    type="number"
                    step="0.1"
                    value={formData.maxVolumeCbm}
                    onChange={(e) => setFormData({ ...formData, maxVolumeCbm: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="accent">Ajouter</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Vehicle List */}
      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun véhicule ajouté. Commencez par en ajouter un.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map(vehicle => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {vehicle.brand} {vehicle.model}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">{vehicle.licensePlate}</p>
                  </div>
                  <Badge className={getStatusColor(vehicle.status)}>{vehicle.status || 'actif'}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Type</p>
                    <p className="font-medium capitalize">{vehicle.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Année</p>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Capacité</p>
                    <p className="font-medium">{vehicle.maxCapacityKg || vehicle.capacityKg}kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Volume</p>
                    <p className="font-medium">{vehicle.maxVolumeCbm || vehicle.volume}m³</p>
                  </div>
                </div>

                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t">
                    {vehicle.features.map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(vehicle)}
                    className="flex-1"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Êtes-vous sûr ?')) {
                        onDelete(vehicle.id);
                      }
                    }}
                    className="flex-1"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

