# Inference Atlas on RAILSHOT

This package serves the verified React frontend from `mangowhoiscloud/inference-atlas@7493d10fcad47178e741c084951bba4aa0adc8e3`. It contains the approved public JSON snapshot embedded in the frontend bundle, not private wiki source material.

The original frontend quality run [36962277972](https://github.com/mangowhoiscloud/inference-atlas/actions/runs/36962277972) passed all 11 checks, including production Chromium routes. `upstream-quality.json` records the unchanged source and each output file digest; `provenance.json` binds this package to those exact bytes. RAILSHOT separately checks and packages the static HTTP server.

Routes: `/#/globe`, `/#/wiki`, `/#/research`; readiness: `/health`. This UI does not call the SQLite lab API. No PostgreSQL, Patroni, external DB, or persistent volume is deployed by this package.
