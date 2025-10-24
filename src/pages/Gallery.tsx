import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  LogOut,
  Search,
  Trash2,
  Download,
  Grid3x3,
  CheckSquare,
  X,
} from 'lucide-react';
import { getAllImages, getAllCategories, deleteImages } from '@/lib/indexedDB';
import { toast } from 'sonner';
import JSZip from 'jszip';

interface ImageData {
  id: string;
  blob: Blob;
  category: string;
  timestamp: number;
  width: number;
  height: number;
  sizeBytes: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

export default function Gallery() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [imagesData, categoriesData] = await Promise.all([
        getAllImages(),
        getAllCategories(),
      ]);
      setImages(imagesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredImages = images.filter((img) => {
    const matchesCategory = !selectedCategory || img.category === selectedCategory;
    const matchesSearch = !searchQuery || img.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleImageSelection = (id: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedImages(newSelection);
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) return;
    
    if (!confirm(`Delete ${selectedImages.size} image(s)?`)) return;

    try {
      await deleteImages(Array.from(selectedImages));
      toast.success(`Deleted ${selectedImages.size} image(s)`);
      setSelectedImages(new Set());
      setSelectionMode(false);
      loadData();
    } catch (error) {
      toast.error('Failed to delete images');
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedImages.size === 0) return;

    try {
      if (selectedImages.size === 1) {
        // Single image download
        const img = images.find((i) => i.id === Array.from(selectedImages)[0]);
        if (img) {
          const url = URL.createObjectURL(img.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `image-${img.id}.jpg`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } else {
        // Multiple images - create ZIP
        const zip = new JSZip();
        const selectedImgs = images.filter((i) => selectedImages.has(i.id));
        
        for (const img of selectedImgs) {
          zip.file(`image-${img.id}.jpg`, img.blob);
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `memo-gallery-${Date.now()}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      }
      
      toast.success('Download complete!');
    } catch (error) {
      toast.error('Failed to download images');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Camera className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full animated-gradient flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Memo Gallery</h1>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={selectedCategory === null ? 'default' : 'outline'}
                className="cursor-pointer transition-smooth"
                onClick={() => setSelectedCategory(null)}
              >
                All ({images.length})
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  className="cursor-pointer transition-smooth"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    backgroundColor: selectedCategory === cat.id ? cat.color : 'transparent',
                    borderColor: cat.color,
                  }}
                >
                  {cat.name} ({cat.count})
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {!selectionMode ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectionMode(true)}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Select
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedImages(new Set());
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                {selectedImages.size > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadSelected}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download ({selectedImages.size})
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteSelected}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedImages.size})
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          <Button onClick={() => navigate('/upload')} className="animated-gradient">
            <Camera className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No images yet</h3>
            <p className="text-muted-foreground mb-6">
              Start uploading photos to build your collection
            </p>
            <Button onClick={() => navigate('/upload')} className="animated-gradient">
              <Camera className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredImages.map((img) => {
              const isSelected = selectedImages.has(img.id);
              const url = URL.createObjectURL(img.blob);
              
              return (
                <div
                  key={img.id}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-smooth hover:scale-105 ${
                    isSelected ? 'ring-4 ring-primary' : ''
                  }`}
                  onClick={() => selectionMode && toggleImageSelection(img.id)}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {selectionMode && (
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'bg-primary border-primary'
                            : 'bg-black/50 border-white'
                        }`}
                      >
                        {isSelected && <CheckSquare className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
