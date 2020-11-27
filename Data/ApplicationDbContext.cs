using CovidRequest.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace CovidRequest.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Credentials> Credentials { get; set; }
        public DbSet<Accounting> Accountings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Profile> Profiles { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { 
            Database.Migrate();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            
            // builder.ApplyConfiguration(new EventRoleReceiverConfiguration())
            builder.Entity<Credentials>()
                .HasIndex(c => new { c.Email, c.Phone })
                .IsUnique();
                
        }
    }
}