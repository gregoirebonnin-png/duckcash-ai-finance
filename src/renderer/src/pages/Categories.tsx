import { useState } from 'react'
import { GlassCard, SectionHeader } from '../components/ui-bits'
import { fmtMoney } from '../lib/lovable-mock-data'
import { useCategoriesStore } from '../stores/categories'
import { useProjectsStore } from '../stores/projects'
import type { Category } from '../stores/categories'
import {
  Plus, X, Tag, Briefcase, ShoppingCart, Zap, Users, Wrench,
  Monitor, Globe, BarChart2, Package, CreditCard, Megaphone,
  Building2, BookOpen, Coffee, Star, Plane, Car, Home, Laptop,
  Wifi, Server, Database, Code2, Palette, Camera, Music, Headphones,
  Printer, Phone, Mail, Clock, Calendar, MapPin, Lock, Shield,
  TrendingUp, PieChart, DollarSign, Banknote, Receipt, Wallet,
  Award, Lightbulb, Rocket, Target, Truck, Factory,
  Leaf, Heart, Stethoscope, GraduationCap, Hammer, Scissors,
  FolderOpen, Check, Trash2,
  // Évènement & Nourriture
  PartyPopper, Cake, Wine, Beer, Martini, IceCream2, Pizza, Sandwich,
  Salad, Apple, Banana, Cherry, Grape, Carrot, Egg, Fish, Beef,
  Cookie, CupSoda, Soup, UtensilsCrossed, Utensils, ChefHat, ConciergeBell,
  Ticket, Drama, FerrisWheel, Sparkle, Laugh, Gift,
  // Équipe & RH
  UserCheck, UserPlus, UserX, Users2, PersonStanding, Handshake, Baby,
  Smile, ThumbsUp, Brain, Dumbbell, Accessibility, CircleUser,
  // Finance
  ArrowUpDown, BadgeDollarSign, Calculator, CandlestickChart, ChartNoAxesCombined,
  CircleDollarSign, Coins, HandCoins, Landmark, PiggyBank, Scale, TrendingDown,
  // Tech & Digital
  AppWindow, Binary, Bot, Braces, Bug, Cable, CircuitBoard, Cloud, CloudUpload,
  Cpu, FileCode2, FunctionSquare, GitBranch, GitMerge, HardDrive, Keyboard,
  LayoutDashboard, Microchip, MousePointer2, Network, QrCode, Radio, Repeat,
  RotateCcw, ScanLine, Settings, Settings2, Smartphone, Terminal, Webhook, Workflow,
  // Marketing & Créa
  AtSign, BadgeCheck, Bookmark, ChartBar, Clapperboard, Contact, Eye, FileImage,
  FileVideo, Flag, Gauge, Hash, Layers, Layout, LineChart, MessageSquare,
  Newspaper, PenTool, Rss, Search, Send, Share2, SquarePen, Tv, Video,
  // Locaux & Logistique
  Anchor, Archive, Box, Bus, Compass, Container, Forklift, Fuel, GlobeLock,
  Hotel, HousePlus, Mailbox, Mountain, Navigation, ParkingMeter, Ship, Tent,
  Train, TreePine, Warehouse, Wind,
  // Juridique & Conformité
  BadgeAlert, ClipboardCheck, ClipboardList, FileCheck2, FileText, FileLock2,
  FileWarning, Gavel, ScrollText, ShieldCheck, Signature, TriangleAlert,
  // Communication
  Bell, Headset, Megaphone as MegaphoneAlt, MessageCircle, Mic, PhoneCall,
  Podcast, SpeakerLoud, Volume2,
  // Général
  Activity, AlignLeft, Asterisk, Beaker, CircleHelp, CircleOff, Combine,
  Component, CornerUpRight, Crop, Diff, Download, Eraser, ExternalLink,
  File, Filter, Fingerprint, Flashlight, FlaskConical, Focus, Frown,
  FolderKanban, FolderTree, Grid3x3, HelpCircle, Hexagon,
  Image, Inbox, Info, Joystick, Key, LayoutGrid, LibraryBig, Link,
  List, ListTodo, Medal, Milestone, Move, Paperclip, PenLine,
  Percent, Pin, Play, Plug, PlusCircle, Pointer, QrCode as QrCodeAlt,
  Repeat2, Save, Scan, SlidersHorizontal, SortAsc, Sparkles, Split,
  SquareStack, Stamp, Table, TestTube, ThumbsDown, Timer, ToggleLeft,
  Trophy, Umbrella, Upload, Vibrate, Watch, Zap as ZapAlt, ZoomIn,
} from 'lucide-react'
import { getIcon } from '../lib/category-icons'

