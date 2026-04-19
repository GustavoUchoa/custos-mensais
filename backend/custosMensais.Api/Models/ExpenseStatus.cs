using System.Text.Json.Serialization;

namespace custosMensais.Api.Models;

[JsonConverter(typeof(JsonStringEnumConverter<ExpenseStatus>))]
public enum ExpenseStatus
{
    pending = 0,
    paid = 1
}
