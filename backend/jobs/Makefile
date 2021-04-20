ifneq (,$(wildcard ./.env))
    include .env
    export
endif

fmt:
	deno fmt

lint:
	deno fmt --check
	deno lint --unstable

compile:
	mkdir -p bin
	deno compile --unstable --output bin/populate_players mod.ts

test:
	deno test --allow-env

run:
	docker-compose -f ../docker-compose.deps.yml up -d
	sleep 2
	deno run --allow-env --allow-read --allow-net mod.ts

clean:
	rm -rf bin/
	docker-compose -f ../docker-compose.deps.yml down
