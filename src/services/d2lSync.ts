/**
 * Loads local disk data from /api/local-data
 */
export async function loadLocalData(): Promise<{ db?: any; config?: any }> {
  try {
    const res = await fetch('/api/local-data');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return {};
}

/**
 * Saves database to /api/save-db
 */
export async function saveLocalDB(dbData: any): Promise<boolean> {
  try {
    const res = await fetch('/api/save-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbData),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}
