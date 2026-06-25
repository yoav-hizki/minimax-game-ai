import { test, expect, type Page } from '@playwright/test';

async function clickCell(page: Page, index: number) {
  await page.locator('.square').nth(index).click();
}

async function expectOMarksOnBoard(page: Page, minCount: number) {
  await expect(async () => {
    let oCount = 0;
    for (let i = 0; i < 9; i++) {
      const count = await page.locator('.square').nth(i).locator('.o').count();
      oCount += count;
    }
    expect(oCount).toBeGreaterThanOrEqual(minCount);
  }).toPass({ timeout: 5000 });
}

test.describe('Basic rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads and shows TIC-TAC-TOE heading', async ({ page }) => {
    await expect(page.getByText('TIC-TAC-TOE')).toBeVisible();
  });

  test('board has 9 squares plus 2 turn indicator squares', async ({ page }) => {
    // 9 board squares + 2 turn indicator squares = 11 total
    await expect(page.locator('.square')).toHaveCount(11);
  });

  test('Reset Game button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Reset Game' })).toBeVisible();
  });

  test('Enable AI button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Enable AI' })).toBeVisible();
  });
});

test.describe('Human vs Human game flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking squares places X then O marks alternately', async ({ page }) => {
    // Click first square — X should appear
    await clickCell(page, 0);
    // The board square at index 0 should now contain an X span
    await expect(page.locator('.square').nth(0).locator('.x')).toBeVisible();

    // Click second square — O should appear
    await clickCell(page, 1);
    await expect(page.locator('.square').nth(1).locator('.o')).toBeVisible();
  });

  test('X wins with top row and winner overlay appears', async ({ page }) => {
    // Play sequence: X(0), O(3), X(1), O(4), X(2) → X wins top row
    await clickCell(page, 0); // X at position 0
    await clickCell(page, 3); // O at position 3
    await clickCell(page, 1); // X at position 1
    await clickCell(page, 4); // O at position 4
    await clickCell(page, 2); // X at position 2 → X wins

    // Winner overlay should appear with animation (up to 1.5s delay)
    await expect(page.getByText('Winner!! :)')).toBeVisible({ timeout: 5000 });
  });

  test('Play Again button appears in winner overlay', async ({ page }) => {
    // Quick X win: top row
    await clickCell(page, 0);
    await clickCell(page, 3);
    await clickCell(page, 1);
    await clickCell(page, 4);
    await clickCell(page, 2);

    // Wait for the Play Again button (animated, delayed up to 1.5s)
    await expect(
      page.getByRole('button', { name: 'Play Again' })
    ).toBeVisible({ timeout: 5000 });
  });

  test('clicking Play Again resets the board', async ({ page }) => {
    // Win the game first
    await clickCell(page, 0);
    await clickCell(page, 3);
    await clickCell(page, 1);
    await clickCell(page, 4);
    await clickCell(page, 2);

    // Wait for Play Again button and click it
    const playAgainBtn = page.getByRole('button', { name: 'Play Again' });
    await expect(playAgainBtn).toBeVisible({ timeout: 5000 });
    await playAgainBtn.click();

    // Board should be cleared — no X or O marks in board squares
    // After reset, the turn indicator still has its X and O squares,
    // but board squares (first 9) should have no marks inside them
    // Wait for overlay to disappear
    await expect(page.getByText('Winner!! :)')).not.toBeVisible({ timeout: 5000 });

    // Verify board squares are empty (no .x or .o spans inside first 9 squares)
    for (let i = 0; i < 9; i++) {
      await expect(page.locator('.square').nth(i).locator('.x')).toHaveCount(0);
      await expect(page.locator('.square').nth(i).locator('.o')).toHaveCount(0);
    }
  });
});

