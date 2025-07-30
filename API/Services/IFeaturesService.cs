using System;
using API.DAL.DTOs.Feature;
using API.DAL.Models;

namespace API.Services;

public interface IFeaturesService
{
    Task<Response<int>> AddFeatureAsync(AddFeatureDto addFeatureDto);
    Task<Response<List<int>>> AddRangeFeaturesAsync(List<AddFeatureDto> addFeatureDtos);
    Task<Response<List<Feature>>> GetAllFeaturesAsync(string? query, string? sortBy, string? sortOrder);
    Task<Response<List<Feature>>> GetPagedFeaturesAsync(int pageNumber, int pageSize, string? query, string? sortBy, string? sortOrder);
    Task<Response<Feature>> GetFeatureByIdAsync(int id);
    Task<Response<Feature>> UpdateFeatureAsync(int id, UpdateFeatureDto updateFeatureDto);
    Task<Response<bool>> DeleteFeatureAsync(int id);
    Task<Response<int>> GetFeatureCountAsync(string? query);
    Task<Response<List<Feature>>> GetFeaturesByBoundingBox(double minX, double minY, double maxX, double maxY);
}
