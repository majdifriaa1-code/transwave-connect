import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Lock, User, MapPin, ArrowRight, Truck, FileCheck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProRegistrationData, TransportSpecialization } from '@/types';
import { validatePassword, validateEmail } from '@/utils/transporterUtils';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login, registerProTransporter } = useApp();
  const { toast } = useToast();

  // Main state
  const [userType, setUserType] = useState<'citizen' | 'pro_transporter'>('citizen');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Citizen registration
  const [citizenData, setCitizenData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  // Professional registration
  const [proData, setProData] = useState<Partial<ProRegistrationData>>({
    fullName: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    rib: '',
    idType: 'passport',
    idNumber: '',
    idIssueDate: new Date().toISOString().split('T')[0],
    idExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    idPhotoBase64: '',
    kbisNumber: '',
    kbisRegistrationDate: new Date().toISOString().split('T')[0],
    companyName: '',
    kbisPhotoBase64: '',
    specializations: [],
    serviceArea: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Citizen handlers
  const handleCitizenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCitizenData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(citizenData.email)) {
      toast({ title: 'Erreur', description: 'Email invalide', variant: 'destructive' });
      return;
    }

    const pwValidation = validatePassword(citizenData.password);
    if (!pwValidation.valid) {
      toast({ title: 'Erreur', description: pwValidation.errors[0], variant: 'destructive' });
      return;
    }

    if (citizenData.password !== citizenData.confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(citizenData.email, citizenData.password);
      if (success) {
        toast({ title: '✅ Compte créé !', description: 'Bienvenue sur Transwave' });
        navigate('/');
      }
    } catch (error) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Professional handlers
  const handleProChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSpecialization = (spec: TransportSpecialization) => {
    setProData(prev => {
      const specializations = (prev.specializations || []).includes(spec)
        ? prev.specializations!.filter(s => s !== spec)
        : [...(prev.specializations || []), spec];
      return { ...prev, specializations };
    });
  };

  const handleProFileUpload = (field: 'idPhotoBase64' | 'kbisPhotoBase64', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProData(prev => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleProSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userType === 'citizen') {
      await handleCitizenSubmit(e);
      return;
    }

    // Professional validation
    if (!validateEmail(proData.email || '')) {
      toast({ title: 'Erreur', description: 'Email invalide', variant: 'destructive' });
      return;
    }

    const pwValidation = validatePassword(proData.password || '');
    if (!pwValidation.valid) {
      toast({ title: 'Erreur', description: pwValidation.errors[0], variant: 'destructive' });
      return;
    }

    if (proData.password !== proData.confirmPassword) {
      toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas', variant: 'destructive' });
      return;
    }

    if (!proData.rib || !proData.idNumber || !proData.specializations?.length) {
      toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs obligatoires', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const newPro = await registerProTransporter(proData as ProRegistrationData);
      if (newPro) {
        toast({
          title: '✅ Compte professionnel créé !',
          description: 'Bienvenue en tant que transporteur professionnel',
        });
        navigate('/dashboard-pro');
      }
    } catch (error) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Trans<span className="text-accent">wave</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Connectez vos colis au monde
          </p>
        </Link>

        {/* Tab Selection */}
        <Tabs value={userType} onValueChange={(val) => { setUserType(val as 'citizen' | 'pro_transporter'); setCurrentStep(1); }} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="citizen">Citoyen</TabsTrigger>
            <TabsTrigger value="pro_transporter" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Transporteur Pro
            </TabsTrigger>
          </TabsList>

          {/* CITIZEN REGISTRATION */}
          <TabsContent value="citizen">
            <Card className="border-2 shadow-xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <UserPlus className="h-6 w-6 text-primary" />
                  Créer un compte
                </CardTitle>
                <CardDescription>Rejoignez la communauté Transwave</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCitizenSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom <span className="text-accent">*</span></Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Mohamed"
                        value={citizenData.firstName}
                        onChange={handleCitizenChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom <span className="text-accent">*</span></Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Benali"
                        value={citizenData.lastName}
                        onChange={handleCitizenChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-accent">*</span></Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={citizenData.email}
                      onChange={handleCitizenChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse complète <span className="text-accent">*</span></Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Rue de la Paix, 75001 Paris"
                      value={citizenData.address}
                      onChange={handleCitizenChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe <span className="text-accent">*</span></Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={citizenData.password}
                        onChange={handleCitizenChange}
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer <span className="text-accent">*</span></Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={citizenData.confirmPassword}
                        onChange={handleCitizenChange}
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="accent" size="lg" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? 'Création...' : 'Créer mon compte'}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROFESSIONAL REGISTRATION - MULTI-STEP */}
          <TabsContent value="pro_transporter">
            <Card className="border-2 shadow-xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Truck className="h-6 w-6 text-primary" />
                  Enregistrement Professionnel
                </CardTitle>
                <CardDescription>
                  Étape {currentStep}/6 - {
                    currentStep === 1 ? 'Type de profil' :
                    currentStep === 2 ? 'Informations personnelles' :
                    currentStep === 3 ? 'RIB/Compte bancaire' :
                    currentStep === 4 ? 'Document d\'identité' :
                    currentStep === 5 ? 'Kbis (optionnel)' :
                    'Informations professionnelles'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProSubmit} className="space-y-6">
                  {/* STEP 1: Profile Selection */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Vous allez créer un compte de transporteur professionnel. Cela vous permettra de publier des trajets et de proposer vos services.
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nom complet <span className="text-accent">*</span></Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Mohamed Benali"
                          value={proData.fullName || ''}
                          onChange={handleProChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Basic Info */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email <span className="text-accent">*</span></Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="pro@example.com"
                          value={proData.email || ''}
                          onChange={handleProChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse professionnelle <span className="text-accent">*</span></Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder="123 Avenue des Transports, Paris"
                          value={proData.address || ''}
                          onChange={handleProChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Mot de passe <span className="text-accent">*</span></Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={proData.password || ''}
                            onChange={handleProChange}
                            required
                            minLength={8}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirmer <span className="text-accent">*</span></Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={proData.confirmPassword || ''}
                            onChange={handleProChange}
                            required
                            minLength={8}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: RIB */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Votre RIB sera utilisé pour vos virements. Il doit être valide et à votre nom.
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label htmlFor="rib">RIB/IBAN <span className="text-accent">*</span></Label>
                        <Input
                          id="rib"
                          name="rib"
                          placeholder="FR1420041010050500013M02606"
                          value={proData.rib || ''}
                          onChange={handleProChange}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Format: FR + 25 caractères (France)</p>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: ID Document */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="idType">Type de document <span className="text-accent">*</span></Label>
                          <select
                            id="idType"
                            name="idType"
                            value={proData.idType || 'passport'}
                            onChange={handleProChange}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="passport">Passeport</option>
                            <option value="national_id">Carte d'identité</option>
                            <option value="driving_license">Permis de conduire</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="idNumber">Numéro <span className="text-accent">*</span></Label>
                          <Input
                            id="idNumber"
                            name="idNumber"
                            placeholder="12345678"
                            value={proData.idNumber || ''}
                            onChange={handleProChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="idIssueDate">Date d'émission <span className="text-accent">*</span></Label>
                          <Input
                            id="idIssueDate"
                            name="idIssueDate"
                            type="date"
                            value={proData.idIssueDate || ''}
                            onChange={handleProChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="idExpiryDate">Date d'expiration <span className="text-accent">*</span></Label>
                          <Input
                            id="idExpiryDate"
                            name="idExpiryDate"
                            type="date"
                            value={proData.idExpiryDate || ''}
                            onChange={handleProChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idPhoto">Photo du document <span className="text-accent">*</span></Label>
                        <Input
                          id="idPhoto"
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files && handleProFileUpload('idPhotoBase64', e.target.files[0])}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Kbis */}
                  {currentStep === 5 && (
                    <div className="space-y-4">
                      <Alert>
                        <FileCheck className="h-4 w-4" />
                        <AlertDescription>
                          Le Kbis est optionnel mais recommandé pour accéder à tous les services.
                        </AlertDescription>
                      </Alert>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Nom de l'entreprise</Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            placeholder="Transport Express SARL"
                            value={proData.companyName || ''}
                            onChange={handleProChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="kbisNumber">Numéro Kbis</Label>
                          <Input
                            id="kbisNumber"
                            name="kbisNumber"
                            placeholder="75123456789"
                            value={proData.kbisNumber || ''}
                            onChange={handleProChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kbisRegistrationDate">Date d'immatriculation</Label>
                        <Input
                          id="kbisRegistrationDate"
                          name="kbisRegistrationDate"
                          type="date"
                          value={proData.kbisRegistrationDate || ''}
                          onChange={handleProChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kbisPhoto">Copie du Kbis</Label>
                        <Input
                          id="kbisPhoto"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => e.target.files && handleProFileUpload('kbisPhotoBase64', e.target.files[0])}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 6: Professional Info */}
                  {currentStep === 6 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Spécialisations <span className="text-accent">*</span></Label>
                        <div className="space-y-2">
                          {(['general', 'food', 'pharma', 'electronics', 'furniture', 'hazmat'] as TransportSpecialization[]).map((spec) => (
                            <div key={spec} className="flex items-center space-x-2">
                              <Checkbox
                                id={spec}
                                checked={(proData.specializations || []).includes(spec)}
                                onCheckedChange={() => toggleSpecialization(spec)}
                              />
                              <Label htmlFor={spec} className="cursor-pointer">
                                {spec === 'general' ? 'Général' : spec === 'food' ? 'Alimentaire' : spec === 'pharma' ? 'Pharmaceutique' : spec === 'electronics' ? 'Électronique' : spec === 'furniture' ? 'Mobilier' : 'Matières dangereuses'}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceArea">Zone de service <span className="text-accent">*</span></Label>
                        <Input
                          id="serviceArea"
                          name="serviceArea"
                          placeholder="Île-de-France"
                          value={proData.serviceArea || ''}
                          onChange={handleProChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="insuranceProvider">Assureur</Label>
                          <Input
                            id="insuranceProvider"
                            name="insuranceProvider"
                            placeholder="AXA, MAIF..."
                            value={proData.insuranceProvider || ''}
                            onChange={handleProChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insurancePolicyNumber">Numéro de police</Label>
                          <Input
                            id="insurancePolicyNumber"
                            name="insurancePolicyNumber"
                            placeholder="POL-2024-123456"
                            value={proData.insurancePolicyNumber || ''}
                            onChange={handleProChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="insuranceExpiryDate">Date d'expiration assurance</Label>
                        <Input
                          id="insuranceExpiryDate"
                          name="insuranceExpiryDate"
                          type="date"
                          value={proData.insuranceExpiryDate || ''}
                          onChange={handleProChange}
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 pt-4">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="flex-1"
                      >
                        Précédent
                      </Button>
                    )}
                    {currentStep < 6 ? (
                      <Button
                        type="button"
                        variant="accent"
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        className="flex-1"
                      >
                        Suivant
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="accent"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Enregistrement...' : 'Finaliser'}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
