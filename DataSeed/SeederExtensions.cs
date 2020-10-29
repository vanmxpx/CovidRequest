using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;


namespace CovidRequest.DataSeed
{
    public static class SeederExtensions
    {
        public async static void Seed(this IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices
                        .GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var seeders = serviceScope.ServiceProvider.GetServices<IDBSeeder>();

                foreach (IDBSeeder seeder in seeders) 
                    seeder.Seed();
                    
            }
        }
    }
}
