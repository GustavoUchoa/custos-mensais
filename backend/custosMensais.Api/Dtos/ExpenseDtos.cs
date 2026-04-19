using System.ComponentModel.DataAnnotations;
using custosMensais.Api.Models;

namespace custosMensais.Api.Dtos;

public class CreateExpenseRequest
{
    [Required]
    [MaxLength(160)]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, 999999999)]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(80)]
    public string Category { get; set; } = string.Empty;

    public DateOnly DueDate { get; set; }

    [Required]
    [RegularExpression(@"^\d{4}-\d{2}$")]
    public string ReferenceMonth { get; set; } = string.Empty;

    public ExpenseStatus Status { get; set; } = ExpenseStatus.pending;

    [MaxLength(80)]
    public string? PaymentMethod { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateExpenseRequest : CreateExpenseRequest
{
}

public class UpdateExpenseStatusRequest
{
    public ExpenseStatus Status { get; set; }
}

public class ExpenseResponse
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

    public bool IsOverdue { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}

public class MonthlySummaryResponse
{
    public decimal TotalMonth { get; set; }

    public decimal TotalPaid { get; set; }

    public decimal TotalPending { get; set; }

    public int PaidPercentage { get; set; }

    public string TopCategory { get; set; } = "Sem dados";

    public int Count { get; set; }

    public Dictionary<string, decimal> TotalsByCategory { get; set; } = new();
}
