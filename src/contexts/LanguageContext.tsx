import { createContext, useContext, useState, ReactNode } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loginButton: 'Sign In',
    signupButton: 'Create Account',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    logout: 'Logout',
    
    // Gallery
    gallery: 'Gallery',
    myGallery: 'My Gallery',
    searchPhotos: 'Search photos...',
    allCategories: 'All Categories',
    selectMultiple: 'Select Multiple',
    cancel: 'Cancel',
    selected: 'selected',
    deleteSelected: 'Delete Selected',
    downloadSelected: 'Download Selected',
    noImages: 'No images yet',
    startUploading: 'Start uploading to build your gallery!',
    
    // Upload
    uploadPhotos: 'Upload Photos',
    addToGallery: 'Add to Gallery',
    category: 'Category',
    newCategory: 'New',
    createFirstCategory: 'Create First Category',
    categoryName: 'Category name',
    create: 'Create',
    addPhotos: 'Add Photos',
    uploadFiles: 'Upload Files',
    fromDevice: 'From device',
    takePhoto: 'Take Photo',
    useCamera: 'Use camera',
    selectedPhotos: 'Selected Photos',
    upload: 'Upload',
    uploading: 'Uploading...',
    flipCamera: 'Flip Camera',
    
    // Image Viewer
    sharePhoto: 'Share Photo',
    
    // How to Use
    howToUse: 'How to Use',
    howToUseTitle: 'Welcome to Memo Gallery',
    gettingStarted: 'Getting Started',
    step1Title: '1. Create Categories',
    step1Desc: 'Organize your photos by creating custom categories with unique colors.',
    step2Title: '2. Upload Photos',
    step2Desc: 'Add photos from your device or take instant photos with your camera.',
    step3Title: '3. Browse & Search',
    step3Desc: 'View your gallery in a beautiful grid, filter by category, or search by name.',
    step4Title: '4. Manage Photos',
    step4Desc: 'Select multiple photos to delete or download. Share individual photos to social media.',
    features: 'Features',
    feature1: '🔒 Secure Authentication',
    feature1Desc: 'Your photos are protected with Firebase authentication.',
    feature2: '💾 Unlimited Storage',
    feature2Desc: 'Store unlimited photos locally on your device.',
    feature3: '📸 Instant Camera',
    feature3Desc: 'Take photos directly in the app with front/back camera support.',
    feature4: '🎨 Categories',
    feature4Desc: 'Create unlimited categories to organize your memories.',
    feature5: '🔍 Smart Search',
    feature5Desc: 'Find photos instantly with the built-in search feature.',
    feature6: '📤 Easy Sharing',
    feature6Desc: 'Share photos to WhatsApp, Facebook, Instagram, and more.',
    feature7: '🌐 Multi-Language',
    feature7Desc: 'Switch between languages for a personalized experience.',
    feature8: '⚡ Offline First',
    feature8Desc: 'Works perfectly even without an internet connection.',
    tips: 'Tips & Tricks',
    tip1: '💡 Long press on images to enter multi-select mode',
    tip2: '💡 Swipe left/right in the image viewer to browse photos',
    tip3: '💡 Pinch to zoom in the image viewer for details',
    tip4: '💡 Create color-coded categories for easy identification',
    backToGallery: 'Back to Gallery',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    delete: 'Delete',
    download: 'Download',
    share: 'Share',
    close: 'Close',
  },
  // Additional languages will use English as fallback
};

