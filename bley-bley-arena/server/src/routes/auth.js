import express from 'express';
import { body } from 'express-validator';
import { prisma } from '../db.js';
import { validate } from '../middleware/validate.js';
import { hashPassword, verifyPassword, signToken, makeResetToken, hashToken } from '../utils/auth.js';
import { sendResetEmail } from '../utils/mailer.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const safeUser = (u) => ({ id: u.id, email: u.email, username: u.username, avatarUrl: u.avatarUrl, bio: u.bio, darkMode: u.darkMode });

router.post('/register', [body('email').isEmail(), body('username').isLength({ min: 3 }), body('password').isLength({ min: 8 })], validate, async (req, res) => {
  const { email, username, password } = req.body;
  const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (exists) return res.status(409).json({ message: 'Email o usuario ya existe' });
  const user = await prisma.user.create({ data: { email: email.toLowerCase(), username, passwordHash: await hashPassword(password) } });
  res.status(201).json({ user: safeUser(user), token: signToken(user) });
});

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email.toLowerCase() } });
  if (!user || !(await verifyPassword(req.body.password, user.passwordHash))) return res.status(401).json({ message: 'Credenciales incorrectas' });
  res.json({ user: safeUser(user), token: signToken(user) });
});

router.get('/me', requireAuth, (req, res) => res.json({ user: safeUser(req.user) }));

router.put('/profile', requireAuth, async (req, res) => {
  const { username, avatarUrl, bio, darkMode } = req.body;
  const user = await prisma.user.update({ where: { id: req.user.id }, data: { username, avatarUrl, bio, darkMode } });
  res.json({ user: safeUser(user) });
});

router.post('/forgot-password', [body('email').isEmail()], validate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email.toLowerCase() } });
  if (user) {
    const raw = makeResetToken();
    await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + 30 * 60 * 1000) } });
    await sendResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password?token=${raw}`);
  }
  res.json({ message: 'Si el email existe, se ha enviado un enlace de recuperación' });
});

router.post('/reset-password', [body('token').notEmpty(), body('password').isLength({ min: 8 })], validate, async (req, res) => {
  const reset = await prisma.passwordResetToken.findFirst({ where: { tokenHash: hashToken(req.body.token), usedAt: null, expiresAt: { gt: new Date() } } });
  if (!reset) return res.status(400).json({ message: 'Token inválido o caducado' });
  await prisma.user.update({ where: { id: reset.userId }, data: { passwordHash: await hashPassword(req.body.password) } });
  await prisma.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } });
  res.json({ message: 'Contraseña actualizada' });
});

export default router;