const ICON_GROUPS = [
  {
    group: 'Équipe & RH',
    icons: [
      { key: 'Users', icon: Users, label: 'Équipe' },
      { key: 'Users2', icon: Users2, label: 'Groupe' },
      { key: 'UserCheck', icon: UserCheck, label: 'Validé' },
      { key: 'UserPlus', icon: UserPlus, label: 'Recrutement' },
      { key: 'UserX', icon: UserX, label: 'Départ' },
      { key: 'CircleUser', icon: CircleUser, label: 'Profil' },
      { key: 'PersonStanding', icon: PersonStanding, label: 'Personne' },
      { key: 'Handshake', icon: Handshake, label: 'Partenariat' },
      { key: 'Heart', icon: Heart, label: 'Bien-être' },
      { key: 'Smile', icon: Smile, label: 'Satisfaction' },
      { key: 'ThumbsUp', icon: ThumbsUp, label: 'Approbation' },
      { key: 'Brain', icon: Brain, label: 'Compétences' },
      { key: 'Dumbbell', icon: Dumbbell, label: 'Formation' },
      { key: 'GraduationCap', icon: GraduationCap, label: 'Diplôme' },
      { key: 'BookOpen', icon: BookOpen, label: 'Études' },
      { key: 'Stethoscope', icon: Stethoscope, label: 'Santé' },
      { key: 'Award', icon: Award, label: 'Récompense' },
      { key: 'Medal', icon: Medal, label: 'Médaille' },
      { key: 'Trophy', icon: Trophy, label: 'Trophée' },
      { key: 'Clock', icon: Clock, label: 'Temps' },
      { key: 'Timer', icon: Timer, label: 'Chrono' },
      { key: 'Calendar', icon: Calendar, label: 'Planning' },
      { key: 'Accessibility', icon: Accessibility, label: 'Accessibilité' },
      { key: 'Baby', icon: Baby, label: 'Congé parental' },
    ],
  },
  {
    group: 'Finance & Comptabilité',
    icons: [
      { key: 'CreditCard', icon: CreditCard, label: 'Carte' },
      { key: 'Banknote', icon: Banknote, label: 'Billet' },
      { key: 'DollarSign', icon: DollarSign, label: 'Dollar' },
      { key: 'CircleDollarSign', icon: CircleDollarSign, label: 'Devise' },
      { key: 'BadgeDollarSign', icon: BadgeDollarSign, label: 'Badge' },
      { key: 'Coins', icon: Coins, label: 'Pièces' },
      { key: 'HandCoins', icon: HandCoins, label: 'Paiement' },
      { key: 'Wallet', icon: Wallet, label: 'Portefeuille' },
      { key: 'Receipt', icon: Receipt, label: 'Facture' },
      { key: 'PiggyBank', icon: PiggyBank, label: 'Épargne' },
      { key: 'Landmark', icon: Landmark, label: 'Banque' },
      { key: 'Scale', icon: Scale, label: 'Équilibre' },
      { key: 'Calculator', icon: Calculator, label: 'Calcul' },
      { key: 'Percent', icon: Percent, label: 'Pourcentage' },
      { key: 'TrendingUp', icon: TrendingUp, label: 'Hausse' },
      { key: 'TrendingDown', icon: TrendingDown, label: 'Baisse' },
      { key: 'ArrowUpDown', icon: ArrowUpDown, label: 'Variation' },
      { key: 'PieChart', icon: PieChart, label: 'Camembert' },
      { key: 'BarChart2', icon: BarChart2, label: 'Histogramme' },
      { key: 'LineChart', icon: LineChart, label: 'Courbe' },
      { key: 'CandlestickChart', icon: CandlestickChart, label: 'Bourse' },
      { key: 'ChartNoAxesCombined', icon: ChartNoAxesCombined, label: 'Combiné' },
      { key: 'Gauge', icon: Gauge, label: 'Indicateur' },
    ],
  },
  {
    group: 'Tech & Digital',
    icons: [
      { key: 'Monitor', icon: Monitor, label: 'Écran' },
      { key: 'Laptop', icon: Laptop, label: 'Laptop' },
      { key: 'Smartphone', icon: Smartphone, label: 'Mobile' },
      { key: 'Keyboard', icon: Keyboard, label: 'Clavier' },
      { key: 'MousePointer2', icon: MousePointer2, label: 'Souris' },
      { key: 'Server', icon: Server, label: 'Serveur' },
      { key: 'HardDrive', icon: HardDrive, label: 'Stockage' },
      { key: 'Database', icon: Database, label: 'Base données' },
      { key: 'Cloud', icon: Cloud, label: 'Cloud' },
      { key: 'CloudUpload', icon: CloudUpload, label: 'Upload' },
      { key: 'Cpu', icon: Cpu, label: 'CPU' },
      { key: 'Microchip', icon: Microchip, label: 'Puce' },
      { key: 'CircuitBoard', icon: CircuitBoard, label: 'Circuit' },
      { key: 'Code2', icon: Code2, label: 'Code' },
      { key: 'Braces', icon: Braces, label: 'JSON' },
      { key: 'Binary', icon: Binary, label: 'Binaire' },
      { key: 'Terminal', icon: Terminal, label: 'Terminal' },
      { key: 'FileCode2', icon: FileCode2, label: 'Fichier code' },
      { key: 'Bug', icon: Bug, label: 'Bug' },
      { key: 'GitBranch', icon: GitBranch, label: 'Git branch' },
      { key: 'GitMerge', icon: GitMerge, label: 'Git merge' },
      { key: 'Webhook', icon: Webhook, label: 'API' },
      { key: 'Network', icon: Network, label: 'Réseau' },
      { key: 'Wifi', icon: Wifi, label: 'Wi-Fi' },
      { key: 'Cable', icon: Cable, label: 'Câble' },
      { key: 'Globe', icon: Globe, label: 'Web' },
      { key: 'AppWindow', icon: AppWindow, label: 'Interface' },
      { key: 'LayoutDashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { key: 'Bot', icon: Bot, label: 'IA / Bot' },
      { key: 'Workflow', icon: Workflow, label: 'Workflow' },
      { key: 'Settings', icon: Settings, label: 'Config' },
      { key: 'Settings2', icon: Settings2, label: 'Paramètres' },
      { key: 'Lock', icon: Lock, label: 'Sécurité' },
      { key: 'Shield', icon: Shield, label: 'Protection' },
      { key: 'Phone', icon: Phone, label: 'Téléphonie' },
      { key: 'Printer', icon: Printer, label: 'Impression' },
      { key: 'Headphones', icon: Headphones, label: 'Support' },
      { key: 'ScanLine', icon: ScanLine, label: 'Scan' },
      { key: 'QrCode', icon: QrCode, label: 'QR code' },
      { key: 'Radio', icon: Radio, label: 'Radio' },
    ],
  },
  {
    group: 'Marketing & Créa',
    icons: [
      { key: 'Megaphone', icon: Megaphone, label: 'Marketing' },
      { key: 'Rss', icon: Rss, label: 'Flux' },
      { key: 'AtSign', icon: AtSign, label: 'Email / Social' },
      { key: 'Hash', icon: Hash, label: 'Hashtag' },
      { key: 'Share2', icon: Share2, label: 'Partage' },
      { key: 'Send', icon: Send, label: 'Envoi' },
      { key: 'MessageSquare', icon: MessageSquare, label: 'Message' },
      { key: 'MessageCircle', icon: MessageCircle, label: 'Chat' },
      { key: 'Mail', icon: Mail, label: 'Email' },
      { key: 'Newspaper', icon: Newspaper, label: 'Presse' },
      { key: 'Palette', icon: Palette, label: 'Design' },
      { key: 'PenTool', icon: PenTool, label: 'Illustration' },
      { key: 'SquarePen', icon: SquarePen, label: 'Rédaction' },
      { key: 'Camera', icon: Camera, label: 'Photo' },
      { key: 'Video', icon: Video, label: 'Vidéo' },
      { key: 'FileVideo', icon: FileVideo, label: 'Fichier vidéo' },
      { key: 'Clapperboard', icon: Clapperboard, label: 'Production' },
      { key: 'Tv', icon: Tv, label: 'Télévision' },
      { key: 'FileImage', icon: FileImage, label: 'Image' },
      { key: 'Music', icon: Music, label: 'Audio' },
      { key: 'Eye', icon: Eye, label: 'Visibilité' },
      { key: 'Layers', icon: Layers, label: 'Couches' },
      { key: 'Layout', icon: Layout, label: 'Maquette' },
      { key: 'Contact', icon: Contact, label: 'Contact' },
      { key: 'Flag', icon: Flag, label: 'Campagne' },
      { key: 'BadgeCheck', icon: BadgeCheck, label: 'Certifié' },
      { key: 'Bookmark', icon: Bookmark, label: 'Favori' },
      { key: 'Search', icon: Search, label: 'SEO' },
      { key: 'Lightbulb', icon: Lightbulb, label: 'Innovation' },
      { key: 'Rocket', icon: Rocket, label: 'Lancement' },
      { key: 'Target', icon: Target, label: 'Objectif' },
      { key: 'Sparkles', icon: Sparkles, label: 'IA créa' },
    ],
  },
  {
    group: 'Locaux & Logistique',
    icons: [
      { key: 'Building2', icon: Building2, label: 'Bureau' },
      { key: 'Home', icon: Home, label: 'Locaux' },
      { key: 'HousePlus', icon: HousePlus, label: 'Extension' },
      { key: 'Hotel', icon: Hotel, label: 'Hôtel' },
      { key: 'Warehouse', icon: Warehouse, label: 'Entrepôt' },
      { key: 'Factory', icon: Factory, label: 'Usine' },
      { key: 'MapPin', icon: MapPin, label: 'Lieu' },
      { key: 'Navigation', icon: Navigation, label: 'Navigation' },
      { key: 'Compass', icon: Compass, label: 'Boussole' },
      { key: 'Plane', icon: Plane, label: 'Avion' },
      { key: 'Car', icon: Car, label: 'Voiture' },
      { key: 'Bus', icon: Bus, label: 'Bus' },
      { key: 'Train', icon: Train, label: 'Train' },
      { key: 'Ship', icon: Ship, label: 'Bateau' },
      { key: 'Truck', icon: Truck, label: 'Camion' },
      { key: 'Container', icon: Container, label: 'Container' },
      { key: 'Forklift', icon: Forklift, label: 'Chariot' },
      { key: 'Anchor', icon: Anchor, label: 'Ancre' },
      { key: 'Fuel', icon: Fuel, label: 'Carburant' },
      { key: 'Zap', icon: Zap, label: 'Énergie' },
      { key: 'Wind', icon: Wind, label: 'Vent / Éolien' },
      { key: 'TreePine', icon: TreePine, label: 'Nature' },
      { key: 'Mountain', icon: Mountain, label: 'Terrain' },
      { key: 'Tent', icon: Tent, label: 'Événement' },
      { key: 'ParkingMeter', icon: ParkingMeter, label: 'Parking' },
      { key: 'Mailbox', icon: Mailbox, label: 'Courrier' },
    ],
  },
  {
    group: 'Juridique & Conformité',
    icons: [
      { key: 'Gavel', icon: Gavel, label: 'Juridique' },
      { key: 'ScrollText', icon: ScrollText, label: 'Contrat' },
      { key: 'Signature', icon: Signature, label: 'Signature' },
      { key: 'Stamp', icon: Stamp, label: 'Tampon' },
      { key: 'ShieldCheck', icon: ShieldCheck, label: 'Conformité' },
      { key: 'FileLock2', icon: FileLock2, label: 'Fichier protégé' },
      { key: 'FileCheck2', icon: FileCheck2, label: 'Validation' },
      { key: 'FileText', icon: FileText, label: 'Document' },
      { key: 'FileWarning', icon: FileWarning, label: 'Avertissement' },
      { key: 'ClipboardCheck', icon: ClipboardCheck, label: 'Audit' },
      { key: 'ClipboardList', icon: ClipboardList, label: 'Procédure' },
      { key: 'BadgeAlert', icon: BadgeAlert, label: 'Alerte' },
      { key: 'TriangleAlert', icon: TriangleAlert, label: 'Risque' },
      { key: 'Scale', icon: Scale, label: 'Équité' },
    ],
  },
  {
    group: 'Communication',
    icons: [
      { key: 'Bell', icon: Bell, label: 'Notification' },
      { key: 'Headset', icon: Headset, label: 'Support client' },
      { key: 'PhoneCall', icon: PhoneCall, label: 'Appel' },
      { key: 'Mic', icon: Mic, label: 'Micro' },
      { key: 'Volume2', icon: Volume2, label: 'Son' },
      { key: 'Podcast', icon: Podcast, label: 'Podcast' },
    ],
  },
  {
    group: 'Gestion de projet',
    icons: [
      { key: 'ListTodo', icon: ListTodo, label: 'Tâches' },
      { key: 'FolderKanban', icon: FolderKanban, label: 'Kanban' },
      { key: 'FolderTree', icon: FolderTree, label: 'Arborescence' },
      { key: 'Milestone', icon: Milestone, label: 'Jalon' },
      { key: 'SlidersHorizontal', icon: SlidersHorizontal, label: 'Paramètres' },
      { key: 'Repeat', icon: Repeat, label: 'Récurrent' },
      { key: 'Repeat2', icon: Repeat2, label: 'Itération' },
      { key: 'RotateCcw', icon: RotateCcw, label: 'Rollback' },
      { key: 'Split', icon: Split, label: 'Séparation' },
      { key: 'Combine', icon: Combine, label: 'Consolidation' },
      { key: 'CornerUpRight', icon: CornerUpRight, label: 'Escalade' },
      { key: 'Move', icon: Move, label: 'Déplacement' },
      { key: 'Pin', icon: Pin, label: 'Épingle' },
      { key: 'Save', icon: Save, label: 'Sauvegarde' },
      { key: 'Download', icon: Download, label: 'Export' },
      { key: 'Upload', icon: Upload, label: 'Import' },
      { key: 'Filter', icon: Filter, label: 'Filtre' },
      { key: 'SortAsc', icon: SortAsc, label: 'Tri' },
      { key: 'Table', icon: Table, label: 'Tableau' },
      { key: 'Grid3x3', icon: Grid3x3, label: 'Grille' },
      { key: 'LayoutGrid', icon: LayoutGrid, label: 'Vue grille' },
      { key: 'SquareStack', icon: SquareStack, label: 'Empilé' },
    ],
  },
  {
    group: 'Évènement',
    icons: [
      { key: 'PartyPopper', icon: PartyPopper, label: 'Fête' },
      { key: 'Ticket', icon: Ticket, label: 'Ticket' },
      { key: 'Drama', icon: Drama, label: 'Spectacle' },
      { key: 'FerrisWheel', icon: FerrisWheel, label: 'Parc' },
      { key: 'ConciergeBell', icon: ConciergeBell, label: 'Accueil' },
      { key: 'Gift', icon: Gift, label: 'Cadeau' },
      { key: 'Sparkle', icon: Sparkle, label: 'Animation' },
      { key: 'Laugh', icon: Laugh, label: 'Divertissement' },
      { key: 'Tent', icon: Tent, label: 'Tente / Stand' },
      { key: 'Music', icon: Music, label: 'Concert' },
      { key: 'Camera', icon: Camera, label: 'Photo / Vidéo' },
      { key: 'Mic', icon: Mic, label: 'Discours' },
      { key: 'Tv', icon: Tv, label: 'Diffusion' },
      { key: 'Star', icon: Star, label: 'VIP' },
      { key: 'Flag', icon: Flag, label: 'Signalétique' },
      { key: 'MapPin', icon: MapPin, label: 'Lieu' },
    ],
  },
  {
    group: 'Nourriture & Boissons',
    icons: [
      { key: 'Utensils', icon: Utensils, label: 'Repas' },
      { key: 'UtensilsCrossed', icon: UtensilsCrossed, label: 'Restaurant' },
      { key: 'ChefHat', icon: ChefHat, label: 'Cuisine' },
      { key: 'Pizza', icon: Pizza, label: 'Pizza' },
      { key: 'Sandwich', icon: Sandwich, label: 'Sandwich' },
      { key: 'Salad', icon: Salad, label: 'Salade' },
      { key: 'Soup', icon: Soup, label: 'Soupe' },
      { key: 'Beef', icon: Beef, label: 'Viande' },
      { key: 'Fish', icon: Fish, label: 'Poisson' },
      { key: 'Egg', icon: Egg, label: 'Œuf' },
      { key: 'Carrot', icon: Carrot, label: 'Légume' },
      { key: 'Apple', icon: Apple, label: 'Fruit' },
      { key: 'Banana', icon: Banana, label: 'Banane' },
      { key: 'Cherry', icon: Cherry, label: 'Cerise' },
      { key: 'Grape', icon: Grape, label: 'Raisin' },
      { key: 'Cake', icon: Cake, label: 'Gâteau' },
      { key: 'Cookie', icon: Cookie, label: 'Biscuit' },
      { key: 'IceCream2', icon: IceCream2, label: 'Glace' },
      { key: 'Wine', icon: Wine, label: 'Vin' },
      { key: 'Beer', icon: Beer, label: 'Bière' },
      { key: 'Martini', icon: Martini, label: 'Cocktail' },
      { key: 'CupSoda', icon: CupSoda, label: 'Boisson' },
      { key: 'Coffee', icon: Coffee, label: 'Café' },
    ],
  },
  {
    group: 'Général',
    icons: [
      { key: 'Tag', icon: Tag, label: 'Tag' },
      { key: 'Briefcase', icon: Briefcase, label: 'Mallette' },
      { key: 'ShoppingCart', icon: ShoppingCart, label: 'Achat' },
      { key: 'Package', icon: Package, label: 'Produit' },
      { key: 'Box', icon: Box, label: 'Boîte' },
      { key: 'Archive', icon: Archive, label: 'Archive' },
      { key: 'Wrench', icon: Wrench, label: 'Outil' },
      { key: 'Hammer', icon: Hammer, label: 'Construction' },
      { key: 'Scissors', icon: Scissors, label: 'Découpe' },
      { key: 'Coffee', icon: Coffee, label: 'Frais divers' },
      { key: 'Umbrella', icon: Umbrella, label: 'Assurance' },
      { key: 'Leaf', icon: Leaf, label: 'Écologie' },
      { key: 'Fingerprint', icon: Fingerprint, label: 'Identité' },
      { key: 'Key', icon: Key, label: 'Accès' },
      { key: 'Link', icon: Link, label: 'Lien' },
      { key: 'ExternalLink', icon: ExternalLink, label: 'Externe' },
      { key: 'Paperclip', icon: Paperclip, label: 'Pièce jointe' },
      { key: 'LibraryBig', icon: LibraryBig, label: 'Bibliothèque' },
      { key: 'Inbox', icon: Inbox, label: 'Boîte de réception' },
      { key: 'TestTube', icon: TestTube, label: 'Test' },
      { key: 'FlaskConical', icon: FlaskConical, label: 'Labo' },
      { key: 'Joystick', icon: Joystick, label: 'Jeu' },
      { key: 'Watch', icon: Watch, label: 'Montre' },
      { key: 'Plug', icon: Plug, label: 'Plugin' },
      { key: 'Component', icon: Component, label: 'Composant' },
      { key: 'Star', icon: Star, label: 'Favori' },
      { key: 'Info', icon: Info, label: 'Info' },
      { key: 'HelpCircle', icon: HelpCircle, label: 'Aide' },
      { key: 'Activity', icon: Activity, label: 'Activité' },
      { key: 'ZoomIn', icon: ZoomIn, label: 'Analyse' },
    ],
  },
]

const ICONS = ICON_GROUPS.flatMap((g) => g.icons)

const COLORS = [
  // Violets
  '#a78bfa', '#8b5cf6', '#7c3aed', '#c4b5fd', '#ddd6fe',
  // Bleus
  '#00d9ff', '#22d3ee', '#38bdf8', '#60a5fa', '#3b82f6', '#1d4ed8',
  // Roses & Magentas
  '#ec4899', '#f472b6', '#fb7185', '#e879f9', '#d946ef', '#c026d3',
  // Oranges & Rouges
  '#f97316', '#fb923c', '#f87171', '#ef4444', '#dc2626', '#fbbf24',
  // Verts & Cyans
  '#22d3a8', '#34d399', '#4ade80', '#86efac', '#10b981', '#059669',
  // Jaunes & Ambre
  '#facc15', '#fde047', '#fef08a', '#f59e0b', '#d97706',
  // Neutres & Spéciaux
  '#e2e8f0', '#94a3b8', '#64748b', '#f8fafc', '#cbd5e1',
]

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF']
type CatType = 'cost' | 'revenue'

// ── Modal nouvelle catégorie / édition ──────────────────────────
function CategoryModal({
  onClose,
  onAdd,
  onUpdate,
  projects,
  initial,
}: {
  onClose: () => void
  onAdd: (c: Category) => void
  onUpdate?: (c: Category) => void
  projects: { id: string; name: string; client: string }[]
  initial?: Category
}) {
  const { addCostLine, addRevenueLine } = useProjectsStore()
  const isEdit = !!initial
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<CatType>(initial?.type ?? 'cost')
  const [color, setColor] = useState(initial?.color ?? '#a78bfa')
  const [iconKey, setIconKey] = useState(initial?.iconKey ?? 'Tag')
  const [amount, setAmount] = useState(initial?.total ? String(initial.total) : '')
  const [currency, setCurrency] = useState(initial?.currency ?? 'EUR')
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(initial?.projectIds ?? [])
  const [isOverhead, setIsOverhead] = useState(initial?.isOverhead ?? false)

  const SelectedIcon = getIcon(iconKey)

  function toggleProject(id: string) {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const total = parseFloat(amount) || 0
    if (isEdit && initial) {
      onUpdate?.({ ...initial, name, type, color, iconKey, total, currency, projectIds: selectedProjectIds, isOverhead: type === 'cost' ? isOverhead : false })
    } else {
      onAdd({ id: `cat-${Date.now()}`, name, type, color, iconKey, total, currency, count: selectedProjectIds.length, projectIds: selectedProjectIds, isOverhead: type === 'cost' ? isOverhead : false })
      selectedProjectIds.forEach((pid, i) => {
        const line = { id: `cat-line-${Date.now()}-${i}`, label: name, category: name, budget: total, actual: total }
        if (type === 'cost') addCostLine(pid, line)
        else addRevenueLine(pid, line)
      })
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(8,9,12,0.60)' }}
    >
      <div
        className="glass-strong w-full max-w-lg rounded-2xl p-6 glow-violet overflow-y-auto"
        style={{ animation: 'historyIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards', maxHeight: '90vh' }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{isEdit ? 'Modifier' : 'Référentiel'}</div>
            <div className="mt-0.5 text-[18px] font-semibold">{isEdit ? name || 'Catégorie' : 'Nouvelle catégorie'}</div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type */}
          <div>
            <label className="mb-2 block text-[12px] text-muted-foreground">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['cost', 'revenue'] as CatType[]).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className="rounded-xl border py-2.5 text-[13px] font-medium transition-all"
                  style={{
                    borderColor: type === t ? (t === 'cost' ? '#ec489955' : '#22d3a855') : 'rgba(255,255,255,0.08)',
                    background: type === t ? (t === 'cost' ? '#ec489918' : '#22d3a818') : 'rgba(255,255,255,0.02)',
                    color: type === t ? (t === 'cost' ? '#ec4899' : '#22d3a8') : undefined,
                  }}>
                  {t === 'cost' ? 'Coût' : 'Revenu'}
                </button>
              ))}
            </div>
          </div>

          {/* Overhead toggle — coûts indirects */}
          {type === 'cost' && (
            <button
              type="button"
              onClick={() => setIsOverhead((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left transition-all"
              style={{
                borderColor: isOverhead ? '#a78bfa55' : 'rgba(255,255,255,0.08)',
                background: isOverhead ? '#a78bfa12' : 'rgba(255,255,255,0.02)',
              }}
            >
              <div>
                <div className="text-[13px] font-medium" style={{ color: isOverhead ? '#a78bfa' : undefined }}>
                  Overhead / Coût indirect
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  Déduit de la marge brute pour calculer la marge nette
                </div>
              </div>
              <div
                className="ml-3 flex h-5 w-9 shrink-0 items-center rounded-full transition-all"
                style={{ background: isOverhead ? '#a78bfa' : 'rgba(255,255,255,0.12)', padding: '2px' }}
              >
                <div
                  className="h-4 w-4 rounded-full bg-white transition-all"
                  style={{ transform: isOverhead ? 'translateX(16px)' : 'translateX(0)' }}
                />
              </div>
            </button>
          )}

          {/* Nom */}
          <div>
            <label className="mb-1.5 block text-[12px] text-muted-foreground">Nom de la catégorie</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex. Ressources humaines" required
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] placeholder:text-muted-foreground/50 focus:border-white/[0.20] focus:outline-none transition-colors" />
          </div>

          {/* Picto */}
          <div>
            <label className="mb-2 block text-[12px] text-muted-foreground">Pictogramme</label>
            <div className="max-h-52 overflow-y-auto space-y-3 pr-1" style={{ scrollbarWidth: 'thin' }}>
              {ICON_GROUPS.map((group) => (
                <div key={group.group}>
                  <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">{group.group}</div>
                  <div className="grid grid-cols-8 gap-1.5">
                    {group.icons.map((ic) => {
                      const Ic = ic.icon
                      const active = iconKey === ic.key
                      return (
                        <button key={ic.key} type="button" title={ic.label} onClick={() => setIconKey(ic.key)}
                          className="flex items-center justify-center rounded-lg p-2 transition-all"
                          style={{
                            border: `1px solid ${active ? color + '55' : 'rgba(255,255,255,0.08)'}`,
                            background: active ? color + '22' : 'rgba(255,255,255,0.02)',
                            color: active ? color : 'rgba(255,255,255,0.5)',
                          }}>
                          <Ic className="h-4 w-4" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div>
            <label className="mb-2 block text-[12px] text-muted-foreground">Couleur</label>
            <div className="grid grid-cols-10 gap-1.5">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)} className="h-6 w-6 rounded-full transition-all"
                  style={{ background: c, outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: 2, boxShadow: color === c ? `0 0 10px ${c}99` : undefined }} />
              ))}
            </div>
          </div>

          {/* Montant + devise */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3">
              <label className="mb-1.5 block text-[12px] text-muted-foreground">Montant total (optionnel)</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="ex. 50000"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] placeholder:text-muted-foreground/50 focus:border-white/[0.20] focus:outline-none transition-colors" />
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-[12px] text-muted-foreground">Devise</label>
              <div className="grid grid-cols-2 gap-1.5">
                {CURRENCIES.map((cur) => (
                  <button key={cur} type="button" onClick={() => setCurrency(cur)}
                    className="rounded-lg border py-2 text-[12px] font-medium transition-all"
                    style={{
                      borderColor: currency === cur ? color + '55' : 'rgba(255,255,255,0.08)',
                      background: currency === cur ? color + '18' : 'rgba(255,255,255,0.02)',
                      color: currency === cur ? color : undefined,
                    }}>
                    {cur}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assigner à des projets */}
          <div>
            <label className="mb-2 block text-[12px] text-muted-foreground">
              Assigner à des projets <span className="text-muted-foreground/50">(optionnel)</span>
            </label>
            {projects.length === 0 ? (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-3 text-[13px] text-muted-foreground">
                Aucun projet disponible — créez d'abord un projet.
              </div>
            ) : (
              <div className="space-y-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
                {projects.map((p) => {
                  const selected = selectedProjectIds.includes(p.id)
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProject(p.id)}
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-white/[0.04]"
                    >
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all"
                        style={{
                          borderColor: selected ? color : 'rgba(255,255,255,0.15)',
                          background: selected ? color : 'transparent',
                        }}
                      >
                        {selected && <Check className="h-3 w-3 text-[#0a0b10]" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">{p.client}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Aperçu */}
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}22`, color }}>
              <SelectedIcon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-medium">{name || 'Nom de la catégorie'}</div>
              <div className="text-[11px] text-muted-foreground">
                {type === 'cost' ? 'Coût' : 'Revenu'} · 0 ligne
                {selectedProjectIds.length > 0 && ` · ${selectedProjectIds.length} projet${selectedProjectIds.length > 1 ? 's' : ''}`}
              </div>
            </div>
            {amount && (
              <div className="text-[14px] font-medium tabular-nums" style={{ color }}>
                {parseFloat(amount).toLocaleString('fr-FR')} {currency}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              Annuler
            </button>
            <button type="submit"
              className="flex-1 rounded-xl bg-gradient-ai py-2.5 text-[13px] font-medium text-[#0a0b10] transition-transform hover:scale-[1.02]">
              {isEdit ? 'Enregistrer' : 'Créer la catégorie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal assignation rapide ─────────────────────────────────────
function AssignModal({
  category,
  projects,
  onClose,
}: {
  category: Category
  projects: { id: string; name: string; client: string }[]
  onClose: () => void
}) {
  const { categories, assignProject, unassignProject } = useCategoriesStore()
  const { addCostLine, addRevenueLine, removeCostLinesByCategory, removeRevenueLinesByCategory } = useProjectsStore()
  // read live from store so toggling re-renders immediately
  const liveCategory = categories.find((c) => c.id === category.id) ?? category

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(8,9,12,0.60)' }}
    >
      <div
        className="glass-strong w-full max-w-sm rounded-2xl p-5 glow-violet"
        style={{ animation: 'historyIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Assignation</div>
            <div className="mt-0.5 text-[16px] font-semibold">{category.name}</div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3 text-[12px] text-muted-foreground">
          Sélectionnez les projets auxquels cette catégorie de {category.type === 'cost' ? 'coût' : 'revenu'} sera assignée.
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-3 text-[13px] text-muted-foreground">
            Aucun projet disponible.
          </div>
        ) : (
          <div className="space-y-1.5">
            {projects.map((p) => {
              const assigned = liveCategory.projectIds.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    if (assigned) {
                      unassignProject(liveCategory.id, p.id)
                      if (liveCategory.type === 'cost') removeCostLinesByCategory(p.id, liveCategory.name)
                      else removeRevenueLinesByCategory(p.id, liveCategory.name)
                    } else {
                      assignProject(liveCategory.id, p.id)
                      const line = {
                        id: `cat-line-${Date.now()}`,
                        label: liveCategory.name,
                        category: liveCategory.name,
                        budget: liveCategory.total,
                        actual: liveCategory.total,
                      }
                      if (liveCategory.type === 'cost') addCostLine(p.id, line)
                      else addRevenueLine(p.id, line)
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-[13px] transition-all hover:bg-white/[0.04]"
                  style={{
                    borderColor: assigned ? category.color + '55' : 'rgba(255,255,255,0.08)',
                    background: assigned ? category.color + '10' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all"
                    style={{
                      borderColor: assigned ? category.color : 'rgba(255,255,255,0.15)',
                      background: assigned ? category.color : 'transparent',
                    }}
                  >
                    {assigned && <Check className="h-3 w-3 text-[#0a0b10]" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.client}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <button onClick={onClose}
          className="mt-4 w-full rounded-xl bg-gradient-ai py-2.5 text-[13px] font-medium text-[#0a0b10] transition-transform hover:scale-[1.02]">
          Confirmer
        </button>
      </div>
    </div>
  )
}

// ── Page principale ──────────────────────────────────────────────
export default function Categories() {
  const [showModal, setShowModal] = useState(false)
  const [assignTarget, setAssignTarget] = useState<Category | null>(null)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoriesStore()
  const { projects, removeCostLinesByCategory, removeRevenueLinesByCategory } = useProjectsStore()

  const costs = categories.filter((c) => c.type === 'cost')
  const revs = categories.filter((c) => c.type === 'revenue')

  function Section({ title, items }: { title: string; items: Category[] }) {
    return (
      <GlassCard>
        <div className="mb-4 text-[16px] font-semibold">{title}</div>
        <div className="space-y-2">
          {items.map((c) => {
            const Ic = getIcon(c.iconKey)
            const assignedProjects = projects.filter((p) => c.projectIds.includes(p.id))
            return (
              <div
                key={c.id}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
                onClick={(e) => { if ((e.target as HTMLElement).closest('button')) return; setEditTarget(c) }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${c.color}22`, color: c.color }}>
                      <Ic className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-[14px] font-medium">{c.name}</div>
                        {c.isOverhead && (
                          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ background: '#a78bfa18', color: '#a78bfa', border: '1px solid #a78bfa33' }}>
                            Overhead
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{c.count} lignes actives</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-1">
                      <div className="text-[14px] font-medium tabular-nums">{fmtMoney(c.total)}</div>
                      <div className="text-[11px] text-muted-foreground">cumulé</div>
                    </div>
                    <button
                      onClick={() => setAssignTarget(c)}
                      title="Assigner à un projet"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        projects.forEach((p) => {
                          if (c.type === 'cost') removeCostLinesByCategory(p.id, c.name)
                          else removeRevenueLinesByCategory(p.id, c.name)
                        })
                        deleteCategory(c.id)
                      }}
                      title="Supprimer la catégorie"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Projets assignés */}
                {assignedProjects.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pl-12">
                    {assignedProjects.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{ background: c.color + '18', color: c.color, border: `1px solid ${c.color}33` }}
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </GlassCard>
    )
  }

  return (
    <div>
      {showModal && (
        <CategoryModal
          onClose={() => setShowModal(false)}
          onAdd={addCategory}
          projects={projects}
        />
      )}
      {editTarget && (
        <CategoryModal
          onClose={() => setEditTarget(null)}
          onAdd={addCategory}
          onUpdate={updateCategory}
          projects={projects}
          initial={editTarget}
        />
      )}
      {assignTarget && (
        <AssignModal
          category={assignTarget}
          projects={projects}
          onClose={() => setAssignTarget(null)}
        />
      )}

      <SectionHeader
        eyebrow="Référentiel"
        title="Catégories"
        description="Structurez vos lignes P&L. Réutilisez la même nomenclature sur tous vos projets."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-ai px-4 text-[13px] font-medium text-[#0a0b10] transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-3.5 w-3.5" /> Nouvelle catégorie
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Coûts" items={costs} />
        <Section title="Revenus" items={revs} />
      </div>
    </div>
  )
}
