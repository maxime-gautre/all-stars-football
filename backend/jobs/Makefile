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
	deno compile --unstable --output bin/populate_players ./src/populateFootballApiPlayers/main.ts
	deno compile --unstable --output bin/transform_players ./src/transformPlayers/main.ts

test:
	deno test --allow-env

run-all:
	docker-compose -f ../docker-compose.deps.yml up -d
	sleep 2
	deno run --allow-env --allow-read --allow-net ./src/populateFootballApiPlayers/main.ts
	deno run --allow-env --allow-read --allow-net ./src/transformPlayers/main.ts

populate_players:
	docker-compose -f ../docker-compose.deps.yml up -d
	sleep 2
	deno run --allow-env --allow-read --allow-net ./src/populateFootballApiPlayers/main.ts

transform-players:
	docker-compose -f ../docker-compose.deps.yml up -d
	sleep 2
	deno run --allow-env --allow-read --allow-net ./src/transformPlayers/main.ts

clean:
	rm -rf bin/
	docker-compose -f ../docker-compose.deps.yml down
