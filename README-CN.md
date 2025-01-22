# Auto PDF
<p align="left">
  <a href="README.md">English</a> /
  <a href="README-CN.md">中文</a>
</p>

![preview](https://github.com/user-attachments/assets/c9293a43-f1f2-4240-be44-811a79485c67)

## 为什么要做
受到各类聊天生成代码/UI的启发，这个项目可以通过聊天来生成 PDF 文档

## 在线访问
[**Auto PDF**](https://autopdf.app)

## TODO

如果你对项目有任何功能与建议，欢迎随时提出 Issue 或 PR！👏
- [x] 支持 PDF 下载
- [x] 支持 PDF 多版本查看
- [ ] 国际化
- [ ] 支持不同 model 的切换
- [ ] 优化 prompt， 添加更多模板
- [ ] 支持手动调整 PDF 的信息，例如标题/字体/颜色等
- [ ] 支持 PDF 中的图片插入
- [ ] 支持 PDF 转 Word 功能


## 如何自己部署

在根目录运行：

```bash
bun install
```
### 前端

```bash
cd packages/client
cp .env.example .env
```

配置相关环境变量

```bash
VITE_API_URL=http://localhost:3000
```

### 后端

```bash
cd packages/server
cp .env.example .env
```

配置相关环境变量

```bash
DB_FILE_NAME=
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=
```

For OAuth setup, please refer to [Better-Auth documentation](https://www.better-auth.com)


### 数据库

```bash
cd packages/server
bun run db:push
```

#### 开发
根目录运行
```bash
bun run dev
```

#### 构建
根目录运行
```bash
bun run build
```

### 生产
根目录运行
```bash
bun run start
```
