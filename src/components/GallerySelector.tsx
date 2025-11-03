import { useState, useEffect } from 'react';
import { getAllImages } from '@/lib/indexedDB';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface ImageData {
  id: string;
  blob: Blob;
  category: string;
  timestamp: number;
  width: number;
  height: number;
  type?: 'image' | 'video';
}

interface GallerySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (imageUrl: string, blob: Blob) => void;
}

export default function GallerySelector({ open, onOpenChange, onSelectImage }: GallerySelectorProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open]);

  const loadImages = async () => {
    const allImages = await getAllImages();
    // Only show images, not videos
    setImages(allImages.filter(img => img.type === 'image' || !img.type));
  };

  const handleSelect = (image: ImageData) => {
    setSelectedId(image.id);
    const url = URL.createObjectURL(image.blob);
    onSelectImage(url, image.blob);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select from Gallery</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh]">
          <div className="grid grid-cols-3 gap-4 p-4">
            {images.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                No images in gallery yet
              </div>
            ) : (
              images.map((image) => {
                const url = URL.createObjectURL(image.blob);
                return (
                  <div
                    key={image.id}
                    className="relative aspect-square cursor-pointer group"
                    onClick={() => handleSelect(image)}
                  >
                    <img
                      src={url}
                      alt={image.category}
                      className="w-full h-full object-cover rounded-lg border-2 border-transparent group-hover:border-primary transition-all"
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                    {selectedId === image.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-lg">
                        <CheckCircle2 className="h-12 w-12 text-primary" />
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2 text-xs">
                      {image.category}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
