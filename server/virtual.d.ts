declare module 'virtual:site-assets' {
  export const assets: Record<string, { body: string; contentType: string; gzip: boolean }>;
}
