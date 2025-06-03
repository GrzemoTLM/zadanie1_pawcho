# Sprawozdanie z zadania - Budowanie i publikowanie obrazu kontenera z wykorzystaniem GitHub Actions

## Cel zadania

Zadaniem było skonfigurowanie procesu CI/CD, który automatycznie buduje obraz Docker na podstawie Dockerfile'a oraz kodów źródłowych aplikacji, a następnie przeprowadza testy bezpieczeństwa (skanowanie CVE) i publikuje obraz na GitHub Container Registry (GHCR).

## Opis wykonanych etapów

### 1. Tworzenie repozytorium na GitHub

Na potrzeby zadania zostało stworzone repozytorium:

[**GrzemoTLM/zadanie1_pawcho**](https://github.com/GrzemoTLM/zadanie1_pawcho)

Repozytorium zawiera:
- Kod źródłowy aplikacji (zadanie 1)
- Dockerfile
- Konfigurację GitHub Actions (workflow YAML)

### 2. Konfiguracja GitHub Actions

W folderze `.github/workflows` został umieszczony plik konfiguracyjny `docker-publish.yml`, który definiuje następujące kroki procesu:

- Pobranie kodu (`actions/checkout`)
- Logowanie do DockerHub (dla cache obrazów)
- Logowanie do GHCR (GitHub Container Registry)
- Ustawienie środowiska do obsługi wielu architektur (`docker/setup-qemu-action` oraz `docker/setup-buildx-action`)
- Budowanie obrazu Docker z obsługą wielu architektur (linux/amd64 i linux/arm64)
- Przechowywanie cache w publicznym repozytorium DockerHub (`grzemo11/zadanie2pawcho`)
- Skanowanie CVE obrazu przy użyciu narzędzia **Trivy**
- Publikacja obrazu do GHCR wyłącznie, jeśli obraz przejdzie skanowanie bez wykrytych zagrożeń krytycznych lub wysokich

### 3. Problemy napotkane podczas realizacji

W trakcie konfiguracji wystąpiło kilka istotnych problemów:

- **Brak uprawnień tokena GITHUB_TOKEN** – pojawiał się błąd `403 Forbidden`. Pomimo ustawienia `Read and write permissions`, token nadal nie posiadał pełnych uprawnień do GHCR.

- **Rozwiązanie problemu z tokenem**:
  - Został utworzony **Personal Access Token (PAT)** z pełnym zakresem (`repo`, `write:packages`, `read:packages`) o nazwie `DOCKER_PAT`. W workflow użyto go zamiast standardowego `GITHUB_TOKEN`.

- **Problemy z podatnością biblioteki cross-spawn (CVE-2024-21538)**:
  - Trivy wykryło zagrożenie związane z biblioteką `cross-spawn` w wersji `7.0.3`, mimo iż `package.json` posiadał wersję `7.0.6`.
  - Zastosowane rozwiązanie zaczerpnięto z forum [dyskusyjnego Trivy](https://github.com/aquasecurity/trivy/discussions/8071) oraz artykułu na [Medium](https://sadewawicak25.medium.com/fixing-the-node-cross-spawn-vulnerability-cve-2024-21538-what-you-need-to-know-de25224d8ff5).
  - Dockerfile został zmodyfikowany do używania Node w wersji `20-alpine3.19`, globalnie zaktualizowano bibliotekę `cross-spawn` do wersji `7.0.5` oraz skonfigurowano dodatkowe czyszczenie cache.

### 4. Użyte tagowanie

Zastosowano następujący sposób tagowania:
- `latest` – zawsze aktualna wersja obrazu.
- `${{ github.sha }}` – specyficzna wersja obrazu odpowiadająca commitowi z repozytorium.

Taki sposób tagowania pozwala łatwo odnaleźć wersję obrazu odpowiadającą konkretnemu stanowi repozytorium oraz zapewnia, że zawsze dostępny jest najnowszy obraz pod tagiem `latest`.

### 5. Potwierdzenie działania

Workflow został uruchomiony i zakończył się powodzeniem, obraz został przesłany na GitHub Container Registry.

Potwierdzenie dostępne jest w zakładce **Actions** repozytorium:

[**[Link do actions](https://github.com/GrzemoTLM/zadanie1_pawcho/actions/runs/15420806524)**]

### Podsumowanie

Dzięki zastosowaniu narzędzi takich jak GitHub Actions, Docker Buildx oraz Trivy możliwe było automatyczne i bezpieczne przygotowanie oraz publikacja obrazu kontenera. Rozwiązano również problemy napotkane podczas konfiguracji, korzystając z zasobów społeczności oraz dokumentacji.