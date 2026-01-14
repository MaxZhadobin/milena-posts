/**
 * Валидирует initData от Telegram используя Web Crypto API (совместимо с Edge Runtime)
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export async function validateTelegramWebAppData(initData: string, botToken: string): Promise<boolean> {
  if (!initData || !botToken) return false;

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  const dataCheckString = Array.from(urlParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const encoder = new TextEncoder();

  // 1. Создаем secret_key = HMAC_SHA256("WebAppData", botToken)
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const secretKeyBuffer = await crypto.subtle.sign(
    'HMAC',
    baseKey,
    encoder.encode(botToken)
  );

  // 2. Создаем hash = HMAC_SHA256(secret_key, data_check_string)
  const hmacKey = await crypto.subtle.importKey(
    'raw',
    secretKeyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    hmacKey,
    encoder.encode(dataCheckString)
  );

  const calculatedHash = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return calculatedHash === hash;
}
