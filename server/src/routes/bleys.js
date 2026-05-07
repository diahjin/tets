import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../db.js';
const router = express.Router();
router.use(requireAuth);
const parseTags = b => ({ ...b, tags: JSON.parse(b.tags || '[]') });
const data = (body) => ({ ...body, tags: JSON.stringify(body.tags || []) });

router.get('/', async (req, res) => {
  const { q, type, sort } = req.query;
  const bleys = await prisma.bley.findMany({ where: { userId: req.user.id, name: q ? { contains: q } : undefined, type: type || undefined }, include: { combats: true } });
  const decorated = bleys.map(parseTags).map(b => ({ ...b, totalCombats: b.combats.length, wins: b.combats.filter(c => c.result === 'WIN').length, winRate: b.combats.length ? Math.round((b.combats.filter(c => c.result === 'WIN').length / b.combats.length) * 100) : 0 }));
  decorated.sort((a,b) => sort === 'used' ? b.totalCombats-a.totalCombats : sort === 'wins' ? b.wins-a.wins : sort === 'winRate' ? b.winRate-a.winRate : new Date(b.createdAt)-new Date(a.createdAt));
  res.json(decorated);
});
router.post('/', async (req, res) => res.status(201).json(parseTags(await prisma.bley.create({ data: { ...data(req.body), userId: req.user.id } }))));
router.get('/:id', async (req, res) => {
  const bley = await prisma.bley.findFirst({ where: { id: req.params.id, userId: req.user.id }, include: { combats: true } });
  if (!bley) return res.status(404).json({ message: 'Bley no encontrado' });
  res.json(parseTags(bley));
});
router.put('/:id', async (req, res) => {
  const exists = await prisma.bley.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!exists) return res.status(404).json({ message: 'Bley no encontrado' });
  res.json(parseTags(await prisma.bley.update({ where: { id: req.params.id }, data: data(req.body) })));
});
router.delete('/:id', async (req, res) => {
  const exists = await prisma.bley.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!exists) return res.status(404).json({ message: 'Bley no encontrado' });
  await prisma.bley.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
export default router;
