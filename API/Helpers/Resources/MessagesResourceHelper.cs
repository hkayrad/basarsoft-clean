using System;
using System.Resources;
using Microsoft.AspNetCore.Mvc;

namespace API.Helpers.Resources;

public static class MessagesResourceHelper
{
    private static readonly ResourceManager _resourceManager = new ResourceManager("API.Resources.Messages", typeof(MessagesResourceHelper).Assembly);

    public static string GetString(string key, params object[]? args)
    {
        var format = _resourceManager.GetString(key) ?? key;
        return args == null ? format : string.Format(format, args);
    }
}
