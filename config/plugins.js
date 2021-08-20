module.exports = ({ env }) => ({
  // ...
  upload: {
    provider: 'cloudinary',
    providerOptions: {
      cloud_name: env('CLOUDINARY_NAME', "financialvotes-com"),
      api_key: env('CLOUDINARY_KEY', "538194876297646"),
      api_secret: env('CLOUDINARY_SECRET', "cGO4Nz-wrVBveRiZoXg5xegzmLg"),
    },
    actionOptions: {
      upload: {},
      delete: {},
    },
  },
  // ...
});