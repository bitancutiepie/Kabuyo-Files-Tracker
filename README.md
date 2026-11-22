# KaBuyo Files Tracker

A modern, glassmorphic project portal and document hub for the **KaBuyo** Final Project across **System Integration and Architecture (IT312 / SIA)** and **Web Systems and Technologies (WST)** at Batangas State University - The National Engineering University (Alangilan Campus).

Provides a centralized workspace for project groups to access live web applications, product requirement documents, QA testing sheets, guidelines, and PDF templates with a built-in previewer.

---

## Features

- **Built-in PDF Viewer**: Preview project guidelines and academic templates inline without external readers or downloads.
- **Glassmorphic Interface**: Dark and light modes with ambient animated orbs, responsive glass cards, and micro-interactions.
- **Dynamic Categorization & Filtering**: Filter resources by course track (`SIA`, `WST`, `General`) and asset type (`PDFs`, `Docs`, `Sheets`, `Slides`, `Links`).
- **Live Search**: Instant keyword filtering across file names, URLs, and course tags.
- **1-Click Link Copy**: Quick-share direct links with visual toast confirmation.
- **Resource Management**: Add custom entries directly through the UI, stored locally in the browser with JSON export/import backup support.
- **GitHub Pages Ready**: Zero-configuration static deployment with standalone client assets.

---

## Directory Structure

```text
├── docs/
│   ├── IT312_SIA_Project_Documentation_Template.pdf  # Project study manuscript structure & formatting guidelines
│   └── SIA_Final_Project_Guidelines.pdf              # BatStateU CICS project overview & grading criteria
├── index.html                                        # Single-page animated application & viewer
└── README.md                                         # Project documentation
```

---

## Pre-Configured Project Resources

| Resource | Course / Scope | Type | Destination |
| :--- | :---: | :---: | :--- |
| **KaBuyo Web Application** | `General` | Live Web App | [kabuyo.onrender.com](https://kabuyo.onrender.com/index.html) |
| **KaBuyo PRD & Course Context** | `SIA` | Google Doc | [Google Docs Document](https://docs.google.com/document/d/1UNaU8BjhKk9IyfQGoLWE3mnrTIqw3FkG1VRyV7fHmiU/edit?tab=t.szsan2jjiips#heading=h.syv5jt9q85t) |
| **KaBuyo QA - Tester To-Do Tracker** | `WST` | Google Sheet | [Google Sheets Spreadsheet](https://docs.google.com/spreadsheets/d/1Z_BExJWuvXf3tdD2QiSI1pexEN1AkJJtVIy_FQvdg6Y/edit?usp=sharing) |
| **SIA Final Project Guidelines** | `SIA` | PDF Document | `./docs/SIA_Final_Project_Guidelines.pdf` |
| **IT312 Project Study & Documentation Template** | `SIA` | PDF Document | `./docs/IT312_SIA_Project_Documentation_Template.pdf` |

---

## Quick Start (Local Run)

Because the project is built with static web standards, no compilation or npm dependencies are required.

### Using Python

```bash
# From the project root
python -m http.server 5173
```

Navigate to `http://localhost:5173` in any modern web browser.

### Using Node.js (Alternative)

```bash
npx serve .
```

---

## Deployment to GitHub Pages

1. Push this repository to GitHub.
2. In your repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Set the branch to `main` and folder to `/(root)`.
5. Click **Save**. The portal will be published at `https://<username>.github.io/<repository-name>/`.

> [!NOTE]
> When adding new PDF files to `./docs/`, ensure file names match the relative links in `index.html` or update the link through the web portal.

> [!TIP]
> If linking Google Drive documents or PDFs, the built-in previewer automatically converts standard `/view` URLs into `/preview` embeds.
