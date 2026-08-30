using Microsoft.EntityFrameworkCore;
using HospitalBackend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// إجبار السيرفر على الاستماع للبورت 8080 المطلوب من منصة Railway
builder.WebHost.UseUrls("http://0.0.0.0:8080");

// 1. إضافة خدمات الـ Controllers والـ API Explorer
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. إعداد قاعدة البيانات مع التشخيص الذكي ومتغيرات Railway
string connectionString = "";

var host = Environment.GetEnvironmentVariable("MYSQLHOST");
var rawUrl = Environment.GetEnvironmentVariable("MYSQL_URL") ?? Environment.GetEnvironmentVariable("DATABASE_URL");

// طباعة رسائل تشخيصية في الـ Logs لترانا القيم الممررة من المنصة بدقة
Console.WriteLine($"[Railway Diagnostic] MYSQLHOST: {host ?? "NULL"}");
Console.WriteLine($"[Railway Diagnostic] MYSQL_URL exists: {!string.IsNullOrEmpty(rawUrl)}");

if (!string.IsNullOrEmpty(host))
{
    // الاعتماد على المتغيرات الفردية المباشرة من Railway
    var port = Environment.GetEnvironmentVariable("MYSQLPORT") ?? "3306";
    var database = Environment.GetEnvironmentVariable("MYSQLDATABASE") ?? "railway";
    var user = Environment.GetEnvironmentVariable("MYSQLUSER") ?? "root";
    var password = Environment.GetEnvironmentVariable("MYSQLPASSWORD");
    
    connectionString = $"Server={host};Port={port};Database={database};Uid={user};Pwd={password};SslMode=None;";
    Console.WriteLine("[Railway Diagnostic] Using individual environment variables for connection.");
}
else if (!string.IsNullOrEmpty(rawUrl))
{
    if (rawUrl.StartsWith("mysql://"))
    {
        try
        {
            var uri = new Uri(rawUrl);
            var userInfo = uri.UserInfo.Split(':');
            var user = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "root";
            var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
            var database = uri.AbsolutePath.TrimStart('/');
            var port = uri.Port > 0 ? uri.Port : 3306;
            
            connectionString = $"Server={uri.Host};Port={port};Database={database};Uid={user};Pwd={password};SslMode=None;";
            Console.WriteLine("[Railway Diagnostic] Parsed MYSQL_URL successfully.");
        }
        catch
        {
            connectionString = rawUrl;
        }
    }
    else
    {
        connectionString = rawUrl;
    }
}
else
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "";
    Console.WriteLine("[Railway Diagnostic] Using local ConnectionString from appsettings.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    try
    {
        // محاولة جلب إصدار قاعدة البيانات تلقائياً
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
    }
    catch
    {
        // نسخة احتياطية آمنة لضمان عدم توقف السيرفر أبداً في حال فشل الفحص الفوري
        options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 33)));
    }
}, ServiceLifetime.Scoped);

// 3. إعداد مصادقة JWT الآمنة
var jwtKey = builder.Configuration["Jwt:Key"] ?? "MediCore_Secret_Key_Super_Secure_2026_JWT";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "MediCoreHMS";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// 4. إعداد سياسة CORS لتسمح لجميع المصادر
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// 5. معالجة الأخطاء العالمية (Global Exception Handling)
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"message\":\"حدث خطأ داخلي في الخادم، يرجى المحاولة لاحقاً.\"}");
    });
});

// 6. تفعيل واجهة Swagger
app.UseSwagger();
app.UseSwaggerUI();

// 7. تفعيل البرمجيات الوسيطة (Middlewares) بالترتيب الهندسي الصحيح
app.UseCors("AllowAll");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// 8. ربط المساراات    
app.MapControllers();

app.Run();