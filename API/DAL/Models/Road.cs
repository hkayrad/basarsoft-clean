using System;
using System.Text.Json.Serialization;
using API.Extensions;
using NetTopologySuite.Geometries;

namespace API.DAL.Models;

public class Road
{
    public int Id { get; set; }
    public required string Name { get; set; }

    [JsonIgnore]
    public Geometry? Wkt { get; set; }

    [JsonPropertyName("wkt")]
    public string? WktString => Wkt?.ToWkt();
}
