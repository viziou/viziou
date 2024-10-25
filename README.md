# viziou

This repository details the source code and development progress of a 12-week capstone project required for the
completion of [FIT3162](https://handbook.monash.edu/2024/units/FIT3162) at Monash University.

#### Development Team

The team consists of 4 software developers, their roles and responsibilities as follows:

- Mubasshir "[mubasshirMurshed](https://github.com/mubasshirMurshed)" Murshed
  - Project Resource Manager
  - Jira Manager
  - Backend Lead Developer
- Satya "[rates37](https://github.com/rates37)" Jhaveri
  - Frontend Developer
  - Lead Scribe
- Daniel "[Speyedr](https://github.com/Speyedr)" Summer
  - GitHub Repository Manager
  - CI/CD Manager
  - Middleware Lead Developer
- Ka Chun "[kachunl](https://github.com/kachunl)" Lee
  - Frontend Lead Developer
  - Assisting Scribe

### Monash University Academic Integrity Notice

As per [Monash University Policy](https://www.monash.edu/student-academic-success/maintain-academic-integrity/dos-and-donts-academic-integrity), all work contained within this repository (Issues, Pull Requests, Commits, Code, etc.)
is prohibited from use in other assessments. If you use any of this project's work in your own assessments, you must not
plagiarise, and you must reference this project appropriately.

## Usage / Installation
Viziou (pronounced [/vˈɪzjˈuː/](https://github.com/viziou/viziou/blob/main/public/viziou.wav)) was developed using
TypeScript + React,
with a deployment intended for use in any modern web browser (i.e. Microsoft Edge, Mozilla Firefox, or Google Chrome).
To access the latest official version of viziou, users can simply visit our website, [viziou.com](https://viziou.com).

### Local Installation

#### Requirements:
- Git
- Node.js (v20+ recommended)

To access viziou offline, run the following console commands:

```text
git clone https://github.com/viziou/viziou viziou
cd viziou
npm i
npm run build
npm run preview
```

This will download, install, build, and then locally host the project. Check the console output for the URL to visit in
your web browser.

### Host during development

Developers can locally host a version of the app supporting Hot Module Reloading (via [VITE](https://vite.dev/)) using:

```text
npm run dev
```

This instance of the app is hosted directly from the source code (instead of a previously built version) and updates
automatically on source code changes. Source maps are also provided to allow easier code inspection when using
web developer debugging tools.

### Testing

Tests are integrated using [Mocha.js](https://mochajs.org/), and can be executed using:

```text
npm run test
```

## Contributing / Licensing

Contributions for this project are closed. Extensions of this project are permitted through the project's license
([AGPL v3.0](https://www.tldrlegal.com/license/gnu-affero-general-public-license-v3-agpl-3-0)).
