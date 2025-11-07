import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb } from 'lucide-react';

interface PromptTemplate {
  id: string;
  category: string;
  title: string;
  prompt: string;
  icon: string;
}

const promptTemplates: PromptTemplate[] = [
  // Portraits
  {
    id: 'portrait-1',
    category: 'Portraits',
    title: 'Professional Headshot',
    prompt: 'Professional headshot portrait, studio lighting, clean background, sharp focus, confident expression, business casual attire',
    icon: '👤'
  },
  {
    id: 'portrait-2',
    category: 'Portraits',
    title: 'Artistic Portrait',
    prompt: 'Artistic portrait with dramatic lighting, moody atmosphere, cinematic style, shallow depth of field, creative composition',
    icon: '🎨'
  },
  {
    id: 'portrait-3',
    category: 'Portraits',
    title: 'Fantasy Character',
    prompt: 'Fantasy character portrait, detailed costume design, mystical atmosphere, epic lighting, high detail, digital art style',
    icon: '🧙'
  },
  
  // Landscapes
  {
    id: 'landscape-1',
    category: 'Landscapes',
    title: 'Mountain Sunset',
    prompt: 'Breathtaking mountain landscape at sunset, golden hour lighting, vibrant orange and purple sky, dramatic clouds, reflection in lake',
    icon: '🏔️'
  },
  {
    id: 'landscape-2',
    category: 'Landscapes',
    title: 'Tropical Beach',
    prompt: 'Pristine tropical beach, crystal clear turquoise water, white sand, palm trees, sunny day, paradise island, photorealistic',
    icon: '🏝️'
  },
  {
    id: 'landscape-3',
    category: 'Landscapes',
    title: 'Northern Lights',
    prompt: 'Aurora borealis dancing over snowy landscape, vivid green and purple lights, starry sky, winter wonderland, magical atmosphere',
    icon: '🌌'
  },
  {
    id: 'landscape-4',
    category: 'Landscapes',
    title: 'Urban Cityscape',
    prompt: 'Modern city skyline at blue hour, illuminated skyscrapers, busy streets, urban architecture, cinematic wide angle view',
    icon: '🌆'
  },
  
  // Abstract
  {
    id: 'abstract-1',
    category: 'Abstract',
    title: 'Fluid Colors',
    prompt: 'Abstract fluid art, swirling colors, smooth gradients, vibrant hues blending together, liquid paint effect, artistic composition',
    icon: '🌈'
  },
  {
    id: 'abstract-2',
    category: 'Abstract',
    title: 'Geometric Patterns',
    prompt: 'Abstract geometric patterns, symmetrical design, bold colors, modern minimalist style, clean lines, mathematical precision',
    icon: '🔷'
  },
  {
    id: 'abstract-3',
    category: 'Abstract',
    title: 'Digital Cosmos',
    prompt: 'Abstract digital space, cosmic energy, glowing particles, nebula colors, futuristic atmosphere, ethereal lighting effects',
    icon: '✨'
  },
  
  // Nature
  {
    id: 'nature-1',
    category: 'Nature',
    title: 'Enchanted Forest',
    prompt: 'Magical enchanted forest, sunbeams through trees, misty atmosphere, lush green foliage, fairy tale mood, peaceful nature scene',
    icon: '🌲'
  },
  {
    id: 'nature-2',
    category: 'Nature',
    title: 'Wildlife Close-up',
    prompt: 'Detailed wildlife close-up, majestic animal in natural habitat, golden hour lighting, sharp focus, professional nature photography',
    icon: '🦁'
  },
  {
    id: 'nature-3',
    category: 'Nature',
    title: 'Blooming Garden',
    prompt: 'Beautiful garden in full bloom, colorful flowers, butterflies, spring atmosphere, soft natural lighting, botanical paradise',
    icon: '🌺'
  },
  
  // Architecture
  {
    id: 'architecture-1',
    category: 'Architecture',
    title: 'Modern Building',
    prompt: 'Modern architectural masterpiece, sleek design, glass and steel, dramatic angles, blue sky, professional architectural photography',
    icon: '🏢'
  },
  {
    id: 'architecture-2',
    category: 'Architecture',
    title: 'Ancient Temple',
    prompt: 'Ancient temple architecture, historical monument, intricate details, cultural heritage, atmospheric lighting, majestic structure',
    icon: '🏛️'
  },
  {
    id: 'architecture-3',
    category: 'Architecture',
    title: 'Futuristic City',
    prompt: 'Futuristic city architecture, sci-fi buildings, neon lights, flying vehicles, advanced technology, cyberpunk aesthetic',
    icon: '🌃'
  },
  
  // Food & Lifestyle
  {
    id: 'food-1',
    category: 'Food & Lifestyle',
    title: 'Gourmet Dish',
    prompt: 'Gourmet food photography, elegant plating, professional presentation, natural lighting, culinary art, restaurant quality',
    icon: '🍽️'
  },
  {
    id: 'lifestyle-1',
    category: 'Food & Lifestyle',
    title: 'Cozy Interior',
    prompt: 'Cozy interior design, warm lighting, comfortable furniture, hygge atmosphere, modern home decor, inviting living space',
    icon: '🏠'
  },
  {
    id: 'lifestyle-2',
    category: 'Food & Lifestyle',
    title: 'Product Showcase',
    prompt: 'Professional product photography, clean studio setup, perfect lighting, commercial quality, minimalist background, sharp details',
    icon: '📦'
  }
];

interface PromptTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
}

export default function PromptTemplates({ onSelectTemplate }: PromptTemplatesProps) {
  const categories = Array.from(new Set(promptTemplates.map(t => t.category)));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Lightbulb className="mr-2 h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Prompt Templates</DialogTitle>
          <DialogDescription>
            Choose from pre-made prompts for common use cases
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {promptTemplates
                    .filter(t => t.category === category)
                    .map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          onSelectTemplate(template.prompt);
                          // Close dialog by triggering DialogClose
                          document.querySelector('[data-state="open"]')?.querySelector('button[aria-label="Close"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                        }}
                        className="text-left p-4 rounded-lg border bg-card hover:bg-accent transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                              {template.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {template.prompt}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
