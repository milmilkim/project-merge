export type EditionSlug = '4th' | '5th' | '6th';

export interface EditionVenue {
  name: string;
  address: string;
}

export interface Edition {
  no: number;
  slug: EditionSlug;
  title: string;
  subtitle?: string;
  venue?: EditionVenue;
  status: 'published' | 'coming-soon';
}
