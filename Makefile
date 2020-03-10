start:
	docker system prune
	docker-compose up --build

mm:
	docker-compose run --rm --user root backend python manage.py makemigrations

m:
	docker-compose run --rm --user root backend python manage.py migrate

fm:
	docker-compose exec --user root backend python manage.py makemigrations
	docker-compose exec --user root backend python manage.py migrate

shell:
	docker-compose exec --user root backend python manage.py shell

piplock:
	docker-compose run --rm --user root backend pipenv lock

clean_all_dockers:
	docker system prune
	docker system prune -a
