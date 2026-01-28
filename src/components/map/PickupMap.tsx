import { useState } from 'react';
import { PickupLocation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PickupMapProps {
  locations: PickupLocation[];
  onAdd: (location: Omit<PickupLocation, 'id'>) => void;
  onEdit?: (location: PickupLocation) => void;
  onDelete: (locationId: string) => void;
}

export default function PickupMap({ locations, onAdd, onEdit, onDelete }: PickupMapProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 48.8566,
    longitude: 2.3522,
  });

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      toast({ title: 'Erreur', description: 'Remplissez tous les champs', variant: 'destructive' });
      return;
    }

    onAdd({
      name: formData.name,
      address: formData.address,
      coordinates: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      isActive: true,
      operatingHours: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '10:00', close: '14:00' },
        sunday: { open: 'closed', close: 'closed' },
      },
    });

    setFormData({
      name: '',
      address: '',
      latitude: 48.8566,
      longitude: 2.3522,
    });
    setShowForm(false);
    toast({ title: '✅ Point de pickup ajouté', description: 'Votre point de collecte a été créé' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Points de Pickup</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter Point
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-base">Ajouter un point de pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du point *</Label>
                <Input
                  id="name"
                  placeholder="Entrepôt Principal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète *</Label>
                <Input
                  id="address"
                  placeholder="123 Rue de la Paix, 75001 Paris"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
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

      {/* Locations List */}
      {locations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun point de pickup. Ajoutez votre premier point.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map(location => (
            <Card key={location.id} className="overflow-hidden hover:shadow-lg transition">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <CardTitle className="text-base">{location.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{location.address}</p>
                    </div>
                  </div>
                  <Badge variant={location.isActive ? 'default' : 'secondary'}>
                    {location.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs">Coordonnées</p>
                  <p className="font-mono text-xs">
                    {location.coordinates?.latitude?.toFixed(4)}, {location.coordinates?.longitude?.toFixed(4)}
                  </p>
                </div>

                {location.operatingHours && (
                  <div className="text-sm border-t pt-3">
                    <p className="text-muted-foreground text-xs font-semibold mb-2">Horaires</p>
                    <div className="space-y-1 text-xs">
                      {Object.entries(location.operatingHours).map(([day, hours]: any) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize text-muted-foreground">{day}</span>
                          <span className="font-medium">
                            {hours.open === 'closed' ? 'Fermé' : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(location)}
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Êtes-vous sûr ?')) {
                        onDelete(location.id);
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

