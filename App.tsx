
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { fetchMicroorganismData, fetchSimulatedPageContent, generateFastMicroscopeImage, getMicrobeForTemperature, chatWithBio, getWeeklySpotlight, generateDailyChangelog } from './services/geminiService';
import { bioAudio } from './services/audioService';
import { MicroorganismData, AppState, WebResult, WeatherData, ChatMessage, SpotlightData, PlatformView, UserProfile, HistoryItem, SystemUpdate, BioMapLocation } from './types';
import { Search, Microscope, Image as ImageIcon, Bot, Dna, Globe, X, Thermometer, BookOpen, MessageCircle, Send, ShieldAlert, ListTree, Lightbulb, RefreshCw, Zap, Bell, Radio, Sun, Cloud, CloudRain, CloudLightning, Tornado, LayoutDashboard, Library, SettingsIcon, ChevronDown, User, Menu, LogOut, FileText, History, Fingerprint, ChevronRight, ArrowLeft, Grid, MapPin, Trash2, CheckCircle, PlusCircle, Bookmark, Moon, Monitor, Calculator, Ruler, Scale, HardDrive, Clock, Save, Binary, Map, Compass, Mountain, Folder, File, Server, Download, Upload, Flame, Droplets, Lock, Mail, UserPlus, ArrowRight, Key, Scan, ExternalLink, Keyboard, Delete, CornerDownLeft, Volume2, VolumeX, PlayCircle, StopCircle } from './components/Icons';

/* --- INTRO COMPONENT --- */
const Intro = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => { 
      bioAudio.playScan(); // Audio effect on start
      const timer = setTimeout(onComplete, 2500); 
      return () => clearTimeout(timer); 
  }, [onComplete]);
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center">
         <div className="w-8 h-8 bg-lime-500 rounded-full absolute left-[calc(50%-1rem)] -top-24 animate-dot-bounce z-10 shadow-[0_0_30px_rgba(132,204,22,0.8)]"></div>
         <h1 className="text-8xl font-logo font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500 tracking-tighter animate-stem-impact relative z-0">
           biogle
         </h1>
         <div className="mt-8 flex flex-col items-center gap-2">
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-lime-500 animate-[width_2s_ease-out_forwards] w-0"></div>
            </div>
            <span className="text-lime-500 font-mono text-xs animate-pulse tracking-widest">CARGANDO SISTEMA...</span>
         </div>
      </div>
    </div>
  );
};

