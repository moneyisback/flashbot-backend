import axios from 'axios';

export async function pingWatchdog() {
  const url = process.env.BACKEND_HEALTH_URL;

  if (!url) return;

  try {
    await axios.get(url);
    console.log('🟢 Backend API ping réussi');
  } catch (err) {
    console.warn('🔴 Erreur watchdog API:', err instanceof Error ? err.message : err);
  }
}
