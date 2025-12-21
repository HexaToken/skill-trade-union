import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Star, 
  AlertTriangle,
  Clock,
  Users,
  MapPin,
  DollarSign,
  Shield,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Camera,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  OfflineTrade,
  getTradeStatusColor,
  getTradeStatusLabel,
  isHighValueTrade
} from '@/models/offline-trade-types';
import { mockOfflineTrades, getTradeParticipants } from '@/mock/offline-trade-data';

const OfflineTradeReceipt: React.FC = () => {
  const { tradeId } = useParams<{ tradeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock current user ID
  const currentUserId = 'u_1';

  // Find the trade
  const trade = useMemo(() => {
    return mockOfflineTrades.find(t => t.id === tradeId);
  }, [tradeId]);

  const participants = useMemo(() => {
    return trade ? getTradeParticipants(trade) : null;
  }, [trade]);

  const currentUserRole = useMemo(() => {
    return trade ? trade.roles[currentUserId] : null;
  }, [trade, currentUserId]);

  const creditTransferDirection = useMemo(() => {
    if (!trade || !currentUserRole) return null;
    
    const isInitiator = trade.initiatorId === currentUserId;
    const taught = currentUserRole === 'taught';
    const learned = currentUserRole === 'learned';
    
    if (currentUserRole === 'both') {
      return 'exchange';
    } else if (taught) {
      return 'received';
    } else if (learned) {
      return 'sent';
    }
    return null;
  }, [trade, currentUserRole, currentUserId]);

  const handleDownloadReceipt = () => {
    // Mock download functionality
    toast({
      title: "Receipt Downloaded",
      description: "Trade receipt has been saved as PDF to your downloads.",
    });
  };

  const handleShare = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: `SkillSwap Trade Receipt - ${trade?.skill}`,
        text: `Trade completed: ${trade?.skill} for ${trade?.creditsProposed} credits`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Trade receipt link copied to clipboard.",
      });
    }
  };

  const handleLeaveReview = () => {
    const otherParticipantId = trade?.initiatorId === currentUserId 
      ? trade?.counterpartyId 
      : trade?.initiatorId;
    
    // Navigate to review page (would be implemented)
    toast({
      title: "Review Feature",
      description: "Review functionality would open here.",
    });
  };

  if (!trade || !participants) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold text-ink-head mb-2">
              Receipt Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The trade receipt you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary-dark">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { initiator, counterparty } = participants;
  const isHighValue = isHighValueTrade(trade.creditsActual || trade.creditsProposed);
  const otherParticipant = trade.initiatorId === currentUserId ? counterparty : initiator;

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-elevated border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink-head mb-2">
                Trade Receipt
              </h1>
              <p className="text-muted-foreground">
                Trade ID: {trade.id}
              </p>
            </div>

            <div className="text-right">
              <Badge className={getTradeStatusColor(trade.status)} >
                {getTradeStatusLabel(trade.status)}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">
                {new Date(trade.audit.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Status Alert */}
          {trade.status === 'confirmed' && (
            <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                <strong>Trade Completed Successfully!</strong> Credits have been transferred and the trade is now complete.
              </AlertDescription>
            </Alert>
          )}

          {trade.status === 'disputed' && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                <strong>Trade Disputed:</strong> This trade is currently under review. 
                {trade.disputeReason && ` Reason: ${trade.disputeReason.replace('-', ' ')}`}
              </AlertDescription>
            </Alert>
          )}

          {trade.status === 'expired' && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                <strong>Trade Expired:</strong> This trade expired without confirmation from both parties.
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <Star className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleDownloadReceipt}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>

                {trade.status === 'confirmed' && (
                  <Button
                    onClick={handleLeaveReview}
                    className="bg-secondary hover:opacity-90 text-white"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Leave Review
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="text-muted-foreground border-border"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trade Summary */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-ink-head">
                <Users className="h-6 w-6" />
                Trade Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Participants */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarImage src={initiator.avatar} alt={initiator.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                        {initiator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-ink-head">
                      {initiator.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trade.roles[initiator.id] === 'taught' ? 'Teacher' :
                       trade.roles[initiator.id] === 'learned' ? 'Student' : 'Exchange Partner'}
                    </div>
                    {currentUserId === initiator.id && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs mt-1">
                        You
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      {trade.status === 'confirmed' ? (
                        <CheckCircle className="h-6 w-6 text-success" />
                      ) : trade.status === 'disputed' ? (
                        <AlertTriangle className="h-6 w-6 text-danger" />
                      ) : (
                        <Clock className="h-6 w-6 text-warning" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      {getTradeStatusLabel(trade.status)}
                    </div>
                  </div>

                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarImage src={counterparty.avatar} alt={counterparty.name} />
                      <AvatarFallback className="bg-secondary/10 text-secondary font-bold text-lg">
                        {counterparty.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-ink-head">
                      {counterparty.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trade.roles[counterparty.id] === 'taught' ? 'Teacher' :
                       trade.roles[counterparty.id] === 'learned' ? 'Student' : 'Exchange Partner'}
                    </div>
                    {currentUserId === counterparty.id && (
                      <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs mt-1">
                        You
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Trade Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground font-medium">Skill Traded</div>
                    <div className="text-lg font-medium text-ink-head">
                      {trade.skill}
                    </div>
                    {trade.skillTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {trade.skillTags.map(tag => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-primary/10 text-primary border-primary/20 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground font-medium">Duration</div>
                    <div className="text-lg font-medium text-ink-head flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {Math.floor(trade.durationMins / 60)}h {trade.durationMins % 60}m
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground font-medium">Complexity</div>
                    <div className="text-lg font-medium text-ink-head">
                      {trade.pricing.complexity === 1.0 ? 'Simple' :
                       trade.pricing.complexity === 1.3 ? 'Standard' : 'Advanced'}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({trade.pricing.complexity}x)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground font-medium">Date & Time</div>
                    <div className="text-lg font-medium text-ink-head flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(trade.startedAt).toLocaleDateString()} at{' '}
                      {new Date(trade.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground font-medium">Location</div>
                    <div className="text-lg font-medium text-ink-head flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {trade.location}
                      {trade.isInPerson && (
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                          In-Person
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground font-medium">Verification</div>
                    <div className="text-lg font-medium text-ink-head flex items-center gap-2">
                      {trade.verification.method === 'qr' ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-success" />
                          QR Code Verified
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-success" />
                          PIN Verified
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {trade.notes && (
                <div>
                  <div className="text-sm text-muted-foreground font-medium mb-2">Session Notes</div>
                  <div className="text-sm text-ink-body p-4 bg-elevated rounded-lg">
                    {trade.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credit Transfer Breakdown */}
          <Card className="border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-secondary">
                <DollarSign className="h-6 w-6" />
                Credit Transfer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Transfer Amount */}
              <div className="flex items-center justify-between">
                <span className="text-ink-head font-medium">
                  {creditTransferDirection === 'received' && 'Credits Received:'}
                  {creditTransferDirection === 'sent' && 'Credits Sent:'}
                  {creditTransferDirection === 'exchange' && 'Skill Exchange:'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-secondary">
                    {creditTransferDirection === 'exchange' ? '—' : (trade.creditsActual || trade.creditsProposed)}
                  </span>
                  {isHighValue && (
                    <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                      High Value
                    </Badge>
                  )}
                </div>
              </div>

              {/* Transfer Details */}
              {creditTransferDirection !== 'exchange' && (
                <div className="text-sm text-muted-foreground">
                  {creditTransferDirection === 'received'
                    ? `Received from ${otherParticipant.name} for teaching ${trade.skill}`
                    : `Sent to ${otherParticipant.name} for learning ${trade.skill}`
                  }
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="bg-elevated rounded-lg p-4 space-y-2">
                <div className="text-sm font-medium text-ink-head mb-2">
                  Pricing Breakdown
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Base rate ({trade.pricing.basePerHour} credits/hour):</span>
                    <span>{Math.round(trade.pricing.basePerHour * (trade.durationMins / 60))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Complexity multiplier ({trade.pricing.complexity}x):</span>
                    <span>×{trade.pricing.complexity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Demand adjustment ({trade.pricing.demand}x):</span>
                    <span>×{trade.pricing.demand}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium text-ink-head">
                    <span>Total:</span>
                    <span>{trade.creditsActual || trade.creditsProposed} credits</span>
                  </div>
                </div>
              </div>

              {/* Escrow Information */}
              {trade.escrowEnabled && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    This trade used escrow protection. Credits were held securely until both parties confirmed completion.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Attachments/Evidence */}
          {trade.attachments.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-ink-head">
                  <Camera className="h-6 w-6" />
                  Trade Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {trade.attachments.map(attachment => (
                    <div key={attachment.id} className="space-y-2">
                      <img
                        src={attachment.url}
                        alt={attachment.caption || 'Trade documentation'}
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                      {attachment.caption && (
                        <div className="text-sm text-muted-foreground">
                          {attachment.caption}
                        </div>
                      )}
                      {attachment.timestamp && (
                        <div className="text-xs text-muted-foreground">
                          {new Date(attachment.timestamp).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-ink-head">
                <Clock className="h-6 w-6" />
                Trade Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
                  <div>
                    <div className="font-medium text-ink-head">Trade Created</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(trade.audit.createdAt).toLocaleString()} by {initiator.name}
                    </div>
                  </div>
                </div>

                {trade.audit.updatedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-secondary rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium text-ink-head">Trade Confirmed</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(trade.audit.updatedAt).toLocaleString()} by {counterparty.name}
                      </div>
                    </div>
                  </div>
                )}

                {trade.status === 'confirmed' && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-success rounded-full mt-1"></div>
                    <div>
                      <div className="font-medium text-ink-head">Credits Transferred</div>
                      <div className="text-sm text-muted-foreground">
                        {trade.creditsActual || trade.creditsProposed} credits transferred successfully
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          {trade.status === 'confirmed' && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <Award className="h-5 w-5" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm text-ink-head">
                    Leave a review for {otherParticipant.name} to help future traders
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm text-ink-head">
                    Share this experience in the community
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm text-ink-head">
                    Continue learning and teaching new skills
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineTradeReceipt;
