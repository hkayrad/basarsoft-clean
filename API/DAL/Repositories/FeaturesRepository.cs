using System;
using API.DAL.Contexts;
using API.DAL.Models;

namespace API.DAL.Repositories;

public class FeaturesRepository(MapInfoContext context) : GenericRepository<Feature>(context) { }