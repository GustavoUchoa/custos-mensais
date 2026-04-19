FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY backend/custosMensais.Api/custosMensais.Api.csproj backend/custosMensais.Api/
RUN dotnet restore backend/custosMensais.Api/custosMensais.Api.csproj
COPY backend/ backend/
RUN dotnet publish backend/custosMensais.Api/custosMensais.Api.csproj -c Release -o /app/out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["./custosMensais.Api"]
