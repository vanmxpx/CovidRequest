using System.Linq;
using CovidRequest.Data.Base;
using CovidRequest.Data;
using CovidRequest.Data.Models;

namespace CovidRequest.DataSeed
{
    public class CredentialsSeeder : IDBSeeder
    {
        private readonly ApplicationDbContext context;
        private readonly IDBRepository<Credentials> repository;
        public CredentialsSeeder(
            ApplicationDbContext context,
            IDBRepository<Credentials> repository
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

            var item1 = new Credentials()
            {
                Login = "admin",
                PersonalInfoRef = 1,
                Email = "nikita1996.tsyhankov@gmail.com",
                Password = "admin"
            };
            repository.Add(item1);

            var item2 = new Credentials()
            {
                PersonalInfoRef = 2,
                Login = "test",
                Email = "nikita1996.tsyhankov@gmail.com",
                Password = "test"
            };
            repository.Add(item2);

            context.SaveChanges();
        }
    }
}
