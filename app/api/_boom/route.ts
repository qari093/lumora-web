import { withLog } from '@/lib/api/wrap';
import { logInfo } from '@/lib/log';

async function boom(_req: Request): Promise<never> {
  logInfo('boom.trigger', { hint: 'about to throw' });
  throw new Error('kaboom: test exception');
}

export const GET = withLog(boom, 'GET /api/_boom');
export const runtime = 'nodejs';
