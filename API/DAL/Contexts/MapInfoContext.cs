using System;
using API.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace API.DAL.Contexts;

public class MapInfoContext(DbContextOptions<MapInfoContext> options) : DbContext(options)
{
    public DbSet<Feature> Features { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Feature>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("features_pk");

            entity.ToTable("features");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id")
                .HasDefaultValueSql("nextval('features_id_seq'::regclass)");
            entity.Property(e => e.Name)
                .HasColumnType("varchar(100)")
                .HasColumnName("name")
                .IsRequired();
            entity.Property(e => e.Wkt)
                .HasColumnType("geometry")
                .HasColumnName("wkt")
                .IsRequired();
        });

        modelBuilder.HasSequence("features_id_seq", "id");
    }
}
