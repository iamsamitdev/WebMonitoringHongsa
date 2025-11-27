using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Models;

namespace Hongsa.Rtms.Api.Data;

public partial class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Category { get; set; }

    public virtual DbSet<Product> Product { get; set; }

    public DbSet<MachineStatusConfig> MachineStatusConfigs { get; set; }

    public DbSet<ForecastRequest> ForecastRequests { get; set; }

    public DbSet<ForecastRequestItem> ForecastRequestItems { get; set; }

    public DbSet<ApprovedForecast> ApprovedForecasts { get; set; }

    public DbSet<DailyMaxLoadStats> DailyMaxLoadStats { get; set; }

    public DbSet<ActualMachineLoad> ActualMachineLoads { get; set; }

    public DbSet<NotificationConfig> NotificationConfigs { get; set; }
    
    public DbSet<AlertLog> AlertLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(e => e.CategoryName)
                .HasMaxLength(64)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.ProductName)
                .HasMaxLength(128)
                .IsUnicode(false);
            entity.Property(e => e.ProductPicture)
                .HasMaxLength(256)
                .IsUnicode(false);
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<MachineStatusConfig>(entity =>
        {
            entity.ToTable("MachineStatusConfig");
        });

        modelBuilder.Entity<ForecastRequest>(entity =>
        {
            entity.ToTable("ForecastRequests");
        });

        modelBuilder.Entity<ForecastRequestItem>(entity =>
        {
            entity.ToTable("ForecastRequestItems");
        });

        modelBuilder.Entity<ApprovedForecast>(entity =>
        {
            entity.ToTable("ApprovedForecasts");
        });

        modelBuilder.Entity<DailyMaxLoadStats>(entity =>
        {
            entity.ToTable("DailyMaxLoadStats");
        });

        modelBuilder.Entity<ActualMachineLoad>(entity =>
        {
            entity.ToTable("ActualMachineLoad");
        });

        modelBuilder.Entity<NotificationConfig>(entity =>
        {
            entity.ToTable("NotificationConfig");
        });

        modelBuilder.Entity<AlertLog>(entity =>
        {
            entity.ToTable("AlertLogs");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
