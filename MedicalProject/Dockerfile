# ── Étape 1 : BUILD (compile l'app) ──────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copier les .csproj d'abord (optimise le cache Docker)
COPY TabibPlus.Core/*.csproj TabibPlus.Core/
COPY TabibPlus.Application/*.csproj TabibPlus.Application/
COPY TabibPlus.Infrastructure/*.csproj TabibPlus.Infrastructure/
COPY TabibPlus.API/*.csproj TabibPlus.API/
RUN dotnet restore TabibPlus.API/TabibPlus.API.csproj

# Copier tout le reste et publier
COPY . .
RUN dotnet publish TabibPlus.API/TabibPlus.API.csproj -c Release -o /app

# ── Étape 2 : RUNTIME (image finale, légère) ─────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# L'API écoute sur le port 8080 dans le conteneur
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "TabibPlus.API.dll"]