import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../db.js';
const router = express.Router();
router.use(requireAuth);
const pct = (n,d) => d ? Number(((n/d)*100).toFixed(1)) : 0;
router.get('/', async (req, res) => {
  const bleys = await prisma.bley.findMany({ where: { userId: req.user.id }, include: { combats: true } });
  const all = bleys.flatMap(b => b.combats.map(c => ({ ...c, bleyName: b.name })));
  const total = all.length, wins = all.filter(c=>c.result==='WIN').length, draws = all.filter(c=>c.result==='DRAW').length, losses = all.filter(c=>c.result==='LOSS').length;
  const ranking = bleys.map(b => {
    const t = b.combats.length, w = b.combats.filter(c=>c.result==='WIN').length, d = b.combats.filter(c=>c.result==='DRAW').length, l = b.combats.filter(c=>c.result==='LOSS').length;
    return { id: b.id, name: b.name, type: b.type, total: t, wins: w, draws: d, losses: l, winRate: pct(w,t), drawRate: pct(d,t), lossRate: pct(l,t), score: w*3+d };
  }).sort((a,b)=> b.score-a.score || b.winRate-a.winRate || b.total-a.total);
  res.json({ totals: { total, wins, draws, losses, winRate: pct(wins,total), drawRate: pct(draws,total), lossRate: pct(losses,total) }, mostUsed: ranking.slice().sort((a,b)=>b.total-a.total)[0] || null, bestWinRate: ranking.filter(r=>r.total>0).sort((a,b)=>b.winRate-a.winRate)[0] || null, ranking, latestCombats: all.sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,8) });
});
export default router;
