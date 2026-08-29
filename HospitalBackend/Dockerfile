# مرحلة البناء
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["HospitalBackend.csproj", "./"]
RUN dotnet restore "HospitalBackend.csproj"
COPY . .
RUN dotnet publish -c Release -o /app/publish

# مرحلة التشغيل النهائية
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "HospitalBackend.dll"]