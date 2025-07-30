using System;
using API.DAL;
using API.DAL.Models;
using API.DAL.Repositories;
using API.Helpers.Resources;

namespace API.Services;

public class PostgresqlRoadsService(IUnitOfWork unitOfWork) : IRoadsService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<Response<List<Road>>> GetRoadsByBoundingBox(double minX, double minY, double maxX, double maxY)
    {
        if (minX >= maxX || minY >= maxY)
        {
            return Response<List<Road>>.ValidationError("Invalid bounding box coordinates.");
        }
        // Implementation for fetching roads by bounding box
        var roads = await _unitOfWork.RoadsRepository.GetByBoundingBoxAsync(minX, minY, maxX, maxY);
        return Response<List<Road>>.Success(roads, MessagesResourceHelper.GetString("RoadsFetchedSuccessfully"));
    }
}
