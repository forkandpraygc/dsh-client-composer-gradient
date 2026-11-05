# dsh-client-composer-gradient

[![License: MIT](https://img.shields.io/badge/license-MIT-2ea44f)](LICENSE)
[![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-client%20plugin-4f7cff)](#installation)

An animated multi-colour gradient that slowly drifts behind the prompt composer
of the DeepSeek Harness web client, with a rotating conic-gradient ring around
the field.

![Animated gradient](preview/gradient.gif)

The effect is pure CSS scoped to the composer card: no canvas, no timers, no
network requests, and no changes to the editor DOM.

## Features

- a five-stop gradient (pink → violet → blue → mint → pink) panning over 18 seconds;
- a rotating conic-gradient ring around the card, one turn every 9 seconds;
- transparent overlays, so the theme's own card colour stays in charge on both
  light and dark themes;
- `prefers-reduced-motion: reduce` freezes both animations at a pleasant frame;
- fully scoped: the stylesheet only applies under
  `<html data-dsh-composer-gradient>` and only to `[data-composer-card]`;
- zero dependencies, zero build step.

## Requirements

- DeepSeek Harness Desktop (web client) with the `desktop` profile;
- nothing else: this is a regular DSH client package.

## Installation

1. Clone this repository or download and unpack the archive.
2. Put the package into your profile.

**Windows (PowerShell):**

```powershell
$src  = "C:\path\to\dsh-client-composer-gradient"
$dest = "$env:USERPROFILE\.dsh\profiles\desktop\packages\dsh-client-composer-gradient"
New-Item -ItemType Directory -Force -Path "$dest\lib" | Out-Null
Copy-Item "$src\package.json" $dest -Force
Copy-Item "$src\lib\index.js" "$dest\lib" -Force
Copy-Item "$src\lib\client.js" "$dest\lib" -Force
```

**macOS / Linux:**

```bash
dest="$HOME/.dsh/profiles/desktop/packages/dsh-client-composer-gradient"
mkdir -p "$dest/lib"
cp package.json "$dest/"
cp lib/index.js lib/client.js "$dest/lib/"
```

3. Add an entry to `cordis.patch.yml` in the same profile
   (`%USERPROFILE%\.dsh\profiles\desktop\cordis.patch.yml` on Windows):

```yaml
- insert:
    - id: composer-gradient
      name: './packages/dsh-client-composer-gradient/lib/index.js'
```

4. The profile reloads live. If the window does not pick the plugin up, press
   `Ctrl+R` in the Harness window or restart the app.

If your profile is not named `desktop`, adjust the directory in the paths.

## Verifying

Open any chat: the prompt composer gets a soft moving gradient and a thin
animated ring. The effect also applies to the empty-state composer. If the
composer looks unchanged, check the client console for a plugin load error.

## Configuration

Everything lives in the `CSS` block in `lib/client.js`:

- **colours** — the five `rgba(...)` stops of the `linear-gradient`; raise the
  alpha values for a stronger effect;
- **gradient speed** — the `18s` duration of `dsh-cg-pan`;
- **ring speed** — the `9s` duration of `dsh-cg-spin`;
- **ring intensity** — the `2px` padding and `0.72` opacity on the `::before`
  rule; remove that whole block if you want the gradient without the ring;
- **glow** — the second `box-shadow` layer on the card.

The animations use a registered custom property (`@property --dsh-cg-angle`) so
the conic gradient can rotate smoothly; without `@property` support the ring
simply stays static.

## How it works

The package declares `dsh.client` in `package.json` (`platform: "web"`, an empty
`external` list) and exports the browser bundle as `./client`.

On activation the bundle appends one `<style>` element and sets
`data-dsh-composer-gradient` on `<html>`. Both are removed when the plugin
unloads. Every rule is scoped as
`html[data-dsh-composer-gradient] [data-composer-card]`, so nothing else in the
application is touched. `[data-composer-card]` is the stable attribute DSH puts
on the prompt card; the plugin does not query or mutate it from JavaScript.

The base card colour still comes from the theme (`--dsw-specific-input-major`);
the plugin only layers a translucent gradient image on top of it.

## Development

```bash
node preview/check.mjs
```

A browser-free check: the stylesheet is injected once, contains the expected
selectors and keyframes, the root marker is set, and disposal removes both.

`preview/mock.html` is a standalone mock of the composer card that loads the real
`lib/client.js` and applies the real CSS. Open it in a browser (the animations
can be paused at a given time with `?t=seconds`), or use it to capture the GIF.
The GIF in `preview/` was captured from that mock with headless Edge at
12 frames per second.

## Uninstall

Remove the `composer-gradient` entry from `cordis.patch.yml` and delete the
`packages/dsh-client-composer-gradient` directory.

## License

[MIT](LICENSE). This project is not affiliated with DeepSeek; "DeepSeek Harness"
is a DeepSeek product. The plugin only uses the public client-plugin API.
