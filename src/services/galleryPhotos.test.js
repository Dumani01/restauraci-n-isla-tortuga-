import { galleryPhotos } from './galleryPhotos.js';

test('includes every supplied photo in a stable numbered order', () => {
  expect(galleryPhotos).toHaveLength(55);
  expect(galleryPhotos[0].path).toContain('imagen-01.jpeg');
  expect(galleryPhotos.at(-1).path).toContain('imagen-55.jpeg');
  expect(galleryPhotos.every(({ src }) => typeof src === 'string' && src.length > 0)).toBe(true);
});
