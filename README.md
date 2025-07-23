Rode a sequencia de comandos a seguir para executar o projeto.

#### Inicia o container
`docker-compose up --build`

#### Aplica migrations iniciais
`docker-compose exec backend alembic revision --autogenerate -m "Cria tabelas exemplo"`
`docker-compose exec backend alembic upgrade head`

#### Compila projeto mobile
`npm run build-app`