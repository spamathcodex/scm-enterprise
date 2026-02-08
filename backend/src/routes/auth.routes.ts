import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// --- CCTV 1: Cek apakah file ini dimuat ---
console.log("🔍 [DEBUG] File auth.routes.ts berhasil dimuat!");

router.post('/register', (req, res, next) => {
    // --- CCTV 2: Cek apakah request masuk ke sini ---
    console.log("🔍 [DEBUG] Request masuk ke rute POST /register");
    register(req, res, next);
});

router.post('/login', (req, res, next) => {
    console.log("🔍 [DEBUG] Request masuk ke rute POST /login");
    login(req, res, next);
});

router.get('/me', protect, getMe);

export default router;