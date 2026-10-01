# railshot-apps

Uploaded user apps live under `apps/<tenant>/<app>/`. The manually dispatched CI workflow uses [Jasmin-Softbank/Railshot](https://github.com/Jasmin-Softbank/Railshot) at the exact commit in `PLATFORM_REF`.

The workflow checks the submitted source and configured target, runs the baseline and eligible AI repair, then publishes the exact tested image bundle. Its `published-<attempt>` artifact is the handoff to the separate CD implementation.

Before dispatch, configure the dedicated Linux CI worker, model authentication, target ID, and approved GHCR package described in [CI activation](https://github.com/Jasmin-Softbank/Railshot/blob/feature/poc-cloud-jihwan/docs/integration/ci-activation.md). `source_commit` must match the dispatched ref. Missing setup is not a successful CI or publication result.
