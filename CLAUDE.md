# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A static site published via **GitHub Pages** at **https://tools.esub.com**. It hosts standalone HTML tools/pages, each in its own top-level directory. Repo: `eSUB-Inc/tools` (public), served from the `main` branch.

There is no build step, framework, or bundler — files are served as-is. What you commit is what ships.

**Before adding anything, read `.instructions.md`** (repo root): this repo is public, and it may hold **only** presentational public HTML pages — no source code and no internal/confidential content.

## URL structure

Each tool lives in its own directory at the repo root; the directory name becomes the URL path:

```
<tool-name>/index.html   ->   https://tools.esub.com/<tool-name>/
<tool-name>/index.html   ->   https://tools.esub.com/<tool-name>/index.html
```

- Use `index.html` so the directory resolves without a filename in the URL.
- Directory names are the public URL slug — keep them lowercase, hyphenated, and stable (renaming breaks any shared links).
- Keep each tool self-contained within its directory (its own HTML/CSS/JS/assets) so tools stay independent and can be added or removed without affecting others.

## Deployment

- Publishing is automatic: pushing to `main` triggers GitHub Pages to rebuild and serve. There is no CI/test/lint pipeline.
- The custom domain `tools.esub.com` is set in the repo's GitHub Pages settings. When configured through the GitHub UI, Pages writes a `CNAME` file (containing `tools.esub.com`) to the repo root — if that file is present, don't delete or edit it, or the custom domain detaches. (As of this writing no `CNAME` file is committed yet.)
- Because the site is public, treat everything committed as world-readable. Never commit secrets, internal-only data, or credentials.

## Working here

- Prefer self-contained pages (inline or directory-local CSS/JS) so each tool has no cross-directory or external build dependencies.
- Use root-relative (`/<tool-name>/...`) or directory-relative asset paths; the site is served from the domain root, so paths that assume a subpath prefix will break.
