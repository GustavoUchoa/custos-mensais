using custosMensais.Api.Models;

namespace custosMensais.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Expenses.Any())
        {
            return;
        }

        var month = DateTime.Today.ToString("yyyy-MM");
        var now = DateTime.UtcNow;

        db.Expenses.AddRange(
            new Expense
            {
                Id = Guid.NewGuid(),
                Description = "Aluguel",
                Amount = 1850,
                Category = "Moradia",
                DueDate = DateOnly.Parse($"{month}-05"),
                ReferenceMonth = month,
                Status = ExpenseStatus.paid,
                PaymentMethod = "Pix",
                Notes = "Contrato residencial",
                CreatedAt = now,
                UpdatedAt = now
            },
            new Expense
            {
                Id = Guid.NewGuid(),
                Description = "Compras do mercado",
                Amount = 740.35m,
                Category = "Alimentação",
                DueDate = DateOnly.Parse($"{month}-12"),
                ReferenceMonth = month,
                Status = ExpenseStatus.pending,
                PaymentMethod = "Cartão de crédito",
                CreatedAt = now,
                UpdatedAt = now
            },
            new Expense
            {
                Id = Guid.NewGuid(),
                Description = "Assinaturas digitais",
                Amount = 89.90m,
                Category = "Assinaturas",
                DueDate = DateOnly.Parse($"{month}-18"),
                ReferenceMonth = month,
                Status = ExpenseStatus.pending,
                CreatedAt = now,
                UpdatedAt = now
            });

        db.SaveChanges();
    }
}
