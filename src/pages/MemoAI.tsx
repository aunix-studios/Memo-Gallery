import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Sparkles, Download, Share2, FolderPlus, ArrowLeft, Coins, Upload, Image as ImageIcon, Wand2, User, Plus, Settings } from 'lucide-react';
import { saveImage } from '@/lib/indexedDB';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import GallerySelector from '@/components/GallerySelector';
import AIHistory from '@/components/AIHistory';

export default function MemoAI() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const plusFileInputRef = useRef<HTMLInputElement>(null);
  
  // Mode state
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  
  // Generation state
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Edit mode state
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceBlob, setSourceBlob] = useState<Blob | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  
  // UI state
  const [credits, setCredits] = useState<number>(100000);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showGallerySelector, setShowGallerySelector] = useState(false);
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
      .eq('user_id', user.id)
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

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (credits < 10) {
      toast.error('Insufficient credits. Credits reset daily at midnight.');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);
    if (customPrompt) {
      setPrompt(customPrompt);
      setMode('generate');
    }

    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-image', {
        body: { prompt: finalPrompt.trim() }
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
    const imageToDownload = mode === 'generate' ? generatedImage : editedImage;
    if (!imageToDownload) return;

    try {
      const response = await fetch(imageToDownload);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memo-ai-${mode}-${Date.now()}.png`;
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
    const imageToShare = mode === 'generate' ? generatedImage : editedImage;
    if (!imageToShare) return;

    try {
      const response = await fetch(imageToShare);
      const blob = await response.blob();
      const file = new File([blob], `memo-ai-${mode}-${Date.now()}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Memo AI ${mode === 'generate' ? 'Generated' : 'Edited'} Image`,
          text: mode === 'generate' ? `Generated with prompt: ${prompt}` : `Edited with AI`
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let finalFile = file;
    // Convert HEIC/HEIF to JPEG
    if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
      try {
        const heic2any = (await import('heic2any')).default as any;
        const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
        const jpegBlob = converted instanceof Blob ? converted : new Blob([converted], { type: 'image/jpeg' });
        finalFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
      } catch (err) {
        console.error('HEIC conversion failed:', err);
        toast.error('Unsupported image format. Please use JPG/PNG/WEBP.');
        return;
      }
    }

    if (!finalFile.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Compress large images client-side to avoid edge function limits
    const compressIfNeeded = async (blob: Blob) => {
      if (blob.size <= 9.5 * 1024 * 1024) return blob; // ~9.5MB
      try {
        const imgBitmap = await createImageBitmap(blob);
        const maxDim = 2048;
        const ratio = Math.min(1, maxDim / Math.max(imgBitmap.width, imgBitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(imgBitmap.width * ratio);
        canvas.height = Math.round(imgBitmap.height * ratio);
        const ctx = canvas.getContext('2d');
        if (!ctx) return blob;
        ctx.drawImage(imgBitmap, 0, 0, canvas.width, canvas.height);
        const compressed = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85)
        );
        return compressed || blob;
      } catch {
        return blob;
      }
    };

    const maybeCompressed = await compressIfNeeded(finalFile);

    const url = URL.createObjectURL(maybeCompressed);
    setSourceImage(url);
    setSourceBlob(new File([maybeCompressed], finalFile.name.replace(/\.(png|webp)$/i, '.jpg')));
    setEditedImage(null);
    setMode('edit');
    toast.success('Image loaded! Add an edit prompt below.');
  };

  const handleGallerySelect = (url: string, blob: Blob) => {
    setSourceImage(url);
    setSourceBlob(blob);
    setEditedImage(null);
    setMode('edit');
    toast.success('Image selected! Add an edit prompt below.');
  };

  const handleEnhance = async () => {
    if (!sourceBlob) {
      toast.error('Please select an image first');
      return;
    }

    if (credits < 5) {
      toast.error('Insufficient credits. Need 5 credits to enhance.');
      return;
    }

    setEnhancing(true);
    try {
      // Convert blob to base64 with full data URL
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string); // Keep full data URL
        };
      });
      reader.readAsDataURL(sourceBlob);
      let imageData = await base64Promise;

      // Get device ID
      let deviceId = localStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('device_id', deviceId);
      }

      const { data, error } = await supabase.functions.invoke('enhance-image', {
        body: { 
          imageData: imageData,
          deviceId: deviceId
        }
      });

      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setEditedImage(data.enhancedImage);
      setCredits(prev => prev - 5);
      toast.success('Image enhanced! 5 credits used.');
    } catch (error: any) {
      console.error('Enhancement error:', error);
      toast.error(error.message || 'Failed to enhance image');
    } finally {
      setEnhancing(false);
    }
  };

  const handleEdit = async () => {
    if (!sourceBlob || !editPrompt.trim()) {
      toast.error('Please select an image and add an edit prompt');
      return;
    }

    if (credits < 10) {
      toast.error('Insufficient credits. Need 10 credits to edit.');
      return;
    }

    setLoading(true);
    try {
      // Convert blob to base64 with full data URL
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string); // Keep full data URL
        };
      });
      reader.readAsDataURL(sourceBlob);
      const imageData = await base64Promise;

      const { data, error } = await supabase.functions.invoke('edit-image', {
        body: { 
          imageData: imageData,
          prompt: editPrompt.trim()
        }
      });

      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setEditedImage(data.editedImage);
      setCredits(data.credits);
      toast.success(`Image edited! ${data.credits} credits remaining`);
    } catch (error: any) {
      console.error('Edit error:', error);
      toast.error(error.message || 'Failed to edit image');
    } finally {
      setLoading(false);
    }
  };

  const saveToGallery = async () => {
    const imageToSave = mode === 'generate' ? generatedImage : editedImage;
    
    if (!imageToSave || !imageName.trim() || !imageCategory.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(imageToSave);
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
    <div className="min-h-screen bg-background page-transition">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 animate-slide-down">
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
          
          <div className="flex items-center gap-2">
            {user && (
              <AIHistory
                userId={user.id}
                onRerun={(prompt) => handleGenerate(prompt)}
                onVariation={(prompt) => handleGenerate(prompt)}
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/account')}
              title="Account"
            >
              <User className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-semibold">{credits.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">credits</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'generate' | 'edit')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="edit">
                <Wand2 className="mr-2 h-4 w-4" />
                Edit Image
              </TabsTrigger>
            </TabsList>

            {/* Generate Tab */}
            <TabsContent value="generate" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="prompt">Describe your image</Label>
                <div className="relative">
                  <Textarea
                    id="prompt"
                    placeholder="A beautiful sunset over mountains, vibrant colors, detailed landscape..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px] mt-2 pr-12"
                    maxLength={500}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Add image"
                      onClick={() => plusFileInputRef.current?.click()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setShowGallerySelector(true); setMode('edit'); }}
                    >
                      From Gallery
                    </Button>
                  </div>
                </div>
                <input
                  ref={plusFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {prompt.length}/500 characters
                </p>
              </div>

              <Button
                onClick={() => handleGenerate()}
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

              {generatedImage && (
                <div className="space-y-4 mt-6 animate-scale-in">
                  <div className="relative rounded-lg overflow-hidden border bg-card card-hover">
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="w-full h-auto transition-transform hover:scale-105"
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
            </TabsContent>

            {/* Edit Tab */}
            <TabsContent value="edit" className="space-y-4 mt-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="space-y-4">
                <Label>Select Image Source</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-24"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8" />
                      <span>Upload Photo</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowGallerySelector(true)}
                    className="h-24"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="h-8 w-8" />
                      <span>From Gallery</span>
                    </div>
                  </Button>
                </div>
              </div>

              {sourceImage && (
                <>
                  <div className="space-y-4 animate-fade-in">
                    <Label>Original Image</Label>
                    <div className="relative rounded-lg overflow-hidden border bg-card card-hover">
                      <img
                        src={sourceImage}
                        alt="Source"
                        className="w-full h-auto transition-transform hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleEnhance}
                      disabled={enhancing || credits < 5}
                      variant="outline"
                      className="flex-1"
                    >
                      {enhancing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Quick Enhance (5 credits)
                        </>
                      )}
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="editPrompt">Edit Instructions (Optional)</Label>
                    <Textarea
                      id="editPrompt"
                      placeholder="Make it more vibrant, add sunset lighting, remove background..."
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      className="min-h-[80px] mt-2"
                      maxLength={300}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {editPrompt.length}/300 characters
                    </p>
                  </div>

                  <Button
                    onClick={handleEdit}
                    disabled={loading || credits < 10}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Editing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Edit with AI (10 credits)
                      </>
                    )}
                  </Button>

                  {editedImage && (
                    <div className="space-y-4 mt-6 animate-scale-in">
                      <Label>Edited Result</Label>
                      <div className="relative rounded-lg overflow-hidden border bg-card card-hover">
                        <img
                          src={editedImage}
                          alt="Edited"
                          className="w-full h-auto transition-transform hover:scale-105"
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
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Gallery Selector */}
      <GallerySelector
        open={showGallerySelector}
        onOpenChange={setShowGallerySelector}
        onSelectImage={handleGallerySelect}
      />

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
