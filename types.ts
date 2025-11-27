
export type ResponseType = 'ENTITY' | 'QA' | 'INVALID';

export type PlatformView = 'dashboard' | 'search' | 'chat' | 'collection' | 'tools' | 'history' | 'settings' | 'maps' | 'drive';

export interface UserProfile {
  name: string;
  role: string;
  level: number;
  avatar: string;
}

export interface WebResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface Taxonomy {
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
}

export interface MicroorganismData {
  isValid: boolean;
  responseType: ResponseType;
  scientificName?: string;
  commonName?: string;
  type?: string;
  description?: string;
  characteristics?: string[];
  taxonomy?: Taxonomy;
  hazardLevel?: 'Safe' | 'Low' | 'Moderate' | 'High' | 'Extreme';
  funFacts?: string[];
  webResults?: WebResult[];
  bioAnswer?: string;
  habitatTemp?: string; 
  fileSize?: string; // For BioDrive simulation
  lastModified?: string; // For BioDrive simulation
}

export interface SearchResult {
  data: MicroorganismData;
}

export interface HistoryItem {
  term: string;
  timestamp: string;
  type: string;
}

export enum AppState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
  INVALID_SEARCH
}

export interface WeatherData {
  temp: number;
  weatherCode: number;
  microbe: string;
  description: string;
  loading: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface SpotlightData {
  title: string;
  subtitle: string;
  content: string;
  tag: string;
}

export interface SystemUpdate {
  version: string;
  features: string[];
  date: string;
}

export interface BioMapLocation {
  id: string;
  name: string;
  temp: string;
  icon: string; // Icon name
  description: string;
  query: string;
}