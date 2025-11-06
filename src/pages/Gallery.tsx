import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Camera,
  LogOut,
  Search,
  Trash2,
  Download,
  CheckSquare,
  X,
  Eye,
  Book,
  Globe,
  Upload as UploadIcon,
  Sparkles,
  Play,
  Heart,
  Filter,
  User,
  Settings as SettingsIcon,
} from 'lucide-react';
import { getAllImages, getAllCategories, deleteImages, toggleFavorite } from '@/lib/indexedDB';
import { toast } from 'sonner';
import JSZip from 'jszip';
import ImageViewer from '@/components/ImageViewer';
import VideoPlayer from '@/components/VideoPlayer';
import ImageActions from '@/components/ImageActions';

interface ImageData {
  id: string;
  blob: Blob;
  category: string;
  timestamp: number;
  width: number;
  height: number;
  sizeBytes: number;
  type?: 'image' | 'video';
  duration?: number;
  favorite?: boolean;
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
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const [images, setImages] = useState<ImageData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

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
    const matchesFavorite = !showFavoritesOnly || img.favorite;
    return matchesCategory && matchesSearch && matchesFavorite;
  });

  const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      await toggleFavorite(id);
      const updatedImages = images.map(img => 
        img.id === id ? { ...img, favorite: !img.favorite } : img
      );
      setImages(updatedImages);
      toast.success('Updated!');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update');
    }
  };

  const toggleImageSelection = (id: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedImages(newSelection);
  };

  const handleImageClick = (index: number) => {
    if (!selectionMode) {
      setViewerIndex(index);
      setViewerOpen(true);
    }
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
              <h1 className="text-2xl font-bold">{t('myGallery')}</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigate('/how-to-use')} title={t('howToUse')}>
                <Book className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass">
                  {availableLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={language === lang.code ? 'bg-primary/20' : ''}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={() => navigate('/settings')} title="Settings">
                <SettingsIcon className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigate('/account')} title="Account">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPhotos')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              <Badge
                variant={selectedCategory === null ? 'default' : 'outline'}
                className="cursor-pointer transition-smooth animated-gradient"
                onClick={() => setSelectedCategory(null)}
              >
                {t('allCategories')} ({images.length})
              </Badge>
              <Badge
                variant={showFavoritesOnly ? 'default' : 'outline'}
                className="cursor-pointer transition-smooth"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Heart className={`h-3 w-3 mr-1 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                Favorites ({images.filter(img => img.favorite).length})
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
                {t('selectMultiple')}
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
                  {t('cancel')}
                </Button>
                {selectedImages.size > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadSelected}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('downloadSelected')} ({selectedImages.size})
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteSelected}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('deleteSelected')} ({selectedImages.size})
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/memo-ai')}
              variant="outline"
              className="border-primary/50 hover:border-primary"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Memo AI
            </Button>
            <Button onClick={() => navigate('/upload')} className="animated-gradient">
              <Camera className="h-4 w-4 mr-2" />
              {t('upload')}
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">{t('noImages')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('startUploading')}
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => navigate('/memo-ai')}
                variant="outline"
                className="border-primary/50 hover:border-primary"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
              <Button onClick={() => navigate('/upload')} className="animated-gradient">
                <Camera className="h-4 w-4 mr-2" />
                {t('uploadPhotos')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredImages.map((img, index) => {
              const isSelected = selectedImages.has(img.id);
              const url = URL.createObjectURL(img.blob);
              
              return (
                 <div
                  key={img.id}
                  className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-smooth hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 ${
                    isSelected ? 'ring-4 ring-primary' : ''
                  }`}
                  onClick={() => selectionMode ? toggleImageSelection(img.id) : handleImageClick(index)}
                >
                  {img.type === 'video' ? (
                    <>
                      <video src={url} className="w-full h-full object-cover" muted />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <Play className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                      {img.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {Math.floor(img.duration / 60)}:{String(Math.floor(img.duration % 60)).padStart(2, '0')}
                        </div>
                      )}
                    </>
                  ) : (
                    <img src={url} alt="" className="w-full h-full object-cover transition-smooth" />
                  )}
                  
                  {/* Favorite heart */}
                  {!selectionMode && (
                    <button
                      onClick={(e) => handleToggleFavorite(img.id, e)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                    >
                      <Heart
                        className={`h-5 w-5 ${img.favorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
                      />
                    </button>
                  )}
                  
                  {!selectionMode && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  )}
                  {selectionMode && (
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-smooth ${
                          isSelected
                            ? 'bg-primary border-primary scale-110'
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

      {viewerOpen && (
      <ImageViewer
        images={filteredImages}
        initialIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
        onFavoriteToggle={(id) => {
          const updatedImages = images.map(img => 
            img.id === id ? { ...img, favorite: !img.favorite } : img
          );
          setImages(updatedImages);
        }}
      />
      )}
    </div>
  );
}
