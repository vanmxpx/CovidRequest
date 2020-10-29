using CovidRequest.Configuration.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using CovidRequest.Configuration.Entities.Logging;
using Microsoft.AspNetCore.Hosting;

namespace CovidRequest.Configuration
{
    public static class ConfigurationExtention
    {
        public static void AddConfigurationProvider(this IServiceCollection services, IConfiguration config, IWebHostEnvironment env)
        {
            services.Configure<ConnectionStrings>(config.GetSection("ConnectionStrings"))
                .Configure<LoggingSettings>(config.GetSection("Logging"))
                .Configure<JWTSettings>(config.GetSection("JWTSettings"))
                .Configure<SMTPConnection>(config.GetSection("SMTPConnection"))
                .Configure<GoogleAuth>(config.GetSection("GoogleAuth"));
        }

        private static T GetConfiguration<T>(IConfiguration config, string Path) where T : class
        {
            return config.GetSection(Path).Get<T>();
        }

    }
}