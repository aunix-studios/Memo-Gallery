import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Sparkles, Download, Share2, FolderPlus, ArrowLeft, Coins } from 'lucide-react';
import { saveImage } from '@/lib/indexedDB';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MemoAI() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(100000);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageCategory, setImageCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadCredits();
    loadCategories();
  }, [user]);

  const loadCredits = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_credits')
      .select('credits, last_reset_date')
      .eq('user_id', user.uid)
      .maybeSingle();

    if (error) {
      console.error('Error loading credits:', error);
      return;
    }

    if (data) {
      // Check if reset needed
      const lastReset = new Date(data.last_reset_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (lastReset < today) {
        setCredits(100000);
      } else {
        setCredits(data.credits);
      }
    } else {
      setCredits(100000);
    }
  };

  const loadCategories = async () => {
    try {
      const { getAllCategories } = await import('@/lib/indexedDB');
      const cats = await getAllCategories();
      setCategories(cats.map(c => c.name));
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (credits < 10) {
      toast.error('Insufficient credits. Credits reset daily at midnight.');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-image', {
        body: { prompt: prompt.trim() }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        if (data.credits !== undefined) {
          setCredits(data.credits);
        }
        return;
      }

      setGeneratedImage(data.imageUrl);
      setCredits(data.credits);
      toast.success(`Image generated! ${data.credits} credits remaining`);
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memo-ai-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  const handleShare = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], `memo-ai-${Date.now()}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Memo AI Generated Image',
          text: `Generated with prompt: ${prompt}`
        });
        toast.success('Image shared!');
      } else {
        toast.info('Sharing not supported. Try downloading instead.');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share image');
    }
  };

  const handleSaveToGallery = () => {
    setShowSaveDialog(true);
  };

  const saveToGallery = async () => {
    if (!generatedImage || !imageName.trim() || !imageCategory.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imageId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await saveImage(imageId, blob, imageCategory, img.width, img.height);
      
      toast.success(`Saved to ${imageCategory} category!`);
      setShowSaveDialog(false);
      setImageName('');
      setImageCategory('');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save to gallery');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/gallery')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Memo AI</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
            <Coins className="h-5 w-5 text-primary" />
            <span className="font-semibold">{credits.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">credits</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Prompt Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">Describe your image</Label>
              <Textarea
                id="prompt"
                placeholder="A beautiful sunset over mountains, vibrant colors, detailed landscape..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] mt-2"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {prompt.length}/500 characters
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || credits < 10}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Image (10 credits)
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Credits reset daily at midnight • {Math.floor(credits / 10)} images remaining
            </p>
          </div>

          {/* Generated Image */}
          {generatedImage && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border bg-card">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-auto"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleDownload} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button onClick={handleSaveToGallery} variant="default" className="flex-1">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Add to Gallery
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Save to Gallery Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to Gallery</DialogTitle>
            <DialogDescription>
              Choose a category and name for your generated image
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="imageName">Image Name</Label>
              <Input
                id="imageName"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                placeholder="My AI Creation"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <div className="mt-2 space-y-2">
                <Input
                  id="category"
                  value={imageCategory}
                  onChange={(e) => setImageCategory(e.target.value)}
                  placeholder="Enter category name"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={saveToGallery}
                disabled={!imageName.trim() || !imageCategory.trim()}
                className="flex-1"
              >
                Save to Gallery
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
