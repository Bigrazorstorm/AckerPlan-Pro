/**
 * AgroTrack Icon Library
 * Exportiert häufig verwendete Lucide Icons mit agrarischen Namen
 */

export {
  // Navigation & Common
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Settings,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Copy,
  Download,
  Upload,
  Share2,
  MoreVertical,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  // Agrar-spezifische Icons
  TrendingUp,
  TrendingDown,
  BarChart3,
  MapPin,
  Leaf,
  Droplets,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Zap,
  Activity,
  Gauge,
  Target,
  Map,
  Navigation,
  Compass,
  Phone,
  Mail,
  MapIcon,
  Filter,
  Calendar,
  Clock as ClockIcon,
  User,
  Users,
  Package,
  Briefcase,
  Wrench,
  Tool,
  Hammer,
  Boxes,
  Container,
  Truck,
  DollarSign,
  Euro,
  AlertOctagon,
  BookOpen,
  FileText,
  LogOut,
  LogIn,
  Lock,
  Unlock,
  // Spezial
  Loader2,
  Spinner,
  CheckCircle2,
  Circle,
  Heart,
  Star,
  Archive,
  Inbox,
  Repeat2,
  RefreshCw,
  Save,
  Send,
  Slash,
  MessageSquare,
} from "lucide-react"

/**
 * Häufig verwendete Icon-Größen standardisieren:
 * - 16px: Inline-Icons in Text (z.B. Badge)
 * - 20px: Standard Inline-Icons (Labels, kleine Buttons)
 * - 24px: Standalone Icons (Navigation, Button)
 * - 32px: Featured Icons (Empty States, Willkommen-Seite)
 * - 48px: Hero Icons (Large Displays)
 */

export const ICON_SIZES = {
  xs: 16, // Für Badge + Inline
  sm: 20, // Standard
  md: 24, // Navigation
  lg: 32, // Featured
  xl: 48, // Hero
} as const

/**
 * Icon-Namen für Agrar-Szenarien
 * Hilft dem Team zu verstehen welche Icons für was da sind
 */
export const AGRO_ICONS = {
  fields: "Leaf", // Schläge / Felder
  operations: "TrendingUp", // Operationen / Arbeitsaufträge
  map: "Map", // Kartendarstellung
  personal: "Users", // Personal / Mitarbeiter
  machinery: "Wrench", // Maschinen / Fuhrpark
  storage: "Boxes", // Lager
  weather: "Cloud", // Wetter
  costs: "Euro", // Kosten
  growth: "TrendingUp", // Wachstum / Ertrag
  damage: "AlertTriangle", // Schäden / Wildschaden
  documentation: "FileText", // Dokumentation
  reports: "BarChart3", // Berichte
  settings: "Settings", // Einstellungen
  profile: "User", // Profil
  notifications: "Bell", // Benachrichtigungen
  search: "Search", // Suche
  filter: "Filter", // Filter
  sort: "Sliders", // Sortierung
  download: "Download", // Download/Export
  upload: "Upload", // Upload
  delete: "Trash2", // Löschen
  edit: "Edit", // Bearbeiten
  save: "Save", // Speichern
  add: "Plus", // Hinzufügen
  back: "ChevronLeft", // Zurück
  next: "ChevronRight", // Weiter
  expand: "ChevronDown", // Ausklappen
  collapse: "ChevronUp", // Einklappen
  menu: "Menu", // Menü
  close: "X", // Schließen
  help: "HelpCircle", // Hilfe
  info: "Info", // Information
  warning: "AlertCircle", // Warnung
  error: "AlertOctagon", // Fehler
  success: "CheckCircle", // Erfolg
  loading: "Loader2", // Lädt
  phone: "Phone", // Telefon
  email: "Mail", // E-Mail
  location: "MapPin", // Standort
} as const

/**
 * Verwendungsbeispiele:
 *
 * // Mit Größe
 * import { Leaf } from "@/components/ui/icons"
 * <Leaf size={ICON_SIZES.md} />
 *
 * // Mit Stroke-Weight
 * <Leaf size={24} strokeWidth={1.5} /> // Agrar-dünn
 *
 * // In einem Button
 * <Button variant="default">
 *   <Plus size={20} />
 *   Neuer Schlag
 * </Button>
 */
