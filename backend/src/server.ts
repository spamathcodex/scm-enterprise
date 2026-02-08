import app from './app';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`🛡️  Environment: ${process.env.NODE_ENV}`);
});