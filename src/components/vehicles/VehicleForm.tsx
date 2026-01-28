import { useState } from 'react';
import { Vehicle, VehicleType, VehicleFeature } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VehicleFormProps {
  initialData?: Vehicle;
  onSubmit: (data: Omit<Vehicle, 'id'>) => void;
  onCancel: () => void;
  transporterId: string;
}

export default function VehicleForm({ initialData, onSubmit, onCancel, transporterId }: VehicleFormProps) {
  const [form, setForm] = useState({
    licensePlate: initialData?.licensePlate || '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    color: initialData?.color || '',
    type: (initialData?.type || 'van') as VehicleType,
    maxCapacityKg: initialData?.maxCapacityKg || 1000,
    maxVolumeCbm: initialData?.maxVolumeCbm || 5,
    features: initialData?.features || [],
    status: (initialData?.status || 'active') as 'active' | 'maintenance' | 'inactive',
  });

  const vehicleTypes: VehicleType[] = ['van', 'truck', 'trailer', 'cargo_bike', 'car'];
  const availableFeatures: VehicleFeature[] = ['gps', 'refrigerated', 'climate_control', 'tail_lift', 'pallets', 'tracking'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      transporterId,
      currentLoadKg: initialData?.currentLoadKg || 0,
      createdAt: initialData?.createdAt || new Date(),
    });
  };

  const toggleFeature = (feature: VehicleFeature) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Éditer Véhicule' : 'Ajouter Véhicule'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Plaque d'immatriculation</Label>
              <Input
                value={form.licensePlate}
                onChange={e => setForm({ ...form, licensePlate: e.target.value })}
                placeholder="XX-000-XX"
                required
              />
            </div>
            <div>
              <Label>Marque</Label>
              <Input
                value={form.brand}
                onChange={e => setForm({ ...form, brand: e.target.value })}
                placeholder="Ex: Renault"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Modèle</Label>
              <Input
                value={form.model}
                onChange={e => setForm({ ...form, model: e.target.value })}
                placeholder="Ex: Trucks T520"
                required
              />
            </div>
            <div>
              <Label>Année</Label>
              <Input
                type="number"
                value={form.year}
                onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Couleur</Label>
              <Input
                value={form.color}
                onChange={e => setForm({ ...form, color: e.target.value })}
                placeholder="Ex: Blanc"
                required
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value as VehicleType })}
                className="w-full border rounded px-3 py-2"
              >
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Capacité (kg)</Label>
              <Input
                type="number"
                value={form.maxCapacityKg}
                onChange={e => setForm({ ...form, maxCapacityKg: parseInt(e.target.value) })}
                min="100"
                required
              />
            </div>
            <div>
              <Label>Volume (m³)</Label>
              <Input
                type="number"
                step="0.1"
                value={form.maxVolumeCbm}
                onChange={e => setForm({ ...form, maxVolumeCbm: parseFloat(e.target.value) })}
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <Label>Équipements</Label>
            <div className="space-y-2 mt-2">
              {availableFeatures.map(feature => (
                <div key={feature} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={feature}
                    checked={form.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                  <label htmlFor={feature} className="text-sm capitalize">
                    {feature.replace('_', ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Statut</Label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as any })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="active">Actif</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? 'Enregistrer' : 'Ajouter'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
