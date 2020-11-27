using System.Text;
using AutoMapper;
using CovidRequest.Configuration;
using CovidRequest.Configuration.Entities;
using CovidRequest.Data;
using CovidRequest.Data.Base;
using CovidRequest.Data.Models;
using CovidRequest.Data.Repository;
using CovidRequest.DataSeed;
using CovidRequest.Services.AccountService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace CovidRequest
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }
        private IConfiguration Configuration { get; }
        private IWebHostEnvironment Env { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "client/dist";
            });

            services.AddConfigurationProvider(Configuration, Env);
            services.AddScoped<IAccountService, AccountService>();
            // --- Data Base ---
            services.AddScoped<IDBSeeder, CredentialsSeeder>();
            services.AddScoped<IDBRepository<CovidRequest.Data.Models.Profile>, ProfileRepository>();
            services.AddScoped<IDBRepository<Credentials>, CredentialsRepository>();
            services.AddScoped<IDBRepository<CovRequest>, CovRequestRepository>();
            services.AddScoped<IDBRepository<Accounting>, AccountingRepository>();
            services.AddScoped<IDBRepository<Payment>, PaymentRepository>();

            if (Env.IsDevelopment())
            {
                services.AddDbContext<ApplicationDbContext>(options => {
                        // options.EnableSensitiveDataLogging();
                        options.UseSqlServer(Configuration.GetConnectionString("LocalDatabase")); 
                    }
                        // options.UseInMemoryDatabase("TestDB")
                );
            }
            else
            {
                services.AddHttpsRedirection(options =>
                {
                    options.RedirectStatusCode = StatusCodes.Status308PermanentRedirect;
                    options.HttpsPort = 443;
                });

                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("RemoteDatabase")));
            }

            // services.AddDefaultIdentity<Credentials>(options =>
            //     options.SignIn.RequireConfirmedAccount = true)
            //         .AddEntityFrameworkStores<ApplicationDbContext>();

            var jwtSettings =  Configuration.GetSection("JWTSettings").Get<JWTSettings>();
            
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(x =>
                {
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtSettings.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwtSettings.Audience,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.Secret)),
                    };
                });

            services.AddScoped(provider => new MapperConfiguration(cfg =>
            {
                // cfg.AddProfile(new EventTemplateProfile(
                //     provider.GetService<IConnectionRepository<EventRoleReceiver>>(),
                //     provider.GetService<IConnectionRepository<EventSubordinateReceiver>>())
                // );
                // cfg.AddProfile(new SubordinateProfile(
                //     provider.GetService<IConnectionRepository<SubordinateRole>>(),
                //     provider.GetService<IDataRepository<Office>>())
                // );
            }).CreateMapper());

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Covid Request API", Version = "v1" });
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.Seed();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();


            app.UseStaticFiles();

            if (!env.IsDevelopment())
            {
                app.UseCors(x => x
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                );
                app.UseSpaStaticFiles();
            }
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/auth/swagger/v1/swagger.json", "Authorizartion API V1");
            });


            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            

            
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "client";

                if (env.IsDevelopment())
                {
                    // spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}
