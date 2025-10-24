import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload as UploadIcon, Plus, Loader2, X, Camera } from 'lucide-react';
import { saveImage, saveCategory, getAllCategories, updateCategoryCounts } from '@/lib/indexedDB';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface PreviewImage {
  id: string;
  file: File;
  preview: string;
  width: number;
  height: number;
}

export default function Upload() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadCategories();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (cameraMode && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraMode, stream]);

  const loadCategories = async () => {
    const cats = await getAllCategories();
    setCategories(cats);
    if (cats.length > 0 && !selectedCategory) {
      setSelectedCategory(cats[0].id);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newPreviews = await Promise.all(
      files.map(async (file) => {
        return new Promise<PreviewImage>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              resolve({
                id: Math.random().toString(36).substr(2, 9),
                file,
                preview: e.target?.result as string,
                width: img.width,
                height: img.height,
              });
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      setCameraMode(true);
      toast.success('Camera ready!');
    } catch (error) {
      toast.error('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraMode(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        
        const img = new Image();
        img.onload = () => {
          setPreviews((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              file,
              preview: url,
              width: img.width,
              height: img.height,
            },
          ]);
          stopCamera();
          toast.success('Photo captured!');
        };
        img.src = url;
      }
    }, 'image/jpeg', 0.95);
  };

  const removePreview = (id: string) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    const colors = ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const id = newCategoryName.toLowerCase().replace(/\s+/g, '-');

    await saveCategory(id, newCategoryName, color);
    setNewCategoryName('');
    setShowNewCategory(false);
    await loadCategories();
    setSelectedCategory(id);
    toast.success('Category created!');
  };

  const handleUpload = async () => {
    if (previews.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    setUploading(true);

    try {
      for (const preview of previews) {
        const blob = await fetch(preview.preview).then((r) => r.blob());
        await saveImage(
          preview.id,
          blob,
          selectedCategory,
          preview.width,
          preview.height
        );
      }

      await updateCategoryCounts();
      toast.success(`Uploaded ${previews.length} image(s)!`);
      navigate('/gallery');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  if (cameraMode) {
    return (
      <div className="min-h-screen bg-black">
        <div className="relative h-screen">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <Button
            onClick={stopCamera}
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 glass text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
            <Button
              onClick={capturePhoto}
              size="lg"
              className="h-20 w-20 rounded-full animated-gradient hover:scale-110 transition-smooth shadow-2xl"
            >
              <Camera className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/gallery')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Upload Photos</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Add to Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-3">
              <Label>Category</Label>
              {categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id)}
                      className="transition-smooth hover:scale-105"
                      style={{
                        backgroundColor: selectedCategory === cat.id ? cat.color : 'transparent',
                        borderColor: cat.color,
                      }}
                    >
                      {cat.name}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCategory(!showNewCategory)}
                    className="transition-smooth hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowNewCategory(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Category
                </Button>
              )}

              {showNewCategory && (
                <div className="flex gap-2 animate-fade-in">
                  <Input
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-secondary/50"
                  />
                  <Button onClick={handleCreateCategory}>Create</Button>
                </div>
              )}
            </div>

            {/* Upload Options */}
            <div className="space-y-3">
              <Label>Add Photos</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload */}
                <div className="border-2 border-dashed border-primary/50 rounded-lg p-6 text-center hover:border-primary hover:scale-105 transition-smooth cursor-pointer bg-card/50">
                  <label className="cursor-pointer">
                    <UploadIcon className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="font-medium mb-1">Upload Files</p>
                    <p className="text-xs text-muted-foreground">From device</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>

                {/* Camera */}
                <div 
                  className="border-2 border-dashed border-primary/50 rounded-lg p-6 text-center hover:border-primary hover:scale-105 transition-smooth cursor-pointer bg-card/50"
                  onClick={startCamera}
                >
                  <Camera className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="font-medium mb-1">Take Photo</p>
                  <p className="text-xs text-muted-foreground">Use camera</p>
                </div>
              </div>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="animate-fade-in">
                <Label className="mb-3 block">Selected Photos ({previews.length})</Label>
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((preview) => (
                    <div key={preview.id} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img
                        src={preview.preview}
                        alt=""
                        className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                      />
                      <button
                        onClick={() => removePreview(preview.id)}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-smooth hover:scale-110"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={uploading || previews.length === 0 || !selectedCategory}
              className="w-full animated-gradient hover:scale-105 transition-smooth"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-5 w-5" />
                  Upload {previews.length > 0 && `${previews.length} Photo${previews.length > 1 ? 's' : ''}`}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
