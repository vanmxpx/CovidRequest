using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace CovidRequest.Data.Base
{
    public interface IConnectionRepository<TEntity>

    where TEntity: class
    {
        IEnumerable<TEntity> All();
        TEntity Get(long id1, long id2);
        TEntity Add(TEntity entity);
        void AddRange(IEnumerable<TEntity> entity);
        IEnumerable<TEntity> Find(Func<TEntity, bool> predicator);
        IQueryable<TEntity> Where(Expression<Func<TEntity, bool>> predicate);
        void Update(TEntity entity);
        void Delete(long id1, long id2);
        DbSet<TEntity> Collection { get; }
    }
}