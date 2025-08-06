import galleryImage from './galleryImage';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    galleryImage, // Add your new schema here
  ]),
});