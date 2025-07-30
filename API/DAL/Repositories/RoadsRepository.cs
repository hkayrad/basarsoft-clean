using System;
using API.DAL.Contexts;
using API.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace API.DAL.Repositories;

public class RoadsRepository(MapInfoContext context) : GenericRepository<Road>(context)
{
    private readonly MapInfoContext _context = context;

    public async Task<List<Road>> GetByBoundingBoxAsync(double minX, double minY, double maxX, double maxY)
    {

        return await _context.Roads.FromSql($"SELECT * FROM roads WHERE wkt @ ST_MakeEnvelope({minX}, {minY}, {maxX}, {maxY}, 4326) ORDER BY id ASC LIMIT 2000 ")
            .ToListAsync();
    }
}