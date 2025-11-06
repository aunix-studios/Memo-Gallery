import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { History, RefreshCw, Sparkles, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface AIGeneration {
  id: string;
  prompt: string;
  image_url: string;
  credits_used: number;
  created_at: string;
}

interface AIHistoryProps {
  userId: string;
  onRerun: (prompt: string) => void;
  onVariation: (prompt: string) => void;
}

export default function AIHistory({ userId, onRerun, onVariation }: AIHistoryProps) {
  const [history, setHistory] = useState<AIGeneration[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && userId) {
      loadHistory();
    }
  }, [open, userId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load AI history');
    } finally {
      setLoading(false);
    }
  };

  const handleRerun = (prompt: string) => {
    onRerun(prompt);
    setOpen(false);
    toast.success('Re-running with same prompt...');
  };

  const handleVariation = (prompt: string) => {
    // Create a variation by adding some modifiers
    const variations = [
      `${prompt}, different style`,
      `${prompt}, alternative version`,
      `${prompt}, unique perspective`,
      `${prompt}, enhanced details`,
      `${prompt}, creative interpretation`,
    ];
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    onVariation(randomVariation);
    setOpen(false);
    toast.success('Creating variation...');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[540px] sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>AI Generation History</SheetTitle>
          <SheetDescription>
            View and re-run your past AI creations
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No AI generations yet</p>
              <p className="text-sm mt-1">Start creating to build your history!</p>
            </div>
          ) : (
            <div className="space-y-4 pr-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden bg-card hover:border-primary/50 transition-all group"
                >
                  <div className="relative aspect-square">
                    <img
                      src={item.image_url}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRerun(item.prompt)}
                        className="bg-primary/90 hover:bg-primary"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Re-run
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleVariation(item.prompt)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Variation
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-sm line-clamp-2">{item.prompt}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {item.credits_used} credits
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
