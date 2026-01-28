import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { PickupLocation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, MapPin, ArrowLeft, Clock } from 'lucide-react';

export default function PickupManagementPage() {
  const navigate = useNavigate();
  const { currentUser, pickupLocations, addPickupLocation, updatePickupLocation, deletePickupLocation } = useApp();
  const { toast } = useToast();
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    openMonday: '08:00',
    closeMonday: '18:00',
    openTuesday: '08:00',
    closeTuesday: '18:00',
    openWednesday: '08:00',
    closeWednesday: '18:00',
    openThursday: '08:00',
    closeThursday: '18:00',
    openFriday: '08:00',
    closeFriday: '18:00',
    openSaturday: '09:00',
    closeSaturday: '17:00',
    openSunday: 'closed',
    closeSunday: 'closed',
  });

  const handleAddLocation = () => {
    if (!form.name || !form.address) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    const newLocation: PickupLocation = {
      id: `pickup_${Date.now()}`,
      name: form.name,
      address: form.address,
      coordinates: {
        latitude: form.latitude,
        longitude: form.longitude,
      },
      isActive: true,
      operatingHours: {
        monday: { open: form.openMonday, close: form.closeMonday },
        tuesday: { open: form.openTuesday, close: form.closeTuesday },
        wednesday: { open: form.openWednesday, close: form.closeWednesday },
        thursday: { open: form.openThursday, close: form.closeThursday },
        friday: { open: form.openFriday, close: form.closeFriday },
        saturday: { open: form.openSaturday, close: form.closeSaturday },
        sunday: { open: form.openSunday, close: form.closeSunday },
      },
    };

    try {
      addPickupLocation(newLocation);
      toast({
        title: '✅ Point de pickup créé',
        description: 'Le point de pickup a été créé avec succès',
      });
      resetForm();
      setIsAddingLocation(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteLocation = () => {
    if (locationToDelete) {
      try {
        deletePickupLocation(locationToDelete);
        toast({
          title: '✅ Point supprimé',
          description: 'Le point de pickup a été supprimé',
        });
        setLocationToDelete(null);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      openMonday: '08:00',
      closeMonday: '18:00',
      openTuesday: '08:00',
      closeTuesday: '18:00',
      openWednesday: '08:00',
      closeWednesday: '18:00',
      openThursday: '08:00',
      closeThursday: '18:00',
      openFriday: '08:00',
      closeFriday: '18:00',
      openSaturday: '09:00',
      closeSaturday: '17:00',
      openSunday: 'closed',
      closeSunday: 'closed',
    });
    setEditingId(null);
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
          <h1 className="text-2xl font-bold">Points de pickup</h1>
          <Button onClick={() => setIsAddingLocation(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter point
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Add Form */}
        {isAddingLocation && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ajouter un point de pickup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom du point</Label>
                  <Input
                    placeholder="Ex: Entrepôt Paris"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Adresse</Label>
                  <Input
                    placeholder="Ex: 123 Rue de la Paix, Paris"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="48.8566"
                    value={form.latitude}
                    onChange={e => setForm({ ...form, latitude: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="2.3522"
                    value={form.longitude}
                    onChange={e => setForm({ ...form, longitude: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-3">Horaires d'ouverture</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, i) => {
                    const dayKey = day.toLowerCase() as keyof typeof form;
                    const openKey = `open${day}` as keyof typeof form;
                    const closeKey = `close${day}` as keyof typeof form;
                    return (
                      <div key={day} className="p-3 bg-muted rounded">
                        <p className="font-sm font-medium mb-2">{day}</p>
                        <div className="flex gap-2">
                          <Input
                            type="time"
                            value={form[openKey] as string}
                            onChange={e => setForm({ ...form, [openKey]: e.target.value })}
                            className="h-8 text-sm"
                          />
                          <Input
                            type="time"
                            value={form[closeKey] as string}
                            onChange={e => setForm({ ...form, [closeKey]: e.target.value })}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddLocation} className="flex-1">
                  Créer
                </Button>
                <Button variant="outline" onClick={() => { setIsAddingLocation(false); resetForm(); }} className="flex-1">
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Locations List */}
        {pickupLocations.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun point de pickup</h3>
              <p className="text-muted-foreground mb-6">
                Créez votre premier point de pickup
              </p>
              <Button onClick={() => setIsAddingLocation(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer un point
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pickupLocations.map(location => (
              <Card key={location.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{location.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location.address}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Coord: {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
                      </p>
                    </div>
                    <Badge variant={location.isActive ? 'default' : 'secondary'}>
                      {location.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>

                  {/* Operating Hours Summary */}
                  <div className="bg-muted/50 rounded p-3 mb-4">
                    <p className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      Horaires
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {Object.entries(location.operatingHours).map(([day, hours]) => (
                        <div key={day}>
                          <p className="font-medium capitalize">{day}</p>
                          <p className="text-muted-foreground">
                            {hours.open === 'closed' ? 'Fermé' : `${hours.open}-${hours.close}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Éditer
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setLocationToDelete(location.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!locationToDelete} onOpenChange={open => !open && setLocationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Supprimer ce point?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le point de pickup sera supprimé.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLocation} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
