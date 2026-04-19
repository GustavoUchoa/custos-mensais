using custosMensais.Api.Data;
using custosMensais.Api.Dtos;
using custosMensais.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace custosMensais.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ExpensesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<ExpenseResponse>>> GetAll(
        [FromQuery] string month,
        [FromQuery] string? category,
        [FromQuery] ExpenseStatus? status,
        [FromQuery] string? search)
    {
        if (string.IsNullOrWhiteSpace(month))
        {
            return BadRequest("Informe o mês no formato yyyy-MM.");
        }

        var query = _db.Expenses.AsNoTracking()
            .Where(expense => expense.ReferenceMonth == month);

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(expense => expense.Category == category);
        }

        if (status is not null)
        {
            query = query.Where(expense => expense.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(expense =>
                expense.Description.Contains(search) ||
                (expense.Notes != null && expense.Notes.Contains(search)));
        }

        var expenses = await query
            .OrderBy(expense => expense.DueDate)
            .Select(expense => ToResponse(expense))
            .ToListAsync();

        return Ok(expenses);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExpenseResponse>> GetById(Guid id)
    {
        var expense = await _db.Expenses.AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id);

        return expense is null ? NotFound() : Ok(ToResponse(expense));
    }

    [HttpGet("summary")]
    public async Task<ActionResult<MonthlySummaryResponse>> GetSummary([FromQuery] string month)
    {
        if (string.IsNullOrWhiteSpace(month))
        {
            return BadRequest("Informe o mês no formato yyyy-MM.");
        }

        var expenses = await _db.Expenses.AsNoTracking()
            .Where(expense => expense.ReferenceMonth == month)
            .ToListAsync();

        var totalMonth = expenses.Sum(expense => expense.Amount);
        var totalPaid = expenses
            .Where(expense => expense.Status == ExpenseStatus.paid)
            .Sum(expense => expense.Amount);
        var totalPending = totalMonth - totalPaid;
        var paidPercentage = totalMonth > 0
            ? (int)Math.Round(totalPaid / totalMonth * 100, MidpointRounding.AwayFromZero)
            : 0;
        var totalsByCategory = expenses
            .GroupBy(expense => expense.Category)
            .ToDictionary(group => group.Key, group => group.Sum(expense => expense.Amount));

        return Ok(new MonthlySummaryResponse
        {
            TotalMonth = totalMonth,
            TotalPaid = totalPaid,
            TotalPending = totalPending,
            PaidPercentage = paidPercentage,
            TopCategory = totalsByCategory.OrderByDescending(item => item.Value).FirstOrDefault().Key ?? "Sem dados",
            Count = expenses.Count,
            TotalsByCategory = totalsByCategory
        });
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseResponse>> Create(CreateExpenseRequest request)
    {
        var now = DateTime.UtcNow;
        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            Description = request.Description.Trim(),
            Amount = request.Amount,
            Category = request.Category.Trim(),
            DueDate = request.DueDate,
            ReferenceMonth = request.ReferenceMonth.Trim(),
            Status = request.Status,
            PaymentMethod = CleanOptional(request.PaymentMethod),
            Notes = CleanOptional(request.Notes),
            CreatedAt = now,
            UpdatedAt = now
        };

        _db.Expenses.Add(expense);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = expense.Id }, ToResponse(expense));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ExpenseResponse>> Update(Guid id, UpdateExpenseRequest request)
    {
        var expense = await _db.Expenses.FirstOrDefaultAsync(item => item.Id == id);
        if (expense is null)
        {
            return NotFound();
        }

        expense.Description = request.Description.Trim();
        expense.Amount = request.Amount;
        expense.Category = request.Category.Trim();
        expense.DueDate = request.DueDate;
        expense.ReferenceMonth = request.ReferenceMonth.Trim();
        expense.Status = request.Status;
        expense.PaymentMethod = CleanOptional(request.PaymentMethod);
        expense.Notes = CleanOptional(request.Notes);
        expense.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToResponse(expense));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ExpenseResponse>> UpdateStatus(Guid id, UpdateExpenseStatusRequest request)
    {
        var expense = await _db.Expenses.FirstOrDefaultAsync(item => item.Id == id);
        if (expense is null)
        {
            return NotFound();
        }

        expense.Status = request.Status;
        expense.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToResponse(expense));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var expense = await _db.Expenses.FirstOrDefaultAsync(item => item.Id == id);
        if (expense is null)
        {
            return NotFound();
        }

        _db.Expenses.Remove(expense);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static ExpenseResponse ToResponse(Expense expense)
    {
        return new ExpenseResponse
        {
            Id = expense.Id,
            Description = expense.Description,
            Amount = expense.Amount,
            Category = expense.Category,
            DueDate = expense.DueDate,
            ReferenceMonth = expense.ReferenceMonth,
            Status = expense.Status,
            PaymentMethod = expense.PaymentMethod,
            Notes = expense.Notes,
            IsOverdue = expense.Status == ExpenseStatus.pending && expense.DueDate < DateOnly.FromDateTime(DateTime.Today),
            CreatedAt = expense.CreatedAt,
            UpdatedAt = expense.UpdatedAt
        };
    }

    private static string? CleanOptional(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
