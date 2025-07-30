using System;

namespace API.DAL.Repositories;

public interface IGenericRepository<T> where T : class
{
    Task<int> AddAsync(T entity);
    Task<List<int>> AddRangeAsync(List<T> entities);
    Task<List<T>> GetAllAsync(string? query, string? sortBy, string? sortOrder);
    Task<List<T>> GetPagedAsync(int pageNumber, int pageSize, string? query, string? sortBy, string? sortOrder);
    Task<T?> GetByIdAsync(int id);
    Task<T> UpdateAsync(T entity);
    Task<bool> DeleteAsync(int id);
    Task<int> GetCountAsync(string? query);
}
