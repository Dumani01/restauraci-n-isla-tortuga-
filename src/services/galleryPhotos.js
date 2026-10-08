const galleryImageModules = import.meta.glob('../assets/galeria/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
});

export const galleryPhotos = Object.entries(galleryImageModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, 'en', { numeric: true }))
  .map(([path, src], index) => ({
    id: `gallery-photo-${index + 1}`,
    src,
    path,
  }));
