# Badminton GitHub Pages 站点（静态）
- 直接部署到 GitHub Pages，公开展示月度和个人累计。
- 所有数据来自 `data/summary.json`，无需后端。

## 部署
1) 新建公开仓库（如 `badminton-pages`）。
2) 上传本项目所有文件。
3) Settings → Pages → Source: Deploy from a branch；选择 `main` 分支、根目录。
4) 几分钟后访问 Pages 地址。

## 更新数据
- 从本地 MVP 导出每场 CSV，或者手动将数据合并到 `data/summary.json`。