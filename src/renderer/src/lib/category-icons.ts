import {
  Tag, Briefcase, ShoppingCart, Zap, Users, Wrench,
  Monitor, Globe, BarChart2, Package, CreditCard, Megaphone,
  Building2, BookOpen, Coffee, Star, Plane, Car, Home, Laptop,
  Wifi, Server, Database, Code2, Palette, Camera, Music, Headphones,
  Printer, Phone, Mail, Clock, Calendar, MapPin, Lock, Shield,
  TrendingUp, PieChart, DollarSign, Banknote, Receipt, Wallet,
  Award, Lightbulb, Rocket, Target, Truck, Factory,
  Leaf, Heart, Stethoscope, GraduationCap, Hammer, Scissors,
  // Équipe & RH
  UserCheck, UserPlus, UserX, Users2, PersonStanding, Handshake, Baby,
  Smile, ThumbsUp, Brain, Dumbbell, Accessibility, CircleUser, Medal, Trophy, Timer,
  // Finance
  ArrowUpDown, BadgeDollarSign, Calculator, CandlestickChart, ChartNoAxesCombined,
  CircleDollarSign, Coins, HandCoins, Landmark, PiggyBank, Scale, TrendingDown,
  LineChart, Gauge, Percent,
  // Tech & Digital
  AppWindow, Binary, Bot, Braces, Bug, Cable, CircuitBoard, Cloud, CloudUpload,
  Cpu, FileCode2, GitBranch, GitMerge, HardDrive, Keyboard,
  LayoutDashboard, Microchip, MousePointer2, Network, QrCode, Radio, Repeat,
  RotateCcw, ScanLine, Settings, Settings2, Smartphone, Terminal, Webhook, Workflow,
  // Marketing & Créa
  AtSign, BadgeCheck, Bookmark, Clapperboard, Contact, Eye, FileImage,
  FileVideo, Flag, Hash, Layers, Layout, MessageSquare, MessageCircle,
  Newspaper, PenTool, Rss, Search, Send, Share2, SquarePen, Tv, Video, Sparkles,
  // Locaux & Logistique
  Anchor, Archive, Box, Bus, Compass, Container, Forklift, Fuel,
  Hotel, HousePlus, Mailbox, Mountain, Navigation, ParkingMeter, Ship, Tent,
  Train, TreePine, Warehouse, Wind,
  // Juridique & Conformité
  BadgeAlert, ClipboardCheck, ClipboardList, FileCheck2, FileText, FileLock2,
  FileWarning, Gavel, ScrollText, ShieldCheck, Signature, TriangleAlert, Stamp,
  // Communication
  Bell, Headset, PhoneCall, Mic, Volume2, Podcast,
  // Gestion de projet
  ListTodo, FolderKanban, FolderTree, Milestone, SlidersHorizontal, Repeat2,
  Split, Combine, CornerUpRight, Move, Pin, Save, Download, Upload,
  Filter, SortAsc, Table, Grid3x3, LayoutGrid, SquareStack,
  // Général
  Umbrella, Fingerprint, Key, Link, ExternalLink, Paperclip, LibraryBig,
  Inbox, TestTube, FlaskConical, Joystick, Watch, Plug, Component,
  Info, HelpCircle, Activity, ZoomIn,
  // Évènement & Nourriture
  PartyPopper, Cake, Wine, Beer, Martini, IceCream2, Pizza, Sandwich,
  Salad, Apple, Banana, Cherry, Grape, Carrot, Egg, Fish, Beef,
  Cookie, CupSoda, Soup, UtensilsCrossed, Utensils, ChefHat, ConciergeBell,
  Ticket, Drama, FerrisWheel, Sparkle, Laugh, Gift,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  Tag, Briefcase, ShoppingCart, Zap, Users, Wrench,
  Monitor, Globe, BarChart2, Package, CreditCard, Megaphone,
  Building2, BookOpen, Coffee, Star, Plane, Car, Home, Laptop,
  Wifi, Server, Database, Code2, Palette, Camera, Music, Headphones,
  Printer, Phone, Mail, Clock, Calendar, MapPin, Lock, Shield,
  TrendingUp, PieChart, DollarSign, Banknote, Receipt, Wallet,
  Award, Lightbulb, Rocket, Target, Truck, Factory,
  Leaf, Heart, Stethoscope, GraduationCap, Hammer, Scissors,
  UserCheck, UserPlus, UserX, Users2, PersonStanding, Handshake, Baby,
  Smile, ThumbsUp, Brain, Dumbbell, Accessibility, CircleUser, Medal, Trophy, Timer,
  ArrowUpDown, BadgeDollarSign, Calculator, CandlestickChart, ChartNoAxesCombined,
  CircleDollarSign, Coins, HandCoins, Landmark, PiggyBank, Scale, TrendingDown,
  LineChart, Gauge, Percent,
  AppWindow, Binary, Bot, Braces, Bug, Cable, CircuitBoard, Cloud, CloudUpload,
  Cpu, FileCode2, GitBranch, GitMerge, HardDrive, Keyboard,
  LayoutDashboard, Microchip, MousePointer2, Network, QrCode, Radio, Repeat,
  RotateCcw, ScanLine, Settings, Settings2, Smartphone, Terminal, Webhook, Workflow,
  AtSign, BadgeCheck, Bookmark, Clapperboard, Contact, Eye, FileImage,
  FileVideo, Flag, Hash, Layers, Layout, MessageSquare, MessageCircle,
  Newspaper, PenTool, Rss, Search, Send, Share2, SquarePen, Tv, Video, Sparkles,
  Anchor, Archive, Box, Bus, Compass, Container, Forklift, Fuel,
  Hotel, HousePlus, Mailbox, Mountain, Navigation, ParkingMeter, Ship, Tent,
  Train, TreePine, Warehouse, Wind,
  BadgeAlert, ClipboardCheck, ClipboardList, FileCheck2, FileText, FileLock2,
  FileWarning, Gavel, ScrollText, ShieldCheck, Signature, TriangleAlert, Stamp,
  Bell, Headset, PhoneCall, Mic, Volume2, Podcast,
  ListTodo, FolderKanban, FolderTree, Milestone, SlidersHorizontal, Repeat2,
  Split, Combine, CornerUpRight, Move, Pin, Save, Download, Upload,
  Filter, SortAsc, Table, Grid3x3, LayoutGrid, SquareStack,
  Umbrella, Fingerprint, Key, Link, ExternalLink, Paperclip, LibraryBig,
  Inbox, TestTube, FlaskConical, Joystick, Watch, Plug, Component,
  Info, HelpCircle, Activity, ZoomIn,
  PartyPopper, Cake, Wine, Beer, Martini, IceCream2, Pizza, Sandwich,
  Salad, Apple, Banana, Cherry, Grape, Carrot, Egg, Fish, Beef,
  Cookie, CupSoda, Soup, UtensilsCrossed, Utensils, ChefHat, ConciergeBell,
  Ticket, Drama, FerrisWheel, Sparkle, Laugh, Gift,
}

export function getIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? Tag
}
