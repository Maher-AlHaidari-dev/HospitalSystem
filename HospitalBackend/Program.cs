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

// 2. إعداد قاعدة البيانات بذكاء لتدعم متغيرات Railway بجميع صيغها تلقائياً
string connectionString = "";

var host = Environment.GetEnvironmentVariable("MYSQLHOST");
if (!string.IsNullOrEmpty(host))
{
    // الطريقة الأولى والأسرع: الاعتماد على المتغيرات الفردية التي توفرها Railway عند الربط
    var port = Environment.GetEnvironmentVariable("MYSQLPORT") ?? "3306";
    var database = Environment.GetEnvironmentVariable("MYSQLDATABASE") ?? "railway";
    var user = Environment.GetEnvironmentVariable("MYSQLUSER") ?? "root";
    var password = Environment.GetEnvironmentVariable("MYSQLPASSWORD");
    
    connectionString = $"Server={host};Port={port};Database={database};Uid={user};Pwd={password};SslMode=Preferred;";
}
else
{
    // الطريقة الثانية: معالجة رابط MYSQL_URL أو DATABASE_URL وتحويله للصيغة القياسية
    var rawUrl = Environment.GetEnvironmentVariable("MYSQL_URL") ?? Environment.GetEnvironmentVariable("DATABASE_URL");
    
    if (!string.IsNullOrEmpty(rawUrl) && rawUrl.StartsWith("mysql://"))
    {
        try
        {
            var uri = new Uri(rawUrl);
            var userInfo = uri.UserInfo.Split(':');
            var user = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "root";
            var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
            var database = uri.AbsolutePath.TrimStart('/');
            var port = uri.Port > 0 ? uri.Port : 3306;
            
            connectionString = $"Server={uri.Host};Port={port};Database={database};Uid={user};Pwd={password};SslMode=Preferred;";
        }
        catch
        {
            connectionString = rawUrl;
        }
    }
    else
    {
        // الطريقة الثالثة: التشغيل المحلي من appsettings.json
        connectionString = rawUrl ?? builder.Configuration.GetConnectionString("DefaultConnection");
    }
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)),
    ServiceLifetime.Scoped);

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

// 8. ربط المسارات
app.MapControllers();

app.Run();