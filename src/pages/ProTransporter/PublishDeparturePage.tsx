import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PublishDeparturePage() {
  const { currentUser, vehicles, addDepartureOffer, getTransporterVehicles } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    pickupDeadline: '',
    selectedVehicleIds: [] as string[],
    basePricePerKg: 0,
    pickupType: 'fixed' as 'fixed' | 'pickup' | 'both',
  });

  const transporterVehicles = getTransporterVehicles(currentUser?.id || '');

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    const departure = new Date(form.departureDate);
    const deadline = new Date(form.pickupDeadline);

    if (deadline >= departure) {
      toast({
        title: 'Erreur',
        description: 'Date limite < date de départ',
        variant: 'destructive',
      });
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.selectedVehicleIds.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Sélectionner au moins 1 véhicule',
        variant: 'destructive',
      });
      return;
    }

    if (form.basePricePerKg <= 0) {
      toast({
        title: 'Erreur',
        description: 'Tarif > 0',
        variant: 'destructive',
      });
      return;
    }

    setStep(3);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalCapacity = form.selectedVehicleIds.reduce((sum, id) => {
      const vehicle = vehicles.find(v => v.id === id);
      return sum + (vehicle?.maxCapacityKg || 0);
    }, 0);

    const totalVolume = form.selectedVehicleIds.reduce((sum, id) => {
      const vehicle = vehicles.find(v => v.id === id);
      return sum + (vehicle?.maxVolumeCbm || 0);
    }, 0);

    addDepartureOffer({
      transporterId: currentUser?.id || '',
      origin: form.origin,
      destination: form.destination,
      departureDate: form.departureDate,
      pickupDeadline: form.pickupDeadline,
      totalCapacityKg: totalCapacity,
      availableCapacityKg: totalCapacity,
      totalCapacityCbm: totalVolume,
      availableCapacityCbm: totalVolume,
      basePricePerKg: form.basePricePerKg,
      pickupType: form.pickupType,
      vehicleIds: form.selectedVehicleIds,
      requiredVehicles: form.selectedVehicleIds.length,
      matchedShipments: [],
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    toast({ title: '✅ Départ publié!' });
    navigate('/dashboard/pro');
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${s < step ? 'bg-primary' : 'bg-gray-200'}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* STEP 1: Route & Dates */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Route & Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Départ</Label>
                  <Input
                    placeholder="Ex: Lyon"
                    value={form.origin}
                    onChange={e => setForm({ ...form, origin: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Arrivée</Label>
                  <Input
                    placeholder="Ex: Casablanca"
                    value={form.destination}
                    onChange={e => setForm({ ...form, destination: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de départ</Label>
                  <Input
                    type="date"
                    value={form.departureDate}
                    onChange={e => setForm({ ...form, departureDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Deadline ramassage</Label>
                  <Input
                    type="date"
                    value={form.pickupDeadline}
                    onChange={e => setForm({ ...form, pickupDeadline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Suivant
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Véhicules & Tarif */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Véhicules & Tarif</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <Label>Sélectionner véhicules</Label>
                <div className="space-y-2 mt-2 max-h-40 overflow-y-auto border rounded p-3">
                  {transporterVehicles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucun véhicule. Ajoutez-en d'abord.</p>
                  ) : (
                    transporterVehicles.map(vehicle => (
                      <div key={vehicle.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={vehicle.id}
                          checked={form.selectedVehicleIds.includes(vehicle.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setForm({
                                ...form,
                                selectedVehicleIds: [...form.selectedVehicleIds, vehicle.id],
                              });
                            } else {
                              setForm({
                                ...form,
                                selectedVehicleIds: form.selectedVehicleIds.filter(id => id !== vehicle.id),
                              });
                            }
                          }}
                        />
                        <label htmlFor={vehicle.id} className="text-sm">
                          {vehicle.brand} {vehicle.model} ({vehicle.maxCapacityKg}kg)
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <Label>Prix par kg (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.basePricePerKg}
                  onChange={e => setForm({ ...form, basePricePerKg: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button type="submit" className="flex-1">
                  Suivant
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Configuration Pickup */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <Label>Type de pickup</Label>
                <div className="space-y-3 mt-3">
                  <div className="flex items-center gap-3 p-3 border rounded hover:bg-accent/50 cursor-pointer">
                    <input
                      type="radio"
                      id="fixed"
                      value="fixed"
                      checked={form.pickupType === 'fixed'}
                      onChange={e => setForm({ ...form, pickupType: e.target.value as any })}
                    />
                    <label htmlFor="fixed" className="flex-1 cursor-pointer">
                      <p className="font-medium">Points de pickup FIXES</p>
                      <p className="text-sm text-muted-foreground">Client livre aux points configurés</p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded hover:bg-accent/50 cursor-pointer">
                    <input
                      type="radio"
                      id="pickup"
                      value="pickup"
                      checked={form.pickupType === 'pickup'}
                      onChange={e => setForm({ ...form, pickupType: e.target.value as any })}
                    />
                    <label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <p className="font-medium">Pickup À DOMICILE</p>
                      <p className="text-sm text-muted-foreground">Client se fait ramasser chez lui</p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded hover:bg-accent/50 cursor-pointer">
                    <input
                      type="radio"
                      id="both"
                      value="both"
                      checked={form.pickupType === 'both'}
                      onChange={e => setForm({ ...form, pickupType: e.target.value as any })}
                    />
                    <label htmlFor="both" className="flex-1 cursor-pointer">
                      <p className="font-medium">LES DEUX options</p>
                      <p className="text-sm text-muted-foreground">Client choisit entre fixed ou at-home</p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <Card className="bg-muted/50 border-none">
                <CardContent className="pt-6">
                  <p className="font-semibold mb-3">Résumé du départ</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Route</span>
                      <span>{form.origin} → {form.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Départ</span>
                      <span>{new Date(form.departureDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacité totale</span>
                      <span>
                        {form.selectedVehicleIds.reduce(
                          (sum, id) => sum + (vehicles.find(v => v.id === id)?.maxCapacityKg || 0),
                          0
                        )}
                        kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tarif</span>
                      <span>{form.basePricePerKg}€/kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button type="submit" variant="accent" className="flex-1">
                  Publier le départ
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
