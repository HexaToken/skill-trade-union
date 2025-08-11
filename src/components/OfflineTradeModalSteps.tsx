import React from 'react';
import { QrCode, Hash, Shield, CheckCircle, Star, DollarSign, Clock, MapPin, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  TradeDetailsForm, 
  TradeVerificationForm, 
  VerificationMethod,
  isHighValueTrade,
  getTradeStatusColor
} from '@/models/offline-trade-types';
import { TradeUser } from '@/models/offline-trade-types';

interface Step2VerificationProps {
  verificationForm: TradeVerificationForm;
  onVerificationChange: (field: keyof TradeVerificationForm, value: any) => void;
  detailsForm: TradeDetailsForm;
  isHighValue: boolean;
  pin?: string;
  qrToken?: string;
}

export const Step2Verification: React.FC<Step2VerificationProps> = ({
  verificationForm,
  onVerificationChange,
  detailsForm,
  isHighValue,
  pin = '493821',
  qrToken = 'qr_tkn_abc123'
}) => {
  return (
    <div className="space-y-6">
      {/* Verification Method Selection */}
      <Card className="border-[#0056D2]/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#0056D2]">
            <Shield className="h-5 w-5" />
            Verification Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* QR Code Option */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              verificationForm.method === 'qr' 
                ? 'border-[#0056D2] bg-[#0056D2]/5' 
                : 'border-[#E2E8F0] hover:border-[#0056D2]/50'
            }`}
            onClick={() => onVerificationChange('method', 'qr')}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                ${verificationForm.method === 'qr' ? 'border-[#0056D2] bg-[#0056D2]' : 'border-[#CBD5E1]'}
              `}>
                {verificationForm.method === 'qr' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-5 w-5 text-[#0056D2]" />
                  <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                    QR Code Verification
                  </span>
                  <Badge className="bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20 text-xs">
                    Recommended
                  </Badge>
                </div>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                  Generate a QR code for your counterparty to scan and confirm the trade.
                </p>
                
                {verificationForm.method === 'qr' && (
                  <div className="mt-4 p-4 bg-white dark:bg-[#1E293B] rounded-lg border">
                    <div className="flex items-center justify-center">
                      <div className="w-32 h-32 bg-[#0056D2]/10 rounded-lg flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-[#0056D2]" />
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                        Token: {qrToken}
                      </div>
                      <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                        Valid for 24 hours
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PIN Option */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              verificationForm.method === 'pin' 
                ? 'border-[#0056D2] bg-[#0056D2]/5' 
                : 'border-[#E2E8F0] hover:border-[#0056D2]/50'
            }`}
            onClick={() => onVerificationChange('method', 'pin')}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                ${verificationForm.method === 'pin' ? 'border-[#0056D2] bg-[#0056D2]' : 'border-[#CBD5E1]'}
              `}>
                {verificationForm.method === 'pin' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-5 w-5 text-[#0056D2]" />
                  <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                    6-Digit PIN
                  </span>
                </div>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                  Share a 6-digit PIN with your counterparty for verification.
                </p>
                
                {verificationForm.method === 'pin' && (
                  <div className="mt-4 p-4 bg-white dark:bg-[#1E293B] rounded-lg border">
                    <div className="text-center">
                      <div className="text-3xl font-bold font-mono text-[#0056D2] tracking-widest">
                        {pin}
                      </div>
                      <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2">
                        Share this PIN with your counterparty
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-[#64748B] dark:text-[#94A3B8] text-center">
            <span className="italic">Can't scan? Use the 6-digit PIN.</span>
          </div>
        </CardContent>
      </Card>

      {/* Escrow Settings */}
      <Card className="border-[#06B6D4]/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#06B6D4]">
            <Shield className="h-5 w-5" />
            Escrow Protection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <Label className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                Hold credits until both confirm
              </Label>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
                Credits will be held securely until both parties confirm the trade completion.
              </p>
            </div>
            <Switch
              checked={verificationForm.escrowEnabled}
              onCheckedChange={(checked) => onVerificationChange('escrowEnabled', checked)}
            />
          </div>
          
          {verificationForm.escrowEnabled && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Credits will be held in escrow and released automatically when both parties confirm.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* High Value Trade Warning */}
      {isHighValue && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            <strong>High Value Trade:</strong> This trade involves {detailsForm.creditsProposed} credits. 
            Additional verification may be required and photo evidence is recommended.
          </AlertDescription>
        </Alert>
      )}

      {/* Timeout Notice */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Both parties must confirm within <strong>24 hours</strong> or the trade will expire automatically.
        </AlertDescription>
      </Alert>
    </div>
  );
};

interface Step3ReviewProps {
  detailsForm: TradeDetailsForm;
  verificationForm: TradeVerificationForm;
  onVerificationChange: (field: keyof TradeVerificationForm, value: any) => void;
  initiator: TradeUser;
  counterparty: TradeUser;
  calculatedCredits: number;
  isHighValue: boolean;
}

export const Step3Review: React.FC<Step3ReviewProps> = ({
  detailsForm,
  verificationForm,
  onVerificationChange,
  initiator,
  counterparty,
  calculatedCredits,
  isHighValue
}) => {
  return (
    <div className="space-y-6">
      {/* Trade Summary */}
      <Card className="border-[#0056D2]/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#0056D2]">
            <Users className="h-5 w-5" />
            Trade Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Participants */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={initiator.avatar} alt={initiator.name} />
                <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] font-bold">
                  {initiator.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                  {initiator.name}
                </div>
                <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                  {detailsForm.role === 'taught' ? 'Teacher' : detailsForm.role === 'learned' ? 'Student' : 'Exchange Partner'}
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 bg-[#0056D2]/10 rounded-full flex items-center justify-center mx-auto mb-1">
                <Star className="h-4 w-4 text-[#0056D2]" />
              </div>
              <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Trade</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                  {counterparty.name}
                </div>
                <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                  {detailsForm.role === 'taught' ? 'Student' : detailsForm.role === 'learned' ? 'Teacher' : 'Exchange Partner'}
                </div>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src={counterparty.avatar} alt={counterparty.name} />
                <AvatarFallback className="bg-[#06B6D4]/10 text-[#06B6D4] font-bold">
                  {counterparty.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <Separator />

          {/* Trade Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#64748B] dark:text-[#94A3B8]">Skill:</span>
              <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                {detailsForm.skill}
              </div>
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#94A3B8]">Duration:</span>
              <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                {Math.floor(detailsForm.durationMins / 60)}h {detailsForm.durationMins % 60}m
              </div>
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#94A3B8]">When:</span>
              <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                {new Date(detailsForm.startedAt).toLocaleDateString()} at{' '}
                {new Date(detailsForm.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#94A3B8]">Where:</span>
              <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {detailsForm.location}
              </div>
            </div>
          </div>

          {/* Skill Tags */}
          {detailsForm.skillTags.length > 0 && (
            <div>
              <span className="text-[#64748B] dark:text-[#94A3B8] text-sm">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {detailsForm.skillTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {detailsForm.notes && (
            <div>
              <span className="text-[#64748B] dark:text-[#94A3B8] text-sm">Notes:</span>
              <div className="text-sm text-[#0F172A] dark:text-[#F1F5F9] mt-1 p-3 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg">
                {detailsForm.notes}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credit Transfer */}
      <Card className="border-[#06B6D4]/20 bg-[#06B6D4]/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#06B6D4]">
            <DollarSign className="h-5 w-5" />
            Credit Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
              Credits to transfer:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-[#06B6D4]">
                {detailsForm.creditsProposed}
              </span>
              {isHighValue && (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  High Value
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-2">
            {detailsForm.role === 'taught' 
              ? `You will receive ${detailsForm.creditsProposed} credits from ${counterparty.name}`
              : detailsForm.role === 'learned'
              ? `You will send ${detailsForm.creditsProposed} credits to ${counterparty.name}`
              : `Mutual exchange of skills and experience`
            }
          </div>

          {verificationForm.escrowEnabled && (
            <Alert className="mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Credits will be held in escrow until both parties confirm the trade.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Verification Method */}
      <Card className="border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
            {verificationForm.method === 'qr' ? <QrCode className="h-5 w-5" /> : <Hash className="h-5 w-5" />}
            Verification: {verificationForm.method === 'qr' ? 'QR Code' : '6-Digit PIN'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            {verificationForm.method === 'qr' 
              ? `${counterparty.name} will scan the QR code to confirm this trade.`
              : `${counterparty.name} will enter the 6-digit PIN to confirm this trade.`
            }
          </div>
        </CardContent>
      </Card>

      {/* Terms Agreement */}
      <Card className="border-[#E2E8F0]">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={verificationForm.agreeToTerms}
              onCheckedChange={(checked) => onVerificationChange('agreeToTerms', checked)}
              className="mt-1"
            />
            <div className="text-sm">
              <label className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                I agree to the{' '}
                <a href="/terms" className="text-[#0056D2] hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/trade-policy" className="text-[#0056D2] hover:underline">
                  Trade Policy
                </a>
              </label>
              <p className="text-[#64748B] dark:text-[#94A3B8] mt-1">
                By submitting this trade, you confirm that the information is accurate and 
                both parties participated in the described skill exchange.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Notice */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Next step:</strong> We'll notify {counterparty.name} to confirm this trade. 
          They have 24 hours to respond before it expires.
        </AlertDescription>
      </Alert>
    </div>
  );
};
