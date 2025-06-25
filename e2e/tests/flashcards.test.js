import flashcards from '../../data/flashcards.json';

// Helper function to check if an element is visible
const isElementVisible = async (selector) => {
  return await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return !element.classList.contains('hidden') && style.display !== 'none' && element.offsetHeight > 0;
  }, selector);
};

describe('Add New Word Check', () => {
  beforeEach(async () => {
    await page.goto(global.TARGET_PAGE_URL);
    await page.click('.tab-item[data-tab="flashcards"]');
  });
  
  test('Modal for adding new word exists', async () => {
    const exists = await page.$('#word-modal') !== null;
    expect(exists).toBe(true, 'Expected the modal for adding a new word to exist');
  });

  test('Clicking Add New Word button shows modal', async () => {
    await page.waitForSelector('button.add-word', { visible: true });

    await page.evaluate(() => {
      const flashcardsSection = document.getElementById('flashcards');
      if (flashcardsSection && flashcardsSection.classList.contains('hidden')) {
        flashcardsSection.classList.remove('hidden');
      }
    });

    await page.click('button.add-word');

    await page.waitForFunction(() => {
      const modal = document.getElementById('word-modal');
      if (!modal) return false;
      const computed = window.getComputedStyle(modal);
      return !modal.classList.contains('hidden') && computed.display !== 'none' && modal.offsetHeight > 0;
    }, { timeout: 500 });

    const modalVisible = await isElementVisible('#word-modal');
    expect(modalVisible).toBe(true, 'Expected the modal to be visible after clicking the Add New Word button');
  });
});
