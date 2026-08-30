using Microsoft.EntityFrameworkCore;
using HospitalBackend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// إجبار السيرفر على الاستماع للبورت 8080 المطلوب من منصة Railway
builder.WebHost.UseUrls("http://0.0.0.0:8080");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// [تحسين الأداء]: ضغط الاستجابات لتسريع نقل البيانات عبر الشبكة
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// [حماية متقدمة]: تقييد معدل الطلبات (Rate Limiting) لحماية السيرفر من الضغط والسبام
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100, // أقصى عدد طلبات مسموح به
                Window = TimeSpan.FromMinutes(1), // خلال دقيقة واحدة
                QueueLimit = 5
            }));

    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsync("{\"message\":\"تم تجاوز الحد المسموح من الطلبات، يرجى المهلة قليلاً.\"}");
    };
});

// إعداد قاعدة البيانات لـ MySQL
string connectionString = "";
var host = Environment.GetEnvironmentVariable("MYSQLHOST");
var rawUrl = Environment.GetEnvironmentVariable("MYSQL_URL") ?? Environment.GetEnvironmentVariable("DATABASE_URL");

if (!string.IsNullOrEmpty(host))
{
    var port = Environment.GetEnvironmentVariable("MYSQLPORT") ?? "3306";
    var database = Environment.GetEnvironmentVariable("MYSQLDATABASE") ?? "railway";
    var user = Environment.GetEnvironmentVariable("MYSQLUSER") ?? "root";
    var password = Environment.GetEnvironmentVariable("MYSQLPASSWORD");
    connectionString = $"Server={host};Port={port};Database={database};Uid={user};Pwd={password};SslMode=None;AllowPublicKeyRetrieval=True;";
}
else if (!string.IsNullOrEmpty(rawUrl))
{
    try
    {
        var uri = new Uri(rawUrl);
        var userInfo = uri.UserInfo.Split(':');
        var user = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "root";
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        var server = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 3306;
        var database = uri.AbsolutePath.TrimStart('/');
        
        connectionString = $"Server={server};Port={port};Database={database};Uid={user};Pwd={password};SslMode=None;AllowPublicKeyRetrieval=True;";
    }
    catch
    {
        connectionString = rawUrl;
    }
}
else
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "";
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
}, ServiceLifetime.Scoped);

// [حماية أمنية 1]: فرض وجود مفتاح JWT سري من متغيرات البيئة
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey) || jwtKey.Length < 32)
{
    throw new InvalidOperationException("Security Error: JWT_KEY must be set in environment variables and be at least 32 characters long.");
}
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "MediCoreHMS";

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

// [حماية أمنية 2]: قبول أي رابط ينتهي بـ vercel.app تلقائياً لتجنب مشاكل الهاش المتغير
builder.Services.AddCors(options =>
{
    options.AddPolicy("StrictCorsPolicy", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
              {
                  if (string.IsNullOrEmpty(origin)) return false;
                  var uri = new Uri(origin);
                  return uri.Host.EndsWith("vercel.app") || 
                         uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase) || 
                         uri.Host.Equals("127.0.0.1", StringComparison.OrdinalIgnoreCase);
              })
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// تفعيل ضغط البيانات عند الخروج
app.UseResponseCompression();

// تشغيل الـ Migrations تلقائياً عند الإقلاع
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

// [حماية أمنية 3]: معالجة مركزية وآمنة للأخطاء
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"message\":\"حدث خطأ داخلي في الخادم، يرجى المحاولة لاحقاً.\"}");
    });
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("StrictCorsPolicy");
app.UseRouting();

// تفعيل نظام تقييد الطلبات
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();