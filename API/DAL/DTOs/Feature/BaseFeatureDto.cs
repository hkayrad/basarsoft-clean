using System;
using System.ComponentModel.DataAnnotations;
using API.Helpers.Resources;
using NetTopologySuite.Geometries;

namespace API.DAL.DTOs.Feature;

public class BaseFeatureDto : IValidatableObject
{
    public required string Name { get; set; }
    public required string Wkt { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrWhiteSpace(Name))
            yield return new ValidationResult(MessagesResourceHelper.GetString("NameCannotBeEmpty"), [nameof(Name)]);

        if (string.IsNullOrWhiteSpace(Name))
            yield return new ValidationResult(MessagesResourceHelper.GetString("WktCannotBeEmpty"), [nameof(Wkt)]);
    }
}
