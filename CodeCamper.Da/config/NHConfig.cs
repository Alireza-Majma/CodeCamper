using FluentNHibernate.Cfg;
using CodeCamper.Da;
using NHibernate;
using NHibernate.Cfg;

namespace CodeCamper.Da
{
    public static class NHConfig
    {
        private static Configuration _configuration;
        private static ISessionFactory _sessionFactory;

        static NHConfig()
        {
            NHConfigFluentSqlCe();
        }

        static void NHConfigFluentSqlCe()
        {
            var modelAssembly = typeof(Person).Assembly;
            string path = @"C:\temp\CodeCamper\CodeCamper.Da\AppData";
            var conStr = string.Format(@"Data Source={0}\CodeCamper.sdf", path);
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
        }

        static void NHConfigXml()
        {
            var modelAssembly = typeof(Person).Assembly;
            var conStr = @"Data Source=|DataDirectory|\CodeCamper.sdf";

            _configuration = new Configuration();
            _configuration.Properties[Environment.ConnectionProvider] = "NHibernate.Connection.DriverConnectionProvider";
            _configuration.Properties[Environment.Dialect] = "NHibernate.Dialect.FixedMsSqlCe40Dialect, CodeCamper.Da";
            _configuration.Properties[Environment.ConnectionDriver] = "NHibernate.Driver.SqlServerCeDriver";
            _configuration.Properties[Environment.ConnectionString] = conStr;//"CodeCamperConnection";
            _configuration.Properties[Environment.ShowSql] = "true";
            _configuration.Properties[Environment.DefaultBatchFetchSize] = "32";
            _configuration.AddAssembly(modelAssembly);  // mapping is in this assembly
            _sessionFactory = _configuration.BuildSessionFactory();
        }
        public static Configuration Configuration
        {
            get { return _configuration; }
        }

        public static ISession OpenSession()
        {
            ISession session = _sessionFactory.OpenSession();
            return session;
        }
    }
}