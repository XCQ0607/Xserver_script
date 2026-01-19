const { chromium } = require('playwright');
const path = require('path');

(async () => {
    // Read users from environment variable
    let users = [];
    try {
        if (process.env.USERS_JSON) {
            users = JSON.parse(process.env.USERS_JSON);
            if (!Array.isArray(users)) {
                console.error('USERS_JSON must be an array of objects.');
                process.exit(1);
            }
        } else {
            console.log('USERS_JSON environment variable not found.');
            process.exit(1);
        }
    } catch (err) {
        console.error('Error parsing USERS_JSON:', err);
        process.exit(1);
    }

    const browser = await chromium.launch({
        headless: true,
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

            // Wait for navigation
            await page.getByRole('link', { name: 'ゲーム管理' }).click();
            await page.waitForLoadState('networkidle');

            // 3. Upgrade / Extension
            await page.getByRole('link', { name: 'アップグレード・期限延長' }).click();

            // 4. Select 'Extend Period' - Check if available
            try {
                await page.getByRole('link', { name: '期限を延長する' }).waitFor({ state: 'visible', timeout: 5000 });
                await page.getByRole('link', { name: '期限を延長する' }).click();
            } catch (e) {
                console.log(`'Extend Period' button not found for ${user.username}. Possibly unable to extend.`);
                // Save screenshot to current directory (which will be uploaded as artifact)
                await page.screenshot({ path: `skip_${user.username}.png` });
                continue;
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
            await page.screenshot({ path: `error_${user.username}.png` });
            // Don't exit process, try next user
        } finally {
            await context.close();
        }
    }

    await browser.close();
})();
