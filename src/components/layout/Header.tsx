import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageSquare, User, LogOut, Settings, ChevronDown } from 'lucide-react';

export function Header() {
  const { currentUser, isAuthenticated, logout, totalUnreadMessages } = useApp();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const getRoleBadge = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'pro_transporter':
        return <Badge className="badge-orange">Transporteur Pro</Badge>;
      case 'citizen':
        return <Badge variant="secondary" className="bg-primary-pale text-primary border-primary/20">Citoyen</Badge>;
      default:
        return null;
    }
  };

  return (
    <header className={`${isHome ? 'hero-header mb-10' : 'bg-card border-b-2 border-secondary'}`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between ${isHome ? 'py-4' : 'py-4'}`}>
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <h1 className={`text-2xl md:text-3xl font-bold ${isHome ? 'text-white' : 'text-primary'}`}>
              Trans<span className="text-accent">wave</span>
            </h1>
            {isHome && (
              <p className="text-white/80 text-sm mt-1 hidden sm:block">
                Connectez vos colis au monde
              </p>
            )}
          </Link>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-3 relative z-10">
            {isAuthenticated ? (
              <>
                {/* Messages Button */}
                <Link to="/messages">
                  <Button variant={isHome ? 'ghost' : 'icon'} size="icon" className={`relative ${isHome ? 'text-white hover:bg-white/20' : ''}`}>
                    <MessageSquare className="h-5 w-5" />
                    {totalUnreadMessages > 0 && (
                      <span className="notification-dot">{totalUnreadMessages}</span>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant={isHome ? 'ghost' : 'outline'} 
                      className={`flex items-center gap-2 ${isHome ? 'text-white border-white/30 hover:bg-white/20' : ''}`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.avatarUrl} />
                        <AvatarFallback className="bg-accent text-white text-sm">
                          {currentUser?.fullName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline max-w-[120px] truncate">
                        {currentUser?.fullName}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-semibold">{currentUser?.fullName}</p>
                      <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                      <div className="mt-2">{getRoleBadge()}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Mon Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant={isHome ? 'ghost' : 'outline'} className={isHome ? 'text-white border-white/30 hover:bg-white/20' : ''}>
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="accent">
                    Créer un compte
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
