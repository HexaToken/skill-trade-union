import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  DollarSign, 
  Shield,
  Camera,
  Hash,
  QrCode,
  Flag,
  Edit3,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  OfflineTrade,
  TradeConfirmForm,
  TradeRole,
  getTradeStatusColor,
  getTradeStatusLabel,
  COUNTER_OFFER_MAX_PERCENTAGE,
  isHighValueTrade
} from '@/models/offline-trade-types';
import { mockOfflineTrades, getTradeParticipants } from '@/mock/offline-trade-data';

const OfflineTradeConfirmPage: React.FC = () => {
  const { tradeId } = useParams<{ tradeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock current user ID
  const currentUserId = 'u_2';

  // Find the trade
  const trade = useMemo(() => {
    return mockOfflineTrades.find(t => t.id === tradeId);
  }, [tradeId]);

  const participants = useMemo(() => {
    return trade ? getTradeParticipants(trade) : null;
  }, [trade]);

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [confirmForm, setConfirmForm] = useState<TradeConfirmForm>({
    role: trade?.roles[currentUserId] || 'learned',
    pin: '',
    notes: ''
  });

  // Validation
  const canConfirm = useMemo(() => {
    if (!trade) return false;
    return (
      trade.status === 'awaiting-counterparty' &&
      trade.counterpartyId === currentUserId
    );
  }, [trade, currentUserId]);

  const needsReconfirm = useMemo(() => {
    return trade?.status === 'needs-reconfirm';
  }, [trade]);

  const isExpired = useMemo(() => {
    if (!trade) return false;
    return new Date() > new Date(trade.verification.expiresAt);
  }, [trade]);

  const counterOfferRange = useMemo(() => {
    if (!trade) return { min: 0, max: 0 };
    const percentage = COUNTER_OFFER_MAX_PERCENTAGE / 100;
    return {
      min: Math.round(trade.creditsProposed * (1 - percentage)),
      max: Math.round(trade.creditsProposed * (1 + percentage))
    };
  }, [trade]);

  // Handlers
  const handleFormChange = useCallback((field: keyof TradeConfirmForm, value: any) => {
    setConfirmForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!trade || !canConfirm) return;

    // Validate PIN if required
    if (trade.verification.method === 'pin' && confirmForm.pin !== trade.verification.pin) {
      toast({
        title: "Invalid PIN",
        description: "Please enter the correct 6-digit PIN to confirm this trade.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const hasCounterOffer = confirmForm.creditsCounterOffer && 
        confirmForm.creditsCounterOffer !== trade.creditsProposed;

      if (hasCounterOffer) {
        toast({
          title: "Counter-offer Submitted",
          description: `Your counter-offer of ${confirmForm.creditsCounterOffer} credits has been sent to ${participants?.initiator.name}.`,
        });
      } else {
        toast({
          title: "Trade Confirmed!",
          description: `${trade.creditsProposed} credits will be transferred. Trade completed successfully!`,
        });
      }

      // Navigate to receipt page
      navigate(`/trade/${tradeId}/receipt`);

    } catch (error) {
      toast({
        title: "Error Confirming Trade",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [trade, canConfirm, confirmForm, toast, navigate, tradeId, participants]);

  const handleDispute = useCallback(() => {
    navigate(`/trade/${tradeId}/dispute`);
  }, [navigate, tradeId]);

  const handleRequestChange = useCallback(() => {
    // Mock functionality - would normally open a change request modal
    toast({
      title: "Change Request Sent",
      description: "The trade initiator has been notified of your requested changes.",
    });
  }, [toast]);

  if (!trade || !participants) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0F172A] flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
              Trade Not Found
            </h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] mb-4">
              The trade you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="bg-[#0056D2] hover:bg-[#004BB8]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { initiator, counterparty } = participants;
  const isHighValue = isHighValueTrade(trade.creditsProposed);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0056D2]/5 to-[#06B6D4]/5 dark:from-[#0F172A] dark:to-[#1E293B] border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-[#64748B] hover:text-[#0056D2]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                Confirm Offline Trade
              </h1>
              <p className="text-[#64748B] dark:text-[#94A3B8]">
                Review and confirm your trade with {initiator.name}
              </p>
            </div>
            
            <Badge className={getTradeStatusColor(trade.status)}>
              {getTradeStatusLabel(trade.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Status Alerts */}
          {isExpired && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <Clock className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                <strong>Trade Expired:</strong> This trade has expired and can no longer be confirmed.
              </AlertDescription>
            </Alert>
          )}

          {!canConfirm && !needsReconfirm && !isExpired && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                This trade has already been processed or you don't have permission to confirm it.
              </AlertDescription>
            </Alert>
          )}

          {needsReconfirm && (
            <Alert className="border-[#06B6D4]/50 bg-[#06B6D4]/10">
              <Edit3 className="h-4 w-4 text-[#06B6D4]" />
              <AlertDescription className="text-[#06B6D4]">
                <strong>Re-confirmation Required:</strong> A counter-offer has been made. Please review and confirm.
              </AlertDescription>
            </Alert>
          )}

          {/* Trade Summary */}
          <Card className="border-[#0056D2]/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-[#0056D2]">
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
                      <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] font-bold text-lg">
                        {initiator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                      {initiator.name}
                    </div>
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                      {trade.roles[initiator.id] === 'taught' ? 'Teacher' : 
                       trade.roles[initiator.id] === 'learned' ? 'Student' : 'Exchange Partner'}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#0056D2]/10 rounded-full flex items-center justify-center mb-2">
                      <Star className="h-6 w-6 text-[#0056D2]" />
                    </div>
                    <div className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wide">
                      Trade
                    </div>
                  </div>

                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarImage src={counterparty.avatar} alt={counterparty.name} />
                      <AvatarFallback className="bg-[#06B6D4]/10 text-[#06B6D4] font-bold text-lg">
                        {counterparty.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                      {counterparty.name}
                    </div>
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                      {trade.roles[counterparty.id] === 'taught' ? 'Teacher' : 
                       trade.roles[counterparty.id] === 'learned' ? 'Student' : 'Exchange Partner'}
                    </div>
                    {currentUserId === counterparty.id && (
                      <Badge className="bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20 text-xs mt-1">
                        You
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Trade Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8] font-medium">Skill Traded</div>
                    <div className="text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                      {trade.skill}
                    </div>
                    {trade.skillTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {trade.skillTags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8] font-medium">Duration</div>
                    <div className="text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {Math.floor(trade.durationMins / 60)}h {trade.durationMins % 60}m
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8] font-medium">When</div>
                    <div className="text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                      {new Date(trade.startedAt).toLocaleDateString()} at{' '}
                      {new Date(trade.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8] font-medium">Location</div>
                    <div className="text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {trade.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {trade.notes && (
                <div>
                  <div className="text-sm text-[#64748B] dark:text-[#94A3B8] font-medium mb-2">Notes</div>
                  <div className="text-sm text-[#0F172A] dark:text-[#F1F5F9] p-4 bg-[#F8FAFC] dark:bg-[#1E293B] rounded-lg">
                    {trade.notes}
                  </div>
                </div>
              )}

              {/* Attachments Preview */}
              {trade.attachments.length > 0 && (
                <div>
                  <div className="text-sm text-[#64748B] dark:text-[#94A3B8] font-medium mb-2">Attachments</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {trade.attachments.map(attachment => (
                      <div key={attachment.id} className="relative group">
                        <img
                          src={attachment.url}
                          alt={attachment.caption || 'Trade attachment'}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                        {attachment.caption && (
                          <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 truncate">
                            {attachment.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credit Details */}
          <Card className="border-[#06B6D4]/20 bg-[#06B6D4]/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-[#06B6D4]">
                <DollarSign className="h-6 w-6" />
                Credit Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                  Credits to transfer:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-[#06B6D4]">
                    {trade.creditsProposed}
                  </span>
                  {isHighValue && (
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                      High Value
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">
                {trade.roles[currentUserId] === 'taught' 
                  ? `You will receive ${trade.creditsProposed} credits from ${initiator.name}`
                  : trade.roles[currentUserId] === 'learned'
                  ? `You will pay ${trade.creditsProposed} credits to ${initiator.name}`
                  : `Mutual exchange of skills and experience`
                }
              </div>

              {/* Counter Offer Section */}
              {(canConfirm || needsReconfirm) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                      Propose counter-offer (±{COUNTER_OFFER_MAX_PERCENTAGE}%)
                    </Label>
                    <Switch
                      checked={showCounterOffer}
                      onCheckedChange={setShowCounterOffer}
                    />
                  </div>

                  {showCounterOffer && (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder={`${counterOfferRange.min} - ${counterOfferRange.max}`}
                        value={confirmForm.creditsCounterOffer || ''}
                        onChange={(e) => handleFormChange('creditsCounterOffer', parseInt(e.target.value) || undefined)}
                        min={counterOfferRange.min}
                        max={counterOfferRange.max}
                        className="text-center font-bold"
                      />
                      <div className="text-xs text-[#64748B] dark:text-[#94A3B8] text-center">
                        Range: {counterOfferRange.min} - {counterOfferRange.max} credits
                      </div>
                    </div>
                  )}

                  {trade.escrowEnabled && (
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Credits will be held in escrow until both parties confirm the completion.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Section */}
          {(canConfirm || needsReconfirm) && (
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                  {trade.verification.method === 'qr' ? <QrCode className="h-6 w-6" /> : <Hash className="h-6 w-6" />}
                  Verification Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trade.verification.method === 'pin' ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                      Enter the 6-digit PIN shared by {initiator.name}
                    </Label>
                    <Input
                      type="text"
                      placeholder="000000"
                      value={confirmForm.pin}
                      onChange={(e) => handleFormChange('pin', e.target.value)}
                      maxLength={6}
                      className="text-center font-mono text-2xl tracking-widest"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">
                      QR code verification has been completed successfully.
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">QR Code Verified</span>
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                    Additional notes (optional)
                  </Label>
                  <Textarea
                    placeholder="Any additional comments about the trade..."
                    value={confirmForm.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {(canConfirm || needsReconfirm) && !isExpired && (
            <Card className="border-[#E2E8F0]">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleConfirm}
                    disabled={
                      isSubmitting ||
                      (trade.verification.method === 'pin' && !confirmForm.pin) ||
                      (showCounterOffer && !confirmForm.creditsCounterOffer)
                    }
                    className="flex-1 bg-[#0056D2] hover:bg-[#004BB8] text-white"
                  >
                    {isSubmitting ? (
                      'Confirming...'
                    ) : showCounterOffer ? (
                      `Confirm with ${confirmForm.creditsCounterOffer} Credits`
                    ) : (
                      `Confirm Trade (${trade.creditsProposed} Credits)`
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleRequestChange}
                    className="text-[#06B6D4] border-[#06B6D4]/30 hover:bg-[#06B6D4]/10"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Request Changes
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDispute}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineTradeConfirmPage;
