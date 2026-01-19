# XServer 游戏服自动延期脚本

[English Version](README_EN.md)

本仓库包含用于自动化延长 XServer Game VPS 实例期限的脚本。

## 使用方法

### 方法 1：本地运行

1.  **克隆仓库**：
    ```bash
    git clone https://github.com/XCQ0607/Xserver_script.git
    cd Xserver_script
    ```

2.  **安装依赖**：
    ```bash
    npm install
    npx playwright install chrome
    ```

3.  **配置用户**：
    *   将 `users.json.template` 复制为 `users.json`。
    *   编辑 `users.json` 并添加您的账户凭据。
    ```json
    [
        {
            "username": "your_email@example.com",
            "password": "your_password"
        }
    ]
    ```

4.  **运行脚本**：
    ```bash
    node win.js
    ```
    *   脚本默认在无头模式（后台）下运行。
    *   截图将保存在当前目录下，分别命名为成功 (`success_*.png`)、失败 (`error_*.png`) 或跳过 (`skip_*.png`)。

### 方法 2：GitHub Actions (Fork)

1.  **Fork 本仓库** 到您自己的 GitHub 账户 (`github.com/XCQ0607/Xserver_script`)。

2.  **配置 Secrets**：
    *   进入您 Fork 的仓库的 **Settings** > **Secrets and variables** > **Actions**。
    *   点击 **New repository secret**。
    *   **Name**: `USERS_JSON`
    *   **Value**: 粘贴您的 `users.json` 文件内容（建议使用压缩后的 JSON，但非必须）。
        *   示例格式：
            ```json
            [{"username":"user1@example.com","password":"pass1"},{"username":"user2@example.com","password":"pass2"}]
            ```

3.  **运行 Workflow**：
    *   Workflow 计划于每 24 小时（UTC 时间 00:00）自动运行一次。
    *   您也可以在 **Actions** 标签页 > **XServer Extend Schedule** > **Run workflow** 中手动触发。

4.  **查看结果**：
    *   进入 **Actions** 标签页并点击最新的运行记录。
    *   查看 **Artifacts** 部分以下载运行过程的截图。

## 注意事项

*   如果未找到“期限を延長する”（延长期限）按钮（例如尚未到延期时间），脚本将跳过该用户并保存名为 `skip_<username>.png` 的截图。
*   请确保您的 `USERS_JSON` secret 是有效的 JSON 格式。
