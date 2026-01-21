import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTypeCard } from '@/components/home/UserTypeCard';
import { StatsGrid, CountryStatsGrid } from '@/components/stats/StatsGrid';
import { PLATFORM_STATS, COUNTRY_STATS, MOCK_USERS } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { BarChart3, Globe } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setCurrentUser } = useApp();

  const handleCardClick = (type: 'pro' | 'citizen-transport' | 'citizen-sender') => {
    if (!isAuthenticated) {
      // For demo, auto-login based on type selection
      let user;
      switch (type) {
        case 'pro':
          user = MOCK_USERS.find((u: any) => u.id === 'user_1');
          break;
        case 'citizen-transport':
          user = MOCK_USERS.find((u: any) => u.id === 'user_2');
          break;
        case 'citizen-sender':
          user = MOCK_USERS.find((u: any) => u.id === 'user_4');
          break;
      }
      if (user) {
        setCurrentUser(user);
      }
    }
    navigate(`/dashboard/${type}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-header text-white py-16 md:py-20 mx-4 md:mx-8 mt-4 rounded-3xl">
        <div className="container mx-auto px-4 relative z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Transwave
          </h1>
          <p className="text-xl md:text-2xl font-light text-white/90 mb-2">
            La logistique citoyenne connectée
          </p>
          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto mb-8">
            Connectez vos colis au monde. Un réseau de transport innovant qui rapproche les gens et facilite les échanges.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* User Type Selection Cards */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            Choisissez votre profil
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <UserTypeCard
              type="pro"
              title="Transporteur Pro"
              description="Professionnel du transport avec véhicule commercial"
              badge="Compte Professionnel"
              onClick={() => handleCardClick('pro')}
            />
            <UserTypeCard
              type="citizen-transport"
              title="Transporteur Citoyen"
              description="Voyageur avec espace disponible pour livraison"
              badge="Compte Citoyen"
              onClick={() => handleCardClick('citizen-transport')}
            />
            <UserTypeCard
              type="citizen-sender"
              title="Expéditeur Citoyen"
              description="Particulier souhaitant envoyer un colis"
              badge="Compte Standard"
              onClick={() => handleCardClick('citizen-sender')}
            />
          </div>
        </section>

        {/* Platform Statistics */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <BarChart3 className="h-7 w-7 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Statistiques de la Plateforme
              </h2>
            </div>
            <p className="text-muted-foreground">
              La confiance de milliers d'utilisateurs à travers le monde
            </p>
          </div>
          <StatsGrid stats={PLATFORM_STATS} />
        </section>

        {/* Country Statistics */}
        <section className="mb-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Globe className="h-7 w-7 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Pays les Plus Actifs
              </h2>
            </div>
            <p className="text-muted-foreground">
              France ↔ Maghreb : notre route principale
            </p>
          </div>
          <CountryStatsGrid countries={COUNTRY_STATS} />
        </section>
      </div>
    </div>
  );
};

export default Index;
