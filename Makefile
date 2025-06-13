build:
	docker build -t docker_ter_m1 .

run:
	docker run -d -p 3000:3000 --name conteneur_ter_m1 docker_ter_m1
