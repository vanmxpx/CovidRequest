using System.Linq;
using CovidRequest.Data.Base;
using CovidRequest.Data;
using CovidRequest.Data.Models;

namespace CovidRequest.DataSeed
{
    public class ProfileSeeder : IDBSeeder
    {
        private readonly ApplicationDbContext context;
        private readonly IDBRepository<Profile> repository;
        public ProfileSeeder(
            ApplicationDbContext context,
            IDBRepository<Profile> repository
        )
        {
            this.context = context;
            this.repository = repository;
        }

        public void Seed()
        {
            var subs = repository.All();

            if (subs.Any())
            {
                return;
            }

            var item1 = new Profile()
            {
                FirstName = "Nikita",
                LastName = "Tsyhankov"
            };
            repository.Add(item1);

            var item2 = new Profile()
            {                
                FirstName = "Nikita2",
                LastName = "Tsyhankov2"
            };
            repository.Add(item2);

            context.SaveChanges();
        }
    }
}
