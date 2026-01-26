# Lista Telefônica

Aplicação web de lista telefônica com **backend em Spring Boot** e **frontend em AngularJS + Bootstrap**. O projeto demonstra uma arquitetura em camadas no backend e boas práticas de organização no frontend.

## Visão geral

- **Backend (Spring Boot)**: API REST com camadas bem definidas (controller, service, repository e DTOs).
- **Frontend (AngularJS)**: interface web estática com serviços para comunicação com a API, filtros e validações.

## Estrutura do projeto

- `backend/`: API REST (Spring Boot)
- `frontend/`: interface web estática (AngularJS + Bootstrap)

### Backend (camadas)

- `config/`: configurações e carga inicial de dados
- `entities/`: entidades JPA do domínio
- `repository/`: interfaces de acesso a dados (Spring Data)
- `service/`: regras de negócio
- `resources/`: controllers REST (API)
- `resources/dto/`: DTOs de entrada/saída

### Frontend (principais arquivos)

- `script/app.js`: módulo AngularJS e diretiva de máscara de telefone
- `script/config/configValue.js`: configuração da URL base da API
- `script/services/*.js`: serviços HTTP (`contatosAPI`, `operadorasAPI`)
- `script/controller/listaTelefonicaCtrl.js`: controller principal
- `script/filters/nameFilter.js`: filtro para formatar nomes próprios

## Pré-requisitos

- Java 17+ (ou compatível com o `pom.xml`)
- Maven 3+
- Navegador web moderno

## Como executar

### Backend

1. Acesse o diretório `backend/`:
    ```bash
    mvn spring-boot:run
    ```
2. A API ficará disponível em `http://localhost:8080`.

### Frontend

Abra o arquivo `frontend/index.html` diretamente no navegador.

> Dica: use um servidor estático (ex.: extensão Live Server do VS Code) para evitar problemas de CORS.

## Configurações

- Backend:
   - `backend/src/main/resources/application.properties`
   - `backend/src/main/resources/application-test.properties`
- Frontend:
   - Ajuste a URL da API em `frontend/script/config/configValue.js`.