test.describe('Draw game', () => {
  test('playing to a draw shows Tie overlay', async ({ page }) => {
    await page.goto('/');

    // Draw sequence: X(0), O(1), X(2), O(4), X(3), O(5), X(7), O(6), X(8)
    // Board state:
    // X O X
    // X O O
    // O X X
    await clickCell(page, 0); // X
    await clickCell(page, 1); // O
    await clickCell(page, 2); // X
    await clickCell(page, 4); // O
    await clickCell(page, 3); // X
    await clickCell(page, 5); // O
    await clickCell(page, 7); // X
    await clickCell(page, 6); // O
    await clickCell(page, 8); // X — draw

    // Tie overlay should appear
    await expect(page.getByText('Tie :/')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Reset button', () => {
  test('clicking Reset Game clears the board', async ({ page }) => {
    await page.goto('/');

    // Make a few moves
    await clickCell(page, 0); // X
    await expect(page.locator('.square').nth(0).locator('.x')).toBeVisible();
    await clickCell(page, 4); // O
    await expect(page.locator('.square').nth(4).locator('.o')).toBeVisible();

    // Click Reset Game
    await page.getByRole('button', { name: 'Reset Game' }).click();

    // Board squares should be cleared
    for (let i = 0; i < 9; i++) {
      await expect(page.locator('.square').nth(i).locator('.x')).toHaveCount(0);
      await expect(page.locator('.square').nth(i).locator('.o')).toHaveCount(0);
    }
  });
});

test.describe('AI mode toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking Enable AI changes title to include AI Mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Enable AI' }).click();

    // Title should now include "AI Mode"
    await expect(page.getByText('AI Mode')).toBeVisible();
  });

  test('difficulty toggle appears and defaults to Easy', async ({ page }) => {
    await page.getByRole('button', { name: 'Enable AI' }).click();

    // Difficulty button should show "Easy"
    await expect(page.getByRole('button', { name: 'Easy' })).toBeVisible();
  });

  test('clicking difficulty cycles through Easy, Medium, Hard', async ({ page }) => {
    await page.getByRole('button', { name: 'Enable AI' }).click();

    // Initially Easy
    const difficultyBtn = page.getByRole('button', { name: 'Easy' });
    await expect(difficultyBtn).toBeVisible();

    // Click to cycle to Medium
    await difficultyBtn.click();
    await expect(page.getByRole('button', { name: 'Medium' })).toBeVisible();

    // Click to cycle to Hard
    await page.getByRole('button', { name: 'Medium' }).click();
    await expect(page.getByRole('button', { name: 'Hard' })).toBeVisible();
  });

  test('clicking Disable AI returns to normal mode', async ({ page }) => {
    // Enable AI
    await page.getByRole('button', { name: 'Enable AI' }).click();
    await expect(page.getByRole('button', { name: 'Disable AI' })).toBeVisible();

    // Disable AI
    await page.getByRole('button', { name: 'Disable AI' }).click();

    // Should be back to normal — Enable AI button visible, no AI Mode text
    await expect(page.getByRole('button', { name: 'Enable AI' })).toBeVisible();
    // The heading should just say TIC-TAC-TOE without AI Mode
    const heading = page.locator('h1');
    await expect(heading).toHaveText('TIC-TAC-TOE');
  });
});

test.describe('AI gameplay', () => {
  test('AI responds with O after human plays X', async ({ page }) => {
    await page.goto('/');

    // Enable AI mode
    await page.getByRole('button', { name: 'Enable AI' }).click();

    // Click a square as X (human move)
    await clickCell(page, 0);

    // X should appear in the clicked square
    await expect(page.locator('.square').nth(0).locator('.x')).toBeVisible();

    // Wait for AI to make its O move — an O mark should appear somewhere on the board
    // The AI uses useEffect, so it fires on the next render cycle
    // Check that one of the board squares (indices 0-8) now has an O
    // We look for any .o inside the first 9 squares
    // Use a polling approach: wait for any board square to have .o
    await expectOMarksOnBoard(page, 1);
  });

  test('AI makes a move within reasonable time', async ({ page }) => {
    await page.goto('/');

    // Enable AI mode
    await page.getByRole('button', { name: 'Enable AI' }).click();

    // Play center square
    await clickCell(page, 4);

    // AI should respond — at least one O should appear on the board
    await expectOMarksOnBoard(page, 1);

    // Make another human move on an empty square
    // Find the first empty board square (not 4 which we clicked, not the AI's move)
    for (let i = 0; i < 9; i++) {
      if (i === 4) continue;
      const xCount = await page.locator('.square').nth(i).locator('.x').count();
      const oCount = await page.locator('.square').nth(i).locator('.o').count();
      if (xCount === 0 && oCount === 0) {
        await clickCell(page, i);
        break;
      }
    }

    // AI should respond again — now 2 O marks on the board
    await expectOMarksOnBoard(page, 2);
  });
});
