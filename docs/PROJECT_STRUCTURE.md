# Driver Confidence Guide Website
# Project Structure

This document describes the organization of the Driver Confidence Guide website project and explains the purpose of each major folder and file.

---

# Project Overview

The project is organized around a simple principle:

**Source content is kept separate from generated website content.**

```
Mission Content
        │
        ▼
Website Generator
        │
        ▼
Generated Website
```

This separation makes the project easier to maintain, rebuild, and publish.

---

# Root Directory

```
Driver Confidence Guide PDF Version/
│
├── 01_Missions/
├── 02_Web_Output/
├── dcg_publisher/
├── publish_dcg.py
├── buildWebPages.ps1
├── .gitignore
└── documentation (*.md)
```

---

# 01_Missions

Contains the source material for every mission.

Each mission has its own folder containing the PDF, images, comic panels, and supporting files used to generate the website.

Example:

```
01_Missions/

Mission 00/
Mission 01/
Mission 02/
...
Mission XX/
```

Typical contents:

```
Mission XX/
    mission.pdf
    images/
    storyboard/
    notes/
```

These files are the **authoritative source** for the project.

---

# 02_Web_Output

Contains the generated website.

Nothing in this folder is edited manually.

Typical contents include:

```
index.html
missions/
images/
css/
js/
assets/
```

This folder is recreated whenever the website is built.

It also contains the project documentation stored in the **docs** folder.

---

# docs

Project documentation for developers and future maintenance.

Current documents include:

| Document | Purpose |
|-----------|---------|
| CHANGELOG.md | History of significant project changes |
| DCG_OVERVIEW.md | High-level overview of the project |
| DCG_ARCHITECTURE.md | Overall architecture and design |
| WEBSITE_BUILD.md | How the website is generated |
| DEPLOYMENT.md | Publishing and deployment instructions |
| PROJECT_STRUCTURE.md | Description of the project organization |
| PROJECT_PHILOSOPHY.md | Guiding principles behind the Driver Confidence Guide |

---

# dcg_publisher

Python modules responsible for generating the website.

Responsibilities include:

- Reading mission folders
- Converting mission content
- Copying images
- Creating HTML pages
- Building navigation
- Generating indexes
- Preparing output for publishing

---

# publish_dcg.py

Main Python entry point.

This program performs the complete website generation process.

Typical workflow:

1. Read mission folders.
2. Convert mission content.
3. Generate HTML.
4. Copy images.
5. Write the completed website into `02_Web_Output`.

---

# buildWebPages.ps1

Windows PowerShell script that launches the website build process.

This provides a convenient one-step build from Windows.

---

# Version Control

The project uses Git for version control.

Git provides:

- Backup
- History
- Recovery
- Safe experimentation
- Synchronization across computers

---

# Typical Development Workflow

```
1. Synchronize with GitHub

git pull

        │
        ▼

2. Edit mission content

01_Missions

        │
        ▼

3. Build the website

publish_dcg.py
or
buildWebPages.ps1

        │
        ▼

4. Review the generated website

02_Web_Output

        │
        ▼

5. Verify changes

git status

        │
        ▼

6. Save changes

git add .
git commit -m "Describe the changes"

        │
        ▼

7. Upload to GitHub

git push

        │
        ▼

8. Deploy the updated website
```

---

# Design Philosophy

The project intentionally separates:

- Author content
- Website generation
- Published website

This allows the website to be regenerated at any time from the original mission files without manually editing HTML.

Keeping these responsibilities separate makes the project easier to maintain, easier to understand, and easier to extend as the Driver Confidence Guide continues to grow.