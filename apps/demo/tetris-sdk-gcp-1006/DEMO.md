# Railshot SDK repair demonstration

Original game: https://github.com/jakesgordon/javascript-tetris at e5c0c42f7dac0f3514a55eff656c6e22e95d68ed (MIT, LICENSE preserved).

The original game files are unchanged. The added Dockerfile intentionally copies a nonexistent public/ directory. This is a controlled packaging-repair test: Railshot must inspect the source and build output, invoke its real agent SDK, repair the Dockerfile, pass deterministic gates, and deploy the tested image. This is not presented as an accidental upstream bug.
