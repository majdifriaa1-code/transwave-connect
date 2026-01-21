import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_CONVERSATIONS } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sent: boolean;
  timestamp: Date;
}

export default function MessagesPage() {
  const { currentUser, conversations } = useApp();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis intéressé par votre trajet vers Casablanca.',
      sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: '2',
      content: 'Parfait ! J\'ai encore 15kg de disponible. C\'est pour quel type de colis ?',
      sent: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '3',
      content: 'Des vêtements pour ma famille, environ 5kg.',
      sent: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const selectedConv = MOCK_CONVERSATIONS.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sent: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const handleConfirmDelivery = () => {
    toast({
      title: '✅ Livraison Confirmée !',
      description: 'Les fonds ont été libérés au transporteur. Merci d\'utiliser Transwave !',
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-120px)]">
      <Card className="h-full border-2 overflow-hidden">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={`w-full md:w-80 border-r border-secondary flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            <CardHeader className="border-b border-secondary py-4">
              <CardTitle className="text-lg flex items-center justify-between">
                💬 Messagerie
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              {MOCK_CONVERSATIONS.map(conv => (
                <div
                  key={conv.id}
                  className={`p-4 border-b border-secondary cursor-pointer transition-colors hover:bg-muted ${
                    selectedConversation === conv.id ? 'bg-primary-pale' : ''
                  }`}
                  onClick={() => setSelectedConversation(conv.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conv.participantAvatar} />
                        <AvatarFallback className="bg-accent text-white">
                          {conv.participantName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{conv.participantName}</p>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(conv.lastMessageTime, { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-secondary flex items-center gap-3 bg-muted/50">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.participantAvatar} />
                    <AvatarFallback className="bg-primary text-white">
                      {selectedConv.participantName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{selectedConv.participantName}</p>
                    <p className="text-sm text-success flex items-center gap-1">
                      <span className="w-2 h-2 bg-success rounded-full" />
                      En ligne
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div 
                        key={msg.id}
                        className={msg.sent ? 'chat-bubble-sent' : 'chat-bubble-received'}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.sent ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {formatDistanceToNow(msg.timestamp, { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Confirm Delivery Button */}
                <div className="px-4 py-2">
                  <Button 
                    variant="success" 
                    className="w-full"
                    onClick={handleConfirmDelivery}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirmer la Livraison
                  </Button>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-secondary flex gap-3">
                  <Input
                    placeholder="Écrivez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="hero" size="icon" onClick={handleSendMessage}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-medium">Sélectionnez une conversation</p>
                  <p className="text-sm">Choisissez un contact pour commencer à discuter</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
