using System;
using API.DAL.Contexts;
using API.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace API.DAL.Repositories;

public class FeaturesRepository(MapInfoContext context) : GenericRepository<Feature>(context)
{
    private readonly MapInfoContext _context = context;

    public async Task<List<Feature>> GetByBoundingBoxAsync(double minX, double minY, double maxX, double maxY)
    {

        return await _context.Features.FromSql($"SELECT * FROM features WHERE wkt @ ST_MakeEnvelope({minX}, {minY}, {maxX}, {maxY}, 4326) ORDER BY id ASC LIMIT 1000 ")
            .ToListAsync();
    }
}