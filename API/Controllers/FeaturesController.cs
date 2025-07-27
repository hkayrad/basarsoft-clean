using System.Net;
using API.DAL.DTOs.Feature;
using API.DAL.Models;
using API.Helpers.Resources;
using API.Services;
using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class FeaturesController(IFeaturesService featuresService) : ControllerBase
    {
        private readonly IFeaturesService _featureService = featuresService;

        [HttpPost]
        [MapToApiVersion("1.0")]
        public async Task<Response<int>> AddFeature(AddFeatureDto addFeatureDto)
        {
            return await _featureService.AddFeatureAsync(addFeatureDto);
        }

        [HttpPost("addRange")]
        [MapToApiVersion("1.0")]
        public async Task<Response<List<int>>> AddRangeFeatures(List<AddFeatureDto> addFeatureDtos)
        {
            return await _featureService.AddRangeFeaturesAsync(addFeatureDtos);
        }

        [HttpGet]
        [MapToApiVersion("1.0")]
        public async Task<Response<List<Feature>>> GetFeatures(
                [FromQuery(Name = "pageSize")] int? pageSize,
                [FromQuery(Name = "pageNumber")] int? pageNumber,
                [FromQuery(Name = "query")] string? query,
                [FromQuery(Name = "sortBy")] string? sortBy,
                [FromQuery(Name = "sortOrder")] string? sortOrder
                )
        {
            if (pageSize.HasValue ^ pageNumber.HasValue)
                return Response<List<Feature>>.ValidationError(MessagesResourceHelper.GetString("PageSizeAndPageNumberMustBeProvidedTogether"));

            bool isPaginated = pageSize.HasValue && pageNumber.HasValue;

            if (isPaginated)
                return await _featureService.GetPagedFeaturesAsync(pageNumber!.Value, pageSize!.Value, query, sortBy, sortOrder);
            else
                return await _featureService.GetAllFeaturesAsync(query, sortBy, sortOrder);
        }

        [HttpGet("{id}")]
        [MapToApiVersion("1.0")]
        public async Task<Response<Feature>> GetFeature(int id)
        {
            return await _featureService.GetFeatureByIdAsync(id);
        }

        [HttpPut("{id}")]
        [MapToApiVersion("1.0")]
        public async Task<Response<Feature>> UpdateFeature(int id, UpdateFeatureDto updateFeatureDto)
        {
            return await _featureService.UpdateFeatureAsync(id, updateFeatureDto);
        }

        [HttpDelete("{id}")]
        [MapToApiVersion("1.0")]
        public async Task<Response<bool>> DeleteFeature(int id)
        {
            return await _featureService.DeleteFeatureAsync(id);
        }

        [HttpGet("count")]
        [MapToApiVersion("1.0")]
        public async Task<Response<int>> GetFeatureCount([FromQuery(Name = "query")] string? query)
        {
            return await _featureService.GetFeatureCountAsync(query);
        }
    }
}
