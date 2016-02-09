using CodeCamper.Da;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeCamper.Da
{
    public class TrackMap : ClassMap<Track>
    {
        public TrackMap()
        {
            Table("Track");
            Id(x => x.Id);
            Map(x => x.Name);
        }

    }
}
