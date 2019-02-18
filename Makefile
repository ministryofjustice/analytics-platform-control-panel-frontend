HOST=0.0.0.0
PORT=3000
PROJECT=control-panel-frontend

-include .env
export

.PHONY: collectstatic dependencies help run test wait_for_db

## dependencies: Install dependencies
dependencies:
	@echo
	@echo "> Fetching dependencies..."
	@yarn install

## collectstatic: Collect assets into static folder
collectstatic:
	@echo
	@echo "> Collecting static assets..."
	@yarn run collect-static

## run: Run webapp
run:
	@echo
	@echo "> Running webapp..."
	@yarn run start

## test: Run tests
test:
	@echo
	@echo "> Running tests..."
	@yarn run test

## docker-image: Build docker image
docker-image:
	@echo
	@echo "> Building docker image..."
	@docker build -t ${PROJECT} .

help: Makefile
	@echo
	@echo " Commands in "$(PROJECT)":"
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' | sed -e 's/^/ /'
	@echo
