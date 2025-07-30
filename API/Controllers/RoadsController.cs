using API.DAL;
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
    public class RoadsController(IRoadsService roadsService) : ControllerBase
    {
        private readonly IRoadsService _roadsService = roadsService;

        [HttpGet]
        [MapToApiVersion("1.0")]
        public async Task<Response<List<Road>>> GetRoads(
            [FromQuery] double minX,
            [FromQuery] double minY,
            [FromQuery] double maxX,
            [FromQuery] double maxY
        )
        {
            return await _roadsService.GetRoadsByBoundingBox(minX, minY, maxX, maxY);
        }
    }
}
