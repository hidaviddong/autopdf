# Auto PDF
<p align="left">
  <a href="README.md">English</a> /
  <a href="README-CN.md">中文</a>
</p>

![preview](https://github.com/user-attachments/assets/c9293a43-f1f2-4240-be44-811a79485c67)

## Motivation
Inspired by various chat-based code/UI generation tools, this project enables PDF document generation through chat interactions.

## Online Access 
[**Auto PDF**](https://autopdf.app)

## TODO

If you have any feature suggestions or feedback for the project, feel free to create an Issue or PR! 👏

- [x] PDF download support
- [x] Multiple PDF version viewing
- [ ] i18n
- [ ] Add template library
- [ ] Custom template support
- [ ] Support model switching
- [ ] Optimize prompts, add more templates
- [ ] Support manual adjustment of PDF properties (title/font/color etc.)
- [ ] Support image insertion in PDFs
- [ ] Support PDF to Word conversion

## Deployment Guide

In the root directory, run：

```bash
bun install
```
### Frontend

```bash
cd packages/client
cp .env.example .env
```

Configure the environment variables:

```bash
VITE_API_URL=http://localhost:3000
```

### Backend

```bash
cd packages/server
cp .env.example .env
```

Configure the environment variables:

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


### Database

```bash
cd packages/server
bun run db:push
```


#### Development
In the root directory, run：
```bash
bun run dev
```

#### Build
In the root directory, run：
```bash
bun run build
```

### Production
In the root directory, run：
```bash
bun run start
```

