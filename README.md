# Romantic Date Invitation

Static landing page with a romantic "date invitation" flow.

## Project structure

- `index.html` — first page with name input
- `question.html` — question "Ты пойдешь со мной на свидание?"
- `place.html` — choice of meeting place
- `date.html` — calendar and time selection
- `final.html` — final summary page
- `styles.css` — styling
- `script.js` — interaction logic
- images: `cino.jpg`, `rest.jpg`, `bil.jpg`, `mus.jpg`, `master.jpg`, `progul.jpg`

## Run locally

Open in a browser or run:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/index.html
```

## Publish to GitHub Pages

1. Create a GitHub repository.
2. Push the contents of this folder to the repository.
3. In GitHub, open the repository settings.
4. Go to Pages.
5. Select the branch `main` (or `master`) and keep the root folder `/`.
6. Save.
7. GitHub Pages will generate a public link like:

```text
https://<your-username>.github.io/<repository-name>/
```

## Notes

- The project is a static site, so no backend is required.
- The final page has a "Copy" button for the summary text.
