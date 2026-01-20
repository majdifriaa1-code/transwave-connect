import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: '✅ Connexion réussie !',
          description: 'Bienvenue sur Transwave',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Vérifiez vos identifiants',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="block text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">
              Trans<span className="text-accent">wave</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Connectez vos colis au monde
            </p>
          </Link>

          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                Connexion
              </CardTitle>
              <CardDescription>
                Accédez à votre espace personnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="form-label">
                    Email <span className="text-accent">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 form-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="form-label">
                    Mot de passe <span className="text-accent">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 form-input"
                      required
                    />
                  </div>
                </div>

                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Créer un compte
                </Link>
              </div>

              {/* Demo hint */}
              <div className="mt-6 p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Démo:</strong> Utilisez n'importe quel email pour vous connecter
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
