# مرحلة البناء (Build Stage)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# نسخ ملف المشروع وعمل Restoring للحزم
COPY ["HospitalBackend/HospitalBackend.csproj", "HospitalBackend/"]
RUN dotnet restore "HospitalBackend/HospitalBackend.csproj"

# نسخ باقي الملفات وبناء المشروع
COPY . .
WORKDIR "/src/HospitalBackend"
RUN dotnet publish -c Release -o /app/out

# مرحلة التشغيل النهائية (Runtime Stage)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# تعيين المنورت والاستماع لجميع الواجهات
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "HospitalBackend.dll"]