using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static User;

namespace ForumDs.Models
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserVerification> UserVerifications { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<RepAnswer> RepAnswers { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Favorite> Favorites { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Specialization)
                .WithMany(s => s.Users)
                .HasForeignKey(u => u.Specialization_id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Question>()
                .HasOne(q => q.User)
                .WithMany(u => u.Questions)
                .HasForeignKey(q => q.User_id);

            modelBuilder.Entity<Answer>()
                .HasOne(a => a.User)
                .WithMany(u => u.Answers)
                .HasForeignKey(a => a.User_id)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.Question_id)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<RepAnswer>()
                .HasOne(r => r.User)
                .WithMany(u => u.RepAnswers)
                .HasForeignKey(r => r.User_id);

            modelBuilder.Entity<RepAnswer>()
                .HasOne(r => r.Answer)
                .WithMany(a => a.RepAnswers)
                .HasForeignKey(r => r.Answer_id);

            modelBuilder.Entity<Question>()
                .HasOne(q => q.Specialization)
                .WithMany(s => s.Questions)
                .HasForeignKey(q => q.Specialization_id);

            modelBuilder.Entity<User>()
                .HasMany(u => u.UserVerifications)
                .WithOne(uv => uv.User)
                .HasForeignKey(uv => uv.User_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserVerification>()
                .HasKey(uv => uv.User_id);

            modelBuilder.Entity<Like>()
                .HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Question)
                .WithMany(q => q.Favorites)
                .HasForeignKey(f => f.QuestionId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<User>().Property(e => e.Id);
            modelBuilder.Entity<UserVerification>().Property(e => e.User_id);
            modelBuilder.Entity<Question>().Property(e => e.Id);
            modelBuilder.Entity<Answer>().Property(e => e.Id);
            modelBuilder.Entity<RepAnswer>().Property(e => e.Id);
            modelBuilder.Entity<Specialization>().Property(e => e.Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}