export interface ShareTemplate {
  id: string;
  name: string;
  background: string | { type: 'gradient'; colors: string[]; angle: number };
  textColor: string;
  quoteMarkColor: string | null;
  authorColor: string;
  separatorColor: string;
  brandingColor: string;
  previewDot: string;
}

export const shareTemplates: ShareTemplate[] = [
  {
    id: 'classic',
    name: 'Classico',
    background: '#F8F6F0',
    textColor: '#2D2D28',
    quoteMarkColor: '#B5845A',
    authorColor: '#7A8B6F',
    separatorColor: '#B5845A',
    brandingColor: '#9B8E7E',
    previewDot: '#F8F6F0',
  },
  {
    id: 'dark',
    name: 'Escuro',
    background: '#1A1B18',
    textColor: '#F0EDE5',
    quoteMarkColor: '#8B9B7F',
    authorColor: '#C49468',
    separatorColor: '#8B9B7F',
    brandingColor: '#8A8478',
    previewDot: '#1A1B18',
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    background: '#FFFFFF',
    textColor: '#000000',
    quoteMarkColor: null,
    authorColor: '#666666',
    separatorColor: '#CCCCCC',
    brandingColor: '#CCCCCC',
    previewDot: '#FFFFFF',
  },
  {
    id: 'nature',
    name: 'Natureza',
    background: { type: 'gradient', colors: ['#2D3B28', '#5C6B50'], angle: 160 },
    textColor: '#F0EDE5',
    quoteMarkColor: '#D4A574',
    authorColor: '#C49468',
    separatorColor: '#D4A574',
    brandingColor: 'rgba(240,237,229,0.4)',
    previewDot: '#5C6B50',
  },
];
