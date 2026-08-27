import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('Mega Step 30 transparency and audit accountability', () => {
  const schema = read('prisma/schema.prisma');
  const migration = read(
    'prisma/migrations/20260818_moderation_decision_audit_accountability/migration.sql',
  );
  const adminReview = read('app/api/admin/moderation/review/route.ts');
  const auditRoute = read('app/api/moderation/audit/route.ts');
  const reportRoute = read('app/api/moderation/report/route.ts');
  const decisionsRoute = read('app/api/moderation/decisions/route.ts');
  const appealRoute = read('app/api/moderation/appeal/route.ts');

  it('defines a dedicated durable moderation decision audit model', () => {
    expect(schema).toContain('model ModerationDecisionAudit');
    expect(schema).toContain('affectedOwnerId String?');
    expect(schema).toContain('actorUserId');
    expect(schema).toContain('reason');
    expect(schema).toContain('outcome');
    expect(schema).toContain('createdAt');
  });

  it('has one dedicated additive migration for the audit model', () => {
    expect(migration).toContain(
      'CREATE TABLE "ModerationDecisionAudit"',
    );
    expect(migration).not.toContain('DROP TABLE');
    expect(migration).not.toContain('DROP COLUMN');
    expect(migration).not.toContain('ALTER TABLE "AuditLog"');
  });

  it('requires authenticated admin authority and a decision reason', () => {
    expect(adminReview).toContain('requireAdminSession');
    expect(adminReview).toContain('reason?: unknown');
    expect(adminReview).toContain('!reason');
    expect(adminReview).toContain(
      "reason: 'non-empty consequential decision explanation'",
    );
  });

  it('atomically persists the moderation state change and accountability record', () => {
    expect(adminReview).toContain('prisma.$transaction');
    expect(adminReview).toContain('tx.streamVideo.update');
    expect(adminReview).toContain(
      'tx.moderationDecisionAudit.create',
    );
    expect(adminReview).toContain(
      'actorUserId: auth.identity.userId',
    );
    expect(adminReview).toContain(
      'affectedOwnerId: video.ownerId ?? null',
    );
  });

  it('does not trust caller supplied audit actor authority', () => {
    expect(auditRoute).toContain('requireAdminSession');
    expect(auditRoute).toContain(
      'actorUserId: auth.identity.userId',
    );
    expect(auditRoute).toContain(
      'Consequential authority always comes from the authenticated admin session',
    );
    expect(auditRoute).toContain(
      'prisma.moderationDecisionAudit.create',
    );
    expect(auditRoute).not.toContain('console.log("LUMORA_MOD_AUDIT"');
  });

  it('session-binds moderation report identity', () => {
    expect(reportRoute).toContain('requireUserSession');
    expect(reportRoute).toContain(
      'reporterId: auth.identity.userId',
    );
    expect(reportRoute).toContain('FORBIDDEN_REPORTER_SCOPE');
  });

  it('provides owner-scoped safe decision visibility', () => {
    expect(decisionsRoute).toContain('requireUserSession');
    expect(decisionsRoute).toContain(
      'affectedOwnerId: auth.identity.userId',
    );
    expect(decisionsRoute).toContain(
      'prisma.moderationDecisionAudit.findMany',
    );
    expect(decisionsRoute).not.toContain('actorEmail: true');
    expect(decisionsRoute).not.toContain('metadata: true');
  });

  it('preserves the Mega29 session-bound appeal and remedy path', () => {
    expect(appealRoute).toContain('requireUserSession');
    expect(appealRoute).toContain(
      'userId: auth.identity.userId',
    );
    expect(appealRoute).toContain('APPEAL_TARGET_FORBIDDEN');
  });
});
