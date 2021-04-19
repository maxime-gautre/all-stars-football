
fmt:
	deno fmt

lint:
	deno fmt --check
	deno lint --unstable

compile:
	mkdir -p bin
	deno compile --unstable --output bin/server mod.ts

test:
	deno test --allow-env

run:
	deno run --allow-net mod.ts
