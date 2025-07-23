using System;
using API.DAL.Models;
using API.DAL.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.DAL;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<Feature> FeaturesRepository { get; }

    Task<int> SaveChangesAsync();

    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