/* --- BIO SCANNER COMPONENT --- */
const BioScanner = ({ onScanComplete }: { onScanComplete: () => void }) => {
    useEffect(() => { 
        bioAudio.playScan();
        setTimeout(() => {
            bioAudio.playSuccess();
            onScanComplete();
        }, 3000); 
    }, [onScanComplete]);
    return (
        <div className="fixed inset-0 z-[95] bg-black flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 border-2 border-lime-900 rounded-full flex items-center justify-center overflow-hidden bg-lime-900/10">
                <Fingerprint className="w-32 h-32 text-lime-700 opacity-50"/>
                {/* Scanning Laser */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-lime-500 shadow-[0_0_20px_rgba(132,204,22,1)] animate-[bounce_1.5s_infinite]"></div>
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
            </div>
            <div className="mt-8 font-mono text-lime-500 text-sm tracking-widest animate-pulse">VERIFICANDO BIOMETRÍA...</div>
            <div className="mt-2 text-xs text-lime-800 font-mono">ACCESO NIVEL 4 AUTORIZADO</div>
        </div>
    );
};

/* --- AUTH SCREEN COMPONENT --- */
const AuthScreen = ({ onLoginSuccess }: { onLoginSuccess: (user: UserProfile) => void }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('🦠');
    
    const avatars = ['🦠', '🧫', '🧬', '🩸', '🔬', '🧪', '🌿', '🍄', '🐸', '🐟', '🦟', '🕸️'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        bioAudio.playClick();
        
        let finalAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${identifier}&backgroundColor=b6e3f4`;
        if (isSignup) {
            finalAvatar = selectedAvatar;
        }

        const usernameDerived = identifier.includes('@') ? identifier.split('@')[0] : identifier;
        const displayName = isSignup ? name : usernameDerived;

        const newUser: UserProfile = {
            name: displayName,
            role: 'Investigador',
            level: 1,
            avatar: finalAvatar
        };
        
        localStorage.setItem('bio_user', JSON.stringify(newUser));
        onLoginSuccess(newUser);
    };

    return (
        <div className="fixed inset-0 z-[90] bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 w-full max-w-md rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
                <div className="p-8 flex flex-col items-center bg-slate-900/50 border-b border-slate-700">
                    <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center shadow-lg shadow-lime-500/20 mb-4">
                        <Microscope className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">BioOS Access</h2>
                    <p className="text-slate-400 text-sm">Plataforma de Investigación Biológica</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {isSignup && (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nombre de Científico</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
                                    <input required value={name} onChange={e => {setName(e.target.value); bioAudio.playTyping();}} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all" placeholder="Dr. Ejemplo" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Selecciona tu Bacteria ID</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {avatars.map(av => (
                                        <button type="button" key={av} onClick={() => {setSelectedAvatar(av); bioAudio.playClick();}} className={`h-10 rounded-lg flex items-center justify-center text-xl hover:bg-slate-700 transition-colors ${selectedAvatar === av ? 'bg-lime-500/20 border border-lime-500' : 'bg-slate-900 border border-slate-700'}`}>
                                            {av}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Usuario o Correo Institucional</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
                            <input required type="text" value={identifier} onChange={e => {setIdentifier(e.target.value); bioAudio.playTyping();}} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all" placeholder="bacterio" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Clave de Acceso</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
                            <input required type="password" value={password} onChange={e => {setPassword(e.target.value); bioAudio.playTyping();}} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none transition-all" placeholder="••••••••" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-lime-500 hover:bg-lime-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-lime-500/20 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95">
                        {isSignup ? <UserPlus className="w-5 h-5"/> : <Scan className="w-5 h-5"/>}
                        {isSignup ? 'Crear Identidad BioOS' : 'Iniciar Escaneo'}
                    </button>
                </form>

                <div className="p-6 bg-slate-900/50 border-t border-slate-700 text-center">
                    <button onClick={() => {setIsSignup(!isSignup); bioAudio.playClick();}} className="text-sm text-slate-400 hover:text-lime-400 transition-colors flex items-center justify-center gap-2 w-full">
                        {isSignup ? '¿Ya tienes credenciales? Inicia Sesión' : '¿Nuevo recluta? Solicitar Acceso'} <ArrowRight className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

/* --- SYSTEM UPDATE OVERLAY --- */
const UpdateScreen = ({ updateData, onComplete }: { updateData: SystemUpdate, onComplete: () => void }) => {
  useEffect(() => { const timer = setTimeout(onComplete, 5000); return () => clearTimeout(timer); }, [onComplete]);
  return (
    <div className="fixed inset-0 z-[90] bg-black flex flex-col items-center justify-center font-mono text-lime-500 p-8">
       <div className="max-w-md w-full border border-lime-900 bg-slate-900 p-6 rounded-lg shadow-[0_0_50px_rgba(132,204,22,0.2)]">
          <div className="flex items-center gap-3 mb-6 border-b border-lime-900 pb-4">
             <RefreshCw className="w-6 h-6 animate-spin"/>
             <span className="text-xl font-bold tracking-wider">BioOS UPDATER</span>
          </div>
          <div className="space-y-2 mb-6 text-sm">
             <p className="text-white">Conectando con servidores centrales...</p>
             <p className="text-lime-400">Descargando paquete: {updateData.version} [100%]</p>
             <p className="text-lime-300">Instalando definiciones biológicas...</p>
          </div>
          <div className="bg-slate-800 rounded p-4 mb-6">
             <h3 className="text-white font-bold mb-2 text-xs uppercase">Registro de Cambios:</h3>
             <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                {updateData.features.map((f, i) => (
                   <li key={i}>{f}</li>
                ))}
             </ul>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded overflow-hidden">
             <div className="h-full bg-lime-500 animate-[width_3s_linear_forwards] w-0"></div>
          </div>
          <p className="text-center text-xs mt-4 animate-pulse">NO APAGUE EL SISTEMA</p>
       </div>
    </div>
  );
};

/* --- BROWSER MODAL --- */
const BioBrowser = ({ url, title, onClose, content }: { url: string, title: string, onClose: () => void, content: string }) => (
  <div className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center gap-4">
        <div className="flex gap-2 mr-2">
          <button onClick={() => {onClose(); bioAudio.playClick();}} className="hover:bg-slate-200 p-1 rounded-full"><X className="w-4 h-4 text-slate-500"/></button>
        </div>
        <div className="flex-1 bg-white border border-slate-300 rounded-md px-4 py-1.5 text-sm text-slate-600 flex items-center gap-2 font-mono shadow-sm">
          <Globe className="w-3 h-3 text-slate-400" />
          <span className="truncate">{url}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 bg-white">
         <div className="max-w-3xl mx-auto">
            {content === '' ? (
               <div className="flex flex-col items-center justify-center h-64 opacity-50 space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
                  <p className="text-sm font-mono">Resolviendo DNS biológico...</p>
               </div>
            ) : (
               <>
                 <h1 className="text-3xl font-bold text-slate-900 mb-6 font-serif">{title}</h1>
                 <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
               </>
            )}
         </div>
      </div>
    </div>
  </div>
);

/* --- SIDEBAR ITEM --- */
const NavItem = ({ icon: Icon, label, active, onClick, collapsed }: { icon: any, label: string, active: boolean, onClick: () => void, collapsed: boolean }) => (
  <button 
    onClick={() => {onClick(); bioAudio.playClick();}}
    onMouseEnter={() => bioAudio.playHover()}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${active ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/30' : 'text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-800 hover:text-white dark:hover:text-lime-400'}`}
  >
    <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />
    {!collapsed && <span className="font-medium text-sm whitespace-nowrap">{label}</span>}
    {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
  </button>
);

/* --- MAIN APP --- */
function App() {
  const [showIntro, setShowIntro] = useState(true);
  
  // AUTH STATES
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [showUpdate, setShowUpdate] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemUpdate | null>(null);
  
  const [currentView, setCurrentView] = useState<PlatformView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // PERSISTENT SETTINGS (Titanium Cube)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('bio_theme') === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('bio_notifications') !== 'false');
  
  // UI Toggles
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Data States
  const [query, setQuery] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [resultData, setResultData] = useState<MicroorganismData | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'web' | 'images'>('summary');
  
  // Voice & Speak (Removed Mic Logic)
  const [isSpeaking, setIsSpeaking] = useState(false);

  // PERSISTENT DATA (Titanium Cube)
  const [collection, setCollection] = useState<MicroorganismData[]>(() => {
    try {
      const saved = localStorage.getItem('bio_collection');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('bio_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Tools State
  const [dnaInput, setDnaInput] = useState('');
  const [unitInput, setUnitInput] = useState('');
  const [unitFrom, setUnitFrom] = useState('um');

  // Features
  const [showBrowser, setShowBrowser] = useState(false);
  const [browserContent, setBrowserContent] = useState('');
  const [browserUrl, setBrowserUrl] = useState('');
  const [browserTitle, setBrowserTitle] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{ role: 'model', text: '¡Hola! Soy Bio, tu asistente de laboratorio. ¿En qué puedo ayudarte hoy?', timestamp: new Date().toLocaleTimeString() }]);
  const [chatInput, setChatInput] = useState('');
  
  // REAL FILE UPLOAD REF
  const fileInputRef = useRef<HTMLInputElement>(null);

  // System State
  const [weather, setWeather] = useState<WeatherData>({ temp: 0, weatherCode: 0, microbe: '...', description: '...', loading: true });
  const [spotlight, setSpotlight] = useState<SpotlightData | null>(null);

  // Map Locations
  const bioMapLocations: BioMapLocation[] = [
      { id: 'volcano', name: 'Volcán Activo', temp: '85°C', icon: 'Flame', description: 'Hogar de extremófilos termófilos.', query: 'Microorganismos termófilos volcánicos' },
      { id: 'ocean', name: 'Fosa Oceánica', temp: '2°C', icon: 'Droplets', description: 'Bacterias barófilas de alta presión.', query: 'Bacterias de fosas marinas' },
      { id: 'gut', name: 'Intestino Humano', temp: '37°C', icon: 'Dna', description: 'Microbiota esencial para la vida.', query: 'Bacterias del intestino humano' },
      { id: 'arctic', name: 'Hielo Ártico', temp: '-15°C', icon: 'Snowflake', description: 'Psicrófilos en animación suspendida.', query: 'Bacterias del hielo ártico' }
  ];

  // --- EFFECTS ---

  useEffect(() => {
    bioAudio.setEnabled(audioEnabled);
  }, [audioEnabled]);

  // Auth Check on Mount (Titanium Cube)
  useEffect(() => {
      const savedUser = localStorage.getItem('bio_user');
      if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
      }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bio_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('bio_notifications', String(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('bio_collection', JSON.stringify(collection));
  }, [collection]);

  useEffect(() => {
    localStorage.setItem('bio_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // UPDATE SYSTEM EFFECT (Daily)
  useEffect(() => {
    if (!isAuthenticated) return; 

    const checkUpdates = async () => {
        const today = new Date().toDateString();
        const lastUpdate = localStorage.getItem('bio_last_update');
        
        if (lastUpdate !== today) {
            const updates = await generateDailyChangelog();
            setSystemInfo(updates);
            setShowUpdate(true); 
            localStorage.setItem('bio_last_update', today);
        } else {
             setSystemInfo({ version: `v${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}`, date: today, features: [] });
        }
    };
    setTimeout(checkUpdates, 1000);
  }, [isAuthenticated]);

  // Initial Loads
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`);
          const data = await res.json();
          const bioData = await getMicrobeForTemperature(data.current.temperature_2m);
          setWeather({
            temp: data.current.temperature_2m,
            weatherCode: data.current.weather_code,
            microbe: bioData.name,
            description: bioData.desc,
            loading: false
          });
        } catch { setWeather(prev => ({ ...prev, loading: false, description: 'Sin señal satelital' })); }
      }, () => setWeather(prev => ({ ...prev, loading: false, description: 'GPS Inactivo' })));
    }
    getWeeklySpotlight().then(setSpotlight);
  }, []);

  // Actions
  const toggleDarkMode = () => { bioAudio.playClick(); setDarkMode(!darkMode); };
  const toggleNotifications = () => { bioAudio.playClick(); setNotificationsEnabled(!notificationsEnabled); };
  
  const addToCollection = () => {
    bioAudio.playClick();
    if (resultData && !collection.find(c => c.scientificName === resultData.scientificName)) {
      setCollection(prev => [...prev, resultData!]);
      bioAudio.playSuccess();
    }
  };

  const loadFromCollection = (data: MicroorganismData) => {
    bioAudio.playClick();
    setResultData(data);
    setQuery(data.commonName || data.scientificName || '');
    setCurrentView('search');
    setAppState(AppState.SUCCESS);
  };

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    bioAudio.playClick();
    setQuery(searchTerm);
    setCurrentView('search');
    setAppState(AppState.LOADING);
    setResultData(null);
    setGeneratedImage(null);
    setActiveTab('summary');

    const newHistoryItem = { term: searchTerm, timestamp: new Date().toLocaleString(), type: 'search' };
    setSearchHistory(prev => {
      const newState = [newHistoryItem, ...prev.filter(h => h.term !== searchTerm)].slice(50);
      localStorage.setItem('bio_history', JSON.stringify(newState)); 
      return newState;
    });

    try {
      const data = await fetchMicroorganismData(searchTerm);
      if (!data.isValid) { 
          bioAudio.playError();
          setAppState(AppState.INVALID_SEARCH); 
          return; 
      }
      bioAudio.playSuccess();
      setResultData(data);
      setAppState(AppState.SUCCESS);
    } catch { 
        bioAudio.playError();
        setAppState(AppState.ERROR); 
    }
  }, []);

  const speakText = (text: string) => {
    if(isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
    }
    bioAudio.playClick();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    bioAudio.playClick();
    const msg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg, timestamp: new Date().toLocaleTimeString() }]);
    const response = await chatWithBio(msg, resultData?.scientificName || '');
    setChatMessages(prev => [...prev, { role: 'model', text: response, timestamp: new Date().toLocaleTimeString() }]);
    bioAudio.playSuccess();
  };

  const triggerImageGeneration = async () => {
    if (!resultData) return;
    setIsGeneratingImage(true);
    setGeneratedImage(null);
    try {
      const term = resultData.scientificName || resultData.commonName || query;
      const img = await generateFastMicroscopeImage(term);
      setGeneratedImage(img);
      bioAudio.playSuccess();
    } catch (e) { console.error(e); } finally { setIsGeneratingImage(false); }
  };

  // --- FILE UPLOAD (REAL) ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          bioAudio.playSuccess();
          const file = e.target.files[0];
          const newFileEntry: MicroorganismData = {
              isValid: true,
              responseType: 'ENTITY',
              scientificName: file.name,
              commonName: file.name,
              type: file.type || 'Archivo Desconocido',
              fileSize: `${(file.size / 1024).toFixed(1)} KB`,
              lastModified: new Date().toLocaleDateString(),
              description: "Archivo subido manualmente por el usuario.",
              bioAnswer: "Archivo externo.",
              taxonomy: { kingdom: 'Usuario', phylum: 'Upload' }
          };
          
          setCollection(prev => {
              const newState = [newFileEntry, ...prev];
              localStorage.setItem('bio_collection', JSON.stringify(newState));
              return newState;
          });
          setCurrentView('drive');
      }
  };

  // AUTH ACTIONS
  const handleLoginSuccess = (userData: UserProfile) => {
      bioAudio.playSuccess();
      setUser(userData);
      setTimeout(() => setShowScanner(true), 100);
  };

  const handleScanComplete = () => {
      setShowScanner(false);
      setIsAuthenticated(true);
  };

  const handleLogout = () => {
    bioAudio.playClick();
    localStorage.removeItem('bio_user'); 
    setUser(null);
    setIsAuthenticated(false);
    setShowIntro(true);
    setCurrentView('dashboard');
    setShowUserMenu(false);
  };

  // Helpers
  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-full h-full text-amber-400" />;
    if (code >= 95) return <CloudLightning className="w-full h-full text-indigo-400" />;
    if (code >= 51) return <CloudRain className="w-full h-full text-blue-400" />;
    return <Cloud className="w-full h-full text-slate-400" />;
  };

  const getHazardColor = (level?: string) => {
    switch(level) {
      case 'Safe': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Low': return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Moderate': return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400';
      case 'High': return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400';
      case 'Extreme': return 'bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const analyzeDNA = () => {
    const seq = dnaInput.toUpperCase().replace(/[^ATCG]/g, '');
    const len = seq.length;
    const gc = seq.split('').filter(c => c === 'G' || c === 'C').length;
    return { len, gc: len > 0 ? ((gc / len) * 100).toFixed(2) : 0 };
  };

  const convertUnits = () => {
    const val = parseFloat(unitInput) || 0;
    if (unitFrom === 'mm') return `${val * 1000} µm / ${val * 1000000} nm`;
    if (unitFrom === 'um') return `${val / 1000} mm / ${val * 1000} nm`;
    if (unitFrom === 'nm') return `${val / 1000} µm / ${val / 1000000} mm`;
    return '-';
  };
  
  const getMapIcon = (name: string) => {
      if(name === 'Flame') return <Flame className="w-8 h-8"/>;
      if(name === 'Droplets') return <Droplets className="w-8 h-8"/>;
      if(name === 'Dna') return <Dna className="w-8 h-8"/>;
      return <MapPin className="w-8 h-8"/>;
  }

  // --- RENDER FLOW ---

  if (showIntro) return <Intro onComplete={() => setShowIntro(false)} />;

  if (showScanner) return <BioScanner onScanComplete={handleScanComplete} />;

  if (!isAuthenticated) return <AuthScreen onLoginSuccess={handleLoginSuccess} />;

  if (showUpdate && systemInfo) return <UpdateScreen updateData={systemInfo} onComplete={() => setShowUpdate(false)} />;

  return (
    <div className={`flex h-screen font-body text-slate-800 dark:text-slate-200 overflow-hidden selection:bg-lime-200 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      {/* --- SIDEBAR --- */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-slate-900 dark:bg-black border-r border-slate-800 flex flex-col transition-all duration-300 z-50 shadow-2xl relative`}>
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-logo font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => {setCurrentView('dashboard'); bioAudio.playClick();}}>
            <div className="w-8 h-8 bg-gradient-to-br from-lime-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-lime-500/20">
              <Microscope className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && <span>biogle</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} collapsed={sidebarCollapsed} />
          <NavItem icon={Search} label="Investigación" active={currentView === 'search'} onClick={() => setCurrentView('search')} collapsed={sidebarCollapsed} />
          <NavItem icon={MessageCircle} label="BioChat" active={currentView === 'chat'} onClick={() => setCurrentView('chat')} collapsed={sidebarCollapsed} />
          
          <div className="py-2 opacity-50 text-xs font-bold uppercase text-slate-500 px-4 mt-2 mb-1">{!sidebarCollapsed && "Aplicaciones"}</div>
          <NavItem icon={Map} label="BioMaps" active={currentView === 'maps'} onClick={() => setCurrentView('maps')} collapsed={sidebarCollapsed} />
          <NavItem icon={HardDrive} label="BioDrive" active={currentView === 'drive'} onClick={() => setCurrentView('drive')} collapsed={sidebarCollapsed} />
          <NavItem icon={Calculator} label="BioTools" active={currentView === 'tools'} onClick={() => setCurrentView('tools')} collapsed={sidebarCollapsed} />
          
          <div className="py-2 opacity-50 text-xs font-bold uppercase text-slate-500 px-4 mt-2 mb-1">{!sidebarCollapsed && "Sistema"}</div>
          <NavItem icon={History} label="Historial" active={currentView === 'history'} onClick={() => setCurrentView('history')} collapsed={sidebarCollapsed} />
          <NavItem icon={SettingsIcon} label="Configuración" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} collapsed={sidebarCollapsed} />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button onClick={() => {setSidebarCollapsed(!sidebarCollapsed); bioAudio.playClick();}} className="w-full flex justify-center text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-800">
             {sidebarCollapsed ? <ChevronRight className="w-5 h-5"/> : <ArrowLeft className="w-5 h-5"/>}
           </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-300 bg-slate-50 dark:bg-slate-900">
        
        {/* TOPBAR */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shadow-sm z-40 transition-colors">
           <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm font-medium flex items-center gap-2">
                  Plataforma BioOS <span className="bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-400 px-2 py-0.5 rounded text-xs font-bold">{systemInfo?.version || 'v2024.1.0'}</span>
              </span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 relative">
                 <button 
                  onClick={toggleNotifications}
                  className="p-2 text-slate-400 hover:text-lime-600 hover:bg-lime-50 dark:hover:bg-slate-700 rounded-full transition-colors relative"
                 >
                    <Bell className="w-5 h-5" />
                    {notificationsEnabled && collection.length > 5 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>}
                 </button>
                 
                 {/* Notifications Dropdown */}
                 {showNotifications && (
                   <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 p-2 animate-in fade-in slide-in-from-top-2">
                     <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-300">Notificaciones</div>
                     {notificationsEnabled ? (
                       <div className="space-y-1 mt-1">
                          {collection.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-400">Sin notificaciones nuevas.</div>
                          ) : (
                             <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer" onClick={() => bioAudio.playClick()}>
                                <div className="text-xs font-bold text-blue-500">BIODRIVE</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{collection.length} archivos almacenados seguros.</div>
                             </div>
                          )}
                       </div>
                     ) : (
                       <div className="p-4 text-center text-xs text-slate-400">Las notificaciones están desactivadas.</div>
                     )}
                   </div>
                 )}
              </div>
              
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
              
              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => {setShowUserMenu(!showUserMenu); bioAudio.playClick();}}
                  className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-1 pr-3 rounded-full border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all"
                >
                   {user?.avatar.startsWith('http') ? (
                      <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full bg-slate-200" />
                   ) : (
                      <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center text-lg shadow-sm border border-lime-200">
                          {user?.avatar}
                      </div>
                   )}
                   <div className="flex flex-col items-start leading-none">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user?.name}</span>
                      <span className="text-[10px] text-lime-600 font-bold uppercase">{user?.role}</span>
                   </div>
                   <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute top-12 right-0 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-1 animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => {setUser(u => u ? {...u, role: 'En Linea'} : null); bioAudio.playClick();}} className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div> En Linea
                    </button>
                    <button onClick={() => {setUser(u => u ? {...u, role: 'Ausente'} : null); bioAudio.playClick();}} className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Ausente
                    </button>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
           </div>
        </header>

        {/* CONTENT SCROLLABLE AREA */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          
          {/* --- VIEW: DASHBOARD --- */}
          {currentView === 'dashboard' && user && (
             <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-48">
                <div className="flex justify-between items-end mb-4">
                   <div>
                      <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Hola, {user.name} 👋</h1>
                      <p className="text-slate-500 dark:text-slate-400">Aquí está tu resumen del ecosistema hoy.</p>
                   </div>
                   <div className="text-right hidden md:block">
                      <div className="text-2xl font-mono font-bold text-slate-700 dark:text-slate-300">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      <div className="text-xs font-bold text-lime-600 uppercase tracking-widest">{new Date().toLocaleDateString(undefined, {weekday: 'long', day: 'numeric', month: 'long'})}</div>
                   </div>
                </div>

                {/* WIDGETS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   
                   {/* WEATHER WIDGET */}
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                         <div className="w-24 h-24">{getWeatherIcon(weather.weatherCode)}</div>
                      </div>
                      <div className="relative z-10">
                         <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-lime-500" />
                            <span className="text-xs font-bold text-slate-400 uppercase">Condiciones Locales</span>
                         </div>
                         <div className="flex items-end gap-2 mb-2">
                            <span className="text-5xl font-bold text-slate-800 dark:text-white">{weather.temp}°</span>
                            <span className="text-lg text-slate-400 mb-2">C</span>
                         </div>
                         <div className="h-px w-full bg-slate-100 dark:bg-slate-700 my-3"></div>
                         <div>
                            <span className="text-xs text-slate-400 block mb-1">Microorganismo Dominante</span>
                            <span className="text-sm font-bold text-lime-600">{weather.microbe}</span>
                         </div>
                      </div>
                   </div>

                   {/* SPOTLIGHT WIDGET */}
                   <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 p-6 rounded-2xl text-white shadow-lg shadow-slate-200 dark:shadow-none col-span-1 md:col-span-2 relative overflow-hidden group cursor-pointer" onClick={() => {performSearch(spotlight?.title || ''); bioAudio.playClick();}}>
                      <div className="absolute top-0 right-0 bg-lime-500 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20">SPOTLIGHT</div>
                      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-lime-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                         <div>
                            <div className="flex items-center gap-2 mb-3 opacity-60">
                               <Radio className="w-4 h-4 text-lime-400 animate-pulse" />
                               <span className="text-xs font-mono uppercase tracking-widest">Novedad Semanal</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2 group-hover:text-lime-300 transition-colors">{spotlight?.title || 'Cargando...'}</h2>
                            <p className="text-slate-400 text-sm line-clamp-2">{spotlight?.content}</p>
                         </div>
                         <div className="mt-4 flex items-center gap-2 text-xs font-bold text-lime-400 group-hover:translate-x-1 transition-transform">
                            INVESTIGAR AHORA <ChevronRight className="w-3 h-3" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* SEARCH BAR (In Dashboard) */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-lime-100 dark:border-slate-700 shadow-xl shadow-lime-50/50 dark:shadow-none flex flex-col items-center justify-center text-center mt-6 transition-colors">
                   <div className="w-16 h-16 bg-lime-50 dark:bg-lime-900/20 rounded-2xl flex items-center justify-center mb-4 text-lime-600">
                      <Microscope className="w-8 h-8" />
                   </div>
                   <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Iniciar nueva investigación</h2>
                   <div className="w-full max-w-2xl relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 to-green-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-200 pointer-events-none"></div>
                      <input 
                        value={query}
                        onChange={e => {setQuery(e.target.value); bioAudio.playTyping();}}
                        onKeyDown={e => {if(e.key === 'Enter') performSearch(query)}}
                        placeholder="Buscar cepas, bacterias, virus..."
                        className="relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10 shadow-sm text-lg z-10 dark:text-white"
                      />
                      <button onClick={() => performSearch(query)} className="absolute right-2 top-2 bottom-2 bg-slate-900 dark:bg-lime-600 text-white p-3 rounded-full hover:bg-lime-600 dark:hover:bg-lime-500 transition-colors z-20">
                         <Search className="w-5 h-5" />
                      </button>
                   </div>
                   <div className="flex gap-2 mt-4 text-sm text-slate-400">
                      <span className="font-bold">Tendencias:</span>
                      <button onClick={() => {performSearch("Tardígrados"); bioAudio.playClick();}} className="hover:text-lime-600 hover:underline">Tardígrados</button> • 
                      <button onClick={() => {performSearch("CRISPR"); bioAudio.playClick();}} className="hover:text-lime-600 hover:underline">CRISPR</button> • 
                      <button onClick={() => {performSearch("Mitocondria"); bioAudio.playClick();}} className="hover:text-lime-600 hover:underline">Mitocondria</button>
                   </div>
                </div>
             </div>
          )}

          {/* --- VIEW: SEARCH --- */}
          {currentView === 'search' && (
             <div className="max-w-7xl mx-auto h-full flex flex-col pb-48">
                {/* Search Header */}
                <div className="sticky top-0 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur z-20 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6 flex items-center gap-4 transition-colors">
                   <div className="flex-1 relative">
                      <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        value={query}
                        onChange={e => {setQuery(e.target.value); bioAudio.playTyping();}}
                        onKeyDown={e => {if(e.key === 'Enter') performSearch(query)}}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-12 pr-4 py-3 focus:border-lime-500 outline-none shadow-sm dark:text-white"
                        placeholder="Buscar..."
                      />
                   </div>
                   <div className="flex gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-600">
                      <button onClick={() => {setActiveTab('summary'); bioAudio.playClick();}} className={`p-2 rounded-lg transition-all ${activeTab === 'summary' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}><LayoutDashboard className="w-5 h-5"/></button>
                      <button onClick={() => {setActiveTab('details'); bioAudio.playClick();}} className={`p-2 rounded-lg transition-all ${activeTab === 'details' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}><ListTree className="w-5 h-5"/></button>
                      <button onClick={() => {setActiveTab('web'); bioAudio.playClick();}} className={`p-2 rounded-lg transition-all ${activeTab === 'web' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}><Globe className="w-5 h-5"/></button>
                      <button onClick={() => {setActiveTab('images'); triggerImageGeneration(); bioAudio.playClick();}} className={`p-2 rounded-lg transition-all ${activeTab === 'images' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}><ImageIcon className="w-5 h-5"/></button>
                   </div>
                </div>

                {appState === AppState.LOADING && (
                   <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                      <div className="w-12 h-12 border-4 border-lime-200 border-t-lime-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-500 font-mono">Procesando consulta biológica...</p>
                   </div>
                )}

                {appState === AppState.SUCCESS && resultData && (
                   <div className="flex-1 overflow-y-auto pr-2 pb-10">
                      {/* Result Header */}
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{resultData.type || 'Entidad'}</span>
                               {resultData.hazardLevel && <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getHazardColor(resultData.hazardLevel)}`}>{resultData.hazardLevel}</span>}
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{resultData.commonName || resultData.scientificName}</h1>
                            <p className="text-slate-500 dark:text-slate-400 italic font-serif">{resultData.scientificName}</p>
                         </div>
                         <div className="flex gap-4 items-center">
                            {resultData.habitatTemp && (
                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-600">
                                <Thermometer className="w-6 h-6 text-orange-500" />
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Hábitat</div>
                                    <div className="text-xl font-bold text-slate-800 dark:text-slate-200 leading-none">{resultData.habitatTemp}</div>
                                </div>
                                </div>
                            )}
                            <button 
                              onClick={() => speakText(resultData.description || '')}
                              className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-800"
                              title="Escuchar Descripción"
                            >
                                {isSpeaking ? <StopCircle className="w-6 h-6 animate-pulse"/> : <PlayCircle className="w-6 h-6" />}
                            </button>
                            <button 
                              onClick={addToCollection}
                              className="p-3 rounded-xl bg-lime-50 dark:bg-lime-900/30 text-lime-600 hover:bg-lime-100 dark:hover:bg-lime-900/50 transition-colors border border-lime-200 dark:border-lime-800"
                              title="Guardar en Colección"
                            >
                                {collection.find(c => c.scientificName === resultData.scientificName) ? <CheckCircle className="w-6 h-6"/> : <Bookmark className="w-6 h-6" />}
                            </button>
                         </div>
                      </div>

                      {/* Dynamic Tab Content */}
                      {activeTab === 'summary' && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-lime-600"/> Descripción</h3>
                                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{resultData.description || resultData.bioAnswer}</p>
                               </div>
                            </div>
                            <div className="space-y-6">
                               <div className="bg-lime-50/50 dark:bg-lime-900/10 p-6 rounded-2xl border border-lime-100 dark:border-lime-900 transition-colors">
                                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500"/> ¿Sabías que?</h3>
                                  <ul className="space-y-3">
                                     {resultData.funFacts?.map((f, i) => (
                                        <li key={i} className="text-sm text-slate-700 dark:text-slate-300 italic border-l-2 border-lime-300 dark:border-lime-700 pl-3">"{f}"</li>
                                     ))}
                                  </ul>
                               </div>
                            </div>
                         </div>
                      )}

                      {activeTab === 'details' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                               <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Fingerprint className="w-4 h-4 text-purple-500"/> Clasificación</h3>
                               <div className="space-y-0">
                                  {Object.entries(resultData.taxonomy || {}).map(([k, v]) => (
                                     <div key={k} className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                        <span className="text-slate-400 capitalize text-sm">{k}</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-200">{v}</span>
                                     </div>
                                  ))}
                               </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                               <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><ListTree className="w-4 h-4 text-blue-500"/> Características</h3>
                               <div className="flex flex-wrap gap-2">
                                  {resultData.characteristics?.map((c, i) => (
                                     <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium">{c}</span>
                                  ))}
                               </div>
                            </div>
                         </div>
                      )}

                      {activeTab === 'web' && (
                         <div className="space-y-4">
                            {resultData.webResults?.map((res, i) => (
                               <div key={i} onClick={() => { setBrowserUrl(res.url); setBrowserTitle(res.title); setShowBrowser(true); fetchSimulatedPageContent(res.title, query).then(setBrowserContent); bioAudio.playClick(); }} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-lime-500 dark:hover:border-lime-500 hover:shadow-md transition-all cursor-pointer group">
                                  <div className="text-xs text-lime-600 font-mono mb-1">{res.url}</div>
                                  <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-lime-700 dark:group-hover:text-lime-400 mb-2">{res.title}</h3>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">{res.snippet}</p>
                                </div>
                            ))}
                         </div>
                      )}

                      {activeTab === 'images' && (
                         <div className="space-y-4">
                            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative aspect-video group">
                               {isGeneratingImage ? (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                     <RefreshCw className="w-8 h-8 animate-spin mb-2 text-lime-500"/>
                                     <span className="font-mono text-xs">GENERANDO IMAGEN MICROSCÓPICA...</span>
                                  </div>
                               ) : generatedImage ? (
                                  <img src={generatedImage} className="w-full h-full object-cover" alt="Generated" />
                               ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-slate-500">No image generated</div>
                               )}
                               <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-white text-xs font-mono border border-white/20">SEM VIEW x20000</div>
                            </div>
                            
                            <div className="flex justify-center">
                                <a 
                                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={() => bioAudio.playClick()}
                                    className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-lime-500 dark:hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 transition-all shadow-sm font-bold"
                                >
                                    <Globe className="w-5 h-5" />
                                    Ver imágenes reales en Google
                                    <ExternalLink className="w-4 h-4 opacity-50" />
                                </a>
                            </div>
                         </div>
                      )}
                   </div>
                )}
             </div>
          )}

          {/* --- VIEW: CHAT --- */}
          {currentView === 'chat' && (
             <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                <div className="bg-slate-50 dark:bg-slate-700 p-4 border-b border-slate-200 dark:border-slate-600 flex items-center gap-3">
                   <div className="bg-lime-500 p-2 rounded-lg text-white"><Bot className="w-5 h-5"/></div>
                   <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">Asistente Bio</h2>
                      <div className="flex items-center gap-1 text-xs text-lime-600 dark:text-lime-400 font-bold"><span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse"></span> ONLINE</div>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
                   {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] ${msg.role === 'user' ? 'bg-slate-900 dark:bg-lime-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-sm shadow-sm'} p-4`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-slate-400 dark:text-lime-200' : 'text-slate-300 dark:text-slate-500'}`}>{msg.timestamp}</span>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                   <form onSubmit={e => { e.preventDefault(); sendChatMessage(); }} className="flex gap-2">
                      <input 
                        value={chatInput} 
                        onChange={e => {setChatInput(e.target.value); bioAudio.playTyping();}}
                        placeholder="Pregunta sobre biología..."
                        className="flex-1 bg-slate-100 dark:bg-slate-700 border-transparent focus:bg-white dark:focus:bg-slate-600 focus:border-lime-500 rounded-xl px-4 py-3 outline-none transition-all dark:text-white"
                      />
                      <button type="submit" className="bg-lime-500 hover:bg-lime-600 text-white p-3 rounded-xl transition-colors"><Send className="w-5 h-5"/></button>
                   </form>
                </div>
             </div>
          )}

           {/* --- VIEW: BIOMAPS --- */}
           {currentView === 'maps' && (
              <div className="max-w-7xl mx-auto h-full p-4 overflow-y-auto">
                 <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                     <Map className="w-8 h-8 text-lime-600"/> BioMaps <span className="text-sm font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Explorador de Hábitats</span>
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bioMapLocations.map((loc) => (
                       <div key={loc.id} onClick={() => {performSearch(loc.query); bioAudio.playClick();}} className="group cursor-pointer relative h-64 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                          <div className={`absolute inset-0 bg-gradient-to-br ${loc.id === 'volcano' ? 'from-orange-500 to-red-900' : loc.id === 'ocean' ? 'from-blue-600 to-indigo-900' : loc.id === 'gut' ? 'from-pink-400 to-rose-900' : 'from-cyan-300 to-blue-800'} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                              <div className="p-4 bg-white/20 backdrop-blur-md rounded-full mb-4 transform group-hover:scale-110 transition-transform">
                                  {getMapIcon(loc.icon)}
                              </div>
                              <h3 className="text-2xl font-bold mb-1">{loc.name}</h3>
                              <p className="text-white/80 text-sm mb-4">{loc.description}</p>
                              <div className="flex items-center gap-1 text-xs font-mono bg-black/30 px-3 py-1 rounded-full">
                                  <Thermometer className="w-3 h-3"/> {loc.temp}
                              </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {/* --- VIEW: BIODRIVE (COLLECTION) --- */}
           {currentView === 'drive' && (
              <div className="max-w-7xl mx-auto h-full p-4 overflow-y-auto">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <HardDrive className="w-8 h-8 text-lime-600"/> BioDrive
                    </h2>
                    <div className="flex gap-2">
                        {/* REAL UPLOAD BUTTON */}
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                        <button onClick={() => {fileInputRef.current?.click(); bioAudio.playClick();}} className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-lime-500/20 active:scale-95">
                            <Upload className="w-4 h-4"/> Subir Muestra
                        </button>
                    </div>
                 </div>
                 
                 <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase">
                        <div className="col-span-6 flex items-center gap-2">Nombre</div>
                        <div className="col-span-2">Tipo</div>
                        <div className="col-span-2">Tamaño</div>
                        <div className="col-span-2 text-right">Modificado</div>
                    </div>
                    {/* List */}
                    {collection.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">
                           <Folder className="w-12 h-12 mx-auto mb-3 opacity-50"/>
                           <p>Tu unidad BioDrive está vacía.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                           {collection.map((item, i) => (
                              <div key={i} onClick={() => loadFromCollection(item)} className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer group transition-colors items-center">
                                  <div className="col-span-6 flex items-center gap-3">
                                      <File className="w-5 h-5 text-blue-500"/>
                                      <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{item.scientificName}</span>
                                  </div>
                                  <div className="col-span-2 text-xs text-slate-500">{item.type || 'Muestra'}</div>
                                  <div className="col-span-2 text-xs text-slate-500 font-mono">{item.fileSize || '12.4 MB'}</div>
                                  <div className="col-span-2 text-right text-xs text-slate-400">{item.lastModified || 'Hoy'}</div>
                              </div>
                           ))}
                        </div>
                    )}
                 </div>
              </div>
           )}

           {/* --- VIEW: TOOLS --- */}
          {currentView === 'tools' && (
             <div className="max-w-7xl mx-auto h-full p-4 overflow-y-auto">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-lime-600"/> BioTools
                    <span className="text-sm font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Suite v1.0</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {/* Tool 1: DNA Analyzer */}
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-lg"><Dna className="w-6 h-6"/></div>
                         <h3 className="font-bold text-slate-800 dark:text-white">Analizador Genético</h3>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">Calcula contenido GC y longitud.</p>
                      <textarea 
                        value={dnaInput}
                        onChange={e => {setDnaInput(e.target.value); bioAudio.playTyping();}}
                        placeholder="Secuencia (ATCG...)"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-mono mb-4 h-24 focus:ring-2 ring-lime-500 outline-none dark:text-white"
                      />
                      <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg flex justify-between text-sm">
                         <div className="text-center">
                            <div className="text-xs text-slate-400">Longitud</div>
                            <div className="font-bold font-mono dark:text-white">{analyzeDNA().len} bp</div>
                         </div>
                         <div className="text-center">
                            <div className="text-xs text-slate-400">GC %</div>
                            <div className="font-bold font-mono text-lime-600">{analyzeDNA().gc}%</div>
                         </div>
                      </div>
                   </div>

                   {/* Tool 2: Unit Converter */}
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-lg"><Scale className="w-6 h-6"/></div>
                         <h3 className="font-bold text-slate-800 dark:text-white">Conversor Micro</h3>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">Transforma unidades de medida.</p>
                      <div className="flex gap-2 mb-4">
                         <input 
                           type="number" 
                           value={unitInput}
                           onChange={e => {setUnitInput(e.target.value); bioAudio.playTyping();}}
                           className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none dark:text-white"
                           placeholder="0.00"
                         />
                         <select value={unitFrom} onChange={e => {setUnitFrom(e.target.value); bioAudio.playClick();}} className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-sm px-2 outline-none dark:text-white">
                            <option value="mm">mm</option>
                            <option value="um">µm</option>
                            <option value="nm">nm</option>
                         </select>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-center">
                         <div className="text-xs text-slate-400 mb-1">Equivalencia</div>
                         <div className="font-mono font-bold text-blue-500 dark:text-blue-400">{convertUnits()}</div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* --- VIEW: HISTORY --- */}
          {currentView === 'history' && (
             <div className="max-w-4xl mx-auto h-full p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <History className="w-8 h-8 text-lime-600"/> Historial de Búsqueda
                    </h2>
                    {searchHistory.length > 0 && (
                        <button 
                            onClick={() => { setSearchHistory([]); localStorage.removeItem('bio_history'); bioAudio.playClick(); }}
                            className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4"/> Borrar Historial
                        </button>
                    )}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                   {searchHistory.length === 0 ? (
                      <div className="p-10 text-center text-slate-400">
                         <Clock className="w-12 h-12 mx-auto mb-3 opacity-50"/>
                         <p>No hay historial reciente.</p>
                      </div>
                   ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-700">
                         {searchHistory.map((item, i) => (
                            <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between group transition-colors">
                               <div className="flex items-center gap-4">
                                  <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400"><Search className="w-4 h-4"/></div>
                                  <div>
                                     <div className="font-bold text-slate-800 dark:text-slate-200">{item.term}</div>
                                     <div className="text-xs text-slate-400">{item.timestamp}</div>
                                  </div>
                               </div>
                               <button onClick={() => {performSearch(item.term); bioAudio.playClick();}} className="text-lime-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                                  Buscar de nuevo
                               </button>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* --- VIEW: COLLECTION (LEGACY REDIRECT TO DRIVE) --- */}
          {currentView === 'collection' && (
             <div className="max-w-7xl mx-auto h-full p-4 overflow-y-auto flex flex-col items-center justify-center">
                 <h2 className="text-2xl font-bold mb-4 dark:text-white">Redirigiendo a BioDrive...</h2>
                 <button onClick={() => setCurrentView('drive')} className="text-lime-500 hover:underline">Click si no redirige</button>
             </div>
          )}

           {/* --- VIEW: SETTINGS --- */}
           {currentView === 'settings' && (
             <div className="max-w-2xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-2">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Configuración</h1>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                   
                   {/* Storage Info */}
                   <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-lg">
                             <HardDrive className="w-6 h-6"/>
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-200">Almacenamiento Local</h3>
                            <p className="text-xs text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Persistencia Activa (Titanium Core)</p>
                         </div>
                      </div>
                      <div className="text-right">
                          <div className="text-2xl font-bold text-slate-800 dark:text-white">{collection.length}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Items Guardados</div>
                      </div>
                   </div>
                   
                   {/* Audio Toggle */}
                   <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors" onClick={() => setAudioEnabled(!audioEnabled)}>
                      <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg ${audioEnabled ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                             {audioEnabled ? <Volume2 className="w-6 h-6"/> : <VolumeX className="w-6 h-6"/>}
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-200">BioSonic FX</h3>
                            <p className="text-xs text-slate-400">Sonidos de interfaz sintéticos</p>
                         </div>
                      </div>
                      <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${audioEnabled ? 'bg-lime-500' : 'bg-slate-200'}`}>
                          <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-md transition-transform duration-300 ${audioEnabled ? 'left-7' : 'left-1'}`}></div>
                      </div>
                   </div>

                   {/* Dark Mode Toggle */}
                   <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors" onClick={toggleDarkMode}>
                      <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                             {darkMode ? <Moon className="w-6 h-6"/> : <Sun className="w-6 h-6"/>}
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-200">Modo Oscuro</h3>
                            <p className="text-xs text-slate-400">Apariencia de laboratorio nocturno</p>
                         </div>
                      </div>
                      <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${darkMode ? 'bg-lime-500' : 'bg-slate-200'}`}>
                          <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-md transition-transform duration-300 ${darkMode ? 'left-7' : 'left-1'}`}></div>
                      </div>
                   </div>

                   {/* Notifications Toggle */}
                   <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors" onClick={toggleNotifications}>
                      <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg ${notificationsEnabled ? 'bg-lime-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                             <Bell className="w-6 h-6"/>
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-200">Notificaciones</h3>
                            <p className="text-xs text-slate-400">Alertas del sistema</p>
                         </div>
                      </div>
                      <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${notificationsEnabled ? 'bg-lime-500' : 'bg-slate-200'}`}>
                          <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-md transition-transform duration-300 ${notificationsEnabled ? 'left-7' : 'left-1'}`}></div>
                      </div>
                   </div>

                   {/* Logout Button */}
                   <div onClick={handleLogout} className="p-6 flex items-center gap-4 text-red-500 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"><LogOut className="w-6 h-6" /></div>
                      <div>
                        <span className="font-bold text-lg block">Cerrar Sesión</span>
                        <span className="text-xs text-red-400">Destruir credenciales locales y salir.</span>
                      </div>
                   </div>
                </div>
             </div>
          )}
          
        </main>
      </div>

      {/* OVERLAY COMPONENTS */}
      {showBrowser && <BioBrowser url={browserUrl} title={browserTitle} content={browserContent} onClose={() => setShowBrowser(false)} />}
    </div>
  );
}

export default App;
