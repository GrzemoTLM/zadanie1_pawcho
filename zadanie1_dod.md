# Zadanie 1 - Cześć nieobowiązkowa (Wersja 2)

## Linki

- GitHub: https://github.com/grzemo11/zadanie1_pawcho
- DockerHub: https://hub.docker.com/r/grzemo11/labki

---

## Użyte instrukcje

```bash
docker buildx create --name multiarch-builder --use
docker buildx inspect --bootstrap

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t grzemo11/labki:latest \
  --push \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-to=type=registry,ref=grzemo11/labki:cache,mode=max \
  --cache-from=type=registry,ref=grzemo11/labki:cache \
  .
```

---

## Wyniki

- Obraz został zbudowany dla dwóch platform: `linux/amd64` oraz `linux/arm64`.
- Dane cache zostały zapisane w DockerHub (`grzemo11/labki:cache`).
- Obraz `grzemo11/labki:latest` został poprawnie wypchnięty.
- Wynik skanowania Trivy:

grzemo11/labki:latest (alpine 3.21.3)

Total: 0 (UNKNOWN: 0, LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0)

2025-04-29T17:14:42+02:00       INFO    Table result includes only package filenames. Use '--format json' option to get the full path to the package file.

Node.js (node-pkg)

Total: 1 (UNKNOWN: 0, LOW: 0, MEDIUM: 0, HIGH: 1, CRITICAL: 0)

┌────────────────────────────┬────────────────┬──────────┬────────┬───────────────────┬───────────────┬───────────────────────────────────────────────────┐
│          Library           │ Vulnerability  │ Severity │ Status │ Installed Version │ Fixed Version │                       Title                       │
├────────────────────────────┼────────────────┼──────────┼────────┼───────────────────┼───────────────┼───────────────────────────────────────────────────┤
│ cross-spawn (package.json) │ CVE-2024-21538 │ HIGH     │ fixed  │ 7.0.3             │ 7.0.5, 6.0.6  │ cross-spawn: regular expression denial of service │
│                            │                │          │        │                   │               │ https://avd.aquasec.com/nvd/cve-2024-21538        │
└────────────────────────────┴────────────────┴──────────┴────────┴───────────────────┴───────────────┴───────────────────────────────────────────────────┘
grzegorz@grzegorz-IdeaPad-Slim-3-15IAH8:~/Documents/Studia/Docker/zadanko1/zad1_pawcho$

### Uzasadnienie:

Podatność dotyczy biblioteki `cross-spawn`, która została zainstalowana jako zależność pośrednia przez inne paczki. Aplikacja nie korzysta z tej biblioteki bezpośrednio, a jej kod nie przetwarza wejścia użytkownika przez wyrażenia regularne. Z tego powodu zagrożenie typu ReDoS (Regular Expression Denial of Service) nie wpływa realnie na działanie aplikacji ani nie stanowi zagrożenia bezpieczeństwa.

Dlatego podatność została świadomie zignorowana.

---

