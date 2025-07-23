using System;
using System.Text.Json.Serialization;
using API.DAL.DTOs.Feature;
using API.Extensions;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;

namespace API.DAL.Models;

public class Feature
{
    public int Id { get; set; }
    public required string Name { get; set; }

    [JsonIgnore]
    public Geometry? Wkt { get; set; }

    [JsonPropertyName("wkt")]
    public string? WktString => Wkt?.ToWkt();
}
