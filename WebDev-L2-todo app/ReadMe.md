# Daymark

Daymark is a focused, responsive to-do list for managing daily tasks. It is built with plain HTML, CSS, and JavaScript, so it runs without a build step or package installation.

## Features

- Add new tasks to the Pending Tasks list.
- Mark tasks complete and move them to Completed Tasks.
- Edit task text inline.
- Delete tasks from either list.
- Display pending and completed task counts.
- Show when tasks were added and completed.
- Persist tasks across page refreshes with `localStorage`.
- Show friendly empty-state messages for both lists.
- Responsive layout for desktop and mobile screens.

## Project Structure

```text
.
├── index.html   # Page structure and accessible task controls
├── styles.css   # Responsive layout, typography, colors, and animations
├── script.js    # Task state, rendering, interactions, and localStorage
└── ReadMe.md    # Project documentation
```

## Run Locally

Because this is a static site, it can be opened directly in a browser. For a local development server, run one of the following commands from the project folder:

### Python

```bash
python -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173) in your browser.

### VS Code Live Server

Open `index.html` in VS Code and use the **Live Server** extension's **Open with Live Server** command.

## How It Works

Tasks are stored in an array in `script.js`. Each task includes:

- A unique ID
- Task text
- Completion status
- Creation timestamp
- Completion timestamp, when applicable

The array is serialized into `localStorage` under the key `daymark-tasks`. When the page loads, saved tasks are restored and rendered into the Pending Tasks or Completed Tasks list.

## Browser Support

Daymark uses modern browser APIs including `localStorage`, `crypto.randomUUID`, `Intl.DateTimeFormat`, and `Element.replaceChildren`. Use a current version of Chrome, Edge, Firefox, or Safari for the best experience.

## Design

The interface uses a calm paper-like background, mint and coral accents, a responsive two-column task layout, and the Manrope and DM Mono typefaces loaded from Google Fonts.

