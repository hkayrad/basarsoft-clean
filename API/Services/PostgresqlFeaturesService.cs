using System;
using System.Net;
using API.DAL;
using API.DAL.DTOs.Feature;
using API.DAL.Models;
using API.Extensions;
using API.Helpers.Resources;
using Npgsql;

namespace API.Services;

public class PostgresqlFeaturesService(IUnitOfWork unitOfWork) : IFeaturesService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<Response<int>> AddFeatureAsync(AddFeatureDto addFeatureDto)
    {
        if (addFeatureDto == null)
            return Response<int>.ValidationError(MessagesResourceHelper.GetString("FeatureDataCannotBeNull"));

        try
        {
            var reader = new NetTopologySuite.IO.WKTReader();
            var newFeature = new Feature
            {
                Name = addFeatureDto.Name,
                Wkt = addFeatureDto.Wkt.ToGeometry()
            };
            await _unitOfWork.FeaturesRepository.AddAsync(newFeature);
            await _unitOfWork.SaveChangesAsync();

            return Response<int>.Success(newFeature.Id, MessagesResourceHelper.GetString("FeatureCreatedSuccessfully"));
        }
        catch (NpgsqlException ex)
        {
            return Response<int>.DbError(MessagesResourceHelper.GetString("DatabaseError", ex.Message));
        }
        catch (Exception ex)
        {
            return Response<int>.UnhandledError(MessagesResourceHelper.GetString("UnexpectedError", ex.Message));
        }
    }

    public async Task<Response<List<int>>> AddRangeFeaturesAsync(List<AddFeatureDto> addFeatureDtos)
    {
        if (addFeatureDtos == null || addFeatureDtos.Count == 0)
            return Response<List<int>>.ValidationError(MessagesResourceHelper.GetString("FeatureDataCannotBeNull"));

        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var reader = new NetTopologySuite.IO.WKTReader();
            List<Feature> features = new();

            foreach (var addFeatureDto in addFeatureDtos)
            {
                var feature = new Feature
                {
                    Name = addFeatureDto.Name,
                    Wkt = addFeatureDto.Wkt.ToGeometry()
                };
                features.Add(feature);
            }

            await _unitOfWork.FeaturesRepository.AddRangeAsync(features);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();
            
            return Response<List<int>>.Success([.. features.Select(x => x.Id)], MessagesResourceHelper.GetString("FeaturesCreatedSuccessfully"));
        }
        catch (NpgsqlException ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            return Response<List<int>>.DbError(MessagesResourceHelper.GetString("DatabaseError", ex.Message));
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            return Response<List<int>>.UnhandledError(MessagesResourceHelper.GetString("UnexpectedError", ex.Message));
        }
    }

    public async Task<Response<List<Feature>>> GetAllFeaturesAsync()
    {
        try
        {
            var features = await _unitOfWork.FeaturesRepository.GetAllAsync();
            return Response<List<Feature>>.Success([.. features], MessagesResourceHelper.GetString("FeaturesRetrievedSuccessfully"));
        }
        catch (NpgsqlException ex)
        {
            return Response<List<Feature>>.DbError(MessagesResourceHelper.GetString("DatabaseError", ex.Message));
        }
        catch (Exception ex)
        {
            return Response<List<Feature>>.UnhandledError(MessagesResourceHelper.GetString("UnexpectedError", ex.Message));
        }
    }

    public async Task<Response<Feature>> GetFeatureByIdAsync(int id)
    {
        try
        {
            var feature = await _unitOfWork.FeaturesRepository.GetByIdAsync(id);

            if (feature == null)
                return Response<Feature>.NotFound(MessagesResourceHelper.GetString("FeatureNotFound"));

            return Response<Feature>.Success(feature, MessagesResourceHelper.GetString("FeatureRetrievedSuccessfully"));
        }
        catch (NpgsqlException ex)
        {
            return Response<Feature>.DbError(MessagesResourceHelper.GetString("DatabaseError", ex.Message));
        }
        catch (Exception ex)
        {
            return Response<Feature>.UnhandledError(MessagesResourceHelper.GetString("UnexpectedError", ex.Message));
        }
    }

    public async Task<Response<List<Feature>>> GetPagedFeaturesAsync(int pageNumber, int pageSize)
    {
        if (pageNumber <= 0 || pageSize <= 0)
            return Response<List<Feature>>.ValidationError(MessagesResourceHelper.GetString("PageSizeAndPageNumberMustBeGreaterThanZero"));
        try
        {
            var features = await _unitOfWork.FeaturesRepository.GetPagedAsync(pageNumber, pageSize);
            return Response<List<Feature>>.Success([.. features], MessagesResourceHelper.GetString("FeaturesRetrievedSuccessfully"));
        }
        catch (NpgsqlException ex)
        {
            return Response<List<Feature>>.DbError(MessagesResourceHelper.GetString("DatabaseError", ex.Message));
        }
        catch (Exception ex)
        {
            return Response<List<Feature>>.UnhandledError(MessagesResourceHelper.GetString("UnexpectedError", ex.Message));
        }
    }

    public async Task<Response<Feature>> UpdateFeatureAsync(int id, UpdateFeatureDto updateFeatureDto)
    {
        if (updateFeatureDto == null)
            return Response<Feature>.ValidationError(MessagesResourceHelper.GetString("FeatureDataCannotBeNull"));

        if (id <= 0)
            return Response<Feature>.ValidationError(MessagesResourceHelper.GetString("InvalidId"));

        try
        {
            var reader = new NetTopologySuite.IO.WKTReader();
            var existingFeature = await _unitOfWork.FeaturesRepository.GetByIdAsync(id);

            if (existingFeature == null)
                return Response<Feature>.NotFound(MessagesResourceHelper.GetString("FeatureNotFound"));

            existingFeature.Name = updateFeatureDto.Name;
            existingFeature.Wkt = updateFeatureDto.Wkt.ToGeometry();

            var updatedFeature = await _unitOfWork.FeaturesRepository.UpdateAsync(existingFeature);

            await _unitOfWork.SaveChangesAsync();
            return Response<Feature>.Success(updatedFeature, MessagesResourceHelper.GetString("FeatureUpdatedSuccessfully"));
        }
        catch (NpgsqlException ex)
        {
            return Response<Feature>.DbError(MessagesResourceHelper.GetString("DatabaseError", ex.Message));
        }
        catch (Exception ex)
        {
            return Response<Feature>.UnhandledError(MessagesResourceHelper.GetString("UnexpectedError", ex.Message));
        }
    }

    public async Task<Response<bool>> DeleteFeatureAsync(int id)
    {
        if (id <= 0)
            return Response<bool>.ValidationError(MessagesResourceHelper.GetString("InvalidId"));

        try
        {
            var feature = await _unitOfWork.FeaturesRepository.GetByIdAsync(id);
            if (feature == null)
                return Response<bool>.NotFound(MessagesResourceHelper.GetString("FeatureNotFound"));

            var isDeleted = await _unitOfWork.FeaturesRepository.DeleteAsync(id);

            if (!isDeleted)
                return Response<bool>.Error(MessagesResourceHelper.GetString("FeatureDeletionFailed"));

            await _unitOfWork.SaveChangesAsync();

            return Response<bool>.Success(true, MessagesResourceHelper.GetString("FeatureDeletedSuccessfully"));
        }
        catch (NpgsqlException ex)
        {
            return Response<bool>.DbError(MessagesResourceHelper.GetString("DatabaseError", ex.Message));
        }
        catch (Exception ex)
        {
            return Response<bool>.UnhandledError(MessagesResourceHelper.GetString("UnexpectedError", ex.Message));
        }
    }
}
