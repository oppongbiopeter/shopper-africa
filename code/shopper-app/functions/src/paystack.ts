import * as crypto from 'crypto';

const PAYSTACK_BASE = 'https://api.paystack.co';

function secret(): string {
  return process.env.PAYSTACK_SECRET_KEY || '';
}

export async function initializeTransaction(opts: {
  email: string;
  amountPesewas: number;
  reference: string;
  callbackUrl: string;
  channels?: string[];
  metadata?: Record<string, string>;
}) {
  const sk = secret();
  if (!sk) throw new Error('PAYSTACK_SECRET_KEY not set');
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${sk}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: opts.email, amount: opts.amountPesewas, currency: 'GHS',
      reference: opts.reference, callback_url: opts.callbackUrl,
      channels: opts.channels || ['card', 'mobile_money'], metadata: opts.metadata,
    }),
  });
  return res.json();
}

export async function verifyTransaction(reference: string) {
  const sk = secret();
  if (!sk) throw new Error('PAYSTACK_SECRET_KEY not set');
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${sk}` },
  });
  return res.json();
}

export function validateWebhookSignature(rawBody: string, signature: string | undefined): boolean {
  const sk = secret();
  if (!sk || !signature) return false;
  const hash = crypto.createHmac('sha512', sk).update(rawBody).digest('hex');
  return hash === signature;
}
