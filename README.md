Rode a sequencia de comandos a seguir para executar o projeto.

`docker-compose up --build`
`docker-compose exec backend alembic revision --autogenerate -m "Cria tabelas exemplo"`
`docker-compose exec backend alembic upgrade head`