const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    // Read users.json
    const usersPath = path.join(__dirname, 'users.json');
    let users = [];
    try {
        if (fs.existsSync(usersPath)) {
            const data = fs.readFileSync(usersPath, 'utf8');
            users = JSON.parse(data);
            if (!Array.isArray(users)) {
                console.error('users.json must be an array of objects.');
                process.exit(1);
            }
        } else {
            console.log('users.json not found. Please create it from users.json.template.');
            process.exit(1);
        }
    } catch (err) {
        console.error('Error reading users.json:', err);
        process.exit(1);
    }

    const browser = await chromium.launch({
        headless: true, // 1. Use headless browser
        channel: 'chrome',
    });

    for (const user of users) {
        console.log(`Processing user: ${user.username}`);
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            // 1. Navigate to Login Page
            await page.goto('https://secure.xserver.ne.jp/xapanel/login/xmgame');

            // 2. Login
            await page.getByRole('textbox', { name: 'XServerアカウントID または メールアドレス' }).click();
            await page.getByRole('textbox', { name: 'XServerアカウントID または メールアドレス' }).fill(user.username);
            await page.locator('#user_password').fill(user.password);
            await page.getByRole('button', { name: 'ログインする' }).click();

            // Wait for navigation or specific element to ensure login success
            await page.getByRole('link', { name: 'ゲーム管理' }).click();
            await page.waitForLoadState('networkidle');

            // 3. Upgrade / Extension
            await page.getByRole('link', { name: 'アップグレード・期限延長' }).click();

            // 4. Select 'Extend Period' - Check if available
            try {
                // Wait for the button with a short timeout (e.g., 5 seconds)
                await page.getByRole('link', { name: '期限を延長する' }).waitFor({ state: 'visible', timeout: 5000 });
                await page.getByRole('link', { name: '期限を延長する' }).click();
            } catch (e) {
                console.log(`'Extend Period' button not found for ${user.username}. Possibly unable to extend.`);
                await page.screenshot({ path: `skip_${user.username}.png` });
                continue; // Skip to next user
            }

            // 5. Confirm
            await page.getByRole('button', { name: '確認画面に進む' }).click();

            // 6. Execute Extension
            console.log(`Clicking final extension button for ${user.username}...`);
            await page.getByRole('button', { name: '期限を延長する' }).click();

            // 7. Return
            await page.getByRole('link', { name: '戻る' }).click();

            console.log(`Successfully extended for ${user.username}`);
            await page.screenshot({ path: `success_${user.username}.png` });

        } catch (error) {
            console.error(`Failed for user ${user.username}:`, error);
            // Take a screenshot on failure
            await page.screenshot({ path: `error_${user.username}.png` });
        } finally {
            await context.close();
        }
    }

    await browser.close();
})();
