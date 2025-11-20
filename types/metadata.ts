export interface GenerateMetadataParams {
  title: string;
  description: string;
  path?: string;
  image?: {
    url?: string;
    width?: number;
    height?: number;
    alt?: string;
  };
}
