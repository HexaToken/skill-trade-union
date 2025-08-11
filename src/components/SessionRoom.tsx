import { useState, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  MessageCircle,
  MoreVertical,
  Maximize2,
  Minimize2,
  Settings,
  Share2,
  Clock,
  DollarSign,
  Camera,
  Monitor,
  Users,
  Star,
  ThumbsUp,
  AlertTriangle,
  FileText,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { InstantSession, ExpertProfile } from '@/models/expert-types';

interface SessionRoomProps {
  session: InstantSession;
  expert: ExpertProfile;
  onEndSession: () => void;
  onSessionRating?: (rating: number, feedback: string) => void;
}

interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
}

export default function SessionRoom({ 
  session, 
  expert, 
  onEndSession,
  onSessionRating 
}: SessionRoomProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentCost, setCurrentCost] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'system',
      message: 'Session started. Both participants are connected.',
      timestamp: new Date().toISOString(),
      type: 'system'
    }
  ]);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(session.startedAt).getTime();
      const duration = Math.floor((now - start) / 1000);
      setSessionDuration(duration);
      setCurrentCost((duration / 60) * (session.ratePerMinuteCents / 100));
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      message: chatMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');

    // Simulate expert response
      setTimeout(() => {
        const expertMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: expert.id,
          message: "Thanks for sharing that! Let me help you with this.",
          timestamp: new Date().toISOString(),
          type: 'text'
        };
      setChatMessages(prev => [...prev, expertMessage]);
    }, 2000);
  };

  const handleEndSession = () => {
    if (onSessionRating && rating > 0) {
      onSessionRating(rating, feedback);
    }
    onEndSession();
  };

  const VideoPlaceholder = ({ name, isExpert = false }: { name: string; isExpert?: boolean }) => (
    <div className={cn(
      'relative aspect-video bg-gradient-to-br rounded-lg overflow-hidden flex items-center justify-center',
      isExpert ? 'from-brand-primary to-brand-secondary' : 'from-gray-600 to-gray-800'
    )}>
      <div className="text-center text-white">
        <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white/20">
          <AvatarImage src={isExpert ? expert.avatarUrl : undefined} alt={name} />
          <AvatarFallback className="bg-white/20 text-white text-xl">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <p className="font-medium">{name}</p>
        <p className="text-sm opacity-80">{isVideoOn ? 'Camera on' : 'Camera off'}</p>
      </div>
      
      {/* Connection quality indicator */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-xs text-white">Good</span>
        </div>
      </div>

      {/* Audio indicator */}
      <div className="absolute bottom-4 left-4">
        {isAudioOn ? (
          <div className="bg-green-500 p-2 rounded-full">
            <Mic className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="bg-red-500 p-2 rounded-full">
            <MicOff className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={expert.avatarUrl} alt={expert.name} />
              <AvatarFallback>
                {expert.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{expert.name}</h3>
              <p className="text-sm text-muted-foreground">Expert Session</p>
            </div>
          </div>
          
          <Badge className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Live
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          {/* Session info */}
          <div className="text-right text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(sessionDuration)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>${currentCost.toFixed(2)}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share Screen
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                Session Notes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className={cn(
          'flex-1 p-4 space-y-4',
          showChat ? 'lg:pr-2' : ''
        )}>
          {/* Expert video (main) */}
          <div className="aspect-video">
            <VideoPlaceholder name={expert.name} isExpert />
          </div>

          {/* Your video (picture-in-picture) */}
          <div className="absolute bottom-20 right-6 w-48 z-10">
            <VideoPlaceholder name="You" />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center gap-2 bg-black/80 backdrop-blur rounded-full p-2">
              <Button
                variant={isVideoOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-full"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
              
              <Button
                variant={isAudioOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-full"
                onClick={() => setIsAudioOn(!isAudioOn)}
              >
                {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-white/20"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-white/20"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>

              <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                onClick={() => setShowEndDialog(true)}
              >
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat & Notes Panel */}
        {showChat && (
          <div className="w-80 border-l bg-card flex flex-col">
            <Tabs defaultValue="chat" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col m-2 mt-0">
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-muted/50 rounded-lg">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={cn(
                      'flex gap-2',
                      message.userId === 'current-user' ? 'justify-end' : 'justify-start'
                    )}>
                      {message.userId !== 'current-user' && message.userId !== 'system' && (
                        <Avatar className="w-6 h-6 mt-1">
                          <AvatarImage src={expert.avatarUrl} alt={expert.name} />
                          <AvatarFallback className="text-xs">
                            {expert.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn(
                        'max-w-[80%] p-2 rounded-lg text-sm',
                        message.userId === 'current-user' 
                          ? 'bg-brand-primary text-white' 
                          : message.userId === 'system'
                          ? 'bg-brand-secondary/10 text-brand-secondary text-center text-xs w-full'
                          : 'bg-background border'
                      )}>
                        {message.message}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat input */}
                <div className="flex gap-2 mt-3">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="flex-1 flex flex-col m-2 mt-0">
                <Textarea
                  placeholder="Take notes during your session..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex-1 resize-none"
                />
                <Button size="sm" className="mt-2">
                  Save Notes
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* End Session Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>End Session</DialogTitle>
            <DialogDescription>
              Rate your experience and provide feedback for {expert.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Session summary */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{formatDuration(sessionDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-medium">${(session.ratePerMinuteCents / 100).toFixed(2)}/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-medium text-brand-primary">${currentCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rate this session</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star 
                      className={cn(
                        'w-6 h-6',
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Feedback (optional)</label>
              <Textarea
                placeholder="How was your experience?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              Continue Session
            </Button>
            <Button 
              onClick={handleEndSession}
              disabled={rating === 0}
            >
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
