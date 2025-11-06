import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Book, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HowToUse() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pb-20">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/gallery')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Book className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">{t('howToUse')}</h1>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigate('/account')} title="Account">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Welcome Section */}
        <Card className="glass border-primary/30 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('howToUseTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p className="text-lg">
              Your ultimate photo management companion with powerful features and beautiful design.
            </p>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="glass border-primary/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <span className="text-2xl">🚀</span>
              {t('gettingStarted')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t('step1Title')}</h3>
              <p className="text-muted-foreground">{t('step1Desc')}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t('step2Title')}</h3>
              <p className="text-muted-foreground">{t('step2Desc')}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t('step3Title')}</h3>
              <p className="text-muted-foreground">{t('step3Desc')}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{t('step4Title')}</h3>
              <p className="text-muted-foreground">{t('step4Desc')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <Card className="glass border-primary/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <span className="text-2xl">✨</span>
              {t('features')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 transition-smooth">
                <h3 className="font-semibold mb-2">{t('feature1')}</h3>
                <p className="text-sm text-muted-foreground">{t('feature1Desc')}</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 transition-smooth">
                <h3 className="font-semibold mb-2">{t('feature2')}</h3>
                <p className="text-sm text-muted-foreground">{t('feature2Desc')}</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 transition-smooth">
                <h3 className="font-semibold mb-2">{t('feature3')}</h3>
                <p className="text-sm text-muted-foreground">{t('feature3Desc')}</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 transition-smooth">
                <h3 className="font-semibold mb-2">{t('feature4')}</h3>
                <p className="text-sm text-muted-foreground">{t('feature4Desc')}</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 transition-smooth">
                <h3 className="font-semibold mb-2">{t('feature5')}</h3>
                <p className="text-sm text-muted-foreground">{t('feature5Desc')}</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 transition-smooth">
                <h3 className="font-semibold mb-2">{t('feature6')}</h3>
                <p className="text-sm text-muted-foreground">{t('feature6Desc')}</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 transition-smooth">
                <h3 className="font-semibold mb-2">{t('feature7')}</h3>
                <p className="text-sm text-muted-foreground">{t('feature7Desc')}</p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 transition-smooth">
                <h3 className="font-semibold mb-2">{t('feature8')}</h3>
                <p className="text-sm text-muted-foreground">{t('feature8Desc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips & Tricks */}
        <Card className="glass border-primary/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <span className="text-2xl">💡</span>
              {t('tips')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">{t('tip1')}</p>
            <p className="text-muted-foreground">{t('tip2')}</p>
            <p className="text-muted-foreground">{t('tip3')}</p>
            <p className="text-muted-foreground">{t('tip4')}</p>
          </CardContent>
        </Card>

        {/* AI Studio Guide */}
        <Card className="glass border-primary/20 animate-fade-in" style={{ animationDelay: '0.35s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <span className="text-2xl">🎨</span>
              AI Studio (All AI tools in one place)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>Use Memo AI to generate, enhance, and edit images in one unified page.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Type your idea and tap Generate to create new images.</li>
              <li>Use the + button in the prompt box to pick a photo from your phone or Memo Gallery.</li>
              <li>Switch to the Edit tab to apply edits or one-tap Enhance.</li>
              <li>Save results to your gallery, share, or download.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button
          onClick={() => navigate('/gallery')}
          className="w-full animated-gradient hover:scale-105 transition-smooth"
          size="lg"
        >
          {t('backToGallery')}
        </Button>
      </div>
    </div>
  );
}
