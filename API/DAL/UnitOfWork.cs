using System;
using API.DAL.Contexts;
using API.DAL.Models;
using API.DAL.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace API.DAL;

public class UnitOfWork(MapInfoContext context) : IUnitOfWork
{
    private readonly MapInfoContext _context = context;
    private IGenericRepository<Feature>? _featuresRepository;
    private IDbContextTransaction? _transaction;
    private bool _disposed = false;

    public IGenericRepository<Feature> FeaturesRepository
    {
        get
        {
            return _featuresRepository ??= new FeaturesRepository(_context);
        }
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }


    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        if (!_disposed)
        {
            _context.Dispose();
            _disposed = true;
        }
    }
}
