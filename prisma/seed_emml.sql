INSERT INTO "EmotionBaselineWeight" ("id","emotion","weight","createdAt","updatedAt") VALUES
  ('seed_joy','joy',1.00,datetime('now'),datetime('now')),
  ('seed_calm','calm',1.00,datetime('now'),datetime('now')),
  ('seed_focus','focus',1.10,datetime('now'),datetime('now')),
  ('seed_love','love',1.05,datetime('now'),datetime('now')),
  ('seed_energy','energy',1.10,datetime('now'),datetime('now')),
  ('seed_awe','awe',0.95,datetime('now'),datetime('now')),
  ('seed_pride','pride',0.90,datetime('now'),datetime('now')),
  ('seed_gratitude','gratitude',1.08,datetime('now'),datetime('now'))
ON CONFLICT("emotion") DO UPDATE SET "weight"=EXCLUDED."weight","updatedAt"=datetime('now');
