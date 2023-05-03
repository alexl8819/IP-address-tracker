import cors from 'vercel-cors';

export default cors({
  origin: 'https://ip-address-tracker-eight-blush.vercel.app/',
  methods: ['GET', 'HEAD', 'OPTIONS'],
  credentials: true
});