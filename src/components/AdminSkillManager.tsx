import React, { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Star,
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { SkillBadge } from '@/components/SkillBadge';
import { skillsApi } from '@/services/skills-api';
import {
  type Skill,
  type SkillSuggestion,
  type CreateSkillRequest,
  type UpdateSkillRequest,
  type SkillCategory,
  type SkillStatus,
  SKILL_CATEGORIES,
  SKILL_STATUSES,
  generateSkillSlug,
} from '@/models/skill-types';

// Bulk import modal
interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

function BulkImportModal({ isOpen, onClose, onImport }: BulkImportModalProps) {
  const [importText, setImportText] = useState('');
  const [importFormat, setImportFormat] = useState<'csv' | 'json'>('csv');
  const { toast } = useToast();

  const handleImport = () => {
    try {
      let data: any[] = [];
      
      if (importFormat === 'csv') {
        const lines = importText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }
      } else {
        data = JSON.parse(importText);
      }

      onImport(data);
      onClose();
      setImportText('');
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Please check your data format and try again.",
        variant: "destructive",
      });
    }
  };

  const csvExample = `name,category,aliases,isFeatured,status
React,Development,"react.js,reactjs",true,active
Figma,Design,"fig ma,figma design",true,active`;

  const jsonExample = `[
  {
    "name": "React",
    "category": "Development",
    "aliases": ["react.js", "reactjs"],
    "isFeatured": true,
    "status": "active"
  }
]`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Skills</DialogTitle>
          <DialogDescription>
            Import multiple skills at once using CSV or JSON format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Import Format</Label>
            <Select value={importFormat} onValueChange={(value: 'csv' | 'json') => setImportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Textarea
              placeholder={importFormat === 'csv' ? csvExample : jsonExample}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Format:</p>
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
              {importFormat === 'csv' ? csvExample : jsonExample}
            </pre>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport} disabled={!importText.trim()}>
            Import Skills
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Skill edit modal
interface SkillEditModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateSkillRequest | UpdateSkillRequest) => void;
}

function SkillEditModal({ skill, isOpen, onClose, onSave }: SkillEditModalProps) {
  const [formData, setFormData] = useState<CreateSkillRequest>({
    name: '',
    category: 'Development',
    subcategories: [],
    aliases: [],
    description: '',
    isFeatured: false,
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        slug: skill.slug,
        category: skill.category,
        subcategories: skill.subcategories,
        aliases: skill.aliases,
        description: skill.description || '',
        isFeatured: skill.isFeatured,
        icon: skill.icon,
        verifiedTestId: skill.verifiedTestId,
      });
    } else {
      setFormData({
        name: '',
        category: 'Development',
        subcategories: [],
        aliases: [],
        description: '',
        isFeatured: false,
      });
    }
  }, [skill]);

  const handleSave = () => {
    if (skill) {
      onSave({ ...formData, id: skill.id } as UpdateSkillRequest);
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{skill ? 'Edit Skill' : 'Create Skill'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., React"
            />
          </div>

          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={formData.slug || generateSkillSlug(formData.name)}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="e.g., react"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: SkillCategory) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SKILL_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Aliases (comma-separated)</Label>
            <Input
              value={formData.aliases?.join(', ') || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                aliases: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
              }))}
              placeholder="e.g., react.js, reactjs"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this skill..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
            />
            <Label htmlFor="featured">Featured Skill</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main AdminSkillManager component
