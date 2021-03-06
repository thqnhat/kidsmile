﻿using System;
using Ecommerce.Infrastructure.Data;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Ecommerce.PhoneStore
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            var host = WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();

            using (var scope = host.Services.CreateScope())
            {
                var logger = scope.ServiceProvider.GetService<ILogger<Program>>();
                try
                {

                    logger.LogInformation("Seeding the database...");
                    var initializer = scope.ServiceProvider.GetService<EcommerceDbInitializer>();
                    initializer.SeedAsync().Wait();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to seed the database");
                }
            }

            return host;
        }
    }
}