// Language list with 100 languages
const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇧🇩' },
  { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe (Turkish)', flag: '🇹🇷' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
  { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'yue', name: '粵語 (Cantonese)', flag: '🇭🇰' },
  { code: 'th', name: 'ไทย (Thai)', flag: '🇹🇭' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'jv', name: 'Basa Jawa (Javanese)', flag: '🇮🇩' },
  { code: 'tl', name: 'Tagalog/Filipino', flag: '🇵🇭' },
  { code: 'fa', name: 'فارسی (Persian)', flag: '🇮🇷' },
  { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' },
  { code: 'uk', name: 'Українська (Ukrainian)', flag: '🇺🇦' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'my', name: 'မြန်မာ (Burmese)', flag: '🇲🇲' },
  { code: 'su', name: 'Basa Sunda (Sundanese)', flag: '🇮🇩' },
  { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' },
  { code: 'ro', name: 'Română (Romanian)', flag: '🇷🇴' },
  { code: 'ps', name: 'پښتو (Pashto)', flag: '🇦🇫' },
  { code: 'sd', name: 'سنڌي (Sindhi)', flag: '🇵🇰' },
  { code: 'am', name: 'አማርኛ (Amharic)', flag: '🇪🇹' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'ms', name: 'Bahasa Melayu (Malay)', flag: '🇲🇾' },
  { code: 'mai', name: 'मैथिली (Maithili)', flag: '🇮🇳' },
  { code: 'uz', name: 'Oʻzbek (Uzbek)', flag: '🇺🇿' },
  { code: 'zu', name: 'isiZulu (Zulu)', flag: '🇿🇦' },
  { code: 'sw', name: 'Kiswahili (Swahili)', flag: '🇰🇪' },
  { code: 'ne', name: 'नेपाली (Nepali)', flag: '🇳🇵' },
  { code: 'ceb', name: 'Cebuano', flag: '🇵🇭' },
  { code: 'as', name: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
  { code: 'si', name: 'සිංහල (Sinhalese)', flag: '🇱🇰' },
  { code: 'ctg', name: 'Chittagonian', flag: '🇧🇩' },
  { code: 'mad', name: 'Madurese', flag: '🇮🇩' },
  { code: 'so', name: 'Soomaali (Somali)', flag: '🇸🇴' },
  { code: 'km', name: 'ភាសាខ្មែរ (Khmer)', flag: '🇰🇭' },
  { code: 'hak', name: '客家話 (Hakka)', flag: '🇨🇳' },
  { code: 'be', name: 'Беларуская (Belarusian)', flag: '🇧🇾' },
  { code: 'az', name: 'Azərbaycan (Azerbaijani)', flag: '🇦🇿' },
  { code: 'bs', name: 'Bosanski (Bosnian)', flag: '🇧🇦' },
  { code: 'cs', name: 'Čeština (Czech)', flag: '🇨🇿' },
  { code: 'el', name: 'Ελληνικά (Greek)', flag: '🇬🇷' },
  { code: 'hu', name: 'Magyar (Hungarian)', flag: '🇭🇺' },
  { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪' },
  { code: 'bg', name: 'Български (Bulgarian)', flag: '🇧🇬' },
  { code: 'he', name: 'עברית (Hebrew)', flag: '🇮🇱' },
  { code: 'fi', name: 'Suomi (Finnish)', flag: '🇫🇮' },
  { code: 'no', name: 'Norsk (Norwegian)', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk (Danish)', flag: '🇩🇰' },
  { code: 'sk', name: 'Slovenčina (Slovak)', flag: '🇸🇰' },
  { code: 'lt', name: 'Lietuvių (Lithuanian)', flag: '🇱🇹' },
  { code: 'lv', name: 'Latviešu (Latvian)', flag: '🇱🇻' },
  { code: 'ca', name: 'Català (Catalan)', flag: '🇪🇸' },
  { code: 'eu', name: 'Euskara (Basque)', flag: '🇪🇸' },
  { code: 'ga', name: 'Gaeilge (Irish)', flag: '🇮🇪' },
  { code: 'gd', name: 'Gàidhlig (Scots Gaelic)', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'mn', name: 'Монгол (Mongolian)', flag: '🇲🇳' },
  { code: 'bo', name: 'བོད་ཡིག (Tibetan)', flag: '🇨🇳' },
  { code: 'lo', name: 'ລາວ (Lao)', flag: '🇱🇦' },
  { code: 'tt', name: 'Татар (Tatar)', flag: '🇷🇺' },
  { code: 'bal', name: 'بلوچی (Balochi)', flag: '🇵🇰' },
  { code: 'rn', name: 'Kirundi', flag: '🇧🇮' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'ht', name: 'Kreyòl Ayisyen (Haitian Creole)', flag: '🇭🇹' },
  { code: 'qu', name: 'Runa Simi (Quechua)', flag: '🇵🇪' },
  { code: 'ay', name: 'Aymar Aru (Aymara)', flag: '🇧🇴' },
  { code: 'gn', name: 'Avañe\'ẽ (Guarani)', flag: '🇵🇾' },
  { code: 'nv', name: 'Diné Bizaad (Navajo)', flag: '🇺🇸' },
  { code: 'xh', name: 'isiXhosa (Xhosa)', flag: '🇿🇦' },
  { code: 'sn', name: 'chiShona (Shona)', flag: '🇿🇼' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'tw', name: 'Twi (Akan)', flag: '🇬🇭' },
  { code: 'lg', name: 'Luganda', flag: '🇺🇬' },
  { code: 'fj', name: 'Na Vosa Vakaviti (Fijian)', flag: '🇫🇯' },
  { code: 'sm', name: 'Gagana Samoa (Samoan)', flag: '🇼🇸' },
  { code: 'to', name: 'Lea Fakatonga (Tongan)', flag: '🇹🇴' },
  { code: 'mi', name: 'Te Reo Māori (Maori)', flag: '🇳🇿' },
  { code: 'hmn', name: 'Hmoob (Hmong)', flag: '🇱🇦' },
  { code: 'bem', name: 'Chibemba (Bemba)', flag: '🇿🇲' },
  { code: 'tn', name: 'Setswana (Tswana)', flag: '🇧🇼' },
];

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};