export function AdminSkillManager() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<SkillStatus | ''>('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [skillsResponse, suggestionsResponse] = await Promise.all([
        skillsApi.searchSkills({ limit: 100 }),
        skillsApi.getSkillSuggestions(),
      ]);
      setSkills(skillsResponse.skills);
      setSuggestions(suggestionsResponse);
    } catch (error) {
      toast({
        title: "Failed to load data",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = !searchQuery || 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !categoryFilter || skill.category === categoryFilter;
    const matchesStatus = !statusFilter || skill.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  // Handlers
  const handleCreateSkill = async (data: CreateSkillRequest) => {
    try {
      const newSkill = await skillsApi.createSkill(data);
      setSkills(prev => [...prev, newSkill]);
      toast({ title: "Skill created successfully" });
    } catch (error) {
      toast({
        title: "Failed to create skill",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSkill = async (data: UpdateSkillRequest) => {
    try {
      const updatedSkill = await skillsApi.updateSkill(data);
      setSkills(prev => prev.map(s => s.id === data.id ? updatedSkill : s));
      toast({ title: "Skill updated successfully" });
    } catch (error) {
      toast({
        title: "Failed to update skill",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (skill: Skill) => {
    await handleUpdateSkill({
      id: skill.id,
      isFeatured: !skill.isFeatured,
    });
  };

  const handleToggleStatus = async (skill: Skill) => {
    const newStatus: SkillStatus = skill.status === 'active' ? 'hidden' : 'active';
    await handleUpdateSkill({
      id: skill.id,
      status: newStatus,
    });
  };

  const handleBulkImport = async (data: any[]) => {
    try {
      const result = await skillsApi.bulkImportSkills({ skills: data });
      toast({
        title: "Bulk import completed",
        description: `Created ${result.created} skills. ${result.errors.length} errors.`,
      });
      await loadData();
    } catch (error) {
      toast({
        title: "Bulk import failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleReviewSuggestion = async (suggestionId: string, action: 'approve' | 'reject') => {
    try {
      await skillsApi.reviewSkillSuggestion(suggestionId, action);
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      toast({
        title: `Suggestion ${action}d`,
        description: action === 'approve' ? "New skill has been created" : "Suggestion has been rejected",
      });
      if (action === 'approve') {
        await loadData(); // Reload to show new skill
      }
    } catch (error) {
      toast({
        title: `Failed to ${action} suggestion`,
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skill Management</h1>
          <p className="text-muted-foreground">
            Manage skills, review suggestions, and import bulk data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkImport(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={() => { setEditingSkill(null); setShowEditModal(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Skill
          </Button>
        </div>
      </div>

      <Tabs defaultValue="skills" className="space-y-4">
        <TabsList>
          <TabsTrigger value="skills">Skills ({filteredSkills.length})</TabsTrigger>
          <TabsTrigger value="suggestions">
            Suggestions ({pendingSuggestions.length})
            {pendingSuggestions.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                {pendingSuggestions.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={(value: SkillCategory | '') => setCategoryFilter(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {SKILL_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value: SkillStatus | '') => setStatusFilter(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All status</SelectItem>
                    {SKILL_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Skills Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Aliases</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <SkillBadge skill={skill} size="sm" />
                        {skill.isFeatured && <Star className="w-4 h-4 text-amber-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{skill.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-muted-foreground">
                        {skill.aliases.join(', ') || 'None'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={skill.status === 'active' ? 'default' : 'secondary'}>
                        {skill.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingSkill(skill); setShowEditModal(true); }}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(skill)}>
                            <Star className="w-4 h-4 mr-2" />
                            {skill.isFeatured ? 'Remove from featured' : 'Make featured'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(skill)}>
                            {skill.status === 'active' ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                            {skill.status === 'active' ? 'Hide' : 'Show'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          {pendingSuggestions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending suggestions</h3>
                <p className="text-muted-foreground">All skill suggestions have been reviewed.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingSuggestions.map((suggestion) => (
                <Card key={suggestion.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{suggestion.name}</CardTitle>
                        <CardDescription>
                          Category: {suggestion.category} • 
                          Suggested on {new Date(suggestion.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleReviewSuggestion(suggestion.id, 'approve')}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewSuggestion(suggestion.id, 'reject')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      </div>
                      {suggestion.references && suggestion.references.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">References</h4>
                          <div className="flex flex-wrap gap-2">
                            {suggestion.references.map((ref, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(ref, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Link {index + 1}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BulkImportModal
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        onImport={handleBulkImport}
      />

      <SkillEditModal
        skill={editingSkill}
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingSkill(null); }}
        onSave={editingSkill ? handleUpdateSkill : handleCreateSkill}
      />
    </div>
  );
}

export default AdminSkillManager;
