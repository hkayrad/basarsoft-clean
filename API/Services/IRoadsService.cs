using System;
using API.DAL.Models;

namespace API.Services;

public interface IRoadsService
{
    Task<Response<List<Road>>> GetRoadsByBoundingBox(double minX, double minY, double maxX, double maxY);
}
