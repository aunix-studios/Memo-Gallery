import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageViewerProps {
  images: Array<{ id: string; blob: Blob; category: string }>;
  initialIndex: number;
  onClose: () => void;
}

export default function ImageViewer({ images, initialIndex, onClose }: ImageViewerProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [remainingEnhancements, setRemainingEnhancements] = useState<number | null>(null);

  const currentImage = images[currentIndex];
  const imageUrl = currentImage ? URL.createObjectURL(currentImage.blob) : '';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, images.length]);

  const handleShare = async () => {
    try {
      // Convert blob to file
      const file = new File([currentImage.blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Share Photo',
          text: 'Check out this photo from Memo Gallery!',
        });
        toast.success('Photo shared successfully!');
      } else {
        // Fallback: copy image to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/jpeg': currentImage.blob,
          }),
        ]);
        toast.success('Photo copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share photo');
    }
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.5, 4));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.5, 0.5));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `image-${currentImage.id}.jpg`;
    a.click();
  };

  const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  const handleEnhance = async () => {
    if (isEnhancing) return;

    setIsEnhancing(true);
    const enhanceToast = toast.loading(t('enhancing'));

    try {
      // Convert current image blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(currentImage.blob);
      });

      const imageData = await base64Promise;
      const deviceId = getDeviceId();

      const { data, error } = await supabase.functions.invoke('enhance-image', {
        body: { imageData, deviceId }
      });

      toast.dismiss(enhanceToast);

      if (error) {
        console.error('Enhancement error:', error);
        if (error.message?.includes('Daily limit reached') || error.message?.includes('429')) {
          toast.error(t('dailyLimitReached'));
        } else {
          toast.error(t('enhancementFailed'));
        }
        return;
      }

      if (data?.enhancedImage) {
        // Convert base64 to blob
        const response = await fetch(data.enhancedImage);
        const blob = await response.blob();
        
        // Replace current image with enhanced version
        images[currentIndex] = {
          ...currentImage,
          blob
        };

        // Force re-render
        setCurrentIndex(currentIndex);
        setRemainingEnhancements(data.remainingEnhancements);
        toast.success(data.message || t('enhancementSuccess'));
      } else {
        toast.error(t('enhancementFailed'));
      }
    } catch (error) {
      toast.dismiss(enhanceToast);
      console.error('Enhancement error:', error);
      toast.error(t('enhancementFailed'));
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fade-in">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 glass">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {images.length}
          </span>
          <span className="text-sm text-primary">• {currentImage.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleEnhance}
            disabled={isEnhancing}
            className="hover:text-primary transition-smooth gap-2"
          >
            <Sparkles className={`h-4 w-4 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('enhance')}</span>
            {remainingEnhancements !== null && (
              <span className="text-xs opacity-70">({remainingEnhancements}/20)</span>
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare} className="hover:text-primary transition-smooth">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-5 w-5" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[4ch] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Image Container */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={imageUrl}
          alt=""
          className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
          draggable={false}
        />
      </div>

      {/* Navigation */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full glass hover:scale-110 transition-smooth"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}
      {currentIndex < images.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full glass hover:scale-110 transition-smooth"
          onClick={handleNext}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}
    </div>
  );
}
