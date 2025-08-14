import React, { useState } from 'react';
import { Plus, ExternalLink, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { skillsApi } from '@/services/skills-api';
import {
  type SuggestSkillModalProps,
  type CreateSkillSuggestionRequest,
  type SkillCategory,
  SKILL_CATEGORIES,
  isValidSkillName,
} from '@/models/skill-types';

interface FormData {
  name: string;
  category: SkillCategory | '';
  description: string;
  references: string[];
}

interface FormErrors {
  name?: string;
  category?: string;
  description?: string;
  references?: string;
}

export function SuggestSkillModal({
  isOpen,
  onClose,
  onSubmit,
  suggestedName = '',
}: SuggestSkillModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: suggestedName,
    category: '',
    description: '',
    references: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [newReference, setNewReference] = useState('');

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: suggestedName,
        category: '',
        description: '',
        references: [],
      });
      setErrors({});
      setNewReference('');
    }
  }, [isOpen, suggestedName]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Skill name is required';
    } else if (!isValidSkillName(formData.name)) {
      newErrors.name = 'Skill name must be 2-60 characters and contain only letters, numbers, spaces, and basic punctuation';
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Please explain why this skill matters';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Please provide a more detailed description (at least 20 characters)';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Validate references (optional but if provided, must be valid URLs)
    for (const ref of formData.references) {
      try {
        new URL(ref);
      } catch {
        newErrors.references = 'All reference links must be valid URLs';
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const suggestion: CreateSkillSuggestionRequest = {
        name: formData.name.trim(),
        category: formData.category as SkillCategory,
        description: formData.description.trim(),
        references: formData.references.length > 0 ? formData.references : undefined,
      };

      await skillsApi.suggestSkill(suggestion);

      toast({
        title: "Thank you!",
        description: "We'll review your skill suggestion and notify you when it's approved.",
      });

      onSubmit(suggestion);
      onClose();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit skill suggestion",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReference = () => {
    const url = newReference.trim();
    if (!url) return;

    try {
      new URL(url);
      if (!formData.references.includes(url)) {
        setFormData(prev => ({
          ...prev,
          references: [...prev.references, url],
        }));
      }
      setNewReference('');
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
    }
  };

  const handleRemoveReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      handleAddReference();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Suggest a New Skill
          </DialogTitle>
          <DialogDescription>
            Help grow our skill library! Suggest a skill that's missing from our platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill Name */}
          <div className="space-y-2">
            <Label htmlFor="skill-name">
              Skill Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="skill-name"
              placeholder="e.g., Svelte, 3D Printing, Portuguese"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="skill-category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: SkillCategory) => 
                setFormData(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger id="skill-category" className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="Select the best category" />
              </SelectTrigger>
              <SelectContent>
                {SKILL_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="skill-description">
              Why does this skill matter? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="skill-description"
              placeholder="Explain why this skill would be valuable to learn or teach. What makes it unique or in-demand?"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={cn(
                "min-h-[100px] resize-none",
                errors.description ? "border-destructive" : ""
              )}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{errors.description || ''}</span>
              <span>{formData.description.length}/500</span>
            </div>
          </div>

          {/* References */}
          <div className="space-y-2">
            <Label htmlFor="skill-references">
              Supporting Links (optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="skill-references"
                placeholder="https://example.com"
                value={newReference}
                onChange={(e) => setNewReference(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddReference}
                disabled={!newReference.trim()}
              >
                Add
              </Button>
            </div>
            {errors.references && (
              <p className="text-sm text-destructive">{errors.references}</p>
            )}
            
            {/* Reference list */}
            {formData.references.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">References:</p>
                {formData.references.map((ref, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="flex-1 justify-between">
                      <span className="truncate flex-1 text-left">{ref}</span>
                      <div className="flex gap-1 ml-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0.5"
                          onClick={() => window.open(ref, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0.5"
                          onClick={() => handleRemoveReference(index)}
                        >
                          ×
                        </Button>
                      </div>
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Help text */}
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <p className="font-medium mb-1">Tips for a great suggestion:</p>
            <ul className="space-y-1">
              <li>• Be specific (e.g., "React Native" instead of "Mobile Development")</li>
              <li>• Include relevant learning resources or documentation links</li>
              <li>• Explain the skill's relevance in today's market</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Suggestion
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SuggestSkillModal;
