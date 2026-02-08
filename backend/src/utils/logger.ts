import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Simpan error ke file 'error.log'
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Simpan semua log ke 'combined.log'
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Jika di laptop (development), tampilkan juga di terminal dengan warna
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export default logger;