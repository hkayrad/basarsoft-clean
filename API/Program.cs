using System.Net;
using API.DAL;
using API.DAL.Contexts;
using API.DAL.Models;
using API.Helpers.Resources;
using API.Services;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("x-api-version")
    );
}).AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;

});

// --------------- Configure API behavior to return custom response format for validation errors
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .ToDictionary(
                x => x.Key,
                x => x.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
            );

        var response = new Response<object>
        {
            IsSuccess = false,
            Message = MessagesResourceHelper.GetString("OneOrMoreValidationErrorsOccured"),
            Data = errors,
            Status = HttpStatusCode.BadRequest
        };

        return new BadRequestObjectResult(response);
    };
});
// ---------------

builder.Services.AddCors();
builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen(config =>
{
    config.SwaggerDoc("v1", new OpenApiInfo { Title = "Basarsoft API", Version = "v1" });
});

string? postgresqlConnectionString = Environment.GetEnvironmentVariable("POSTGRESQL_CONNECTION_STRING");

if (string.IsNullOrEmpty(postgresqlConnectionString))
    throw new InvalidOperationException("POSTGRESQL_CONNECTION_STRING environment variable is not set.");

builder.Services.AddDbContext<MapInfoContext>(options =>
    options.UseNpgsql(
        postgresqlConnectionString,
        opts => opts.UseNetTopologySuite()
    )
);

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IFeaturesService, PostgresqlFeaturesService>();
builder.Services.AddScoped<IRoadsService, PostgresqlRoadsService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.MapControllers();

app.Run();
