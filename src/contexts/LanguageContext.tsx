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
  es: {
    // Auth
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    loginButton: 'Entrar',
    signupButton: 'Crear Cuenta',
    noAccount: '¿No tienes cuenta?',
    haveAccount: '¿Ya tienes cuenta?',
    logout: 'Cerrar Sesión',
    
    // Gallery
    gallery: 'Galería',
    myGallery: 'Mi Galería',
    searchPhotos: 'Buscar fotos...',
    allCategories: 'Todas las Categorías',
    selectMultiple: 'Seleccionar Múltiples',
    cancel: 'Cancelar',
    selected: 'seleccionados',
    deleteSelected: 'Eliminar Seleccionados',
    downloadSelected: 'Descargar Seleccionados',
    noImages: 'Aún no hay imágenes',
    startUploading: '¡Comienza a subir fotos para crear tu galería!',
    
    // Upload
    uploadPhotos: 'Subir Fotos',
    addToGallery: 'Agregar a Galería',
    category: 'Categoría',
    newCategory: 'Nuevo',
    createFirstCategory: 'Crear Primera Categoría',
    categoryName: 'Nombre de categoría',
    create: 'Crear',
    addPhotos: 'Agregar Fotos',
    uploadFiles: 'Subir Archivos',
    fromDevice: 'Desde dispositivo',
    takePhoto: 'Tomar Foto',
    useCamera: 'Usar cámara',
    selectedPhotos: 'Fotos Seleccionadas',
    upload: 'Subir',
    uploading: 'Subiendo...',
    flipCamera: 'Voltear Cámara',
    
    // Image Viewer
    sharePhoto: 'Compartir Foto',
    
    // How to Use
    howToUse: 'Cómo Usar',
    howToUseTitle: 'Bienvenido a Memo Gallery',
    gettingStarted: 'Primeros Pasos',
    step1Title: '1. Crear Categorías',
    step1Desc: 'Organiza tus fotos creando categorías personalizadas con colores únicos.',
    step2Title: '2. Subir Fotos',
    step2Desc: 'Agrega fotos desde tu dispositivo o toma fotos instantáneas con tu cámara.',
    step3Title: '3. Explorar y Buscar',
    step3Desc: 'Ve tu galería en una hermosa cuadrícula, filtra por categoría o busca por nombre.',
    step4Title: '4. Administrar Fotos',
    step4Desc: 'Selecciona múltiples fotos para eliminar o descargar. Comparte fotos individuales en redes sociales.',
    features: 'Características',
    feature1: '🔒 Autenticación Segura',
    feature1Desc: 'Tus fotos están protegidas con autenticación Firebase.',
    feature2: '💾 Almacenamiento Ilimitado',
    feature2Desc: 'Almacena fotos ilimitadas localmente en tu dispositivo.',
    feature3: '📸 Cámara Instantánea',
    feature3Desc: 'Toma fotos directamente en la aplicación con soporte de cámara frontal/trasera.',
    feature4: '🎨 Categorías',
    feature4Desc: 'Crea categorías ilimitadas para organizar tus recuerdos.',
    feature5: '🔍 Búsqueda Inteligente',
    feature5Desc: 'Encuentra fotos al instante con la función de búsqueda integrada.',
    feature6: '📤 Compartir Fácil',
    feature6Desc: 'Comparte fotos en WhatsApp, Facebook, Instagram y más.',
    feature7: '🌐 Multiidioma',
    feature7Desc: 'Cambia entre idiomas para una experiencia personalizada.',
    feature8: '⚡ Sin Conexión',
    feature8Desc: 'Funciona perfectamente incluso sin conexión a Internet.',
    tips: 'Consejos y Trucos',
    tip1: '💡 Mantén presionado en las imágenes para entrar en modo de selección múltiple',
    tip2: '💡 Desliza izquierda/derecha en el visor de imágenes para navegar fotos',
    tip3: '💡 Pellizca para hacer zoom en el visor de imágenes para ver detalles',
    tip4: '💡 Crea categorías codificadas por colores para una fácil identificación',
    backToGallery: 'Volver a Galería',
    
    // Common
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    delete: 'Eliminar',
    download: 'Descargar',
    share: 'Compartir',
    close: 'Cerrar',
  },
  fr: {
    // Auth
    login: 'Connexion',
    signup: "S'inscrire",
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    loginButton: 'Se connecter',
    signupButton: 'Créer un compte',
    noAccount: "Vous n'avez pas de compte?",
    haveAccount: 'Vous avez déjà un compte?',
    logout: 'Déconnexion',
    
    // Gallery
    gallery: 'Galerie',
    myGallery: 'Ma Galerie',
    searchPhotos: 'Rechercher des photos...',
    allCategories: 'Toutes les catégories',
    selectMultiple: 'Sélectionner plusieurs',
    cancel: 'Annuler',
    selected: 'sélectionnés',
    deleteSelected: 'Supprimer la sélection',
    downloadSelected: 'Télécharger la sélection',
    noImages: 'Pas encore d\'images',
    startUploading: 'Commencez à télécharger pour créer votre galerie!',
    
    // Upload
    uploadPhotos: 'Télécharger des photos',
    addToGallery: 'Ajouter à la galerie',
    category: 'Catégorie',
    newCategory: 'Nouveau',
    createFirstCategory: 'Créer la première catégorie',
    categoryName: 'Nom de la catégorie',
    create: 'Créer',
    addPhotos: 'Ajouter des photos',
    uploadFiles: 'Télécharger des fichiers',
    fromDevice: 'Depuis l\'appareil',
    takePhoto: 'Prendre une photo',
    useCamera: 'Utiliser la caméra',
    selectedPhotos: 'Photos sélectionnées',
    upload: 'Télécharger',
    uploading: 'Téléchargement...',
    flipCamera: 'Retourner la caméra',
    
    // Image Viewer
    sharePhoto: 'Partager la photo',
    
    // How to Use
    howToUse: 'Comment utiliser',
    howToUseTitle: 'Bienvenue dans Memo Gallery',
    gettingStarted: 'Premiers pas',
    step1Title: '1. Créer des catégories',
    step1Desc: 'Organisez vos photos en créant des catégories personnalisées avec des couleurs uniques.',
    step2Title: '2. Télécharger des photos',
    step2Desc: 'Ajoutez des photos depuis votre appareil ou prenez des photos instantanées avec votre caméra.',
    step3Title: '3. Parcourir et rechercher',
    step3Desc: 'Visualisez votre galerie dans une belle grille, filtrez par catégorie ou recherchez par nom.',
    step4Title: '4. Gérer les photos',
    step4Desc: 'Sélectionnez plusieurs photos pour les supprimer ou les télécharger. Partagez des photos individuelles sur les réseaux sociaux.',
    features: 'Fonctionnalités',
    feature1: '🔒 Authentification sécurisée',
    feature1Desc: 'Vos photos sont protégées par l\'authentification Firebase.',
    feature2: '💾 Stockage illimité',
    feature2Desc: 'Stockez un nombre illimité de photos localement sur votre appareil.',
    feature3: '📸 Caméra instantanée',
    feature3Desc: 'Prenez des photos directement dans l\'application avec support caméra avant/arrière.',
    feature4: '🎨 Catégories',
    feature4Desc: 'Créez des catégories illimitées pour organiser vos souvenirs.',
    feature5: '🔍 Recherche intelligente',
    feature5Desc: 'Trouvez des photos instantanément avec la fonction de recherche intégrée.',
    feature6: '📤 Partage facile',
    feature6Desc: 'Partagez des photos sur WhatsApp, Facebook, Instagram et plus.',
    feature7: '🌐 Multilingue',
    feature7Desc: 'Basculez entre les langues pour une expérience personnalisée.',
    feature8: '⚡ Hors ligne d\'abord',
    feature8Desc: 'Fonctionne parfaitement même sans connexion Internet.',
    tips: 'Trucs et astuces',
    tip1: '💡 Appuyez longuement sur les images pour entrer en mode de sélection multiple',
    tip2: '💡 Balayez gauche/droite dans la visionneuse d\'images pour parcourir les photos',
    tip3: '💡 Pincez pour zoomer dans la visionneuse d\'images pour les détails',
    tip4: '💡 Créez des catégories codées par couleur pour une identification facile',
    backToGallery: 'Retour à la galerie',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    delete: 'Supprimer',
    download: 'Télécharger',
    share: 'Partager',
    close: 'Fermer',
  },
};

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

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

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
