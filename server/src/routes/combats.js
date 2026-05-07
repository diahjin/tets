import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../db.js';
const router = express.Router();
router.use(requireAuth);
router.post('/', async (req, res) => {
  const bley = await prisma.bley.findFirst({ where: { id: req.body.bleyId, userId: req.user.id } });
  if (!bley) return res.status(404).json({ message: 'Bley no encontrado' });
  const combat = await prisma.combat.create({ data: { ...req.body, date: req.body.date ? new Date(req.body.date) : new Date(), userId: req.user.id } });
  res.status(201).json(combat);
});
router.get('/', async (req, res) => res.json(await prisma.combat.findMany({ where: { userId: req.user.id }, include: { bley: true }, orderBy: { date: 'desc' } })));
router.delete('/:id', async (req, res) => {
  const combat = await prisma.combat.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!combat) return res.status(404).json({ message: 'Combate no encontrado' });
  await prisma.combat.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
export default router;
