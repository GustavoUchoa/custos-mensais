# Custos Mensais

Aplicação fullstack para controle de custos mensais pessoais.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Backend | ASP.NET Core Web API (.NET) |
| Banco de dados | SQLite via Entity Framework Core |
| Documentação | Swagger UI |

## Pré-requisitos

- [.NET SDK](https://dotnet.microsoft.com/download) (versão usada no projeto)
- [Node.js](https://nodejs.org/) 18+

## Como rodar

### 1. Backend

```bash
cd backend/custosMensais.Api
dotnet run
```

A API sobe em `http://localhost:5236` e o Swagger em `http://localhost:5236/swagger`.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env   # ajuste a URL da API se necessário
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Variáveis de ambiente

O frontend usa um arquivo `.env` (não versionado). Copie o exemplo e ajuste se necessário:

```bash
cp frontend/.env.example frontend/.env
```

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL base da API | `http://localhost:5236/api` |

## Build

```bash
# Backend
dotnet build custosMensais.slnx

# Frontend
cd frontend && npm run build
```
