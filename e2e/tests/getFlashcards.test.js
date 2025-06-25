
describe('GET /api/flashcards', () => {
  test('Card list and Status Check', async () => {
    const response = await fetch(`${global.TARGET_PAGE_URL}/api/flashcards`);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(typeof data).toBe('object');
    if (Array.isArray(data)) {
      expect(data.length).toBeGreaterThan(0);
    } else {
      expect(Object.keys(data).length).toBeGreaterThan(0);
    }
  });
});

