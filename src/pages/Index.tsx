import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { UserTypeCard } from '@/components/home/UserTypeCard';
import { StatsGrid, CountryStatsGrid } from '@/components/stats/StatsGrid';
import { PLATFORM_STATS, COUNTRY_STATS } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { BarChart3, Globe } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setCurrentUser } = useApp();
  const { MOCK_USERS } = require('@/data/mockData');

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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* User Type Selection Cards */}
        <section className="mb-16">
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
    </Layout>
  );
};

export default Index;
