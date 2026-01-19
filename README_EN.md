# XServer Game Auto Extension

This repository contains scripts to automate the extension of XServer Game VPS instances.

## Usage

### Method 1: Local Execution

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/XCQ0607/Xserver_script.git
    cd Xserver_script
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    npx playwright install chrome
    ```

3.  **Configure Users**:
    *   Copy `users.json.template` to `users.json`.
    *   Edit `users.json` and add your account credentials.
    ```json
    [
        {
            "username": "your_email@example.com",
            "password": "your_password"
        }
    ]
    ```

4.  **Run the script**:
    ```bash
    node win.js
    ```
    *   The script runs in headless mode by default.
    *   Screenshots will be saved in the current directory for success (`success_*.png`), failure (`error_*.png`), or skipped (`skip_*.png`) attempts.

### Method 2: GitHub Actions (Fork)

1.  **Fork this repository** to your own GitHub account (`github.com/XCQ0607/Xserver_script`).

2.  **Configure Secrets**:
    *   Go to your forked repository's **Settings** > **Secrets and variables** > **Actions**.
    *   Click **New repository secret**.
    *   **Name**: `USERS_JSON`
    *   **Value**: Paste the content of your `users.json` file (minified JSON is preferred but not required).
        *   Example format:
            ```json
            [{"username":"user1@example.com","password":"pass1"},{"username":"user2@example.com","password":"pass2"}]
            ```

3.  **Run Workflow**:
    *   The workflow is scheduled to run automatically every 24 hours (00:00 UTC).
    *   You can also manually trigger it from the **Actions** tab > **XServer Extend Schedule** > **Run workflow**.

4.  **Check Results**:
    *   Go to the **Actions** tab and click on the latest run.
    *   Check the **Artifacts** section to download screenshots of the process.

## Notes

*   If the "Extend Period" button is not found (e.g., extension not yet available), the script will skip that user and save a screenshot named `skip_<username>.png`.
*   Ensure your `USERS_JSON` secret is valid JSON.
