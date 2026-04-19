# custosMensais

Aplicação fullstack local para controle de custos mensais.

## Stack

- Frontend: React, TypeScript e Vite
- Backend: ASP.NET Core Web API
- Persistência: Entity Framework Core com SQLite
- Documentação da API: Swagger UI

## Rodar Backend

```powershell
cd "C:\Users\Gustavo Passos\OneDrive - Labsit\Documentos\Pessoal\repo\custosMensais\backend\custosMensais.Api"
dotnet run --urls http://localhost:5236
```

API:

```text
http://localhost:5236
```

Swagger:

```text
http://localhost:5236/swagger
```

## Rodar Frontend

Em outro terminal:

```powershell
cd "C:\Users\Gustavo Passos\OneDrive - Labsit\Documentos\Pessoal\repo\custosMensais\frontend"
npm install
npm run dev
```

Aplicação:

```text
http://127.0.0.1:5173/
```

## Verificar Portas

```powershell
Get-NetTCPConnection -LocalPort 5236 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
```

## Derrubar Processos Pelas Portas

```powershell
Get-NetTCPConnection -LocalPort 5236 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess }

Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess }
```

## Builds

Backend:

```powershell
dotnet build "C:\Users\Gustavo Passos\OneDrive - Labsit\Documentos\Pessoal\repo\custosMensais\custosMensais.slnx"
```

Frontend:

```powershell
cd "C:\Users\Gustavo Passos\OneDrive - Labsit\Documentos\Pessoal\repo\custosMensais\frontend"
npm run build
```
