# Lista Telefônica

Aplicação de exemplo de lista telefônica com backend em Spring Boot e frontend em AngularJS + Bootstrap.

## Estrutura

- `backend/`: API REST (Spring Boot)
- `frontend/`: interface web estática (AngularJS + Bootstrap)

## Pré-requisitos

- Java 17+ (ou compatível com o `pom.xml`)
- Maven 3+
- Navegador web moderno

## Como executar

### Backend

1. No diretório `backend/`:
   ```bash
   mvn spring-boot:run
   ```
2. A API ficará disponível em `http://localhost:8080`.

#### Raiz do projeto (backend)

Na raiz de `backend/` ficam os arquivos de definição do projeto:

- `pom.xml`: dependências e plugins do Maven.
- `src/main/java/`: código-fonte da aplicação.
- `src/main/resources/`: configurações e recursos.
- `target/`: artefatos gerados na build.

#### Arquitetura (camadas)

O backend segue uma arquitetura em camadas, organizada por pacotes:

- `config/`: configurações e carga inicial de dados.
- `entities/`: entidades JPA do domínio.
- `repository/`: interfaces de acesso a dados (Spring Data).
- `service/`: regras de negócio.
- `resources/`: controllers REST (API).
- `resources/dto/`: DTOs de entrada/saída da API.

### Frontend

Abra o arquivo `frontend/index.html` diretamente no navegador.

> Dica: se preferir, use um servidor estático (ex.: extensão Live Server do VS Code) para evitar problemas de CORS.

## Configurações

- `backend/src/main/resources/application.properties`
- `backend/src/main/resources/application-test.properties`

## Observações

- Caso o backend esteja rodando em outra porta, ajuste a URL base no arquivo `frontend/script/app.js`.

## Licença

Projeto para fins de estudo.
