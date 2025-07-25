using System;
using API.DAL.DTOs.Feature;
using API.DAL.Models;

namespace API.Services;

public interface IFeaturesService
{
    Task<Response<int>> AddFeatureAsync(AddFeatureDto addFeatureDto);
    Task<Response<List<int>>> AddRangeFeaturesAsync(List<AddFeatureDto> addFeatureDtos);
    Task<Response<List<Feature>>> GetAllFeaturesAsync();
    Task<Response<List<Feature>>> GetPagedFeaturesAsync(int pageNumber, int pageSize);
    Task<Response<Feature>> GetFeatureByIdAsync(int id);
    Task<Response<Feature>> UpdateFeatureAsync(int id, UpdateFeatureDto updateFeatureDto);
    Task<Response<bool>> DeleteFeatureAsync(int id);
    Task<Response<int>> GetFeatureCountAsync();
}
