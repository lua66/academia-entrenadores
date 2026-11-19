export default function handler(req, res) {
  const rawNumber = process.env.WHATSAPP_NUMBER || '34608180231';
  const cleanNumber = String(rawNumber).replace(/\D/g, '');

  const url = new URL(req.url || '/api/ir-whatsapp', 'http://localhost');
  const rawMsg = url.searchParams.get('msg') || '';
  const defaultMsg =
    'Hola, me interesa el curso "Del Fundamento al Juego · Nivel C" de Altura BC en CDMX.';
  const finalMsg = rawMsg.trim() || defaultMsg;

  const targetUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalMsg)}`;
  res.writeHead(302, {
    Location: targetUrl,
    'Cache-Control': 'no-store',
  });
  res.end();
}
