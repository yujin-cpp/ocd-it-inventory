using AutoMapper;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using OcdItInventory.Application.Mappings;

namespace OcdItInventory.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingProfile));
            services.AddMediatR(typeof(ServiceCollectionExtensions));
            
            return services;
        }
    }
}
