using FluentNHibernate.Cfg;
using CodeCamper.Da;
using NHibernate;
using NHibernate.Cfg;
using System.IO;
using System;

namespace CodeCamper.Da
{
    public static class NHConfig
    {
        private static Configuration _configuration;
        private static ISessionFactory _sessionFactory;
        
        static ISessionFactory NHConfigFluentSqlCe(string sulPath=null)
        {
            var modelAssembly = typeof(Person).Assembly;
            //string path = @"C:\temp\CodeCamper\CodeCamper.Da\AppData";
            string appDataPath = Path.Combine(Directory.GetParent(sulPath).FullName, System.Reflection.Assembly.GetExecutingAssembly().GetName().Name, @"AppData");
            var conStr = string.Format(@"Data Source={0}\CodeCamper.sdf", appDataPath);
            //@"Data Source=|DataDirectory|\CodeCamper.sdf";
            _configuration = new NHibernate.Cfg.Configuration();

            _configuration.Properties[NHibernate.Cfg.Environment.ConnectionProvider] = "NHibernate.Connection.DriverConnectionProvider";
            _configuration.Properties[NHibernate.Cfg.Environment.Dialect] = "NHibernate.Dialect.FixedMsSqlCe40Dialect, CodeCamper.Da";
            _configuration.Properties[NHibernate.Cfg.Environment.ConnectionDriver] = "NHibernate.Driver.SqlServerCeDriver";
            //_configuration.Properties[NHibernate.Cfg.Environment.CurrentSessionContextClass] = "thread_static";
            _configuration.Properties[NHibernate.Cfg.Environment.ConnectionString] = conStr;
            _configuration.Properties[NHibernate.Cfg.Environment.ShowSql] = "true";
            _configuration.Properties[NHibernate.Cfg.Environment.DefaultBatchFetchSize] = "32";

            var factory = Fluently.Configure(_configuration);
            factory.Mappings(m => m.FluentMappings.AddFromAssembly(modelAssembly));
            //.ExposeConfiguration(cfg => new SchemaExport(cfg).Create(true, false))
            _sessionFactory = factory.BuildSessionFactory();
            return _sessionFactory;
        }

        static void NHConfigXml()
        {
            var modelAssembly = typeof(Person).Assembly;
            var conStr = @"Data Source=|DataDirectory|\CodeCamper.sdf";

            _configuration = new Configuration();
            _configuration.Properties[NHibernate.Cfg.Environment.ConnectionProvider] = "NHibernate.Connection.DriverConnectionProvider";
            _configuration.Properties[NHibernate.Cfg.Environment.Dialect] = "NHibernate.Dialect.FixedMsSqlCe40Dialect, CodeCamper.Da";
            _configuration.Properties[NHibernate.Cfg.Environment.ConnectionDriver] = "NHibernate.Driver.SqlServerCeDriver";
            _configuration.Properties[NHibernate.Cfg.Environment.ConnectionString] = conStr;//"CodeCamperConnection";
            _configuration.Properties[NHibernate.Cfg.Environment.ShowSql] = "true";
            _configuration.Properties[NHibernate.Cfg.Environment.DefaultBatchFetchSize] = "32";
            _configuration.AddAssembly(modelAssembly);  // mapping is in this assembly
            _sessionFactory = _configuration.BuildSessionFactory();
        }
        public static Configuration Configuration
        {
            get { return _configuration; }
        }

        private static object syncRoot = new Object();

        
        public static ISessionFactory GetSessionFactory(string sulPath)
        {
            if (_sessionFactory == null)
            {
                lock (syncRoot)
                {
                    if (_sessionFactory == null)
                        _sessionFactory = NHConfigFluentSqlCe(sulPath);
                }
            }
            return _sessionFactory;
        }

        public static ISession OpenSession(string sulPath = null)
        {
            ISession session = GetSessionFactory(sulPath).OpenSession();
            return session;
        }
    }
}