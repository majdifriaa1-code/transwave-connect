import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  QrCode, 
  Plane, 
  Ship, 
  Truck,
  Calendar,
  Package,
  Shield,
  ArrowRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { MOCK_TRIPS } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function BookingPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { calculatePricing } = useApp();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [weight, setWeight] = useState('5');
  const [isSolidarity, setIsSolidarity] = useState(false);
  const [qrToken, setQrToken] = useState('');

  // Find the trip
  const trip = MOCK_TRIPS.find(t => t.id === tripId);

  if (!trip) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Trajet non trouvé</h1>
          <Link to="/">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const pricing = calculatePricing(parseFloat(weight) || 0, trip.pricePerKg, isSolidarity);

  const getTransportIcon = () => {
    switch (trip.transportType) {
      case 'plane':
        return <Plane className="h-6 w-6" />;
      case 'boat':
        return <Ship className="h-6 w-6" />;
      case 'road':
        return <Truck className="h-6 w-6" />;
    }
  };

  const handleProceedToPayment = () => {
    setStep(2);
    toast({
      title: '🔒 Paiement Sécurisé',
      description: 'Vos fonds seront conservés en escrow jusqu\'à la livraison.',
    });
  };

  const handleConfirmPayment = () => {
    // Generate QR token
    const token = `TW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setQrToken(token);
    setStep(3);
    toast({
      title: '✅ Paiement Confirmé !',
      description: 'Les fonds sont maintenant en escrow.',
    });
  };

  const steps = [
    { num: 1, label: 'Détails', icon: Package },
    { num: 2, label: 'Paiement', icon: Lock },
    { num: 3, label: 'QR Code', icon: QrCode },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, index) => (
            <div key={s.num} className="flex items-center">
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  step >= s.num 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-muted-foreground border-secondary'
                }`}
              >
                {step > s.num ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <s.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`ml-2 font-medium hidden sm:inline ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 md:w-24 h-0.5 mx-3 ${step > s.num ? 'bg-primary' : 'bg-secondary'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Review & Weight */}
        {step === 1 && (
          <Card className="border-2 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Package className="h-6 w-6" />
                Récapitulatif de la Réservation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trip Info */}
              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`transport-${trip.transportType} p-3 rounded-lg`}>
                    {getTransportIcon()}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{trip.origin} → {trip.destination}</p>
                    <p className="text-muted-foreground text-sm">
                      Transporteur: {trip.transporterName}
                    </p>
                  </div>
                  {trip.isPro && <Badge className="badge-pro ml-auto">PRO</Badge>}
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {new Date(trip.departureDate).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    {trip.availableCapacityKg} kg disponibles
                  </div>
                </div>
              </div>

              {/* Weight Input */}
              <div className="space-y-2">
                <Label className="form-label">Poids de votre colis (kg)</Label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0.1"
                  max={trip.availableCapacityKg}
                  step="0.1"
                  className="max-w-xs"
                />
              </div>

              {/* Solidarity Toggle */}
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="solidarity" 
                  checked={isSolidarity}
                  onChange={(e) => setIsSolidarity(e.target.checked)}
                  className="h-5 w-5 accent-success"
                />
                <Label htmlFor="solidarity" className="cursor-pointer">
                  ❤️ Envoi Solidaire (Médicaments, aide humanitaire - Gratuit)
                </Label>
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="p-5 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
                <h3 className="font-bold text-lg mb-4">Détail du Prix</h3>
                {pricing.isSolidarity ? (
                  <div className="text-center py-4">
                    <span className="text-3xl font-bold text-success">GRATUIT</span>
                    <p className="text-muted-foreground mt-2">Merci pour votre geste solidaire ❤️</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rémunération transporteur</span>
                      <span className="font-medium">{pricing.transporterPayout.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frais de plateforme (15%)</span>
                      <span className="font-medium">{pricing.platformFee.toFixed(2)} €</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-accent">{pricing.totalPrice.toFixed(2)} €</span>
                    </div>
                  </div>
                )}
              </div>

              <Button variant="accent" size="xl" className="w-full" onClick={handleProceedToPayment}>
                Continuer vers le paiement
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Escrow Payment */}
        {step === 2 && (
          <Card className="border-2 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lock className="h-6 w-6" />
                Paiement Sécurisé (Escrow)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Escrow Explanation */}
              <div className="p-5 bg-primary/5 rounded-xl border-2 border-primary/20">
                <div className="flex items-start gap-3">
                  <Shield className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-primary mb-2">Fonds conservés en toute sécurité</h4>
                    <p className="text-sm text-muted-foreground">
                      Vos fonds seront conservés par Transwave jusqu'à confirmation de la livraison. 
                      Le transporteur ne recevra le paiement qu'après le scan du QR Code de confirmation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-5 bg-muted rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Montant à payer</span>
                  <span className="text-2xl font-bold text-accent">
                    {pricing.isSolidarity ? 'GRATUIT' : `${pricing.totalPrice.toFixed(2)} €`}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  🔒 Transaction sécurisée par Transwave
                </p>
              </div>

              {/* Mock Payment Form */}
              {!pricing.isSolidarity && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Numéro de carte</Label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expiration</Label>
                      <Input placeholder="MM/AA" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input placeholder="123" type="password" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Retour
                </Button>
                <Button variant="success" size="lg" className="flex-1" onClick={handleConfirmPayment}>
                  <Lock className="h-5 w-5 mr-2" />
                  {pricing.isSolidarity ? 'Confirmer' : 'Payer et Confirmer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: QR Code */}
        {step === 3 && (
          <Card className="border-2 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-success">
                <CheckCircle2 className="h-6 w-6" />
                Réservation Confirmée !
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              {/* QR Code */}
              <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border-2">
                <QRCodeSVG 
                  value={qrToken} 
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>

              <div>
                <p className="text-lg font-medium mb-1">Code de confirmation</p>
                <code className="text-primary font-mono text-xl bg-primary/10 px-4 py-2 rounded-lg">
                  {qrToken}
                </code>
              </div>

              {/* Instructions */}
              <div className="p-5 bg-muted rounded-xl text-left">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  📋 Instructions
                </h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Téléchargez ou imprimez ce QR code</li>
                  <li>2. Collez-le visiblement sur votre colis</li>
                  <li>3. Le transporteur scannera ce code lors de la réception</li>
                  <li>4. Vous recevrez une notification de confirmation</li>
                  <li>5. Les fonds seront libérés au transporteur après livraison</li>
                </ol>
              </div>

              <div className="flex gap-4 flex-wrap justify-center">
                <Button variant="outline" onClick={() => {}}>
                  📥 Télécharger le QR Code
                </Button>
                <Link to="/">
                  <Button variant="hero">
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
