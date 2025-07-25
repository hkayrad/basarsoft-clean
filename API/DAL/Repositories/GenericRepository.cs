using System;
using Microsoft.EntityFrameworkCore;

namespace API.DAL.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly DbContext _context;
    private readonly DbSet<T> _dbSet;

    public GenericRepository(DbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _dbSet = _context.Set<T>();
    }

    public async Task<int> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        return (int)(typeof(T).GetProperty("Id")?.GetValue(entity) ?? 0); // Assuming T has an Id property
    }

    public async Task<List<int>> AddRangeAsync(List<T> entities)
    {
        await _dbSet.AddRangeAsync(entities);
        return [.. entities.Select(e => (int)(typeof(T).GetProperty("Id")?.GetValue(e) ?? 0))]; // Assuming T has an Id property
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await _dbSet.OrderBy(e => EF.Property<object>(e, "Id")).ToListAsync();
    }

    public async Task<List<T>> GetPagedAsync(int pageNumber, int pageSize)
    {
        return await _dbSet.OrderBy(e => EF.Property<object>(e, "Id")).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }


    public async Task<T> UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        return await Task.FromResult(entity); // Assuming the entity is already tracked
    }



    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
            return true;
        }

        return false;
    }

}
