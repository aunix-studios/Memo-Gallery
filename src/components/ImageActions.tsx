import { Heart, Share2, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageActionsProps {
  imageUrl: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  fileName?: string;
  shareText?: string;
}

export default function ImageActions({
  imageUrl,
  isFavorite,
  onToggleFavorite,
  onDelete,
  fileName = 'memo-gallery-image',
  shareText = 'Check out this image from Memo Gallery!'
}: ImageActionsProps) {
  
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download');
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `${fileName}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: shareText
        });
        toast.success('Shared!');
      } else {
        // Fallback: copy URL to clipboard if available
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          toast.info('Link copied to clipboard!');
        } else {
          toast.info('Sharing not supported. Try downloading instead.');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      if ((error as any).name !== 'AbortError') {
        toast.error('Failed to share');
      }
    }
  };

  return (
    <div className="flex gap-2">
      {onToggleFavorite && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleFavorite}
          className="hover:scale-110 transition-transform"
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
          />
        </Button>
      )}
      
      <Button
        size="icon"
        variant="ghost"
        onClick={handleShare}
        className="hover:scale-110 transition-transform"
      >
        <Share2 className="h-5 w-5" />
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={handleDownload}
        className="hover:scale-110 transition-transform"
      >
        <Download className="h-5 w-5" />
      </Button>
      
      {onDelete && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onDelete}
          className="hover:scale-110 transition-transform text-destructive"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
