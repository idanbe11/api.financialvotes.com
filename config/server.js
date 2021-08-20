module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'f4845756e792eed8faefae7bb4c93c92'),
    },
  },
  cron: {
    enabled:true
  },
});
