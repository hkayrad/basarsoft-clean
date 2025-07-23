using System;
using System.Net;

namespace API.DAL.Models;

public class Response<T>
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = "";
    public T? Data { get; set; }
    public HttpStatusCode Status { get; set; }

    public static Response<T> Success(T data, string? message, HttpStatusCode status = HttpStatusCode.OK)
     => new()
     {
         IsSuccess = true,
         Data = data,
         Message = message ?? "",
         Status = status
     };

    public static Response<T> Error(string message, HttpStatusCode status = HttpStatusCode.BadRequest)
    => new()
    {
        IsSuccess = false,
        Message = message ?? "",
        Status = status
    };

    public static Response<T> UnhandledError(string message)
        => Error(message, HttpStatusCode.InternalServerError);

    public static Response<T> DbError(string message, HttpStatusCode status = HttpStatusCode.InternalServerError)
        => Error(message, status);

    public static Response<T> NotFound(string message)
        => Error(message, HttpStatusCode.NotFound);

    public static Response<T> ValidationError(string message)
        => Error(message, HttpStatusCode.UnprocessableEntity);
}
