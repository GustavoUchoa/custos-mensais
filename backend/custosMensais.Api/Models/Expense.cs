namespace custosMensais.Api.Models;

public class Expense
{
    public Guid Id { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Category { get; set; } = string.Empty;

    public DateOnly DueDate { get; set; }

    public string ReferenceMonth { get; set; } = string.Empty;

    public ExpenseStatus Status { get; set; }

    public string? PaymentMethod { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
