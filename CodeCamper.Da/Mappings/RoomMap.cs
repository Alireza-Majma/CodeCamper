using CodeCamper.Da;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeCamper.Da
{
    public class RoomMap : ClassMap<Room>
    {
        public RoomMap()
        {
            Table("Room");
            Id(x => x.Id);
            Map(x => x.Name);
        }

    }
}
