export type ContentBlockPublicNestedBlockType =
  | "text"
  | "image"
  | "video"
  | "file"
  | "link"
  | "gallery"
  | "banner";

/** Элемент галереи в публичном API: `url` — полный публичный URL после бэкенда */
export interface ContentBlockGalleryImageItem {
  url: string;
  alt?: string | null;
}

export interface ContentBlockPublicNested {
  id: string;
  block_type: ContentBlockPublicNestedBlockType;
  sort_order: number;
  title: string | null;
  content: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  link_url: string | null;
  link_label: string | null;
  device_type: "all" | "both" | "desktop" | "mobile";
  /** Для `gallery`: `{ images: [{ url, alt }] }`; другие типы — по мере расширения API */
  block_metadata?: {
    images?: ContentBlockGalleryImageItem[];
    [key: string]: unknown;
  } | null;
}
