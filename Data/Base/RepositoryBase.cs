using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace CovidRequest.Data.Base
{
    public abstract class BaseRepository<TEntity, TContext> 
    : IDBRepository<TEntity>
    where TEntity: EntityBase, new()
    where TContext: DbContext
    {
        public DbSet<TEntity> Collection { get; }
        protected readonly ILogger _logger;
        protected readonly TContext context;

        public BaseRepository(
            TContext context,
            ILogger logger
        )
        {
            _logger = logger;
            this.context = context;
            Collection = context.Set<TEntity>();
        }

        public virtual IEnumerable<TEntity> All()
        {
            try
            {
                return Collection.ToList();
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error on get All {typeof(TEntity).FullName}s.");
                throw;
            }
        }
        public virtual TEntity Get(long id)
        {
            try
            {
                return Collection
                    .FirstOrDefault(e => e.Id == id);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error on Get {typeof(TEntity).FullName}: {id}.");
                throw;
            }
        }

        public virtual TEntity Add(TEntity entity)
        {
            try
            {
                var result = Collection.Add(entity);
                context.SaveChanges();
                return result.Entity;

            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error on Add new {typeof(TEntity).FullName}: {entity.ToString()}.");
                throw;
            }
        }

        public virtual void AddRange(IEnumerable<TEntity> entity)
        {
            try
            {
                    Collection.AddRange(entity);
                    context.SaveChanges();
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error on Add new {typeof(TEntity).FullName}: {entity.ToString()}.");
                throw;
            }
        }
        public virtual TEntity Update(TEntity entity)
        {
            try
            {
                entity = Collection.Update(entity).Entity;
                context.SaveChanges();
                return entity;
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error on Update {typeof(TEntity).FullName}: {entity.ToString()}.");
                throw;
            }
        }

        public virtual void Delete(long id)
        {
            try
            {   
                Collection.Remove(new TEntity { Id = id });
                context.SaveChanges();
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error on Delete {typeof(TEntity).FullName}: {id}.");
                throw;
            }
        }
        public virtual IEnumerable<TEntity> Find(Func<TEntity, bool> predicator)
        {
            try
            {
                return Collection.AsNoTracking().Where(predicator);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error on Find {typeof(TEntity).FullName}: {predicator.ToString()}.");
                throw;
            }
        }

        public IQueryable<TEntity> Where(Expression<Func<TEntity, bool>> predicate)
        {
            try
            {
                return Collection.AsNoTracking().Where(predicate);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error on Find {typeof(TEntity).FullName}: {predicate.ToString()}.");
                throw;
            }
        }
    }
}