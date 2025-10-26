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
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    loginButton: 'Entrar',
    signupButton: 'Crear cuenta',
    noAccount: '¿No tienes una cuenta?',
    haveAccount: '¿Ya tienes una cuenta?',
    logout: 'Cerrar sesión',
    
    // Gallery
    gallery: 'Galería',
    myGallery: 'Mi Galería',
    searchPhotos: 'Buscar fotos...',
    allCategories: 'Todas las categorías',
    selectMultiple: 'Seleccionar múltiples',
    cancel: 'Cancelar',
    selected: 'seleccionado',
    deleteSelected: 'Eliminar seleccionados',
    downloadSelected: 'Descargar seleccionados',
    noImages: 'No hay imágenes aún',
    startUploading: '¡Empieza a subir para construir tu galería!',
    
    // Upload
    uploadPhotos: 'Subir fotos',
    addToGallery: 'Agregar a la galería',
    category: 'Categoría',
    newCategory: 'Nueva',
    createFirstCategory: 'Crear primera categoría',
    categoryName: 'Nombre de categoría',
    create: 'Crear',
    addPhotos: 'Agregar fotos',
    uploadFiles: 'Subir archivos',
    fromDevice: 'Desde dispositivo',
    takePhoto: 'Tomar foto',
    useCamera: 'Usar cámara',
    selectedPhotos: 'Fotos seleccionadas',
    upload: 'Subir',
    uploading: 'Subiendo...',
    flipCamera: 'Voltear cámara',
    
    // Image Viewer
    sharePhoto: 'Compartir foto',
    
    // How to Use
    howToUse: 'Cómo usar',
    howToUseTitle: 'Bienvenido a Memo Gallery',
    gettingStarted: 'Comenzando',
    step1Title: '1. Crear categorías',
    step1Desc: 'Organiza tus fotos creando categorías personalizadas con colores únicos.',
    step2Title: '2. Subir fotos',
    step2Desc: 'Agrega fotos desde tu dispositivo o toma fotos instantáneas con tu cámara.',
    step3Title: '3. Navegar y buscar',
    step3Desc: 'Ve tu galería en una hermosa cuadrícula, filtra por categoría o busca por nombre.',
    step4Title: '4. Gestionar fotos',
    step4Desc: 'Selecciona múltiples fotos para eliminar o descargar. Comparte fotos individuales en redes sociales.',
    features: 'Características',
    feature1: '🔒 Autenticación segura',
    feature1Desc: 'Tus fotos están protegidas con autenticación de Firebase.',
    feature2: '💾 Almacenamiento ilimitado',
    feature2Desc: 'Almacena fotos ilimitadas localmente en tu dispositivo.',
    feature3: '📸 Cámara instantánea',
    feature3Desc: 'Toma fotos directamente en la aplicación con soporte de cámara frontal/trasera.',
    feature4: '🎨 Categorías',
    feature4Desc: 'Crea categorías ilimitadas para organizar tus recuerdos.',
    feature5: '🔍 Búsqueda inteligente',
    feature5Desc: 'Encuentra fotos al instante con la función de búsqueda integrada.',
    feature6: '📤 Compartir fácil',
    feature6Desc: 'Comparte fotos en WhatsApp, Facebook, Instagram y más.',
    feature7: '🌐 Multiidioma',
    feature7Desc: 'Cambia entre idiomas para una experiencia personalizada.',
    feature8: '⚡ Primero sin conexión',
    feature8Desc: 'Funciona perfectamente incluso sin conexión a Internet.',
    tips: 'Consejos y trucos',
    tip1: '💡 Mantén presionado sobre las imágenes para entrar en modo de selección múltiple',
    tip2: '💡 Desliza izquierda/derecha en el visor de imágenes para navegar por las fotos',
    tip3: '💡 Pellizca para hacer zoom en el visor de imágenes para ver detalles',
    tip4: '💡 Crea categorías codificadas por colores para una fácil identificación',
    backToGallery: 'Volver a la galería',
    
    // Common
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    delete: 'Eliminar',
    download: 'Descargar',
    share: 'Compartir',
    close: 'Cerrar',
  },
  bn: {
    // Auth
    login: 'লগইন',
    signup: 'সাইন আপ',
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    loginButton: 'সাইন ইন',
    signupButton: 'অ্যাকাউন্ট তৈরি করুন',
    noAccount: 'অ্যাকাউন্ট নেই?',
    haveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    logout: 'লগআউট',
    
    // Gallery
    gallery: 'গ্যালারি',
    myGallery: 'আমার গ্যালারি',
    searchPhotos: 'ফটো খুঁজুন...',
    allCategories: 'সব ক্যাটাগরি',
    selectMultiple: 'একাধিক নির্বাচন করুন',
    cancel: 'বাতিল',
    selected: 'নির্বাচিত',
    deleteSelected: 'নির্বাচিত মুছুন',
    downloadSelected: 'নির্বাচিত ডাউনলোড করুন',
    noImages: 'এখনও কোন ছবি নেই',
    startUploading: 'আপনার গ্যালারি তৈরি করতে আপলোড শুরু করুন!',
    
    // Upload
    uploadPhotos: 'ফটো আপলোড করুন',
    addToGallery: 'গ্যালারিতে যোগ করুন',
    category: 'ক্যাটাগরি',
    newCategory: 'নতুন',
    createFirstCategory: 'প্রথম ক্যাটাগরি তৈরি করুন',
    categoryName: 'ক্যাটাগরির নাম',
    create: 'তৈরি করুন',
    addPhotos: 'ফটো যোগ করুন',
    uploadFiles: 'ফাইল আপলোড করুন',
    fromDevice: 'ডিভাইস থেকে',
    takePhoto: 'ফটো তুলুন',
    useCamera: 'ক্যামেরা ব্যবহার করুন',
    selectedPhotos: 'নির্বাচিত ফটো',
    upload: 'আপলোড',
    uploading: 'আপলোড হচ্ছে...',
    flipCamera: 'ক্যামেরা ঘুরান',
    
    // Image Viewer
    sharePhoto: 'ফটো শেয়ার করুন',
    
    // How to Use
    howToUse: 'কীভাবে ব্যবহার করবেন',
    howToUseTitle: 'মেমো গ্যালারিতে স্বাগতম',
    gettingStarted: 'শুরু করা',
    step1Title: '১. ক্যাটাগরি তৈরি করুন',
    step1Desc: 'অনন্য রঙের সাথে কাস্টম ক্যাটাগরি তৈরি করে আপনার ফটো সংগঠিত করুন।',
    step2Title: '২. ফটো আপলোড করুন',
    step2Desc: 'আপনার ডিভাইস থেকে ফটো যোগ করুন বা আপনার ক্যামেরা দিয়ে তাৎক্ষণিক ফটো তুলুন।',
    step3Title: '৩. ব্রাউজ এবং অনুসন্ধান',
    step3Desc: 'একটি সুন্দর গ্রিডে আপনার গ্যালারি দেখুন, ক্যাটাগরি দ্বারা ফিল্টার করুন বা নাম দিয়ে অনুসন্ধান করুন।',
    step4Title: '৪. ফটো পরিচালনা করুন',
    step4Desc: 'মুছে ফেলতে বা ডাউনলোড করতে একাধিক ফটো নির্বাচন করুন। সোশ্যাল মিডিয়ায় পৃথক ফটো শেয়ার করুন।',
    features: 'বৈশিষ্ট্য',
    feature1: '🔒 নিরাপদ প্রমাণীকরণ',
    feature1Desc: 'আপনার ফটোগুলি Firebase প্রমাণীকরণ দ্বারা সুরক্ষিত।',
    feature2: '💾 সীমাহীন স্টোরেজ',
    feature2Desc: 'আপনার ডিভাইসে স্থানীয়ভাবে সীমাহীন ফটো সংরক্ষণ করুন।',
    feature3: '📸 তাৎক্ষণিক ক্যামেরা',
    feature3Desc: 'সামনে/পিছনের ক্যামেরা সমর্থন সহ অ্যাপে সরাসরি ফটো তুলুন।',
    feature4: '🎨 ক্যাটাগরি',
    feature4Desc: 'আপনার স্মৃতি সংগঠিত করতে সীমাহীন ক্যাটাগরি তৈরি করুন।',
    feature5: '🔍 স্মার্ট অনুসন্ধান',
    feature5Desc: 'বিল্ট-ইন অনুসন্ধান বৈশিষ্ট্য দিয়ে তাৎক্ষণিকভাবে ফটো খুঁজুন।',
    feature6: '📤 সহজ শেয়ারিং',
    feature6Desc: 'WhatsApp, Facebook, Instagram এবং আরও অনেক কিছুতে ফটো শেয়ার করুন।',
    feature7: '🌐 বহু-ভাষা',
    feature7Desc: 'ব্যক্তিগত অভিজ্ঞতার জন্য ভাষার মধ্যে স্যুইচ করুন।',
    feature8: '⚡ অফলাইন প্রথম',
    feature8Desc: 'ইন্টারনেট সংযোগ ছাড়াই নিখুঁতভাবে কাজ করে।',
    tips: 'টিপস এবং ট্রিকস',
    tip1: '💡 মাল্টি-সিলেক্ট মোডে প্রবেশ করতে ছবিতে দীর্ঘক্ষণ চাপুন',
    tip2: '💡 ফটো ব্রাউজ করতে ইমেজ ভিউয়ারে বাম/ডান সোয়াইপ করুন',
    tip3: '💡 বিস্তারিত দেখার জন্য ইমেজ ভিউয়ারে জুম করতে চিমটি করুন',
    tip4: '💡 সহজ সনাক্তকরণের জন্য রঙ-কোডেড ক্যাটাগরি তৈরি করুন',
    backToGallery: 'গ্যালারিতে ফিরে যান',
    
    // Common
    loading: 'লোড হচ্ছে...',
    error: 'ত্রুটি',
    success: 'সফল',
    delete: 'মুছুন',
    download: 'ডাউনলোড',
    share: 'শেয়ার',
    close: 'বন্ধ করুন',
  },
  ar: {
    // Auth
    login: 'تسجيل الدخول',
    signup: 'التسجيل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    loginButton: 'تسجيل الدخول',
    signupButton: 'إنشاء حساب',
    noAccount: 'ليس لديك حساب؟',
    haveAccount: 'هل لديك حساب بالفعل؟',
    logout: 'تسجيل الخروج',
    
    // Gallery
    gallery: 'المعرض',
    myGallery: 'معرضي',
    searchPhotos: 'ابحث عن الصور...',
    allCategories: 'جميع الفئات',
    selectMultiple: 'تحديد متعدد',
    cancel: 'إلغاء',
    selected: 'محدد',
    deleteSelected: 'حذف المحدد',
    downloadSelected: 'تحميل المحدد',
    noImages: 'لا توجد صور حتى الآن',
    startUploading: 'ابدأ التحميل لبناء معرضك!',
    
    // Upload
    uploadPhotos: 'تحميل الصور',
    addToGallery: 'إضافة إلى المعرض',
    category: 'الفئة',
    newCategory: 'جديد',
    createFirstCategory: 'إنشاء الفئة الأولى',
    categoryName: 'اسم الفئة',
    create: 'إنشاء',
    addPhotos: 'إضافة صور',
    uploadFiles: 'تحميل الملفات',
    fromDevice: 'من الجهاز',
    takePhoto: 'التقط صورة',
    useCamera: 'استخدام الكاميرا',
    selectedPhotos: 'الصور المحددة',
    upload: 'تحميل',
    uploading: 'جارٍ التحميل...',
    flipCamera: 'قلب الكاميرا',
    
    // Image Viewer
    sharePhoto: 'مشاركة الصورة',
    
    // How to Use
    howToUse: 'كيفية الاستخدام',
    howToUseTitle: 'مرحبًا بك في Memo Gallery',
    gettingStarted: 'البدء',
    step1Title: '١. إنشاء الفئات',
    step1Desc: 'نظم صورك عن طريق إنشاء فئات مخصصة بألوان فريدة.',
    step2Title: '٢. تحميل الصور',
    step2Desc: 'أضف صورًا من جهازك أو التقط صورًا فورية بكاميرتك.',
    step3Title: '٣. التصفح والبحث',
    step3Desc: 'اعرض معرضك في شبكة جميلة، وقم بالتصفية حسب الفئة، أو ابحث بالاسم.',
    step4Title: '٤. إدارة الصور',
    step4Desc: 'حدد عدة صور للحذف أو التحميل. شارك الصور الفردية على وسائل التواصل الاجتماعي.',
    features: 'الميزات',
    feature1: '🔒 مصادقة آمنة',
    feature1Desc: 'صورك محمية بمصادقة Firebase.',
    feature2: '💾 تخزين غير محدود',
    feature2Desc: 'قم بتخزين صور غير محدودة محليًا على جهازك.',
    feature3: '📸 كاميرا فورية',
    feature3Desc: 'التقط الصور مباشرة في التطبيق مع دعم الكاميرا الأمامية/الخلفية.',
    feature4: '🎨 الفئات',
    feature4Desc: 'أنشئ فئات غير محدودة لتنظيم ذكرياتك.',
    feature5: '🔍 بحث ذكي',
    feature5Desc: 'ابحث عن الصور على الفور باستخدام ميزة البحث المدمجة.',
    feature6: '📤 مشاركة سهلة',
    feature6Desc: 'شارك الصور على WhatsApp وFacebook وInstagram والمزيد.',
    feature7: '🌐 متعدد اللغات',
    feature7Desc: 'قم بالتبديل بين اللغات للحصول على تجربة مخصصة.',
    feature8: '⚡ أوفلاين أولاً',
    feature8Desc: 'يعمل بشكل مثالي حتى بدون اتصال بالإنترنت.',
    tips: 'نصائح وحيل',
    tip1: '💡 اضغط لفترة طويلة على الصور لدخول وضع التحديد المتعدد',
    tip2: '💡 اسحب يسارًا/يمينًا في عارض الصور لتصفح الصور',
    tip3: '💡 قرص للتكبير في عارض الصور للحصول على التفاصيل',
    tip4: '💡 أنشئ فئات مرمزة بالألوان لسهولة التعرف',
    backToGallery: 'العودة إلى المعرض',
    
    // Common
    loading: 'جارٍ التحميل...',
    error: 'خطأ',
    success: 'نجاح',
    delete: 'حذف',
    download: 'تحميل',
    share: 'مشاركة',
    close: 'إغلاق',
  },
  fr: {
    // Auth
    login: 'Connexion',
    signup: 'Inscription',
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
    selectMultiple: 'Sélection multiple',
    cancel: 'Annuler',
    selected: 'sélectionné',
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
    categoryName: 'Nom de catégorie',
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
    howToUseTitle: 'Bienvenue sur Memo Gallery',
    gettingStarted: 'Commencer',
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
    feature2Desc: 'Stockez des photos illimitées localement sur votre appareil.',
    feature3: '📸 Caméra instantanée',
    feature3Desc: 'Prenez des photos directement dans l\'application avec le support de la caméra avant/arrière.',
    feature4: '🎨 Catégories',
    feature4Desc: 'Créez des catégories illimitées pour organiser vos souvenirs.',
    feature5: '🔍 Recherche intelligente',
    feature5Desc: 'Trouvez des photos instantanément avec la fonction de recherche intégrée.',
    feature6: '📤 Partage facile',
    feature6Desc: 'Partagez des photos sur WhatsApp, Facebook, Instagram et plus encore.',
    feature7: '🌐 Multilingue',
    feature7Desc: 'Changez de langue pour une expérience personnalisée.',
    feature8: '⚡ Hors ligne d\'abord',
    feature8Desc: 'Fonctionne parfaitement même sans connexion Internet.',
    tips: 'Conseils et astuces',
    tip1: '💡 Appuyez longuement sur les images pour entrer en mode sélection multiple',
    tip2: '💡 Glissez à gauche/droite dans la visionneuse d\'images pour parcourir les photos',
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
  de: {
    // Auth
    login: 'Anmelden',
    signup: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    loginButton: 'Anmelden',
    signupButton: 'Konto erstellen',
    noAccount: 'Noch kein Konto?',
    haveAccount: 'Sie haben bereits ein Konto?',
    logout: 'Abmelden',
    
    // Gallery
    gallery: 'Galerie',
    myGallery: 'Meine Galerie',
    searchPhotos: 'Fotos suchen...',
    allCategories: 'Alle Kategorien',
    selectMultiple: 'Mehrfach auswählen',
    cancel: 'Abbrechen',
    selected: 'ausgewählt',
    deleteSelected: 'Ausgewählte löschen',
    downloadSelected: 'Ausgewählte herunterladen',
    noImages: 'Noch keine Bilder',
    startUploading: 'Beginnen Sie mit dem Hochladen, um Ihre Galerie aufzubauen!',
    
    // Upload
    uploadPhotos: 'Fotos hochladen',
    addToGallery: 'Zur Galerie hinzufügen',
    category: 'Kategorie',
    newCategory: 'Neu',
    createFirstCategory: 'Erste Kategorie erstellen',
    categoryName: 'Kategoriename',
    create: 'Erstellen',
    addPhotos: 'Fotos hinzufügen',
    uploadFiles: 'Dateien hochladen',
    fromDevice: 'Vom Gerät',
    takePhoto: 'Foto aufnehmen',
    useCamera: 'Kamera verwenden',
    selectedPhotos: 'Ausgewählte Fotos',
    upload: 'Hochladen',
    uploading: 'Hochladen...',
    flipCamera: 'Kamera umdrehen',
    
    // Image Viewer
    sharePhoto: 'Foto teilen',
    
    // How to Use
    howToUse: 'Anleitung',
    howToUseTitle: 'Willkommen bei Memo Gallery',
    gettingStarted: 'Erste Schritte',
    step1Title: '1. Kategorien erstellen',
    step1Desc: 'Organisieren Sie Ihre Fotos, indem Sie benutzerdefinierte Kategorien mit einzigartigen Farben erstellen.',
    step2Title: '2. Fotos hochladen',
    step2Desc: 'Fügen Sie Fotos von Ihrem Gerät hinzu oder machen Sie Sofortfotos mit Ihrer Kamera.',
    step3Title: '3. Durchsuchen und suchen',
    step3Desc: 'Zeigen Sie Ihre Galerie in einem schönen Raster an, filtern Sie nach Kategorie oder suchen Sie nach Namen.',
    step4Title: '4. Fotos verwalten',
    step4Desc: 'Wählen Sie mehrere Fotos aus, um sie zu löschen oder herunterzuladen. Teilen Sie einzelne Fotos in sozialen Medien.',
    features: 'Funktionen',
    feature1: '🔒 Sichere Authentifizierung',
    feature1Desc: 'Ihre Fotos sind durch Firebase-Authentifizierung geschützt.',
    feature2: '💾 Unbegrenzter Speicher',
    feature2Desc: 'Speichern Sie unbegrenzt Fotos lokal auf Ihrem Gerät.',
    feature3: '📸 Sofortkamera',
    feature3Desc: 'Machen Sie Fotos direkt in der App mit Unterstützung für Front-/Rückkamera.',
    feature4: '🎨 Kategorien',
    feature4Desc: 'Erstellen Sie unbegrenzte Kategorien, um Ihre Erinnerungen zu organisieren.',
    feature5: '🔍 Intelligente Suche',
    feature5Desc: 'Finden Sie Fotos sofort mit der integrierten Suchfunktion.',
    feature6: '📤 Einfaches Teilen',
    feature6Desc: 'Teilen Sie Fotos auf WhatsApp, Facebook, Instagram und mehr.',
    feature7: '🌐 Mehrsprachig',
    feature7Desc: 'Wechseln Sie zwischen Sprachen für ein personalisiertes Erlebnis.',
    feature8: '⚡ Offline zuerst',
    feature8Desc: 'Funktioniert perfekt auch ohne Internetverbindung.',
    tips: 'Tipps & Tricks',
    tip1: '💡 Drücken Sie lange auf Bilder, um in den Mehrfachauswahlmodus zu gelangen',
    tip2: '💡 Wischen Sie links/rechts im Bildbetrachter, um Fotos zu durchsuchen',
    tip3: '💡 Kneifen Sie, um im Bildbetrachter für Details zu zoomen',
    tip4: '💡 Erstellen Sie farbcodierte Kategorien zur einfachen Identifizierung',
    backToGallery: 'Zurück zur Galerie',
    
    // Common
    loading: 'Lädt...',
    error: 'Fehler',
    success: 'Erfolg',
    delete: 'Löschen',
    download: 'Herunterladen',
    share: 'Teilen',
    close: 'Schließen',
  },
};

const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'bn', name: 'বাংলা (Bangla)', flag: '🇧🇩' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
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
