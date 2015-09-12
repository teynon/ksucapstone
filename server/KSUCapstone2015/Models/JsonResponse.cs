using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KSUCapstone2015.Models
{
    public class JsonResponse<T> where T : new()
    {
        public List<string> Errors { get; set; }

        public T Data { get; set; }

        public bool Success { get; set; }

        public int Count { get; set; }

        public JsonResponse()
        {
            Errors = new List<string>();
            Data = new T();
            Success = false;
            Count = -1;
        }

        public JsonResponse(List<string> errors, T data, bool success)
        {
            Errors = errors;
            Data = data;
            Success = success;
            Count = -1;
        }
    }
}