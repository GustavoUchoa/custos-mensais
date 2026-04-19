using custosMensais.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace custosMensais.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Expense> Expenses => Set<Expense>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(expense => expense.Id);

            entity.Property(expense => expense.Description)
                .IsRequired()
                .HasMaxLength(160);

            entity.Property(expense => expense.Amount)
                .HasPrecision(12, 2);

            entity.Property(expense => expense.Category)
                .IsRequired()
                .HasMaxLength(80);

            entity.Property(expense => expense.ReferenceMonth)
                .IsRequired()
                .HasMaxLength(7);

            entity.Property(expense => expense.PaymentMethod)
                .HasMaxLength(80);

            entity.Property(expense => expense.Notes)
                .HasMaxLength(500);

            entity.HasIndex(expense => expense.ReferenceMonth);
            entity.HasIndex(expense => expense.Category);
            entity.HasIndex(expense => expense.Status);
        });
    }
}
